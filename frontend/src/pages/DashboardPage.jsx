import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateDemoInterviewModal from '../components/CreateDemoInterviewModal';
import { getInterviewReports } from '../lib/interviewReports';
import BrandLogo from '../components/BrandLogo';

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
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

const DoomsdayClock = ({ interview, countdown, onClick }) => {
    const urgency = useMemo(() => {
        if (countdown.days > 5) {
            return {
                colorClass: 'text-emerald-400',
                borderClass: 'border-emerald-400/30',
                bgClass: 'bg-emerald-950/30',
                shadowClass: 'shadow-[0_0_15px_rgba(52,211,153,0.15)]',
                dropShadowClass: 'drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]',
                msgs: [
                    "Plenty of time left. Relax and study.",
                    "Have you updated your resume recently?",
                    "Good time to review core concepts.",
                    "Maybe schedule a mock interview soon?"
                ]
            };
        } else if (countdown.days >= 2) {
            return {
                colorClass: 'text-amber-400',
                borderClass: 'border-amber-400/30',
                bgClass: 'bg-amber-950/30',
                shadowClass: 'shadow-[0_0_15px_rgba(251,191,36,0.15)]',
                dropShadowClass: 'drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]',
                msgs: [
                    "You should probably hit a mock interview or two.",
                    "Getting closer. Practice your behavioral questions.",
                    "Time to sharpen those system design skills.",
                    "Brush up on algorithms and coding patterns."
                ]
            };
        } else {
            return {
                colorClass: 'text-red-400',
                borderClass: 'border-red-400/30',
                bgClass: 'bg-red-950/30',
                shadowClass: 'shadow-[0_0_15px_rgba(248,113,113,0.15)]',
                dropShadowClass: 'drop-shadow-[0_0_10px_rgba(248,113,113,0.3)]',
                msgs: [
                    "Crunch time! Keep your reviews light today.",
                    "Get a good night's sleep before the big day.",
                    "You are ready. Just breathe.",
                    "Remember the STAR method for your stories."
                ]
            };
        }
    }, [countdown.days]);

    const [msgIdx, setMsgIdx] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const id = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setMsgIdx(prev => prev + 1);
                setFade(true);
            }, 300);
        }, 4000);
        return () => clearInterval(id);
    }, []);

    const dStr = String(countdown.days).padStart(2, '0');
    const hStr = String(countdown.hours).padStart(2, '0');
    const mStr = String(countdown.mins).padStart(2, '0');
    const sStr = String(countdown.secs).padStart(2, '0');
    
    const msg = urgency.msgs[msgIdx % urgency.msgs.length];

    const Digit = ({ ch }) => (
        <div className={`relative inline-flex items-center justify-center w-14 h-20 bg-[#161829] ${urgency.colorClass} text-5xl font-mono font-bold mx-[2px] rounded-lg border ${urgency.borderClass} overflow-hidden ${urgency.shadowClass}`}>
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-black/30 -translate-y-1/2 z-10"></div>
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/5 z-0 pointer-events-none"></div>
            <span className="relative z-0">{ch}</span>
        </div>
    );

    const Colon = () => (
        <span className={`${urgency.colorClass} opacity-80 text-4xl font-black font-mono mx-1 select-none pb-2 animate-pulse ${urgency.dropShadowClass}`}>:</span>
    );

    return (
        <div
            className="w-full flex flex-col items-center justify-center bg-transparent px-8 py-8 mb-4 cursor-pointer hover:scale-[1.01] transition-all duration-300 relative group"
            onClick={onClick}
        >
            <div className={`flex items-center space-x-3 mb-6 ${urgency.bgClass} border ${urgency.borderClass} px-6 py-2 rounded-full ${urgency.shadowClass}`}>
                <span className={`material-symbols-outlined ${urgency.colorClass} text-sm`}>event</span>
                <p className={`${urgency.colorClass} text-xs font-bold tracking-[0.1em] uppercase opacity-90 font-sans`}>
                    UPCOMING: {interview?.company}
                </p>
                <span className={`material-symbols-outlined ${urgency.colorClass} text-sm`}>event</span>
            </div>

            <div className="flex items-center" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {dStr.split('').map((c, i) => <Digit key={`d${i}`} ch={c} />)}
                <Colon />
                {hStr.split('').map((c, i) => <Digit key={`h${i}`} ch={c} />)}
                <Colon />
                {mStr.split('').map((c, i) => <Digit key={`m${i}`} ch={c} />)}
                <Colon />
                {sStr.split('').map((c, i) => <Digit key={`s${i}`} ch={c} />)}
            </div>

            <div className="flex items-center mt-3 font-mono font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>
                <span className={`text-[0.65rem] ${urgency.colorClass} opacity-60 uppercase tracking-[0.2em] w-[120px] text-center`}>DAYS</span>
                <span className="mx-1 w-2"></span>
                <span className={`text-[0.65rem] ${urgency.colorClass} opacity-60 uppercase tracking-[0.2em] w-[120px] text-center`}>HOURS</span>
                <span className="mx-1 w-2"></span>
                <span className={`text-[0.65rem] ${urgency.colorClass} opacity-60 uppercase tracking-[0.2em] w-[120px] text-center`}>MINS</span>
                <span className="mx-1 w-2"></span>
                <span className={`text-[0.65rem] ${urgency.colorClass} opacity-60 uppercase tracking-[0.2em] w-[120px] text-center`}>SECS</span>
            </div>

            <div className="mt-8 h-6 flex justify-center w-full overflow-hidden">
                <p 
                    className={`${urgency.colorClass} font-sans text-[0.85rem] font-medium tracking-wide transition-all duration-300`}
                    style={{ 
                        opacity: fade ? 0.9 : 0, 
                        transform: fade ? 'translateY(0)' : 'translateY(4px)'
                    }}
                >
                    {msg}
                </p>
            </div>
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
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editData, setEditData] = useState({ id: '', title: '', company: '', type: 'Behavioral', date: '', time: '' });

    // Data Hooks
    const [sessions, setSessions] = useState([]);
    const [savedReports, setSavedReports] = useState([]);
    
    const fetchSessions = async () => {
        try {
            const sid = localStorage.getItem('session_id');
            const res = await axios.get('http://localhost:8000/api/interview/sessions', {
                headers: { 'X-Session-ID': sid }
            });
            if (res.data.success) {
                setSessions(res.data.sessions);
            }
        } catch (e) {
            console.error("Failed to fetch sessions", e);
        }
    };

    useEffect(() => {
        const session = localStorage.getItem('session_id');
        if (!session) navigate('/login');
        else {
            fetchSessions();
            setSavedReports(getInterviewReports());
        }
    }, [navigate]);

    useEffect(() => {
        const refreshReports = () => setSavedReports(getInterviewReports());
        window.addEventListener('interview-reports-updated', refreshReports);
        window.addEventListener('focus', refreshReports);
        return () => {
            window.removeEventListener('interview-reports-updated', refreshReports);
            window.removeEventListener('focus', refreshReports);
        };
    }, []);

    // Horizontal scroll capability for Interview Rows
    useEffect(() => {
        const handleWheel = (e) => {
            const c = e.currentTarget;
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                c.scrollLeft += (e.deltaY * 2.5); // Multiply speed slightly
            }
        };
        const upScroll = document.getElementById('upcoming-cards-scroll');
        const pastScroll = document.getElementById('past-cards-scroll');
        if (upScroll) upScroll.addEventListener('wheel', handleWheel, { passive: false });
        if (pastScroll) pastScroll.addEventListener('wheel', handleWheel, { passive: false });
        
        return () => {
            if (upScroll) upScroll.removeEventListener('wheel', handleWheel);
            if (pastScroll) pastScroll.removeEventListener('wheel', handleWheel);
        };
    });

    // Data Parsing
    const backendPastInterviews = sessions.filter(s => s.status === 'COMPLETED').map(s => ({
        id: s._id,
        session: s,
        company: s.company || 'Unknown', role: s.role, type: s.type, date: new Date(s.created_at).toLocaleDateString(),
        daysAgo: Math.floor((Date.now() - new Date(s.created_at)) / 86400000), action: 'Review', icon: 'history'
    }));

    const localReportInterviews = savedReports.map((report) => ({
        id: report.id,
        reportId: report.id,
        company: report.company || 'Mock Interview',
        role: report.role || 'Interview Practice',
        type: 'Mock Report',
        date: new Date(report.endedAt).toLocaleDateString(),
        daysAgo: Math.floor((Date.now() - new Date(report.endedAt)) / 86400000),
        action: 'Open report',
        icon: 'history',
        summary: report.summary?.snapshot || report.summary?.coachingNote || 'Interview report available.',
        overallScore: report.summary?.overallScore ?? 0,
    }));

    const reportIdentitySet = new Set(
        localReportInterviews.map((entry) => `${entry.company}|${entry.role}|${entry.date}`)
    );

    const PAST_INTERVIEWS = [
        ...localReportInterviews,
        ...backendPastInterviews.filter((entry) => !reportIdentitySet.has(`${entry.company}|${entry.role}|${entry.date}`))
    ];
    
    const UPCOMING_CARDS = sessions.filter(s => s.status === 'SCHEDULED' || (!s.status && s.is_mock === false)).map(s => {
        const t = new Date(s.scheduled_datetime || s.created_at);
        return {
           id: s._id,
           session: s,
           company: s.company || 'Unknown', role: s.role, type: s.type, date: t.toLocaleDateString(),
           time: t.toLocaleTimeString(), days: Math.floor((t - Date.now()) / 86400000), actionLabel: 'Prep', icon: 'timer',
           rawDate: t
        }
    }).sort((a,b) => a.rawDate - b.rawDate);
    
    const STACKED_INTERVIEWS = []; // Simplification, rely on UPCOMING_CARDS arrays.

    // Calendar Markers
    const INTERVIEW_MARKERS = sessions.filter(s => s.status === 'SCHEDULED' || (!s.status && s.is_mock === false)).map(s => {
        const d = new Date(s.scheduled_datetime || s.created_at);
        return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate(), company: s.company || 'Event', dotClass: 'bg-primary' };
    });

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

    // Live countdown timer for the urgent strip
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
    useEffect(() => {
        if (!UPCOMING_CARDS.length) return;
        const target = UPCOMING_CARDS[0].rawDate.getTime();
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
    }, [sessions]);

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
    const inputCls = "w-full bg-white border border-outline-variant/40 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary/60 transition-colors placeholder:text-on-surface-variant/60";
    const labelCls = "block text-xs text-on-surface-variant mb-1.5 tracking-wide uppercase";

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
                            <button
                                onClick={() => {
                                    setShowDemoSetup(true);
                                    setNewInterview({
                                        title: selectedInterview.role || '',
                                        company: selectedInterview.company || '',
                                        date: '',
                                        time: '',
                                        type: selectedInterview.type || 'Behavioral'
                                    });
                                }}
                                className="px-8 py-3 bg-primary text-on-primary rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex items-center space-x-2">
                                <span className="material-symbols-outlined text-sm">play_arrow</span>
                                <span>Start Mock Session</span>
                            </button>
                            <button
                                onClick={() => {
                                    const s = (selectedInterview.session) ? selectedInterview.session : sessions.find(x => x._id === selectedInterview.id);
                                    if (!s) return;
                                    const dt = new Date(s.scheduled_datetime || s.created_at);
                                    setEditData({
                                        id: s._id,
                                        title: s.role || '',
                                        company: s.company || '',
                                        type: s.type || 'Behavioral',
                                        date: dt.toISOString().slice(0,10),
                                        time: dt.toTimeString().slice(0,5)
                                    });
                                    setIsEditOpen(true);
                                }}
                                className="px-8 py-3 border border-outline-variant/30 text-on-surface rounded-xl text-sm hover:bg-surface-bright transition-colors flex items-center space-x-2">
                                <span className="material-symbols-outlined text-sm">edit</span>
                                <span>Edit</span>
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        const s = (selectedInterview.session) ? selectedInterview.session : sessions.find(x => x._id === selectedInterview.id);
                                        if (!s) return;
                                        const sid = localStorage.getItem('session_id');
                                        if (!window.confirm('Delete this interview session? This cannot be undone.')) return;
                                        await axios.delete(`http://localhost:8000/api/interview/schedule/${s._id}`, {
                                            headers: { 'X-Session-ID': sid }
                                        });
                                        setSelectedInterview(null);
                                        fetchSessions();
                                    } catch (e) {
                                        console.error(e);
                                        alert('Failed to delete interview');
                                    }
                                }}
                                className="px-8 py-3 border border-red-500/40 text-red-300 rounded-xl text-sm hover:bg-red-500/10 transition-colors flex items-center space-x-2">
                                <span className="material-symbols-outlined text-sm">delete</span>
                                <span>Delete</span>
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
                        <CreateDemoInterviewModal onClose={() => setShowDemoSetup(false)} initialData={newInterview} />
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                EDIT INTERVIEW MODAL
            ══════════════════════════════════════════════════════════════ */}
            {isEditOpen && (
                <div className="fixed inset-0 z-[65] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditOpen(false)} />
                    <div className="relative brand-card rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <span className="material-symbols-outlined text-primary text-sm">edit</span>
                                <h3 className="text-base font-semibold text-[var(--brand-ink)]">Edit Interview</h3>
                            </div>
                            <button onClick={() => setIsEditOpen(false)} className="text-on-surface-variant hover:text-on-surface transition-colors p-1">
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-on-surface-variant mb-1.5 tracking-wide uppercase">Interview Title</label>
                                <input className="w-full bg-white border border-outline-variant/40 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary/60 transition-colors placeholder:text-on-surface-variant/60"
                                    value={editData.title} onChange={e => setEditData(p => ({ ...p, title: e.target.value }))} />
                            </div>
                            <div>
                                <label className="block text-xs text-on-surface-variant mb-1.5 tracking-wide uppercase">Company</label>
                                <input className="w-full bg-white border border-outline-variant/40 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary/60 transition-colors placeholder:text-on-surface-variant/60"
                                    value={editData.company} onChange={e => setEditData(p => ({ ...p, company: e.target.value }))} />
                            </div>
                            <div>
                                <label className="block text-xs text-on-surface-variant mb-1.5 tracking-wide uppercase">Type</label>
                                <select className="w-full bg-white border border-outline-variant/40 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary/60 transition-colors"
                                    value={editData.type} onChange={e => setEditData(p => ({ ...p, type: e.target.value }))}>
                                    <option>Behavioral</option>
                                    <option>Technical</option>
                                    <option>System Design</option>
                                    <option>HR</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-on-surface-variant mb-1.5 tracking-wide uppercase">Date</label>
                                    <input className="w-full bg-white border border-outline-variant/40 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary/60 transition-colors"
                                        type="date" style={{ colorScheme: 'light' }}
                                        value={editData.date} onChange={e => setEditData(p => ({ ...p, date: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-xs text-on-surface-variant mb-1.5 tracking-wide uppercase">Time</label>
                                    <input className="w-full bg-white border border-outline-variant/40 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary/60 transition-colors"
                                        type="time" style={{ colorScheme: 'light' }}
                                        value={editData.time} onChange={e => setEditData(p => ({ ...p, time: e.target.value }))} />
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={async () => {
                                    try {
                                        const sid = localStorage.getItem('session_id');
                                        if (!window.confirm('Delete this interview session? This cannot be undone.')) return;
                                        await axios.delete(`http://localhost:8000/api/interview/schedule/${editData.id}`, {
                                            headers: { 'X-Session-ID': sid }
                                        });
                                        setIsEditOpen(false);
                                        setSelectedInterview(null);
                                        fetchSessions();
                                    } catch (e) {
                                        console.error(e);
                                        alert('Failed to delete interview');
                                    }
                                }}
                                className="flex-1 py-2.5 border border-red-500/40 text-red-600 rounded-lg text-sm hover:bg-red-500/10 transition-colors"
                            >
                                Delete
                            </button>
                            <button onClick={() => setIsEditOpen(false)}
                                className="flex-1 py-2.5 border border-outline-variant/30 rounded-lg text-sm text-on-surface-variant hover:bg-surface-bright transition-colors">
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        const sid = localStorage.getItem('session_id');
                                        const dt = new Date(`${editData.date}T${editData.time || '12:00'}`).toISOString();
                                        await axios.put(`http://localhost:8000/api/interview/schedule/${editData.id}`, {
                                            role: editData.title,
                                            company: editData.company,
                                            type: editData.type,
                                            scheduled_datetime: dt
                                        }, { headers: { 'X-Session-ID': sid } });
                                        setIsEditOpen(false);
                                        fetchSessions();
                                    } catch (e) {
                                        console.error(e);
                                        alert("Failed to update interview");
                                    }
                                }}
                                className="flex-1 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                                Save Changes
                            </button>
                        </div>
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
                                onClick={async () => {
                                    if (isDemoInterview) {
                                        setIsModalOpen(false);
                                        setShowDemoSetup(true);
                                    } else {
                                        try {
                                           const sid = localStorage.getItem('session_id');
                                           const dt = new Date(`${newInterview.date}T${newInterview.time || '12:00'}`).toISOString();
                                           await axios.post('http://localhost:8000/api/interview/schedule', {
                                              company: newInterview.company,
                                              role: newInterview.title,
                                              type: newInterview.type,
                                              scheduled_datetime: dt,
                                              is_mock: false
                                           }, { headers: { 'X-Session-ID': sid }});
                                           fetchSessions();
                                           setIsModalOpen(false);
                                        } catch (e) {
                                           console.error(e);
                                           alert("Failed to save interview");
                                        }
                                    }
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
            <aside className={`fixed left-0 top-0 h-full flex flex-col py-6 z-50 bg-white/88 backdrop-blur-xl border-r border-outline-variant/60 transition-all duration-300 ease-in-out overflow-hidden ${sidebarW}`}>

                {/* Hamburger + Logo */}
                <div className={`flex items-start mb-10 ${sidebarOpen ? 'px-6 justify-between' : 'px-0 justify-center'}`}>
                    {sidebarOpen && (
                        <div className="px-2">
                            <BrandLogo size="sm" showTagline stacked />
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(o => !o)}
                        className="text-outline hover:text-primary transition-colors flex-shrink-0 p-1"
                        title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                    >
                        <span className="material-symbols-outlined">{sidebarOpen ? 'menu_open' : 'menu'}</span>
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 space-y-1 px-2">
                    <button
                        onClick={() => setInterviewPage(1)}
                        className={`w-full flex items-center text-[var(--brand-ink)] bg-primary/12 border border-primary/20 rounded-xl py-3 transition-all duration-150 ease-in-out scale-95 ${sidebarOpen ? 'space-x-3 px-4 mx-2' : 'justify-center px-0 mx-1'}`}
                    >
                        <span className="material-symbols-outlined flex-shrink-0">home</span>
                        {sidebarOpen && <span className="font-medium text-sm whitespace-nowrap">Home</span>}
                    </button>
                    <button
                        onClick={() => setInterviewPage(0)}
                        className={`w-full flex items-center text-outline hover:text-primary hover:bg-primary/8 py-3 transition-colors rounded-xl ${sidebarOpen ? 'space-x-3 px-4' : 'justify-center px-0'}`}
                    >
                        <span className="material-symbols-outlined flex-shrink-0">history</span>
                        {sidebarOpen && <span className="font-medium text-sm whitespace-nowrap">Past Interviews</span>}
                    </button>
                    <Link
                        className={`flex items-center text-outline hover:text-primary hover:bg-primary/8 py-3 transition-colors rounded-xl ${sidebarOpen ? 'space-x-3 px-4' : 'justify-center px-0'}`}
                        to="#"
                    >
                        <span className="material-symbols-outlined flex-shrink-0">leaderboard</span>
                        {sidebarOpen && <span className="font-medium text-sm whitespace-nowrap">Progress</span>}
                    </Link>
                    <Link
                        className={`flex items-center text-outline hover:text-primary hover:bg-primary/8 py-3 transition-colors rounded-xl ${sidebarOpen ? 'space-x-3 px-4' : 'justify-center px-0'}`}
                        to="#"
                    >
                        <span className="material-symbols-outlined flex-shrink-0">library_books</span>
                        {sidebarOpen && <span className="font-medium text-sm whitespace-nowrap">Resources</span>}
                    </Link>
                </nav>

                {/* CTA card — hidden when collapsed */}
                {sidebarOpen && (
                    <div className="mt-auto px-6">
                        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/15">
                            <p className="text-xs text-on-surface-variant mb-2 whitespace-nowrap tracking-[0.18em] uppercase">Ready To Practice?</p>
                            <button
                                onClick={() => {
                                    setNewInterview({ title: '', date: '', time: '', company: '', type: 'Behavioral' });
                                    setShowDemoSetup(true);
                                }}
                                className="brand-button-primary w-full py-2.5 rounded-full font-semibold text-sm hover:brightness-105 transition-opacity whitespace-nowrap">
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
                <header className="sticky top-0 right-0 w-full h-16 bg-white/70 backdrop-blur-xl border-b border-outline-variant/40 flex items-center px-8 z-40 relative">
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
                        <button className="text-[var(--brand-ink)] opacity-80 hover:opacity-100 transition-opacity">
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
                    {UPCOMING_CARDS.length > 0 ? (
                        <DoomsdayClock
                            interview={UPCOMING_CARDS[0]}
                            countdown={countdown}
                            onClick={() => setSelectedInterview(UPCOMING_CARDS[0])}
                        />
                    ) : (
                        <div className="w-full flex flex-col items-center justify-center bg-[#1a1d2e]/50 border border-outline-variant/10 rounded-2xl px-8 py-10 mb-6 text-center">
                             <div className="w-16 h-16 bg-[#252840] rounded-full flex items-center justify-center text-outline mb-4">
                                <span className="material-symbols-outlined text-3xl">event_busy</span>
                             </div>
                             <h3 className="text-xl font-bold text-on-surface">No Upcoming Interviews</h3>
                             <p className="text-sm text-outline mt-2 max-w-sm">Schedule a mock session to begin tracking your countdown timer.</p>
                        </div>
                    )}

                    {/* ── Countdown Cards nav ──────────────────────────── */}
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <button
                            onClick={() => setInterviewPage(0)}
                            className={`p-1.5 rounded-lg transition-colors ${interviewPage === 0 ? 'text-primary bg-primary/10' : 'text-outline hover:bg-surface-bright'}`}
                            title="View Past"
                        >
                            <span className="material-symbols-outlined text-sm">history</span>
                        </button>
                        <p className="text-[0.6875rem] uppercase tracking-widest text-outline min-w-[150px] text-center">
                            {interviewPage === 0 ? 'Past Interviews' : 'Upcoming Interviews'}
                        </p>
                        <button
                            onClick={() => setInterviewPage(1)}
                            className={`p-1.5 rounded-lg transition-colors ${interviewPage === 1 ? 'text-primary bg-primary/10' : 'text-outline hover:bg-surface-bright'}`}
                            title="View Upcoming"
                        >
                            <span className="material-symbols-outlined text-sm">timer</span>
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
                        <section id="past-cards-scroll" className="flex overflow-x-auto gap-4 mb-10 pb-4 snap-x no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            <style>{`#past-cards-scroll::-webkit-scrollbar { display: none; }`}</style>
                            {PAST_INTERVIEWS.map((iv, i) => (
                                <button
                                    key={i}
                                    onClick={() => iv.reportId ? navigate(`/reports/${iv.reportId}`) : setSelectedInterview(iv)}
                                    className="flex-none w-[320px] snap-center relative group overflow-hidden bg-surface-container-high rounded-xl p-6 opacity-70 hover:opacity-100 transition-all duration-300 hover:bg-surface-bright text-left"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <CompanyLogo company={iv.company} />
                                        <span className="text-[0.6875rem] font-label tracking-widest text-outline">{iv.reportId ? 'REPORT' : 'COMPLETED'}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-on-surface mt-2">{iv.company}</h3>
                                    <p className="text-outline text-xs mt-1">{iv.role} · {iv.daysAgo}d ago</p>
                                    {iv.summary && (
                                        <p className="text-outline text-xs leading-5 mt-3 line-clamp-3">{iv.summary}</p>
                                    )}
                                    {typeof iv.overallScore === 'number' && iv.reportId && (
                                        <p className="text-primary text-sm font-semibold mt-3">{iv.overallScore}% overall score</p>
                                    )}
                                    <div className="mt-4 flex items-center text-xs text-outline group-hover:text-primary transition-colors">
                                        <span>{iv.action}</span>
                                        <span className="material-symbols-outlined text-xs ml-1">arrow_forward</span>
                                    </div>
                                    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <span className="material-symbols-outlined text-7xl">history</span>
                                    </div>
                                </button>
                            ))}
                        </section>
                    ) : (
                        /* Upcoming cards — single horizontal row */
                        <section id="upcoming-cards-scroll" className="flex overflow-x-auto gap-4 mb-10 pb-4 snap-x no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            <style>{`#upcoming-cards-scroll::-webkit-scrollbar { display: none; }`}</style>
                            {UPCOMING_CARDS.map((card, i) => (
                                <div
                                    key={i}
                                    className="flex-none w-[320px] snap-center relative group overflow-hidden bg-surface-container-high rounded-xl p-6 transition-all duration-300 hover:bg-surface-bright text-left"
                                >
                                    <button onClick={() => setSelectedInterview(card)} className="w-full text-left">
                                        <div className="flex justify-between items-start mb-2">
                                            <CompanyLogo company={card.company} />
                                            <span className="text-[0.6875rem] font-label tracking-widest text-outline">COUNTDOWN</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-on-surface mt-2">{card.company}</h3>
                                        <p className="text-secondary text-sm mt-1 mb-2">in {card.days} days</p>
                                        <div className="mt-3 flex items-center text-xs text-outline group-hover:text-primary transition-colors">
                                            <span>{card.actionLabel}</span>
                                            <span className="material-symbols-outlined text-xs ml-1">arrow_forward</span>
                                        </div>
                                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <span className="material-symbols-outlined text-7xl">timer</span>
                                        </div>
                                    </button>
                                    <div className="mt-5 flex gap-2">
                                        <button
                                            onClick={() => {
                                                setShowDemoSetup(true);
                                                setNewInterview({
                                                    title: card.role || '',
                                                    company: card.company || '',
                                                    date: '',
                                                    time: '',
                                                    type: card.type || 'Behavioral'
                                                });
                                            }}
                                            className="flex-1 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                                        >
                                            Mock
                                        </button>
                                        <button
                                            onClick={() => {
                                                const s = card.session;
                                                const dt = new Date(s.scheduled_datetime || s.created_at);
                                                setEditData({
                                                    id: s._id,
                                                    title: s.role || '',
                                                    company: s.company || '',
                                                    type: s.type || 'Behavioral',
                                                    date: dt.toISOString().slice(0,10),
                                                    time: dt.toTimeString().slice(0,5)
                                                });
                                                setIsEditOpen(true);
                                            }}
                                            className="flex-1 py-2 border border-outline-variant/30 text-on-surface rounded-lg text-sm hover:bg-surface-bright transition-colors"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
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
                                                'relative p-2 flex flex-col items-center text-sm min-h-[85px] transition-all duration-200',
                                                current ? 'cursor-pointer' : 'opacity-30 pointer-events-none',
                                                marker ? 'border border-primary/40 bg-primary/10 hover:bg-primary/20' : 'border border-outline-variant/5 hover:bg-surface-bright',
                                                today ? 'ring-2 ring-inset ring-primary' : '',
                                            ].join(' ')}
                                        >
                                            <span className={[
                                                'font-medium leading-none z-10 mb-2',
                                                today ? 'text-primary font-bold' : (marker ? 'text-primary-container font-black' : 'text-on-surface/70'),
                                            ].join(' ')}>
                                                {cell.day}
                                            </span>
                                            {marker && (
                                                <div className="w-full mt-auto bg-primary text-on-primary rounded px-1.5 py-1.5 flex flex-col items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                                                    <span className="text-[0.65rem] font-bold leading-none text-center truncate w-full uppercase tracking-wider drop-shadow-md">
                                                        {marker.company}
                                                    </span>
                                                </div>
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
