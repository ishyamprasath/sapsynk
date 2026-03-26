import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, ArrowRight } from 'lucide-react';

/* ─── Types ─────────────────────────────────────────────────── */
type NodeKind = 'trigger' | 'process' | 'output';

interface WFNode {
  id: string;
  label: string[];
  kind: NodeKind;
  x: number;
  y: number;
}

interface WFEdge {
  from: string;
  to: string;
}

/* ─── Design tokens per kind ────────────────────────────────── */
const KIND: Record<NodeKind, { bg: string; border: string; text: string; glow: string }> = {
  trigger: { bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.55)', text: '#F97316', glow: 'rgba(249,115,22,0.5)' },
  process: { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.55)', text: '#8B5CF6', glow: 'rgba(139,92,246,0.5)' },
  output:  { bg: 'rgba(180,155,255,0.09)', border: 'rgba(180,155,255,0.45)', text: '#b49bff', glow: 'rgba(180,155,255,0.4)' },
};

const NODE_W = 130;
const NODE_H = 56;

/* ─── Graph layout ─────────────────────────────────────────── */
const NODES: WFNode[] = [
  { id: 't1', label: ['New Lead',   'HubSpot'],    kind: 'trigger', x: 60,  y: 50  },
  { id: 't2', label: ['Email',      'Received'],   kind: 'trigger', x: 60,  y: 170 },
  { id: 't3', label: ['Form',       'Submitted'],  kind: 'trigger', x: 60,  y: 290 },
  { id: 'p1', label: ['AI Analyzes','Intent'],     kind: 'process', x: 290, y: 105 },
  { id: 'p2', label: ['Generate',   'Response'],   kind: 'process', x: 290, y: 230 },
  { id: 'o1', label: ['Slack',      'Notify'],     kind: 'output',  x: 530, y: 50  },
  { id: 'o2', label: ['CRM',        'Updated'],    kind: 'output',  x: 530, y: 170 },
  { id: 'o3', label: ['Calendar',   'Booked'],     kind: 'output',  x: 530, y: 290 },
];

const EDGES: WFEdge[] = [
  { from: 't1', to: 'p1' }, { from: 't2', to: 'p1' }, { from: 't3', to: 'p2' },
  { from: 'p1', to: 'o1' }, { from: 'p1', to: 'o2' },
  { from: 'p2', to: 'o2' }, { from: 'p2', to: 'o3' },
];

/* Cascading active node set for each trigger */
const FLOW_NODES: Record<string, string[]> = {
  t1: ['t1', 'p1', 'o1', 'o2'],
  t2: ['t2', 'p1', 'o1', 'o2'],
  t3: ['t3', 'p2', 'o2', 'o3'],
};

const FLOW_EDGES: Record<string, Array<[string, string]>> = {
  t1: [['t1','p1'], ['p1','o1'], ['p1','o2']],
  t2: [['t2','p1'], ['p1','o1'], ['p1','o2']],
  t3: [['t3','p2'], ['p2','o2'], ['p2','o3']],
};

const TRIGGER_LABELS: Record<string, string> = {
  t1: 'New lead detected in HubSpot',
  t2: 'Incoming email received',
  t3: 'Contact form submitted',
};

/* ─── Helpers ────────────────────────────────────────────────── */
function nodeCenter(id: string) {
  const n = NODES.find((x) => x.id === id)!;
  return { x: n.x + NODE_W / 2, y: n.y + NODE_H / 2 };
}

function edgeKey(e: WFEdge) { return `${e.from}-${e.to}`; }

/* ─── Animated travelling dot on an edge ────────────────────── */
function FlowDot({ from, to, delay = 0 }: { from: string; to: string; delay?: number }) {
  const a = nodeCenter(from);
  const b = nodeCenter(to);
  const pathD = `M ${a.x} ${a.y} L ${b.x} ${b.y}`;

  return (
    <circle r={5} fill="#b49bff" filter="url(#glowPurple)">
      <animateMotion
        dur="1.1s"
        begin={`${delay}s`}
        repeatCount="indefinite"
        path={pathD}
        calcMode="spline"
        keySplines="0.4 0 0.6 1"
      />
    </circle>
  );
}

/* ─── Main component ─────────────────────────────────────────── */
export default function WorkflowBuilder() {
  const [activeId, setActiveId]   = useState<string | null>(null);
  const [flowStep, setFlowStep]   = useState(0);   // 0 = idle, 1-3 = wave steps
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const triggerFlow = useCallback((id: string) => {
    // Clear any running timers
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];

    setActiveId(id);
    setFlowStep(1);

    const t1 = setTimeout(() => setFlowStep(2), 1100);
    const t2 = setTimeout(() => setFlowStep(3), 2200);
    const t3 = setTimeout(() => { setActiveId(null); setFlowStep(0); }, 3800);
    timerRef.current = [t1, t2, t3];
  }, []);

  // Clean up on unmount
  useEffect(() => () => timerRef.current.forEach(clearTimeout), []);

  const activeNodes = activeId ? FLOW_NODES[activeId] : [];
  const activeEdgePairs = activeId ? FLOW_EDGES[activeId] : [];

  function isNodeActive(id: string) { return activeNodes.includes(id); }
  function isEdgeActive(e: WFEdge) {
    return activeEdgePairs.some(([f, t]) => f === e.from && t === e.to);
  }

  return (
    <section id="workflow" className="py-28 px-6 relative border-t border-white/5">
      {/* Background ambient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-5"
             style={{ background: 'radial-gradient(ellipse, #8B5CF6 0%, transparent 70%)' }} />
      </div>

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs font-[family-name:var(--font-mono)] tracking-[0.3em] uppercase text-[#F5F0E8]/30 mb-3">
            Interactive Demo
          </p>
          <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-heading)] font-bold text-[#F5F0E8]">
            Click a trigger to{' '}
            <span className="text-[#b49bff]">run the workflow</span>
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4 text-[#F5F0E8]/40 text-sm">
            <Zap className="w-4 h-4 text-[#F97316]" />
            Click any orange node to activate the flow
          </div>
        </motion.div>

        {/* Graph panel */}
        <motion.div
          className="rounded-2xl border border-white/8 relative overflow-hidden"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(24px)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {/* Scanline grid */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />

          <svg
            viewBox="0 0 730 400"
            className="w-full"
            style={{ height: 'clamp(280px, 50vw, 420px)' }}
          >
            <defs>
              <filter id="glowPurple" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glowNode" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <marker id="arrowPurple" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#b49bff" opacity="0.8" />
              </marker>
              <marker id="arrowDim" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="rgba(255,255,255,0.12)" />
              </marker>
            </defs>

            {/* ── Edges ── */}
            {EDGES.map((edge) => {
              const a = nodeCenter(edge.from);
              const b = nodeCenter(edge.to);
              const active = isEdgeActive(edge);
              // Slight curve via cubic bezier
              const cx = (a.x + b.x) / 2;
              const d = `M ${a.x} ${a.y} C ${cx} ${a.y}, ${cx} ${b.y}, ${b.x} ${b.y}`;

              return (
                <g key={edgeKey(edge)}>
                  {/* Base connector */}
                  <path
                    d={d}
                    fill="none"
                    stroke={active ? '#b49bff' : 'rgba(255,255,255,0.08)'}
                    strokeWidth={active ? 2 : 1}
                    markerEnd={active ? 'url(#arrowPurple)' : 'url(#arrowDim)'}
                    style={{ transition: 'stroke 0.4s, stroke-width 0.4s' }}
                  />
                  {/* Active animated texture */}
                  {active && (
                    <path
                      d={d}
                      fill="none"
                      stroke="#b49bff"
                      strokeWidth="2"
                      strokeDasharray="10 22"
                      strokeOpacity="0.5"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="32" to="0"
                        dur="0.9s"
                        repeatCount="indefinite"
                      />
                    </path>
                  )}
                  {/* Travelling glow dot */}
                  {active && (
                    <circle r={5} fill="#b49bff" filter="url(#glowPurple)">
                      <animateMotion
                        dur="1.05s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.4 0 0.6 1"
                      >
                        <mpath href={`#ep-${edgeKey(edge)}`} />
                      </animateMotion>
                    </circle>
                  )}
                  {/* Hidden path element referenced by animateMotion */}
                  <path id={`ep-${edgeKey(edge)}`} d={d} fill="none" stroke="none" />
                </g>
              );
            })}

            {/* ── Nodes ── */}
            {NODES.map((node, ni) => {
              const c = KIND[node.kind];
              const active = isNodeActive(node.id);
              const isTrigger = node.kind === 'trigger';

              return (
                <g
                  key={node.id}
                  onClick={() => isTrigger && triggerFlow(node.id)}
                  style={{ cursor: isTrigger ? 'pointer' : 'default' }}
                >
                  {/* Glow halo when active */}
                  {active && (
                    <rect
                      x={node.x - 6} y={node.y - 6}
                      width={NODE_W + 12} height={NODE_H + 12} rx={16}
                      fill={c.glow}
                      opacity={0.25}
                      filter="url(#glowNode)"
                    >
                      <animate attributeName="opacity" values="0.25;0.5;0.25" dur="1.4s" repeatCount="indefinite" />
                    </rect>
                  )}

                  {/* Node box */}
                  <rect
                    x={node.x} y={node.y}
                    width={NODE_W} height={NODE_H} rx={10}
                    fill={active ? c.border : c.bg}
                    stroke={active ? c.text : c.border}
                    strokeWidth={active ? 2 : 1}
                    style={{ transition: 'all 0.35s ease', filter: active ? `drop-shadow(0 0 10px ${c.glow})` : 'none' }}
                  />

                  {/* Text */}
                  {node.label.map((line, li) => (
                    <text
                      key={li}
                      x={node.x + NODE_W / 2}
                      y={node.y + 21 + li * 15}
                      textAnchor="middle"
                      fontSize="11"
                      fill={active ? '#F5F0E8' : c.text}
                      fontFamily="var(--font-mono), monospace"
                      fontWeight={active ? '600' : '400'}
                      style={{ transition: 'fill 0.3s' }}
                    >
                      {line}
                    </text>
                  ))}

                  {/* Pulse dot for idle triggers */}
                  {isTrigger && !activeId && (
                    <circle cx={node.x + NODE_W - 12} cy={node.y + 12} r={5} fill={c.text}>
                      <animate attributeName="r" values="4;7;4" dur={`${1.4 + ni * 0.3}s`} repeatCount="indefinite" />
                      <animate attributeName="opacity" values="1;0.3;1" dur={`${1.4 + ni * 0.3}s`} repeatCount="indefinite" />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Bottom bar */}
          <div className="border-t border-white/5 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
               style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-sm text-[#F5F0E8]/60">
              <span className="text-[#b49bff]">⟡</span>{' '}
              This workflow saves{' '}
              <span className="text-[#F5F0E8] font-semibold">~12 hrs/week</span>{' '}
              for teams like yours
            </p>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-[#030014] bg-[#b49bff] hover:bg-[#b49bff]/90 transition-colors shrink-0"
            >
              Want this built for you? <ArrowRight className="w-4 h-4" />
            </motion.a>
          </div>
        </motion.div>

        {/* ── Status toast ── */}
        <AnimatePresence>
          {activeId && (
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="mt-6 mx-auto max-w-lg"
            >
              <div className="flex items-center gap-3 rounded-xl px-5 py-4 border"
                   style={{ background: 'rgba(180,155,255,0.08)', borderColor: 'rgba(180,155,255,0.25)' }}>
                {/* Live dot */}
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b49bff] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#b49bff]" />
                </span>
                <div className="flex-1">
                  <p className="text-[#b49bff] text-sm font-[family-name:var(--font-mono)]">
                    Workflow triggered
                  </p>
                  <p className="text-[#F5F0E8]/50 text-xs mt-0.5">
                    {TRIGGER_LABELS[activeId]} — watching data flow in real time
                  </p>
                </div>
                {/* Step indicator */}
                <div className="flex gap-1.5">
                  {[1, 2, 3].map((s) => (
                    <motion.div
                      key={s}
                      className="w-1.5 h-1.5 rounded-full"
                      animate={{ background: flowStep >= s ? '#b49bff' : 'rgba(180,155,255,0.2)' }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA nudge when idle */}
        <AnimatePresence>
          {!activeId && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center mt-6 text-[#F5F0E8]/25 text-xs font-[family-name:var(--font-mono)] tracking-widest"
            >
              ↑ click an orange trigger node to run
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
