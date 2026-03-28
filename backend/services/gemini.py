import os
import google.generativeai as genai
from typing import List, Dict

# Assumes GEMINI_API_KEY is available in env
genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))

INTERVIEWER_PROMPT = """
You are a Senior Technical Interviewer for a prestigious tech company.
Conduct a mock interview with the candidate. Ask them technical questions.
Keep your responses very concise (under 2 sentences) and conversational to mimic a real fast-paced video interview.
Analyze their responses carefully and adjust loop difficulty accordingly.
"""

# Configure a system-instructed Gemini model.
def get_interviewer_model():
    return genai.GenerativeModel(
        model_name='gemini-2.5-flash',
        system_instruction=INTERVIEWER_PROMPT,
    )

async def generate_interviewer_response(chat_history: List[Dict[str, str]], user_message: str):
    """
    Simulates a chat turn. `chat_history` must follow Gemini format: 
    [{"role": "user", "parts": ["text"]}, {"role": "model", "parts": ["text"]}]
    """
    model = get_interviewer_model()
    # Simplified chat history inject for speed in hackathon.
    # We create a new chat object padded with history.
    chat = model.start_chat(history=chat_history)
    response = chat.send_message(user_message)
    return response.text

async def generate_performance_report(transcript: str, biometric_data: str):
    """
    Generates a 'Confidence vs Performance' matching report.
    """
    model = genai.GenerativeModel(model_name='gemini-2.5-flash')
    prompt = f"""
    Analyze this candidate's interview performance.
    
    TRANSCRIPT:
    {transcript}
    
    BIOMETRIC DATA (Action Units, Head Pose, Confidence averages during answers):
    {biometric_data}
    
    Provide a final Evaluation Report. 
    1. Assess technical performance (1-100).
    2. Assess apparent confidence (1-100).
    3. Provide a detailed final feedback summary discussing how their physical cues correlated with their verbal answers.
    Output only JSON with keys: performance_score, confidence_score, detailed_feedback.
    """
    response = model.generate_content(prompt)
    return response.text
