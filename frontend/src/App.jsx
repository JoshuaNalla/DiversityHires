import { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, Mic, Square, Activity, Eye, MessageSquareText } from 'lucide-react';
import { useElevenLabsSTT } from './useElevenLabsSTT';
import './index.css';

// You will provide the ElevenLabs API Key via environment variable or input later
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || "";

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [metrics, setMetrics] = useState(null);
  
  const { transcript, isRecordingSTT, errorSTT, startSTT, stopSTT } = useElevenLabsSTT(ELEVENLABS_API_KEY);

  // Start webcam and mic
  const startMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
        audio: true
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsRecording(true);
      setErrorMsg("");
      
      // Start STT explicitly
      await startSTT();
    } catch (err) {
      setErrorMsg("Failed to access camera and microphone.");
      console.error(err);
    }
  };

  const stopMedia = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    stopSTT();
  };

  const captureAndAnalyze = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isRecording) return;
    
    // Draw current video frame to canvas
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to blob and upload to backend
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const formData = new FormData();
      formData.append('file', blob, 'frame.jpg');

      try {
        const response = await fetch('http://localhost:8000/analyze-frame', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        
        if (data && data.success) {
          setMetrics(data);
        }
      } catch (err) {
        console.warn("Backend analysis failed:", err);
      }
    }, 'image/jpeg', 0.8);
  }, [isRecording]);

  // Handle frame polling
  useEffect(() => {
    let intervalId;
    if (isRecording) {
      intervalId = setInterval(captureAndAnalyze, 1000); // Poll every 1 second
    }
    return () => clearInterval(intervalId);
  }, [isRecording, captureAndAnalyze]);

  // Display Action Units (Now MediaPipe Blendshapes)
  const renderAUs = () => {
    if (!metrics || !metrics.au_intensities) return <p className="text-gray-400">No Action Unit data</p>;
    
    // Filter and show meaningful / highest Blendshapes (MediaPipe bounds are 0.0 to 1.0)
    return Object.entries(metrics.au_intensities)
      .filter(([key, val]) => parseFloat(val) > 0.1 && !key.toLowerCase().includes('neutral')) // ignore low confidence and neutral state
      .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1])) // Sort descending
      .slice(0, 6) // limit to top 6
      .map(([key, val]) => {
        // Convert camelCase like 'eyeBlinkLeft' to 'Eye Blink Left'
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        const percentage = (parseFloat(val) * 100).toFixed(1);
        
        return (
          <div key={key} className="au-item">
            <div className="au-label">
              <span>{label}</span>
              <span>{percentage}%</span>
            </div>
            <div className="au-bar-container">
              <div className="au-bar" style={{ width: `${percentage}%` }}></div>
            </div>
          </div>
        );
      });
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>OmniSense MVP</h1>
        <div className="controls">
          {!isRecording ? (
            <button className="btn" onClick={startMedia}>
              <Camera size={18} /> Start Processing
            </button>
          ) : (
            <button className="btn danger" onClick={stopMedia}>
             <Square size={18} /> Stop
            </button>
          )}
        </div>
      </header>

      <main className="camera-section">
        {errorMsg && <div style={{color:'red'}}>{errorMsg}</div>}
        <div className="video-container">
          <video 
            ref={videoRef} 
            className={`video-element ${!isRecording ? 'hidden' : ''}`}
            autoPlay 
            playsInline 
            muted 
          />
          {!isRecording && (
            <div style={{color: '#64748b', textAlign: 'center'}}>
              <Camera size={48} style={{margin: '0 auto 1rem', opacity: 0.5}} />
              <p>Camera is currently off</p>
            </div>
          )}
          {isRecording && (
            <div className="status-overlay">
              <div className="dot"></div> Live Analysis
            </div>
          )}
        </div>
      </main>

      <aside className="sidebar">
        
        <div className="panel">
          <h3><MessageSquareText size={18} /> ElevenLabs Speech-to-Text</h3>
          {errorSTT && <p style={{color:'red', fontSize:'0.8rem'}}>{errorSTT}</p>}
          <div className="transcription-box">
             {transcript || (isRecordingSTT ? "Listening..." : "Waiting for activation...")}
          </div>
        </div>

        <div className="panel">
          <h3><Activity size={18} /> Facial Action Units</h3>
          {metrics && Object.keys(metrics?.au_intensities || {}).length > 0 ? renderAUs() : <p style={{color: '#64748b', fontSize:'0.9rem'}}>Awaiting clear face detection...</p>}
        </div>

        <div className="panel">
          <h3><Eye size={18} /> Head Pose & Gaze</h3>
          {metrics ? (
            <>
              <div className="metric-row"><span>Pitch</span><span>{parseFloat(metrics.head_pose?.rotation?.pitch || 0).toFixed(3)}</span></div>
              <div className="metric-row"><span>Yaw</span><span>{parseFloat(metrics.head_pose?.rotation?.yaw || 0).toFixed(3)}</span></div>
              <div className="metric-row"><span>Roll</span><span>{parseFloat(metrics.head_pose?.rotation?.roll || 0).toFixed(3)}</span></div>
              <hr style={{borderColor: 'rgba(255,255,255,0.05)', margin: '0.5rem 0'}} />
              <div className="metric-row"><span>Gaze X</span><span>{parseFloat(metrics.gaze?.angle_x || 0).toFixed(3)}</span></div>
              <div className="metric-row"><span>Gaze Y</span><span>{parseFloat(metrics.gaze?.angle_y || 0).toFixed(3)}</span></div>
            </>
          ) : (
            <p style={{color: '#64748b', fontSize:'0.9rem'}}>Awaiting clear face detection...</p>
          )}
        </div>
      </aside>

      {/* Hidden canvas for taking snapshots */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default App;
