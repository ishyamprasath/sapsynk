import { useRef, useState } from 'react';
import { useInView } from '../hooks/useInView';
import { useROICounter } from '../hooks/useROICounter';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

const metrics = [
  {
    label: 'Hours saved this month',
    end: 48230,
    suffix: 'hrs',
    duration: 2000,
    live: true,
    color: '#b49bff',
  },
  {
    label: 'Tasks automated',
    end: 1240000,
    suffix: '+',
    duration: 2500,
    live: false,
    color: '#8B5CF6',
  },
  {
    label: 'Avg time-to-automate',
    end: 3,
    suffix: ' days',
    duration: 1500,
    live: false,
    color: '#F97316',
  },
  {
    label: 'Client ROI average',
    end: 847,
    suffix: '%',
    duration: 3000,
    live: false,
    color: '#22C55E',
  },
];

function MetricCard({
  label,
  end,
  suffix,
  duration,
  live,
  color,
  active,
}: (typeof metrics)[0] & { active: boolean }) {
  const value = useROICounter(end, duration, active);

  const formatted =
    end >= 1_000_000
      ? `${(value / 1_000_000).toFixed(2)}M`
      : end >= 1_000
      ? value.toLocaleString()
      : value.toString();

  const ref = useRef<HTMLDivElement>(null);
  
  // 3D Tilt Hook Setup
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative w-full h-full perspective-[1200px]"
    >
      <div 
        className="flex flex-col p-8 rounded-[2rem] border relative overflow-hidden group min-h-[260px] cursor-default h-full"
        style={{
          background: `linear-gradient(135deg, rgba(20,20,30,0.8) 0%, rgba(5,5,10,0.9) 100%)`,
          borderColor: `rgba(255,255,255,0.03)`,
          boxShadow: `0 30px 60px -15px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 0 40px rgba(0,0,0,0.8)`
        }}
      >
        {/* Spotlight Follower */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-0 mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: useTransform(
              [mouseXSpring, mouseYSpring],
              ([xVal, yVal]) => `radial-gradient(400px circle at ${(xVal + 0.5) * 100}% ${(yVal + 0.5) * 100}%, ${color}30, transparent 40%)`
            )
          }}
        />

        {/* Shimmer Edge overlay */}
        <div className="absolute inset-0 z-0 border-[1.5px] border-transparent rounded-[2rem]" style={{
          background: `linear-gradient(120deg, transparent, ${color}40, transparent) border-box`,
          WebkitMask: `linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          opacity: 0,
          transition: 'opacity 0.7s ease',
        }} className="group-hover:opacity-100 absolute inset-0 z-0 border-[1.5px] border-transparent rounded-[2rem]" />

        {/* Ambient Corner Glow */}
        <div 
          className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full blur-[60px] opacity-20 pointer-events-none z-0"
          style={{ backgroundColor: color }}
        />

        {/* Card Content rendered with translationZ for 3D effect */}
        <div 
          className="relative z-10 h-full flex flex-col justify-between w-full"
          style={{ transform: "translateZ(30px)" }}
        >
          <div className="w-full">
            {/* Live indicator (or spacer for alignment) */}
            {live ? (
              <div className="flex items-center gap-2 mb-6 h-[24px]">
                <div className="live-dot" style={{ boxShadow: `0 0 10px #22C55E` }} />
                <span className="text-xs font-[family-name:var(--font-mono)] text-[#22C55E] tracking-[0.2em] font-bold uppercase drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]">
                  Live
                </span>
              </div>
            ) : (
              <div className="h-[24px] mb-6" />
            )}

            {/* Number with gorgeous text gradient */}
            <div 
              className="ticker-number mb-2 w-full truncate font-black tracking-tighter mix-blend-plus-lighter" 
              style={{ 
                color: '#fff',
                textShadow: `0 10px 30px ${color}60`,
              }}
            >
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(180deg, #ffffff 0%, ${color} 150%)`}}>
                {formatted}
              </span>
              <span className="text-[0.4em] font-medium text-white/50 ml-1 uppercase tracking-wider" style={{ textShadow: 'none' }}>{suffix}</span>
            </div>
          </div>

          {/* Label */}
          <p className="mt-8 text-[15px] text-white/60 leading-relaxed font-semibold tracking-wide" style={{ transform: "translateZ(20px)" }}>
            {label}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function ROITicker() {
  const [sectionRef, inView] = useInView<HTMLElement>({ threshold: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="py-32 px-6 relative overflow-hidden bg-[#030014]"
    >
      {/* Dynamic Background Noise & Gradient */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8B5CF6]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-md mb-6">
            <div className="w-2 h-2 rounded-full bg-[#b49bff] animate-pulse" />
            <p className="text-xs font-[family-name:var(--font-mono)] tracking-[0.2em] font-bold uppercase text-white/70">
              Impact at Scale
            </p>
          </div>
          <h2 className="text-5xl md:text-7xl font-[family-name:var(--font-heading)] font-bold text-white tracking-tight">
            Numbers that move<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b49bff] to-[#8B5CF6]">businesses forward</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.8, type: "spring", stiffness: 100 }}
              viewport={{ once: true }}
              className="w-full h-full"
            >
              <MetricCard {...m} active={inView} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
