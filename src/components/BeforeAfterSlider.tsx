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

/* ─── Before app tiles ──────────────────────────────────────── */
const APPS = [
  { emoji: '📧', label: 'Gmail' },
  { emoji: '📊', label: 'Sheets' },
  { emoji: '📝', label: 'Docs' },
  { emoji: '🗓', label: 'Calendar' },
  { emoji: '⏰', label: 'Reminders' },
  { emoji: '📋', label: 'Tasks' },
];

/* ─── After workflow steps ───────────────────────────────────── */
const STEPS = [
  { icon: '📥', label: 'Trigger', color: '#22C55E' },
  { icon: '🤖', label: 'AI Core', color: '#8B5CF6' },
  { icon: '🚀', label: 'Deploy', color: '#22C55E' },
];

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

  /* Hours: before decreases left→right, after increases left→right */
  const beforeHours = Math.round(47 - (pct / 100) * 45);   // 47 → 2
  const afterHours  = Math.max(1, Math.round(47 - beforeHours));

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
            <AnimatedNumber value={beforeHours} color="#EF4444" />
            <span className="text-[#EF4444]/50 text-[10px] font-[family-name:var(--font-mono)] tracking-widest uppercase">
              hrs/wk · without AI
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
            <AnimatedNumber value={afterHours} color="#22C55E" />
            <span className="text-[#22C55E]/50 text-[10px] font-[family-name:var(--font-mono)] tracking-widest uppercase">
              hrs/wk · with SapSynk
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

            {/*
              ✅ KEY FIX: content pinned to LEFT QUARTER so it never overlaps "after" content.
              Using absolute positioning at 25% of width.
            */}
            <div
              className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: '12%', width: '38%' }}
            >
              {/* Emoji + label */}
              <motion.div
                className="text-6xl mb-5"
                animate={{ rotate: [-4, 4, -4], y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                😩
              </motion.div>
              <p className="text-[#EF4444] font-[family-name:var(--font-heading)] text-lg font-bold mb-5 text-center">
                Before Automation
              </p>

              {/* App chaos grid */}
              <div className="grid grid-cols-3 gap-2.5 mb-5">
                {APPS.map(({ emoji, label }, i) => (
                  <motion.div
                    key={label}
                    animate={{ rotate: [i % 2 === 0 ? -3 : 3, i % 2 === 0 ? 3 : -3, i % 2 === 0 ? -3 : 3], y: [0, -4, 0] }}
                    transition={{ duration: 2.2 + i * 0.35, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
                    className="w-14 h-14 rounded-xl flex flex-col items-center justify-center border gap-0.5"
                    style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.25)' }}
                  >
                    <span className="text-xl">{emoji}</span>
                    <span className="text-[7px] text-[#EF4444]/60 font-[family-name:var(--font-mono)]">{label}</span>
                  </motion.div>
                ))}
              </div>

              <p className="text-[#EF4444]/40 text-[10px] font-[family-name:var(--font-mono)] tracking-widest text-center">
                MANUAL · REPETITIVE · ERROR-PRONE
              </p>
            </div>

            {/* Badge */}
            <div className="absolute top-5 left-5 px-3 py-1.5 rounded-full text-[10px] font-[family-name:var(--font-mono)] tracking-widest uppercase"
                 style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}>
              Without AI
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

            {/*
              ✅ KEY FIX: content pinned to RIGHT QUARTER so it never overlaps "before" content.
            */}
            <div
              className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ right: '12%', width: '38%' }}
            >
              {/* Happy emoji */}
              <motion.div
                className="text-6xl mb-5"
                animate={{ scale: [1, 1.08, 1], rotate: [-2, 2, -2] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                😎
              </motion.div>
              <p className="text-[#22C55E] font-[family-name:var(--font-heading)] text-lg font-bold mb-5 text-center">
                With SapSynk AI
              </p>

              {/* Workflow mini-graph */}
              <svg width="240" height="160" viewBox="0 0 240 160" className="mb-4">
                <defs>
                  <filter id="gGlow" x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Edges */}
                {[
                  { x1: 50, y1: 80, x2: 120, y2: 80 },
                  { x1: 168, y1: 80, x2: 200, y2: 48 },
                  { x1: 168, y1: 80, x2: 200, y2: 80 },
                  { x1: 168, y1: 80, x2: 200, y2: 112 },
                ].map((e, i) => (
                  <g key={i}>
                    <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                          stroke="rgba(34,197,94,0.2)" strokeWidth="1.5" />
                    <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                          stroke="#22C55E" strokeWidth="2" strokeDasharray="7 16" strokeOpacity="0.7">
                      <animate attributeName="stroke-dashoffset" from="23" to="0"
                               dur={`${1 + i * 0.2}s`} repeatCount="indefinite" />
                    </line>
                    <circle r="4" fill="#22C55E" filter="url(#gGlow)">
                      <animateMotion dur={`${1.2 + i * 0.3}s`} begin={`${i * 0.35}s`}
                                     repeatCount="indefinite" path={`M ${e.x1} ${e.y1} L ${e.x2} ${e.y2}`} />
                    </circle>
                  </g>
                ))}

                {/* Trigger node */}
                <rect x={5} y={62} width={68} height={36} rx={8}
                      fill="rgba(34,197,94,0.1)" stroke="rgba(34,197,94,0.4)" strokeWidth="1.2" />
                <text x={39} y={81} textAnchor="middle" fontSize="9" fill="#22C55E" fontFamily="monospace">Trigger</text>
                <text x={39} y={93} textAnchor="middle" fontSize="8" fill="rgba(34,197,94,0.55)" fontFamily="monospace">Event</text>

                {/* AI Core */}
                <circle cx={144} cy={80} r={24} fill="rgba(34,197,94,0.12)" stroke="#22C55E" strokeWidth="1.5">
                  <animate attributeName="r" values="24;28;24" dur="2.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0.5;1" dur="2.2s" repeatCount="indefinite" />
                </circle>
                <circle cx={144} cy={80} r={18} fill="rgba(34,197,94,0.15)" stroke="#22C55E" strokeWidth="1.2" />
                <text x={144} y={77} textAnchor="middle" fontSize="10" fill="#22C55E" fontFamily="monospace" fontWeight="700">AI</text>
                <text x={144} y={89} textAnchor="middle" fontSize="7" fill="rgba(34,197,94,0.6)" fontFamily="monospace">Core</text>

                {/* Outputs */}
                {(['Notify', 'CRM', 'Book']).map((lbl, i) => (
                  <g key={lbl}>
                    <rect x={195} y={34 + i * 32} width={40} height={22} rx={6}
                          fill="rgba(34,197,94,0.09)" stroke="rgba(34,197,94,0.35)" strokeWidth="1" />
                    <text x={215} y={49 + i * 32} textAnchor="middle" fontSize="8" fill="#22C55E" fontFamily="monospace">{lbl}</text>
                  </g>
                ))}
              </svg>

              <p className="text-[#22C55E]/40 text-[10px] font-[family-name:var(--font-mono)] tracking-widest text-center">
                AUTOMATED · INSTANT · ZERO ERRORS
              </p>
            </div>

            {/* Badge */}
            <div className="absolute top-5 right-5 px-3 py-1.5 rounded-full text-[10px] font-[family-name:var(--font-mono)] tracking-widest uppercase"
                 style={{ background: 'rgba(34,197,94,0.12)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.3)' }}>
              With SapSynk
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
