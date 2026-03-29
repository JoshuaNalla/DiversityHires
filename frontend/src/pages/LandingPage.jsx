import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, FileText, Activity } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <header className="mb-16 text-center z-10">
        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl backdrop-blur-sm">
          <Bot className="w-8 h-8 text-indigo-400" />
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-br from-white via-indigo-100 to-slate-400 bg-clip-text text-transparent">
          DiversityHires
        </h1>
        <p className="text-lg text-slate-400 font-medium tracking-wide max-w-xl mx-auto">
          The autonomous AI recruitment engine designed to neutralize bias and analyze raw potential.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl z-10">
        {/* Resume Parser Button */}
        <button 
          onClick={() => navigate('/resume')}
          className="group relative flex flex-col items-center p-10 bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 hover:border-indigo-500/30 rounded-3xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/10"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 rounded-full flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
            <FileText className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mb-3 tracking-tight">Autonomous Resume Parser</h2>
          <p className="text-slate-400 text-center text-sm leading-relaxed">
            Upload candidate resumes to our Presage Engine for deep, unbiased conversational intelligence and role matching.
          </p>
        </button>

        {/* Face Emotion Reader Button */}
        <button 
          onClick={() => navigate('/emotion')}
          className="group relative flex flex-col items-center p-10 bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 hover:border-sky-500/30 rounded-3xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-sky-500/10"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-sky-500/20 to-cyan-500/20 text-sky-400 rounded-full flex items-center justify-center mb-6 border border-sky-500/20 group-hover:scale-110 transition-transform duration-300">
            <Activity className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mb-3 tracking-tight">Real-Time Emotion Reader</h2>
          <p className="text-slate-400 text-center text-sm leading-relaxed">
            Live webcam tracking of micro-expressions, posture signals, and ElevenLabs speech transcription for dynamic interview analysis.
          </p>
        </button>
      </div>
    </div>
  );
}
