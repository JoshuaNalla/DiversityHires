import { useState, useRef, useCallback } from 'react';

export function useElevenLabsSTT(apiKey) {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  
  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const startSTT = useCallback(async () => {
    if (!apiKey) {
      setError("ElevenLabs API Key is missing. Please provide it in the .env file.");
      return;
    }
    
    try {
      // 1. Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // 2. Open WebSocket
      // Depending on the exact ElevenLabs Speech-to-Text endpoint you have access to.
      // E.g. for Scribe Realtime:
      const wsUrl = `wss://api.elevenlabs.io/v1/speech-to-text/realtime?api_key=${apiKey}`;
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setIsRecording(true);
        setError(null);
        setTranscript("Listening...");
        
        // 3. Start MediaRecorder
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm'
        });
        
        mediaRecorder.ondataavailable = async (event) => {
          if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            // Send binary blob directly or base64 encode depending on API specs.
            // Scribe often accepts binary over WebSocket.
            ws.send(event.data);
          }
        };

        mediaRecorder.start(250); // Send chunks every 250ms
        mediaRecorderRef.current = mediaRecorder;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.text) {
             setTranscript((prev) => prev === "Listening..." ? data.text : prev + " " + data.text);
          }
        } catch (err) {
          console.warn("Could not parse STT message:", event.data);
        }
      };

      ws.onerror = (err) => {
        console.error("ElevenLabs STT Socket Error:", err);
        setError("WebSocket error observing ElevenLabs STT API");
      };

      ws.onclose = () => {
        setIsRecording(false);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
      };

    } catch (err) {
      console.error("Failed to start STT:", err);
      setError(err.message);
    }
  }, [apiKey]);

  const stopSTT = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (socketRef.current) {
      socketRef.current.close();
    }
    setIsRecording(false);
  }, []);

  return { transcript, isRecordingSTT: isRecording, errorSTT: error, startSTT, stopSTT };
}
