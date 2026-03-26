import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface VideoModalProps {
  title: string;
  description: string;
  demoComponent: React.ReactNode;
  onClose: () => void;
}

export default function VideoModal({ title, description, demoComponent, onClose }: VideoModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      ref={overlayRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9900] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)' }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-4xl rounded-3xl border border-white/10 overflow-hidden"
        style={{ background: '#0f0f0f' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full border border-white/10
                     text-[#F5F0E8]/50 hover:text-[#F5F0E8] hover:border-white/20 transition-all"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[400px]">
          {/* Left: Demo */}
          <div className="p-8 border-r border-white/5 flex items-center justify-center min-h-[300px]">
            {demoComponent}
          </div>

          {/* Right: Info */}
          <div className="p-8 flex flex-col justify-center">
            <p className="text-xs font-[family-name:var(--font-mono)] tracking-[0.25em] uppercase text-[#b49bff]/60 mb-3">
              Live Demo
            </p>
            <h3 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-[#F5F0E8] mb-4 leading-tight">
              {title}
            </h3>
            <p className="text-[#F5F0E8]/60 leading-relaxed mb-8 text-sm">
              {description}
            </p>
            <motion.a
              href="#contact"
              onClick={onClose}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="px-6 py-3 rounded-full bg-[#b49bff] text-[#030014] font-semibold text-sm
                         hover:bg-[#b49bff]/90 transition-all w-fit"
            >
              Get this for my business →
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
