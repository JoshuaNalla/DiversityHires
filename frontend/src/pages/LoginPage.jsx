import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
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
                // Save the session ID in local storage for later authenticated requests
                localStorage.setItem('session_id', data.session_id);
                // Redirect user to an authenticated dashboard (e.g. index/root)
                navigate('/');
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
        <div 
            className="bg-[#21203A] min-h-screen flex flex-col items-center justify-center p-4 text-[#F5EAEB]" 
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`}
            </style>
            
            {/* BEGIN: MainHeader */}
            <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Interview Prep</h1>
            </header>
            {/* END: MainHeader */}
            
            {/* BEGIN: LoginFormContainer */}
            <main className="w-full max-w-md bg-[#3D3C5C] rounded-2xl shadow-xl overflow-hidden p-8 md:p-10 border border-[#5A587A]">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold">Log in to Interview Prep</h2>
                </div>
                
                {/* BEGIN: CredentialsForm */}
                <form className="space-y-5" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded-md p-3">
                            {error}
                        </div>
                    )}
                    
                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-[#F5EAEB]/90" htmlFor="email">Email</label>
                        <input 
                            className="w-full px-4 py-3 rounded-md bg-[#F4EAEA] text-gray-900 placeholder-gray-500 border border-[#C2A3A6] focus:ring-2 focus:ring-[#A08E98] focus:border-transparent outline-none transition-shadow text-sm" 
                            id="email" 
                            name="email" 
                            placeholder="Email or email.com" 
                            required 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    {/* Password Input */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-[#F5EAEB]/90" htmlFor="password">Password</label>
                        <input 
                            className="w-full px-4 py-3 rounded-md bg-[#F4EAEA] text-gray-900 placeholder-gray-500 border border-[#C2A3A6] focus:ring-2 focus:ring-[#A08E98] focus:border-transparent outline-none transition-shadow text-sm" 
                            id="password" 
                            name="password" 
                            placeholder="Password" 
                            required 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {/* Forgot Password Link */}
                    <div className="flex justify-end">
                        <a className="text-sm text-[#C2A3A6] hover:underline underline-offset-4 opacity-90 hover:opacity-100 transition-opacity" href="#!">Forgot Password?</a>
                    </div>
                    {/* Sign In Button */}
                    <button 
                        className="w-full py-3 px-4 bg-[#A08E98] hover:bg-[#8C7C85] text-white font-medium rounded-md transition-colors shadow-sm text-sm tracking-wide disabled:opacity-50" 
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                {/* END: CredentialsForm */}
                
                {/* BEGIN: SocialLogins */}
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#5A587A]/50"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-[#3D3C5C] text-[#F5EAEB]/70">or</span>
                        </div>
                    </div>
                    <div className="mt-6 space-y-3">
                        {/* Google Login */}
                        <button className="w-full flex justify-center items-center py-2.5 px-4 border border-[#5A587A] rounded-md shadow-sm bg-transparent hover:bg-white/5 transition-colors text-sm font-medium text-[#F5EAEB]" type="button">
                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                            </svg>
                            Google
                        </button>
                        {/* LinkedIn Login */}
                        <button className="w-full flex justify-center items-center py-2.5 px-4 border border-[#5A587A] rounded-md shadow-sm bg-transparent hover:bg-white/5 transition-colors text-sm font-medium text-[#F5EAEB]" type="button">
                            <svg className="h-5 w-5 mr-2 text-[#0A66C2] bg-white rounded-sm p-[1px]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                            </svg>
                            LinkedIn
                        </button>
                    </div>
                </div>
                {/* END: SocialLogins */}
                
                {/* BEGIN: SignUpPrompt */}
                <div className="mt-8 text-center text-sm">
                    <span className="text-[#F5EAEB]/80">New user? </span>
                    <Link className="text-[#C2A3A6] hover:underline font-medium opacity-90 hover:opacity-100 transition-opacity" to="/signup">Sign up here</Link>
                </div>
                {/* END: SignUpPrompt */}
            </main>
            {/* END: LoginFormContainer */}
        </div>
    );
};

export default LoginPage;