import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from typing import List, Dict
from services.gemini import generate_interviewer_response, generate_performance_report
from services.elevenlabs import stream_elevenlabs_tts
from services.openclaw import send_growth_plan_email
from database.mongodb import get_db

router = APIRouter(prefix="/api/interview", tags=["interview"])

@router.websocket("/ws")
async def websocket_interview_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    # Store session-specific chat history
    chat_history: List[Dict[str, str]] = []
    
    # Aggregate biometrics here during the WS session
    aggregated_biometrics = []
    full_transcript = []

    try:
        while True:
            # 1. Receive User payload (Expecting JSON with user transcription and latest OpenFace biometrics)
            data_str = await websocket.receive_text()
            data = json.loads(data_str)
            
            user_text = data.get("text", "")
            biometrics = data.get("biometrics", {}) # OpenFace AUs, confidence, etc.
            
            if biometrics:
                aggregated_biometrics.append(biometrics)
            
            full_transcript.append({"role": "user", "text": user_text})

            # 2. Get AI Response via Gemini given chat history
            # Note: A smarter implementation passes current biometrics as context to the API
            ai_text_response = await generate_interviewer_response(chat_history, user_text)
            
            # Update local memory
            chat_history.append({"role": "user", "parts": [user_text]})
            chat_history.append({"role": "model", "parts": [ai_text_response]})
            full_transcript.append({"role": "model", "text": ai_text_response})
            
            # 3. Stream AI Text Response back to WebSockets (So UI can display transcript immediately)
            await websocket.send_text(json.dumps({"transcript": ai_text_response, "isAudio": False}))

            # 4. Stream Audio via ElevenLabs to the same WebSocket
            # The client should know how to distinguish text packets from audio base64 packets.
            await stream_elevenlabs_tts(ai_text_response, websocket)

    except WebSocketDisconnect:
        # User disconnected, finalize session if needed
        print("Interview WebSocket disconnected.")
        # E.g., Save full_transcript and aggregated_biometrics to MongoDB here.
        # This can also trigger the background Evaluation Report generation.
        pass

@router.post("/finalize/{interview_id}")
async def finalize_interview(interview_id: str, db=Depends(get_db)):
    """
    Endpoint called when the user clicks 'End Interview'.
    Pulls data from DB, asks Gemini for the Confidence/Performance Report,
    and dispatches the OpenClaw agent email.
    """
    # Placeholder for database retrieval
    # transcript = await db["interviews"].find_one({"_id": interview_id}).get("transcript")
    dummy_transcript = "User: I am proficient in Python. AI: Great, what are generators?"
    dummy_biometrics = "Avg Confidence: 85%, High AU04 (furrowed brow) during tech questions."

    # 1. Generate Report
    report_json_str = await generate_performance_report(dummy_transcript, dummy_biometrics)
    
    # Simple parse
    try:
        report_data = json.loads(report_json_str)
    except:
        report_data = {"performance_score": 80, "confidence_score": 75, "detailed_feedback": report_json_str}

    # 2. Trigger autonomous email via OpenClaw
    # Assuming user email is known, e.g., fetched from DB
    target_email = "candidate@example.com" 
    email_sent = await send_growth_plan_email(target_email, report_data.get("detailed_feedback", ""))

    return {
        "message": "Interview finalized.",
        "report": report_data,
        "email_dispatched": email_sent
    }
