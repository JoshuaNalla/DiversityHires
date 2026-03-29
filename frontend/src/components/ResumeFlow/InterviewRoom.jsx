import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store/useStore';
import { Mic, MicOff, Play, Loader2, Send } from 'lucide-react';
import axios from 'axios';

export default function InterviewRoom() {
  const { 
    resumeSummary, 
    isInterviewActive, 
    startInterview, 
    currentQuestion, 
    currentAudioUrl, 
    setQuestionPhase,
    chatHistory,
    addUserResponse
  } = useStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const audioRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        setTranscript(prev => finalTranscript ? prev + ' ' + finalTranscript : prev + interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleStartInterview = async () => {
    startInterview();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/start-interview', {
        summary: resumeSummary
      });
      setQuestionPhase(response.data.question, response.data.audio);
    } catch (error) {
      console.error(error);
      alert('Failed to start interview. Check API keys.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!transcript.trim()) return;

    const answer = transcript.trim();
    addUserResponse(answer);
    setTranscript('');
    setIsLoading(true);
    setQuestionPhase("Hmm...", null); // UI Placehoolder

    try {
      const response = await axios.post('http://localhost:8000/api/next-question', {
        summary: resumeSummary,
        history: [...chatHistory, { role: 'candidate', text: answer }]
      });
      setQuestionPhase(response.data.question, response.data.audio);
    } catch (error) {
      console.error(error);
      alert('Failed to process answer.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-4 space-y-6">
      
      {/* Session Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 md:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
           {isInterviewActive ? (
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-indigo-400 mb-2 uppercase tracking-wide">Interviewer</h3>
                  <div className="min-h-[100px] text-lg lg:text-xl text-slate-200">
                    {isLoading ? (
                      <div className="flex items-center gap-3 text-slate-400">
                        <Loader2 className="w-5 h-5 animate-spin" /> Thinking...
                      </div>
                    ) : (
                      currentQuestion
                    )}
                  </div>
                </div>

                {currentAudioUrl && (
                  <audio
                    ref={audioRef}
                    src={currentAudioUrl}
                    autoPlay
                    controls
                    className="w-full mt-4 h-10 rounded-full grayscale opacity-80 mix-blend-screen"
                  />
                )}
              </div>
           ) : (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text">
                  Resume Parsed Successfully
                </h2>
                <p className="text-slate-400 max-w-sm">
                  The AI has reviewed your background and is ready to conduct a tailored technical interview.
                </p>
                <button 
                  onClick={handleStartInterview}
                  disabled={isLoading}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-full font-semibold transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                >
                  <Play className="w-4 h-4" /> Start Interview Session
                </button>
              </div>
           )}
        </div>

        {/* Candidate Summary Panel */}
        <div className="col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col gap-4 max-h-[400px] overflow-y-auto custom-scrollbar">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Detected Skills</h4>
            <div className="flex flex-wrap gap-2">
              {resumeSummary?.skills?.map((skill, i) => (
                <span key={i} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded-md text-xs text-slate-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Probing Areas</h4>
             <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
                {resumeSummary?.probingAreas?.map((area, i) => <li key={i}>{area}</li>)}
             </ul>
          </div>
        </div>
      </div>

      {/* Candidate Response Area */}
      {isInterviewActive && !isLoading && (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-end transition-all">
           <div className="flex-1 w-full space-y-2">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Answer</label>
             <textarea 
               value={transcript}
               onChange={(e) => setTranscript(e.target.value)}
               placeholder="Speak or type your answer here..."
               className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-indigo-500 min-h-[100px] resize-none"
             />
           </div>
           
           <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
             <button 
                onClick={toggleListen}
                className={`p-4 rounded-xl flex items-center justify-center flex-1 sm:flex-none transition-all ${
                  isListening ? 'bg-red-500/20 text-red-400 border border-red-500/50 pulse-animation' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-transparent'
                }`}
             >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
             </button>
             
             <button 
                onClick={handleAnswerSubmit}
                disabled={!transcript.trim()}
                className="p-4 rounded-xl flex items-center justify-center bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-1 sm:flex-none"
             >
                <Send className="w-6 h-6" />
             </button>
           </div>
        </div>
      )}
    </div>
  );
}
