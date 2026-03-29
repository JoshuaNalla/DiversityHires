import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandLogo from './BrandLogo';

const LoginModal = ({ onClose, onSwitchToSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('session_id', data.session_id);
                if (data.username) localStorage.setItem('username', data.username);
                navigate('/dashboard');
            } else {
                setError(data.detail || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('Network error. Is the backend server running?');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" style={{ fontFamily: "'Inter', sans-serif" }}>
            <main className="brand-card w-full max-w-md rounded-[2rem] overflow-hidden p-8 md:p-10 relative animate-in fade-in zoom-in duration-200">
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-outline hover:text-primary transition-colors p-1"
                    aria-label="Close modal"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <div className="text-center mb-8 mt-2">
                    <div className="flex justify-center mb-5">
                        <BrandLogo size="sm" showTagline stacked className="items-center" />
                    </div>
                    <p className="brand-kicker mb-3">Welcome Back</p>
                    <h2 className="text-2xl font-semibold text-[var(--brand-ink)]">Log in to preppr</h2>
                </div>
                
                <form className="space-y-5" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/40 text-red-600 text-sm rounded-xl p-3">
                            {error}
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-[var(--brand-ink)]" htmlFor="email">Email</label>
                        <input 
                            className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 placeholder-gray-500 border border-outline-variant focus:ring-2 focus:ring-primary/30 focus:border-transparent outline-none transition-shadow text-sm" 
                            id="email" 
                            name="email" 
                            placeholder="Email or email.com" 
                            required 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-[var(--brand-ink)]" htmlFor="password">Password</label>
                        <input 
                            className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 placeholder-gray-500 border border-outline-variant focus:ring-2 focus:ring-primary/30 focus:border-transparent outline-none transition-shadow text-sm" 
                            id="password" 
                            name="password" 
                            placeholder="Password" 
                            required 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end">
                        <a className="text-sm text-primary hover:underline underline-offset-4 opacity-90 hover:opacity-100 transition-opacity" href="#!">Forgot Password?</a>
                    </div>
                    <button 
                        className="brand-button-primary w-full py-3 px-4 font-medium rounded-xl transition-colors shadow-sm text-sm tracking-wide disabled:opacity-50" 
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-outline-variant/50"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-white/90 text-on-surface-variant">or</span>
                        </div>
                    </div>
                    <div className="mt-6 space-y-3">
                        <button className="w-full flex justify-center items-center py-2.5 px-4 border border-outline-variant rounded-xl shadow-sm bg-transparent hover:bg-primary/5 transition-colors text-sm font-medium text-[var(--brand-ink)]" type="button">
                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                            </svg>
                            Google
                        </button>
                        <button className="w-full flex justify-center items-center py-2.5 px-4 border border-outline-variant rounded-xl shadow-sm bg-transparent hover:bg-primary/5 transition-colors text-sm font-medium text-[var(--brand-ink)]" type="button">
                            <svg className="h-5 w-5 mr-2 text-[#0A66C2] bg-white rounded-sm p-[1px]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                            </svg>
                            LinkedIn
                        </button>
                    </div>
                </div>
                
                <div className="mt-8 text-center text-sm">
                    <span className="text-on-surface-variant">New user? </span>
                    <button onClick={onSwitchToSignup} className="text-primary hover:underline font-medium opacity-90 hover:opacity-100 transition-opacity">Sign up here</button>
                </div>
            </main>
        </div>
    );
};

export default LoginModal;
