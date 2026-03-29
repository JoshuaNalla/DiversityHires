import { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, Square, Activity, Eye, TrendingUp } from 'lucide-react';
import '../index.css';

const CONFIDENCE_HISTORY_LIMIT = 30;
const SIGNAL_CONFIG = [
  { key: 'confidence', label: 'Confidence', color: '#22d3ee' },
  { key: 'engagement', label: 'Engagement', color: '#a3e635' },
  { key: 'positivity', label: 'Positivity', color: '#f59e0b' },
  { key: 'happiness', label: 'Happiness', color: '#fb7185' },
  { key: 'stress', label: 'Stress', color: '#c084fc' },
];

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function getBlendshapeValue(blendshapes = {}, key) {
  return parseFloat(blendshapes?.[key] || 0);
}

function calculateConfidenceScore(metrics) {
  if (!metrics?.au_intensities) {
    return null;
  }

  const blendshapes = metrics.au_intensities;
  const rotation = metrics.head_pose?.rotation || {};
  const gaze = metrics.gaze || {};

  const smile = Math.max(
    getBlendshapeValue(blendshapes, 'mouthSmileLeft'),
    getBlendshapeValue(blendshapes, 'mouthSmileRight')
  );
  const jawOpen = getBlendshapeValue(blendshapes, 'jawOpen');
  const browInnerUp = getBlendshapeValue(blendshapes, 'browInnerUp');
  const browDown = Math.max(
    getBlendshapeValue(blendshapes, 'browDownLeft'),
    getBlendshapeValue(blendshapes, 'browDownRight')
  );
  const eyeWide = Math.max(
    getBlendshapeValue(blendshapes, 'eyeWideLeft'),
    getBlendshapeValue(blendshapes, 'eyeWideRight')
  );
  const blink = Math.max(
    getBlendshapeValue(blendshapes, 'eyeBlinkLeft'),
    getBlendshapeValue(blendshapes, 'eyeBlinkRight')
  );

  const yaw = Math.abs(parseFloat(rotation.yaw || 0));
  const pitch = Math.abs(parseFloat(rotation.pitch || 0));
  const gazeX = Math.abs(parseFloat(gaze.angle_x || 0));
  const gazeY = Math.abs(parseFloat(gaze.angle_y || 0));

  const eyeContactScore = clamp(1 - (gazeX / 0.35 + gazeY / 0.35) / 2);
  const postureScore = clamp(1 - (yaw / 35 + pitch / 30) / 2);
  const expressionScore = clamp(0.45 + (smile * 0.35) + (jawOpen * 0.15) + (eyeWide * 0.05));
  const tensionPenalty = clamp((blink * 0.45) + (browInnerUp * 0.3) + (browDown * 0.25));

  const score = clamp(
    (eyeContactScore * 0.35) +
    (postureScore * 0.3) +
    (expressionScore * 0.35) -
    (tensionPenalty * 0.25)
  );

  return Math.round(score * 100);
}

function calculateSignalScores(metrics) {
  if (!metrics?.au_intensities) {
    return null;
  }

  const blendshapes = metrics.au_intensities;
  const rotation = metrics.head_pose?.rotation || {};
  const gaze = metrics.gaze || {};

  const smile = Math.max(
    getBlendshapeValue(blendshapes, 'mouthSmileLeft'),
    getBlendshapeValue(blendshapes, 'mouthSmileRight')
  );
  const mouthOpen = getBlendshapeValue(blendshapes, 'jawOpen');
  const eyeWide = Math.max(
    getBlendshapeValue(blendshapes, 'eyeWideLeft'),
    getBlendshapeValue(blendshapes, 'eyeWideRight')
  );
  const blink = Math.max(
    getBlendshapeValue(blendshapes, 'eyeBlinkLeft'),
    getBlendshapeValue(blendshapes, 'eyeBlinkRight')
  );
  const browInnerUp = getBlendshapeValue(blendshapes, 'browInnerUp');
  const browDown = Math.max(
    getBlendshapeValue(blendshapes, 'browDownLeft'),
    getBlendshapeValue(blendshapes, 'browDownRight')
  );
  const cheekRaise = Math.max(
    getBlendshapeValue(blendshapes, 'cheekSquintLeft'),
    getBlendshapeValue(blendshapes, 'cheekSquintRight')
  );
  const mouthPress = Math.max(
    getBlendshapeValue(blendshapes, 'mouthPressLeft'),
    getBlendshapeValue(blendshapes, 'mouthPressRight')
  );
  const mouthFrown = Math.max(
    getBlendshapeValue(blendshapes, 'mouthFrownLeft'),
    getBlendshapeValue(blendshapes, 'mouthFrownRight')
  );

  const yaw = Math.abs(parseFloat(rotation.yaw || 0));
  const pitch = Math.abs(parseFloat(rotation.pitch || 0));
  const roll = Math.abs(parseFloat(rotation.roll || 0));
  const gazeX = Math.abs(parseFloat(gaze.angle_x || 0));
  const gazeY = Math.abs(parseFloat(gaze.angle_y || 0));

  const eyeContact = clamp(1 - (gazeX / 0.35 + gazeY / 0.35) / 2);
  const posture = clamp(1 - (yaw / 35 + pitch / 30 + roll / 25) / 3);
  const openness = clamp((mouthOpen * 0.45) + (eyeWide * 0.25) + (posture * 0.3));
  const positiveExpression = clamp((smile * 0.6) + (cheekRaise * 0.2) + (eyeWide * 0.1) + (mouthOpen * 0.1));
  const tension = clamp((blink * 0.25) + (browInnerUp * 0.25) + (browDown * 0.2) + (mouthPress * 0.15) + (mouthFrown * 0.15));

  return {
    confidence: calculateConfidenceScore(metrics),
    engagement: Math.round(clamp((eyeContact * 0.4) + (openness * 0.35) + (posture * 0.25)) * 100),
    positivity: Math.round(clamp((positiveExpression * 0.6) + (eyeContact * 0.25) + ((1 - mouthFrown) * 0.15)) * 100),
    happiness: Math.round(clamp((smile * 0.65) + (cheekRaise * 0.2) + (eyeWide * 0.1) + (mouthOpen * 0.05)) * 100),
    stress: Math.round(clamp((tension * 0.7) + ((1 - eyeContact) * 0.15) + ((1 - posture) * 0.15)) * 100),
  };
}

function buildMetricPath(history, metricKey, width, height) {
  if (!history.length) return '';
  if (history.length === 1) {
    const y = height - (history[0][metricKey] / 100) * height;
    return `M 0 ${y} L ${width} ${y}`;
  }

  return history
    .map((point, index) => {
      const x = (index / (history.length - 1)) * width;
      const y = height - (point[metricKey] / 100) * height;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
}

export default function FaceEmotionReader() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [metrics, setMetrics] = useState(null);
  const [signalHistory, setSignalHistory] = useState([]);

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
      setSignalHistory([]);
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
    setSignalHistory([]);
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
          const signalScores = calculateSignalScores(data);

          if (signalScores) {
            setSignalHistory((prev) => {
              const next = [...prev, { timestamp: Date.now(), ...signalScores }];
              return next.slice(-CONFIDENCE_HISTORY_LIMIT);
            });
          }
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

  const latestSignal = signalHistory.at(-1) ?? null;
  const signalAverages = SIGNAL_CONFIG.reduce((acc, signal) => {
    acc[signal.key] = signalHistory.length
      ? Math.round(signalHistory.reduce((sum, point) => sum + point[signal.key], 0) / signalHistory.length)
      : null;
    return acc;
  }, {});

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

      {errorMsg && <div className="error-banner">{errorMsg}</div>}

      <main className="dashboard-grid">
        <section className="panel transcript-panel relative overflow-hidden flex flex-col items-center justify-center border-dashed border-indigo-500/30">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 z-0"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center p-6 space-y-5">
            <div className="w-[72px] h-[72px] rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center shadow-2xl relative group transition-transform duration-500 hover:scale-110 hover:border-indigo-500/50">
              <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse group-hover:bg-indigo-500/40 transition-colors duration-500"></div>
              <Activity className="w-8 h-8 text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-xl font-bold bg-gradient-to-br from-indigo-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent m-0 flex justify-center pb-1 drop-shadow-sm">
                Expansion Slot
              </h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-[220px]">
                This architecture node is reserved for advanced agent telemetry and deep learning integrations.
              </p>
            </div>

            <div className="mt-2 px-6 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-300 text-xs font-bold uppercase tracking-widest shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] opacity-70 cursor-not-allowed">
               Standby Mode
            </div>
          </div>
        </section>

        <section className="panel video-panel">
          <h3><Camera size={18} /> Live Video</h3>
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
        </section>

        <section className="panel signals-panel">
          <h3><TrendingUp size={18} /> Emotion Trend Signals</h3>
          {signalHistory.length > 0 ? (
            <>
              <div className="signal-legend">
                {SIGNAL_CONFIG.map((signal) => (
                  <div key={signal.key} className="signal-legend-item">
                    <span className="signal-swatch" style={{ backgroundColor: signal.color }} />
                    <span>{signal.label}</span>
                    <strong>{latestSignal?.[signal.key]}%</strong>
                  </div>
                ))}
              </div>

              <div className="signal-chart">
                <div className="signal-grid">
                  <span>100</span>
                  <span>50</span>
                  <span>0</span>
                </div>
                <svg viewBox="0 0 300 140" className="signal-svg" preserveAspectRatio="none" aria-label="Emotion signal trends over time">
                  <path d="M 0 0 L 300 0" className="signal-grid-line" />
                  <path d="M 0 70 L 300 70" className="signal-grid-line" />
                  <path d="M 0 140 L 300 140" className="signal-grid-line" />
                  {SIGNAL_CONFIG.map((signal) => (
                    <path
                      key={signal.key}
                      d={buildMetricPath(signalHistory, signal.key, 300, 140)}
                      className="signal-line"
                      style={{ stroke: signal.color }}
                    />
                  ))}
                </svg>
              </div>

              <div className="signal-averages">
                {SIGNAL_CONFIG.map((signal) => (
                  <div key={signal.key} className="signal-average-card">
                    <span>{signal.label} Avg.</span>
                    <strong>{signalAverages[signal.key]}%</strong>
                  </div>
                ))}
              </div>

              <div className="signals-detail-grid">
                <div className="signals-detail-panel">
                  <h4><Activity size={16} /> Action Units</h4>
                  {metrics && Object.keys(metrics?.au_intensities || {}).length > 0 ? renderAUs() : <p style={{color: '#64748b', fontSize:'0.9rem'}}>Awaiting clear face detection...</p>}
                </div>

                <div className="signals-detail-panel">
                  <h4><Eye size={16} /> Head Pose & Gaze</h4>
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
              </div>
            </>
          ) : (
            <p style={{color: '#64748b', fontSize:'0.9rem'}}>Signal graph will appear once face metrics start streaming.</p>
          )}
        </section>
      </main>

      {/* Hidden canvas for taking snapshots */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}


