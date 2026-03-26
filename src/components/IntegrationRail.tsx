import { useRef, useEffect } from 'react';

// Integration logos with colors
const integrations = [
  { name: 'Slack',       color: '#E01E5A', bg: '#4A154B' },
  { name: 'Notion',      color: '#ffffff', bg: '#000000' },
  { name: 'Salesforce',  color: '#00A1E0', bg: '#032D60' },
  { name: 'HubSpot',     color: '#FF7A59', bg: '#33475B' },
  { name: 'Zapier',      color: '#FF4A00', bg: '#1a0a00' },
  { name: 'Airtable',    color: '#18BFFF', bg: '#0b2233' },
  { name: 'Gmail',       color: '#EA4335', bg: '#1a0a09' },
  { name: 'Linear',      color: '#5E6AD2', bg: '#0f0f1a' },
  { name: 'Jira',        color: '#0052CC', bg: '#000e24' },
  { name: 'Stripe',      color: '#635BFF', bg: '#0a091a' },
  { name: 'Shopify',     color: '#96BF48', bg: '#0a1a0a' },
  { name: 'Twilio',      color: '#F22F46', bg: '#1a0508' },
  { name: 'OpenAI',      color: '#10a37f', bg: '#032319' },
  { name: 'Gemini',      color: '#4285F4', bg: '#051228' },
  { name: 'PostgreSQL',  color: '#336791', bg: '#040f1a' },
  { name: 'MongoDB',     color: '#47A248', bg: '#061a06' },
  { name: 'Webflow',     color: '#4353FF', bg: '#060814' },
  { name: 'Typeform',    color: '#262627', bg: '#F7FAFC' },
  { name: 'Calendly',    color: '#006BFF', bg: '#001833' },
  { name: 'WhatsApp',    color: '#25D366', bg: '#032d14' },
];

// Icons map (emoji-based SVG fallbacks for clean look without react-icons dep)
const iconMap: Record<string, string> = {
  Slack: '📡', Notion: '📝', Salesforce: '☁️', HubSpot: '🎯',
  Zapier: '⚡', Airtable: '📊', Gmail: '📧', Linear: '📐',
  Jira: '🔵', Stripe: '💳', Shopify: '🛒', Twilio: '📞',
  OpenAI: '🤖', Gemini: '✨', PostgreSQL: '🐘', MongoDB: '🍃',
  Webflow: '🌐', Typeform: '📋', Calendly: '📅', WhatsApp: '💬',
};

function LogoItem({ name, color, bg }: { name: string; color: string; bg: string }) {
  const pulseRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="group relative mx-4 flex flex-col items-center gap-2 shrink-0"
      title={name}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl
                   transition-all duration-300 border border-transparent
                   grayscale group-hover:grayscale-0 group-hover:scale-110"
        style={{
          background: `${bg}`,
          border: `1px solid ${color}22`,
        }}
      >
        {iconMap[name] || '🔧'}
      </div>
      {/* Tooltip */}
      <div
        className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100
                   transition-opacity duration-200 pointer-events-none whitespace-nowrap"
      >
        <div className="glass rounded-full px-3 py-1 text-xs font-[family-name:var(--font-mono)] flex items-center gap-1.5"
             style={{ color }}>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color }} />
          {name}
        </div>
      </div>
    </div>
  );
}

function Row({ reverse, startIndex = 0 }: { reverse?: boolean; startIndex?: number }) {
  // Create a circular array that starts at different positions for each row
  const items = [];
  const totalItems = integrations.length;
  
  // Add items starting from startIndex for a full loop
  for (let i = 0; i < totalItems; i++) {
    const index = (startIndex + i) % totalItems;
    items.push(integrations[index]);
  }
  
  return (
    <div className="flex overflow-hidden">
      <div className={`flex items-center ${reverse ? 'marquee-right' : 'marquee-left'}`}>
        {items.map((item, i) => (
          <LogoItem key={`${item.name}-${i}`} {...item} />
        ))}
      </div>
    </div>
  );
}

export default function IntegrationRail() {
  return (
    <section className="py-20 relative overflow-hidden border-y border-white/5">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
           style={{ background: 'linear-gradient(90deg, #030014 0%, transparent 100%)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
           style={{ background: 'linear-gradient(270deg, #030014 0%, transparent 100%)' }} />

      {/* Header */}
      <div className="text-center mb-12 px-6 relative z-10">
        <p className="text-xs font-[family-name:var(--font-mono)] tracking-[0.3em] uppercase text-[#F5F0E8]/30 mb-2">
          Integrations
        </p>
        <h2 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-[#F5F0E8]/80">
          Connects with{' '}
          <span className="text-[#b49bff]">every tool you already use</span>
        </h2>
      </div>

      <div className="space-y-6">
        <Row startIndex={0} />
        <Row reverse startIndex={Math.floor(integrations.length / 2)} />
      </div>
    </section>
  );
}
