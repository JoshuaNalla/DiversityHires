import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CreateDemoInterviewModal from '../components/CreateDemoInterviewModal';

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const INTERVIEW_MARKERS = [
    // Upcoming interviews (April 2026)
    { year: 2026, month: 3, day: 2, company: 'Amazon', dotClass: 'bg-red-500', bgClass: 'bg-red-500/10', textClass: 'text-red-400' },
    { year: 2026, month: 3, day: 14, company: 'Google', dotClass: 'bg-primary', bgClass: 'bg-primary/10', textClass: 'text-primary' },
    { year: 2026, month: 3, day: 22, company: 'Meta', dotClass: 'bg-secondary', bgClass: 'bg-secondary/10', textClass: 'text-secondary' },
    { year: 2026, month: 3, day: 26, company: 'Microsoft', dotClass: 'bg-sky-400', bgClass: 'bg-sky-400/10', textClass: 'text-sky-400' },
    // Stacked interviews (May 2026)
    { year: 2026, month: 4, day: 3, company: 'Apple', dotClass: 'bg-zinc-300', bgClass: 'bg-zinc-300/10', textClass: 'text-zinc-300' },
    { year: 2026, month: 4, day: 10, company: 'Nvidia', dotClass: 'bg-green-400', bgClass: 'bg-green-400/10', textClass: 'text-green-400' },
];

const STACKED_INTERVIEWS = [
    {
        company: 'Microsoft', role: 'SDE II', days: 28, icon: 'window',
        date: 'April 26, 2026', time: '10:00 AM', type: 'Technical',
        iconColor: 'text-sky-400', tagColor: 'bg-sky-500/10 text-sky-400',
        actionLabel: 'Review system design',
        jobDescription: 'As an SDE II at Microsoft, you will design and build scalable backend services powering Azure cloud infrastructure. You will collaborate with cross-functional teams to ship high-impact features used by millions of enterprise customers worldwide. The role emphasizes distributed systems expertise, code quality, and mentoring junior engineers.',
        interviewers: [
            { name: 'David Kim', bio: 'Principal Engineer on the Azure Core team with 12 years at Microsoft. Specializes in distributed storage systems and consensus protocols.' },
            { name: 'Priya Nair', bio: 'Senior Engineering Manager overseeing the Azure Compute group. Previously led teams at Amazon Web Services before joining Microsoft in 2019.' },
            { name: 'Tom Brzeski', bio: 'Staff Software Engineer focused on reliability engineering. Co-authored several internal design standards for fault-tolerant microservices.' },
        ],
    },
    {
        company: 'Apple', role: 'iOS Eng', days: 35, icon: 'smartphone',
        date: 'May 3, 2026', time: '1:00 PM', type: 'On-site',
        iconColor: 'text-zinc-300', tagColor: 'bg-zinc-500/10 text-zinc-300',
        actionLabel: 'Practice Swift patterns',
        jobDescription: 'Apple is seeking a passionate iOS Engineer to join the Human Interface team building next-generation UIKit and SwiftUI frameworks. You will work directly with hardware teams to optimize rendering pipelines and deliver smooth 120 Hz experiences on iPhone and iPad. Deep knowledge of Swift concurrency and Metal is highly valued.',
        interviewers: [
            { name: 'Sarah Okonkwo', bio: 'Engineering lead for UIKit at Apple with over a decade of experience shipping flagship iOS features. Holds multiple patents in GPU-accelerated UI rendering.' },
            { name: 'Marcus Chen', bio: 'Senior Swift compiler engineer who contributes to the open-source Swift project. Known for his deep dives into async/await internals.' },
        ],
    },
    {
        company: 'Nvidia', role: 'Sr. GPU Eng', days: 42, icon: 'memory',
        date: 'May 10, 2026', time: '3:30 PM', type: 'System Design',
        iconColor: 'text-green-400', tagColor: 'bg-green-500/10 text-green-400',
        actionLabel: 'GPU architecture prep',
        jobDescription: 'Nvidia is hiring a Senior GPU Engineer to architect and optimize CUDA kernels for next-generation AI training accelerators. You will partner with silicon architects to co-design memory hierarchies and interconnect topologies that push the boundaries of transformer model training. Experience with cuDNN, NCCL, and mixed-precision arithmetic is essential.',
        interviewers: [
            { name: 'Elena Vasquez', bio: 'Principal Research Scientist at Nvidia working on GPU memory architecture. She holds a PhD from MIT in computer architecture and has authored 20+ papers on accelerator design.' },
            { name: 'Raj Menon', bio: 'Director of CUDA Platform Engineering with 15 years at Nvidia. Raj led the CUDA 12 launch and oversees the developer tools ecosystem globally.' },
            { name: 'Chris Howell', bio: 'Staff Engineer on the Deep Learning Frameworks team. Focuses on performance profiling and kernel fusion techniques for large language models.' },
        ],
    },
];

const PAST_INTERVIEWS = [
    {
        company: 'Uber', role: 'SWE L5', daysAgo: 20, icon: 'directions_car', action: 'See analysis', iconColor: 'text-amber-400',
        date: 'March 9, 2026', time: '10:00 AM', type: 'Technical', days: -20,
        tagColor: 'bg-amber-500/10 text-amber-400',
        jobDescription: 'The SWE L5 role at Uber sits within the Maps & Navigation platform, responsible for real-time routing algorithms serving millions of trips daily. You will own entire subsystems end-to-end, from data ingestion pipelines to driver-facing mobile APIs. Strong knowledge of geospatial data structures and low-latency system design is required.',
        interviewers: [
            { name: 'Anya Petrova', bio: 'Staff Engineer on Uber Maps with expertise in computational geometry. She previously worked at Google Maps before moving to Uber in 2021.' },
            { name: 'James Oduya', bio: 'Engineering Manager for the Core Routing team. James has driven several platform migrations and champions inclusive engineering practices at Uber.' },
        ],
    },
    {
        company: 'Shopify', role: 'Full Stack', daysAgo: 12, icon: 'storefront', action: 'Review notes', iconColor: 'text-sky-400',
        date: 'March 17, 2026', time: '2:00 PM', type: 'Behavioral', days: -12,
        tagColor: 'bg-sky-500/10 text-sky-400',
        jobDescription: 'Shopify is looking for a Full Stack Engineer to join the Checkout Experience team, one of the highest-traffic surfaces on the internet during peak commerce events. You will build Ruby on Rails APIs and React storefronts that enable merchants worldwide to customize their checkout flows. A passion for developer experience and platform reliability is essential.',
        interviewers: [
            { name: 'Lena Garbutt', bio: 'Senior Product Engineer at Shopify who has shipped the Checkout extensibility platform. She is a Ruby core contributor and advocates for open-source tooling.' },
            { name: 'Wei Zhang', bio: 'Tech Lead for the Storefront Renderer team. Wei focuses on WebAssembly and edge-rendering strategies to cut checkout latency globally.' },
            { name: 'Omar Haddad', bio: 'Staff Engineer specializing in payment integrations. Omar coordinates across 40+ payment gateway partners and leads compliance architecture reviews.' },
        ],
    },
    {
        company: 'Stripe', role: 'Backend Eng', daysAgo: 5, icon: 'payments', action: 'View feedback', iconColor: 'text-emerald-400',
        date: 'March 24, 2026', time: '11:00 AM', type: 'System Design', days: -5,
        tagColor: 'bg-emerald-500/10 text-emerald-400',
        jobDescription: 'Stripe is hiring a Backend Engineer to work on the Payments Infrastructure team, building the core ledger and settlement systems that process billions of dollars in transactions annually. You will design fault-tolerant distributed systems with a focus on financial consistency, auditability, and sub-millisecond reconciliation. Experience with event-driven architectures and strong consistency guarantees is a must.',
        interviewers: [
            { name: 'Nina Bhatia', bio: 'Principal Engineer at Stripe focused on the global ledger. Nina has a background in formal verification and applies rigorous correctness reasoning to financial systems.' },
            { name: 'Connor Walsh', bio: 'Engineering Manager overseeing Stripe\'s settlement infrastructure. He joined from Jane Street where he worked on high-frequency trading systems.' },
        ],
    },
];

// Data for clickable countdown cards & the urgent strip
const UPCOMING_CARDS = [
    {
        company: 'Amazon', role: 'L5 SDE',
        date: 'April 2, 2026', time: '11:30 AM', type: 'Virtual On-site',
        icon: 'token', iconColor: 'text-primary', tagColor: 'bg-primary/10 text-primary',
        days: 4, actionLabel: 'Review behavioral prep',
        jobDescription: 'Amazon is seeking an L5 Software Development Engineer to join the AWS Lambda team, focusing on the serverless compute runtime that powers millions of customer functions globally. You will lead design and delivery of features that improve cold-start latency, resource isolation, and developer experience for Lambda. Ownership mentality, bar-raising technical judgment, and alignment with Amazon Leadership Principles are central to success in this role.',
        interviewers: [
            { name: 'Fatima Al-Hassan', bio: 'Senior Principal Engineer on AWS Lambda with 9 years at Amazon. She leads technical direction for the execution environment and is a two-time Amazon Bar Raiser.' },
            { name: 'Derek Simmons', bio: 'Senior Engineering Manager for Serverless Compute. Derek oversees a 40-person org and previously built supply chain optimization systems at Amazon Logistics.' },
            { name: 'Ayasha Redcloud', bio: 'Staff SDE specializing in container security and micro-VM technology. She contributed to the open-source Firecracker VMM project that underlies Lambda.' },
        ],
    },
    {
        company: 'Google', role: 'Product Design',
        date: 'April 14, 2026', time: '2:30 PM', type: 'System Design',
        icon: 'search', iconColor: 'text-secondary', tagColor: 'bg-secondary/10 text-secondary',
        days: 12, actionLabel: 'System design focus',
        jobDescription: 'Google is hiring a Product Designer for the Search Experience team, where you will shape the visual language and interaction patterns for Google Search across web, mobile, and emerging surfaces. You will conduct user research, prototype rapidly, and partner closely with engineers to ship designs that reach billions of users. A deep understanding of accessibility standards and inclusive design practices is expected.',
        interviewers: [
            { name: 'Sophie Nguyen', bio: 'Principal UX Designer at Google with 11 years shaping core Search and Lens experiences. She holds an MA in Interaction Design from the Royal College of Art.' },
            { name: 'Kwame Asante', bio: 'Senior UX Research Lead specializing in global user studies. Kwame manages research partnerships across Africa, Southeast Asia, and Latin America to ensure designs work for everyone.' },
        ],
    },
    {
        company: 'Meta', role: 'Reality Labs',
        date: 'April 22, 2026', time: '11:15 AM', type: 'Behavioral',
        icon: 'public', iconColor: 'text-primary-container', tagColor: 'bg-primary-container/10 text-primary-container',
        days: 21, actionLabel: 'Product sense drills',
        jobDescription: 'Meta Reality Labs is looking for a Product Manager to drive the roadmap for Quest OS social features, enabling meaningful connections inside virtual and mixed-reality environments. You will synthesize insights from hardware, software, and research teams to define a coherent product vision and ship experiences that redefine human presence at a distance. Strong analytical thinking, cross-functional influence, and a genuine passion for immersive technology are essential.',
        interviewers: [
            { name: 'Isabelle Moreau', bio: 'Director of Product at Reality Labs overseeing social presence and avatars. She joined Meta from Oculus in 2020 and has shipped three major Quest OS releases.' },
            { name: 'Tariq Osei', bio: 'Research Scientist focusing on social perception in VR. Tariq\'s work on nonverbal communication cues in avatars has been published at ACM CHI and IEEE VR.' },
            { name: 'Mia Johansson', bio: 'Technical Program Manager who coordinates hardware-software alignment across Quest headset generations. She ensures cross-org dependencies are resolved well ahead of launch deadlines.' },
        ],
    },
];

const COMPANY_ICONS = {
    Amazon: { icon: 'bi-amazon', color: '#FF9900', bg: '#111' },
    Google: { icon: 'bi-google', color: '#4285F4', bg: '#fff' },
    Meta: { icon: 'bi-meta', color: '#0082FB', bg: '#fff' },
    Microsoft: { icon: 'bi-microsoft', color: '#00a4ef', bg: '#fff' },
    Apple: { icon: 'bi-apple', color: '#1d1d1f', bg: '#fff' },
    Nvidia: { icon: 'bi-nvidia', color: '#76b900', bg: '#000' },
    Stripe: { icon: 'bi-stripe', color: '#6772E5', bg: '#fff' },
    Shopify: { letter: 'S', color: '#fff', bg: '#96BF48' },
    Uber: { letter: 'U', color: '#fff', bg: '#000' },
};

const CompanyLogo = ({ company, size = 'w-8 h-8' }) => {
    const cfg = COMPANY_ICONS[company];
    if (!cfg) return null;
    return (
        <div
            className={`${size} rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden`}
            style={{ background: cfg.bg }}
        >
            {cfg.icon
                ? <i className={`bi ${cfg.icon} text-lg`} style={{ color: cfg.color }} />
                : <span className="text-xs font-bold" style={{ color: cfg.color }}>{cfg.letter}</span>
            }
        </div>
    );
};

const DashboardPage = () => {
    const navigate = useNavigate();
    const userName = (localStorage.getItem('username') || 'User').split(' ')[0];

    // ── UI state ────────────────────────────────────────────────────────────
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showPast, setShowPast] = useState(false);
    const [interviewPage, setInterviewPage] = useState(1); // 0=past, 1=upcoming pg1, 2=upcoming pg2
    const [selectedInterview, setSelectedInterview] = useState(null);   // detail popup
    const [isModalOpen, setIsModalOpen] = useState(false);  // create popup
    const [isDemoInterview, setIsDemoInterview] = useState(false);
    const [showDemoSetup, setShowDemoSetup] = useState(false);
    const [newInterview, setNewInterview] = useState({ title: '', date: '', time: '', company: '', type: 'Behavioral' });

    // Multilingual greetings
    const greetings = ['Hello', 'Hola', 'Bonjour', 'Hallo', 'Ciao', 'Olá', 'Привет', 'こんにちは', '안녕하세요', 'مرحبا', 'Namaste', 'Habari', 'Salam', 'Sawubona'];
    const [greetingIndex, setGreetingIndex] = useState(0);
    const [greetingFade, setGreetingFade] = useState(true);

    const dropdownRef = useRef(null);

    // Today snapshot
    const todayObj = new Date();
    const todayYear = todayObj.getFullYear();
    const todayMonth = todayObj.getMonth();
    const todayDay = todayObj.getDate();

    const [calendarDate, setCalendarDate] = useState(() => new Date(todayYear, todayMonth, 1));

    // Auth guard
    useEffect(() => {
        const session = localStorage.getItem('session_id');
        if (!session) navigate('/login');
    }, [navigate]);

    // Live countdown timer for the urgent strip (Amazon — April 2, 2026 11:30 AM)
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
    useEffect(() => {
        const target = new Date('2026-04-02T11:30:00').getTime();
        const tick = () => {
            const diff = Math.max(0, target - Date.now());
            setCountdown({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                mins: Math.floor((diff % 3600000) / 60000),
                secs: Math.floor((diff % 60000) / 1000),
            });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    // Close profile dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsMenuOpen(false);
            }
        };
        if (isMenuOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isMenuOpen]);

    // Rotate greetings every 2 seconds with fade
    useEffect(() => {
        const id = setInterval(() => {
            setGreetingFade(false);
            setTimeout(() => {
                setGreetingIndex(prev => (prev + 1) % greetings.length);
                setGreetingFade(true);
            }, 400);
        }, 2000);
        return () => clearInterval(id);
    }, [greetings.length]);

    const handleSignOut = () => {
        localStorage.removeItem('session_id');
        localStorage.removeItem('username');
        navigate('/');
    };

    const navigateCalendar = (dir) => {
        setCalendarDate(prev => {
            const next = new Date(prev.getFullYear(), prev.getMonth() + dir, 1);
            const diff = (next.getFullYear() - todayYear) * 12 + (next.getMonth() - todayMonth);
            if (diff < -3 || diff > 3) return prev;
            return next;
        });
    };

    const openCreateModal = (date = '') => {
        setNewInterview({ title: '', date, time: '', company: '', type: 'Behavioral' });
        setIsDemoInterview(false);
        setIsModalOpen(true);
    };

    // ── Calendar computation ────────────────────────────────────────────────
    const calYear = calendarDate.getFullYear();
    const calMonth = calendarDate.getMonth();
    const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
    const daysInCalMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const daysInPrevCalMonth = new Date(calYear, calMonth, 0).getDate();
    const totalCells = Math.ceil((firstDayOfWeek + daysInCalMonth) / 7) * 7;

    const calendarCells = [];
    for (let i = firstDayOfWeek - 1; i >= 0; i--)
        calendarCells.push({ day: daysInPrevCalMonth - i, type: 'prev' });
    for (let d = 1; d <= daysInCalMonth; d++)
        calendarCells.push({ day: d, type: 'current' });
    let nd = 1;
    while (calendarCells.length < totalCells)
        calendarCells.push({ day: nd++, type: 'next' });

    const getMarker = (cell) => {
        if (cell.type !== 'current') return null;
        return INTERVIEW_MARKERS.find(m => m.year === calYear && m.month === calMonth && m.day === cell.day) || null;
    };
    const isToday = (cell) =>
        cell.type === 'current' && calYear === todayYear && calMonth === todayMonth && cell.day === todayDay;

    const sessionCount = INTERVIEW_MARKERS.filter(m => m.year === calYear && m.month === calMonth).length;

    // ── Shared styles ───────────────────────────────────────────────────────
    const inputCls = "w-full bg-[#1e2035] border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary/50 transition-colors placeholder:text-outline/40";
    const labelCls = "block text-xs text-outline mb-1.5 tracking-wide uppercase";

    // Sidebar derived widths
    const sidebarW = sidebarOpen ? 'w-64' : 'w-[60px]';
    const mainML = sidebarOpen ? 'ml-64' : 'ml-[60px]';

    return (
        <div className="bg-background text-on-surface antialiased min-h-screen">

            {/* ══════════════════════════════════════════════════════════════
                INTERVIEW DETAIL POPUP  (75 % of viewport)
            ══════════════════════════════════════════════════════════════ */}
            {selectedInterview && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center">
                    {/* Blurred backdrop over the remaining ~25% edges */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-md"
                        onClick={() => setSelectedInterview(null)}
                    />
                    <div className="relative bg-[#131525] border border-outline-variant/20 rounded-2xl shadow-2xl
                        w-[75vw] max-h-[80vh] overflow-y-auto flex flex-col">

                        {/* Close */}
                        <button
                            onClick={() => setSelectedInterview(null)}
                            className="absolute top-6 right-6 text-outline hover:text-on-surface transition-colors z-10"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        {/* Header band */}
                        <div className="px-12 pt-12 pb-8 border-b border-outline-variant/10">
                            <div className={`inline-flex items-center space-x-2 text-xs font-semibold px-3 py-1 rounded-full mb-6 ${selectedInterview.tagColor}`}>
                                <span className="material-symbols-outlined text-xs">{selectedInterview.icon}</span>
                                <span>{selectedInterview.type}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <CompanyLogo company={selectedInterview.company} size="w-14 h-14" />
                                <h2 className="text-5xl font-bold text-on-surface tracking-tight">
                                    {selectedInterview.company}
                                </h2>
                            </div>
                            <p className="text-xl text-outline mt-2">{selectedInterview.role}</p>
                        </div>

                        {/* Info grid */}
                        <div className="px-12 py-8 grid grid-cols-3 gap-8 border-b border-outline-variant/10">
                            <div>
                                <p className={labelCls}>Date</p>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className="material-symbols-outlined text-outline text-base">calendar_today</span>
                                    <span className="text-base font-medium text-on-surface">{selectedInterview.date}</span>
                                </div>
                            </div>
                            <div>
                                <p className={labelCls}>Time</p>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className="material-symbols-outlined text-outline text-base">schedule</span>
                                    <span className="text-base font-medium text-on-surface">{selectedInterview.time}</span>
                                </div>
                            </div>
                            <div>
                                <p className={labelCls}>Countdown</p>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className="material-symbols-outlined text-outline text-base">timer</span>
                                    <span className="text-base font-medium text-on-surface">in {selectedInterview.days} days</span>
                                </div>
                            </div>
                        </div>

                        {/* Job Description */}
                        {selectedInterview.jobDescription && (
                            <div className="px-12 py-8 border-b border-outline-variant/10">
                                <p className={labelCls}>Job Description</p>
                                <p className="text-sm text-on-surface/80 leading-relaxed mt-2">
                                    {selectedInterview.jobDescription}
                                </p>
                            </div>
                        )}

                        {/* Interviewers */}
                        {selectedInterview.interviewers && selectedInterview.interviewers.length > 0 && (
                            <div className="px-12 py-8 border-b border-outline-variant/10">
                                <p className={labelCls}>Your Interviewers</p>
                                <div className="mt-4 flex flex-col space-y-4">
                                    {selectedInterview.interviewers.map((interviewer, idx) => (
                                        <div key={idx} className="flex items-start space-x-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                                <span className="text-sm font-bold text-primary">
                                                    {interviewer.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-on-surface">{interviewer.name}</p>
                                                <p className="text-xs text-outline leading-relaxed mt-0.5">{interviewer.bio}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="px-12 py-8 flex items-center space-x-4">
                            <button className="px-8 py-3 bg-primary text-on-primary rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex items-center space-x-2">
                                <span className="material-symbols-outlined text-sm">play_arrow</span>
                                <span>Start Mock Session</span>
                            </button>
                            <button className="px-8 py-3 border border-outline-variant/30 text-on-surface rounded-xl text-sm hover:bg-surface-bright transition-colors flex items-center space-x-2">
                                <span className="material-symbols-outlined text-sm">edit</span>
                                <span>Edit</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                CREATE DEMO SETUP MODAL
            ══════════════════════════════════════════════════════════════ */}
            {showDemoSetup && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDemoSetup(false)} />
                    <div className="relative w-full max-w-5xl h-full shadow-2xl">
                        <CreateDemoInterviewModal onClose={() => setShowDemoSetup(false)} />
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                CREATE INTERVIEW MODAL
            ══════════════════════════════════════════════════════════════ */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="relative bg-[#131525] border border-outline-variant/20 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-2">
                                <span className="material-symbols-outlined text-primary text-sm">event_available</span>
                                <h3 className="text-base font-semibold text-on-surface">New Interview</h3>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-outline hover:text-on-surface transition-colors p-1"
                            >
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className={labelCls}>Interview Title</label>
                                <input className={inputCls} placeholder="e.g. Amazon L5 SDE – Final Round" type="text"
                                    value={newInterview.title} onChange={e => setNewInterview(p => ({ ...p, title: e.target.value }))} />
                            </div>
                            <div>
                                <label className={labelCls}>Company</label>
                                <input className={inputCls} placeholder="e.g. Amazon" type="text"
                                    value={newInterview.company} onChange={e => setNewInterview(p => ({ ...p, company: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Date</label>
                                    <input className={inputCls} type="date" style={{ colorScheme: 'dark' }}
                                        value={newInterview.date} onChange={e => setNewInterview(p => ({ ...p, date: e.target.value }))} />
                                </div>
                                <div>
                                    <label className={labelCls}>Time</label>
                                    <input className={inputCls} type="time" style={{ colorScheme: 'dark' }}
                                        value={newInterview.time} onChange={e => setNewInterview(p => ({ ...p, time: e.target.value }))} />
                                </div>
                            </div>
                            <div>
                                <label className={labelCls}>Interview Type</label>
                                <select className={inputCls} style={{ colorScheme: 'dark' }}
                                    value={newInterview.type} onChange={e => setNewInterview(p => ({ ...p, type: e.target.value }))}>
                                    <option>Behavioral</option>
                                    <option>Technical</option>
                                    <option>System Design</option>
                                    <option>HR</option>
                                </select>
                            </div>

                            {/* AI Demo Toggle */}
                            <div className="flex items-center justify-between bg-primary/10 border border-primary/20 p-4 rounded-xl mt-4 text-left">
                                <div className="flex items-center space-x-3">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={isDemoInterview} onChange={(e) => setIsDemoInterview(e.target.checked)} />
                                        <div className="w-10 h-5 bg-surface-bright rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                                    </label>
                                    <span className="text-sm font-semibold text-primary">Demo Interview (AI)</span>
                                </div>
                                <div className="group relative focus:outline-none flex items-center">
                                    <span className="material-symbols-outlined text-primary/70 text-base cursor-help">info</span>
                                    <div className="absolute right-0 bottom-full mb-2 w-60 bg-surface-container-highest border border-outline-variant/10 text-outline text-xs p-3 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-xl">
                                        A demo interview schedules an interactive session with our AI service. Unchecking it serves purely as a calendar reminder.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-3 mt-8">
                            <button onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-2.5 border border-outline-variant/20 rounded-lg text-sm text-outline hover:bg-surface-bright transition-colors">
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    if (isDemoInterview) setShowDemoSetup(true);
                                }}
                                className="flex-1 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                                Save Interview
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                SIDEBAR  (collapsible)
            ══════════════════════════════════════════════════════════════ */}
            <aside className={`fixed left-0 top-0 h-full flex flex-col py-6 z-50 bg-[#101226] transition-all duration-300 ease-in-out overflow-hidden ${sidebarW}`}>

                {/* Hamburger + Logo */}
                <div className={`flex items-start mb-10 ${sidebarOpen ? 'px-6 justify-between' : 'px-0 justify-center'}`}>
                    {sidebarOpen && (
                        <div className="px-2">
                            <h1 className="text-lg font-semibold tracking-tight text-[#d2c2cf] whitespace-nowrap">The Silent Coach</h1>
                            <p className="text-[0.6875rem] uppercase tracking-[0.05rem] text-outline mt-1 whitespace-nowrap">AI Interview Prep</p>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(o => !o)}
                        className="text-[#968e94] hover:text-[#d2c2cf] transition-colors flex-shrink-0 p-1"
                        title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                    >
                        <span className="material-symbols-outlined">{sidebarOpen ? 'menu_open' : 'menu'}</span>
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 space-y-1 px-2">
                    <Link
                        className={`flex items-center text-[#d2c2cf] bg-[#313349] rounded-lg py-3 transition-all duration-150 ease-in-out scale-95 ${sidebarOpen ? 'space-x-3 px-4 mx-2' : 'justify-center px-0 mx-1'}`}
                        to="#"
                    >
                        <span className="material-symbols-outlined flex-shrink-0">home</span>
                        {sidebarOpen && <span className="font-medium text-sm whitespace-nowrap">Home</span>}
                    </Link>
                    <Link
                        className={`flex items-center text-[#968e94] hover:text-[#e0e0fd] hover:bg-[#26283e] py-3 transition-colors rounded-lg ${sidebarOpen ? 'space-x-3 px-4' : 'justify-center px-0'}`}
                        to="#"
                    >
                        <span className="material-symbols-outlined flex-shrink-0">history</span>
                        {sidebarOpen && <span className="font-medium text-sm whitespace-nowrap">Past Interviews</span>}
                    </Link>
                    <Link
                        className={`flex items-center text-[#968e94] hover:text-[#e0e0fd] hover:bg-[#26283e] py-3 transition-colors rounded-lg ${sidebarOpen ? 'space-x-3 px-4' : 'justify-center px-0'}`}
                        to="#"
                    >
                        <span className="material-symbols-outlined flex-shrink-0">leaderboard</span>
                        {sidebarOpen && <span className="font-medium text-sm whitespace-nowrap">Progress</span>}
                    </Link>
                    <Link
                        className={`flex items-center text-[#968e94] hover:text-[#e0e0fd] hover:bg-[#26283e] py-3 transition-colors rounded-lg ${sidebarOpen ? 'space-x-3 px-4' : 'justify-center px-0'}`}
                        to="#"
                    >
                        <span className="material-symbols-outlined flex-shrink-0">library_books</span>
                        {sidebarOpen && <span className="font-medium text-sm whitespace-nowrap">Resources</span>}
                    </Link>
                </nav>

                {/* CTA card — hidden when collapsed */}
                {sidebarOpen && (
                    <div className="mt-auto px-6">
                        <div className="p-4 rounded-xl bg-surface-container-high border border-outline-variant/10">
                            <p className="text-xs text-outline mb-2 whitespace-nowrap">READY TO PRACTICE?</p>
                            <button className="w-full py-2.5 bg-primary text-on-primary rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity whitespace-nowrap">
                                Start Mock Session
                            </button>
                        </div>
                    </div>
                )}
            </aside>

            {/* ══════════════════════════════════════════════════════════════
                MAIN CONTENT
            ══════════════════════════════════════════════════════════════ */}
            <main className={`min-h-screen relative flex flex-col overflow-y-auto transition-all duration-300 ease-in-out ${mainML}`}>

                {/* ── TopAppBar ──────────────────────────────────────────── */}
                <header className="sticky top-0 right-0 w-full h-16 bg-[#101226]/60 backdrop-blur-xl flex items-center px-8 z-40 relative">
                    {/* Centered greeting */}
                    <h2 className="absolute left-0 right-0 text-2xl font-bold tracking-wide font-headline text-center pointer-events-none">
                        <span
                            className="inline-block transition-all duration-400 ease-in-out"
                            style={{ opacity: greetingFade ? 1 : 0, transform: greetingFade ? 'translateY(0)' : 'translateY(-8px)' }}
                        >
                            {greetings[greetingIndex]}
                        </span>
                        , {userName}
                    </h2>
                    {/* Spacer */}
                    <div className="flex-1"></div>
                    <div className="flex items-center space-x-6">
                        <button className="text-[#e0e0fd] opacity-80 hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>

                        {/* Profile dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                className="flex items-center space-x-2 group cursor-pointer"
                                onClick={() => setIsMenuOpen(o => !o)}
                                aria-label="Profile menu"
                            >
                                <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/30">
                                    <img
                                        alt="User Profile Avatar"
                                        className="w-full h-full object-cover"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUpEz7jmEIsLwnmGvE2vCtHKfBevJYAfREGhrIH8AQohrGBhIVOMnOU6KbpZD6ozGU3wPS8L5GRh5_lfuXwmSDBfUodQgn75eqq-A7GYe5_bofw2y-hjAuBOMs9bhOfNy7WZLrELSBU9bLd71o23rHYULIgY3_hTQ2ui68ArtqPfVzn7JQ0r4dBLZ7amnfT-LqIqCM9W9vWO58FXIwWr_ctRA0VZ2s9GbhToQd7NaRYQ8SjHYIG6mExn9JH5lmvsiFTjGicTSFQd8"
                                    />
                                </div>
                                <span className={`material-symbols-outlined text-outline transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}>
                                    expand_more
                                </span>
                            </button>

                            {isMenuOpen && (
                                <div className="absolute top-12 right-0 w-52 bg-surface-container-highest rounded-xl shadow-2xl p-2 border border-outline-variant/10 z-50">
                                    <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm hover:bg-surface-bright rounded-lg text-left transition-colors">
                                        <span className="material-symbols-outlined text-outline text-base">person</span>
                                        <span>Account</span>
                                    </button>
                                    <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm hover:bg-surface-bright rounded-lg text-left transition-colors">
                                        <span className="material-symbols-outlined text-outline text-base">settings</span>
                                        <span>Settings</span>
                                    </button>
                                    <hr className="my-2 border-outline-variant/10" />
                                    <button
                                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-error hover:bg-error-container/20 rounded-lg text-left transition-colors"
                                        onClick={handleSignOut}
                                    >
                                        <span className="material-symbols-outlined text-base">logout</span>
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* ── Canvas ────────────────────────────────────────────── */}
                <div className="p-8">

                    {/* Urgent Interview Strip — flip-clock countdown */}
                    <div
                        className="w-full flex flex-col items-center justify-center bg-[#1a1d2e] rounded-2xl px-8 py-5 mb-6 cursor-pointer hover:bg-[#1e2136] transition-colors"
                        onClick={() => setSelectedInterview(UPCOMING_CARDS[0])}
                    >
                        {/* Company label */}
                        <div className="flex items-center space-x-3 mb-4">
                            <CompanyLogo company="Amazon" size="w-7 h-7" />
                            <p className="text-[#e8837c] text-sm font-semibold tracking-[0.25em] uppercase">Amazon</p>
                        </div>

                        {/* Flip-clock digits */}
                        <div className="flex items-center" style={{ fontVariantNumeric: 'tabular-nums' }}>
                            {(() => {
                                const dStr = String(countdown.days).padStart(2, '0');
                                const hStr = String(countdown.hours).padStart(2, '0');
                                const mStr = String(countdown.mins).padStart(2, '0');
                                const sStr = String(countdown.secs).padStart(2, '0');

                                const Digit = ({ ch }) => (
                                    <span className="inline-flex items-center justify-center w-12 h-16 bg-[#252840] text-[#e8837c] text-4xl font-bold rounded-md border border-[#e8837c]/15 mx-[2px] shadow-lg">
                                        {ch}
                                    </span>
                                );
                                const Colon = () => (
                                    <span className="text-[#e8837c] text-4xl font-bold mx-2 select-none">:</span>
                                );

                                return (
                                    <>
                                        {dStr.split('').map((c, i) => <Digit key={`d${i}`} ch={c} />)}
                                        <Colon />
                                        {hStr.split('').map((c, i) => <Digit key={`h${i}`} ch={c} />)}
                                        <Colon />
                                        {mStr.split('').map((c, i) => <Digit key={`m${i}`} ch={c} />)}
                                        <Colon />
                                        {sStr.split('').map((c, i) => <Digit key={`s${i}`} ch={c} />)}
                                    </>
                                );
                            })()}
                        </div>

                        {/* Labels row */}
                        <div className="flex items-center mt-2" style={{ fontVariantNumeric: 'tabular-nums' }}>
                            <span className="text-[0.65rem] text-[#e8837c]/50 uppercase tracking-[0.2em] font-medium" style={{ width: `${2 * 52 + 4}px`, textAlign: 'center' }}>DAYS</span>
                            <span className="mx-2 w-4"></span>
                            <span className="text-[0.65rem] text-[#e8837c]/50 uppercase tracking-[0.2em] font-medium" style={{ width: `${2 * 52 + 4}px`, textAlign: 'center' }}>HRS</span>
                            <span className="mx-2 w-4"></span>
                            <span className="text-[0.65rem] text-[#e8837c]/50 uppercase tracking-[0.2em] font-medium" style={{ width: `${2 * 52 + 4}px`, textAlign: 'center' }}>MIN</span>
                            <span className="mx-2 w-4"></span>
                            <span className="text-[0.65rem] text-[#e8837c]/50 uppercase tracking-[0.2em] font-medium" style={{ width: `${2 * 52 + 4}px`, textAlign: 'center' }}>SEC</span>
                        </div>
                    </div>

                    {/* ── Countdown Cards nav ──────────────────────────── */}
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <button
                            onClick={() => setInterviewPage(p => Math.max(0, p - 1))}
                            className={`p-1.5 rounded-lg transition-colors ${interviewPage === 0 ? 'text-outline/30 cursor-not-allowed' : 'text-outline hover:bg-surface-bright'}`}
                            disabled={interviewPage === 0}
                            title="Previous"
                        >
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </button>
                        <p className="text-[0.6875rem] uppercase tracking-widest text-outline">
                            {interviewPage === 0 ? 'Past Interviews' : `Upcoming Interviews · ${interviewPage}/2`}
                        </p>
                        <button
                            onClick={() => setInterviewPage(p => Math.min(2, p + 1))}
                            className={`p-1.5 rounded-lg transition-colors ${interviewPage === 2 ? 'text-outline/30 cursor-not-allowed' : 'text-outline hover:bg-surface-bright'}`}
                            disabled={interviewPage === 2}
                            title="Next"
                        >
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>

                        {/* + button to create new interview */}
                        <button
                            onClick={() => openCreateModal()}
                            className="ml-4 w-7 h-7 bg-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                            title="Add new interview"
                        >
                            <span className="material-symbols-outlined text-on-primary" style={{ fontSize: '16px' }}>add</span>
                        </button>
                    </div>

                    {interviewPage === 0 ? (
                        /* Past interviews */
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                            {PAST_INTERVIEWS.map((iv, i) => (
                                <div key={i} className="relative group overflow-hidden bg-surface-container-high rounded-xl p-4 opacity-70 hover:opacity-100 transition-all duration-300 hover:bg-surface-bright">
                                    <div className="flex justify-between items-start mb-2">
                                        <CompanyLogo company={iv.company} />
                                        <span className="text-[0.6875rem] font-label tracking-widest text-outline">COMPLETED</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-on-surface">{iv.company}</h3>
                                    <p className="text-outline text-xs mt-0.5">{iv.role} · {iv.daysAgo}d ago</p>
                                    <div className="mt-3 flex items-center text-xs text-outline group-hover:text-primary transition-colors">
                                        <span>{iv.action}</span>
                                        <span className="material-symbols-outlined text-xs ml-1">arrow_forward</span>
                                    </div>
                                    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <span className="material-symbols-outlined text-7xl">history</span>
                                    </div>
                                </div>
                            ))}
                        </section>
                    ) : (
                        /* Upcoming cards — page 1 or page 2 */
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                            {(interviewPage === 1 ? UPCOMING_CARDS : STACKED_INTERVIEWS).map((card, i) => (
                                <button
                                    key={i}
                                    className="relative group overflow-hidden bg-surface-container-high rounded-xl p-4 transition-all duration-300 hover:bg-surface-bright text-left cursor-pointer"
                                    onClick={() => setSelectedInterview(card)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <CompanyLogo company={card.company} />
                                        <span className="text-[0.6875rem] font-label tracking-widest text-outline">COUNTDOWN</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-on-surface">{card.company}</h3>
                                    <p className="text-secondary text-sm mt-0.5">in {card.days} days</p>
                                    <div className="mt-3 flex items-center text-xs text-outline group-hover:text-primary transition-colors">
                                        <span>{card.actionLabel}</span>
                                        <span className="material-symbols-outlined text-xs ml-1">arrow_forward</span>
                                    </div>
                                    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <span className="material-symbols-outlined text-7xl">timer</span>
                                    </div>
                                </button>
                            ))}
                        </section>
                    )}

                    {/* ── Calendar Section ───────────────────────────────── */}
                    <section>
                        <div className="w-full bg-surface-container-low rounded-xl p-6">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h4 className="text-lg font-semibold text-on-surface">
                                        {MONTH_NAMES[calMonth]} {calYear}
                                    </h4>
                                    <p className="text-sm text-outline">
                                        {sessionCount > 0
                                            ? `${sessionCount} scheduled session${sessionCount !== 1 ? 's' : ''} this month`
                                            : 'No sessions scheduled this month'}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => openCreateModal()}
                                        className="p-2 hover:bg-surface-bright rounded-lg text-outline hover:text-primary transition-colors"
                                        title="Add interview"
                                    >
                                        <span className="material-symbols-outlined text-sm">add</span>
                                    </button>
                                    <div className="w-px h-5 bg-outline-variant/20" />
                                    <button onClick={() => navigateCalendar(-1)} className="p-2 hover:bg-surface-bright rounded-lg text-outline transition-colors" title="Previous month">
                                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                                    </button>
                                    <button onClick={() => navigateCalendar(1)} className="p-2 hover:bg-surface-bright rounded-lg text-outline transition-colors" title="Next month">
                                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-7 gap-px text-center text-[0.6875rem] font-bold text-outline tracking-wider uppercase mb-3">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
                            </div>

                            <div className="grid grid-cols-7 gap-px">
                                {calendarCells.map((cell, idx) => {
                                    const marker = getMarker(cell);
                                    const today = isToday(cell);
                                    const current = cell.type === 'current';
                                    const allInterviews = [...UPCOMING_CARDS, ...STACKED_INTERVIEWS, ...PAST_INTERVIEWS];
                                    const handleCellClick = () => {
                                        if (!current) return;
                                        if (marker) {
                                            const match = allInterviews.find(iv => iv.company === marker.company);
                                            if (match) { setSelectedInterview(match); return; }
                                        }
                                        openCreateModal();
                                    };
                                    return (
                                        <div
                                            key={idx}
                                            onClick={handleCellClick}
                                            className={[
                                                'p-2 border border-outline-variant/5 flex flex-col items-center text-sm min-h-[72px] transition-colors',
                                                current ? 'hover:bg-surface-bright cursor-pointer' : '',
                                                marker ? marker.bgClass : '',
                                                today ? 'ring-1 ring-inset ring-primary/50' : '',
                                            ].join(' ')}
                                        >
                                            <span className={[
                                                'font-medium leading-none',
                                                !current ? 'text-outline/25' : '',
                                                today ? 'text-primary font-bold' : '',
                                                marker && !today ? marker.textClass : '',
                                                !marker && !today && current ? 'text-on-surface/70' : '',
                                            ].join(' ')}>
                                                {cell.day}
                                            </span>
                                            {marker && (
                                                <>
                                                    <div className={`mt-1 w-1.5 h-1.5 rounded-full ${marker.dotClass}`} />
                                                    <span className={`mt-1 text-[0.5rem] font-semibold leading-none text-center truncate w-full ${marker.textClass}`}>
                                                        {marker.company}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                </div>

            </main>
        </div>
    );
};

export default DashboardPage;
