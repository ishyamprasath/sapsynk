import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useSpring, useTransform, useMotionValue, animate } from 'motion/react';

/* ─── Animated number ───────────────────────────────────────── */
function AnimatedNumber({ value, color }: { value: number; color: string }) {
  const mv = useMotionValue(value);
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const ctrl = animate(mv, value, { duration: 0.5, ease: 'easeOut' });
    const unsub = mv.on('change', (v) => setDisplay(Math.round(v)));
    return () => { ctrl.stop(); unsub(); };
  }, [value, mv]);
  return (
    <span style={{ color }} className="font-[family-name:var(--font-mono)] text-5xl font-bold tabular-nums leading-none">
      {display}
    </span>
  );
}

/* ─── Shared UI Utils ───────────────────────────────────────── */

export default function BeforeAfterSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  /* Spring-backed 0-100 position */
  const rawPct = useMotionValue(50);
  const springPct = useSpring(rawPct, { stiffness: 240, damping: 30, mass: 0.5 });

  /* Derived motion values — no React state needed for visual updates */
  const clipPath   = useTransform(springPct, (v) => `inset(0 0 0 ${v}%)`);
  const lineLeft   = useTransform(springPct, (v) => `${v}%`);
  const handleLeft = useTransform(springPct, (v) => `calc(${v}% - 22px)`);

  /* pct state only for computed numbers */
  const [pct, setPct] = useState(50);
  useEffect(() => springPct.on('change', setPct), [springPct]);

  /* Hours: Automation increases as handle moves LEFT (pct -> 0) */
  const automationRatio = (100 - pct) / 100; // 1.0 when full green, 0.0 when full red
  const manualHours = Math.round(47 - (automationRatio * 45)); // 47 -> 2
  const savedHours = Math.round(automationRatio * 45);         // 0 -> 45

  /* Pointer drag */
  const commit = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawPct.set(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  }, [rawPct]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    commit(e.clientX);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [commit]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    commit(e.clientX);
  }, [commit]);

  const onPointerUp = useCallback(() => { isDragging.current = false; }, []);

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-[0.07]"
             style={{ background: 'radial-gradient(circle, #EF4444 0%, transparent 70%)' }} />
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-[0.07]"
             style={{ background: 'radial-gradient(circle, #22C55E 0%, transparent 70%)' }} />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-[family-name:var(--font-mono)] tracking-[0.3em] uppercase text-[#F5F0E8]/30 mb-3">
            The Transformation
          </p>
          <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-heading)] font-bold text-[#F5F0E8]">
            Drag to see{' '}
            <span className="text-[#b49bff]">the difference</span>
          </h2>
          <p className="text-[#F5F0E8]/35 mt-3 text-sm tracking-widest font-[family-name:var(--font-mono)]">
            ← DRAG THE HANDLE →
          </p>
        </motion.div>

        {/* Stats row — pinned to left and right */}
        <div className="flex items-end justify-between mb-5 px-1">
          <div className="flex flex-col gap-1">
            <AnimatedNumber value={manualHours} color="#EF4444" />
            <span className="text-[#EF4444]/50 text-[10px] font-[family-name:var(--font-mono)] tracking-widest uppercase">
              Manual Hours/wk
            </span>
          </div>

          <motion.div
            className="text-[#b49bff]/50 text-xl font-[family-name:var(--font-mono)]"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            ⟷
          </motion.div>

          <div className="flex flex-col gap-1 items-end">
            <AnimatedNumber value={savedHours} color="#22C55E" />
            <span className="text-[#22C55E]/50 text-[10px] font-[family-name:var(--font-mono)] tracking-widest uppercase">
              Hours Saved/wk
            </span>
          </div>
        </div>

        {/* ── Main slider ── */}
        <motion.div
          ref={containerRef}
          className="relative w-full rounded-3xl overflow-hidden select-none border border-white/10"
          style={{ height: 'clamp(340px, 52vw, 500px)', cursor: 'col-resize', touchAction: 'none' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >

          {/* ══ BEFORE — always full-width underneath ══ */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #1c0404 0%, #0a0202 100%)' }}
          >
            {/* Grid */}
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(239,68,68,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.12) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }} />

            {/* Centered Before content */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col w-full max-w-3xl items-center px-4"
            >
              <p className="text-[#EF4444] font-[family-name:var(--font-heading)] text-lg font-bold mb-6">
                Manual Operations
              </p>

              <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 md:gap-8 w-full">
                
                {/* Left: Unstructured Messy Email */}
                <div className="w-full md:w-5/12 rounded-lg border border-red-500/20 bg-black/60 backdrop-blur-md p-4 relative font-mono text-xs text-[#F5F0E8]/70 flex flex-col">
                  <div className="flex items-center gap-2 mb-3 border-b border-red-500/10 pb-2 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <span className="text-[#EF4444]/60 uppercase tracking-wider text-[9px]">Unstructured Request</span>
                  </div>
                  <p className="leading-relaxed flex-1">
                    Hey team, <br/><br/>
                    Please update the CRM. <span className="bg-red-500/20 text-[#EF4444] px-1 rounded border border-red-500/30">ACME Corp</span> needs their billing changed to <span className="bg-red-500/20 text-[#EF4444] px-1 rounded border border-red-500/30">Net60</span>. Also, their new shipping address is <span className="bg-red-500/20 text-[#EF4444] px-1 rounded border border-red-500/30">123 Main St</span>.
                    <br/><br/>Thanks!
                  </p>
                </div>

                {/* Middle: Human Bottleneck */}
                <div className="flex flex-col items-center justify-center relative w-full md:w-auto my-2 md:my-0">
                   <div className="h-8 md:h-full w-px md:w-[1px] bg-dashed border-l border-red-500/30 border-dashed absolute top-0 bottom-0 left-1/2 md:-left-4 md:right-auto md:top-0 -z-10 hidden md:block" />
                   <div className="px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.15)] backdrop-blur-sm">
                     <div className="w-1.5 h-1.5 rounded-full bg-red-500 border border-red-400 animate-pulse" />
                     <span className="text-[9px] font-mono text-red-500 tracking-widest uppercase">Manual Entry</span>
                   </div>
                </div>

                {/* Right: Empty Database Form */}
                <div className="w-full md:w-5/12 rounded-lg border border-red-500/20 bg-black/60 backdrop-blur-md p-4 relative font-mono text-[10px] flex flex-col">
                  <div className="flex items-center gap-2 mb-3 border-b border-red-500/10 pb-2 shrink-0">
                    <svg className="w-3 h-3 text-red-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                    <span className="text-[#EF4444]/60 uppercase tracking-wider text-[9px]">Target CRM System</span>
                  </div>
                  <div className="space-y-4 text-[#F5F0E8]/40 flex-1">
                    <div className="flex items-center justify-between border-b border-white/5 pb-1">
                      <span>Account Name:</span> <span className="text-red-500/50 italic mr-2">- Empty -</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-1">
                      <span>Billing Terms:</span> <span className="text-red-500/50 italic mr-2">- Empty -</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-1">
                      <span>Shipping Addr:</span> <span className="text-red-500/50 italic mr-2">- Empty -</span>
                    </div>
                  </div>
                </div>

              </div>
              
              <p className="text-[#EF4444]/40 text-[10px] font-mono tracking-widest mt-6 uppercase text-center w-full">
                Fragmented Data • Human Error • High Latency
              </p>
            </div>

            {/* Badge */}
            <div className="absolute top-5 left-5 px-3 py-1.5 rounded-full text-[10px] font-[family-name:var(--font-mono)] tracking-widest uppercase"
                 style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}>
              Without Sync
            </div>
          </div>

          {/* ══ AFTER — clipped panel on top ══ */}
          <motion.div
            className="absolute inset-0"
            style={{
              clipPath,
              background: 'linear-gradient(135deg, #011a07 0%, #010d03 100%)',
            }}
          >
            {/* Grid */}
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(34,197,94,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.12) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }} />

            {/* Centered After content */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col w-full max-w-3xl items-center px-4"
            >
              <div className="flex items-center justify-between w-full max-w-[690px] mb-6">
                <p className="text-[#22C55E] font-[family-name:var(--font-heading)] text-lg font-bold drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]">
                  SapSynk Automation
                </p>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-green-500/10 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                  <span className="text-[9px] font-mono text-[#22C55E] tracking-widest uppercase hidden sm:inline">Live • Synchronized</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 md:gap-8 w-full relative">
                
                {/* Horizontal data traces connecting left to right */}
                <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-[1px] bg-[rgba(180,155,255,0.15)] -z-10 overflow-hidden">
                   <motion.div 
                     className="h-full bg-gradient-to-r from-transparent via-[#b49bff] to-transparent w-full"
                     animate={{ x: ['-100%', '100%'] }}
                     transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                   />
                </div>

                {/* Left: Unstructured Messy Email (Scanned) */}
                <div className="w-full md:w-5/12 rounded-lg border border-[rgba(180,155,255,0.3)] bg-black/40 backdrop-blur-md p-4 relative font-mono text-xs text-[#F5F0E8]/70 shadow-[0_0_20px_rgba(180,155,255,0.05)] flex flex-col">
                  {/* Subtle scanning laser graphic */}
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-[rgba(180,155,255,0.5)]">
                    <motion.div className="h-full bg-white shadow-[0_0_8px_#fff] w-1/4" animate={{ x: ['-100%', '400%'] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }} />
                  </div>
                  
                  <div className="flex items-center justify-between gap-2 mb-3 border-b border-[rgba(180,155,255,0.2)] pb-2 shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#b49bff] shadow-[0_0_10px_#b49bff]" />
                      <span className="text-[#b49bff]/80 uppercase tracking-wider text-[9px]">Ingesting Source</span>
                    </div>
                    <span className="text-[#22C55E] text-[9px] uppercase tracking-widest flex items-center gap-1 font-bold">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> Read
                    </span>
                  </div>
                  <p className="leading-relaxed relative group flex-1">
                    Hey team, <br/><br/>
                    Please update the CRM. <span className="bg-[#b49bff]/20 text-[#b49bff] px-1 rounded shadow-[0_0_8px_rgba(180,155,255,0.3)] font-semibold border border-[#b49bff]/40">ACME Corp</span> needs their billing changed to <span className="bg-[#b49bff]/20 text-[#b49bff] px-1 rounded shadow-[0_0_8px_rgba(180,155,255,0.3)] font-semibold border border-[#b49bff]/40">Net60</span>. Also, their new shipping address is <span className="bg-[#b49bff]/20 text-[#b49bff] px-1 rounded shadow-[0_0_8px_rgba(180,155,255,0.3)] font-semibold border border-[#b49bff]/40">123 Main St</span>.
                    <br/><br/>Thanks!
                  </p>
                </div>

                {/* Middle: SapSynk Neural Engine */}
                <div className="flex flex-col items-center justify-center relative w-full md:w-auto my-2 md:my-0 z-10 transition-transform duration-300 hover:scale-105 cursor-default">
                   <div className="px-5 py-3 rounded-xl bg-[#011a07] border border-[#b49bff] flex flex-col items-center gap-1 shadow-[0_0_30px_rgba(180,155,255,0.2)] backdrop-blur-md relative overflow-hidden">
                     <motion.div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[rgba(180,155,255,0.15)] to-transparent"
                       animate={{ x: ['-200%', '200%'] }}
                       transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                     />
                     <span className="text-[15px] font-[family-name:var(--font-heading)] font-bold text-[#b49bff] tracking-wide relative z-10">SapSynk Engine</span>
                     <span className="text-[7.5px] font-mono text-[#F5F0E8]/70 tracking-[0.2em] uppercase relative z-10">Semantic Neural Router</span>
                   </div>
                </div>

                {/* Right: Perfect Structured JSON Payload */}
                <div className="w-full md:w-5/12 rounded-lg border border-green-500/30 bg-black/40 backdrop-blur-md p-4 relative font-mono text-[10px] shadow-[0_0_20px_rgba(34,197,94,0.08)] flex flex-col">
                  <div className="absolute top-0 right-0 w-full h-[1px] bg-[rgba(34,197,94,0.4)]">
                    <motion.div className="h-full bg-white shadow-[0_0_8px_#fff] w-1/4" animate={{ x: ['400%', '-100%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }} />
                  </div>
                  <div className="flex items-center justify-between gap-2 mb-3 border-b border-green-500/20 pb-2 shrink-0">
                    <div className="flex items-center gap-2">
                      <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                      <span className="text-[#22C55E]/80 uppercase tracking-wider text-[9px]">Structured Payload</span>
                    </div>
                    <span className="text-[#22C55E] text-[9px] uppercase tracking-widest flex items-center gap-1 font-bold">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> Synced
                    </span>
                  </div>
                  <div className="text-[12px] sm:text-[13px] text-[#F5F0E8]/90 overflow-x-auto whitespace-pre leading-relaxed m-0 opacity-95 flex-1 relative font-[family-name:var(--font-mono)]">
                    <span className="text-[#F472B6]">{"{"}</span>{"\n"}
                    {"  "}<span className="text-[#93C5FD]">"accountName"</span><span className="text-[#F5F0E8]/50">:</span> <span className="text-[#86EFAC]">"ACME Corp"</span><span className="text-[#F5F0E8]/50">,</span>{"\n"}
                    {"  "}<span className="text-[#93C5FD]">"billingTerms"</span><span className="text-[#F5F0E8]/50">:</span> <span className="text-[#86EFAC]">"Net60"</span><span className="text-[#F5F0E8]/50">,</span>{"\n"}
                    {"  "}<span className="text-[#93C5FD]">"shippingAddr"</span><span className="text-[#F5F0E8]/50">:</span> <span className="text-[#86EFAC]">"123 Main St"</span>{"\n"}
                    <span className="text-[#F472B6]">{"}"}</span>
                  </div>
                </div>

              </div>
              
              <div className="grid grid-cols-3 gap-8 mt-6 w-full max-w-[500px] text-center border-t border-[rgba(34,197,94,0.15)] pt-5">
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-[#22C55E]/50 tracking-[0.2em] uppercase">Data Accuracy</span>
                  <span className="font-mono text-sm sm:text-base text-[#22C55E] font-bold mt-1">100%</span>
                </div>
                <div className="flex flex-col border-l border-r border-[#22C55E]/20">
                  <span className="text-[9px] font-mono text-[#22C55E]/50 tracking-[0.2em] uppercase">Latency</span>
                  <span className="font-mono text-sm sm:text-base text-[#22C55E] font-bold mt-1">12ms</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-[#22C55E]/50 tracking-[0.2em] uppercase">Manual Touches</span>
                  <span className="font-mono text-sm sm:text-base text-[#22C55E] font-bold mt-1">0</span>
                </div>
              </div>
            </div>

            {/* Badge */}
            <div className="absolute top-5 right-5 px-3 py-1.5 rounded-full text-[10px] font-[family-name:var(--font-mono)] tracking-widest uppercase"
                 style={{ offsetPath: 'none', background: 'rgba(34,197,94,0.12)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.3)' }}>
              SapSynk Unified
            </div>
          </motion.div>

          {/* ── Divider glow line ── */}
          <motion.div
            className="absolute top-0 bottom-0 w-[2px] z-20 pointer-events-none"
            style={{
              left: lineLeft,
              background: 'linear-gradient(180deg, transparent 0%, #b49bff 25%, #b49bff 75%, transparent 100%)',
              boxShadow: '0 0 20px rgba(180,155,255,0.8), 0 0 50px rgba(180,155,255,0.3)',
            }}
          />

          {/* ── Drag handle ── */}
          <motion.div
            className="absolute top-1/2 z-30 flex items-center justify-center rounded-full"
            style={{
              left: handleLeft,
              width: 46,
              height: 46,
              translateY: '-50%',
              background: 'rgba(10,8,28,0.9)',
              backdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(180,155,255,0.6)',
              boxShadow: '0 0 0 6px rgba(180,155,255,0.08), 0 0 28px rgba(180,155,255,0.5)',
            }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Left arrow */}
            <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
              <path d="M5 5H1M1 5L4 2M1 5L4 8" stroke="#b49bff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 5H17M17 5L14 2M17 5L14 8" stroke="#b49bff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>

          {/* ── Pulse hint that fades on first interaction ── */}
          <motion.div
            className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
            animate={{ opacity: [0.6, 0.2, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-[#b49bff]/50 text-[10px] font-[family-name:var(--font-mono)] tracking-[0.4em]">DRAG</span>
          </motion.div>
        </motion.div>

        {/* Savings callout */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
          <p className="text-[#F5F0E8]/40 text-sm font-[family-name:var(--font-mono)]">
            Average team saves{' '}
            <span className="text-[#b49bff]">45 hrs/week</span>
            {' '}with SapSynk automation
          </p>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
        </motion.div>
      </div>
    </section>
  );
}
