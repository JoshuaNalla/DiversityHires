import { useState, useRef, useCallback } from 'react';
import { Scribe, RealtimeEvents } from '@elevenlabs/client';

const DEFAULT_MODEL_ID = import.meta.env.VITE_ELEVENLABS_MODEL_ID || 'scribe_v2_realtime';

function formatElevenLabsError(err) {
  if (!err) return 'Unknown error';
  if (typeof err === 'string') return err;

  const reason = err.message || err.reason || err.error || err.type;
  if (reason) return reason;

  try {
    return JSON.stringify(err);
  } catch {
    return 'Unknown error';
  }
}

function joinTranscriptParts(committedText, partialText = '') {
  return [committedText.trim(), partialText.trim()].filter(Boolean).join(' ').trim();
}

export function useElevenLabsSTT(apiKey) {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  
  const connectionRef = useRef(null);
  const committedTranscriptRef = useRef('');

  const startSTT = useCallback(async () => {
    if (!apiKey) {
      setError("ElevenLabs API Key is missing. Please provide it in the .env file.");
      return;
    }

    if (connectionRef.current) {
      connectionRef.current.close();
      connectionRef.current = null;
    }
    
    try {
      committedTranscriptRef.current = '';
      setTranscript('Connecting to ElevenLabs...');
      setError(null);

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsHost = `${protocol}//${window.location.host}/api/elevenlabs-ws`;

      const connection = Scribe.connect({
        token: "proxy-injected-token", // The actual xi-api-key is injected server-side by the Vite proxy
        baseUri: wsHost,
        modelId: "scribe_v1", // Scribe model must be scribe_v1 string for the STT system
        microphone: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      connection.on(RealtimeEvents.SESSION_STARTED, () => {
        setIsRecording(true);
        setError(null);
        setTranscript(committedTranscriptRef.current || 'Listening...');
      });

      connection.on(RealtimeEvents.PARTIAL_TRANSCRIPT, (data) => {
        const partialText = data?.text || '';
        const nextTranscript = joinTranscriptParts(committedTranscriptRef.current, partialText);
        setTranscript(nextTranscript || 'Listening...');
      });

      connection.on(RealtimeEvents.COMMITTED_TRANSCRIPT, (data) => {
        const committedText = data?.text?.trim();
        if (!committedText) return;

        committedTranscriptRef.current = joinTranscriptParts(committedTranscriptRef.current, committedText);
        setTranscript(committedTranscriptRef.current);
      });

      connection.on(RealtimeEvents.ERROR, (err) => {
        console.error('ElevenLabs SDK Error:', err);
        setIsRecording(false);
        setError(`ElevenLabs STT Error: ${formatElevenLabsError(err)}`);
      });

      connection.on(RealtimeEvents.AUTH_ERROR, (err) => {
        console.error('ElevenLabs auth error:', err);
        setIsRecording(false);
        setError(`ElevenLabs auth error: ${formatElevenLabsError(err)}`);
      });

      connection.on(RealtimeEvents.CLOSE, () => {
        setIsRecording(false);
        connectionRef.current = null;
      });

      connectionRef.current = connection;
    } catch (err) {
      console.error('Failed to start STT:', err);
      setIsRecording(false);
      setError(formatElevenLabsError(err));
      setTranscript('');
    }
  }, [apiKey]);

  const stopSTT = useCallback(() => {
    if (connectionRef.current) {
      connectionRef.current.close();
      connectionRef.current = null;
    }
    setIsRecording(false);
  }, []);

  return { transcript, isRecordingSTT: isRecording, errorSTT: error, startSTT, stopSTT };
}
