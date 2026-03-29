import { useState, useEffect, useRef } from 'react';
import { useInView } from '../hooks/useInView';
import { useROICounter } from '../hooks/useROICounter';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Cpu, 
  Database, 
  Globe, 
  Zap, 
  Terminal, 
  CheckCircle2, 
  AlertCircle,
  DatabaseZap,
  Mail,
  FileSearch,
  MessageSquare,
  BarChart3,
  Users,
  Mic2
} from 'lucide-react';

/* --- DATA & TYPES --- */

const services = [
  { id: 'lead',    name: 'Lead Qual',    icon: <Globe className="w-3 h-3"/>,     color: '#b49bff' },
  { id: 'workflow', name: 'Workflows',    icon: <Zap className="w-3 h-3"/>,       color: '#8B5CF6' },
  { id: 'doc',      name: 'Document AI',  icon: <FileSearch className="w-3 h-3"/>, color: '#F97316' },
  { id: 'support',  name: 'Support AI',   icon: <MessageSquare className="w-3 h-3"/>, color: '#22C55E' },
  { id: 'pipeline', name: 'Data Pipes',   icon: <DatabaseZap className="w-3 h-3"/>, color: '#FBBF24' },
  { id: 'email',    name: 'Email AI',     icon: <Mail className="w-3 h-3"/>,      color: '#EC4899' },
  { id: 'analytics',name: 'Analytics',    icon: <BarChart3 className="w-3 h-3"/>, color: '#06B6D4' },
  { id: 'crm',      name: 'CRM Sync',     icon: <Users className="w-3 h-3"/>,     color: '#A78BFA' },
  { id: 'voice',    name: 'Voice AI',     icon: <Mic2 className="w-3 h-3"/>,      color: '#F472B6' },
];

const mockEvents = [
  { type: 'AI', text: 'Lead "Acme Corp" scored: 98/100', service: 'lead' },
  { type: 'IO', text: 'Pipeline: 14.2k records synced', service: 'pipeline' },
  { type: 'AI', text: 'Invoice #4921 parsed successfully', service: 'doc' },
  { type: 'IO', text: 'Email campaign "Spring" executed', service: 'email' },
  { type: 'AI', text: 'Voice agent: Appt confirmed for BetaLLC', service: 'voice' },
  { type: 'SYS', text: 'Node-14 health: Operational (99.9%)', service: 'workflow' },
  { type: 'AI', text: 'Support Ticket #882 closed by Agent', service: 'support' },
  { type: 'IO', text: 'Tableau Sync: Report-Q1 generated', service: 'analytics' },
  { type: 'SYS', text: 'CRM Webhook: Contact-4821 enriched', service: 'crm' },
];

/* --- SUB-COMPONENTS --- */

function AnimatedNumber({ end, duration, active, suffix, className, color }: { end: number, duration: number, active: boolean, suffix: string, className: string, color: string }) {
  const value = useROICounter(end, duration, active);
  const formatted =
    end >= 1_000_000
      ? `${(value / 1_000_000).toFixed(2)}M`
      : end >= 1_000
      ? value.toLocaleString()
      : value.toString();
      
  return (
    <div className={`font-black tracking-tighter ${className}`}>
      <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(180deg, #ffffff 0%, ${color} 150%)`, textShadow: `0 10px 30px ${color}40` }}>
        {formatted}
      </span>
      <span className="text-[0.4em] font-medium text-white/40 ml-1 uppercase tracking-[0.25em]">{suffix}</span>
    </div>
  );
}

function LiveLogTerminal({ active }: { active: boolean }) {
  const [logs, setLogs] = useState(mockEvents.slice(0, 5));
  
  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      const nextEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
      setLogs((prev) => [ { ...nextEvent, id: Date.now() }, ...prev.slice(0, 15)]);
    }, 2800);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="flex flex-col h-full font-mono text-[10px] leading-relaxed overflow-hidden">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5 opacity-50 uppercase tracking-[0.2em] font-bold">
        <Terminal className="w-3 h-3 text-[#b49bff]" />
        Real-Time Operations Feedback
      </div>
      <div className="flex-1 overflow-hidden space-y-1.5 scrollbar-hide">
        <AnimatePresence initial={false}>
          {logs.map((log: any) => (
            <motion.div 
              key={log.id || log.text}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-2"
            >
              <span className="text-white/20">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
              <span className="font-bold uppercase opacity-80" style={{ color: (services.find(s=>s.id === log.service)?.color || '#fff') }}>{log.type}:</span>
              <span className="text-white/60 truncate">{log.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ServiceOpsMatrix({ active }: { active: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-3 h-full">
      {services.map((svc, i) => (
        <motion.div 
          key={svc.id}
          className="bg-white/[0.03] border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center group hover:bg-white/[0.06] transition-colors"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={active ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: i * 0.05 }}
        >
          <div className="relative mb-2">
            <div className={`p-2 rounded-lg bg-black/40 border border-white/5 text-white/50 group-hover:text-white group-hover:scale-110 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)]`}>
              {svc.icon}
            </div>
            {active && (
              <motion.div 
                className="absolute -top-1 -right-1 w-2 h-2 rounded-full border border-[#030014] shadow-[0_0_8px_#22C55E]"
                style={{ backgroundColor: '#22C55E' }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
              />
            )}
          </div>
          <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest font-bold group-hover:text-white/60 transition-colors">{svc.name}</span>
        </motion.div>
      ))}
    </div>
  );
}

function TelemetryChart({ active }: { active: boolean }) {
  return (
    <div className="relative h-full w-full flex flex-col">
       <div className="flex justify-between items-center mb-6">
         <div className="flex gap-4">
           <div className="flex items-center gap-1.5 opacity-60">
             <div className="w-2 h-2 rounded-sm bg-[#b49bff]" />
             <span className="text-[10px] font-mono text-white/50 tracking-wider">Executions</span>
           </div>
           <div className="flex items-center gap-1.5 opacity-60">
             <div className="w-2 h-2 rounded-sm bg-[#8B5CF6]" />
             <span className="text-[10px] font-mono text-white/50 tracking-wider">Tokens</span>
           </div>
         </div>
         <div className="text-[10px] font-mono text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded border border-[#22C55E]/20">
           +28% Eff.
         </div>
       </div>
       <div className="flex-1 relative">
         <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="w-full h-full overflow-visible">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(y => (
              <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray="4 4" />
            ))}
            
            {/* Line 1 - Executions */}
            <motion.path 
              d="M 0 100 Q 50 110, 80 60 T 160 80 T 240 40 T 320 70 T 400 20"
              fill="none" stroke="#b49bff" strokeWidth="2.5"
              initial={{ pathLength: 0 }}
              animate={active ? { pathLength: 1 } : {}}
              transition={{ duration: 2, ease: "easeInOut" }}
              style={{ filter: 'drop-shadow(0 0 12px #b49bff)' }}
            />
            
            {/* Line 2 - Tokens */}
            <motion.path 
              d="M 0 120 Q 40 100, 100 80 T 200 60 T 300 40 T 400 10"
              fill="none" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="3 3"
              initial={{ pathLength: 0 }}
              animate={active ? { pathLength: 1 } : {}}
              transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
              className="opacity-40"
            />
         </svg>
       </div>
    </div>
  );
}

function PerformanceGauge({ label, value, color, active }: { label: string, value: number, color: string, active: boolean }) {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center group">
       <div className="relative w-20 h-20 flex items-center justify-center">
         <svg className="w-full h-full transform -rotate-90">
           <circle cx="40" cy="40" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
           <motion.circle 
             cx="40" cy="40" r={radius} stroke={color} strokeWidth="6" fill="transparent"
             strokeDasharray={circumference}
             initial={{ strokeDashoffset: circumference }}
             animate={active ? { strokeDashoffset: offset } : {}}
             transition={{ duration: 1.5, ease: "circOut" }}
             style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
           />
         </svg>
         <div className="absolute inset-0 flex flex-col items-center justify-center">
           <span className="text-xl font-black text-white">{active ? value : 0}%</span>
         </div>
       </div>
       <span className="mt-2 text-[9px] font-mono text-white/30 truncate uppercase tracking-widest font-bold group-hover:text-white/60 transition-colors italic">{label}</span>
    </div>
  );
}

/* --- MAIN COMPONENT --- */

export default function ROITicker() {
  const [sectionRef, inView] = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={sectionRef} className="py-24 px-6 relative bg-[#030014] overflow-hidden">
      {/* Background Polish */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-[#b49bff]/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#8B5CF6]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-[1250px] relative z-20">
        
        {/* Header Header */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/5 backdrop-blur-md mb-4">
              <Activity className="w-3 h-3 text-[#b49bff] animate-pulse" />
              <p className="text-[10px] font-mono tracking-[0.25em] font-bold uppercase text-white/50">Command Center v2.4.1</p>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              Impact Intelligence<br/>
              <span className="text-white/40">Real-time telemetry</span>
            </h2>
          </div>
          <div className="flex gap-12 border-l border-white/5 pl-12 h-fit">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest font-bold">Network Uptime</span>
              <span className="text-2xl font-black text-[#22C55E]">99.999%</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest font-bold">Global ROI</span>
              <span className="text-2xl font-black text-white">847% <span className="text-[#22C55E] text-sm tracking-tighter">↗ 12%</span></span>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Complex Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-5 h-auto lg:h-[720px]">
          
          {/* 1. Primary Telemetry (3x2) */}
          <motion.div 
            className="lg:col-span-4 lg:row-span-2 bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 flex flex-col relative overflow-hidden group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-between items-start z-10 relative">
               <div className="space-y-2">
                 <p className="text-[11px] font-mono text-white/30 uppercase tracking-[0.3em] font-bold">Neural Processing Volume</p>
                 <AnimatedNumber end={1240000} duration={2500} active={inView} suffix="+" color="#b49bff" className="text-6xl md:text-[5.5rem] leading-none" />
                 <p className="text-sm text-white/40 max-w-sm font-medium pt-4 border-t border-white/5">
                   Real-time inference tracking across all deployed LLM nodes. Spike activity indicates high-volume document extraction operations.
                 </p>
               </div>
               <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5 shadow-xl">
                  <Cpu className="w-5 h-5 text-[#b49bff]" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest leading-none">CPU Priority</span>
                    <span className="text-xs font-bold text-white">Reserved (AWS-P4D)</span>
                  </div>
               </div>
            </div>
            
            <div className="flex-1 mt-12 z-10 relative">
               <TelemetryChart active={inView} />
            </div>

            {/* Aesthetic Detail */}
            <div className="absolute bottom-10 left-10 pointer-events-none opacity-20">
               <div className="flex gap-1.5 grayscale">
                 <div className="w-4 h-1 rounded-full bg-white/20" />
                 <div className="w-12 h-1 rounded-full bg-white/20" />
                 <div className="w-6 h-1 rounded-full bg-white/20" />
               </div>
            </div>
          </motion.div>

          {/* 2. Service Ops Matrix (2x2) */}
          <motion.div 
            className="lg:col-span-2 lg:row-span-2 bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 flex flex-col shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8 whitespace-nowrap">
              <div className="w-1.5 h-6 rounded-full bg-[#8B5CF6]" />
              <h3 className="text-xs font-mono text-white/50 uppercase tracking-[0.3em] font-bold">Core Service Status</h3>
            </div>
            <div className="flex-1">
              <ServiceOpsMatrix active={inView} />
            </div>
          </motion.div>

          {/* 3. Live Log Terminal (2x1) */}
          <motion.div 
            className="lg:col-span-2 bg-[#0d0d14] border border-white/5 rounded-[2.5rem] p-8 min-h-[220px] shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <LiveLogTerminal active={inView} />
          </motion.div>

          {/* 4. Efficiency Data (2x1) -- Hours Saved */}
          <motion.div 
            className="lg:col-span-2 bg-gradient-to-br from-[#10101b] to-[#07070b] border border-white/5 rounded-[2.5rem] p-8 flex justify-between items-center group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
             <div className="space-y-3">
               <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.25em] font-bold">Billable Recv.</p>
               <AnimatedNumber end={48230} duration={2000} active={inView} suffix="hrs" color="#22C55E" className="text-5xl" />
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
                 <span className="text-[10px] font-mono text-[#22C55E] uppercase font-bold tracking-widest">Target Met</span>
               </div>
             </div>
             <div className="h-full py-2">
                <div className="w-[1px] h-full bg-white/5" />
             </div>
             <div className="space-y-4 text-right">
                <div className="flex flex-col gap-1">
                   <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest font-bold">Last Run</span>
                   <span className="text-xs text-white/60 font-medium">10.02.2025</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#22C55E]/5 border border-[#22C55E]/10 flex items-center justify-center">
                   <CheckCircle2 className="w-8 h-8 text-[#22C55E] opacity-50" />
                </div>
             </div>
          </motion.div>

          {/* 5. Performance Indicators (2x1) */}
          <motion.div 
            className="lg:col-span-2 bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 flex items-center justify-around shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <PerformanceGauge label="Accuracy" value={99.8} color="#22C55E" active={inView} />
            <PerformanceGauge label="Latency" value={94.5} color="#b49bff" active={inView} />
            <PerformanceGauge label="Throughput" value={88.2} color="#8B5CF6" active={inView} />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
