import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../lib/data';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { PlayCircle, CheckCircle2, ArrowRight, Star, ShieldCheck, Zap, Users } from 'lucide-react';
import { INCOME_TIERS, VALUE_STACK_ITEMS, TESTIMONIALS_LANDING } from './LandingHelpers';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = PRODUCTS.find((p) => p.id === id);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button asChild>
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    navigate(`/checkout?product=${product.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ═══════ HERO ═══════ */}
      <div className="bg-zinc-900 text-zinc-50 pt-12 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Left content */}
            <div className="lg:col-span-3 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mb-4 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 w-fit">
                <Zap size={12} className="fill-primary" /> Limited Time Offer
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-5 leading-[1.1] tracking-tight">
                {product.name}
              </h1>
              <p className="text-base md:text-lg text-zinc-300 mb-8 max-w-xl leading-relaxed">
                {product.description}
              </p>
              
              {/* Feature pills */}
              <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-zinc-400 mb-8">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                  <PlayCircle className="w-4 h-4 text-primary" /> 12+ hours video
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Lifetime access
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                  <Users className="w-4 h-4 text-primary" /> 24/7 Support
                </span>
              </div>

              {/* Price + CTA for desktop (visible alongside the card) */}
              <div className="hidden lg:flex flex-col gap-1 mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-extrabold text-emerald-400">$0</span>
                  <span className="text-xl text-zinc-300 font-semibold">Today (3-Day Free Trial)</span>
                  <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">STRIPE SECURE</span>
                </div>
                <span className="text-sm text-zinc-400">Auto-renews at $20/month starting Day 4. Cancel anytime.</span>
              </div>
              <div className="hidden lg:flex gap-4">
                <Button size="lg" className="text-lg px-10 py-6 shadow-lg shadow-emerald-500/30 bg-emerald-600 hover:bg-emerald-500 text-white" onClick={handleCheckout}>
                  Start 3-Day Free Trial ($0) <ArrowRight size={18} className="ml-2" />
                </Button>
              </div>

            </div>

            {/* Right: Video/Image Card */}
            <div className="lg:col-span-2">
              <Card className="bg-zinc-800 border-zinc-700 shadow-2xl overflow-hidden">
                <div className="aspect-video relative overflow-hidden bg-black">
                  {!isPlaying ? (
                    <>
                      <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full" />
                      <div
                        className="absolute inset-0 flex items-center justify-center cursor-pointer group bg-black/30 hover:bg-black/10 transition-all"
                        onClick={() => setIsPlaying(true)}
                      >
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(249,115,22,0.5)]">
                          <PlayCircle className="w-8 h-8 md:w-10 md:h-10 text-white fill-white" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <iframe
                      src="https://iframe.mediadelivery.net/embed/489113/a214b199-e64a-4eaf-af70-edfbc586e5fd?autoplay=true&loop=true&muted=true&preload=true&responsive=true"
                      className="w-full h-full border-0"
                      allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                      allowFullScreen={true}
                    />
                  )}
                </div>
                <CardContent className="p-5 text-zinc-200">
                  <div className="flex items-center gap-2 mb-3 text-sm">
                    <div className="flex gap-0.5">{[...Array(5)].map((_, j) => <Star key={j} size={12} className="fill-primary text-primary" />)}</div>
                    <span className="text-zinc-400">4.9 (12,400+ ratings)</span>
                  </div>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400 shrink-0" /> Downloadable project files & assets</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400 shrink-0" /> Certificate of completion</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400 shrink-0" /> Premium mentorship community</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400 shrink-0" /> Free software installation guide</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ MAIN CONTENT ═══════ */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-6xl">
        
        {/* INCOME TIERS */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-foreground">Your Career Before & After</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {INCOME_TIERS.map((tier, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-all shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-foreground leading-tight">{tier.label}</span>
                  <span className="text-2xl">{tier.icon}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Before</p>
                    <p className="text-muted-foreground text-sm line-through">{tier.before}</p>
                  </div>
                  <ArrowRight size={16} className="text-primary shrink-0" />
                  <div className="flex-1 text-right">
                    <p className="text-[10px] font-mono text-primary uppercase mb-1">After</p>
                    <p className="text-primary text-sm font-bold">{tier.after}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WHAT YOU GET */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-foreground">Everything You Get</h2>
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <div className="space-y-4">
              {VALUE_STACK_ITEMS.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-border/50 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="font-medium text-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CURRICULUM */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-foreground">Course Curriculum</h2>
          <Card className="border-border">
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.topics.map((topic, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</div>
                    <span className="text-foreground text-sm font-medium">{topic}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* DESCRIPTION */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-foreground">About This Course</h2>
          <div className="text-muted-foreground space-y-4 leading-relaxed">
            <p>
              Dive deep into the world of architectural visualization with our comprehensive masterclass.
              Whether you're a beginner looking to build a strong foundation or a seasoned professional
              aiming to refine your workflow, this course offers everything you need.
            </p>
            <p>
              We cover the entire pipeline, starting from accurate 3D modeling, moving through
              photorealistic lighting and material setups, and concluding with stunning final renders
              and cinematic animations.
            </p>
            <p>
              By the end of this course, you will have the confidence and skills to tackle complex
              projects, impress your clients, and elevate your portfolio to the next level.
            </p>
          </div>
        </section>

        {/* STUDENT REVIEWS */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-foreground">What Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TESTIMONIALS_LANDING.slice(0, 6).map((t, i) => (
              <div key={i} className="bg-card border border-border p-6 rounded-xl">
                <div className="flex gap-0.5 mb-3">{[...Array(5)].map((_, j) => <Star key={j} size={12} className="fill-primary text-primary" />)}</div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 italic line-clamp-4">"{t.content}"</p>
                <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{t.name[0]}</div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{t.name}</p>
                    <p className="text-[10px] text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ═══════ STICKY BOTTOM BAR (Mobile + Desktop) ═══════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4 max-w-6xl">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl md:text-2xl font-extrabold text-emerald-600">$0</span>
                <span className="text-sm font-semibold text-muted-foreground">Today (3-Day Trial)</span>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">Then $20/month via Stripe • Cancel anytime</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button size="lg" className="text-base px-6 md:px-10 py-5 shadow-lg shadow-emerald-600/25 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleCheckout}>
              Start Free Trial <ArrowRight size={16} className="ml-1.5" />
            </Button>
          </div>
        </div>
      </div>


      {/* Bottom spacer for sticky bar */}
      <div className="h-20"></div>
    </div>
  );
}
