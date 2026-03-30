import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ServicePanel from './ServicePanel';
import VideoModal from './VideoModal';

// Micro-demo components for each service
function LeadScoringDemo() {
  const leads = [
    { name: 'Acme Corp', score: 92, intent: 'High', color: '#22C55E' },
    { name: 'Beta LLC',  score: 78, intent: 'Mid',  color: '#F97316' },
    { name: 'Gamma Inc', score: 95, intent: 'High', color: '#22C55E' },
    { name: 'Delta Co',  score: 41, intent: 'Low',  color: '#EF4444' },
  ];
  return (
    <div className="w-full space-y-3">
      <p className="text-xs font-[family-name:var(--font-mono)] text-[#b49bff] mb-4">⟡ Scoring 847 leads...</p>
      {leads.map((l, i) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-white/8 bg-white/2">
          <span className="text-sm text-[#F5F0E8]/70 font-[family-name:var(--font-mono)]">{l.name}</span>
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-20 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${l.score}%`, background: l.color }} />
            </div>
            <span className="text-xs font-[family-name:var(--font-mono)] w-8" style={{ color: l.color }}>{l.score}</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: l.color, background: `${l.color}15` }}>{l.intent}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChatDemo() {
  const messages = [
    { role: 'ai',   text: 'Hi! How can I help you today?' },
    { role: 'user', text: 'I need help tracking my order' },
    { role: 'ai',   text: 'Sure! Order #4821 shipped yesterday. Expected delivery: tomorrow.' },
    { role: 'user', text: 'Great, thanks!' },
    { role: 'ai',   text: "You're welcome! Is there anything else?" },
  ];
  return (
    <div className="w-full space-y-3 max-h-64 overflow-y-auto">
      {messages.map((msg, i) => (
        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div
            className="max-w-[80%] px-4 py-2 rounded-2xl text-sm"
            style={{
              background: msg.role === 'ai' ? 'rgba(180, 155, 255,0.08)' : 'rgba(139,92,246,0.15)',
              color: msg.role === 'ai' ? '#b49bff' : '#F5F0E8',
              border: `1px solid ${msg.role === 'ai' ? 'rgba(180, 155, 255,0.2)' : 'rgba(139,92,246,0.2)'}`,
              padding: '8px 16px',
            }}
          >
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );
}

function EmailDemo() {
  const emailText = `Subject: Exclusive offer for {{FirstName}} at {{Company}}

Hi {{FirstName}},

I noticed {{Company}} recently expanded into {{Market}}. Our automation platform has helped similar companies save 40+ hrs/week...`;
  return (
    <div className="w-full p-4 rounded-xl border border-white/10 bg-black/20 font-[family-name:var(--font-mono)] text-xs text-[#F5F0E8]/70 whitespace-pre-line leading-relaxed">
      <div className="text-[#b49bff] mb-3 font-semibold">✉ AI composing email...</div>
      {emailText}
      <span className="terminal-cursor" />
    </div>
  );
}

function DataPipelineDemo() {
  const rows = [
    { name: 'user_signup.csv row 1', status: 'Transformed', color: '#22C55E' },
    { name: 'user_signup.csv row 2', status: 'Enriched',    color: '#8B5CF6' },
    { name: 'user_signup.csv row 3', status: 'Categorized', color: '#b49bff' },
    { name: 'user_signup.csv row 4', status: 'Processing',  color: '#F97316' },
    { name: 'user_signup.csv row 5', status: 'Queued',      color: '#F5F0E8' },
  ];
  return (
    <div className="w-full space-y-2">
      {rows.map((r, i) => (
        <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-white/5 bg-white/2 text-xs">
          <span className="font-[family-name:var(--font-mono)] text-[#F5F0E8]/50">{r.name}</span>
          <span className="px-2.5 py-1 rounded-full font-[family-name:var(--font-mono)]"
                style={{ color: r.color, background: `${r.color}15`, border: `1px solid ${r.color}30` }}>
            {r.status}
          </span>
        </div>
      ))}
    </div>
  );
}

function AnalyticsDemo() {
  const data = [30, 55, 42, 70, 88, 65, 95];
  const max = Math.max(...data);
  return (
    <div className="w-full">
      <p className="text-xs font-[family-name:var(--font-mono)] text-[#b49bff] mb-4">📈 Building report...</p>
      <div className="flex items-end gap-3 h-32">
        {data.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t-sm transition-all duration-1000"
              style={{
                height: `${(v / max) * 100}%`,
                background: `linear-gradient(180deg, #b49bff, #8B5CF6)`,
                opacity: 0.7 + (i / data.length) * 0.3,
              }}
            />
            <span className="text-[8px] text-[#F5F0E8]/30 font-[family-name:var(--font-mono)]">
              W{i + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentDemo() {
  return (
    <div className="w-full p-4 rounded-xl border border-white/10 bg-black/20 text-xs font-[family-name:var(--font-mono)] space-y-3">
      <div className="text-[#F5F0E8]/40">📄 Contract_Q1_2025.pdf</div>
      {['Total Contract Value: $48,000', 'Renewal Date: March 2026', 'Notice Period: 30 days'].map((line, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#b49bff] animate-pulse" />
          <span className="text-[#b49bff]">Extracted: </span>
          <span className="text-[#F5F0E8]/70">{line}</span>
        </div>
      ))}
    </div>
  );
}

function CRMDemo() {
  return (
    <div className="w-full p-4 rounded-xl border border-white/10 bg-black/20 text-xs font-[family-name:var(--font-mono)] space-y-2">
      <div className="text-[#8B5CF6] font-semibold mb-3">👤 Contact Being Enriched...</div>
      {[
        { label: 'Company Size', value: '500-1000 employees', color: '#22C55E' },
        { label: 'Industry',     value: 'SaaS / Technology',   color: '#b49bff' },
        { label: 'Funding',      value: 'Series B ($40M)',      color: '#F97316' },
        { label: 'Tech Stack',   value: 'AWS, React, Node',     color: '#8B5CF6' },
      ].map((item, i) => (
        <div key={i} className="flex justify-between">
          <span className="text-[#F5F0E8]/40">{item.label}</span>
          <span style={{ color: item.color }}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function VoiceDemo() {
  const wave = [20, 40, 60, 35, 75, 50, 30, 65, 45, 80, 55, 25];
  return (
    <div className="w-full text-center">
      <div className="flex items-center justify-center gap-1 h-20 mb-4">
        {wave.map((h, i) => (
          <div
            key={i}
            className="w-2 rounded-full"
            style={{
              height: `${h}%`,
              background: '#8B5CF6',
              animation: `live-pulse ${0.5 + i * 0.1}s ease-in-out infinite alternate`,
              opacity: 0.6 + (i % 3) * 0.1,
            }}
          />
        ))}
      </div>
      <div className="text-xs text-[#F5F0E8]/50 font-[family-name:var(--font-mono)] p-3 rounded-xl border border-white/5 bg-white/2 text-left">
        🎙 "Your appointment is confirmed for Tuesday at 3 PM. You'll receive a reminder 2 hours before."
      </div>
    </div>
  );
}

const services = [
  {
    title: 'AI Lead Qualification',
    tagline: 'Sales Intelligence',
    description: 'AI scores and prioritizes leads by intent signals, company data, and behavioral patterns — so your team focuses only on deals ready to close.',
    demoComponent: <LeadScoringDemo />,
    stat: '10x faster',
    color: '#b49bff',
    icon: '🎯',
  },
  {
    title: 'Workflow Automation',
    tagline: 'Process Engineering',
    description: 'Visual node-based workflows connect any combination of your tools. Trigger → Process → Output, all running automatically 24/7.',
    demoComponent: <DataPipelineDemo />,
    stat: '38hrs saved',
    color: '#8B5CF6',
    icon: '⚡',
  },
  {
    title: 'Document Intelligence',
    tagline: 'Document AI',
    description: 'AI reads, extracts, and categorizes data from invoices, contracts, and reports — instantly routing it where it needs to go.',
    demoComponent: <DocumentDemo />,
    stat: '99% accuracy',
    color: '#F97316',
    icon: '📄',
  },
  {
    title: 'AI Customer Support',
    tagline: 'Support Automation',
    description: 'Deploy AI agents that handle Tier-1 support 24/7, understand context, escalate intelligently, and close tickets faster.',
    demoComponent: <ChatDemo />,
    stat: '<2s response',
    color: '#22C55E',
    icon: '💬',
  },
  {
    title: 'Data Pipeline Automation',
    tagline: 'Data Engineering',
    description: 'Transform, enrich, and route data between any systems automatically. Clean data flowing to the right place at the right time.',
    demoComponent: <DataPipelineDemo />,
    stat: '100K rows/min',
    color: '#FBBF24',
    icon: '🔄',
  },
  {
    title: 'Email Automation',
    tagline: 'Outreach AI',
    description: 'Generate hyper-personalized outreach at scale using Gemini. Every email unique, every message relevant, every click tracked.',
    demoComponent: <EmailDemo />,
    stat: '312 emails/run',
    color: '#EC4899',
    icon: '✉️',
  },
  {
    title: 'Analytics & Reporting',
    tagline: 'Business Intelligence',
    description: 'AI-generated dashboards and reports that surface the insights that matter — delivered automatically to your inbox every morning.',
    demoComponent: <AnalyticsDemo />,
    stat: 'Daily insights',
    color: '#06B6D4',
    icon: '📊',
  },
  {
    title: 'CRM Automation',
    tagline: 'Customer Intelligence',
    description: 'Enrich contact records, log interactions, score relationships, and trigger follow-ups automatically — zero manual entry.',
    demoComponent: <CRMDemo />,
    stat: '100% data sync',
    color: '#A78BFA',
    icon: '👥',
  },
  {
    title: 'Voice AI Agents',
    tagline: 'Conversational AI',
    description: 'Deploy AI voice agents that book appointments, answer FAQs, and qualify inbound callers — completely autonomous.',
    demoComponent: <VoiceDemo />,
    stat: '24/7 coverage',
    color: '#F472B6',
    icon: '🎙️',
  },
];

export default function Services() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  
  // Angle tracked continuously to allow infinite spinning
  const [rotationAngle, setRotationAngle] = useState(0);

  // We have 9 services, so theta = 360 / 9 = 40 degrees
  const anglePerCard = 360 / services.length;
  
  // Calculate the active index dynamically based on cumulative rotation
  const activeIndex = Math.round(-rotationAngle / anglePerCard) % services.length;
  // Handle javascript negative modulo edge cases safely to pinpoint exact active index
  const normalizedActiveIndex = (activeIndex + services.length) % services.length;

  // Render variables
  const getRadius = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 320; // smaller radius on mobile
    }
    return 600; // Large wide carousel on desktop
  };
  const [radius, setRadius] = useState(600);
  
  useEffect(() => {
    const handleResize = () => setRadius(getRadius());
    handleResize(); // trigger on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Optional: Auto-rotate carousel when modal is closed
  useEffect(() => {
    if (openIdx !== null) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => prev - anglePerCard);
    }, 4500);
    return () => clearInterval(interval);
  }, [openIdx, anglePerCard]);

  return (
    <section id="services" className="py-32 relative border-t border-white/5 bg-[#030014] overflow-hidden">
      
      {/* Dynamic ambient glowing light mapping to the active center card */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.12] blur-[150px] transition-colors duration-1000 pointer-events-none"
        style={{ backgroundColor: services[normalizedActiveIndex].color }}
      />

      <div className="mb-20 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center">
          <p className="text-xs font-[family-name:var(--font-mono)] tracking-[0.3em] uppercase mb-4" style={{ color: services[normalizedActiveIndex].color, transition: 'color 1s ease' }}>
            What We Build
          </p>
          <h2 className="text-5xl md:text-6xl font-[family-name:var(--font-heading)] font-bold text-white tracking-tight">
            Services that{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b49bff] to-[#8B5CF6]">prove themselves</span>
          </h2>
          <p className="text-white/50 mt-6 text-sm max-w-xl mx-auto">
            Interact with our 3D cycle below.
          </p>
        </div>
      </div>

      {/* 3D Circular Cylinder Carousel Container */}
      <div className="relative w-full h-[600px] md:h-[550px] flex items-center justify-center perspective-[2000px] overflow-hidden md:overflow-visible">
        
        {/* Carousel Click Controls overlayed on sides */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full max-w-7xl px-4 md:px-12 flex justify-between z-50 pointer-events-none">
          <button 
            onClick={() => setRotationAngle(r => r + anglePerCard)} 
            className="pointer-events-auto p-4 md:p-5 rounded-full bg-black/60 border border-white/10 hover:bg-white/10 hover:scale-110 backdrop-blur-2xl text-white/70 hover:text-white transition-all shadow-[0_0_30px_rgba(0,0,0,0.8)]"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          <button 
            onClick={() => setRotationAngle(r => r - anglePerCard)} 
            className="pointer-events-auto p-4 md:p-5 rounded-full bg-black/60 border border-white/10 hover:bg-white/10 hover:scale-110 backdrop-blur-2xl text-white/70 hover:text-white transition-all shadow-[0_0_30px_rgba(0,0,0,0.8)]"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </div>

        {/* 3D Continuous Rotating Cylinder Ring */}
        <motion.div 
          className="relative w-full h-full flex items-center justify-center" 
          animate={{ rotateY: rotationAngle, z: -radius }}
          transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {services.map((svc, i) => {
            // Check to find angular distance from the front (camera facing). 
            // The active card sits directly at 0deg relative to camera.
            const currentGlobalRotation = (i * anglePerCard) + rotationAngle; 
            // Normalize it perfectly to [-180, 180] bound gap logic to identify the exact front card mathematically
            let normalizedRelativeRotation = currentGlobalRotation % 360;
            if (normalizedRelativeRotation > 180) normalizedRelativeRotation -= 360;
            if (normalizedRelativeRotation < -180) normalizedRelativeRotation += 360;
            
            const distFromFront = Math.abs(normalizedRelativeRotation);
            
            // If the card is completely rotated to the back (e.g. > 100 degrees), hide opacity so you don't click it by accident
            const isFront = distFromFront < 1; // Tolerance for float precision
            const isVisible = distFromFront < 100;

            return (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] md:w-[400px] touch-none"
                style={{ 
                  transform: `rotateY(${i * anglePerCard}deg) translateZ(${radius}px)`,
                  // Calculate dynamic backface darkness / opacity based on depth
                  opacity: isVisible ? 1 - (distFromFront / 120) * 0.5 : 0, 
                  pointerEvents: isVisible ? 'auto' : 'none',
                  filter: isFront ? "none" : `brightness(${1 - (distFromFront / 120) * 0.4}) grayscale(${distFromFront / 180})`,
                  transition: 'opacity 0.6s ease, filter 0.6s ease'
                }}
              >
                {/* Prevent clicks on background cards from firing the "Open Demo", instead route the click to rotate them to the front */}
                <div 
                  className={`w-full h-full transition-transform duration-300 ${!isFront ? 'cursor-pointer hover:scale-[1.02]' : ''}`}
                  onClick={() => {
                     // If user clicks a card not currently in the front, rotate the entire wheel to bring it to front
                     if (!isFront) {
                       // Find shortest rotation
                       let diff = (i * anglePerCard) + rotationAngle;
                       diff = diff % 360;
                       if (diff > 180) diff -= 360;
                       if (diff < -180) diff += 360;
                       setRotationAngle(r => r - diff);
                     } else {
                        // Fully interactable / open modal
                        setOpenIdx(i);
                     }
                  }}
                >
                  <ServicePanel
                    {...svc}
                    onOpen={() => { if (isFront) setOpenIdx(i); }}
                  />
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Dynamic Interactive Dot Navigation */}
        <div className="absolute bottom-[-20px] md:bottom-2 left-1/2 -translate-x-1/2 flex gap-3 z-50">
          {services.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                 let diff = (i * anglePerCard) + rotationAngle;
                 diff = diff % 360;
                 if (diff > 180) diff -= 360;
                 if (diff < -180) diff += 360;
                 setRotationAngle(r => r - diff);
              }}
              className="w-2.5 h-2.5 rounded-full transition-all duration-500"
              style={{
                backgroundColor: i === normalizedActiveIndex ? services[i].color : 'rgba(255,255,255,0.2)',
                transform: i === normalizedActiveIndex ? 'scale(1.5)' : 'scale(1)',
                boxShadow: i === normalizedActiveIndex ? `0 0 10px ${services[i].color}` : 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* Video Modal containing the live 24/7 demo */}
      <AnimatePresence>
        {openIdx !== null && (
          <VideoModal
            key={openIdx}
            title={services[openIdx].title}
            description={services[openIdx].description}
            demoComponent={services[openIdx].demoComponent}
            onClose={() => setOpenIdx(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
