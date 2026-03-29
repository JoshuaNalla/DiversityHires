import json
import os
import io
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
        
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key or api_key == 'your_gemini_api_key_here':
         return {"error": "GEMINI_API_KEY is missing or invalid."}
         
    genai.configure(api_key=api_key)
    contents = await resume.read()
    model = genai.GenerativeModel('gemini-2.5-flash')
    prompt = 'You are an expert technical recruiter analyzing this resume. Extract the candidate\'s core skills, top 3 achievements, and suggest 3 areas to probe during an interview. Return only valid JSON directly, without markdown blocks. Follow this structure: { "skills": [], "achievements": [], "probingAreas": [] }'
    
    try:
        response = model.generate_content([
            {"mime_type": resume.content_type, "data": contents},
            prompt
        ])
    except Exception as e:
        print("Gemini Vision PDF parsing error:", str(e))
        return {"error": "Gemini was unable to read the PDF stream"}
    
    raw_text = response.text.strip()
    if raw_text.startswith("```json"):
        raw_text = raw_text[7:-3]
    elif raw_text.startswith("```"):
        raw_text = raw_text[3:-3]
        
    try:
        summary = json.loads(raw_text.strip())
        return {"success": True, "summary": summary}
    except Exception as e:
        print("Failed to parse resume JSON", e)
        return {"error": "Failed to parse resume."}

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
    
    name = current_user.get("username", "Guest") # Fallback since session uses mock User ID for now
    
    prompt = f"""You are specifically roleplaying as '{persona_type}'. You are conducting a technical interview for a {diff} {role} position at {company}.
    
    CRITICAL INSTRUCTIONS:
    1. Act perfectly in character based on '{persona_type}' (e.g. Strict & Aggressive, Warm & Mentoring, or Formal HR).
    2. Acknowledge and utilize their resume context implicitly if provided: {json.dumps(req.summary) if req.summary else 'No specific resume provided, assume generalized background.'}
    3. Spend exactly the first 1-2 dialogue turns solely focusing on standard behavioral icebreaker questions (e.g. 'Tell me about yourself' or 'How has your day been?').
    4. Gradually transition into highly precise technical and domain-specific questions matching the {role} job parameters later.
    
    Respond completely natively as the interviewer directly to the candidate, starting immediately. Generate your brief welcoming opening statement AND ONE easy initial icebreaker question right now."""
    
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
    prompt = f"You are an AI interviewer.\nCandidate Summary: {json.dumps(req.summary)}\nChat History: {json.dumps(req.history)}\n\nGenerate a thoughtful response to their last answer, and then ask ONE follow-up question. Keep it concise, natural, and conversational."
    
    response = model.generate_content(prompt)
    question_text = response.text
    audio_base64 = await generate_speech(question_text)
    
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
