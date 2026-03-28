import os
import httpx

OPENCLAW_API_KEY = os.getenv("OPENCLAW_API_KEY", "")

async def send_growth_plan_email(email_address: str, evaluation_report: str):
    """
    Submits a task to the OpenClaw agent network to autonomously draft and send a follow-up
    email to the candidate with their 'Growth Plan'.
    """
    if not OPENCLAW_API_KEY:
        print("Warning: No OpenClaw API key, simulating autonomous task submission.")
        return True

    url = "https://api.openclaw.com/v1/agent/task"
    headers = {
        "Authorization": f"Bearer {OPENCLAW_API_KEY}",
        "Content-Type": "application/json"
    }

    prompt = f"""
    Act as an autonomous recruiter agent. Based on the following technical evaluation, send an 
    encouraging but critical "Growth Plan" email to {email_address}.
    
    Report:
    {evaluation_report}
    """

    payload = {
        "agent": "email_bot_v2",
        "task_prompt": prompt,
        "parameters": {
            "to": email_address,
            "subject": "IntervAI: Your Interview Growth Plan"
        }
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=headers)
            response.raise_for_status()
            return True
    except Exception as e:
        print(f"Failed to submit task to OpenClaw: {e}")
        return False
