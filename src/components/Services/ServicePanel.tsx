import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';

interface ServicePanelProps {
  title: string;
  tagline: string;
  description: string;
  demoComponent: React.ReactNode;
  stat: string;
  color: string;
  icon: string;
  onOpen: () => void;
}

export default function ServicePanel({
  title,
  tagline,
  description,
  stat,
  color,
  icon,
  onOpen,
}: ServicePanelProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative h-[440px] rounded-2xl overflow-hidden border border-white/8 cursor-pointer group shrink-0"
      style={{ width: 'clamp(300px, 36vw, 420px)', background: '#0a0a0a' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpen}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', damping: 25 }}
    >
      {/* Gradient background (simulates video) */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 30% 30%, ${color}30 0%, ${color}08 40%, transparent 70%)`,
          opacity: hovered ? 1 : 0.4,
        }}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-10"
           style={{
             backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
             backgroundSize: '24px 24px',
           }} />

      {/* Icon */}
      <div className="absolute top-6 right-6 text-4xl opacity-40 group-hover:opacity-70 transition-opacity duration-300">
        {icon}
      </div>

      {/* Stat badge */}
      <div
        className="absolute top-6 left-6 px-3 py-1.5 rounded-full text-xs font-[family-name:var(--font-mono)] font-bold"
        style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
      >
        {stat}
      </div>

      {/* Play button on hover */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={hovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: `${color}20`, border: `2px solid ${color}60` }}
        >
          <Play className="w-6 h-6 ml-1" style={{ color }} />
        </div>
      </motion.div>

      {/* Text overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6"
           style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.95))' }}>
        <p className="text-xs font-[family-name:var(--font-mono)] tracking-widest uppercase mb-2"
           style={{ color }}>
          {tagline}
        </p>
        <h3 className="text-xl font-[family-name:var(--font-heading)] font-bold text-[#F5F0E8] mb-2 leading-tight">
          {title}
        </h3>
        <p className="text-sm text-[#F5F0E8]/50 leading-relaxed line-clamp-2">
          {description}
        </p>
        <motion.span
          animate={hovered ? { x: 4 } : { x: 0 }}
          className="inline-flex items-center gap-1 text-xs mt-3 font-medium"
          style={{ color }}
        >
          View Live Demo →
        </motion.span>
      </div>
    </motion.div>
  );
}
