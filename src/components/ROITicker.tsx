import { useRef } from 'react';
import { useInView } from '../hooks/useInView';
import { useROICounter } from '../hooks/useROICounter';

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

  return (
    <div className="flex flex-col items-start p-8 rounded-2xl border border-white/5 relative overflow-hidden group"
         style={{ background: 'rgba(255,255,255,0.02)' }}>
      {/* Glow bg */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at bottom left, ${color}08 0%, transparent 70%)` }}
      />

      {/* Live indicator */}
      {live && (
        <div className="flex items-center gap-2 mb-4">
          <div className="live-dot" />
          <span className="text-xs font-[family-name:var(--font-mono)] text-[#22C55E] tracking-widest uppercase">
            Live
          </span>
        </div>
      )}

      {/* Number */}
      <div className="ticker-number" style={{ color }}>
        {formatted}
        <span className="text-[0.5em] font-normal text-[#F5F0E8]/40 ml-1">{suffix}</span>
      </div>

      {/* Label */}
      <p className="mt-3 text-sm text-[#F5F0E8]/50 leading-relaxed max-w-[180px]">
        {label}
      </p>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{ background: `linear-gradient(90deg, ${color}40, transparent)` }}
      />
    </div>
  );
}

export default function ROITicker() {
  const [sectionRef, inView] = useInView<HTMLElement>({ threshold: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="py-28 px-6 relative overflow-hidden"
    >
      {/* Section bg */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse at center, rgba(180, 155, 255,0.03) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-[family-name:var(--font-mono)] tracking-[0.3em] uppercase text-[#F5F0E8]/30 mb-3">
            Impact at Scale
          </p>
          <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-heading)] font-bold text-[#F5F0E8]">
            Numbers that move{' '}
            <span className="text-[#b49bff]">businesses forward</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m) => (
            <MetricCard key={m.label} {...m} active={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
