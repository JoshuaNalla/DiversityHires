import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PERSONAS = [
    { id: 'ali', name: 'Ali', type: 'The Stress Tester', icon: 'gavel', color: 'border-red-500/50', activeBg: 'bg-red-500/10' },
    { id: 'martin', name: 'Martin', type: 'The Chill Mentor', icon: 'self_improvement', color: 'border-blue-500/50', activeBg: 'bg-blue-500/10' },
    { id: 'sara', name: 'Sara', type: 'The HR Specialist', icon: 'diversity_3', color: 'border-purple-500/50', activeBg: 'bg-purple-500/10' },
    { id: 'custom', name: 'Custom', type: 'Build Your Own', icon: 'tune', color: 'border-zinc-500/50', activeBg: 'bg-zinc-500/10' },
];

export default function CreateDemoInterviewModal({ onClose }) {
    const navigate = useNavigate();

    // Form State
    const [duration, setDuration] = useState(45);
    const [role, setRole] = useState('');
    const [company, setCompany] = useState('');
    const [jobLink, setJobLink] = useState('');
    const [description, setDescription] = useState('');
    const [selectedPersona, setSelectedPersona] = useState('ali');
    const [difficulty, setDifficulty] = useState('Mid-Level');

    const handleStartDemo = () => {
        console.log("Starting Demo with configuration:", { duration, role, company, jobLink, description, selectedPersona, difficulty });
        // The page isn't done yet, redirect to a placeholder /demo route or just close.
        navigate('/demo');
        onClose();
    };

    const labelCls = "block text-[0.6875rem] font-bold tracking-widest text-outline uppercase mb-2";

    return (
        <div className="absolute inset-0 bg-surface-container-high rounded-2xl flex flex-col p-8 md:p-12 overflow-y-auto animate-in fade-in zoom-in-95 duration-200 shadow-2xl">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-8 text-outline hover:text-on-surface transition-colors p-1"
                title="Cancel Demo Setup"
            >
                <span className="material-symbols-outlined">close</span>
            </button>

            {/* Header */}
            <div className="mb-10 w-full max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-3">
                    Set Up Your Session
                </h2>
                <p className="text-outline text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                    Configure your environment to simulate the high-stakes pressure of a real technical interview. Precision is key to growth.
                </p>
            </div>

            {/* Form Body - Constrained max width for readability */}
            <div className="w-full max-w-3xl mx-auto space-y-12 pb-4">
                
                {/* Duration */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <label className={labelCls}>Interview Duration</label>
                        <span className="text-xl font-bold text-on-surface">{duration} <span className="text-sm font-medium text-outline uppercase tracking-wider">Minutes</span></span>
                    </div>
                    {/* Custom Range Slider using Tailwind accent */}
                    <div className="relative w-full">
                        <input 
                            type="range" 
                            min="15" 
                            max="60" 
                            step="15" 
                            value={duration} 
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="w-full h-1.5 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-primary focus:outline-none"
                        />
                        <div className="flex justify-between text-[0.6875rem] font-bold tracking-widest text-outline/50 mt-4 px-1">
                            <span>15 MIN</span>
                            <span>30 MIN</span>
                            <span>45 MIN</span>
                            <span>60 MIN</span>
                        </div>
                    </div>
                </div>

                {/* Job Details */}
                <div>
                    <label className={labelCls}>Job Details</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Target Role (e.g., Software Engineer)" 
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full bg-[#1e2035] border border-outline-variant/20 rounded-xl px-4 py-3.5 text-sm text-on-surface focus:outline-none focus:border-primary/50 transition-colors placeholder:text-outline/40"
                            />
                        </div>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Company (e.g., Google)" 
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                className="w-full bg-[#1e2035] border border-outline-variant/20 rounded-xl px-4 py-3.5 text-sm text-on-surface focus:outline-none focus:border-primary/50 transition-colors placeholder:text-outline/40"
                            />
                        </div>
                    </div>
                    <div className="relative mb-4">
                        <input 
                            type="url" 
                            placeholder="Link to job posting (optional)" 
                            value={jobLink}
                            onChange={(e) => setJobLink(e.target.value)}
                            className="w-full bg-[#1e2035] border border-outline-variant/20 rounded-xl px-4 py-3.5 text-sm text-on-surface focus:outline-none focus:border-primary/50 transition-colors placeholder:text-outline/40"
                        />
                        <span className="material-symbols-outlined absolute top-3.5 right-4 text-outline/40 text-lg pointer-events-none">link</span>
                    </div>
                    <div className="relative">
                        <textarea 
                            placeholder="Paste the job description or enter specific focus areas (System Design, React patterns, etc.)..." 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full bg-[#1e2035] border border-outline-variant/20 rounded-xl px-4 py-3.5 text-sm text-on-surface focus:outline-none focus:border-primary/50 transition-colors placeholder:text-outline/40 resize-none"
                        />
                        <span className="material-symbols-outlined absolute top-4 right-4 text-outline/40 text-lg pointer-events-none">edit</span>
                    </div>
                </div>

                {/* Interviewer Persona */}
                <div>
                    <label className={labelCls}>Interviewer Persona</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {PERSONAS.map(p => {
                            const isSelected = selectedPersona === p.id;
                            return (
                                <button
                                    key={p.id}
                                    onClick={() => setSelectedPersona(p.id)}
                                    disabled={p.id === 'custom'}
                                    className={`relative flex flex-col items-start text-left p-5 rounded-2xl border transition-all duration-200 ${
                                        isSelected 
                                        ? `${p.color} ${p.activeBg} shadow-[0_0_20px_rgba(0,0,0,0.2)] scale-[1.02]` 
                                        : `border-outline-variant/10 bg-[#1e2035] hover:border-outline-variant/30 hover:bg-[#252840] ${p.id === 'custom' ? 'opacity-60 cursor-not-allowed' : ''}`
                                    }`}
                                >
                                    <span className={`material-symbols-outlined text-2xl mb-4 ${isSelected ? 'text-on-surface' : 'text-outline'}`}>
                                        {p.icon}
                                    </span>
                                    <span className={`text-sm font-bold mb-1 ${isSelected ? 'text-on-surface' : 'text-outline'}`}>
                                        {p.name}
                                    </span>
                                    <span className="text-xs text-outline font-medium">
                                        {p.type} {p.id === 'custom' && '(Soon)'}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Question Difficulty */}
                <div>
                    <label className={labelCls}>Question Difficulty</label>
                    <div className="flex w-full bg-[#1e2035] rounded-xl p-1.5 border border-outline-variant/10">
                        {['Entry Level', 'Mid-Level', 'Senior/Executive'].map(level => {
                            const isSelected = difficulty === level;
                            return (
                                <button
                                    key={level}
                                    onClick={() => setDifficulty(level)}
                                    className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                                        isSelected 
                                        ? 'bg-surface-container-highest text-on-surface shadow-sm border border-outline-variant/20' 
                                        : 'text-outline hover:text-on-surface'
                                    }`}
                                >
                                    {level}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4">
                    <button 
                        onClick={handleStartDemo}
                        className="w-full py-5 bg-primary-container text-on-primary-container hover:bg-[#d2c2cf] hover:text-[#302730] transition-colors rounded-xl font-bold text-lg flex justify-between items-center px-10 border border-primary/20 hover:border-primary/40 group"
                    >
                        <span>Start Demo Interview</span>
                        <span className="material-symbols-outlined transform group-hover:translate-x-1 transition-transform">
                            play_arrow
                        </span>
                    </button>
                    <p className="text-center text-xs text-outline mt-4 font-medium tracking-wide">
                        You'll be directed to a secure AI simulation room. Microphone access required.
                    </p>
                </div>
            </div>
        </div>
    );
}
