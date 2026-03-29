import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStore } from '../store/useStore';

const PERSONAS = [
    { id: 'ali', name: 'Ali', type: 'The Stress Tester', icon: 'gavel', color: 'border-red-500/50', activeBg: 'bg-red-500/10' },
    { id: 'martin', name: 'Martin', type: 'The Chill Mentor', icon: 'self_improvement', color: 'border-blue-500/50', activeBg: 'bg-blue-500/10' },
    { id: 'sara', name: 'Sara', type: 'The HR Specialist', icon: 'diversity_3', color: 'border-purple-500/50', activeBg: 'bg-purple-500/10' },
    { id: 'custom', name: 'Custom', type: 'Build Your Own', icon: 'tune', color: 'border-zinc-500/50', activeBg: 'bg-zinc-500/10' },
];

export default function CreateDemoInterviewModal({ onClose, initialData }) {
    const navigate = useNavigate();

    // Form State
    const [duration, setDuration] = useState(45);
    const [role, setRole] = useState(initialData?.title || '');
    const [company, setCompany] = useState(initialData?.company || '');
    const [jobLink, setJobLink] = useState('');
    const [description, setDescription] = useState('');
    const [selectedPersona, setSelectedPersona] = useState('ali');
    const [difficulty, setDifficulty] = useState('Mid-Level');
    
    // Resume State
    const [useResume, setUseResume] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(''); // 'idle', 'uploading', 'success', 'error'
    const [resumeSummary, setResumeSummary] = useState('');
    
    const setMockConfig = useStore(state => state.setMockConfig);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setResumeFile(file);
        setUploadStatus('uploading');
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const sid = localStorage.getItem('session_id') || "mock_id";
            const res = await axios.post('http://localhost:8000/api/interview/resume_upload', formData, {
                headers: { 'X-Session-ID': sid, 'Content-Type': 'multipart/form-data' }
            });
            
            if (res.data.success) {
                setUploadStatus('success');
                setResumeSummary(res.data.resume_summary || '');
            } else {
                setUploadStatus('error');
            }
        } catch (err) {
            console.error(err);
            setUploadStatus('error');
        }
    };

    const handleStartDemo = () => {
        if (useResume && uploadStatus !== 'success') {
            alert('Please wait for your resume to finish analyzing, or uncheck the resume option.');
            return;
        }
        console.log("Starting Demo with configuration:", { duration, role, company, jobLink, selectedPersona, difficulty, useResume });
        const config = { duration, role, company, jobLink, description, selectedPersona, difficulty, useResume, resumeSummary };
        setMockConfig(config);
        navigate('/interview');
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

                {/* Resume Upload Integration */}
                <div className="bg-[#1e2035] border border-outline-variant/20 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={useResume} onChange={(e) => setUseResume(e.target.checked)} />
                                <div className="w-10 h-5 bg-surface-bright rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                            </label>
                            <span className="text-sm font-semibold text-on-surface">Embed Experience Profile</span>
                        </div>
                    </div>
                    
                    {useResume && (
                        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            {uploadStatus === 'idle' || !resumeFile ? (
                                <div className="border-2 border-dashed border-outline-variant/30 rounded-lg p-6 text-center hover:bg-surface-bright transition-colors relative cursor-pointer group">
                                    <input type="file" accept="application/pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
                                    <span className="material-symbols-outlined text-outline text-3xl mb-2 group-hover:text-primary transition-colors">upload_file</span>
                                    <p className="text-sm text-outline">Drop your latest resume (PDF) here or click to browse.</p>
                                </div>
                            ) : uploadStatus === 'uploading' ? (
                                <div className="flex flex-col items-center justify-center p-4">
                                    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-2"></div>
                                    <p className="text-sm text-primary font-medium tracking-wide">Synthesizing vectors...</p>
                                    <div className="w-full bg-[#131525] rounded-full h-1 mt-2 overflow-hidden relative">
                                        <div className="absolute top-0 left-0 h-full bg-primary bg-gradient-to-r from-primary/50 to-primary animate-pulse w-full"></div>
                                    </div>
                                </div>
                            ) : uploadStatus === 'success' ? (
                                <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <span className="material-symbols-outlined text-emerald-400">check_circle</span>
                                        <div>
                                            <p className="text-sm text-emerald-400 font-semibold">{resumeFile.name}</p>
                                            <p className="text-xs text-emerald-400/70">Context ingested successfully.</p>
                                        </div>
                                    </div>
                                    <button onClick={() => { setResumeFile(null); setUploadStatus('idle'); }} className="text-xs font-semibold text-outline hover:text-error transition-colors">REPLACE</button>
                                </div>
                            ) : (
                                <div className="flex items-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <span className="material-symbols-outlined text-red-500 mr-2">error</span>
                                    <p className="text-sm text-red-500">Failed to parse resume. Please try again.</p>
                                </div>
                            )}
                        </div>
                    )}
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
