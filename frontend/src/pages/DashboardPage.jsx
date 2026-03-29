import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [sessionId, setSessionId] = useState('');

    useEffect(() => {
        // Enforce basic auth check
        const session = localStorage.getItem('session_id');
        if (!session) {
            navigate('/login');
        } else {
            setSessionId(session);
        }
    }, [navigate]);

    return (
        <div 
            className="bg-[#21203A] min-h-screen text-[#F5EAEB] p-8"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`}
            </style>
            
            <header className="flex justify-between items-center mb-12 border-b border-[#5A587A] pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Ethereal Prep Dashboard</h1>
                    <p className="text-[#C2A3A6] mt-2 text-sm">Welcome back! Ready for your interview?</p>
                </div>
                <button 
                    onClick={() => {
                        localStorage.removeItem('session_id');
                        navigate('/login');
                    }}
                    className="px-4 py-2 border border-[#C2A3A6] text-[#C2A3A6] hover:bg-[#C2A3A6] hover:text-[#21203A] rounded-md transition-colors text-sm font-medium"
                >
                    Log Out
                </button>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Placeholder Card 1 */}
                <div className="bg-[#3D3C5C] p-6 rounded-xl border border-[#5A587A] hover:border-[#A08E98] transition-colors cursor-pointer shadow-lg group">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-semibold">Start Mock Interview</h2>
                        <span className="material-symbols-outlined text-[#A08E98] group-hover:text-white transition-colors">video_camera_front</span>
                    </div>
                    <p className="text-[#F5EAEB]/70 text-sm leading-relaxed mb-6">
                        Jump into a live webcam session with OpenFace tracking and Gemini-driven personas.
                    </p>
                    <button 
                        onClick={() => navigate('/interview')}
                        className="w-full py-2.5 bg-[#A08E98] hover:bg-[#8C7C85] text-white text-sm font-medium rounded-md transition-colors"
                    >
                        Begin Session
                    </button>
                </div>

                {/* Placeholder Card 2 */}
                <div className="bg-[#3D3C5C] p-6 rounded-xl border border-[#5A587A] shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-semibold">Past Real-world Reports</h2>
                        <span className="material-symbols-outlined text-[#A08E98]">assessment</span>
                    </div>
                    <p className="text-[#F5EAEB]/70 text-sm leading-relaxed">
                        Review your confidence vs performance metrics from previous interview loops.
                    </p>
                    <div className="mt-6 p-3 bg-[#21203A] rounded border border-[#5A587A] text-xs text-center text-[#C2A3A6]">
                        No past interviews found.
                    </div>
                </div>

                {/* Placeholder Card 3 */}
                <div className="bg-[#3D3C5C] p-6 rounded-xl border border-[#5A587A] shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-semibold">Session ID Info</h2>
                        <span className="material-symbols-outlined text-[#A08E98]">key</span>
                    </div>
                    <p className="text-[#F5EAEB]/70 text-sm leading-relaxed mb-4">
                        You are passing this secure token to the backend on active WebSockets:
                    </p>
                    <div className="bg-[#21203A] p-2 rounded truncate text-xs text-[#8caeb5] font-mono border border-[#5A587A]">
                        {sessionId || 'Loading...'}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
