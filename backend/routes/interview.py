import json
import os
import io
import re
import pandas as pd
import numpy as np
import cv2
import base64
import httpx
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, UploadFile, File
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime
from pypdf import PdfReader

from services.gemini import generate_interviewer_response, generate_performance_report
from services.elevenlabs import stream_elevenlabs_tts
from services.openclaw import send_growth_plan_email
from database.mongodb import get_db
from auth.security import get_current_user
from entities.models import InterviewSession

router = APIRouter(prefix="/api/interview", tags=["interview"])

# --- MediaPipe Initialization ---
base_options = python.BaseOptions(model_asset_path='models/face_landmarker.task')
options = vision.FaceLandmarkerOptions(
    base_options=base_options,
    output_face_blendshapes=True,
    output_facial_transformation_matrixes=True,
    num_faces=1
)
detector = vision.FaceLandmarker.create_from_options(options)

RESUME_SKILL_PATTERNS = [
    ("Python", r"\bpython\b"),
    ("Java", r"\bjava\b"),
    ("JavaScript", r"\bjavascript\b"),
    ("TypeScript", r"\btypescript\b"),
    ("React", r"\breact(?:\.js)?\b"),
    ("Next.js", r"\bnext(?:\.js)?\b"),
    ("Node.js", r"\bnode(?:\.js)?\b"),
    ("Express", r"\bexpress\b"),
    ("FastAPI", r"\bfastapi\b"),
    ("Django", r"\bdjango\b"),
    ("Flask", r"\bflask\b"),
    ("Spring", r"\bspring\b"),
    ("SQL", r"\bsql\b"),
    ("PostgreSQL", r"\bpostgres(?:ql)?\b"),
    ("MySQL", r"\bmysql\b"),
    ("MongoDB", r"\bmongodb\b"),
    ("Redis", r"\bredis\b"),
    ("AWS", r"\baws\b|\bamazon web services\b"),
    ("GCP", r"\bgcp\b|\bgoogle cloud\b"),
    ("Azure", r"\bazure\b"),
    ("Docker", r"\bdocker\b"),
    ("Kubernetes", r"\bkubernetes\b|\bk8s\b"),
    ("Terraform", r"\bterraform\b"),
    ("CI/CD", r"\bci\/cd\b|\bcontinuous integration\b"),
    ("Git", r"\bgit\b"),
    ("GraphQL", r"\bgraphql\b"),
    ("REST APIs", r"\brest(?:ful)?\b"),
    ("Machine Learning", r"\bmachine learning\b|\bml\b"),
    ("Data Analysis", r"\bdata analysis\b|\bpandas\b|\bnumpy\b"),
    ("System Design", r"\bsystem design\b|\bdistributed systems\b"),
    ("Leadership", r"\bled\b|\bmanaged\b|\bmentored\b|\bowned\b"),
]

RESUME_TOOL_PATTERNS = [
    ("React", r"\breact(?:\.js)?\b"),
    ("Next.js", r"\bnext(?:\.js)?\b"),
    ("Node.js", r"\bnode(?:\.js)?\b"),
    ("FastAPI", r"\bfastapi\b"),
    ("Django", r"\bdjango\b"),
    ("Flask", r"\bflask\b"),
    ("PostgreSQL", r"\bpostgres(?:ql)?\b"),
    ("MongoDB", r"\bmongodb\b"),
    ("Redis", r"\bredis\b"),
    ("AWS", r"\baws\b|\bamazon web services\b"),
    ("GCP", r"\bgcp\b|\bgoogle cloud\b"),
    ("Azure", r"\bazure\b"),
    ("Docker", r"\bdocker\b"),
    ("Kubernetes", r"\bkubernetes\b|\bk8s\b"),
    ("Terraform", r"\bterraform\b"),
    ("GitHub Actions", r"\bgithub actions\b"),
    ("Jenkins", r"\bjenkins\b"),
    ("Snowflake", r"\bsnowflake\b"),
    ("Tableau", r"\btableau\b"),
    ("Figma", r"\bfigma\b"),
]

ACHIEVEMENT_PATTERN = re.compile(
    r"(\b\d+(?:\.\d+)?%|\b\d+(?:,\d{3})+\b|\b\d+(?:\.\d+)?x\b|\b(?:increased|reduced|improved|cut|saved|grew|scaled|launched|built|led|owned|designed|shipped|delivered|migrated|optimized)\b)",
    re.IGNORECASE,
)

SENIORITY_PATTERNS = [
    ("Leadership and ownership", r"\bled\b|\bmanaged\b|\bowned\b|\bheaded\b"),
    ("Mentoring or coaching", r"\bmentored\b|\bcoached\b|\bonboarded\b"),
    ("Architecture influence", r"\barchitect(?:ed|ure)?\b|\bdesigned\b"),
    ("Cross-functional collaboration", r"\bcross-functional\b|\bstakeholder\b|\bpartnered with\b"),
    ("Operational responsibility", r"\bon-call\b|\bincident\b|\breliability\b"),
    ("Experience depth", r"\b\d+\+?\s+years\b"),
    ("Senior title signal", r"\bsenior\b|\bstaff\b|\bprincipal\b|\blead\b"),
]

PROBING_RULES = [
    ("React", "frontend architecture, state management, and performance tradeoffs"),
    ("Next.js", "rendering strategy, data fetching, and frontend performance"),
    ("Node.js", "API design, async behavior, and backend reliability"),
    ("FastAPI", "Python backend structure, validation, and service boundaries"),
    ("Django", "backend design choices, ORM tradeoffs, and scaling"),
    ("SQL", "data modeling, query optimization, and analytics fluency"),
    ("PostgreSQL", "schema design and query performance"),
    ("MongoDB", "document modeling and consistency tradeoffs"),
    ("AWS", "cloud architecture, deployment, and cost-awareness"),
    ("Docker", "containerization, local environments, and deploy workflows"),
    ("Kubernetes", "orchestration, scaling, and operational troubleshooting"),
    ("Machine Learning", "model choices, evaluation, and production constraints"),
    ("System Design", "scale, reliability, and tradeoff reasoning"),
]

SECTION_HEADER_PATTERN = re.compile(
    r"^(experience|work experience|education|skills|projects|summary|technical skills|certifications|awards)$",
    re.IGNORECASE,
)


def dedupe_items(items: List[str], limit: int = 8) -> List[str]:
    seen = set()
    result: List[str] = []
    for item in items:
        cleaned = re.sub(r"\s+", " ", str(item or "")).strip(" -\t\r\n")
        if not cleaned:
            continue
        lowered = cleaned.lower()
        if lowered in seen:
            continue
        seen.add(lowered)
        result.append(cleaned)
        if len(result) >= limit:
            break
    return result


def extract_json_block(raw_text: str) -> str:
    text = (raw_text or "").strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]

    match = re.search(r"\{.*\}", text, re.DOTALL)
    return match.group(0).strip() if match else text.strip()


def normalize_resume_summary(summary: Optional[dict]) -> dict:
    summary = summary or {}
    return {
        "skills": dedupe_items(summary.get("skills", []), limit=12),
        "achievements": dedupe_items(summary.get("achievements", []), limit=6),
        "probingAreas": dedupe_items(summary.get("probingAreas", []), limit=6),
        "tools": dedupe_items(summary.get("tools", []), limit=10),
        "senioritySignals": dedupe_items(summary.get("senioritySignals", []), limit=6),
        "candidateProfile": re.sub(r"\s+", " ", str(summary.get("candidateProfile", "") or "")).strip(),
    }


def merge_resume_summaries(primary: Optional[dict], fallback: Optional[dict]) -> dict:
    normalized_primary = normalize_resume_summary(primary)
    normalized_fallback = normalize_resume_summary(fallback)
    return {
        "skills": dedupe_items(normalized_primary["skills"] + normalized_fallback["skills"], limit=12),
        "achievements": dedupe_items(normalized_primary["achievements"] + normalized_fallback["achievements"], limit=6),
        "probingAreas": dedupe_items(normalized_primary["probingAreas"] + normalized_fallback["probingAreas"], limit=6),
        "tools": dedupe_items(normalized_primary["tools"] + normalized_fallback["tools"], limit=10),
        "senioritySignals": dedupe_items(normalized_primary["senioritySignals"] + normalized_fallback["senioritySignals"], limit=6),
        "candidateProfile": normalized_primary["candidateProfile"] or normalized_fallback["candidateProfile"],
    }


def extract_resume_text(contents: bytes, content_type: str = "", filename: str = "") -> str:
    text = ""
    is_pdf = (content_type or "").lower() == "application/pdf" or filename.lower().endswith(".pdf")

    if is_pdf:
        try:
            reader = PdfReader(io.BytesIO(contents))
            pages = []
            for page in reader.pages:
                page_text = page.extract_text() or ""
                if page_text.strip():
                    pages.append(page_text)
            text = "\n".join(pages)
        except Exception as exc:
            print("PDF text extraction failed:", str(exc))

    if not text.strip():
        for encoding in ("utf-8", "latin-1"):
            try:
                text = contents.decode(encoding, errors="ignore")
                if text.strip():
                    break
            except Exception:
                continue

    return re.sub(r"\n{3,}", "\n\n", text).strip()


def build_candidate_profile(lines: List[str]) -> str:
    profile_lines: List[str] = []
    for line in lines:
        cleaned = re.sub(r"\s+", " ", line).strip(" -\t\r\n")
        if not cleaned:
            continue
        if SECTION_HEADER_PATTERN.match(cleaned):
            continue
        if len(cleaned) < 3:
            continue
        profile_lines.append(cleaned)
        if len(profile_lines) >= 3:
            break
    return " | ".join(profile_lines)[:220]


def summarize_resume_heuristically(resume_text: str) -> dict:
    text = re.sub(r"[ \t]+", " ", resume_text or "").strip()
    lowered = text.lower()
    raw_lines = [line.strip(" \t\r\n-•*") for line in text.splitlines()]
    lines = [line for line in raw_lines if line]

    skills = [label for label, pattern in RESUME_SKILL_PATTERNS if re.search(pattern, lowered, re.IGNORECASE)]
    tools = [label for label, pattern in RESUME_TOOL_PATTERNS if re.search(pattern, lowered, re.IGNORECASE)]

    achievements: List[str] = []
    for line in lines:
        if len(line) < 24 or len(line) > 220:
            continue
        if ACHIEVEMENT_PATTERN.search(line):
            achievements.append(line)
    if not achievements:
        achievements = [line for line in lines if 30 <= len(line) <= 180][:4]

    seniority_signals = [label for label, pattern in SENIORITY_PATTERNS if re.search(pattern, lowered, re.IGNORECASE)]

    probing_areas = []
    for label, area in PROBING_RULES:
        if label in skills or label in tools:
            probing_areas.append(area)
    if achievements and not any("impact" in area for area in probing_areas):
        probing_areas.append("measurable impact, prioritization, and decision-making")
    if seniority_signals:
        probing_areas.append("ownership, leadership judgment, and stakeholder communication")
    if not probing_areas:
        probing_areas = [
            "core projects, hands-on depth, and decision-making",
            "problem solving under ambiguity",
        ]

    return normalize_resume_summary({
        "skills": skills,
        "achievements": achievements,
        "probingAreas": probing_areas,
        "tools": tools,
        "senioritySignals": seniority_signals,
        "candidateProfile": build_candidate_profile(lines) or "Candidate background parsed from resume text.",
    })


def get_persona_direction(persona: str) -> str:
    persona_key = (persona or "ali").lower()
    persona_map = {
        "ali": "sharp, skeptical, and high-pressure. Challenge vague claims, push for proof, and escalate quickly when the candidate sounds polished but thin on substance.",
        "martin": "calm, encouraging, and technically credible. Keep the tone warm, but still probe tradeoffs, failure points, and ownership depth.",
        "sara": "polished, structured, and hiring-manager-like. Evaluate communication, judgment, stakeholder awareness, and professionalism as much as technical depth.",
    }
    return persona_map.get(persona_key, "credible, curious, and realistic. Ask questions like an experienced interviewer rather than a chatbot.")

def extract_mediapipe_metrics(detection_result) -> dict:
    if not detection_result or not detection_result.face_landmarks:
        return {"error": "No face detected in the image."}
    
    face_landmarks = detection_result.face_landmarks[0]
    au_intensities = {}
    au_presence = {}
    
    if detection_result.face_blendshapes:
        blendshapes = detection_result.face_blendshapes[0]
        for blendshape in blendshapes:
            name = blendshape.category_name
            score = blendshape.score
            au_intensities[name] = str(score)
            au_presence[name] = "1" if score > 0.1 else "0"
            
    head_pose = {
         "rotation": {"pitch": 0.0, "yaw": 0.0, "roll": 0.0},
         "translation": {"x": 0.0, "y": 0.0, "z": 0.0}
    }
    
    if detection_result.facial_transformation_matrixes and len(detection_result.facial_transformation_matrixes) > 0:
        matrix = detection_result.facial_transformation_matrixes[0]
        tx = float(matrix[0, 3])
        ty = float(matrix[1, 3])
        tz = float(matrix[2, 3])
        
        import math
        sy = math.sqrt(matrix[0,0] * matrix[0,0] +  matrix[1,0] * matrix[1,0])
        singular = sy < 1e-6
        if not singular:
            x = math.atan2(matrix[2,1], matrix[2,2])
            y = math.atan2(-matrix[2,0], sy)
            z = math.atan2(matrix[1,0], matrix[0,0])
        else:
            x = math.atan2(-matrix[1,2], matrix[1,1])
            y = math.atan2(-matrix[2,0], sy)
            z = 0
            
        head_pose = {
            "rotation": {"pitch": math.degrees(x), "yaw": math.degrees(y), "roll": math.degrees(z)},
            "translation": {"x": tx, "y": ty, "z": tz}
        }
    
    gaze = {"angle_x": 0.0, "angle_y": 0.0}
    return {
        "success": True,
        "gaze": gaze,
        "head_pose": head_pose,
        "au_intensities": au_intensities,
        "au_presence": au_presence
    }

# --- Pydantic Models for Teammate2 Integration ---
class StartInterviewRequest(BaseModel):
    summary: Optional[dict] = None
    mock_config: Optional[dict] = None

class NextQuestionRequest(BaseModel):
    summary: Optional[dict] = None
    mock_config: Optional[dict] = None
    history: list

# --- Helper for Static TTS (ElevenLabs REST for React chat bubbles) ---
async def generate_speech(text: str, persona: str = "ali") -> str:
    # Placeholder routing to be replaced by custom Voice IDs in the future (.env)
    voice_map = {
        "ali": os.environ.get("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM"),
        "martin": os.environ.get("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM"),
        "sara": os.environ.get("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")
    }
    voice_id = voice_map.get(persona.lower(), voice_map["ali"])
    
    api_key = os.environ.get("ELEVENLABS_API_KEY", "")
    
    if not api_key or api_key == 'your_elevenlabs_api_key_here':
        print("Missing ElevenLabs API Key, returning dummy audio.")
        return None
        
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "xi-api-key": api_key,
        "Content-Type": "application/json"
    }
    data = {
        "text": text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.5
        }
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, headers=headers, json=data, timeout=30.0)
            if response.status_code != 200:
                print(f"ElevenLabs API error: {response.text}")
                return None
            return base64.b64encode(response.content).decode('utf-8')
        except Exception as e:
            print(f"ElevenLabs Error: {str(e)}")
            return None

# --- NEW Dashboard Endpoints ---
@router.get("/sessions")
async def get_sessions(current_user=Depends(get_current_user)):
    db = get_db()
    if db is None:
        return {"error": "Database not initialized"}
    
    cursor = db.interview_sessions.find({"user_id": current_user["user_id"]}).sort("created_at", -1)
    sessions = await cursor.to_list(length=50)
    for s in sessions:
        s["_id"] = str(s["_id"])
    return {"success": True, "sessions": sessions}

@router.post("/schedule")
async def schedule_interview(session_data: dict, current_user=Depends(get_current_user)):
    db = get_db()
    if db is None:
        return {"error": "Database not initialized"}
        
    session = InterviewSession(user_id=current_user["user_id"], **session_data)
    result = await db.interview_sessions.insert_one(session.dict(by_alias=True, exclude={"id"}))
    return {"success": True, "id": str(result.inserted_id)}

@router.put("/schedule/{session_id}")
async def update_scheduled_interview(session_id: str, updates: dict, current_user=Depends(get_current_user)):
    db = get_db()
    if db is None:
        return {"error": "Database not initialized"}
        
    from bson.objectid import ObjectId
    try:
        obj_id = ObjectId(session_id)
    except:
        return {"error": "Invalid session ID format"}
        
    # Prevent overwriting critical system fields
    safe_updates = { k: v for k, v in updates.items() if k not in ["_id", "id", "user_id", "created_at"] }
        
    result = await db.interview_sessions.update_one(
        {"_id": obj_id, "user_id": current_user["user_id"]},
        {"$set": safe_updates}
    )
    if result.matched_count == 0:
        return {"error": "Session not found or not authorized."}
    return {"success": True}

@router.delete("/schedule/{session_id}")
async def delete_scheduled_interview(session_id: str, current_user=Depends(get_current_user)):
    db = get_db()
    if db is None:
        return {"error": "Database not initialized"}
        
    from bson.objectid import ObjectId
    try:
        obj_id = ObjectId(session_id)
    except:
        return {"error": "Invalid session ID format"}
    
    result = await db.interview_sessions.delete_one(
        {"_id": obj_id, "user_id": current_user["user_id"]}
    )
    if result.deleted_count == 0:
        return {"error": "Session not found or not authorized."}
    return {"success": True}


# --- NEW T2 Endpoints Mapped Under /api/interview ---

@router.post("/analyze-frame")
async def analyze_frame(file: UploadFile = File(...)):
    """Analyze a webcam frame for emotion signals."""
    content = await file.read()
    nparr = np.frombuffer(content, np.uint8)
    img_cv2 = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img_cv2 is None:
        return {"error": "Failed to decode image as CV2 array."}
        
    img_rgb = cv2.cvtColor(img_cv2, cv2.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=img_rgb)
    detection_result = detector.detect(mp_image)
    results = extract_mediapipe_metrics(detection_result)
    return results

@router.post("/resume_upload")
async def upload_resume(resume: UploadFile = File(...)):
    import google.generativeai as genai
    if not resume:
        return {"error": "No resume file uploaded."}

    contents = await resume.read()
    if not contents:
        return {"error": "Uploaded resume was empty."}

    resume_text = extract_resume_text(contents, resume.content_type or "", resume.filename or "")
    if not resume_text or len(resume_text.strip()) < 40:
        return {"error": "Could not extract readable text from this resume. Please upload a text-based PDF."}

    heuristic_summary = summarize_resume_heuristically(resume_text)
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key or api_key == "your_gemini_api_key_here":
        return {"success": True, "summary": heuristic_summary, "source": "heuristic"}

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.5-flash")
    prompt = f"""
You are an expert technical recruiter reading extracted resume text.
Your job is to build an interviewer dossier that helps a mock interviewer ask realistic, personalized questions.

Return only valid JSON with this exact shape:
{{
  "skills": [],
  "achievements": [],
  "probingAreas": [],
  "tools": [],
  "senioritySignals": [],
  "candidateProfile": ""
}}

Rules:
- Use concise phrases, not paragraphs, inside arrays.
- "skills" should capture technical strengths and domain strengths.
- "achievements" should capture the strongest concrete wins, ownership moments, or measurable impact.
- "probingAreas" should be interview topics worth pressure-testing.
- "tools" should list specific technologies, platforms, and frameworks.
- "senioritySignals" should capture evidence of leadership, scale, ownership, or complexity.
- "candidateProfile" should be a 1-2 sentence summary that helps an interviewer quickly understand the candidate.
- If information is uncertain, omit it rather than inventing it.

Resume text:
\"\"\"
{resume_text[:16000]}
\"\"\"
"""

    try:
        response = model.generate_content(prompt)
        summary = json.loads(extract_json_block(response.text))
        merged_summary = merge_resume_summaries(summary, heuristic_summary)
        return {"success": True, "summary": merged_summary, "source": "gemini"}
    except Exception as e:
        print("Resume parsing fallback triggered:", str(e))
        return {"success": True, "summary": heuristic_summary, "source": "heuristic"}

@router.post("/start-interview")
async def start_interview(req: StartInterviewRequest, current_user=Depends(get_current_user)):
    import google.generativeai as genai
    api_key = os.environ.get("GEMINI_API_KEY", "")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    cfg = req.mock_config or {}
    persona_type = cfg.get("selectedPersona", "ali").capitalize()
    role = cfg.get("role", "Candidate")
    company = cfg.get("company", "our company")
    diff = cfg.get("difficulty", "Mid-Level")
    job_description = cfg.get("description", "")
    resume_context = normalize_resume_summary(req.summary or {})
    persona_direction = get_persona_direction(cfg.get("selectedPersona", "ali"))
    opening_focus = (
        "Open with a warm but concise greeting, then ask a behavioral kickoff question that references one specific detail from the candidate profile."
        if resume_context.get("candidateProfile") or resume_context.get("skills")
        else "Open with a concise greeting, then ask a sharp kickoff question that fits the role."
    )

    prompt = f"""You are roleplaying as {persona_type}, an interviewer for a {diff} {role} role at {company}.

Interviewer style:
{persona_direction}

Candidate dossier:
- Candidate profile: {resume_context.get("candidateProfile", "No resume context provided.")}
- Skills: {json.dumps(resume_context.get("skills", []))}
- Achievements: {json.dumps(resume_context.get("achievements", []))}
- Tools: {json.dumps(resume_context.get("tools", []))}
- Probing areas: {json.dumps(resume_context.get("probingAreas", []))}
- Seniority signals: {json.dumps(resume_context.get("senioritySignals", []))}

Role context:
- Job description or focus areas: {job_description[:1500] if job_description else "Not provided."}

Instructions:
1. Sound like a real interviewer on a live call, not an AI assistant.
2. Use the candidate dossier actively so the interview feels informed and specific.
3. Be creative in the questioning style. You may probe with a story prompt, a tradeoff, a debugging angle, a prioritization scenario, or a leadership angle, but still keep it believable for a real interview.
4. Do not ask multiple questions. End with exactly one clear question.
5. Keep the response to 2-4 sentences.
6. Avoid generic praise, disclaimers, or meta commentary.
7. {opening_focus}

Write the opening interviewer message now."""
    
    try:
        response = model.generate_content(prompt)
        question_text = response.text
    except Exception as e:
        question_text = "Hello! Let's get started. Could you tell me about yourself?"
        
    audio_base64 = await generate_speech(question_text, persona=persona_type)
    
    return {
        "success": True,
        "question": question_text,
        "audio": f"data:audio/mpeg;base64,{audio_base64}" if audio_base64 else None
    }

@router.post("/next-question")
async def next_question(req: NextQuestionRequest):
    import google.generativeai as genai
    api_key = os.environ.get("GEMINI_API_KEY", "")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.5-flash')
    cfg = req.mock_config or {}
    persona_type = cfg.get("selectedPersona", "ali").capitalize()
    role = cfg.get("role", "Candidate")
    company = cfg.get("company", "our company")
    diff = cfg.get("difficulty", "Mid-Level")
    job_description = cfg.get("description", "")
    persona_direction = get_persona_direction(cfg.get("selectedPersona", "ali"))
    summary = normalize_resume_summary(req.summary or {})
    recent_history = req.history[-8:] if req.history else []
    latest_candidate_answer = ""
    for item in reversed(req.history or []):
        if item.get("role") == "candidate":
            latest_candidate_answer = item.get("text", "")
            break

    prompt = f"""You are {persona_type}, conducting a live {diff} {role} interview for {company}.

Style:
{persona_direction}

Candidate dossier:
- Candidate profile: {summary.get("candidateProfile", "No resume context provided.")}
- Skills: {json.dumps(summary.get("skills", []))}
- Achievements: {json.dumps(summary.get("achievements", []))}
- Tools: {json.dumps(summary.get("tools", []))}
- Probing areas: {json.dumps(summary.get("probingAreas", []))}
- Seniority signals: {json.dumps(summary.get("senioritySignals", []))}

Role context:
- Job description or focus areas: {job_description[:1500] if job_description else "Not provided."}

Recent chat history:
{json.dumps(recent_history)}

Latest candidate answer:
{latest_candidate_answer}

Instructions:
1. React to what the candidate just said. The next question should feel earned.
2. If the answer was vague, ask for specifics, ownership, metrics, tradeoffs, or failure points.
3. If the answer was strong, raise the bar with a tougher follow-up grounded in their resume or the role.
4. Use varied interviewer moves. Ask about architecture, debugging, stakeholder judgment, prioritization, conflict, measurement, or lessons learned when appropriate.
5. Ask exactly one question, with no bullet points.
6. Keep it natural, concise, and human. 1-3 sentences max.
7. Never say you are an AI interviewer.
"""

    try:
        response = model.generate_content(prompt)
        question_text = response.text
    except Exception as e:
        print(f"Gemini next-question error: {str(e)}")
        question_text = "Thanks. Pick one concrete example from your experience and walk me through what you owned, the tradeoff you faced, and the result."

    try:
        audio_base64 = await generate_speech(question_text)
    except Exception as e:
        print(f"ElevenLabs next-question audio error: {str(e)}")
        audio_base64 = None
    
    return {
        "success": True,
        "question": question_text,
        "audio": f"data:audio/mpeg;base64,{audio_base64}" if audio_base64 else None
    }

# --- Original Endpoints ---
@router.websocket("/ws")
async def websocket_interview_endpoint(websocket: WebSocket):
    await websocket.accept()
    chat_history: List[Dict[str, str]] = []
    aggregated_biometrics = []
    full_transcript = []

    try:
        while True:
            data_str = await websocket.receive_text()
            data = json.loads(data_str)
            user_text = data.get("text", "")
            biometrics = data.get("biometrics", {})
            if biometrics:
                aggregated_biometrics.append(biometrics)
            
            full_transcript.append({"role": "user", "text": user_text})
            ai_text_response = await generate_interviewer_response(chat_history, user_text)
            
            chat_history.append({"role": "user", "parts": [user_text]})
            chat_history.append({"role": "model", "parts": [ai_text_response]})
            full_transcript.append({"role": "model", "text": ai_text_response})
            
            await websocket.send_text(json.dumps({"transcript": ai_text_response, "isAudio": False}))
            await stream_elevenlabs_tts(ai_text_response, websocket)
    except WebSocketDisconnect:
        pass

@router.post("/finalize/{interview_id}")
async def finalize_interview(interview_id: str, db=Depends(get_db)):
    dummy_transcript = "User: I am proficient in Python. AI: Great, what are generators?"
    dummy_biometrics = "Avg Confidence: 85%, High AU04 (furrowed brow) during tech questions."
    report_json_str = await generate_performance_report(dummy_transcript, dummy_biometrics)
    try:
        report_data = json.loads(report_json_str)
    except:
        report_data = {"performance_score": 80, "confidence_score": 75, "detailed_feedback": report_json_str}
    target_email = "candidate@example.com" 
    email_sent = await send_growth_plan_email(target_email, report_data.get("detailed_feedback", ""))

    return {
        "message": "Interview finalized.",
        "report": report_data,
        "email_dispatched": email_sent
    }
