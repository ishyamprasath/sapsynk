import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Toaster } from 'sonner';

import { Navbar } from './components/main/navbar';
import { Footer } from './components/main/footer';
import { Hero } from './components/main/hero';
import { StarsCanvas } from './components/main/star-background';
import Ribbons from './components/main/Ribbons';
import BeforeAfterSlider from './components/BeforeAfterSlider';
import WorkflowBuilder from './components/WorkflowBuilder';
import Services from './components/Services/Services';
import ROITicker from './components/ROITicker';
import { Contact } from './components/Contact/Contact';

// ─── Scroll Progress Bar ──────────────────────────────────────────────────────
function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      ref={barRef}
      className="scroll-progress"
      style={{ width: '100%', transformOrigin: 'left' }}
    />
  );
}

// ─── Floating Book a Call Pill ────────────────────────────────────────────────
function FloatingPill() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    // Show after 30 seconds
    const timer = setTimeout(() => setVisible(true), 30_000);

    // Or when scrolled past "services" section (~800px)
    const onScroll = () => {
      if (window.scrollY > 900 && !dismissed) setVisible(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [dismissed]);

  const dismiss = () => {
    setDismissed(true);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9994] flex items-center gap-3 px-5 py-3
                     rounded-full border border-[#00FFF0]/25 floating-pill"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)' }}
        >
          <div className="live-dot" />
          <a
            href="#contact"
            onClick={dismiss}
            className="text-sm font-semibold text-[#F5F0E8] hover:text-[#00FFF0] transition-colors whitespace-nowrap"
          >
            ↗ Book a 30-min strategy call
          </a>
          <button
            onClick={dismiss}
            className="text-[#F5F0E8]/30 hover:text-[#F5F0E8] transition-colors ml-1"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── CTA Section ─────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-28 px-6 relative border-t border-white/5">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-16 rounded-3xl border border-white/8 relative overflow-hidden"
          style={{ background: 'rgba(0,255,240,0.03)' }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(0,255,240,0.08) 0%, transparent 70%)' }} />
          <div className="relative z-10">
            <p className="text-xs font-[family-name:var(--font-mono)] tracking-[0.3em] uppercase text-[#00FFF0]/60 mb-4">
              Ready to Transform?
            </p>
            <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-heading)] font-bold text-[#F5F0E8] mb-4 leading-tight">
              Stop doing manually<br />what AI can do instantly.
            </h2>
            <p className="text-[#F5F0E8]/50 mb-10 max-w-xl mx-auto leading-relaxed">
              Schedule a call with our automation experts. In 30 minutes, we'll map exactly which workflows to automate first for maximum ROI.
            </p>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-[#080808] bg-[#00FFF0] hover:bg-[#00FFF0]/90 transition-all"
              style={{ boxShadow: '0 0 40px rgba(0,255,240,0.3)' }}
            >
              Book Your Free Consultation ↗
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen bg-[#030014] text-[#F5F0E8] font-[family-name:var(--font-body)] overflow-x-hidden">
      <Toaster theme="dark" position="bottom-right" />
      {/* Global overlays */}


      <FloatingPill />

      <StarsCanvas />

      <Navbar />

      <main className="relative z-10">
        <Hero />
        <BeforeAfterSlider />
        <WorkflowBuilder />
        <Services />
        <ROITicker />
        <Contact />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
