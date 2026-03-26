import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
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
            className="max-w-[80%] px-4 py-2, rounded-2xl text-sm"
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

  return (
    <section id="services" className="py-28 relative border-t border-white/5 overflow-hidden">
      <div className="mb-14 px-6 max-w-7xl mx-auto">
        <div className="text-center">
          <p className="text-xs font-[family-name:var(--font-mono)] tracking-[0.3em] uppercase text-[#F5F0E8]/30 mb-3">
            What We Build
          </p>
          <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-heading)] font-bold text-[#F5F0E8]">
            Services that{' '}
            <span className="text-[#b49bff]">prove themselves</span>
          </h2>
          <p className="text-[#F5F0E8]/40 mt-4 text-sm">Click any card to see a live demo</p>
        </div>
      </div>

      {/* Horizontal scroll panels */}
      <div className="flex gap-6 overflow-x-auto px-6 pb-6 scrollbar-thin snap-x snap-mandatory">
        {services.map((svc, i) => (
          <div key={i} className="snap-start shrink-0">
            <ServicePanel
              {...svc}
              onOpen={() => setOpenIdx(i)}
            />
          </div>
        ))}
      </div>

      {/* Video Modal */}
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
