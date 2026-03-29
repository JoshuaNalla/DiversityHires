import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, IconButton, Avatar } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';

function HomePage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const characters = [
    { name: 'Ali', type: 'The Stress Tester', desc: 'Strict, analytical, and relentless. Ali is designed to push your technical boundaries and see how you handle intense pressure.', color: '#991B1B', avatarColor: '#FCA5A5' },
    { name: 'Martin', type: 'The Chill Mentor', desc: 'Relaxed and conversational. Martin provides a safe, low-stakes environment perfect for casually practicing your behavioral answers.', color: '#1E3A8A', avatarColor: '#60A5FA' },
    { name: 'Kaleb', type: 'The Curveball', desc: 'Eccentric and unpredictable. Kaleb will ask bizarre theoretical questions to test your critical thinking and adaptability on the fly.', color: '#047857', avatarColor: '#6EE7B7' },
    { name: 'Sara', type: 'The HR Specialist', desc: 'Focuses deeply on culture-fit and behavioral nuances. Sara analyzes your tone and empathy to ensure you project the right vibe.', color: '#6B21A8', avatarColor: '#D8B4FE' },
    { name: 'Customizer', type: 'Build Your Own', desc: 'Dial in the exact aggressiveness, expertise, and company-culture you want to practice against.', color: '#374151', avatarColor: '#9CA3AF' }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const scroll = (direction) => {
    if (direction === 'left') {
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : characters.length - 1));
    } else {
      setActiveIndex((prev) => (prev < characters.length - 1 ? prev + 1 : 0));
    }
  };

  return (
    <div className="bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen font-body overflow-x-hidden">

      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#101226]/80 backdrop-blur-xl border-b border-outline-variant/10">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
          <div className="text-xl font-semibold tracking-tighter text-[#e0e0fd] cursor-pointer" onClick={() => window.location.href = '/'}>Ethereal Prep</div>
          <div className="hidden md:flex items-center gap-8">
            <a className="font-['Inter'] text-sm tracking-wide text-[#968e94] hover:text-[#e0e0fd] transition-colors" href="#practice">Practice</a>
            <a className="font-['Inter'] text-sm tracking-wide text-[#968e94] hover:text-[#e0e0fd] transition-colors" href="#resume">Resume</a>
            <a className="font-['Inter'] text-sm tracking-wide text-[#968e94] hover:text-[#e0e0fd] transition-colors" href="#personas">Personas</a>
            <a className="font-['Inter'] text-sm tracking-wide text-[#968e94] hover:text-[#e0e0fd] transition-colors" href="#pricing">Pricing</a>
            <a className="font-['Inter'] text-sm tracking-wide text-[#968e94] hover:text-[#e0e0fd] transition-colors" href="#about">About</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="font-['Inter'] text-sm tracking-wide text-[#968e94] hover:text-[#e0e0fd] transition-colors px-4 py-2" onClick={() => setIsLoginOpen(true)}>Log In</button>
            <button className="bg-primary text-on-primary px-6 py-2 rounded-lg font-medium text-sm transition-transform scale-95 active:scale-90" onClick={() => setIsSignupOpen(true)}>Sign Up</button>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[921px] flex items-center justify-center overflow-hidden px-8">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]"></div>
            <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px]"></div>
          </div>
          <div className="relative z-10 max-w-4xl text-center">
            <span className="inline-block px-4 py-1.5 mb-6 rounded-full border border-outline-variant/20 bg-surface-container-low text-secondary text-[10px] uppercase tracking-[0.2em] font-medium">
              Powered by OpenFace & Gemini
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-on-background leading-[1.1]">
              Advance your <br /><span className="text-primary">interview prep</span>
            </h1>
            <p className="text-lg md:text-xl text-outline mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience a sanctuary of focused preparation. Leverage deep AI insights to master your micro-expressions and refine your professional narrative.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-10 py-4 bg-primary text-on-primary rounded-lg font-semibold text-lg hover:brightness-110 transition-all shadow-xl shadow-primary/10" onClick={() => setIsSignupOpen(true)}>Get Started</button>
              <button className="w-full sm:w-auto px-10 py-4 border border-outline-variant/30 text-on-surface rounded-lg font-medium text-lg hover:bg-surface-container-low transition-all">Watch Demo</button>
            </div>
          </div>
        </section>

        {/* AI Interpreter Section */}
        <section id="practice" className="py-32 px-8 bg-surface-container-low">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-on-background">Video based AI Emotion Interpreter</h2>
              <p className="text-outline text-lg mb-8 leading-relaxed">
                Our proprietary OpenFace implementation decodes subtle micro-expressions in real-time. Understand the silent signals you send—confidence, hesitation, or engagement—and learn to align your physical presence with your verbal expertise.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary mt-1">biotech</span>
                  <div>
                    <h4 className="font-semibold text-on-surface">Precision Tracking</h4>
                    <p className="text-sm text-outline">Mapping 68 facial landmarks to detect stress and authenticity levels.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary mt-1">analytics</span>
                  <div>
                    <h4 className="font-semibold text-on-surface">Sentiment Analysis</h4>
                    <p className="text-sm text-outline">Powered by Gemini for deep contextual understanding of your responses.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden bg-surface-container-highest border border-outline-variant/20 shadow-2xl relative flex items-center justify-center">

                {/* Visual Placeholder (Replaced Image) */}
                <div className="absolute inset-0 flex items-center justify-center bg-[#1c1e33] flex-col">
                  <span className="material-symbols-outlined text-6xl text-primary/30 mb-2">videocam</span>
                  <span className="text-primary font-bold tracking-widest uppercase opacity-50 text-[10px]">
                    [ VIDEO AI VISUALIZATION PLACEHOLDER ]
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>

                {/* UI Elements Over Placeholder */}
                <div className="absolute top-4 right-4 bg-surface-container-lowest/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                    <span className="text-[10px] font-bold tracking-widest text-[#e0e0fd] uppercase">Live Analysis</span>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div className="space-y-1">
                    <div className="text-[10px] uppercase tracking-tighter text-secondary">Confidence Score</div>
                    <div className="text-2xl font-bold text-[#e0e0fd]">92%</div>
                  </div>
                  <div className="flex gap-1 h-12 items-end">
                    <div className="w-1 bg-primary h-[20%] rounded-full"></div>
                    <div className="w-1 bg-primary h-[40%] rounded-full"></div>
                    <div className="w-1 bg-primary h-[80%] rounded-full"></div>
                    <div className="w-1 bg-primary h-[60%] rounded-full"></div>
                    <div className="w-1 bg-primary h-[90%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resume Analysis Section */}
        <section id="resume" className="py-32 px-8 bg-background">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

            {/* Visual Placeholder (Left Side) */}
            <div className="relative order-2 lg:order-1">
              <div className="aspect-video rounded-2xl overflow-hidden bg-surface-container-highest border border-outline-variant/20 shadow-xl relative flex items-center justify-center">

                {/* Visual Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center bg-[#1c1e33] flex-col">
                  <span className="material-symbols-outlined text-6xl text-primary/30 mb-2">dashboard_customize</span>
                  <span className="text-primary font-bold tracking-widest uppercase opacity-50 text-[10px]">
                    [ CUSTOMIZATION UI PLACEHOLDER ]
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-50"></div>
              </div>
            </div>

            {/* Text Content (Right Side) */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold mb-6 text-on-background">Customize Your Interview Experience</h2>
              <p className="text-outline text-lg mb-8 leading-relaxed">
                Tailor every aspect of your mock interview. Tell us where you want to work and what you're applying for, and we'll dynamically construct the perfect high-stakes environment to test your readiness.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary mt-1">business</span>
                  <div>
                    <h4 className="font-semibold text-on-surface">Target Company & Role</h4>
                    <p className="text-sm text-outline">Specify your dream company and role seniority. Our AI adjusts the difficulty and culture-fit questions accordingly.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary mt-1">upload_file</span>
                  <div>
                    <h4 className="font-semibold text-on-surface">Resume Context Extraction</h4>
                    <p className="text-sm text-outline">Drag and drop your resume. Personas will adapt their inquiries to drill into your specific experience claims and identify background gaps.</p>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* Personas Section (Carousel logic kept from previous, styling adapted to Ethereal theme) */}
        <section id="personas" className="py-32 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-4 text-on-background">Choose from a variety of personalities</h2>
              <p className="text-outline max-w-xl">Every company has a different vibe. Train against diverse personas to ensure you are never caught off guard.</p>
            </div>

            {/* MUI Carousel integrated into Tailwind Layout */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '480px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                py: 4
              }}
            >
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
                      backgroundColor: '#1c1e33', // surface-container from generic config
                      border: offset === 0 ? '2px solid #d2c2cf' : '1px solid #4b454a', // primary vs outline-variant
                      borderRadius: '16px',
                      width: '300px',
                      height: '420px',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
                      transform: `translateX(${offset * 300}px) scale(${offset === 0 ? 1 : 0.85})`,
                      opacity: offset === 0 ? 1 : 0.4,
                      zIndex: 10 - Math.abs(offset),
                      cursor: offset === 0 ? 'default' : 'pointer',
                      pointerEvents: 'auto',
                      boxShadow: offset === 0 ? '0 20px 40px -10px rgba(0,0,0,0.5)' : 'none'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4, pb: 2 }}>
                      <Avatar sx={{ width: 100, height: 100, backgroundColor: char.color, color: char.avatarColor }} />
                    </Box>

                    <Box sx={{ height: '1px', backgroundColor: '#4b454a', width: '100%', mb: 2 }} />

                    <CardContent sx={{ textAlign: 'center', p: 3, pt: 1, overflowY: 'auto' }}>
                      <Typography variant="h5" sx={{ fontWeight: '900', color: '#e0e0fd', mb: 0.5, fontFamily: 'Inter' }}>{char.name}</Typography>
                      <Typography variant="subtitle2" sx={{ color: char.avatarColor, fontWeight: 'bold', mb: 2, letterSpacing: '0.1em', fontFamily: 'Inter' }}>{char.type}</Typography>
                      <Typography variant="body2" sx={{ color: '#968e94', lineHeight: 1.6, fontFamily: 'Inter' }}>
                        {char.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, mt: 4 }}>
              <IconButton
                onClick={() => scroll('left')}
                sx={{ color: '#d2c2cf', border: '1px solid #4b454a', '&:hover': { backgroundColor: 'rgba(210, 194, 207, 0.1)' } }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
              <IconButton
                onClick={() => scroll('right')}
                sx={{ color: '#d2c2cf', border: '1px solid #4b454a', '&:hover': { backgroundColor: 'rgba(210, 194, 207, 0.1)' } }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>

            <div className="mt-16 p-12 rounded-3xl bg-gradient-to-r from-surface-container-low to-surface-container-highest flex flex-col md:flex-row items-center justify-between gap-8 border border-outline-variant/10">
              <div className="max-w-md">
                <h3 className="text-2xl font-bold mb-2 text-on-background">Build Your Own</h3>
                <p className="text-outline">Customize traits, industry focus, and questioning style to mirror your specific dream company.</p>
              </div>
              <button className="px-8 py-3 bg-on-surface text-surface rounded-lg font-bold hover:bg-primary transition-all flex items-center gap-2">
                <span className="material-symbols-outlined">tune</span>
                Launch Character Customizer
              </button>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 px-8 bg-surface-container-lowest border-t border-outline-variant/10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-on-background">The Right Path for Your Journey</h2>
              <p className="text-outline">Invest in your career growth with flexible options.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Free Plan */}
              <div className="p-10 rounded-2xl bg-surface border border-outline-variant/10 flex flex-col h-full">
                <h3 className="text-xl font-bold mb-2 text-on-background">Free</h3>
                <div className="text-3xl font-bold mb-6 text-on-background">$0<span className="text-sm text-outline font-normal">/mo</span></div>

                <ul className="space-y-4 mb-10 flex-grow text-on-surface">
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-secondary text-lg">check_circle</span>
                    2 Mock interviews per month
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-secondary text-lg">check_circle</span>
                    Standard persona access
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-secondary text-lg">check_circle</span>
                    Basic text feedback
                  </li>
                </ul>
                <button className="w-full py-4 border border-outline-variant/30 text-on-surface rounded-lg font-bold hover:bg-surface-container transition-all">Start Practicing</button>
              </div>

              {/* Pro Plan */}
              <div className="p-10 rounded-2xl bg-surface-container-highest border-2 border-primary/20 flex flex-col h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-on-primary text-[10px] font-bold px-4 py-1 rounded-bl-lg uppercase tracking-widest">Recommended</div>
                <h3 className="text-xl font-bold mb-2 text-on-background">Pro Plan</h3>
                <div className="text-3xl font-bold mb-6 text-on-background">$14.99<span className="text-sm text-outline font-normal">/mo</span></div>

                <ul className="space-y-4 mb-10 flex-grow text-on-surface">
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-primary text-lg" data-weight="fill">check_circle</span>
                    Unlimited Mock interviews
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-primary text-lg" data-weight="fill">check_circle</span>
                    OpenFace emotion tracking
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-primary text-lg" data-weight="fill">check_circle</span>
                    Deep Gemini AI insights
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-primary text-lg" data-weight="fill">check_circle</span>
                    Custom persona builder
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-primary text-lg" data-weight="fill">check_circle</span>
                    Transcript analysis & sharing
                  </li>
                </ul>
                <button className="w-full py-4 bg-primary text-on-primary rounded-lg font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20">Go Pro Now</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="about" className="w-full py-12 border-t border-outline-variant/20 bg-background">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-8 gap-6">
          <div className="flex flex-col gap-2 items-center md:items-start">
            <div className="text-lg font-bold text-on-background">Ethereal Prep</div>
            <p className="font-['Inter'] text-[10px] uppercase tracking-[0.05rem] text-outline">© 2024 Ethereal Prep. The Silent Coach for your career journey.</p>
          </div>
          <div className="flex gap-8">
            <a className="font-['Inter'] text-[10px] uppercase tracking-[0.05rem] text-outline hover:text-secondary transition-colors" href="#">Privacy Policy</a>
            <a className="font-['Inter'] text-[10px] uppercase tracking-[0.05rem] text-outline hover:text-secondary transition-colors" href="#">Terms of Service</a>
            <a className="font-['Inter'] text-[10px] uppercase tracking-[0.05rem] text-outline hover:text-secondary transition-colors" href="#">Contact</a>
            <a className="font-['Inter'] text-[10px] uppercase tracking-[0.05rem] text-outline hover:text-secondary transition-colors" href="#">Careers</a>
          </div>
        </div>
      </footer>

      {isLoginOpen && (
        <LoginModal 
          onClose={() => setIsLoginOpen(false)} 
          onSwitchToSignup={() => {
            setIsLoginOpen(false);
            setIsSignupOpen(true);
          }} 
        />
      )}
      {isSignupOpen && (
        <SignupModal 
          onClose={() => setIsSignupOpen(false)} 
          onSwitchToLogin={() => {
            setIsSignupOpen(false);
            setIsLoginOpen(true);
          }} 
        />
      )}
    </div>
  );
}

export default HomePage;
