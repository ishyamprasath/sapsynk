import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  ChevronLeft, ChevronRight,
  Target, Zap, FileText, MessageSquare,
  RefreshCw, Mail, BarChart3, Users, Mic,
} from 'lucide-react';
import ServicePanel from './ServicePanel';

const services = [
  {
    title: 'AI Lead Qualification',
    tagline: 'Sales Intelligence',
    description: 'AI scores and prioritizes leads by intent signals, company data, and behavioral patterns — so your team focuses only on deals ready to close.',
    stat: '10× faster',
    color: '#b49bff',
    iconKey: 'target',
    features: ['Intent Scoring', 'Company Enrichment', 'Behavioral Analysis', 'CRM Sync'],
    metric: { label: 'Avg. close rate lift', value: '+340%' },
  },
  {
    title: 'Workflow Automation',
    tagline: 'Process Engineering',
    description: 'Visual node-based workflows connect any combination of your tools. Trigger → Process → Output, all running automatically 24/7.',
    stat: '38 hrs saved',
    color: '#8B5CF6',
    iconKey: 'zap',
    features: ['No-Code Builder', 'Multi-App Logic', 'Error Recovery', 'Audit Logs'],
    metric: { label: 'Processes automated', value: '1,200+' },
  },
  {
    title: 'Document Intelligence',
    tagline: 'Document AI',
    description: 'AI reads, extracts, and categorizes data from invoices, contracts, and reports — instantly routing it where it needs to go.',
    stat: '99% accuracy',
    color: '#F97316',
    iconKey: 'filetext',
    features: ['OCR Extraction', 'Contract Parsing', 'Auto-Routing', 'Validation'],
    metric: { label: 'Docs processed / day', value: '50K' },
  },
  {
    title: 'AI Customer Support',
    tagline: 'Support Automation',
    description: 'Deploy AI agents that handle Tier-1 support 24/7, understand context, escalate intelligently, and close tickets faster.',
    stat: '<2s response',
    color: '#22C55E',
    iconKey: 'messagesquare',
    features: ['Context Memory', 'Escalation Logic', 'Multi-channel', 'CSAT Tracking'],
    metric: { label: 'Tickets auto-resolved', value: '78%' },
  },
  {
    title: 'Data Pipeline Automation',
    tagline: 'Data Engineering',
    description: 'Transform, enrich, and route data between any systems automatically. Clean data flowing to the right place at the right time.',
    stat: '100K rows/min',
    color: '#FBBF24',
    iconKey: 'refreshcw',
    features: ['ETL Pipelines', 'Schema Mapping', 'Real-time Sync', 'Data Quality'],
    metric: { label: 'Uptime SLA', value: '99.9%' },
  },
  {
    title: 'Email Automation',
    tagline: 'Outreach AI',
    description: 'Generate hyper-personalized outreach at scale using Gemini. Every email unique, every message relevant, every click tracked.',
    stat: '312 emails/run',
    color: '#EC4899',
    iconKey: 'mail',
    features: ['AI Personalization', 'A/B Testing', 'Domain Warmup', 'Reply Detection'],
    metric: { label: 'Open rate avg.', value: '62%' },
  },
  {
    title: 'Analytics & Reporting',
    tagline: 'Business Intelligence',
    description: 'AI-generated dashboards and reports that surface the insights that matter — delivered automatically to your inbox every morning.',
    stat: 'Daily insights',
    color: '#06B6D4',
    iconKey: 'barchart',
    features: ['KPI Dashboards', 'Anomaly Alerts', 'Custom Reports', 'Slack/Email Delivery'],
    metric: { label: 'Decisions accelerated', value: '5×' },
  },
  {
    title: 'CRM Automation',
    tagline: 'Customer Intelligence',
    description: 'Enrich contact records, log interactions, score relationships, and trigger follow-ups automatically — zero manual entry.',
    stat: '100% data sync',
    color: '#A78BFA',
    iconKey: 'users',
    features: ['Auto-Enrichment', 'Relationship Scoring', 'Follow-up Triggers', 'Deduplication'],
    metric: { label: 'Data accuracy', value: '99.6%' },
  },
  {
    title: 'Voice AI Agents',
    tagline: 'Conversational AI',
    description: 'Deploy AI voice agents that book appointments, answer FAQs, and qualify inbound callers — completely autonomous.',
    stat: '24/7 coverage',
    color: '#F472B6',
    iconKey: 'mic',
    features: ['Natural Language', 'Calendar Sync', 'Sentiment Analysis', 'Call Recording'],
    metric: { label: 'Calls handled / mo', value: '10K+' },
  },
];

const ICON_MAP: Record<string, React.ReactNode> = {
  target: <Target className="w-5 h-5" />,
  zap: <Zap className="w-5 h-5" />,
  filetext: <FileText className="w-5 h-5" />,
  messagesquare: <MessageSquare className="w-5 h-5" />,
  refreshcw: <RefreshCw className="w-5 h-5" />,
  mail: <Mail className="w-5 h-5" />,
  barchart: <BarChart3 className="w-5 h-5" />,
  users: <Users className="w-5 h-5" />,
  mic: <Mic className="w-5 h-5" />,
};

const ANGLE_PER_CARD = 360 / services.length;

export default function Services() {
  const [rotationAngle, setRotationAngle] = useState(0);
  const activeIndex = Math.round(-rotationAngle / ANGLE_PER_CARD) % services.length;
  const normalizedActiveIndex = (activeIndex + services.length) % services.length;

  const getRadius = () => (typeof window !== 'undefined' && window.innerWidth < 768 ? 260 : 480);
  const [radius, setRadius] = useState(480);

  useEffect(() => {
    const handleResize = () => setRadius(getRadius());
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotationAngle((prev) => prev - ANGLE_PER_CARD);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const goLeft = useCallback(() => setRotationAngle(r => r + ANGLE_PER_CARD), []);
  const goRight = useCallback(() => setRotationAngle(r => r - ANGLE_PER_CARD), []);
  const goTo = useCallback((i: number) => {
    setRotationAngle(prev => {
      let diff = (i * ANGLE_PER_CARD) + prev;
      diff = diff % 360;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      return prev - diff;
    });
  }, []);

  // Pre-compute card visibility data once per rotation
  const cardStates = useMemo(() => {
    return services.map((_, i) => {
      const currentGlobalRotation = (i * ANGLE_PER_CARD) + rotationAngle;
      let norm = currentGlobalRotation % 360;
      if (norm > 180) norm -= 360;
      if (norm < -180) norm += 360;
      const dist = Math.abs(norm);
      return {
        isFront: dist < 1,
        isVisible: dist < 100,
        opacity: dist < 100 ? 1 - (dist / 120) * 0.6 : 0,
        brightness: 1 - (dist / 120) * 0.5,
        saturation: 1 - (dist / 180) * 0.7,
      };
    });
  }, [rotationAngle]);

  return (
    <section id="services" className="py-32 relative border-t border-white/5 bg-[#030014] overflow-hidden">

      {/* Ambient glow — static div, color transitions via CSS */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none transition-colors duration-[1500ms]"
        style={{ backgroundColor: services[normalizedActiveIndex].color, opacity: 0.04, filter: 'blur(120px)' }}
      />

      {/* Section header */}
      <div className="mb-20 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center">
          <p className="text-[11px] font-mono tracking-[0.3em] uppercase mb-5 text-white/25">
            What We Build
          </p>

          <h2 className="text-5xl md:text-6xl font-bold text-white/90 tracking-tight mb-5">
            Services that{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/80 to-white/40">
              prove themselves
            </span>
          </h2>

          <p className="text-white/25 text-sm max-w-md mx-auto font-light tracking-wide">
            Every service is a living product — built, deployed, and measured.
          </p>

          {/* Active indicator — plain div, no motion */}
          <div
            className="inline-flex items-center gap-3 mt-8 px-4 py-2 rounded-full transition-opacity duration-300"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full transition-colors duration-500"
              style={{ background: services[normalizedActiveIndex].color }}
            />
            <span className="text-[11px] font-mono text-white/40 tracking-wider">
              {services[normalizedActiveIndex].title}
            </span>
          </div>
        </div>
      </div>

      {/* 3D Carousel */}
      <div className="relative w-full h-[520px] md:h-[500px] flex items-center justify-center overflow-hidden md:overflow-visible"
        style={{ perspective: '2000px' }}>

        {/* Nav — plain buttons, no motion */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full max-w-7xl px-4 md:px-12 flex justify-between z-50 pointer-events-none">
          <button
            onClick={goLeft}
            className="pointer-events-auto p-4 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white/70 hover:bg-white/[0.06] hover:scale-105 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goRight}
            className="pointer-events-auto p-4 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white/70 hover:bg-white/[0.06] hover:scale-105 active:scale-95 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Rotating cylinder — single motion.div for the whole ring */}
        <motion.div
          className="relative w-full h-full flex items-center justify-center"
          animate={{ rotateY: rotationAngle }}
          transition={{ type: 'spring', stiffness: 85, damping: 22, mass: 1.2 }}
          style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
        >
          {services.map((svc, i) => {
            const cs = cardStates[i];
            return (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 touch-none"
                style={{
                  transform: `rotateY(${i * ANGLE_PER_CARD}deg) translateZ(${radius}px)`,
                  opacity: cs.opacity,
                  pointerEvents: cs.isVisible ? 'auto' : 'none',
                  filter: cs.isFront ? 'none' : `brightness(${cs.brightness}) saturate(${cs.saturation})`,
                  transition: 'opacity 0.5s, filter 0.5s',
                  willChange: 'opacity, filter',
                }}
              >
                <div
                  className={!cs.isFront ? 'cursor-pointer' : ''}
                  onClick={!cs.isFront ? () => goTo(i) : undefined}
                >
                  <ServicePanel {...svc} icon={ICON_MAP[svc.iconKey]} />
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Dot nav — plain CSS */}
        <div className="absolute bottom-[-16px] md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
          {services.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-500"
              style={{
                width: i === normalizedActiveIndex ? 20 : 6,
                height: 6,
                backgroundColor: i === normalizedActiveIndex ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom stats */}
      <div className="mt-20 max-w-4xl mx-auto px-6 grid grid-cols-3 gap-6">
        {[
          { label: 'Automation Workflows', value: '1,200+' },
          { label: 'Hours Saved / Month', value: '38K+' },
          { label: 'Enterprise Clients', value: '120+' },
        ].map((s, i) => (
          <div
            key={i}
            className="text-center py-6"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="text-2xl font-semibold text-white/70 font-mono mb-1">{s.value}</div>
            <div className="text-[10px] text-white/20 font-mono uppercase tracking-[0.15em]">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
