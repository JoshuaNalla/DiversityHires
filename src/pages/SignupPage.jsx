import React from 'react';
import { Link } from 'react-router-dom';

const SignupPage = () => {
    return (
        <div 
            className="bg-[#23253a] min-h-screen flex items-center justify-center p-4"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`}
            </style>
            
            {/* BEGIN: SignUpCard */}
            <main className="bg-[#49506c] w-full max-w-[420px] rounded-2xl shadow-2xl p-8 sm:p-10" data-purpose="sign-up-container">
                {/* Header */}
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-[#fff] tracking-tight">Interview Prep Sign Up</h1>
                </header>
                
                {/* Form Section */}
                <form action="#" className="space-y-5" data-purpose="sign-up-form" method="POST">
                    {/* Full Name Field */}
                    <div data-purpose="form-group-name">
                        <label className="block text-sm font-medium text-[#e0e0e0] mb-1.5" htmlFor="fullName">Full Name</label>
                        <input className="w-full px-4 py-3 bg-[#f6ebe3] text-[#333] placeholder-gray-500 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-[#8caeb5] focus:border-transparent transition duration-200" id="fullName" name="fullName" placeholder="Full Name" required type="text" />
                    </div>
                    
                    {/* Email Field */}
                    <div data-purpose="form-group-email">
                        <label className="block text-sm font-medium text-[#e0e0e0] mb-1.5" htmlFor="email">Email</label>
                        <input className="w-full px-4 py-3 bg-[#f6ebe3] text-[#333] placeholder-gray-500 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-[#8caeb5] focus:border-transparent transition duration-200" id="email" name="email" placeholder="Email@gmail.com" required type="email" />
                    </div>
                    
                    {/* Password Field */}
                    <div data-purpose="form-group-password">
                        <label className="block text-sm font-medium text-[#e0e0e0] mb-1.5" htmlFor="password">Password</label>
                        <div className="relative">
                            <input className="w-full px-4 py-3 bg-[#f6ebe3] text-[#333] placeholder-gray-500 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-[#8caeb5] focus:border-transparent transition duration-200 pr-12" id="password" name="password" placeholder="Password" required type="password" />
                            {/* Password Visibility Toggle (Visual Only) */}
                            <button className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none" type="button">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    {/* Submit Button */}
                    <div className="pt-2" data-purpose="form-submit">
                        <button className="w-full bg-[#8caeb5] text-[#fff] font-semibold py-3 px-4 rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#49506c] focus:ring-[#8caeb5] transition duration-200" type="submit">
                            Create Account
                        </button>
                    </div>
                </form>
                
                {/* Divider Section */}
                <div className="my-6 flex items-center justify-center space-x-4" data-purpose="divider">
                    <div className="h-px bg-[#6e768e] flex-1"></div>
                    <span className="text-[#e0e0e0] text-sm font-medium">or</span>
                    <div className="h-px bg-[#6e768e] flex-1"></div>
                </div>
                
                {/* Social Login Section */}
                <div className="space-y-3" data-purpose="social-login">
                    {/* Google Sign In */}
                    <button className="w-full flex items-center justify-center px-4 py-2.5 border border-[#6e768e] rounded-lg text-[#fff] hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#49506c] focus:ring-[#6e768e] transition duration-200" type="button">
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                        </svg>
                        <span className="text-sm font-medium">Sign up with Google</span>
                    </button>
                    
                    {/* LinkedIn Sign In */}
                    <button className="w-full flex items-center justify-center px-4 py-2.5 border border-[#6e768e] rounded-lg text-[#fff] hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#49506c] focus:ring-[#6e768e] transition duration-200" type="button">
                        <svg className="w-5 h-5 mr-3 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                        </svg>
                        <span className="text-sm font-medium">Sign up with LinkedIn</span>
                    </button>
                </div>
                
                {/* Footer */}
                <footer className="mt-8 text-center" data-purpose="sign-up-footer">
                    <p className="text-sm text-[#e0e0e0]">
                        Already have an account?{" "}
                        <Link className="text-[#fff] hover:underline font-medium" to="/login">Sign in here</Link>
                    </p>
                </footer>
            </main>
            {/* END: SignUpCard */}
        </div>
    );
};

export default SignupPage;