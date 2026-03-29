import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        // Enforce basic auth check
        const session = localStorage.getItem('session_id');
        if (!session) {
            navigate('/login');
        }
    }, [navigate]);

    const handleSignOut = () => {
        localStorage.removeItem('session_id');
        navigate('/login');
    };

    return (
        <div className="bg-background text-on-surface antialiased min-h-screen">
            {/* SideNavBar Shell */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-[#101226] border-r-0 flex flex-col py-6 z-50">
                <div className="px-8 mb-12">
                    <h1 className="text-lg font-semibold tracking-tight text-[#d2c2cf]">The Silent Coach</h1>
                    <p className="text-[0.6875rem] uppercase tracking-[0.05rem] text-outline mt-1">AI Interview Prep</p>
                </div>
                <nav className="flex-1 space-y-1 px-4">
                    <Link className="flex items-center space-x-3 text-[#d2c2cf] bg-[#313349] rounded-lg mx-2 px-4 py-3 transition-all duration-150 ease-in-out scale-95" to="#">
                        <span className="material-symbols-outlined">home</span>
                        <span className="font-medium text-sm">Home</span>
                    </Link>
                    <Link className="flex items-center space-x-3 text-[#968e94] hover:text-[#e0e0fd] hover:bg-[#26283e] px-4 py-3 transition-colors rounded-lg" to="#">
                        <span className="material-symbols-outlined">history</span>
                        <span className="font-medium text-sm">Past Interviews</span>
                    </Link>
                    <Link className="flex items-center space-x-3 text-[#968e94] hover:text-[#e0e0fd] hover:bg-[#26283e] px-4 py-3 transition-colors rounded-lg" to="#">
                        <span className="material-symbols-outlined">leaderboard</span>
                        <span className="font-medium text-sm">Progress</span>
                    </Link>
                    <Link className="flex items-center space-x-3 text-[#968e94] hover:text-[#e0e0fd] hover:bg-[#26283e] px-4 py-3 transition-colors rounded-lg" to="#">
                        <span className="material-symbols-outlined">library_books</span>
                        <span className="font-medium text-sm">Resources</span>
                    </Link>
                </nav>
                <div className="mt-auto px-6">
                    <div className="p-4 rounded-xl bg-surface-container-high border border-outline-variant/10">
                        <p className="text-xs text-outline mb-2">READY TO PRACTICE?</p>
                        <button className="w-full py-2.5 bg-primary text-on-primary rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity">
                            Start Mock Session
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="ml-64 min-h-screen relative flex flex-col overflow-y-auto">
                {/* TopAppBar Shell */}
                <header className="sticky top-0 right-0 w-full h-16 bg-[#101226]/60 backdrop-blur-xl flex justify-between items-center px-8 z-40">
                    <div>
                        <h2 className="text-base tracking-wide font-headline">Hello, Alex</h2>
                    </div>
                    <div className="flex items-center space-x-6">
                        <button className="text-[#e0e0fd] opacity-80 hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <div
                            className="flex items-center space-x-3 group cursor-pointer relative"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/30 relative">
                                <img alt="User Profile Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUpEz7jmEIsLwnmGvE2vCtHKfBevJYAfREGhrIH8AQohrGBhIVOMnOU6KbpZD6ozGU3wPS8L5GRh5_lfuXwmSDBfUodQgn75eqq-A7GYe5_bofw2y-hjAuBOMs9bhOfNy7WZLrELSBU9bLd71o23rHYULIgY3_hTQ2ui68ArtqPfVzn7JQ0r4dBLZ7amnfT-LqIqCM9W9vWO58FXIwWr_ctRA0VZ2s9GbhToQd7NaRYQ8SjHYIG6mExn9JH5lmvsiFTjGicTSFQd8" />
                            </div>
                            <span className="material-symbols-outlined text-outline">expand_more</span>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                                <div className="absolute top-12 right-0 w-48 bg-surface-container-highest rounded-xl shadow-2xl p-2 border border-outline-variant/10 z-50">
                                    <Link className="block px-4 py-2.5 text-sm hover:bg-surface-bright rounded-lg" to="#">Profile</Link>
                                    <Link className="block px-4 py-2.5 text-sm hover:bg-surface-bright rounded-lg" to="#">My Resume</Link>
                                    <Link className="block px-4 py-2.5 text-sm hover:bg-surface-bright rounded-lg" to="#">Settings</Link>
                                    <hr className="my-2 border-outline-variant/10" />
                                    <button
                                        className="w-full text-left block px-4 py-2.5 text-sm text-error hover:bg-error-container/20 rounded-lg"
                                        onClick={handleSignOut}
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Canvas */}
                <div className="p-8">
                    {/* Hero Countdown Cards (Bento Style) */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="relative group overflow-hidden bg-surface-container-high rounded-xl p-6 transition-all duration-300 hover:bg-surface-bright">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined">token</span>
                                </div>
                                <span className="text-[0.6875rem] font-label tracking-widest text-outline">COUNTDOWN</span>
                            </div>
                            <h3 className="text-2xl font-bold text-on-surface">Amazon</h3>
                            <p className="text-secondary text-lg mt-1">in 4 days</p>
                            <div className="mt-6 flex items-center text-xs text-outline group-hover:text-primary transition-colors">
                                <span>Review behavioral prep</span>
                                <span className="material-symbols-outlined text-xs ml-1">arrow_forward</span>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <span className="material-symbols-outlined text-9xl">timer</span>
                            </div>
                        </div>

                        <div className="relative group overflow-hidden bg-surface-container-high rounded-xl p-6 transition-all duration-300 hover:bg-surface-bright">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-secondary">
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                                <span className="text-[0.6875rem] font-label tracking-widest text-outline">COUNTDOWN</span>
                            </div>
                            <h3 className="text-2xl font-bold text-on-surface">Google</h3>
                            <p className="text-secondary text-lg mt-1">in 12 days</p>
                            <div className="mt-6 flex items-center text-xs text-outline group-hover:text-primary transition-colors">
                                <span>System design focus</span>
                                <span className="material-symbols-outlined text-xs ml-1">arrow_forward</span>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <span className="material-symbols-outlined text-9xl">schedule</span>
                            </div>
                        </div>

                        <div className="relative group overflow-hidden bg-surface-container-high rounded-xl p-6 transition-all duration-300 hover:bg-surface-bright">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary-container">
                                    <span className="material-symbols-outlined">public</span>
                                </div>
                                <span className="text-[0.6875rem] font-label tracking-widest text-outline">COUNTDOWN</span>
                            </div>
                            <h3 className="text-2xl font-bold text-on-surface">Meta</h3>
                            <p className="text-secondary text-lg mt-1">in 21 days</p>
                            <div className="mt-6 flex items-center text-xs text-outline group-hover:text-primary transition-colors">
                                <span>Product sense drills</span>
                                <span className="material-symbols-outlined text-xs ml-1">arrow_forward</span>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <span className="material-symbols-outlined text-9xl">event</span>
                            </div>
                        </div>
                    </section>

                    {/* Lower Dashboard Grid */}
                    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Performance Chart (Asymmetric Left) */}
                        <div className="lg:col-span-8 bg-surface-container-low rounded-xl p-8">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h4 className="text-lg font-semibold text-on-surface">Confidence Over Time</h4>
                                    <p className="text-sm text-outline">AI analysis of vocal tone and body language</p>
                                </div>
                                <div className="flex space-x-2">
                                    <span className="px-3 py-1 bg-surface-container-highest text-xs rounded-full text-secondary">Week</span>
                                    <span className="px-3 py-1 text-xs text-outline">Month</span>
                                </div>
                            </div>
                            <div className="h-64 relative">
                                {/* Simulated Chart Visuals */}
                                <div className="absolute inset-0 flex items-end justify-between px-2">
                                    <div className="w-1 bg-primary/20 h-1/4 rounded-t-full"></div>
                                    <div className="w-1 bg-primary/30 h-1/3 rounded-t-full"></div>
                                    <div className="w-1 bg-primary/40 h-1/2 rounded-t-full"></div>
                                    <div className="w-1 bg-primary/60 h-2/3 rounded-t-full"></div>
                                    <div className="w-1 bg-primary h-3/4 rounded-t-full"></div>
                                    <div className="w-1 bg-primary h-4/5 rounded-t-full"></div>
                                    <div className="w-1 bg-primary h-[90%] rounded-t-full"></div>
                                    <div className="w-1 bg-primary/80 h-3/4 rounded-t-full"></div>
                                </div>
                                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                                    <path d="M0 200 Q 100 150, 200 180 T 400 100 T 600 80 T 800 50" fill="none" stroke="#d2c2cf" strokeLinecap="round" strokeWidth="3"></path>
                                    <circle cx="800" cy="50" fill="#d2c2cf" r="5"></circle>
                                </svg>
                                <div className="absolute top-4 right-10 flex items-center space-x-2 bg-surface-bright/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    <span className="text-xs font-medium">88% Confidence Score</span>
                                </div>
                            </div>
                            <div className="mt-6 grid grid-cols-4 gap-4 pt-6 border-t border-outline-variant/10">
                                <div>
                                    <p className="text-[0.6875rem] text-outline uppercase tracking-wider">Tone Clarity</p>
                                    <p className="text-lg font-bold text-on-surface">High</p>
                                </div>
                                <div>
                                    <p className="text-[0.6875rem] text-outline uppercase tracking-wider">Filler Words</p>
                                    <p className="text-lg font-bold text-on-surface">-12%</p>
                                </div>
                                <div>
                                    <p className="text-[0.6875rem] text-outline uppercase tracking-wider">Pace</p>
                                    <p className="text-lg font-bold text-on-surface">Steady</p>
                                </div>
                                <div>
                                    <p className="text-[0.6875rem] text-outline uppercase tracking-wider">Eye Contact</p>
                                    <p className="text-lg font-bold text-on-surface">92%</p>
                                </div>
                            </div>
                        </div>

                        {/* Calendar Section (Right Column) */}
                        <div className="lg:col-span-4 flex flex-col space-y-8">
                            <div className="bg-surface-container-low rounded-xl p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-sm font-semibold text-on-surface">Upcoming Interviews</h4>
                                    <span className="material-symbols-outlined text-outline text-sm">calendar_today</span>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex space-x-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-surface-container-highest rounded-lg flex flex-col items-center justify-center border border-outline-variant/10">
                                            <span className="text-xs text-outline leading-none">OCT</span>
                                            <span className="text-lg font-bold text-on-surface">14</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-on-surface">Amazon L5 SDE</p>
                                            <p className="text-xs text-outline">Virtual On-site • 10:00 AM</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-surface-container-highest rounded-lg flex flex-col items-center justify-center border border-outline-variant/10">
                                            <span className="text-xs text-outline leading-none">OCT</span>
                                            <span className="text-lg font-bold text-on-surface">22</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-on-surface">Google Product Design</p>
                                            <p className="text-xs text-outline">Whiteboard Session • 2:30 PM</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-surface-container-highest rounded-lg flex flex-col items-center justify-center border border-outline-variant/10">
                                            <span className="text-xs text-outline leading-none">NOV</span>
                                            <span className="text-lg font-bold text-on-surface">02</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-on-surface">Meta Reality Labs</p>
                                            <p className="text-xs text-outline">Behavioral Round • 11:15 AM</p>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full mt-8 py-2 text-xs font-semibold text-primary border border-outline-variant/20 rounded-lg hover:bg-surface-bright transition-colors">
                                    View Full Schedule
                                </button>
                            </div>

                            {/* AI Insights Mini-Card */}
                            <div className="bg-secondary-container/20 rounded-xl p-6 relative overflow-hidden group">
                                <div className="relative z-10">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                                        <span className="text-[0.6875rem] font-bold tracking-widest text-secondary uppercase">AI Coach Insight</span>
                                    </div>
                                    <p className="text-sm leading-relaxed text-on-secondary-container italic">
                                        "You tend to speed up when talking about 'Scale'. Practice taking a 2-second breath before explaining complex architectures."
                                    </p>
                                </div>
                                <div className="absolute -right-6 -bottom-6 text-secondary/10 group-hover:text-secondary/20 transition-colors">
                                    <span className="material-symbols-outlined text-8xl">psychology</span>
                                </div>
                            </div>
                        </div>

                        {/* New Monthly Calendar View */}
                        <div className="lg:col-span-8 bg-surface-container-low rounded-xl p-8">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h4 className="text-lg font-semibold text-on-surface">October 2024</h4>
                                    <p className="text-sm text-outline">3 scheduled sessions this month</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <button className="p-2 hover:bg-surface-bright rounded-lg text-outline">
                                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                                    </button>
                                    <button className="p-2 hover:bg-surface-bright rounded-lg text-outline">
                                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-7 gap-px text-center text-[0.6875rem] font-bold text-outline tracking-wider uppercase mb-4">
                                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                            </div>
                            <div className="grid grid-cols-7 gap-px h-[280px]">
                                <div className="p-2 border border-outline-variant/5 text-outline/30 flex items-start justify-center text-xs">29</div>
                                <div className="p-2 border border-outline-variant/5 text-outline/30 flex items-start justify-center text-xs">30</div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs">1</div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs">2</div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs">3</div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs">4</div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs">5</div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs">6</div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs">7</div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs">8</div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs">9</div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs">10</div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs">11</div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs">12</div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs">13</div>
                                <div className="p-2 border border-outline-variant/5 bg-primary/10 flex flex-col items-center text-xs">
                                    <span className="font-bold text-primary">14</span>
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary"></div>
                                </div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs">15</div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs">16</div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs">17</div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs">18</div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs">19</div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs">20</div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs">21</div>
                                <div className="p-2 border border-outline-variant/5 bg-secondary/10 flex flex-col items-center text-xs">
                                    <span className="font-bold text-secondary">22</span>
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-secondary"></div>
                                </div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs">23</div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs">24</div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs">25</div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs">26</div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs">27</div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs">28</div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs">29</div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs">30</div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs text-outline/30">31</div>
                                <div className="p-2 border border-outline-variant/5 flex items-start justify-center text-xs text-outline/30">1</div>
                                <div className="p-2 border border-outline-variant/5 bg-primary-container/10 flex flex-col items-center text-xs text-outline/30">
                                    <span className="font-bold">2</span>
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary-container"></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Resources Section */}
                    <section className="mt-12">
                        <h4 className="text-lg font-headline font-semibold mb-6">Mastering Your Narrative</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-surface-container-high p-4 rounded-xl flex items-center space-x-4 hover:bg-surface-bright cursor-pointer transition-colors">
                                <div className="w-12 h-12 bg-surface-container-highest rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined text-outline">description</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">STAR Framework</p>
                                    <p className="text-xs text-outline">Interactive Guide</p>
                                </div>
                            </div>
                            <div className="bg-surface-container-high p-4 rounded-xl flex items-center space-x-4 hover:bg-surface-bright cursor-pointer transition-colors">
                                <div className="w-12 h-12 bg-surface-container-highest rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined text-outline">record_voice_over</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Negotiation Lab</p>
                                    <p className="text-xs text-outline">Roleplay Module</p>
                                </div>
                            </div>
                            <div className="bg-surface-container-high p-4 rounded-xl flex items-center space-x-4 hover:bg-surface-bright cursor-pointer transition-colors">
                                <div className="w-12 h-12 bg-surface-container-highest rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined text-outline">analytics</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Salary Insights</p>
                                    <p className="text-xs text-outline">2024 Tech Data</p>
                                </div>
                            </div>
                            <div className="bg-surface-container-high p-4 rounded-xl flex items-center space-x-4 hover:bg-surface-bright cursor-pointer transition-colors">
                                <div className="w-12 h-12 bg-surface-container-highest rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined text-outline">school</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">System Design</p>
                                    <p className="text-xs text-outline">Advanced Prep</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Floating Action Button */}
                <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform z-50">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
                </button>
            </main>
        </div>
    );
};

export default DashboardPage;