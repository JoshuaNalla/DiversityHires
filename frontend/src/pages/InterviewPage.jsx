import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { Mic, MicOff, Send, Play, Loader2, Volume2, Square, ChevronLeft, ChevronRight, Camera, Eye, EyeOff, Pause, PhoneOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FaceEmotionReader from '../components/FaceEmotionReader';
import ResumeDropzone from '../components/ResumeDropzone';

// Global singleton for audio to ensure only one plays at a time
let globalAudio = null;

const ChatBubble = ({ message, index, chatHistory }) => {
  const isAI = message.role === 'interviewer';
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play the newest AI message once
  useEffect(() => {
    if (isAI && message.audioUrl && index === chatHistory.length - 1) {
      handleTogglePlay();
    }
    // Cleanup on unmount
    return () => {
      if (globalAudio && globalAudio.src === message.audioUrl) {
        globalAudio.pause();
      }
    };
  }, [message, index]); // Intentionally run once when mounted as newest message

  const handleTogglePlay = () => {
    if (!message.audioUrl) return;

    // If currently playing THIS bubble, pause it
    if (isPlaying && globalAudio) {
      globalAudio.pause();
      setIsPlaying(false);
      return;
    }

    // Stop any existing global audio playing elsewhere
    if (globalAudio) {
      globalAudio.pause();
      // We can't easily trigger re-renders in other bubbles from here without a complex context,
      // but native audio pausing is sufficient to stop overlapping noise.
    }

    globalAudio = new Audio(message.audioUrl);
    setIsPlaying(true);

    globalAudio.onended = () => {
      setIsPlaying(false);
    };

    globalAudio.play().catch(e => {
      console.warn('Browser autoplay blocked:', e);
      setIsPlaying(false);
    });
  };

  return (
    <div className={`flex w-full ${isAI ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-[85%] rounded-2xl p-4 shadow-md ${isAI
          ? 'bg-[#313349] border border-[#4b454a] text-[#e0e0fd] rounded-tl-none'
          : 'bg-indigo-600 text-white rounded-tr-none'
        }`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>

        {isAI && message.audioUrl && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleTogglePlay}
              className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${isPlaying ? 'bg-indigo-500/20 text-indigo-400' : 'hover:bg-[#4b454a] text-indigo-300'}`}
              title={isPlaying ? "Pause Audio" : "Replay Audio"}
            >
              {isPlaying ? <Square size={14} className="fill-current" /> : <Volume2 size={16} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function InterviewPage() {
  const {
    resumeSummary,
    isInterviewActive,
    startInterview,
    chatHistory,
    setQuestionPhase,
    addUserResponse
  } = useStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  // UX State
  const [isHardwareCheck, setIsHardwareCheck] = useState(false);
  const [isHardwareReady, setIsHardwareReady] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null); // Reference for auto-scrolling text area
  const hasStartedAPI = useRef(false);

  // Voice Metrics
  const [speechMetrics, setSpeechMetrics] = useState({ wpm: 0, fillers: 0 });
  const recordingStartTimeRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading, transcript]);

  // Auto-scroll textarea as user speaks
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [transcript]);

  // Calculate Speech Metrics
  useEffect(() => {
    if (isListening && recordingStartTimeRef.current) {
      const elapsedMins = (Date.now() - recordingStartTimeRef.current) / 60000;
      if (elapsedMins > 0.05) { // Only calc after 3 seconds to avoid infinity jumps
        const words = transcript.toLowerCase().split(/\s+/).filter(w => w.length > 0);
        const wpm = Math.round(words.length / elapsedMins);

        const fillerList = ['um', 'uh', 'like', 'literally', 'basically', 'so'];
        const fillers = words.filter(w => fillerList.includes(w.replace(/[^\w]/g, ''))).length;

        setSpeechMetrics({ wpm, fillers });
      }
    }
  }, [transcript, isListening]);

  // Cleanup microphones on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
    };
  }, []);

  // Execute Start Interview API once hardware is approved
  useEffect(() => {
    if (isHardwareReady && !hasStartedAPI.current) {
      hasStartedAPI.current = true;
      executeStartAPI();
    }
  }, [isHardwareReady]);

  const handleHardwareReady = useCallback(() => setIsHardwareReady(true), []);

  const executeStartAPI = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/interview/start-interview', {
        summary: resumeSummary
      });
      setQuestionPhase(response.data.question, response.data.audio);
    } catch (error) {
      console.error(error);
      alert('Failed to connect to AI server. Please check backend.');
    } finally {
      setIsLoading(false);
    }
  };

  // Web Speech API Initialization
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            currentFinal += result[0].transcript;
          } else {
            currentInterim += result[0].transcript;
          }
        }

        if (currentFinal) {
          // Append securely to ref
          finalTranscriptRef.current += currentFinal + ' ';
        }
        // UI naturally composites the locked final string and the evolving interim string
        setTranscript(finalTranscriptRef.current + currentInterim);
      };

      recognition.onerror = (e) => {
        console.error('Speech error', e);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recordingStartTimeRef.current = Date.now();
      setSpeechMetrics({ wpm: 0, fillers: 0 });
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!transcript.trim()) return;

    // Stop recording if active
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const answer = transcript.trim();

    // Wipe STT buffers
    finalTranscriptRef.current = '';
    setTranscript('');

    // Optimistic UI updates
    addUserResponse(answer);
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/interview/next-question', {
        summary: resumeSummary,
        // Send history with the newest user answer
        history: [...chatHistory, { role: 'candidate', text: answer }]
      });
      setQuestionPhase(response.data.question, response.data.audio);
    } catch (error) {
      console.error("API Error", error);
      alert('Connection sequence interrupted. Removing last input.');
      // Graceful Rollback: Update Zustand store to remove the failed user item via direct access if needed
      useStore.setState((state) => ({
        chatHistory: state.chatHistory.slice(0, -1)
      }));
      setTranscript(answer); // Return to input box
    } finally {
      setIsLoading(false);
    }
  };

  // Phase 1: Upload Resume
  if (!resumeSummary) {
    return (
      <div className="min-h-screen bg-[#101226] flex items-center justify-center p-6">
        <ResumeDropzone />
      </div>
    );
  }

  // Phase 2: Resume Parsed - User triggers Hardware Check Mode
  if (!isHardwareCheck) {
    return (
      <div className="min-h-screen bg-[#101226] flex items-center justify-center p-6 text-[#e0e0fd]">
        <div className="bg-[#1c1e33] p-8 rounded-2xl shadow-2xl border border-[#313349] max-w-lg w-full text-center space-y-6">
          <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-2 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <Camera size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white">Identity Check</h2>
          <p className="text-[#cdc4ca]">
            Gemini has extracted {resumeSummary.skills?.length || 0} core skills from your background. <br /><br />
            Before we begin, we need to activate OmniSense and test your microphone.
          </p>
          <button
            onClick={() => {
              startInterview(); // Marks UI Phase 3 officially active
              setIsHardwareCheck(true);
            }}
            className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold transition-all shadow-lg text-white"
          >
            Enable Hardware & Proceed
          </button>
        </div>
      </div>
    );
  }

  // Phase 3: Active Side-by-Side Interview Layout (Awaiting Camera Auth -> API)
  return (
    <div className="h-screen w-full flex bg-[#0a0c20] overflow-hidden relative">

      {/* Hide Tracker Toggle - Top Right */}
      {isHardwareReady && (
        <button 
          onClick={() => setIsAnalyzerOpen(!isAnalyzerOpen)}
          className="absolute top-4 right-4 z-50 bg-[#1c1e33] border border-[#313349] hover:bg-[#4b454a] px-3 py-2 rounded-lg text-slate-300 shadow-xl flex items-center gap-2 transition-all"
        >
          {isAnalyzerOpen ? <EyeOff size={16} /> : <Eye size={16} />} 
          <span className="text-sm font-medium">{isAnalyzerOpen ? "Hide Tracker" : "Show Tracker"}</span>
        </button>
      )}

      {/* LEFT: Collapsable Chat Sidebar */}
      <div className={`relative flex flex-col transition-all duration-300 border-r border-[#313349] bg-[#1c1e33] z-20 shadow-2xl ${isSidebarOpen ? (isAnalyzerOpen ? 'w-[450px] lg:w-[500px]' : 'flex-1') : 'w-0 border-r-0'}`}>
        
        {/* Toggle button stitched to the right boundary of the sidebar */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`absolute -right-8 top-4 z-50 bg-[#1c1e33] p-1.5 border border-l-0 border-[#313349] hover:bg-[#4b454a] transition-colors text-slate-300 rounded-r-md shadow-md ${!isAnalyzerOpen && isSidebarOpen ? 'hidden' : ''}`}
          title="Toggle Chat Sidebar"
        >
          {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Only render contents if sidebar is slightly open structurally */}
        <div className={`flex flex-col h-full w-full overflow-hidden ${!isSidebarOpen && 'invisible'}`}>
          <div className="p-4 border-b border-[#313349] bg-[#101226] flex items-center justify-between shadow-sm z-10 shrink-0">
            <h3 className="font-bold text-indigo-400">Interviewer AI</h3>
            <div className="flex gap-2">
               <button 
                 onClick={() => {
                   if (globalAudio && !globalAudio.paused) globalAudio.pause();
                   if (isListening) toggleListen();
                   setIsPaused(!isPaused);
                 }}
                 className="flex items-center gap-1 text-xs bg-[#313349] hover:bg-[#4b454a] border border-[#4b454a] px-3 py-1.5 rounded-md text-slate-300 transition-colors"
               >
                 {isPaused ? <Play size={12} /> : <Pause size={12} />}
                 {isPaused ? "Resume" : "Pause"}
               </button>
               <button 
                 onClick={() => {
                   if (window.confirm("Are you sure you want to end the interview? All progress will be lost.")) {
                     if (globalAudio) globalAudio.pause();
                     if (isListening) toggleListen();
                     
                     useStore.setState({ 
                        resumeSummary: null,
                        isInterviewActive: false,
                        chatHistory: [],
                        currentQuestion: '',
                        currentAudioUrl: null
                     });
                     navigate('/dashboard');
                   }
                 }}
                 className="flex items-center gap-1 text-xs bg-red-600/80 hover:bg-red-500 border border-red-500/50 px-3 py-1.5 rounded-md text-white transition-colors"
               >
                 <PhoneOff size={12} /> End
               </button>
            </div>
          </div>

          {!isHardwareReady ? (
            // Awaiting Hardware Loop UI
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#1c1e33]/50">
              <Camera className="w-12 h-12 text-indigo-400 mb-4 animate-pulse opacity-50" />
              <h3 className="text-xl text-white font-bold mb-3">Hardware Lock</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Please click 'Allow' in your browser permissions dialog to enable your camera and microphone.
              </p>
            </div>
          ) : (
            <>
              {/* Chat Feed */}
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#1c1e33]/50">
                {chatHistory.length === 0 && !isLoading && (
                  <div className="text-center text-slate-500 mt-10">Starting session...</div>
                )}

                {chatHistory.map((msg, i) => (
                  <ChatBubble key={i} index={i} message={msg} chatHistory={chatHistory} />
                ))}

                {isLoading && (
                  <div className="flex w-full justify-start mb-4">
                    <div className="bg-[#313349] p-4 rounded-2xl rounded-tl-none border border-[#4b454a] shadow-md flex items-center gap-2 text-slate-300">
                      <Loader2 className="w-5 h-5 animate-spin text-indigo-400" /> Processing...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Box */}
              <div className="p-4 bg-[#101226] border-t border-[#313349] flex flex-col gap-2 shrink-0 z-10">
                <div className="flex justify-between items-center px-1 mb-1">
                  <span className="text-xs font-semibold text-slate-400">Your Response</span>
                  {(isListening || speechMetrics.wpm > 0) && (
                    <div className="flex gap-4 text-xs font-mono">
                      <span className="text-indigo-400" title="Words Per Minute">WPM: {speechMetrics.wpm || '--'}</span>
                      <span className="text-pink-400" title="Filler Words Detected">Fillers: {speechMetrics.fillers}</span>
                    </div>
                  )}
                </div>
                <textarea
                  ref={textareaRef}
                  value={transcript}
                  onChange={(e) => {
                    finalTranscriptRef.current = '';
                    setTranscript(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAnswerSubmit();
                    }
                  }}
                  placeholder="Write or dictate response..."
                  className="w-full bg-[#313349] border border-[#4b454a] rounded-xl p-3 text-sm text-[#e0e0fd] focus:outline-none focus:border-indigo-500 resize-none min-h-[80px]"
                />
                <div className="flex justify-between items-center mt-2">
                  <button
                    onClick={toggleListen}
                    disabled={isPaused}
                    className={`p-2.5 rounded-full transition-colors ${isListening ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-[#313349] text-slate-400 hover:bg-[#4b454a]'} disabled:opacity-50 disabled:cursor-not-allowed`}
                    title="Toggle Microphone"
                  >
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>

                  <button
                    onClick={handleAnswerSubmit}
                    disabled={!transcript.trim() || isLoading || isPaused}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-medium shadow-lg transition-all flex items-center gap-2"
                  >
                    <Send size={16} /> Submit
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* RIGHT: Video and Emotion Hub */}
      <div className={`transition-all duration-500 overflow-hidden relative bg-[#0a0c20] flex flex-col ${isAnalyzerOpen ? 'flex-1' : 'w-0'}`}>
        <div className="flex-1 p-6 relative w-full h-full min-w-[500px]">
          <FaceEmotionReader onReady={handleHardwareReady} />
        </div>
      </div>

    </div>
  );
}
