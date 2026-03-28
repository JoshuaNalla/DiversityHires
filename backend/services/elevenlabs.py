import os
import json
import base64
import websockets
from fastapi import WebSocket

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
VOICE_ID = "21m00Tcm4TlvDq8ikWAM" # Rachael - standard ID for testing

async def stream_elevenlabs_tts(text: str, client_ws: WebSocket):
    """
    Connects to ElevenLabs WebSocket API, streams TTS chunks back to the client.
    Because of hackathon time constraints, we use the v1 websocket endpoint for ultra-low latency.
    """
    if not ELEVENLABS_API_KEY:
        print("Warning: No ElevenLabs API key, returning dummy stream.")
        await client_ws.send_text(json.dumps({"audio_base64": "", "isFinal": True}))
        return

    uri = f"wss://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}/stream-input?model_id=eleven_monolingual_v1"
    
    try:
        async with websockets.connect(uri) as ws:
            # Initial configuration
            bos_message = {
                "text": " ",
                "voice_settings": {
                    "stability": 0.5,
                    "similarity_boost": 0.8
                },
                "xi_api_key": ELEVENLABS_API_KEY,
            }
            await ws.send(json.dumps(bos_message))

            # Send actual text
            await ws.send(json.dumps({"text": text}))
            
            # Send End of Stream
            await ws.send(json.dumps({"text": ""}))
            
            # Receive audio chunks and forward to connected client
            while True:
                response = await ws.recv()
                data = json.loads(response)
                
                if data.get("audio"):
                    # Forward base64 audio chunk to frontend
                    await client_ws.send_text(json.dumps({"audio_base64": data["audio"], "isFinal": False}))
                
                if data.get("isFinal"):
                    await client_ws.send_text(json.dumps({"audio_base64": "", "isFinal": True}))
                    break

    except Exception as e:
        print(f"ElevenLabs WebSocket error: {e}")
        await client_ws.send_text(json.dumps({"error": str(e)}))
