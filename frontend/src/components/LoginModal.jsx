import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

    const inputBase = {
        background: '#0c1220',
        border: '1px solid #1e293b',
        outline: 'none',
        color: '#e2e8f0',
        fontSize: '14px',
        padding: '12px 16px',
        borderRadius: '12px',
        width: '100%',
        transition: 'border-color 0.15s ease',
        fontFamily: 'Inter, sans-serif',
    };

    return (
        <div
            style={{ fontFamily: 'Inter, sans-serif' }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl"
        >
            <div
                className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative"
                style={{ background: '#090e1a', border: '1px solid rgba(99,102,241,0.2)' }}
            >
                {/* Gradient top bar */}
                <div className="h-[3px] w-full" style={{ background: 'linear-gradient(to right, #6366f1, #a78bfa, #22d3ee)' }} />

                <div className="p-8 md:p-10">
                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 text-outline hover:text-on-surface transition-colors p-1.5 rounded-lg hover:bg-surface-container"
                        aria-label="Close"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Header */}
                    <div className="mb-8">
                        <div
                            className="w-10 h-10 rounded-xl mb-5 flex items-center justify-center"
                            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}
                        >
                            <svg className="w-5 h-5" style={{ color: '#6366f1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-on-background tracking-tight">Welcome back</h2>
                        <p className="text-sm text-on-surface-variant mt-1">Sign in to continue your interview prep</p>
                    </div>

                    {error && (
                        <div
                            className="mb-5 text-sm rounded-xl p-3.5 flex items-center gap-2.5"
                            style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}
                        >
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                style={inputBase}
                                onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                                onBlur={e => e.target.style.borderColor = '#1e293b'}
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Password</label>
                                <a href="#!" style={{ color: '#6366f1', fontSize: '12px', textDecoration: 'none' }}
                                    onMouseEnter={e => e.target.style.opacity = '0.75'}
                                    onMouseLeave={e => e.target.style.opacity = '1'}>
                                    Forgot password?
                                </a>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={inputBase}
                                onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                                onBlur={e => e.target.style.borderColor = '#1e293b'}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full py-3.5 text-sm mt-1"
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-3">
                        <div className="flex-1 h-px" style={{ background: '#1e293b' }} />
                        <span className="text-xs text-outline font-medium">or continue with</span>
                        <div className="flex-1 h-px" style={{ background: '#1e293b' }} />
                    </div>

                    <div className="space-y-3">
                        <button
                            type="button"
                            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium text-on-surface transition-all hover:border-outline-variant/50"
                            style={{ background: '#0c1220', border: '1px solid #1e293b' }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = '#2d3b52'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = '#1e293b'}
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>
                        <button
                            type="button"
                            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium text-on-surface transition-all"
                            style={{ background: '#0c1220', border: '1px solid #1e293b' }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = '#2d3b52'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = '#1e293b'}
                        >
                            <svg className="h-4 w-4" style={{ color: '#0A66C2', background: 'white', borderRadius: '2px', padding: '1px' }} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                            LinkedIn
                        </button>
                    </div>

                    <p className="mt-8 text-center text-sm text-on-surface-variant">
                        New here?{' '}
                        <button
                            onClick={onSwitchToSignup}
                            className="font-semibold transition-colors"
                            style={{ color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            Create an account
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
