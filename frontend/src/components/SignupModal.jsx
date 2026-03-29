import React, { useState } from 'react';
import BrandLogo from './BrandLogo';

const SignupModal = ({ onClose, onSwitchToLogin }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: fullName, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Instantly switch them to login view once signed up
                onSwitchToLogin();
            } else {
                setError(data.detail || 'Sign up failed. Please try again.');
            }
        } catch (err) {
            setError('Network error. Is the backend server running?');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" style={{ fontFamily: "'Inter', sans-serif" }}>
            <main className="brand-card w-full max-w-[420px] rounded-[2rem] p-8 sm:p-10 relative animate-in fade-in zoom-in duration-200" data-purpose="sign-up-container">
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

                <header className="mb-8 text-center mt-2">
                    <div className="flex justify-center mb-5">
                        <BrandLogo size="sm" showTagline stacked className="items-center" />
                    </div>
                    <p className="brand-kicker mb-3">Create Account</p>
                    <h1 className="text-3xl font-bold text-[var(--brand-ink)] tracking-tight">Join preppr</h1>
                </header>
                
                <form className="space-y-5" data-purpose="sign-up-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/40 text-red-600 text-sm rounded-xl p-3">
                            {error}
                        </div>
                    )}
                    
                    <div data-purpose="form-group-name">
                        <label className="block text-sm font-medium text-[var(--brand-ink)] mb-1.5" htmlFor="fullName">Full Name</label>
                        <input 
                            className="w-full px-4 py-3 bg-white text-[#333] placeholder-gray-500 rounded-xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent transition duration-200" 
                            id="fullName" 
                            name="fullName" 
                            placeholder="Full Name" 
                            required 
                            type="text" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>
                    
                    <div data-purpose="form-group-email">
                        <label className="block text-sm font-medium text-[var(--brand-ink)] mb-1.5" htmlFor="email">Email</label>
                        <input 
                            className="w-full px-4 py-3 bg-white text-[#333] placeholder-gray-500 rounded-xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent transition duration-200" 
                            id="email" 
                            name="email" 
                            placeholder="Email@gmail.com" 
                            required 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div data-purpose="form-group-password">
                        <label className="block text-sm font-medium text-[var(--brand-ink)] mb-1.5" htmlFor="password">Password</label>
                        <div className="relative">
                            <input 
                                className="w-full px-4 py-3 bg-white text-[#333] placeholder-gray-500 rounded-xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent transition duration-200 pr-12" 
                                id="password" 
                                name="password" 
                                placeholder="Password" 
                                required 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="pt-2" data-purpose="form-submit">
                        <button 
                            className="brand-button-primary w-full font-semibold py-3 px-4 rounded-xl hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-primary/30 transition duration-200 disabled:opacity-50" 
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating...' : 'Create Account'}
                        </button>
                    </div>
                </form>
                
                <div className="my-6 flex items-center justify-center space-x-4" data-purpose="divider">
                    <div className="h-px bg-outline-variant flex-1"></div>
                    <span className="text-on-surface-variant text-sm font-medium">or</span>
                    <div className="h-px bg-outline-variant flex-1"></div>
                </div>
                
                <div className="space-y-3" data-purpose="social-login">
                    <button className="w-full flex items-center justify-center px-4 py-2.5 border border-outline-variant rounded-xl text-[var(--brand-ink)] hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition duration-200" type="button">
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                        </svg>
                        <span className="text-sm font-medium">Sign up with Google</span>
                    </button>
                    
                    <button className="w-full flex items-center justify-center px-4 py-2.5 border border-outline-variant rounded-xl text-[var(--brand-ink)] hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition duration-200" type="button">
                        <svg className="w-5 h-5 mr-3 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                        </svg>
                        <span className="text-sm font-medium">Sign up with LinkedIn</span>
                    </button>
                </div>
                
                <footer className="mt-8 text-center" data-purpose="sign-up-footer">
                    <p className="text-sm text-on-surface-variant">
                        Already have an account?{" "}
                        <button onClick={onSwitchToLogin} className="text-primary hover:underline font-medium">Sign in here</button>
                    </p>
                </footer>
            </main>
        </div>
    );
};

export default SignupModal;
