import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, Mail, LifeBuoy, Webhook, MessageSquare, 
  Database, Bot, ShieldAlert, Cpu, 
  LayoutDashboard, Ticket, Hash, CheckSquare, AlertTriangle, Zap, ArrowRight, Play
} from 'lucide-react';

/* ─── SCENARIO DATA ─────────────────────────────────────────── */
const FLOWS = [
  {
    id: 't1',
    trigger: { title: 'Webform Leads', subtitle: 'Inbound Traffic', icon: Globe },
    core: [
      { title: 'Clearbit API', subtitle: 'Data Enrichment', icon: Database },
      { title: 'LLM Engine', subtitle: 'Intent Classify', icon: Bot },
      { title: 'Risk Scorer', subtitle: 'Fraud Eval', icon: ShieldAlert },
    ],
    outputs: ['o1', 'o2'],
    color: 'from-orange-500 to-amber-400',
    glow: 'rgba(249,115,22,0.8)',
    saves: '12 hrs/week'
  },
  {
    id: 't2',
    trigger: { title: 'Email Inbox', subtitle: 'Sales & Support', icon: Mail },
    core: [
      { title: 'Vision AI', subtitle: 'OCR & Parsing', icon: Cpu },
      { title: 'RAG Search', subtitle: 'Context Match', icon: Database },
      { title: 'Sentiment Node', subtitle: 'Urgency Score', icon: Bot },
    ],
    outputs: ['o3', 'o2'],
    color: 'from-blue-500 to-cyan-400',
    glow: 'rgba(6,182,212,0.8)',
    saves: '18 hrs/week'
  },
  {
    id: 't3',
    trigger: { title: 'Support Portal', subtitle: 'Zendesk / Help', icon: LifeBuoy },
    core: [
      { title: 'Data Cleaner', subtitle: 'Normalization', icon: Database },
      { title: 'RAG Search', subtitle: 'Context Match', icon: Cpu },
      { title: 'Human Loop', subtitle: 'Approval Gate', icon: ShieldAlert },
    ],
    outputs: ['o3', 'o4'],
    color: 'from-pink-500 to-rose-400',
    glow: 'rgba(244,114,182,0.8)',
    saves: '22 hrs/week'
  },
  {
    id: 't4',
    trigger: { title: 'CRM Webhook', subtitle: 'State Change', icon: Webhook },
    core: [
      { title: 'Data Cleaner', subtitle: 'Normalization', icon: Database },
      { title: 'Language Detect', subtitle: 'Localization', icon: Bot },
      { title: 'Cost Optimizer', subtitle: 'Rate Limiter', icon: Cpu },
    ],
    outputs: ['o4', 'o5'],
    color: 'from-purple-500 to-indigo-400',
    glow: 'rgba(168,85,247,0.8)',
    saves: '14 hrs/week'
  },
  {
    id: 't5',
    trigger: { title: 'Intercom Chat', subtitle: 'Live Handoff', icon: MessageSquare },
    core: [
      { title: 'Audio Transcribe', subtitle: 'Voice to Text', icon: Cpu },
      { title: 'LLM Engine', subtitle: 'Intent Classify', icon: Bot },
      { title: 'Language Detect', subtitle: 'Localization', icon: Database },
    ],
    outputs: ['o2', 'o5'],
    color: 'from-emerald-500 to-teal-400',
    glow: 'rgba(52,211,153,0.8)',
    saves: '28 hrs/week'
  }
];

const ALL_OUTPUTS = [
  { id: 'o1', title: 'Salesforce', subtitle: 'Create/Update', icon: LayoutDashboard },
  { id: 'o3', title: 'Zendesk', subtitle: 'Ticket Mgmt', icon: Ticket },
  { id: 'o2', title: 'Teams / Slack', subtitle: 'Staff Alerts', icon: Hash },
  { id: 'o4', title: 'Jira Software', subtitle: 'Issue Tracking', icon: CheckSquare },
  { id: 'o5', title: 'PagerDuty', subtitle: 'Sev-1 Page', icon: AlertTriangle }
];

/* ─── CINEMATIC NEURAL CORE ─────────────────────────────────── */
const NeuralCore = ({ activeFlow, status, activeCoreStep }: any) => {
  const isProcessing = status === 'processing' || status === 'outputting';
  const colorClass = activeFlow ? activeFlow.color : 'from-indigo-500/20 to-purple-500/20';
  
  return (
    <div className="relative w-full h-[500px] flex items-center justify-center perspective-[1200px]">
      {/* Cinematic 3D Rotators */}
      <motion.div 
        animate={{ rotateX: [60, 60], rotateZ: [0, 360] }}
        transition={{ duration: isProcessing ? 3 : 15, repeat: Infinity, ease: "linear" }}
        className="absolute w-[360px] h-[360px] rounded-full border border-white/20 border-dashed mix-blend-screen"
        style={{ borderTopColor: 'transparent', borderBottomColor: 'transparent' }}
      />
      <motion.div 
        animate={{ rotateX: [75, 75], rotateZ: [360, 0] }}
        transition={{ duration: isProcessing ? 4 : 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-[450px] h-[450px] rounded-full border-[1px] border-white/10 mix-blend-screen"
      />
      {isProcessing && (
         <motion.div 
           animate={{ rotateX: [0, 180, 360], scale: [1, 1.2, 1] }}
           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
           className={`absolute w-[200px] h-[200px] rounded-full border border-transparent bg-gradient-to-tr ${colorClass} opacity-10 blur-xl`}
         />
      )}
      
      {/* Central Pulsing Plasma Orb */}
      <motion.div 
        className={`absolute w-40 h-40 rounded-full bg-gradient-to-tr ${colorClass} blur-[40px]`}
        animate={{ 
          scale: isProcessing ? [1, 1.5, 1.2] : [1, 1.05, 1],
          opacity: isProcessing ? 0.9 : 0.4 
        }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
      />
      
      {/* Solid HUD Brain */}
      <div className="relative z-10 w-[240px] h-[240px] rounded-full bg-[#050010]/90 backdrop-blur-2xl border border-white/10 shadow-[inset_0_0_80px_rgba(255,255,255,0.05),0_20px_60px_-10px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center overflow-hidden group">
        
        {/* Shimmer sweep */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent -translate-y-[100%] group-hover:translate-y-[100%] transition-transform duration-1000 pointer-events-none" />

        {status === 'idle' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
             <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
               <Zap className="w-6 h-6 text-white/40" />
             </div>
             <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em]">AI Core Offline</p>
             <div className="flex gap-1 mt-4">
                {[1,2,3].map(i => <div key={i} className="w-1 h-3 rounded-full bg-white/10 animate-pulse" style={{ animationDelay: `${i*0.2}s`}} />)}
             </div>
          </motion.div>
        )}

        {(status === 'ingesting' || status === 'processing' || status === 'outputting') && activeFlow && (
          <AnimatePresence mode="wait">
             <motion.div 
               key={activeCoreStep?.title || 'init'}
               initial={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
               animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
               exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
               transition={{ type: "spring", stiffness: 400, damping: 25 }}
               className="flex flex-col items-center text-center px-4 w-full"
             >
                <div className="relative w-16 h-16 mb-4">
                   <div className="absolute inset-0 bg-white/10 rounded-full animate-ping opacity-50" />
                   <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} rounded-full backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_currentColor] text-white`}>
                      {activeCoreStep ? <activeCoreStep.icon className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                   </div>
                </div>
                <h4 className="text-white font-bold text-xl tracking-tight leading-tight w-full truncate">
                   {activeCoreStep ? activeCoreStep.title : 'Data Ingestion...'}
                </h4>
                <p className="text-white/60 font-mono text-[9px] uppercase tracking-[0.2em] mt-2 bg-white/5 px-3 py-1 rounded-full">
                   {activeCoreStep ? activeCoreStep.subtitle : 'Establishing Link'}
                </p>
             </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
};

/* ─── MAIN COMPONENT ──────────────────────────────────────────── */
export default function CinematicWorkflow() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle'|'ingesting'|'processing'|'outputting'>('idle');
  const [coreIndex, setCoreIndex] = useState(0);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const activeFlow = FLOWS.find(f => f.id === activeId);
  const activeCoreStep = activeFlow?.core[coreIndex] || null;

  const triggerFlow = useCallback((id: string) => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    
    setActiveId(id);
    setStatus('ingesting');
    setCoreIndex(0);

    // 1) Wait 1s for "ingesting" animation
    const t1 = setTimeout(() => {
      setStatus('processing');
      // Step through core components rapidly
      const i1 = setTimeout(() => setCoreIndex(1), 1000);
      const i2 = setTimeout(() => setCoreIndex(2), 2000);
      timeouts.current.push(i1, i2);
    }, 1000);

    // 2) Finish processing, fire beams to outputs
    const t2 = setTimeout(() => {
      setStatus('outputting');
    }, 4000);

    // 3) Back to idle
    const t3 = setTimeout(() => {
      setStatus('idle');
      setActiveId(null);
    }, 7000);

    timeouts.current.push(t1, t2, t3);
  }, []);

  useEffect(() => () => timeouts.current.forEach(clearTimeout), []);

  return (
    <section id="workflow" className="relative py-32 bg-[#020008] min-h-screen border-t border-white/5 overflow-hidden flex flex-col justify-center">
      
      {/* ─── MASSIVE CINEMATIC BACKGROUND ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-screen" />
         <div className="absolute top-[30%] -left-[10%] w-[120%] h-[120%] bg-gradient-to-b from-[#1E1B4B]/20 via-[#3B0764]/20 to-[#020008] blur-[150px] animate-pulse rounded-full" style={{ animationDuration: '8s' }} />
         
         {/* Subtle God Rays from Core */}
         {status !== 'idle' && activeFlow && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0 }}
               duration={1}
               className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200px] bg-gradient-to-r from-transparent via-${activeFlow.color.split(' ')[0].replace('from-', '')}/10 to-transparent blur-3xl -rotate-12`}
            />
         )}
      </div>

      <div className="max-w-[1600px] w-full mx-auto px-6 lg:px-12 relative z-10 flex flex-col items-center">
        
        {/* Header Text */}
        <div className="text-center mb-24">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
             <div className="w-2 h-2 rounded-full bg-[#b49bff] animate-pulse" />
             <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/80">Interactive Architecture Matrix</span>
           </div>
           <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1] mb-6">
              The Artificial
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#b49bff] to-[#8B5CF6] filter drop-shadow-[0_0_20px_rgba(180,155,255,0.4)]">
                 Nervous System.
              </span>
           </h2>
           <p className="text-white/40 text-lg font-light max-w-xl mx-auto">
              Command an army of autonomous agents. Select any trigger node below to ignite the pipeline and watch real-time intelligent routing.
           </p>
        </div>

        {/* ─── HOLOGRAPHIC 3-COLUMN THEATER ─── */}
        <div className="relative w-full aspect-[21/9] min-h-[600px] flex items-center justify-between">
            
            {/* SVG Laser Grid Map (Background connections) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.1))' }}>
               {/* Pre-calculate positions: 5 triggers evenly spaced natively by flex, outputs too. 
                   We draw soft bezier curves representing idle state fibers. */}
               {Array.from({length: 5}).map((_, i) => {
                  const y = `${10 + (i * 20)}%`;
                  return (
                     <g key={i}>
                        <path d={`M 20% ${y} C 35% ${y}, 40% 50%, 50% 50%`} stroke="rgba(255,255,255,0.03)" strokeWidth="2" fill="none" />
                        <path d={`M 50% 50% C 60% 50%, 65% ${y}, 80% ${y}`} stroke="rgba(255,255,255,0.03)" strokeWidth="2" fill="none" />
                     </g>
                  )
               })}

               {/* ACTIVE LASER BEAMS */}
               {status !== 'idle' && activeFlow && (
                  <>
                    {/* Left Ingestion Laser */}
                    <path 
                      d={`M 20% ${10 + (FLOWS.findIndex(f => f.id === activeId) * 20)}% C 35% ${10 + (FLOWS.findIndex(f => f.id === activeId) * 20)}%, 40% 50%, 50% 50%`} 
                      stroke="url(#activeGlow)" strokeWidth="4" fill="none"
                      strokeDasharray="1000" strokeDashoffset={status === 'ingesting' ? "0" : "1000"}
                      className="transition-all duration-1000 ease-out"
                    />
                    {/* Right Output Lasers */}
                    {status === 'outputting' && activeFlow.outputs.map(outId => {
                       const outIndex = ALL_OUTPUTS.findIndex(o => o.id === outId);
                       return (
                         <path 
                           key={outId}
                           d={`M 50% 50% C 60% 50%, 65% ${10 + (outIndex * 20)}%, 80% ${10 + (outIndex * 20)}%`} 
                           stroke="url(#activeGlow)" strokeWidth="4" fill="none"
                           strokeDasharray="1000" strokeDashoffset="0"
                           className="animate-[draw_1s_ease-out_forwards]"
                         />
                       )
                    })}
                  </>
               )}
               <defs>
                  <linearGradient id="activeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor={activeFlow ? `var(--tw-gradient-from, #fff)` : "#fff"} />
                     <stop offset="100%" stopColor={activeFlow ? `var(--tw-gradient-to, #fff)` : "#fff"} />
                  </linearGradient>
                  <style>{`@keyframes draw { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }`}</style>
               </defs>
            </svg>

            {/* Col 1: Triggers */}
            <div className="w-[20%] h-full flex flex-col justify-between py-8 relative z-10 perspective-[800px]">
               {FLOWS.map((flow, i) => {
                  const isActive = activeId === flow.id;
                  const isDimmed = status !== 'idle' && !isActive;
                  
                  return (
                    <motion.button 
                       key={flow.id}
                       onClick={() => triggerFlow(flow.id)}
                       whileHover={{ scale: 1.05, rotateY: 5 }}
                       whileTap={{ scale: 0.95 }}
                       className={`w-full text-left relative group rounded-2xl border transition-all duration-500 overflow-hidden backdrop-blur-xl
                         ${isActive ? 'border-transparent shadow-[0_0_40px_rgba(255,255,255,0.2)] bg-white/10' : 'border-white/10 bg-[#090514]/60 hover:bg-white/5 hover:border-white/20'}
                         ${isDimmed ? 'opacity-20 blur-[2px]' : 'opacity-100'}
                       `}
                       style={{ transformStyle: 'preserve-3d' }}
                    >
                       {isActive && (
                         <div className={`absolute inset-0 bg-gradient-to-r ${flow.color} opacity-20 pointer-events-none`} />
                       )}
                       <div className="p-4 flex items-center gap-4 relative z-10">
                          <div className={`w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center shadow-inner transition-colors ${isActive ? `bg-gradient-to-br ${flow.color} border-transparent text-white` : 'bg-white/5 text-white/50 group-hover:text-white'}`}>
                            <flow.trigger.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className={`font-bold tracking-tight text-sm ${isActive ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>{flow.trigger.title}</h4>
                            <p className="text-white/40 text-[10px] font-mono tracking-widest mt-1 uppercase">{flow.trigger.subtitle}</p>
                          </div>
                       </div>
                    </motion.button>
                  )
               })}
            </div>

            {/* Col 2: Neural Core Screen */}
            <div className="w-[40%] flex items-center justify-center relative z-20 pointer-events-none">
               <NeuralCore activeFlow={activeFlow} status={status} activeCoreStep={activeCoreStep} />
            </div>

            {/* Col 3: Outputs */}
            <div className="w-[20%] h-full flex flex-col justify-between py-8 relative z-10 perspective-[800px]">
               {ALL_OUTPUTS.map((output, i) => {
                  const isOutputting = status === 'outputting';
                  const isActiveOutput = isOutputting && activeFlow?.outputs.includes(output.id);
                  const isDimmed = status !== 'idle' && !isActiveOutput;
                  
                  return (
                    <motion.div 
                       key={output.id}
                       className={`w-full relative rounded-2xl border transition-all duration-700 overflow-hidden backdrop-blur-xl
                         ${isActiveOutput ? 'border-transparent bg-white/10' : 'border-white/10 bg-[#090514]/60'}
                         ${isDimmed ? 'opacity-20 blur-[2px]' : 'opacity-100'}
                       `}
                       style={{ transform: isActiveOutput ? 'translateZ(20px)' : 'translateZ(0)', boxShadow: isActiveOutput ? `0 0 50px ${activeFlow?.glow}` : 'none' }}
                    >
                       {isActiveOutput && activeFlow && (
                         <div className={`absolute inset-0 bg-gradient-to-r ${activeFlow.color} opacity-30 pointer-events-none animate-pulse`} />
                       )}
                       <div className="p-4 flex items-center gap-4 relative z-10">
                          <div className={`w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center shadow-inner transition-all duration-700 ${isActiveOutput && activeFlow ? `bg-gradient-to-br ${activeFlow.color} border-transparent text-white scale-110` : 'bg-white/5 text-white/50'}`}>
                            <output.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className={`font-bold tracking-tight text-sm ${isActiveOutput ? 'text-white' : 'text-white/80'}`}>{output.title}</h4>
                            <p className="text-white/40 text-[10px] font-mono tracking-widest mt-1 uppercase">{output.subtitle}</p>
                          </div>
                       </div>
                    </motion.div>
                  )
               })}
            </div>
            
        </div>

        {/* ─── Bottom Context Bar ─── */}
        <div className="w-full mt-16 px-8 py-5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-2xl flex items-center justify-between z-20 shadow-[0_40px_100px_rgba(0,0,0,0.8)] max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
             <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${activeFlow ? 'bg-green-400' : 'bg-[#b49bff]'}`} />
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${activeFlow ? 'bg-green-500' : 'bg-[#b49bff]'}`} />
                </span>
                <span className="text-white/60 font-mono text-[11px] tracking-widest uppercase">
                  {status === 'idle' ? 'System Standing By' : `Pipeline ${activeId?.toUpperCase()} Engaged`}
                </span>
             </div>
             {activeFlow && (
               <div className="hidden sm:block w-px h-8 bg-white/10" />
             )}
             {activeFlow && (
               <motion.span 
                 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                 className="text-white/80 text-sm font-medium"
               >
                 Labor Reduced: <span className={`text-transparent bg-clip-text bg-gradient-to-r ${activeFlow.color} font-black ml-1`}>{activeFlow.saves}</span>
               </motion.span>
             )}
          </div>
          <a href="#contact" className="group flex items-center justify-center w-12 h-12 rounded-full bg-white text-black hover:bg-[#b49bff] hover:text-white transition-colors">
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

      </div>
    </section>
  );
}
