import React from 'react';
import { useStore } from '../../store/useStore';
import ResumeDropzone from './ResumeDropzone';
import InterviewRoom from './InterviewRoom';
import { Bot } from 'lucide-react';

export default function ResumeFlow() {
  const { resumeSummary } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white font-sans">
      <header className="w-full p-6 flex items-center gap-3 border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Bot className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white drop-shadow-sm">Presage</h1>
          <p className="text-xs font-medium text-slate-400">Autonomous Interview Engine</p>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full z-10 transition-all duration-500 ease-in-out">
          {!resumeSummary ? (
            <ResumeDropzone />
          ) : (
            <InterviewRoom />
          )}
        </div>
      </main>
    </div>
  );
}
