import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, CheckCircle, CheckCircle2, X, ChevronDown, Sparkles, Eye, Download, ShieldCheck, Timer, Phone, Mail, User, Lock, Loader2 } from 'lucide-react';
import { COURSES } from '../constants';
import { triggerStripeSubscriptionCheckout } from '../lib/stripe';
import { sendStudentWelcomeEmail } from '../lib/email';
import { registerStudent } from '../lib/students';
import {
  Logo, SocialProofToast,
  PROBLEM_POINTS, TRANSFORMATION_STORIES, FEAR_STATS,
  VALUE_STACK_ITEMS, TESTIMONIALS_LANDING, FAQ_ITEMS_LANDING, INCOME_TIERS,
  PAGE_PREVIEWS_ROW1, PAGE_PREVIEWS_ROW2
} from './LandingHelpers';

/* ─── REUSABLE CTA WITH TIMER ─── */
const CtaWithTimer = ({ timeLeft, onClick, variant = 'green' }: { timeLeft: { h: number; m: number; s: number }; onClick: () => void; variant?: 'green' | 'dark' | 'blue' }) => {
  const f = (v: number) => v.toString().padStart(2, '0');
  const bgClass = variant === 'dark'
    ? 'bg-slate-900 border border-slate-800'
    : 'bg-white border border-slate-200 shadow-md';
  const btnClass = 'bg-orange-600 hover:bg-orange-700 text-white font-extrabold';
  const timerAccent = 'text-orange-500';
  const timerBg = variant === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-orange-50 border-orange-200';

  return (
    <div className={`${bgClass} rounded-2xl px-5 py-6 relative overflow-hidden max-w-sm mx-auto`}>
      <div className="absolute top-0 right-0 w-60 h-60 bg-orange-500/10 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-500/10 rounded-full blur-[60px] -ml-10 -mb-10 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center gap-3">
        {/* Timer label */}
        <div className="flex items-center gap-1.5">
          <Timer size={14} className={`${timerAccent} animate-pulse`} />
          <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${timerAccent}`}>Limited 3-Day Trial</span>
        </div>

        {/* Timer digits */}
        <div className="flex items-center gap-1">
          {[{ val: f(timeLeft.h), label: 'HRS' }, { val: f(timeLeft.m), label: 'MIN' }, { val: f(timeLeft.s), label: 'SEC' }].map((unit, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center">
                <div className={`${timerBg} border rounded-md px-2 py-0.5`}>
                  <span className={`text-sm font-black tabular-nums font-mono ${variant === 'dark' ? 'text-white' : 'text-slate-900'}`}>{unit.val}</span>
                </div>
                <span className={`text-[6px] font-bold uppercase tracking-widest mt-0.5 ${variant === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{unit.label}</span>
              </div>
              {i < 2 && <span className={`text-xs font-bold ${variant === 'dark' ? 'text-slate-600' : 'text-slate-300'} -mt-3`}>:</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-display font-black text-orange-600 dark:text-orange-400">Free Trial</span>
          <span className="bg-orange-100 text-orange-700 text-[9px] font-bold px-2 py-0.5 rounded-full">3 DAYS ACCESS</span>
        </div>

        {/* Button */}
        <button
          onClick={onClick}
          className={`${btnClass} text-sm px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-[0.98] transition-all w-full shadow-lg shadow-orange-600/30`}
        >
          <Sparkles size={16} className="shrink-0" />
          <span>Start 3-Day Free Trial</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform shrink-0" />
        </button>

        <p className={`text-[10px] font-medium ${variant === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>72 Hours Full Access • Then $20/mo • Cancel Anytime</p>
      </div>
    </div>
  );
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(() => { const D = (3 * 3600 + 36 * 60 + 20) * 1000, r = D - (Date.now() % D); return { h: Math.floor((r / 3600000) % 24), m: Math.floor((r / 60000) % 60), s: Math.floor((r / 1000) % 60) }; });
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [studentCount, setStudentCount] = useState(22392);
  const [headlineIndex, setHeadlineIndex] = useState(0);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIndex((prev) => (prev === 0 ? 1 : 0));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const calc = () => { const D = (3 * 3600 + 36 * 60 + 20) * 1000, now = Date.now(), r = D - (now % D); setTimeLeft({ h: Math.floor((r / 3600000) % 24), m: Math.floor((r / 60000) % 60), s: Math.floor((r / 1000) % 60) }); };
    const t = setInterval(calc, 1000); calc(); return () => clearInterval(t);
  }, []);
  useEffect(() => { const h = () => setShowStickyBar(window.scrollY > 600); window.addEventListener('scroll', h, { passive: true }); return () => window.removeEventListener('scroll', h); }, []);
  useEffect(() => { const t = setInterval(() => setStudentCount(c => c + 1), 5000); return () => clearInterval(t); }, []);

  const formatTime = (val: number) => val.toString().padStart(2, '0');
  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const openPaymentModal = () => {
    setShowPaymentModal(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !validateEmail(email)) {
      setEmailError(true);
      return;
    }
    setEmailError(false);
    setIsLoading(true);

    await triggerStripeSubscriptionCheckout(
      {
        monthlyPrice: 20,
        trialDays: 3,
        productName: 'Avada Architecture Masterclass Pass',
      },
      {
        name: email.split('@')[0],
        email: email.trim(),
        phone: ''
      },
      () => {
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden selection:bg-orange-100">
      <main>
        {/* 1. HERO — The Hook */}
        <section className="relative pt-0 pb-10 md:pb-20 overflow-hidden" style={{ background: '#ffffff' }}>
          <div className="w-full px-4 md:max-w-4xl md:mx-auto relative z-10">
            <div className="flex flex-col items-center text-center pt-7 md:pt-14">

              {/* Top badge */}
              <div className="mb-3 inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 border border-orange-200 rounded-full shadow-sm">
                <CheckCircle2 size={13} className="text-orange-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-700">
                  AI-Powered Design Masterclass • Charge <span className="text-orange-600 font-bold">$1,500–$5,000</span> / Project
                </span>
              </div>

              {/* Big headline with 3-second dynamic toggle */}
              <h1 className="tracking-tight mb-2 md:mb-3 min-h-[90px] md:min-h-[120px] flex flex-col justify-center items-center w-full">
                <div key={headlineIndex} className="animate-in fade-in zoom-in-95 duration-500 text-center w-full">
                  {headlineIndex === 0 ? (
                    <>
                      <span className="block text-3xl sm:text-4xl md:text-6xl font-display font-black text-slate-900 leading-tight">
                        Learn to Design
                      </span>
                      <span className="block text-2xl sm:text-3xl md:text-5xl font-display font-black mt-1">
                        <span className="text-orange-600">Homes</span><span className="text-slate-400 font-light mx-1">,</span><span className="text-slate-900">Offices</span><span className="text-slate-400 font-light mx-1"> &</span><span className="text-slate-700">Villas</span>
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="block text-2xl sm:text-3xl md:text-5xl font-display font-black text-slate-900 leading-tight">
                        Learn Interior & Exterior
                      </span>
                      <span className="block text-3xl sm:text-4xl md:text-6xl font-display font-black text-orange-600 mt-1">
                        Designing in 15 Days
                      </span>
                    </>
                  )}
                </div>
                <span className="block text-base md:text-xl font-serif italic text-slate-600 mt-2">
                  and present real 3D renders to clients.
                </span>
              </h1>

              {/* Subhead Tagline */}
              <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-lg mb-6 font-medium">
                Master <strong className="text-slate-900 font-bold">PDR</strong> (Planning, Designing & Rendering). Everything included in your 3-Day Free Trial.
              </p>

              {/* Story & Video Block */}
              <div className="w-full max-w-3xl mx-auto mb-6 text-left bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-sm border border-orange-100 relative overflow-hidden">
                <p className="text-sm md:text-base font-serif text-slate-800 leading-relaxed mb-2 italic">
                  "In Architecture & Design, <span className="font-bold text-slate-900 border-b-2 border-orange-400">Planning, Design & Rendering</span> matter most."
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs md:text-sm text-slate-500 font-medium">The key question is:</span>
                  <span className="text-sm md:text-lg font-display font-black text-orange-600">How to do it FASTER with AI?</span>
                </div>

                {/* Hero Video */}
                <div className="w-full mb-4 overflow-hidden rounded-xl shadow-lg" style={{ position: 'relative', paddingTop: '56.25%' }}>
                  <iframe src="https://iframe.mediadelivery.net/embed/489113/a214b199-e64a-4eaf-af70-edfbc586e5fd?autoplay=true&loop=true&muted=true&preload=true&responsive=true" loading="lazy" style={{ border: 0, position: 'absolute', top: 0, height: '100%', width: '100%' }} allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;" allowFullScreen={true} />
                </div>

                <div className="flex items-center gap-3 p-3 bg-orange-50/80 border border-orange-100 rounded-xl">
                  <span className="text-lg md:text-xl shrink-0">🚀</span>
                  <p className="text-slate-700 font-medium text-xs md:text-sm leading-snug">
                    A complete blueprint from software basics to client renders — <strong className="text-orange-600 font-bold">Job & Business Ready in 30 Days.</strong>
                  </p>
                </div>
              </div>

              {/* HERO CTA BUTTON */}
              <div className="flex flex-col sm:flex-row gap-3 items-center mb-2 w-full sm:w-auto">
                <button onClick={openPaymentModal} className="w-full sm:w-auto px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-extrabold text-sm md:text-lg shadow-xl shadow-orange-600/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group cursor-pointer">
                  <Sparkles size={20} className="shrink-0 text-amber-300" />
                  Start 3-Day Free Trial <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </button>
              </div>
              <p className="text-[10px] md:text-xs text-slate-500 mb-6 font-bold">72 Hours Access • Card Authorization Only • Cancel Anytime</p>

              {/* Green Freelance Projects Pill */}
              <div className="w-full max-w-xl mx-auto mb-8 px-2">
                <div className="w-full bg-[#059669] hover:bg-[#047857] text-white font-extrabold rounded-full py-3 px-5 shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 text-xs sm:text-sm tracking-wide text-center transition-all duration-300 transform hover:scale-[1.01]">
                  <span>3 Freelance Paid Projects For Every Student (Worth 300 USD)</span>
                </div>
              </div>

              {/* Banners below First CTA */}
              <div className="w-full max-w-3xl mx-auto flex flex-col gap-4 md:gap-6 mb-8 md:mb-12">
                <div className="overflow-hidden rounded-2xl shadow-lg border border-slate-100">
                  <img
                    src="/banner-1.jpg"
                    alt="Learn to Design Home, Offices & Villas"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl shadow-lg border border-slate-100">
                  <img
                    src="/banner-2.jpg"
                    alt="Design for Clients From US, UK, Europe"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>

              {/* Outcome strip */}
              <div className="w-full mb-6 flex gap-2">
                <div className="flex-1 bg-orange-50/50 border border-orange-200 rounded-xl px-3 py-3 text-left">
                  <p className="text-base font-black text-slate-900">💼 Get a Better Job</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Higher-paying design roles</p>
                </div>
                <div className="flex-1 bg-orange-50/50 border border-orange-200 rounded-xl px-3 py-3 text-left">
                  <p className="text-base font-black text-slate-900">🏢 Own Design Firm</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Freelance & studio projects</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ═══════ COURSE SLIDESHOW — Master Every Tool ═══════ */}
        <section className="py-8 md:py-16 bg-white border-b border-gray-100 overflow-hidden relative">
           <div className="container mx-auto px-4 mb-8">
             <div className="text-center">
                 <div className="inline-flex items-center gap-2 text-orange-600 text-xs font-bold uppercase tracking-widest mb-2">
                   <Sparkles size={14} />
                   All Masterclasses Included
                 </div>
                 <h2 className="text-2xl md:text-4xl font-display font-black text-gray-900 leading-tight">Master Every Tool Needed<br/>For Professional Design</h2>
             </div>
           </div>
           
           <div className="flex flex-col gap-3 md:gap-4 relative w-full overflow-hidden pb-4">
            {/* ROW 1: Courses 1 to 6 */}
            <div className="flex gap-3 md:gap-4 animate-scroll-right hover:pause w-max pl-4 md:pl-6">
              {[...COURSES.slice(0, 6), ...COURSES.slice(0, 6)].map((course, i) => {
                const globalIndex = i % 6;
                return (
                  <div key={`row1-${course.id}-${i}`} className="w-[140px] md:w-[150px] shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      
                      <div className="absolute top-1.5 left-1.5 w-6 h-6 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center font-display font-bold text-gray-900 shadow-sm text-[10px] border border-gray-200">
                        {globalIndex + 1}
                      </div>
                      
                      <div className="absolute top-1.5 right-1.5 bg-white/95 backdrop-blur-sm text-gray-900 text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full shadow-sm border border-gray-200">
                        {course.software}
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <h3 className="font-display font-bold text-gray-900 text-xs md:text-sm mb-1 line-clamp-1 leading-tight" title={course.title}>{course.title}</h3>
                      <div className="mt-1 pt-1 border-t border-gray-100">
                        <div className="bg-orange-50 text-orange-600 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center justify-center gap-1 border border-orange-100 w-full">
                          <CheckCircle2 size={8}/> Included
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════ CTA #1 — After Course Showcase ═══════ */}
        <section className="py-8 md:py-10 px-4 md:px-5">
          <div className="max-w-3xl mx-auto">
            <CtaWithTimer timeLeft={timeLeft} onClick={openPaymentModal} variant="green" />
          </div>
        </section>

        {/* 4. STUDENT WORK CAROUSEL — Visual Proof */}
        <section className="py-16 md:py-24 bg-slate-50 overflow-hidden border-b border-slate-200 grid-bg">
          <div className="max-w-5xl mx-auto px-5 mb-12 text-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">See What Our <span className="text-orange-600">Students Have Created</span></h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto italic font-serif">"With 24/7 team support, these students transformed their portfolios and confidence."</p>
            </div>
          </div>
          <div className="flex flex-col gap-6 md:gap-8">
            <div className="flex gap-3 md:gap-8 animate-scroll-left hover:pause">
              {[...PAGE_PREVIEWS_ROW1, ...PAGE_PREVIEWS_ROW1].map((img, i) => (
                <div key={i} className="w-[200px] md:w-[400px] shrink-0 aspect-video rounded-xl md:rounded-2xl overflow-hidden border border-slate-200 shadow-2xl relative group bg-slate-100">
                  <img src={img} alt="Student Work" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 md:gap-8 animate-scroll-right hover:pause">
              {[...PAGE_PREVIEWS_ROW2, ...PAGE_PREVIEWS_ROW2].map((img, i) => (
                <div key={i} className="w-[200px] md:w-[400px] shrink-0 aspect-video rounded-xl md:rounded-2xl overflow-hidden border border-slate-200 shadow-2xl relative group bg-slate-100">
                  <img src={img} alt="Student Work" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. INCOME TIERS — The ROI */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-5">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">Invest in Yourself Today. <br className="hidden md:block" /><span className="text-orange-600">Start making money in the industry.</span></h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {INCOME_TIERS.map((tier, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-orange-600/40 transition-all shadow-soft flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4"><span className="text-sm font-bold text-slate-900 leading-tight w-2/3">{tier.label}</span><span className="text-3xl">{tier.icon}</span></div>
                  <div className="flex items-center justify-between">
                    <div><p className="text-[10px] font-mono text-slate-500 uppercase">Before</p><p className="text-slate-400 text-sm line-through">{tier.before}</p></div>
                    <ArrowRight size={16} className="text-orange-600" />
                    <div className="text-right"><p className="text-[10px] font-mono text-orange-500 uppercase">After</p><p className="text-orange-600 text-sm font-bold">{tier.after}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. WHAT YOU GET — The Offer */}
        <section className="py-16 md:py-20 bg-slate-50 border-y border-slate-200 grid-bg">
          <div className="max-w-5xl mx-auto px-5">
            <div className="text-center mb-10">
              <p className="text-orange-600 text-xs font-mono uppercase tracking-widest mb-3">Included with 3-Day Free Trial</p>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">Everything You Need to Succeed, <span className="text-orange-600">Included Today</span></h2>
              <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto">Full 72 hours of unrestricted access to all 7 course masterclasses + support team.</p>
            </div>
            <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-soft">
              {VALUE_STACK_ITEMS.map((item, i) => (
                <div key={i} className={`flex justify-between items-center px-6 py-4 ${i !== VALUE_STACK_ITEMS.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <div className="flex items-center gap-3"><CheckCircle size={16} className="text-orange-500 shrink-0" /><span className="text-sm text-slate-800 font-medium">{item.name}</span></div>
                  <span className="text-sm font-bold text-slate-500">{item.value}</span>
                </div>
              ))}
              
              <div className="bg-orange-50 border-t border-orange-100 px-6 py-4 flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-orange-600 shrink-0" /><span className="text-sm text-orange-900 font-bold">3-Day Free Trial</span></div>
                <span className="text-sm font-black text-orange-600">INCLUDED</span>
              </div>

              <div className="bg-orange-50/50 border-t border-orange-200 px-6 py-6 flex flex-col items-center gap-6 justify-center">
                <button onClick={openPaymentModal} className="w-full sm:w-auto px-10 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-extrabold text-lg shadow-xl shadow-orange-600/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group">
                  <Sparkles size={18} /> Start 3-Day Free Trial <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ CTA #2 — After Value Stack ═══════ */}
        <section className="py-8 md:py-10 px-4 md:px-5 bg-white">
          <div className="max-w-3xl mx-auto">
            <CtaWithTimer timeLeft={timeLeft} onClick={openPaymentModal} variant="green" />
          </div>
        </section>

        {/* 2. PROOF STATS */}
        <section className="py-10 bg-slate-50 border-y border-slate-200 grid-bg">
          <div className="max-w-5xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-6">
            {FEAR_STATS.map((s, i) => (
              <div key={i} className="text-center">
                <span className="text-2xl mb-2 block">{s.icon}</span>
                <span className="text-3xl md:text-4xl font-display font-black text-orange-600">{s.stat}</span>
                <p className="text-xs text-slate-500 mt-1 leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. MANIFESTO — The Story */}
        <section className="py-16 md:py-28 grid-bg bg-white border-b border-slate-200">
          <div className="max-w-3xl mx-auto px-5">
            <div className="text-center mb-12">
              <p className="text-orange-600 text-xs font-mono uppercase tracking-widest mb-4">A Supportive Message from Our Team</p>
              <h2 className="text-3xl md:text-5xl font-serif italic text-slate-900 mb-8 leading-snug">"We believe in practical, hands-on learning with experts who are always ready to help you."</h2>
            </div>
            <div className="space-y-6 text-slate-600 text-base md:text-lg leading-relaxed">
              <p>Learning complex software can feel overwhelming <strong className="text-slate-900">when you're doing it alone.</strong></p>
              <p>That's why our program is built differently. You aren't just getting tutorial videos; you're joining a community where our team reviews your work, answers your technical questions, and cheers you on as you improve.</p>
              
              <div className="my-10 bg-gradient-to-br from-orange-50 to-orange-50/50 border border-orange-200 rounded-2xl p-6 md:p-8 shadow-soft">
                <p className="font-bold text-slate-900 text-xl mb-4">Here is How We Support You:</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3"><CheckCircle size={18} className="text-orange-500 shrink-0" /><span className="text-slate-800">Full 3-Day Free Trial to explore all video streams.</span></li>
                  <li className="flex items-center gap-3"><CheckCircle size={18} className="text-orange-500 shrink-0" /><span className="text-slate-800">4 Complete Masterclasses: SketchUp, V-Ray, D5 Render & AutoCAD.</span></li>
                  <li className="flex items-center gap-3"><CheckCircle size={18} className="text-orange-500 shrink-0" /><span className="text-slate-800">24/7 team support whenever you feel stuck.</span></li>
                </ul>
                <div className="mt-6 pt-6 border-t border-orange-100 flex items-center justify-between">
                  <span className="text-slate-600 text-sm italic font-bold">Start your 3-Day Trial today.</span>
                  <button onClick={openPaymentModal} className="text-orange-600 font-bold text-sm hover:text-orange-700 flex items-center gap-1 group">Start Trial Now <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. TESTIMONIALS */}
        <section className="py-16 md:py-24 bg-white overflow-hidden grid-bg">
          <div className="max-w-5xl mx-auto px-5 mb-12">
            <div className="text-center mb-12">
              <p className="text-orange-600 text-xs font-mono uppercase tracking-widest mb-4">Student Reviews</p>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">Students & <span className="text-orange-600">Professionals</span></h2>
              <p className="text-slate-600 text-lg">50,000+ learners • 4.9★ average rating</p>
            </div>

            {/* Featured Transformations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {TRANSFORMATION_STORIES.map((story, i) => (
                <div key={i} className="bg-gradient-to-br from-slate-50 to-orange-50/50 border border-slate-200 rounded-2xl p-8 shadow-soft relative overflow-hidden transition-all hover:border-orange-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
                  <span className="text-4xl mb-4 block">{story.emoji}</span>
                  <div className="flex items-center gap-2 mb-6"><span className="font-bold text-slate-900 text-lg">{story.name}</span><span className="text-sm font-medium text-orange-600">• {story.role}</span></div>
                  <div className="mb-4"><p className="text-[10px] font-mono uppercase text-slate-400 mb-1 tracking-wider">Before</p><p className="text-slate-600 text-sm leading-relaxed">{story.before}</p></div>
                  <div><p className="text-[10px] font-mono uppercase text-orange-600 mb-1 tracking-wider">After</p><p className="text-slate-900 text-base font-bold leading-relaxed">{story.after}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex gap-6 animate-scroll-left hover:pause">
              {[...TESTIMONIALS_LANDING, ...TESTIMONIALS_LANDING].map((t, i) => (
                <div key={i} className="w-[350px] shrink-0 bg-white border border-slate-200 p-8 rounded-3xl hover:border-orange-200 transition-all shadow-soft">
                  <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} size={14} className="fill-orange-500 text-orange-500" />)}</div>
                  <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">"{t.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center font-bold text-orange-600">{t.name[0]}</div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-900 flex items-center gap-1">{t.name} <CheckCircle size={12} className="text-orange-600" /></p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">{t.role} • {t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. FAQ + FINAL CTA */}
        <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-200 grid-bg">
          <div className="max-w-3xl mx-auto px-5 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">Common Questions</h2>
              <p className="text-slate-600 text-base">Everything you need to know before starting your 3-day trial.</p>
            </div>
            <div className="space-y-3">
              {FAQ_ITEMS_LANDING.map((faq, i) => (
                <details key={i} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-soft" open={openFaqIndex === i}>
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none" onClick={(e) => { e.preventDefault(); setOpenFaqIndex(openFaqIndex === i ? null : i); }}>
                    <span className="text-sm md:text-base font-semibold text-slate-900 pr-6">{faq.question}</span>
                    <ChevronDown size={18} className={`text-slate-400 transition-transform shrink-0 ${openFaqIndex === i ? 'rotate-180' : ''}`} />
                  </summary>
                  <div className="px-5 pb-5"><p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p></div>
                </details>
              ))}
            </div>
          </div>

          {/* ═══════ CTA #3 — Final CTA ═══════ */}
          <div className="max-w-3xl mx-auto px-4 md:px-5">
            <div className="text-center mb-6 md:mb-8">
              <h3 className="text-xl md:text-3xl font-display font-bold text-slate-900 mb-2">Let us hold your hand towards a brighter future.</h3>
              <p className="text-slate-500 text-xs md:text-sm">Start your 3-Day Free Trial and explore all masterclasses.</p>
            </div>
            <CtaWithTimer timeLeft={timeLeft} onClick={openPaymentModal} variant="dark" />
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 pt-12 pb-28 px-6 text-center border-t border-slate-800 text-white/70">
        <p className="text-xs uppercase tracking-[0.2em] mb-4">Avada Design & Architecture • 2026</p>
        <div className="flex justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <a href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</a>
          <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy</a>
          <a href="/terms" className="hover:text-white transition-colors">Terms</a>
          <a href="/contact" className="hover:text-white transition-colors">Support</a>
        </div>
      </footer>

      {/* ═══ STICKY BOTTOM BAR ═══ */}
      <div className={`fixed bottom-0 left-0 right-0 z-[70] transition-transform duration-500 ${showStickyBar ? 'translate-y-0' : 'translate-y-full'}`}>
        <button onClick={openPaymentModal} className="w-full bg-white/98 backdrop-blur-2xl border-t border-slate-100 shadow-[0_-1px_40px_rgba(15,23,42,0.12)] px-4 py-2.5 flex items-center gap-3 active:bg-slate-50 transition-colors group">

          {/* Left: price + label + timer */}
          <div className="flex flex-col items-start gap-0.5 shrink-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-orange-600">Free Trial</span>
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-wide">3-Day Trial ends in</span>
            </div>
            <div className="flex items-center gap-0.5">
              {[formatTime(timeLeft.h), formatTime(timeLeft.m), formatTime(timeLeft.s)].map((val, i) => (
                <span key={i} className="flex items-center gap-0.5">
                  <span className="bg-slate-900 text-white text-[11px] font-black font-mono px-1.5 py-0.5 rounded tabular-nums">{val}</span>
                  {i < 2 && <span className="text-slate-400 text-[10px] font-bold mx-0.5">:</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Start 3-Day Trial button */}
          <div className="flex-1 flex items-center justify-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md shadow-orange-600/30">
            Start 3-Day Free Trial
            <ArrowRight size={13} />
          </div>

        </button>
      </div>

      {/* ═══════ EXACT POPUP CHECKOUT MODAL DIALOG ═══════ */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 gap-3 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !isLoading && setShowPaymentModal(false)} />
          
          {/* Top Floating Student Count Badge */}
          <div className="relative z-10 inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-5 py-2 shadow-xl border border-orange-100">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shrink-0"></span>
            <span className="text-sm font-black text-slate-900">{studentCount.toLocaleString('en-US')}</span>
            <span className="text-xs text-slate-500 font-semibold">students already enrolled</span>
          </div>

          {/* Main Modal Dialog Box */}
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10 border border-slate-100">
            
            {/* Close Button (X) */}
            <button 
              aria-label="Close modal" 
              onClick={() => !isLoading && setShowPaymentModal(false)} 
              className="absolute top-3.5 right-3.5 z-20 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Dark Card Header */}
            <div className="bg-slate-900 text-white px-6 py-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 text-yellow-400 text-[10px] font-extrabold uppercase tracking-widest mb-1.5">
                  <Sparkles size={12} className="fill-yellow-400" />
                  COMPLETE BUNDLE
                </div>
                <h3 className="text-2xl font-display font-black tracking-tight mb-1">All 7 Masterclass Courses</h3>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-display font-black text-orange-400 whitespace-nowrap">Free Trial</span>
                  <span className="text-slate-400 text-xs font-semibold">Then $20/mo after 3 days</span>
                </div>
              </div>
            </div>

            {/* Modal Body Form */}
            <div className="p-6 overflow-y-auto space-y-4">
              
              {/* Feature Checklist */}
              <div className="grid grid-cols-2 gap-2">
                {["7 Premium Courses", "10,000+ Textures", "Official Certificate", "24/7 Team Support", "72 Hours Full Access"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                    <CheckCircle2 size={13} className="text-orange-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Download Links Banner */}
              <div className="flex items-center gap-2 text-xs font-bold bg-amber-50 border border-amber-200/60 rounded-xl p-3 text-amber-900">
                <Download size={14} className="text-amber-600 shrink-0" />
                <span>Software Download Links Provided</span>
              </div>

              {/* Countdown Timer Strip */}
              <div className="bg-red-50/80 border border-red-100 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Timer size={14} className="text-red-500 animate-pulse" />
                  <span>Offer ends in:</span>
                </div>
                <div className="flex items-center gap-1 font-mono font-bold text-sm text-red-600 bg-white px-2.5 py-1 rounded-md border border-red-200 shadow-xs tabular-nums">
                  <span>{formatTime(timeLeft.h)}</span>
                  <span className="text-slate-400">:</span>
                  <span>{formatTime(timeLeft.m)}</span>
                  <span className="text-slate-400">:</span>
                  <span>{formatTime(timeLeft.s)}</span>
                </div>
              </div>

              {/* Form Input Fields */}
              <form onSubmit={handleModalSubmit} className="space-y-4 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Email Address
                  </label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all" style={emailError ? {borderColor:'#ef4444', backgroundColor:'#fef2f2'} : {}}>
                    <Mail size={18} className="text-slate-400 shrink-0" strokeWidth={1.8} />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setEmailError(false); }}
                      className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      required
                    />
                  </div>
                  {emailError && <p className="text-red-500 text-[11px] mt-1 font-semibold">Enter a valid email address</p>}
                </div>

                {/* Main Action Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 bg-orange-600 hover:bg-orange-700 text-white font-extrabold rounded-2xl text-base flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-orange-600/30 active:scale-[0.98] disabled:opacity-70 cursor-pointer mt-4"
                >
                  {isLoading ? (
                    <><Loader2 className="animate-spin" size={20} /> Redirecting to Stripe...</>
                  ) : (
                    <>
                      <Sparkles size={18} className="shrink-0 text-amber-300 fill-amber-300" />
                      <span className="leading-none">Start 3-Day Free Trial</span>
                      <ArrowRight size={18} className="shrink-0" />
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium text-center pt-2">
                <Lock size={13} className="text-orange-500 shrink-0" />
                <span>Stripe Secure Checkout • Card Authorization Only</span>
              </div>

            </div>
          </div>
        </div>
      )}

      <SocialProofToast />
    </div>
  );
};

export default LandingPage;
