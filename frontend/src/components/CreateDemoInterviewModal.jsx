import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PERSONAS = [
    { id: 'ali', name: 'Ali', type: 'The Stress Tester', icon: 'gavel', accent: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)' },
    { id: 'martin', name: 'Martin', type: 'The Chill Mentor', icon: 'self_improvement', accent: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)' },
    { id: 'sara', name: 'Sara', type: 'The HR Specialist', icon: 'diversity_3', accent: '#a855f7', bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.25)' },
    { id: 'custom', name: 'Custom', type: 'Build Your Own', icon: 'tune', accent: '#6366f1', bg: 'rgba(99,102,241,0.05)', border: 'rgba(99,102,241,0.15)' },
];

const DIFFICULTIES = ['Entry Level', 'Mid-Level', 'Senior / Executive'];

export default function CreateDemoInterviewModal({ onClose }) {
    const navigate = useNavigate();

    const [duration, setDuration] = useState(45);
    const [role, setRole] = useState('');
    const [company, setCompany] = useState('');
    const [jobLink, setJobLink] = useState('');
    const [description, setDescription] = useState('');
    const [selectedPersona, setSelectedPersona] = useState('ali');
    const [difficulty, setDifficulty] = useState('Mid-Level');

    const handleStartDemo = () => {
        console.log("Starting Demo:", { duration, role, company, jobLink, description, selectedPersona, difficulty });
        navigate('/demo');
        onClose();
    };

    const inputStyle = {
        width: '100%',
        background: '#090e1a',
        border: '1px solid #1e293b',
        borderRadius: '12px',
        padding: '12px 16px',
        fontSize: '14px',
        color: '#e2e8f0',
        outline: 'none',
        transition: 'border-color 0.15s ease',
        fontFamily: 'Inter, sans-serif',
    };

    const handleFocus = (e) => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; };
    const handleBlur = (e) => { e.target.style.borderColor = '#1e293b'; };

    const durationLabels = [15, 30, 45, 60];
    const durationPercent = ((duration - 15) / 45) * 100;

    return (
        <div
            className="absolute inset-0 flex flex-col overflow-y-auto"
            style={{ background: '#090e1a', borderRadius: '20px', fontFamily: 'Inter, sans-serif' }}
        >
            {/* Gradient top bar */}
            <div className="h-[3px] w-full flex-shrink-0" style={{ background: 'linear-gradient(to right, #6366f1, #a78bfa, #22d3ee)', borderRadius: '20px 20px 0 0' }} />

            <div className="flex-1 p-8 md:p-12">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-8 text-outline hover:text-on-surface transition-colors p-1.5 rounded-lg hover:bg-surface-container"
                >
                    <span className="material-symbols-outlined text-xl">close</span>
                </button>

                {/* Header */}
                <div className="w-full max-w-3xl mx-auto mb-10">
                    <div
                        className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full text-xs font-semibold tracking-wide"
                        style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#6366f1' }}
                    >
                        <span className="material-symbols-outlined text-sm">smart_toy</span>
                        AI Interview Setup
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-on-surface tracking-tight mb-3">
                        Set Up Your Session
                    </h2>
                    <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl">
                        Configure your environment to simulate the exact pressure of a real technical interview.
                    </p>
                </div>

                <div className="w-full max-w-3xl mx-auto space-y-10 pb-4">

                    {/* Duration */}
                    <div>
                        <div className="flex justify-between items-center mb-5">
                            <label className="text-[11px] font-bold tracking-widest text-on-surface-variant uppercase">Duration</label>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-on-surface">{duration}</span>
                                <span className="text-sm font-medium text-on-surface-variant">min</span>
                            </div>
                        </div>
                        <div className="relative">
                            <input
                                type="range"
                                min="15" max="60" step="15"
                                value={duration}
                                onChange={e => setDuration(Number(e.target.value))}
                                className="w-full appearance-none cursor-pointer"
                                style={{
                                    height: '6px',
                                    borderRadius: '9999px',
                                    outline: 'none',
                                    background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${durationPercent}%, #1e293b ${durationPercent}%, #1e293b 100%)`,
                                    accentColor: '#6366f1',
                                }}
                            />
                            <div className="flex justify-between mt-3">
                                {durationLabels.map(l => (
                                    <span
                                        key={l}
                                        className="text-[11px] font-bold tracking-wider uppercase"
                                        style={{ color: duration >= l ? '#6366f1' : '#475569' }}
                                    >
                                        {l}m
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px" style={{ background: '#1e293b' }} />

                    {/* Job Details */}
                    <div>
                        <label className="block text-[11px] font-bold tracking-widest text-on-surface-variant uppercase mb-5">Job Details</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input
                                type="text"
                                placeholder="Target Role  (e.g., Software Engineer)"
                                value={role}
                                onChange={e => setRole(e.target.value)}
                                style={inputStyle}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                            <input
                                type="text"
                                placeholder="Company  (e.g., Google)"
                                value={company}
                                onChange={e => setCompany(e.target.value)}
                                style={inputStyle}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>
                        <div className="relative mb-4">
                            <input
                                type="url"
                                placeholder="Link to job posting  (optional)"
                                value={jobLink}
                                onChange={e => setJobLink(e.target.value)}
                                style={{ ...inputStyle, paddingRight: '44px' }}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                            <span className="material-symbols-outlined absolute top-3.5 right-4 text-outline/40 text-lg pointer-events-none">link</span>
                        </div>
                        <div className="relative">
                            <textarea
                                placeholder="Paste the job description or enter specific focus areas..."
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                rows={3}
                                style={{ ...inputStyle, resize: 'none', paddingRight: '44px' }}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                            <span className="material-symbols-outlined absolute top-3.5 right-4 text-outline/40 text-lg pointer-events-none">edit_note</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px" style={{ background: '#1e293b' }} />

                    {/* Persona */}
                    <div>
                        <label className="block text-[11px] font-bold tracking-widest text-on-surface-variant uppercase mb-5">Interviewer Persona</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {PERSONAS.map(p => {
                                const isSelected = selectedPersona === p.id;
                                return (
                                    <button
                                        key={p.id}
                                        onClick={() => setSelectedPersona(p.id)}
                                        disabled={p.id === 'custom'}
                                        className="relative flex flex-col items-start text-left p-5 rounded-2xl transition-all duration-200"
                                        style={{
                                            background: isSelected ? p.bg : '#0c1220',
                                            border: `1px solid ${isSelected ? p.border : '#1e293b'}`,
                                            opacity: p.id === 'custom' ? 0.5 : 1,
                                            cursor: p.id === 'custom' ? 'not-allowed' : 'pointer',
                                            transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                                            boxShadow: isSelected ? `0 0 20px ${p.accent}15` : 'none',
                                        }}
                                    >
                                        <span
                                            className="material-symbols-outlined text-2xl mb-4"
                                            style={{ color: isSelected ? p.accent : '#475569' }}
                                        >
                                            {p.icon}
                                        </span>
                                        <span className="text-sm font-bold mb-0.5" style={{ color: isSelected ? '#e2e8f0' : '#94a3b8' }}>
                                            {p.name}
                                        </span>
                                        <span className="text-xs text-on-surface-variant font-medium leading-tight">
                                            {p.type}{p.id === 'custom' && ' · Soon'}
                                        </span>
                                        {isSelected && (
                                            <div
                                                className="absolute top-3 right-3 w-2 h-2 rounded-full"
                                                style={{ background: p.accent }}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px" style={{ background: '#1e293b' }} />

                    {/* Difficulty */}
                    <div>
                        <label className="block text-[11px] font-bold tracking-widest text-on-surface-variant uppercase mb-5">Question Difficulty</label>
                        <div className="flex p-1.5 rounded-xl gap-1" style={{ background: '#0c1220', border: '1px solid #1e293b' }}>
                            {DIFFICULTIES.map(level => {
                                const isSelected = difficulty === level;
                                return (
                                    <button
                                        key={level}
                                        onClick={() => setDifficulty(level)}
                                        className="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200"
                                        style={{
                                            background: isSelected ? 'linear-gradient(135deg, #6366f1, #7c3aed)' : 'transparent',
                                            color: isSelected ? '#ffffff' : '#475569',
                                            boxShadow: isSelected ? '0 2px 10px rgba(99,102,241,0.3)' : 'none',
                                        }}
                                    >
                                        {level}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-2">
                        <button
                            onClick={handleStartDemo}
                            className="w-full py-5 rounded-2xl font-bold text-lg flex justify-between items-center px-10 transition-all group"
                            style={{
                                background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                                color: 'white',
                                boxShadow: '0 8px 30px rgba(99,102,241,0.35)',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.45)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.35)'; }}
                        >
                            <span>Start Demo Interview</span>
                            <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">play_arrow</span>
                        </button>
                        <p className="text-center text-xs text-on-surface-variant mt-4 font-medium tracking-wide">
                            You'll be directed to a secure AI simulation room · Microphone access required
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
