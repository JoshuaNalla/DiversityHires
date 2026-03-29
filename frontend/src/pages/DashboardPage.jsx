import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CreateDemoInterviewModal from '../components/CreateDemoInterviewModal';

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const INTERVIEW_MARKERS = [
    { year: 2026, month: 3, day: 2,  company: 'Amazon',    dotColor: '#f87171', bgColor: 'rgba(248,113,113,0.08)',  textColor: '#f87171' },
    { year: 2026, month: 3, day: 14, company: 'Google',    dotColor: '#6366f1', bgColor: 'rgba(99,102,241,0.08)',   textColor: '#6366f1' },
    { year: 2026, month: 3, day: 22, company: 'Meta',      dotColor: '#22d3ee', bgColor: 'rgba(34,211,238,0.08)',   textColor: '#22d3ee' },
    { year: 2026, month: 3, day: 26, company: 'Microsoft', dotColor: '#38bdf8', bgColor: 'rgba(56,189,248,0.08)',   textColor: '#38bdf8' },
    { year: 2026, month: 4, day: 3,  company: 'Apple',     dotColor: '#94a3b8', bgColor: 'rgba(148,163,184,0.08)', textColor: '#94a3b8' },
    { year: 2026, month: 4, day: 10, company: 'Nvidia',    dotColor: '#4ade80', bgColor: 'rgba(74,222,128,0.08)',   textColor: '#4ade80' },
];

const STACKED_INTERVIEWS = [
    {
        company: 'Microsoft', role: 'SDE II', days: 28, icon: 'window',
        date: 'April 26, 2026', time: '10:00 AM', type: 'Technical',
        iconColor: '#38bdf8', tagColor: { bg: 'rgba(56,189,248,0.1)', text: '#38bdf8' },
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
        iconColor: '#94a3b8', tagColor: { bg: 'rgba(148,163,184,0.1)', text: '#94a3b8' },
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
        iconColor: '#4ade80', tagColor: { bg: 'rgba(74,222,128,0.1)', text: '#4ade80' },
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
        company: 'Uber', role: 'SWE L5', daysAgo: 20, icon: 'directions_car', action: 'See analysis',
        date: 'March 9, 2026', time: '10:00 AM', type: 'Technical', days: -20,
        iconColor: '#fbbf24', tagColor: { bg: 'rgba(251,191,36,0.1)', text: '#fbbf24' },
        jobDescription: 'The SWE L5 role at Uber sits within the Maps & Navigation platform, responsible for real-time routing algorithms serving millions of trips daily. You will own entire subsystems end-to-end, from data ingestion pipelines to driver-facing mobile APIs. Strong knowledge of geospatial data structures and low-latency system design is required.',
        interviewers: [
            { name: 'Anya Petrova', bio: 'Staff Engineer on Uber Maps with expertise in computational geometry. She previously worked at Google Maps before moving to Uber in 2021.' },
            { name: 'James Oduya', bio: 'Engineering Manager for the Core Routing team. James has driven several platform migrations and champions inclusive engineering practices at Uber.' },
        ],
    },
    {
        company: 'Shopify', role: 'Full Stack', daysAgo: 12, icon: 'storefront', action: 'Review notes',
        date: 'March 17, 2026', time: '2:00 PM', type: 'Behavioral', days: -12,
        iconColor: '#38bdf8', tagColor: { bg: 'rgba(56,189,248,0.1)', text: '#38bdf8' },
        jobDescription: 'Shopify is looking for a Full Stack Engineer to join the Checkout Experience team, one of the highest-traffic surfaces on the internet during peak commerce events. You will build Ruby on Rails APIs and React storefronts that enable merchants worldwide to customize their checkout flows. A passion for developer experience and platform reliability is essential.',
        interviewers: [
            { name: 'Lena Garbutt', bio: 'Senior Product Engineer at Shopify who has shipped the Checkout extensibility platform. She is a Ruby core contributor and advocates for open-source tooling.' },
            { name: 'Wei Zhang', bio: 'Tech Lead for the Storefront Renderer team. Wei focuses on WebAssembly and edge-rendering strategies to cut checkout latency globally.' },
            { name: 'Omar Haddad', bio: 'Staff Engineer specializing in payment integrations. Omar coordinates across 40+ payment gateway partners and leads compliance architecture reviews.' },
        ],
    },
    {
        company: 'Stripe', role: 'Backend Eng', daysAgo: 5, icon: 'payments', action: 'View feedback',
        date: 'March 24, 2026', time: '11:00 AM', type: 'System Design', days: -5,
        iconColor: '#34d399', tagColor: { bg: 'rgba(52,211,153,0.1)', text: '#34d399' },
        jobDescription: 'Stripe is hiring a Backend Engineer to work on the Payments Infrastructure team, building the core ledger and settlement systems that process billions of dollars in transactions annually. You will design fault-tolerant distributed systems with a focus on financial consistency, auditability, and sub-millisecond reconciliation. Experience with event-driven architectures and strong consistency guarantees is a must.',
        interviewers: [
            { name: 'Nina Bhatia', bio: 'Principal Engineer at Stripe focused on the global ledger. Nina has a background in formal verification and applies rigorous correctness reasoning to financial systems.' },
            { name: 'Connor Walsh', bio: 'Engineering Manager overseeing Stripe\'s settlement infrastructure. He joined from Jane Street where he worked on high-frequency trading systems.' },
        ],
    },
];

const UPCOMING_CARDS = [
    {
        company: 'Amazon', role: 'L5 SDE',
        date: 'April 2, 2026', time: '11:30 AM', type: 'Virtual On-site',
        icon: 'token', iconColor: '#6366f1', tagColor: { bg: 'rgba(99,102,241,0.1)', text: '#6366f1' },
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
        icon: 'search', iconColor: '#22d3ee', tagColor: { bg: 'rgba(34,211,238,0.1)', text: '#22d3ee' },
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
        icon: 'public', iconColor: '#a78bfa', tagColor: { bg: 'rgba(167,139,250,0.1)', text: '#a78bfa' },
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
    Amazon:   { icon: 'bi-amazon',    color: '#FF9900', bg: '#111' },
    Google:   { icon: 'bi-google',    color: '#4285F4', bg: '#fff' },
    Meta:     { icon: 'bi-meta',      color: '#0082FB', bg: '#fff' },
    Microsoft:{ icon: 'bi-microsoft', color: '#00a4ef', bg: '#fff' },
    Apple:    { icon: 'bi-apple',     color: '#1d1d1f', bg: '#f5f5f7' },
    Nvidia:   { icon: 'bi-nvidia',    color: '#76b900', bg: '#000' },
    Stripe:   { icon: 'bi-stripe',    color: '#6772E5', bg: '#fff' },
    Shopify:  { letter: 'S', color: '#fff', bg: '#96BF48' },
    Uber:     { letter: 'U', color: '#fff', bg: '#000' },
};

const CompanyLogo = ({ company, size = 'w-9 h-9' }) => {
    const cfg = COMPANY_ICONS[company];
    if (!cfg) return null;
    return (
        <div className={`${size} rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm`} style={{ background: cfg.bg }}>
            {cfg.icon
                ? <i className={`bi ${cfg.icon} text-base`} style={{ color: cfg.color }} />
                : <span className="text-xs font-bold" style={{ color: cfg.color }}>{cfg.letter}</span>
            }
        </div>
    );
};

const DashboardPage = () => {
    const navigate = useNavigate();
    const userName = (localStorage.getItem('username') || 'User').split(' ')[0];

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [interviewPage, setInterviewPage] = useState(1);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDemoInterview, setIsDemoInterview] = useState(false);
    const [showDemoSetup, setShowDemoSetup] = useState(false);
    const [newInterview, setNewInterview] = useState({ title: '', date: '', time: '', company: '', type: 'Behavioral' });

    const greetings = ['Hello', 'Hola', 'Bonjour', 'Hallo', 'Ciao', 'Olá', 'Привет', 'こんにちは', '안녕하세요', 'مرحبا', 'Namaste', 'Habari', 'Salam', 'Sawubona'];
    const [greetingIndex, setGreetingIndex] = useState(0);
    const [greetingFade, setGreetingFade] = useState(true);
    const dropdownRef = useRef(null);

    const todayObj = new Date();
    const todayYear = todayObj.getFullYear();
    const todayMonth = todayObj.getMonth();
    const todayDay = todayObj.getDate();
    const [calendarDate, setCalendarDate] = useState(() => new Date(todayYear, todayMonth, 1));

    useEffect(() => {
        const session = localStorage.getItem('session_id');
        if (!session) navigate('/login');
    }, [navigate]);

    const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
    useEffect(() => {
        const target = new Date('2026-04-02T11:30:00').getTime();
        const tick = () => {
            const diff = Math.max(0, target - Date.now());
            setCountdown({
                days:  Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                mins:  Math.floor((diff % 3600000) / 60000),
                secs:  Math.floor((diff % 60000) / 1000),
            });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsMenuOpen(false);
        };
        if (isMenuOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isMenuOpen]);

    useEffect(() => {
        const id = setInterval(() => {
            setGreetingFade(false);
            setTimeout(() => { setGreetingIndex(prev => (prev + 1) % greetings.length); setGreetingFade(true); }, 400);
        }, 2000);
        return () => clearInterval(id);
    }, [greetings.length]);

    const handleSignOut = () => { localStorage.removeItem('session_id'); localStorage.removeItem('username'); navigate('/'); };
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

    const calYear = calendarDate.getFullYear();
    const calMonth = calendarDate.getMonth();
    const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
    const daysInCalMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const daysInPrevCalMonth = new Date(calYear, calMonth, 0).getDate();
    const totalCells = Math.ceil((firstDayOfWeek + daysInCalMonth) / 7) * 7;

    const calendarCells = [];
    for (let i = firstDayOfWeek - 1; i >= 0; i--) calendarCells.push({ day: daysInPrevCalMonth - i, type: 'prev' });
    for (let d = 1; d <= daysInCalMonth; d++) calendarCells.push({ day: d, type: 'current' });
    let nd = 1;
    while (calendarCells.length < totalCells) calendarCells.push({ day: nd++, type: 'next' });

    const getMarker = (cell) => {
        if (cell.type !== 'current') return null;
        return INTERVIEW_MARKERS.find(m => m.year === calYear && m.month === calMonth && m.day === cell.day) || null;
    };
    const isToday = (cell) => cell.type === 'current' && calYear === todayYear && calMonth === todayMonth && cell.day === todayDay;
    const sessionCount = INTERVIEW_MARKERS.filter(m => m.year === calYear && m.month === calMonth).length;

    const inputCls = "w-full rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none transition-colors placeholder:text-outline/40";
    const inputStyle = { background: '#090e1a', border: '1px solid #1e293b', fontFamily: 'Inter, sans-serif' };
    const labelCls = "block text-[11px] text-on-surface-variant mb-1.5 tracking-wide uppercase font-semibold";

    const sidebarW = sidebarOpen ? 'w-60' : 'w-[60px]';
    const mainML = sidebarOpen ? 'ml-60' : 'ml-[60px]';

    return (
        <div className="bg-background text-on-surface antialiased min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>

            {/* ═══ INTERVIEW DETAIL POPUP ═══════════════════════════════ */}
            {selectedInterview && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-lg" onClick={() => setSelectedInterview(null)} />
                    <div
                        className="relative w-[75vw] max-h-[82vh] overflow-y-auto flex flex-col rounded-2xl shadow-2xl"
                        style={{ background: '#090e1a', border: '1px solid #1e293b' }}
                    >
                        {/* Top gradient bar */}
                        <div className="h-[3px] flex-shrink-0" style={{ background: 'linear-gradient(to right, #6366f1, #a78bfa, #22d3ee)' }} />

                        <button
                            onClick={() => setSelectedInterview(null)}
                            className="absolute top-5 right-6 text-outline hover:text-on-surface transition-colors p-1.5 rounded-lg hover:bg-surface-container z-10"
                        >
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>

                        {/* Header */}
                        <div className="px-10 pt-10 pb-8" style={{ borderBottom: '1px solid #1e293b' }}>
                            <div
                                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-6"
                                style={{ background: selectedInterview.tagColor.bg, color: selectedInterview.tagColor.text }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>{selectedInterview.icon}</span>
                                {selectedInterview.type}
                            </div>
                            <div className="flex items-center gap-4">
                                <CompanyLogo company={selectedInterview.company} size="w-14 h-14" />
                                <div>
                                    <h2 className="text-4xl font-black text-on-surface tracking-tight">{selectedInterview.company}</h2>
                                    <p className="text-lg text-on-surface-variant mt-0.5">{selectedInterview.role}</p>
                                </div>
                            </div>
                        </div>

                        {/* Info grid */}
                        <div className="px-10 py-7 grid grid-cols-3 gap-6" style={{ borderBottom: '1px solid #1e293b' }}>
                            {[
                                { label: 'Date', icon: 'calendar_today', value: selectedInterview.date },
                                { label: 'Time', icon: 'schedule', value: selectedInterview.time },
                                { label: 'Countdown', icon: 'timer', value: `in ${selectedInterview.days} days` },
                            ].map(item => (
                                <div key={item.label}>
                                    <p className={labelCls}>{item.label}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="material-symbols-outlined text-outline text-base">{item.icon}</span>
                                        <span className="text-sm font-semibold text-on-surface">{item.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Job Description */}
                        {selectedInterview.jobDescription && (
                            <div className="px-10 py-7" style={{ borderBottom: '1px solid #1e293b' }}>
                                <p className={labelCls}>Job Description</p>
                                <p className="text-sm text-on-surface-variant leading-relaxed mt-2">{selectedInterview.jobDescription}</p>
                            </div>
                        )}

                        {/* Interviewers */}
                        {selectedInterview.interviewers?.length > 0 && (
                            <div className="px-10 py-7" style={{ borderBottom: '1px solid #1e293b' }}>
                                <p className={labelCls}>Your Interviewers</p>
                                <div className="mt-4 space-y-4">
                                    {selectedInterview.interviewers.map((iv, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                                                <span className="text-sm font-bold" style={{ color: '#6366f1' }}>{iv.name.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-on-surface">{iv.name}</p>
                                                <p className="text-xs text-on-surface-variant leading-relaxed mt-0.5">{iv.bio}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="px-10 py-7 flex items-center gap-3">
                            <button
                                className="px-7 py-3 rounded-xl font-semibold text-sm flex items-center gap-2"
                                style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)', color: 'white', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}
                            >
                                <span className="material-symbols-outlined text-sm">play_arrow</span>
                                Start Mock Session
                            </button>
                            <button
                                className="px-7 py-3 rounded-xl text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-2"
                                style={{ border: '1px solid #1e293b' }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = '#2d3b52'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = '#1e293b'}
                            >
                                <span className="material-symbols-outlined text-sm">edit</span>
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ DEMO SETUP MODAL ══════════════════════════════════════ */}
            {showDemoSetup && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowDemoSetup(false)} />
                    <div className="relative w-full max-w-5xl h-full shadow-2xl" style={{ borderRadius: '20px' }}>
                        <CreateDemoInterviewModal onClose={() => setShowDemoSetup(false)} />
                    </div>
                </div>
            )}

            {/* ═══ CREATE INTERVIEW MODAL ════════════════════════════════ */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div
                        className="relative w-full max-w-md mx-4 rounded-2xl shadow-2xl overflow-hidden"
                        style={{ background: '#090e1a', border: '1px solid #1e293b' }}
                    >
                        <div className="h-[3px]" style={{ background: 'linear-gradient(to right, #6366f1, #a78bfa, #22d3ee)' }} />
                        <div className="p-7">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-base">event_available</span>
                                    <h3 className="text-base font-bold text-on-surface">New Interview</h3>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="text-outline hover:text-on-surface transition-colors p-1 rounded-lg hover:bg-surface-container">
                                    <span className="material-symbols-outlined text-base">close</span>
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelCls}>Interview Title</label>
                                    <input className={inputCls} style={inputStyle} placeholder="e.g. Amazon L5 SDE – Final Round" type="text"
                                        value={newInterview.title} onChange={e => setNewInterview(p => ({ ...p, title: e.target.value }))}
                                        onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                                        onBlur={e => e.target.style.borderColor = '#1e293b'} />
                                </div>
                                <div>
                                    <label className={labelCls}>Company</label>
                                    <input className={inputCls} style={inputStyle} placeholder="e.g. Amazon" type="text"
                                        value={newInterview.company} onChange={e => setNewInterview(p => ({ ...p, company: e.target.value }))}
                                        onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                                        onBlur={e => e.target.style.borderColor = '#1e293b'} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelCls}>Date</label>
                                        <input className={inputCls} style={{ ...inputStyle, colorScheme: 'dark' }} type="date"
                                            value={newInterview.date} onChange={e => setNewInterview(p => ({ ...p, date: e.target.value }))}
                                            onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                                            onBlur={e => e.target.style.borderColor = '#1e293b'} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Time</label>
                                        <input className={inputCls} style={{ ...inputStyle, colorScheme: 'dark' }} type="time"
                                            value={newInterview.time} onChange={e => setNewInterview(p => ({ ...p, time: e.target.value }))}
                                            onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                                            onBlur={e => e.target.style.borderColor = '#1e293b'} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelCls}>Interview Type</label>
                                    <select className={inputCls} style={{ ...inputStyle, colorScheme: 'dark' }}
                                        value={newInterview.type} onChange={e => setNewInterview(p => ({ ...p, type: e.target.value }))}
                                        onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                                        onBlur={e => e.target.style.borderColor = '#1e293b'}>
                                        <option>Behavioral</option>
                                        <option>Technical</option>
                                        <option>System Design</option>
                                        <option>HR</option>
                                    </select>
                                </div>

                                {/* AI Demo Toggle */}
                                <div className="flex items-center justify-between p-4 rounded-xl mt-2" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
                                    <div className="flex items-center gap-3">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={isDemoInterview} onChange={e => setIsDemoInterview(e.target.checked)} />
                                            <div className="w-10 h-5 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"
                                                style={{ background: isDemoInterview ? '#6366f1' : '#1e293b' }} />
                                        </label>
                                        <span className="text-sm font-semibold" style={{ color: '#6366f1' }}>Demo Interview (AI)</span>
                                    </div>
                                    <div className="group relative flex items-center">
                                        <span className="material-symbols-outlined cursor-help text-base" style={{ color: 'rgba(99,102,241,0.6)' }}>info</span>
                                        <div className="absolute right-0 bottom-full mb-2 w-60 bg-surface-container-high border border-outline-variant/20 text-on-surface-variant text-xs p-3 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-xl">
                                            A demo interview schedules an interactive AI session. Unchecking serves as a calendar reminder only.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-7">
                                <button onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors"
                                    style={{ border: '1px solid #1e293b' }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = '#2d3b52'}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = '#1e293b'}>
                                    Cancel
                                </button>
                                <button
                                    onClick={() => { setIsModalOpen(false); if (isDemoInterview) setShowDemoSetup(true); }}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
                                    style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)', boxShadow: '0 4px 15px rgba(99,102,241,0.25)' }}>
                                    Save Interview
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ SIDEBAR ═══════════════════════════════════════════════ */}
            <aside
                className={`fixed left-0 top-0 h-full flex flex-col py-6 z-50 transition-all duration-300 ease-in-out overflow-hidden ${sidebarW}`}
                style={{ background: '#060912', borderRight: '1px solid #1e293b' }}
            >
                {/* Logo + toggle */}
                <div className={`flex items-start mb-8 ${sidebarOpen ? 'px-5 justify-between' : 'px-0 justify-center'}`}>
                    {sidebarOpen && (
                        <div className="px-1">
                            <div
                                className="text-base font-bold tracking-tight whitespace-nowrap"
                                style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                            >
                                The Silent Coach
                            </div>
                            <p className="text-[10px] uppercase tracking-[0.08em] text-outline mt-0.5 whitespace-nowrap font-medium">AI Interview Prep</p>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(o => !o)}
                        className="text-outline hover:text-on-surface transition-colors flex-shrink-0 p-1.5 rounded-lg hover:bg-surface-container"
                    >
                        <span className="material-symbols-outlined text-xl">{sidebarOpen ? 'menu_open' : 'menu'}</span>
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 space-y-1 px-2">
                    {[
                        { icon: 'home', label: 'Home', active: true },
                        { icon: 'history', label: 'Past Interviews', active: false },
                        { icon: 'leaderboard', label: 'Progress', active: false },
                        { icon: 'library_books', label: 'Resources', active: false },
                    ].map(item => (
                        <Link
                            key={item.label}
                            className={`flex items-center py-3 rounded-xl transition-all duration-150 ${sidebarOpen ? 'px-4 space-x-3 mx-1' : 'justify-center px-0 mx-1'}`}
                            style={item.active
                                ? { background: 'rgba(99,102,241,0.12)', color: '#818cf8' }
                                : { color: '#475569' }
                            }
                            to="#"
                            onMouseEnter={e => { if (!item.active) { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; } }}
                            onMouseLeave={e => { if (!item.active) { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'transparent'; } }}
                        >
                            <span className="material-symbols-outlined flex-shrink-0 text-xl">{item.icon}</span>
                            {sidebarOpen && <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* CTA */}
                {sidebarOpen && (
                    <div className="mt-auto px-4">
                        <div className="p-4 rounded-2xl" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
                            <p className="text-[10px] text-on-surface-variant mb-3 uppercase tracking-wider font-semibold whitespace-nowrap">Ready to practice?</p>
                            <button
                                className="w-full py-2.5 rounded-xl font-semibold text-sm text-white whitespace-nowrap"
                                style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)', boxShadow: '0 4px 15px rgba(99,102,241,0.25)' }}
                            >
                                Start Mock Session
                            </button>
                        </div>
                    </div>
                )}
            </aside>

            {/* ═══ MAIN CONTENT ══════════════════════════════════════════ */}
            <main className={`min-h-screen flex flex-col overflow-y-auto transition-all duration-300 ease-in-out ${mainML}`}>

                {/* Top Bar */}
                <header
                    className="sticky top-0 right-0 w-full h-16 flex items-center px-8 z-40"
                    style={{ background: 'rgba(6,9,18,0.75)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #1e293b' }}
                >
                    <h2 className="absolute left-0 right-0 text-lg font-bold text-center pointer-events-none tracking-tight">
                        <span
                            className="inline-block transition-all duration-300 ease-in-out"
                            style={{ opacity: greetingFade ? 1 : 0, transform: greetingFade ? 'translateY(0)' : 'translateY(-6px)' }}
                        >
                            {greetings[greetingIndex]}
                        </span>
                        <span className="text-on-surface-variant font-normal">, </span>
                        <span style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {userName}
                        </span>
                    </h2>
                    <div className="flex-1" />
                    <div className="flex items-center gap-4">
                        <button className="w-9 h-9 flex items-center justify-center rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all">
                            <span className="material-symbols-outlined text-xl">notifications</span>
                        </button>

                        <div className="relative" ref={dropdownRef}>
                            <button
                                className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-surface-container transition-colors"
                                onClick={() => setIsMenuOpen(o => !o)}
                            >
                                <div className="w-7 h-7 rounded-full overflow-hidden" style={{ border: '1.5px solid #1e293b' }}>
                                    <img
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUpEz7jmEIsLwnmGvE2vCtHKfBevJYAfREGhrIH8AQohrGBhIVOMnOU6KbpZD6ozGU3wPS8L5GRh5_lfuXwmSDBfUodQgn75eqq-A7GYe5_bofw2y-hjAuBOMs9bhOfNy7WZLrELSBU9bLd71o23rHYULIgY3_hTQ2ui68ArtqPfVzn7JQ0r4dBLZ7amnfT-LqIqCM9W9vWO58FXIwWr_ctRA0VZ2s9GbhToQd7NaRYQ8SjHYIG6mExn9JH5lmvsiFTjGicTSFQd8"
                                    />
                                </div>
                                <span className={`material-symbols-outlined text-outline text-sm transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}>
                                    expand_more
                                </span>
                            </button>

                            {isMenuOpen && (
                                <div
                                    className="absolute top-12 right-0 w-48 rounded-2xl shadow-2xl p-1.5 z-50"
                                    style={{ background: '#0d1422', border: '1px solid #1e293b' }}
                                >
                                    {[
                                        { icon: 'person', label: 'Account' },
                                        { icon: 'settings', label: 'Settings' },
                                    ].map(item => (
                                        <button key={item.label} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-xl text-left transition-colors">
                                            <span className="material-symbols-outlined text-base">{item.icon}</span>
                                            {item.label}
                                        </button>
                                    ))}
                                    <div className="my-1" style={{ height: '1px', background: '#1e293b' }} />
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl text-left transition-colors"
                                        style={{ color: '#f87171' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.08)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <span className="material-symbols-outlined text-base">logout</span>
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Canvas */}
                <div className="p-8 flex flex-col gap-6">

                    {/* ── Countdown Strip ───────────────────────────────── */}
                    <div
                        className="w-full flex flex-col items-center justify-center rounded-2xl px-8 py-6 cursor-pointer transition-all"
                        style={{ background: '#0c1220', border: '1px solid rgba(99,102,241,0.15)' }}
                        onClick={() => setSelectedInterview(UPCOMING_CARDS[0])}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.background = '#101829'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.15)'; e.currentTarget.style.background = '#0c1220'; }}
                    >
                        <div className="flex items-center gap-3 mb-5">
                            <CompanyLogo company="Amazon" size="w-7 h-7" />
                            <p className="text-sm font-bold tracking-[0.2em] uppercase" style={{ color: '#818cf8' }}>Amazon · Next Interview</p>
                        </div>

                        <div className="flex items-center" style={{ fontVariantNumeric: 'tabular-nums' }}>
                            {(() => {
                                const dStr = String(countdown.days).padStart(2, '0');
                                const hStr = String(countdown.hours).padStart(2, '0');
                                const mStr = String(countdown.mins).padStart(2, '0');
                                const sStr = String(countdown.secs).padStart(2, '0');

                                const Digit = ({ ch }) => (
                                    <span
                                        className="inline-flex items-center justify-center"
                                        style={{
                                            width: '48px', height: '64px', borderRadius: '10px', margin: '0 2px',
                                            background: 'linear-gradient(160deg, #151f34, #101829)',
                                            border: '1px solid rgba(99,102,241,0.2)',
                                            color: '#818cf8', fontSize: '2rem', fontWeight: 800,
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                                        }}
                                    >
                                        {ch}
                                    </span>
                                );
                                const Colon = () => (
                                    <span style={{ color: 'rgba(129,140,248,0.4)', fontSize: '2rem', fontWeight: 800, margin: '0 6px', userSelect: 'none' }}>:</span>
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

                        <div className="flex items-center mt-3" style={{ fontVariantNumeric: 'tabular-nums' }}>
                            {[['DAYS', 2], ['HRS', 2], ['MIN', 2], ['SEC', 2]].map(([label], i) => (
                                <React.Fragment key={label}>
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: 'rgba(129,140,248,0.35)', width: `${2 * 48 + 8}px`, textAlign: 'center' }}>{label}</span>
                                    {i < 3 && <span style={{ width: '28px' }} />}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* ── Interview Cards nav ───────────────────────────── */}
                    <div className="flex items-center justify-center gap-3">
                        <button
                            onClick={() => setInterviewPage(p => Math.max(0, p - 1))}
                            disabled={interviewPage === 0}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ color: interviewPage === 0 ? '#1e293b' : '#475569', cursor: interviewPage === 0 ? 'not-allowed' : 'pointer' }}
                        >
                            <span className="material-symbols-outlined text-base">chevron_left</span>
                        </button>
                        <p className="text-[11px] uppercase tracking-widest text-on-surface-variant font-semibold">
                            {interviewPage === 0 ? 'Past Interviews' : `Upcoming · ${interviewPage}/2`}
                        </p>
                        <button
                            onClick={() => setInterviewPage(p => Math.min(2, p + 1))}
                            disabled={interviewPage === 2}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ color: interviewPage === 2 ? '#1e293b' : '#475569', cursor: interviewPage === 2 ? 'not-allowed' : 'pointer' }}
                        >
                            <span className="material-symbols-outlined text-base">chevron_right</span>
                        </button>
                        <button
                            onClick={() => openCreateModal()}
                            className="ml-3 w-7 h-7 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}
                            title="Add new interview"
                        >
                            <span className="material-symbols-outlined text-white" style={{ fontSize: '16px' }}>add</span>
                        </button>
                    </div>

                    {/* ── Interview Card Grid ────────────────────────────── */}
                    {interviewPage === 0 ? (
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {PAST_INTERVIEWS.map((iv, i) => (
                                <div
                                    key={i}
                                    className="relative group overflow-hidden rounded-2xl p-5 cursor-pointer transition-all duration-200"
                                    style={{ background: '#0c1220', border: '1px solid #1e293b', opacity: 0.7 }}
                                    onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.borderColor = '#2d3b52'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.opacity = '0.7'; e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                    onClick={() => setSelectedInterview(iv)}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <CompanyLogo company={iv.company} />
                                        <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase px-2 py-1 rounded-md" style={{ background: '#1e293b' }}>Done</span>
                                    </div>
                                    <h3 className="text-base font-bold text-on-surface">{iv.company}</h3>
                                    <p className="text-on-surface-variant text-xs mt-1 font-medium">{iv.role} · {iv.daysAgo}d ago</p>
                                    <div className="mt-4 flex items-center gap-1 text-xs text-on-surface-variant group-hover:text-primary transition-colors">
                                        <span>{iv.action}</span>
                                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                                    </div>
                                </div>
                            ))}
                        </section>
                    ) : (
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {(interviewPage === 1 ? UPCOMING_CARDS : STACKED_INTERVIEWS).map((card, i) => (
                                <button
                                    key={i}
                                    className="relative group overflow-hidden rounded-2xl p-5 text-left cursor-pointer transition-all duration-200"
                                    style={{ background: '#0c1220', border: '1px solid #1e293b' }}
                                    onClick={() => setSelectedInterview(card)}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = '#101829'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = '#0c1220'; }}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <CompanyLogo company={card.company} />
                                        <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-md" style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8' }}>Soon</span>
                                    </div>
                                    <h3 className="text-base font-bold text-on-surface">{card.company}</h3>
                                    <p className="text-sm mt-1 font-semibold" style={{ color: '#6366f1' }}>in {card.days} days</p>
                                    <div className="mt-4 flex items-center gap-1 text-xs text-on-surface-variant group-hover:text-primary transition-colors">
                                        <span>{card.actionLabel}</span>
                                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                                    </div>
                                </button>
                            ))}
                        </section>
                    )}

                    {/* ── Calendar ─────────────────────────────────────── */}
                    <section>
                        <div className="w-full rounded-2xl p-6" style={{ background: '#0c1220', border: '1px solid #1e293b' }}>
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h4 className="text-base font-bold text-on-surface">{MONTH_NAMES[calMonth]} {calYear}</h4>
                                    <p className="text-xs text-on-surface-variant mt-0.5">
                                        {sessionCount > 0 ? `${sessionCount} session${sessionCount !== 1 ? 's' : ''} scheduled` : 'No sessions scheduled'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => openCreateModal()}
                                        className="p-2 rounded-lg text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container"
                                        title="Add interview"
                                    >
                                        <span className="material-symbols-outlined text-base">add</span>
                                    </button>
                                    <div className="w-px h-5" style={{ background: '#1e293b' }} />
                                    <button onClick={() => navigateCalendar(-1)} className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface transition-colors hover:bg-surface-container">
                                        <span className="material-symbols-outlined text-base">chevron_left</span>
                                    </button>
                                    <button onClick={() => navigateCalendar(1)} className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface transition-colors hover:bg-surface-container">
                                        <span className="material-symbols-outlined text-base">chevron_right</span>
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-7 text-center mb-2">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                    <div key={d} className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant py-2">{d}</div>
                                ))}
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
                                            className="flex flex-col items-center min-h-[68px] p-2 rounded-xl transition-all"
                                            style={{
                                                background: marker ? marker.bgColor : today ? 'rgba(99,102,241,0.08)' : 'transparent',
                                                cursor: current ? 'pointer' : 'default',
                                                outline: today ? '1px solid rgba(99,102,241,0.3)' : 'none',
                                            }}
                                            onMouseEnter={e => { if (current) e.currentTarget.style.background = marker ? marker.bgColor : 'rgba(255,255,255,0.03)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = marker ? marker.bgColor : today ? 'rgba(99,102,241,0.08)' : 'transparent'; }}
                                        >
                                            <span
                                                className="text-sm font-medium leading-none mb-1"
                                                style={{
                                                    color: !current ? 'rgba(71,85,105,0.4)' : today ? '#6366f1' : marker ? marker.textColor : '#94a3b8',
                                                    fontWeight: today ? 800 : 500,
                                                }}
                                            >
                                                {cell.day}
                                            </span>
                                            {marker && (
                                                <>
                                                    <div className="w-1.5 h-1.5 rounded-full mt-0.5" style={{ background: marker.dotColor }} />
                                                    <span className="text-[9px] font-bold mt-1 text-center leading-none truncate w-full" style={{ color: marker.textColor }}>
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
