import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, IconButton, Avatar } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';

function HomePage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const characters = [
    { name: 'Ali', type: 'The Stress Tester', desc: 'Strict, analytical, and relentless. Ali is designed to push your technical boundaries and see how you handle intense pressure.', bgColor: '#2d0a0a', avatarColor: '#fca5a5', accent: '#ef4444' },
    { name: 'Martin', type: 'The Chill Mentor', desc: 'Relaxed and conversational. Martin provides a safe, low-stakes environment perfect for casually practicing your behavioral answers.', bgColor: '#061430', avatarColor: '#93c5fd', accent: '#3b82f6' },
    { name: 'Kaleb', type: 'The Curveball', desc: 'Eccentric and unpredictable. Kaleb will ask bizarre theoretical questions to test your critical thinking and adaptability on the fly.', bgColor: '#031a0e', avatarColor: '#86efac', accent: '#22c55e' },
    { name: 'Sara', type: 'The HR Specialist', desc: 'Focuses deeply on culture-fit and behavioral nuances. Sara analyzes your tone and empathy to ensure you project the right vibe.', bgColor: '#170d30', avatarColor: '#d8b4fe', accent: '#a855f7' },
    { name: 'Customizer', type: 'Build Your Own', desc: 'Dial in the exact aggressiveness, expertise, and company-culture you want to practice against.', bgColor: '#0d1422', avatarColor: '#94a3b8', accent: '#6366f1' },
  ];

  const scroll = (direction) => {
    if (direction === 'left') {
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : characters.length - 1));
    } else {
      setActiveIndex((prev) => (prev < characters.length - 1 ? prev + 1 : 0));
    }
  };

  const companies = [
    { name: 'Google', icon: 'bi-google', color: '#4285F4', bg: '#fff' },
    { name: 'Amazon', icon: 'bi-amazon', color: '#FF9900', bg: '#111' },
    { name: 'Apple', icon: 'bi-apple', color: '#1d1d1f', bg: '#f5f5f7' },
    { name: 'Meta', icon: 'bi-meta', color: '#0082FB', bg: '#fff' },
    { name: 'Microsoft', icon: 'bi-microsoft', color: '#00a4ef', bg: '#fff' },
    { name: 'Nvidia', icon: 'bi-nvidia', color: '#76b900', bg: '#000' },
    { name: 'Stripe', icon: 'bi-stripe', color: '#6772E5', bg: '#fff' },
    { name: 'Uber', icon: null, letter: 'U', color: '#fff', bg: '#000' },
  ];

  return (
    <div className="bg-background text-on-surface min-h-screen font-body overflow-x-hidden">

      {/* ── Navigation ─────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-outline-variant/20">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-8 h-[72px]">
          <div
            className="text-xl font-bold tracking-tight cursor-pointer select-none"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            onClick={() => window.location.href = '/'}
          >
            Ethereal Prep
          </div>

          <div className="hidden md:flex items-center bg-surface-container-low border border-outline-variant/20 rounded-full px-2 py-1.5 gap-1">
            {['Practice', 'Resume', 'Personas', 'Pricing', 'About'].map((item) => (
              <a
                key={item}
                className="text-sm text-on-surface-variant hover:text-on-surface transition-colors px-4 py-1.5 rounded-full hover:bg-surface-container"
                href={`#${item.toLowerCase()}`}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              className="text-sm text-on-surface-variant hover:text-on-surface transition-colors px-4 py-2 rounded-lg hover:bg-surface-container"
              onClick={() => setIsLoginOpen(true)}
            >
              Log In
            </button>
            <button
              className="btn-primary text-sm px-5 py-2.5"
              onClick={() => setIsSignupOpen(true)}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-[72px]">

        {/* ── Hero ───────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-8 py-24">
          {/* Gradient orbs */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[900px] h-[900px] rounded-full opacity-[0.12]" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 65%)' }} />
            <div className="absolute top-1/4 left-1/5 w-[500px] h-[500px] rounded-full opacity-[0.07]" style={{ background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)' }} />
            <div className="absolute bottom-1/4 right-1/5 w-[400px] h-[400px] rounded-full opacity-[0.07]" style={{ background: 'radial-gradient(circle, #22d3ee 0%, transparent 70%)' }} />
            {/* Dot grid */}
            <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-primary/20 bg-primary/5 text-xs uppercase tracking-[0.2em] font-semibold text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Powered by OpenFace & Gemini
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.92]">
              <span className="text-on-background">Master every</span>
              <br />
              <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 45%, #22d3ee 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                interview
              </span>
            </h1>

            <p className="text-lg md:text-xl text-on-surface-variant mb-12 max-w-2xl mx-auto leading-relaxed">
              AI-powered mock interviews with real-time emotion analysis. Understand your micro-expressions, refine your narrative, and walk in with total confidence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                className="btn-primary w-full sm:w-auto px-10 py-4 text-base"
                onClick={() => setIsSignupOpen(true)}
              >
                Start for free
              </button>
              <button className="w-full sm:w-auto px-10 py-4 rounded-xl border border-outline-variant/40 text-on-surface-variant hover:text-on-surface hover:border-outline-variant/70 hover:bg-surface-container-low transition-all text-base font-medium">
                Watch Demo
              </button>
            </div>

            {/* Social proof */}
            <div className="mt-14 flex items-center justify-center gap-3 text-sm text-on-surface-variant">
              <div className="flex -space-x-2">
                {['#6366f1', '#22d3ee', '#a78bfa', '#f472b6'].map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold" style={{ background: `${c}30`, color: c }} >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span>Join <strong className="text-on-surface">2,400+</strong> candidates practicing daily</span>
            </div>
          </div>
        </section>

        {/* ── Company Logos ───────────────────────────────────────── */}
        <section className="py-16 px-8 border-y border-outline-variant/15 bg-surface-container-lowest">
          <p className="text-center text-[0.65rem] uppercase tracking-[0.3em] text-outline mb-10 font-semibold">Prepare for top-tier companies</p>
          <div className="flex flex-wrap items-center justify-center gap-6 max-w-4xl mx-auto">
            {companies.map(({ name, icon, letter, color, bg }) => (
              <div key={name} className="flex flex-col items-center gap-2 group">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-black/30"
                  style={{ background: bg }}
                >
                  {icon
                    ? <i className={`bi ${icon} text-xl`} style={{ color }} />
                    : <span className="text-sm font-bold" style={{ color }}>{letter}</span>
                  }
                </div>
                <span className="text-[0.6rem] uppercase tracking-widest text-outline group-hover:text-on-surface-variant transition-colors">{name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── AI Emotion Section ────────────────────────────────── */}
        <section id="practice" className="py-32 px-8">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-semibold tracking-wide">
                <span className="material-symbols-outlined text-sm">face_retouching_natural</span>
                Emotion Intelligence
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-on-background leading-[1.05]">
                Real-time emotion<br />analysis
              </h2>
              <p className="text-on-surface-variant text-lg mb-10 leading-relaxed">
                Our OpenFace implementation decodes micro-expressions in real-time. Understand the silent signals you send — confidence, hesitation, engagement — and learn to align your physical presence with your expertise.
              </p>
              <div className="space-y-5">
                {[
                  { icon: 'biotech', title: 'Precision Tracking', desc: '68 facial landmark detection for authentic stress and confidence measurement.', color: 'secondary' },
                  { icon: 'psychology', title: 'Sentiment Analysis', desc: 'Gemini-powered deep contextual understanding of your verbal responses.', color: 'secondary' },
                  { icon: 'insights', title: 'Actionable Feedback', desc: 'Get specific, timestamped insights to improve between sessions.', color: 'secondary' },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-secondary text-base">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-on-surface mb-1">{item.title}</h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/20 shadow-2xl shadow-black/50 relative">
                <div className="absolute inset-0 flex items-center justify-center bg-surface-container flex-col">
                  <span className="material-symbols-outlined text-7xl text-primary/15 mb-2">videocam</span>
                  <span className="text-primary/25 font-bold tracking-widest uppercase text-[10px]">Video AI Visualization</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />

                {/* Live indicator */}
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
                    <span className="text-[10px] font-bold tracking-widest text-on-surface uppercase">Live</span>
                  </div>
                </div>

                {/* Stats overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-background/85 backdrop-blur-xl rounded-xl p-4 border border-outline-variant/20">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Confidence</div>
                        <div className="text-3xl font-black text-on-surface">92%</div>
                      </div>
                      <div className="flex gap-1.5 h-12 items-end">
                        {[25, 45, 80, 65, 90, 55, 75].map((h, i) => (
                          <div key={i} className="w-2 rounded-full" style={{ height: `${h}%`, background: 'linear-gradient(to top, #6366f1, #a78bfa)' }} />
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full w-[92%]" style={{ background: 'linear-gradient(to right, #6366f1, #22d3ee)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating emotion badge */}
              <div className="absolute -left-6 top-1/3 bg-surface-container-high border border-outline-variant/30 rounded-xl p-4 shadow-2xl shadow-black/50 w-48 backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Detected</span>
                </div>
                <div className="text-sm font-bold text-on-surface">Confident</div>
                <div className="text-xs text-on-surface-variant mt-0.5">Slight tension in jaw</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Resume Section ────────────────────────────────────── */}
        <section id="resume" className="py-32 px-8 bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            {/* Visual */}
            <div className="relative order-2 lg:order-1">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/20 shadow-2xl shadow-black/50 relative">
                <div className="absolute inset-0 flex items-center justify-center bg-surface-container flex-col">
                  <span className="material-symbols-outlined text-7xl text-primary/15 mb-2">dashboard_customize</span>
                  <span className="text-primary/25 font-bold tracking-widest uppercase text-[10px]">Customization UI</span>
                </div>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, transparent 60%)' }} />
              </div>

              {/* Floating tags */}
              <div className="absolute bottom-6 -right-4 bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-2.5 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#4285F4]" />
                  <span className="text-xs font-semibold text-on-surface">Google • L5 SWE</span>
                </div>
              </div>
              <div className="absolute top-6 -right-4 bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-2.5 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-xs font-semibold text-on-surface">System Design</span>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide">
                <span className="material-symbols-outlined text-sm">tune</span>
                Customization
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-on-background leading-[1.05]">
                Tailored to your<br />exact target
              </h2>
              <p className="text-on-surface-variant text-lg mb-10 leading-relaxed">
                Tell us where you want to work and what you're applying for. We'll dynamically construct the perfect high-stakes environment that mirrors that company's culture.
              </p>
              <div className="space-y-5">
                {[
                  { icon: 'business', title: 'Target Company & Role', desc: 'Specify your dream company and seniority. Our AI adjusts difficulty and culture-fit questions accordingly.' },
                  { icon: 'upload_file', title: 'Resume Context', desc: 'Drag in your resume. Personas drill into your specific experience claims and surface background gaps.' },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-primary text-base">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-on-surface mb-1">{item.title}</h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-6">
                {[
                  { icon: 'bi-google', color: '#4285F4', bg: '#fff' },
                  { icon: 'bi-amazon', color: '#FF9900', bg: '#111' },
                  { icon: 'bi-meta', color: '#0082FB', bg: '#fff' },
                  { icon: 'bi-microsoft', color: '#00a4ef', bg: '#fff' },
                  { icon: 'bi-apple', color: '#1d1d1f', bg: '#f5f5f7' },
                ].map(({ icon, color, bg }) => (
                  <div key={icon} className="w-8 h-8 rounded-lg flex items-center justify-center hover:scale-110 transition-transform shadow-md" style={{ background: bg }}>
                    <i className={`bi ${icon} text-sm`} style={{ color }} />
                  </div>
                ))}
                <span className="text-xs text-outline ml-1">+ more</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Personas Section ──────────────────────────────────── */}
        <section id="personas" className="py-32 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-tertiary/10 border border-tertiary/20 text-tertiary text-xs font-semibold tracking-wide">
                <span className="material-symbols-outlined text-sm">psychology</span>
                AI Personas
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-on-background">
                Train against diverse<br />personalities
              </h2>
              <p className="text-on-surface-variant max-w-xl mx-auto">Every company has a different vibe. Practice with interviewers who challenge you in fundamentally different ways.</p>
            </div>

            <Box sx={{ position: 'relative', width: '100%', height: '460px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', py: 4 }}>
              {characters.map((char, index) => {
                let offset = index - activeIndex;
                if (offset > 2) offset -= characters.length;
                if (offset < -2) offset += characters.length;
                const isVisible = Math.abs(offset) <= 2;
                if (!isVisible) return null;
                return (
                  <Card
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    sx={{
                      position: 'absolute',
                      background: offset === 0
                        ? `linear-gradient(160deg, ${char.bgColor} 0%, #101829 100%)`
                        : '#0c1220',
                      border: offset === 0 ? `1px solid ${char.accent}35` : '1px solid #1e293b',
                      borderRadius: '20px',
                      width: '280px',
                      height: '380px',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
                      transform: `translateX(${offset * 290}px) scale(${offset === 0 ? 1 : 0.82})`,
                      opacity: offset === 0 ? 1 : 0.3,
                      zIndex: 10 - Math.abs(offset),
                      cursor: offset === 0 ? 'default' : 'pointer',
                      pointerEvents: 'auto',
                      boxShadow: offset === 0 ? `0 30px 60px -15px ${char.accent}20` : 'none',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 5, pb: 2 }}>
                      <Avatar sx={{
                        width: 80,
                        height: 80,
                        background: `linear-gradient(135deg, ${char.bgColor}, ${char.accent}50)`,
                        border: `2px solid ${char.accent}30`,
                        fontSize: '2rem',
                        fontWeight: 900,
                        fontFamily: 'Inter',
                        color: char.avatarColor,
                      }}>
                        {char.name[0]}
                      </Avatar>
                    </Box>
                    <Box sx={{ height: '1px', background: 'rgba(255,255,255,0.04)', width: '100%', mb: 2 }} />
                    <CardContent sx={{ textAlign: 'center', p: 3, pt: 1, overflowY: 'auto' }}>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#e2e8f0', mb: 0.5, fontFamily: 'Inter', letterSpacing: '-0.02em' }}>
                        {char.name}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ color: char.avatarColor, fontWeight: 600, mb: 2, letterSpacing: '0.08em', fontSize: '0.65rem', textTransform: 'uppercase', fontFamily: 'Inter' }}>
                        {char.type}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.75, fontFamily: 'Inter', fontSize: '0.825rem' }}>
                        {char.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 4 }}>
              <IconButton
                onClick={() => scroll('left')}
                sx={{ color: '#6366f1', border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(99,102,241,0.05)', '&:hover': { background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.4)' } }}
              >
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {characters.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    style={{
                      height: '6px',
                      borderRadius: '9999px',
                      border: 'none',
                      padding: 0,
                      transition: 'all 0.3s ease',
                      width: i === activeIndex ? '24px' : '6px',
                      background: i === activeIndex ? '#6366f1' : 'rgba(99,102,241,0.2)',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
              <IconButton
                onClick={() => scroll('right')}
                sx={{ color: '#6366f1', border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(99,102,241,0.05)', '&:hover': { background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.4)' } }}
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Build Your Own CTA */}
            <div className="mt-16 p-10 rounded-3xl border border-outline-variant/20 bg-surface-container-low relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top left, rgba(99,102,241,0.15), transparent 60%)' }} />
              <div className="relative max-w-md">
                <h3 className="text-2xl font-bold mb-2 text-on-background">Build Your Own Persona</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">Customize traits, industry focus, and questioning style to mirror your specific dream company's interview culture.</p>
              </div>
              <button className="relative btn-primary px-8 py-3.5 flex items-center gap-2 whitespace-nowrap text-sm">
                <span className="material-symbols-outlined text-base">tune</span>
                Launch Character Customizer
              </button>
            </div>
          </div>
        </section>

        {/* ── Pricing ───────────────────────────────────────────── */}
        <section id="pricing" className="py-32 px-8 bg-surface-container-lowest">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide">
                <span className="material-symbols-outlined text-sm">workspace_premium</span>
                Pricing
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-on-background">
                Invest in your career
              </h2>
              <p className="text-on-surface-variant">Flexible options for every stage of your journey.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Free */}
              <div className="p-8 rounded-2xl bg-surface-container border border-outline-variant/20 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">Free</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-on-background">$0</span>
                    <span className="text-on-surface-variant text-sm">/month</span>
                  </div>
                </div>
                <ul className="space-y-3.5 mb-8 flex-grow">
                  {[
                    '2 mock interviews per month',
                    'Standard persona access',
                    'Basic text feedback',
                  ].map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-on-surface-variant">
                      <div className="w-5 h-5 rounded-full bg-surface-container-high border border-outline-variant/40 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-outline" style={{ fontSize: '12px' }}>check</span>
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3.5 rounded-xl border border-outline-variant/40 text-on-surface-variant hover:text-on-surface hover:border-outline-variant/70 hover:bg-surface-container-high transition-all font-semibold text-sm">
                  Start practicing
                </button>
              </div>

              {/* Pro */}
              <div className="relative p-8 rounded-2xl flex flex-col overflow-hidden" style={{ background: 'linear-gradient(160deg, #131d3a 0%, #0c1220 100%)', border: '1px solid rgba(99,102,241,0.25)' }}>
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(99,102,241,0.15), transparent 60%)' }} />
                <div className="absolute top-5 right-5 bg-primary text-on-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  Most Popular
                </div>
                <div className="relative mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Pro</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-on-background">$14</span>
                    <span className="text-on-surface-variant text-xl font-bold">.99</span>
                    <span className="text-on-surface-variant text-sm">/month</span>
                  </div>
                </div>
                <ul className="space-y-3.5 mb-8 flex-grow relative">
                  {[
                    'Unlimited mock interviews',
                    'OpenFace emotion tracking',
                    'Deep Gemini AI insights',
                    'Custom persona builder',
                    'Transcript analysis & sharing',
                    'Priority support',
                  ].map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-on-surface">
                      <div className="w-5 h-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-primary" style={{ fontSize: '12px' }}>check</span>
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className="relative btn-primary w-full py-3.5 text-sm font-bold">
                  Get Pro now
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer id="about" className="py-16 border-t border-outline-variant/20 bg-background">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div
              className="text-lg font-bold mb-1.5"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Ethereal Prep
            </div>
            <p className="text-[0.65rem] uppercase tracking-wider text-outline">© 2024 Ethereal Prep · The Silent Coach for your career journey.</p>
          </div>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Contact', 'Careers'].map(link => (
              <a key={link} className="text-xs text-outline hover:text-on-surface-variant transition-colors" href="#">{link}</a>
            ))}
          </div>
        </div>
      </footer>

      {isLoginOpen && (
        <LoginModal
          onClose={() => setIsLoginOpen(false)}
          onSwitchToSignup={() => { setIsLoginOpen(false); setIsSignupOpen(true); }}
        />
      )}
      {isSignupOpen && (
        <SignupModal
          onClose={() => setIsSignupOpen(false)}
          onSwitchToLogin={() => { setIsSignupOpen(false); setIsLoginOpen(true); }}
        />
      )}
    </div>
  );
}

export default HomePage;
