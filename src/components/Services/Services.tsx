import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ServicePanel from './ServicePanel';

const services = [
  {
    title: 'AI Lead Qualification',
    tagline: 'Sales Intelligence',
    description: 'AI scores and prioritizes leads by intent signals, company data, and behavioral patterns — so your team focuses only on deals ready to close.',
    stat: '10× faster',
    color: '#b49bff',
    icon: '🎯',
    features: ['Intent Scoring', 'Company Enrichment', 'Behavioral Analysis', 'CRM Sync'],
    metric: { label: 'Avg. close rate lift', value: '+340%' },
  },
  {
    title: 'Workflow Automation',
    tagline: 'Process Engineering',
    description: 'Visual node-based workflows connect any combination of your tools. Trigger → Process → Output, all running automatically 24/7.',
    stat: '38 hrs saved',
    color: '#8B5CF6',
    icon: '⚡',
    features: ['No-Code Builder', 'Multi-App Logic', 'Error Recovery', 'Audit Logs'],
    metric: { label: 'Processes automated', value: '1,200+' },
  },
  {
    title: 'Document Intelligence',
    tagline: 'Document AI',
    description: 'AI reads, extracts, and categorizes data from invoices, contracts, and reports — instantly routing it where it needs to go.',
    stat: '99% accuracy',
    color: '#F97316',
    icon: '📄',
    features: ['OCR Extraction', 'Contract Parsing', 'Auto-Routing', 'Validation'],
    metric: { label: 'Docs processed / day', value: '50K' },
  },
  {
    title: 'AI Customer Support',
    tagline: 'Support Automation',
    description: 'Deploy AI agents that handle Tier-1 support 24/7, understand context, escalate intelligently, and close tickets faster.',
    stat: '<2s response',
    color: '#22C55E',
    icon: '💬',
    features: ['Context Memory', 'Escalation Logic', 'Multi-channel', 'CSAT Tracking'],
    metric: { label: 'Tickets auto-resolved', value: '78%' },
  },
  {
    title: 'Data Pipeline Automation',
    tagline: 'Data Engineering',
    description: 'Transform, enrich, and route data between any systems automatically. Clean data flowing to the right place at the right time.',
    stat: '100K rows/min',
    color: '#FBBF24',
    icon: '🔄',
    features: ['ETL Pipelines', 'Schema Mapping', 'Real-time Sync', 'Data Quality'],
    metric: { label: 'Uptime SLA', value: '99.9%' },
  },
  {
    title: 'Email Automation',
    tagline: 'Outreach AI',
    description: 'Generate hyper-personalized outreach at scale using Gemini. Every email unique, every message relevant, every click tracked.',
    stat: '312 emails/run',
    color: '#EC4899',
    icon: '✉️',
    features: ['AI Personalization', 'A/B Testing', 'Domain Warmup', 'Reply Detection'],
    metric: { label: 'Open rate avg.', value: '62%' },
  },
  {
    title: 'Analytics & Reporting',
    tagline: 'Business Intelligence',
    description: 'AI-generated dashboards and reports that surface the insights that matter — delivered automatically to your inbox every morning.',
    stat: 'Daily insights',
    color: '#06B6D4',
    icon: '📊',
    features: ['KPI Dashboards', 'Anomaly Alerts', 'Custom Reports', 'Slack/Email Delivery'],
    metric: { label: 'Decisions accelerated', value: '5×' },
  },
  {
    title: 'CRM Automation',
    tagline: 'Customer Intelligence',
    description: 'Enrich contact records, log interactions, score relationships, and trigger follow-ups automatically — zero manual entry.',
    stat: '100% data sync',
    color: '#A78BFA',
    icon: '👥',
    features: ['Auto-Enrichment', 'Relationship Scoring', 'Follow-up Triggers', 'Deduplication'],
    metric: { label: 'Data accuracy', value: '99.6%' },
  },
  {
    title: 'Voice AI Agents',
    tagline: 'Conversational AI',
    description: 'Deploy AI voice agents that book appointments, answer FAQs, and qualify inbound callers — completely autonomous.',
    stat: '24/7 coverage',
    color: '#F472B6',
    icon: '🎙️',
    features: ['Natural Language', 'Calendar Sync', 'Sentiment Analysis', 'Call Recording'],
    metric: { label: 'Calls handled / mo', value: '10K+' },
  },
];

// ── Decorative particles floating in bg ────────────────────────────────────
function Particle({ x, y, size, color, delay }: { x: number; y: number; size: number; color: string; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, left: `${x}%`, top: `${y}%`, background: color, opacity: 0 }}
      animate={{ opacity: [0, 0.6, 0], y: [0, -30, -60], scale: [1, 1.2, 0] }}
      transition={{ duration: 5, repeat: Infinity, delay, ease: 'easeOut' }}
    />
  );
}

// ── Orbital ring behind the carousel ───────────────────────────────────────
function OrbitalRing({ radius, color, duration, reverse }: { radius: number; color: string; duration: number; reverse?: boolean }) {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 rounded-full pointer-events-none border"
      style={{
        width: radius * 2,
        height: radius * 2,
        marginLeft: -radius,
        marginTop: -radius,
        borderColor: `${color}15`,
        borderStyle: 'dashed',
      }}
      animate={{ rotate: reverse ? [0, -360] : [0, 360] }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
    />
  );
}

export default function Services() {
  const [rotationAngle, setRotationAngle] = useState(0);
  const anglePerCard = 360 / services.length;
  const activeIndex = Math.round(-rotationAngle / anglePerCard) % services.length;
  const normalizedActiveIndex = (activeIndex + services.length) % services.length;

  const getRadius = () => (typeof window !== 'undefined' && window.innerWidth < 768 ? 260 : 480);
  const [radius, setRadius] = useState(480);

  useEffect(() => {
    const handleResize = () => setRadius(getRadius());
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setRotationAngle((prev) => prev - anglePerCard);
    }, 4500);
    return () => clearInterval(interval);
  }, [anglePerCard]);

  const activeColor = services[normalizedActiveIndex].color;

  // Background particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    x: (i * 17 + 5) % 95,
    y: (i * 23 + 10) % 85,
    size: 2 + (i % 3),
    color: services[i % services.length].color,
    delay: i * 0.4,
  }));

  return (
    <section id="services" className="py-32 relative border-t border-white/5 bg-[#030014] overflow-hidden">

      {/* ── Ambient glow ── */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] pointer-events-none"
        animate={{ backgroundColor: activeColor }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        style={{ opacity: 0.07, filter: 'blur(120px)', borderRadius: '50%' }}
      />

      {/* ── Background particles ── */}
      {particles.map((p, i) => <Particle key={i} {...p} />)}

      {/* ── 3D grid floor ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: 'perspective(400px) rotateX(60deg)',
          transformOrigin: 'bottom center',
        }}
      />

      {/* ── Section header ── */}
      <div className="mb-20 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center">
          <motion.p
            className="text-xs font-mono tracking-[0.3em] uppercase mb-4"
            animate={{ color: activeColor }}
            transition={{ duration: 1 }}
          >
            ◈ What We Build
          </motion.p>

          <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
            Services that{' '}
            <motion.span
              className="text-transparent bg-clip-text"
              animate={{
                backgroundImage: [
                  `linear-gradient(90deg, ${activeColor}, #8B5CF6)`,
                  `linear-gradient(90deg, #8B5CF6, ${activeColor})`,
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
              style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text' }}
            >
              prove themselves
            </motion.span>
          </h2>

          <p className="text-white/40 mt-2 text-sm max-w-lg mx-auto font-mono tracking-wide">
            Rotate the ring — every service is a living product
          </p>

          {/* Active service name indicator */}
          <motion.div
            key={normalizedActiveIndex}
            className="inline-flex items-center gap-3 mt-6 px-5 py-2.5 rounded-full"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            style={{
              background: `${activeColor}12`,
              border: `1px solid ${activeColor}35`,
            }}
          >
            <span className="text-lg">{services[normalizedActiveIndex].icon}</span>
            <span className="text-xs font-mono tracking-wider" style={{ color: activeColor }}>
              {services[normalizedActiveIndex].title}
            </span>
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: activeColor }}
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </div>

      {/* ── 3D Carousel ── */}
      <div className="relative w-full h-[520px] md:h-[500px] flex items-center justify-center overflow-hidden md:overflow-visible"
        style={{ perspective: '2000px' }}>

        {/* Orbital decorative rings */}
        <OrbitalRing radius={320} color={activeColor} duration={30} />
        <OrbitalRing radius={480} color={activeColor} duration={50} reverse />
        <OrbitalRing radius={640} color={activeColor} duration={70} />

        {/* Nav buttons */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full max-w-7xl px-4 md:px-12 flex justify-between z-50 pointer-events-none">
          <motion.button
            onClick={() => setRotationAngle(r => r + anglePerCard)}
            className="pointer-events-auto p-4 md:p-5 rounded-full bg-black/60 border backdrop-blur-2xl text-white/70 hover:text-white transition-all"
            style={{ borderColor: `${activeColor}30` }}
            whileHover={{ scale: 1.12, boxShadow: `0 0 24px ${activeColor}50` }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
          </motion.button>
          <motion.button
            onClick={() => setRotationAngle(r => r - anglePerCard)}
            className="pointer-events-auto p-4 md:p-5 rounded-full bg-black/60 border backdrop-blur-2xl text-white/70 hover:text-white transition-all"
            style={{ borderColor: `${activeColor}30` }}
            whileHover={{ scale: 1.12, boxShadow: `0 0 24px ${activeColor}50` }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
          </motion.button>
        </div>

        {/* Rotating cylinder */}
        <motion.div
          className="relative w-full h-full flex items-center justify-center"
          animate={{ rotateY: rotationAngle }}
          transition={{ type: 'spring', stiffness: 90, damping: 22, mass: 1.1 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {services.map((svc, i) => {
            const currentGlobalRotation = (i * anglePerCard) + rotationAngle;
            let normalizedRelativeRotation = currentGlobalRotation % 360;
            if (normalizedRelativeRotation > 180) normalizedRelativeRotation -= 360;
            if (normalizedRelativeRotation < -180) normalizedRelativeRotation += 360;
            const distFromFront = Math.abs(normalizedRelativeRotation);
            const isFront = distFromFront < 1;
            const isVisible = distFromFront < 100;

            return (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 touch-none"
                style={{
                  transform: `rotateY(${i * anglePerCard}deg) translateZ(${radius}px)`,
                  opacity: isVisible ? 1 - (distFromFront / 120) * 0.55 : 0,
                  pointerEvents: isVisible ? 'auto' : 'none',
                  filter: isFront ? 'none' : `brightness(${1 - (distFromFront / 120) * 0.45}) saturate(${1 - (distFromFront / 180) * 0.5})`,
                  transition: 'opacity 0.5s ease, filter 0.5s ease',
                }}
              >
                <div
                  className={`w-full h-full transition-transform duration-300 ${!isFront ? 'cursor-pointer' : ''}`}
                  onClick={() => {
                    if (!isFront) {
                      let diff = (i * anglePerCard) + rotationAngle;
                      diff = diff % 360;
                      if (diff > 180) diff -= 360;
                      if (diff < -180) diff += 360;
                      setRotationAngle(r => r - diff);
                    }
                  }}
                >
                  <ServicePanel {...svc} />
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Dot nav */}
        <div className="absolute bottom-[-16px] md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2.5 z-50">
          {services.map((svc, i) => (
            <motion.button
              key={i}
              onClick={() => {
                let diff = (i * anglePerCard) + rotationAngle;
                diff = diff % 360;
                if (diff > 180) diff -= 360;
                if (diff < -180) diff += 360;
                setRotationAngle(r => r - diff);
              }}
              className="rounded-full transition-all duration-500"
              animate={{
                width: i === normalizedActiveIndex ? 24 : 8,
                height: 8,
                backgroundColor: i === normalizedActiveIndex ? svc.color : 'rgba(255,255,255,0.15)',
                boxShadow: i === normalizedActiveIndex ? `0 0 12px ${svc.color}` : 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Bottom stats strip ── */}
      <div className="mt-24 max-w-5xl mx-auto px-6 grid grid-cols-3 gap-4">
        {[
          { label: 'Automation Workflows', value: '1,200+', color: '#b49bff' },
          { label: 'Hours Saved / Month', value: '38K+', color: '#22C55E' },
          { label: 'Enterprise Clients', value: '120+', color: '#F97316' },
        ].map((s, i) => (
          <motion.div
            key={i}
            className="text-center p-6 rounded-2xl relative overflow-hidden"
            style={{ background: `${s.color}06`, border: `1px solid ${s.color}20` }}
            whileHover={{ scale: 1.04, boxShadow: `0 0 30px ${s.color}25` }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <motion.div
              className="text-3xl font-bold font-mono mb-1"
              style={{ color: s.color }}
            >
              {s.value}
            </motion.div>
            <div className="text-xs text-white/35 font-mono uppercase tracking-wider">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
