import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X } from 'lucide-react';
import TerminalAnimation from './TerminalAnimation';

export default function Hero() {
  const [showToast, setShowToast] = useState(false);

  const handleTerminalComplete = () => {
    setTimeout(() => setShowToast(true), 500);
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden grid-bg">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[60%] rounded-full"
             style={{ background: 'radial-gradient(ellipse, rgba(180, 155, 255,0.06) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[50%] rounded-full"
             style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT: Heading */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#b49bff]/20 mb-8"
              style={{ background: 'rgba(180, 155, 255,0.05)' }}
            >
              <div className="live-dot" />
              <span className="text-xs font-[family-name:var(--font-mono)] text-[#b49bff] tracking-widest uppercase">
                AI Automation Agency
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-[family-name:var(--font-heading)] font-extrabold text-[#F5F0E8] leading-[1.05] tracking-tight mb-6"
            >
              We automate{' '}
              <br />
              <span className="text-[#b49bff] text-glow-cyan">
                the impossible.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-lg text-[#F5F0E8]/60 mb-10 max-w-lg leading-relaxed"
            >
              SapSynk deploys AI workflows that eliminate repetitive work,
              qualify leads, draft responses, and run your operations — while you sleep.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.a
                href="#services"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="px-7 py-3.5 rounded-full text-[#030014] font-semibold flex items-center gap-2 justify-center
                           bg-[#b49bff] hover:bg-[#b49bff]/90 transition-all shadow-lg"
                style={{ boxShadow: '0 0 30px rgba(180, 155, 255,0.3)' }}
              >
                See Services <ArrowRight className="w-4 h-4" />
              </motion.a>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="px-7 py-3.5 rounded-full font-semibold flex items-center gap-2 justify-center
                           border border-white/15 text-[#F5F0E8]/80 hover:border-[#b49bff]/30 hover:text-[#b49bff] transition-all"
              >
                Book a Call ↗
              </motion.a>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex gap-10 mt-14 pt-8 border-t border-white/5"
            >
              {[
                { value: '10x', label: 'Faster operations' },
                { value: '38hrs', label: 'Saved per workflow' },
                { value: '9+', label: 'AI services' },
              ].map((stat) => (
                <div key={stat.value}>
                  <div className="text-2xl font-[family-name:var(--font-mono)] font-bold text-[#b49bff]">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#F5F0E8]/40 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: Terminal */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-[480px] lg:h-[540px]"
          >
            <TerminalAnimation onComplete={handleTerminalComplete} />
          </motion.div>
        </div>
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[9995] glass-cyan rounded-2xl px-5 py-4 flex items-center gap-4 shadow-2xl"
            style={{ maxWidth: '360px' }}
          >
            <div className="live-dot shrink-0" />
            <p className="text-sm text-[#F5F0E8]/90">
              <span className="text-[#b49bff] font-semibold">This just ran live.</span>{' '}
              Ready to automate your business?
            </p>
            <a
              href="#contact"
              onClick={() => setShowToast(false)}
              className="shrink-0 text-xs text-[#b49bff] font-semibold border border-[#b49bff]/30 px-3 py-1.5 rounded-full
                         hover:bg-[#b49bff]/10 transition-all whitespace-nowrap"
            >
              Book a call →
            </a>
            <button
              onClick={() => setShowToast(false)}
              className="shrink-0 text-[#F5F0E8]/30 hover:text-[#F5F0E8] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
