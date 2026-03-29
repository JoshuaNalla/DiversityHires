import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const sid = localStorage.getItem('session_id');
            if (!sid) {
                navigate('/login');
                return;
            }
            try {
                const res = await axios.get('http://localhost:8000/api/auth/profile', {
                    headers: { 'X-Session-ID': sid }
                });
                if (res.data.success) {
                    setProfileData(res.data);
                }
            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-[#ff2a00]/50 border-t-[#ff2a00] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!profileData) return null;

    const { username, email, profile } = profileData;
    const resumes = profile.resumes || [];
    const _roles = profile.target_roles || [];
    const roles = _roles.length > 0 ? _roles : ["No specific roles listed."];

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-on-surface font-sans selection:bg-primary/30">
            {/* Context/Nav Bar */}
            <div className="w-full h-16 bg-[#101226]/80 backdrop-blur-md flex items-center px-8 sticky top-0 z-50 border-b border-outline-variant/10">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center space-x-2 text-outline hover:text-primary transition-colors"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    <span className="font-semibold text-sm tracking-wider uppercase">Return to Dashboard</span>
                </button>
            </div>

            <main className="max-w-5xl mx-auto px-8 py-12">
                <h1 className="text-4xl font-black tracking-tight mb-2 font-headline">Operative Dossier</h1>
                <p className="text-secondary/80 text-sm tracking-widest uppercase mb-12">Level 4 Clearance required to modify parameters.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Identifiers Column */}
                    <div className="md:col-span-1 space-y-8">
                        {/* IDENT Block */}
                        <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/5 shadow-2xl">
                            <h2 className="text-xs text-primary font-bold tracking-[0.3em] uppercase mb-6 flex items-center">
                                <span className="material-symbols-outlined mr-2 text-sm">fingerprint</span>
                                Core Ident
                            </h2>
                            
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-24 h-24 rounded-full bg-surface-container-high border-2 border-primary/20 flex items-center justify-center shadow-[0_0_20px_rgba(255,42,0,0.1)] mb-4">
                                    <span className="material-symbols-outlined text-4xl text-outline/50">person</span>
                                </div>
                                <div className="text-2xl font-bold">{(profile.first_name || profile.last_name) ? `${profile.first_name} ${profile.last_name}`.trim() : 'Unknown Operative'}</div>
                                <div className="text-xs text-outline font-mono mt-1">ID: {username}</div>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <div className="text-[0.6rem] text-outline/60 uppercase tracking-widest mb-1">Secure Comms (Email)</div>
                                    <div className="text-sm font-medium">{email}</div>
                                </div>
                                <div>
                                    <div className="text-[0.6rem] text-outline/60 uppercase tracking-widest mb-1">Clearance Level</div>
                                    <div className="text-sm font-medium text-emerald-400 flex items-center">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
                                        Active
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Parameters Column */}
                    <div className="md:col-span-2 space-y-8">
                        
                        {/* ── Job Target Parameters ── */}
                        <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/5 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                                <span className="material-symbols-outlined text-9xl">crosshair</span>
                            </div>
                            
                            <h2 className="text-xs text-primary font-bold tracking-[0.3em] uppercase mb-6 flex items-center relative z-10">
                                <span className="material-symbols-outlined mr-2 text-sm">target</span>
                                Target Parameters
                            </h2>
                            
                            <div className="relative z-10 space-y-6">
                                <div>
                                    <div className="text-[0.65rem] text-outline/60 uppercase tracking-widest mb-3">Primary Disciplines</div>
                                    <div className="flex flex-wrap gap-2">
                                        {roles.map((role, i) => (
                                            <div key={i} className="px-4 py-1.5 bg-primary/10 border border-primary/30 rounded-full text-primary text-xs font-semibold tracking-wide">
                                                {role}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="p-4 bg-surface-container-high rounded-xl border border-outline-variant/10 flex items-start space-x-4">
                                     <span className="material-symbols-outlined text-outline mt-0.5">lock</span>
                                     <div>
                                         <h4 className="text-sm font-semibold mb-1">Read-Only View Active</h4>
                                         <p className="text-xs text-outline/80 leading-relaxed">
                                            Your primary parameters are currently locked for evaluation. To update your target roles or experience thresholds, please contact command.
                                         </p>
                                     </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Dossier / Resumes ── */}
                        <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/5 shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xs text-primary font-bold tracking-[0.3em] uppercase flex items-center">
                                    <span className="material-symbols-outlined mr-2 text-sm">folder_open</span>
                                    Operational Dossiers (Resumes)
                                </h2>
                                <span className="text-xs text-outline bg-surface-container-high px-2 py-1 rounded">
                                    {resumes.length} {resumes.length === 1 ? 'FILE' : 'FILES'}
                                </span>
                            </div>

                            {resumes.length === 0 ? (
                                <div className="w-full py-12 flex flex-col items-center justify-center border border-dashed border-outline-variant/20 rounded-xl bg-surface-container-high/50">
                                    <span className="material-symbols-outlined text-outline/30 text-5xl mb-3">description</span>
                                    <p className="text-sm text-outline font-medium">No dossiers uploaded.</p>
                                    <p className="text-xs text-outline/50 mt-1">Upload functionality will be unlocked shortly.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {resumes.map((resume, idx) => (
                                        <div key={idx} className="w-full flex items-center justify-between p-4 bg-surface-container-high hover:bg-surface-bright border border-outline-variant/10 rounded-xl transition-colors cursor-pointer group">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 rounded-lg bg-[#252840] flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                    <span className="material-symbols-outlined">picture_as_pdf</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-on-surface">{resume.filename}</h4>
                                                    <p className="text-[0.65rem] text-outline uppercase tracking-widest mt-0.5">CATEGORY: {resume.category}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center space-x-6">
                                                <div className="hidden sm:block text-right">
                                                    <p className="text-xs font-mono text-outline">{new Date(resume.upload_date).toLocaleDateString()}</p>
                                                    <p className="text-[0.6rem] text-outline/50 uppercase tracking-widest mt-0.5">Uploaded</p>
                                                </div>
                                                <button className="text-outline hover:text-primary transition-colors focus:outline-none" title="View Document">
                                                    <span className="material-symbols-outlined">download</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
