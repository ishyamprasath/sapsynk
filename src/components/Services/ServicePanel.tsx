import { useState, useRef } from 'react';
import { motion } from 'motion/react';

interface ServicePanelProps {
  title: string;
  tagline: string;
  description: string;
  demoComponent?: React.ReactNode;
  stat: string;
  color: string;
  icon: string;
  features: string[];
  metric: { label: string; value: string };
  onOpen?: () => void;
}

// Converts a hex color to a darkened/tinted variant
function tintColor(hex: string, lighten: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const add = lighten > 0 ? lighten : 0;
  const sub = lighten < 0 ? -lighten : 0;
  const nr = Math.min(255, Math.max(0, r + add - sub));
  const ng = Math.min(255, Math.max(0, g + add - sub));
  const nb = Math.min(255, Math.max(0, b + add - sub));
  return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
}

function CornerBracket({ color, pos }: { color: string; pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const cls = { tl: 'top-3 left-3', tr: 'top-3 right-3 rotate-90', bl: 'bottom-3 left-3 -rotate-90', br: 'bottom-3 right-3 rotate-180' }[pos];
  return (
    <div className={`absolute ${cls} pointer-events-none`} style={{ opacity: 0.55 }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M0 9 L0 0 L9 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function ServicePanel({ title, tagline, description, stat, color, icon, features, metric }: ServicePanelProps) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Two solid puzzle shades — dark base, accent highlight
  const shade1 = '#07040f'; // very dark near-black with purple tint
  const shade2 = color + '1a'; // color at ~10% opacity as solid block fill

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setTilt({
      x: -((e.clientY - cy) / (rect.height / 2)) * 8,
      y: ((e.clientX - cx) / (rect.width / 2)) * 8,
    });
  }

  return (
    <motion.div
      ref={cardRef}
      className="relative cursor-pointer select-none"
      style={{ width: 'clamp(260px, 28vw, 340px)', height: '420px', perspective: '900px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      animate={{ rotateX: tilt.x, rotateY: tilt.y, scale: hovered ? 1.045 : 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 24 }}
    >
      {/* Outer glow halo */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          boxShadow: hovered
            ? `0 0 0 1px ${color}55, 0 12px 60px ${color}28, 0 40px 100px ${color}10`
            : `0 0 0 1px ${color}1a, 0 4px 20px ${color}06`,
        }}
        transition={{ duration: 0.35 }}
      />

      {/* ── Card shell ── */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ background: shade1 }}>

        {/* ── Puzzle / dual-tone SVG fill ── */}
        {/* This creates irregular geometric polygon shapes filled with the accent color at varying opacities — puzzle effect */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 340 420" preserveAspectRatio="none">
          {/* Large bottom-left puzzle block */}
          <polygon
            points="0,420 180,420 220,300 100,280 0,320"
            fill={color}
            fillOpacity="0.09"
          />
          {/* Mid puzzle piece 1 */}
          <polygon
            points="200,420 340,420 340,360 260,340 200,380"
            fill={color}
            fillOpacity="0.06"
          />
          {/* Upper right accent block */}
          <polygon
            points="240,0 340,0 340,160 300,140 260,80"
            fill={color}
            fillOpacity="0.07"
          />
          {/* Small top-left accent */}
          <polygon
            points="0,0 80,0 60,55 0,70"
            fill={color}
            fillOpacity="0.05"
          />
          {/* Center cross-cut diagonal shape */}
          <polygon
            points="100,150 230,120 250,200 160,230 80,200"
            fill={color}
            fillOpacity="0.04"
          />
        </svg>

        {/* Noise grain texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
            backgroundSize: '150px 150px',
          }}
        />

        {/* Fine grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(${color}60 1px, transparent 1px), linear-gradient(90deg, ${color}60 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />

        {/* Top shimmer line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: `linear-gradient(90deg, transparent 10%, ${color}90 45%, ${color} 50%, ${color}90 55%, transparent 90%)` }}
          animate={{ opacity: hovered ? 1 : 0.3 }}
        />

        {/* Left edge accent bar */}
        <motion.div
          className="absolute left-0 top-[15%] bottom-[15%] w-px pointer-events-none"
          style={{ background: `linear-gradient(180deg, transparent, ${color}70, ${color}, ${color}70, transparent)` }}
          animate={{ opacity: hovered ? 0.8 : 0.2 }}
        />

        {/* Corner brackets */}
        <CornerBracket color={color} pos="tl" />
        <CornerBracket color={color} pos="tr" />
        <CornerBracket color={color} pos="bl" />
        <CornerBracket color={color} pos="br" />

        {/* Spinning ring decoration */}
        <div className="absolute bottom-6 right-6 pointer-events-none" style={{ opacity: 0.12 }}>
          <motion.svg width="72" height="72" viewBox="0 0 72 72"
            animate={{ rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          >
            <circle cx="36" cy="36" r="32" fill="none" stroke={color} strokeWidth="0.8" strokeDasharray="5 4" />
            <circle cx="36" cy="36" r="22" fill="none" stroke={color} strokeWidth="0.6" strokeDasharray="2 6" />
            <circle cx="36" cy="36" r="4" fill={color} fillOpacity="0.5" />
          </motion.svg>
        </div>

        {/* ── Content ── */}
        <div className="relative z-10 h-full flex flex-col px-6 py-6">

          {/* Top row: stat + icon */}
          <div className="flex items-start justify-between mb-5">
            <motion.div
              className="px-3 py-1 rounded-full text-[10px] font-mono font-semibold tracking-widest uppercase"
              style={{ background: `${color}12`, color, border: `1px solid ${color}30` }}
              animate={{ boxShadow: hovered ? `0 0 14px ${color}35, inset 0 0 8px ${color}10` : 'none' }}
            >
              {stat}
            </motion.div>

            <motion.div
              className="relative w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              style={{ background: `${color}10`, border: `1px solid ${color}28` }}
              animate={{
                boxShadow: hovered ? `0 0 18px ${color}40` : 'none',
                rotate: hovered ? [0, -5, 5, 0] : 0,
              }}
              transition={{ duration: 0.45 }}
            >
              {icon}
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{ border: `1px solid ${color}` }}
                animate={{ scale: hovered ? [1, 1.6, 2] : 1, opacity: hovered ? [0.7, 0.2, 0] : 0 }}
                transition={{ duration: 1.2, repeat: hovered ? Infinity : 0 }}
              />
            </motion.div>
          </div>

          {/* Tagline */}
          <p className="text-[9px] font-mono tracking-[0.28em] uppercase mb-1.5" style={{ color: `${color}99` }}>
            ◈ {tagline}
          </p>

          {/* Title */}
          <h3
            className="text-[1.15rem] font-bold leading-snug tracking-tight mb-3"
            style={{
              color: '#f0ebff',
              textShadow: hovered ? `0 0 28px ${color}55` : 'none',
              transition: 'text-shadow 0.4s',
            }}
          >
            {title}
          </h3>

          {/* Description */}
          <p className="text-[12px] text-white/35 leading-relaxed mb-4 font-light line-clamp-3">
            {description}
          </p>

          {/* Divider */}
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${color}45, transparent)` }} />
            <span className="text-[7px] font-mono text-white/15 tracking-[0.2em] uppercase">capabilities</span>
          </div>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-1.5 mb-auto">
            {features.map((f, i) => (
              <motion.span
                key={i}
                className="px-2 py-[4px] rounded-md text-[9px] font-mono"
                style={{ background: `${color}09`, color: `${color}bb`, border: `1px solid ${color}1e` }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ background: `${color}20`, scale: 1.07, borderColor: `${color}50` }}
              >
                {f}
              </motion.span>
            ))}
          </div>

          {/* Bottom metric */}
          <motion.div
            className="mt-4 rounded-xl px-4 py-3 flex items-center justify-between"
            style={{ background: `${color}09`, border: `1px solid ${color}20` }}
            animate={{
              borderColor: hovered ? `${color}50` : `${color}20`,
              boxShadow: hovered ? `inset 0 0 18px ${color}0a` : 'none',
            }}
          >
            <div>
              <div className="text-[8px] font-mono text-white/22 tracking-[0.18em] uppercase mb-0.5">{metric.label}</div>
              <motion.div
                className="text-xl font-bold font-mono"
                style={{ color }}
                animate={{ textShadow: hovered ? `0 0 20px ${color}80` : 'none' }}
              >
                {metric.value}
              </motion.div>
            </div>
            <motion.div
              className="text-[10px] font-mono flex items-center gap-1"
              style={{ color: `${color}60` }}
              animate={{ x: hovered ? [0, 4, 0] : 0 }}
              transition={{ duration: 1.1, repeat: hovered ? Infinity : 0 }}
            >
              explore <span className="text-sm">→</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
