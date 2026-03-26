import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, ArrowRight } from 'lucide-react';

/* ─── Types ─────────────────────────────────────────────────── */
type NodeKind = 'trigger' | 'process' | 'output';

interface WFNode {
  id: string;
  label: string[];
  kind: NodeKind;
  expandedX: number;
  collapsedX?: number;
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
  // Triggers (Col 1: expandedX=30)
  { id: 't1', label: ['Webform Leads', 'Inbound Traffic'], kind: 'trigger', expandedX: 30, collapsedX: 270, y: 20 },
  { id: 't2', label: ['Email Inbox', 'Sales & Support'],   kind: 'trigger', expandedX: 30, collapsedX: 270, y: 95 },
  { id: 't3', label: ['Support Portal', 'Zendesk / Help'], kind: 'trigger', expandedX: 30, collapsedX: 270, y: 170 },
  { id: 't4', label: ['CRM Webhook', 'State Change'],      kind: 'trigger', expandedX: 30, collapsedX: 270, y: 245 },
  { id: 't5', label: ['Intercom Chat', 'Live Agent Handoff'], kind: 'trigger', expandedX: 30, collapsedX: 270, y: 320 },

  // Ingestion (Col 2: expandedX=190)
  { id: 'i1', label: ['Clearbit API', 'Data Enrichment'],  kind: 'process', expandedX: 190, y: 60 },
  { id: 'i2', label: ['Vision AI', 'OCR & Parsing'],       kind: 'process', expandedX: 190, y: 140 },
  { id: 'i3', label: ['Data Cleaner', 'Normalization'],    kind: 'process', expandedX: 190, y: 220 },
  { id: 'i4', label: ['Audio Transcribe', 'Voice to Text'],kind: 'process', expandedX: 190, y: 300 },

  // AI (Col 3: expandedX=350)
  { id: 'c1', label: ['LLM Engine', 'Intent Classify'],    kind: 'process', expandedX: 350, y: 60 },
  { id: 'c2', label: ['RAG Search', 'Context Match'],      kind: 'process', expandedX: 350, y: 140 },
  { id: 'c3', label: ['Sentiment Node', 'Urgency Score'],  kind: 'process', expandedX: 350, y: 220 },
  { id: 'c4', label: ['Language Detect', 'Localization'],  kind: 'process', expandedX: 350, y: 300 },

  // Logic (Col 4: expandedX=510)
  { id: 'l1', label: ['Risk Scorer', 'Fraud Eval'],        kind: 'process', expandedX: 510, y: 60 },
  { id: 'l2', label: ['Logic Router', 'Condition Rules'],  kind: 'process', expandedX: 510, y: 140 },
  { id: 'l3', label: ['Human Loop', 'Approval Gate'],      kind: 'process', expandedX: 510, y: 220 },
  { id: 'l4', label: ['Cost Optimizer', 'Rate Limiter'],   kind: 'process', expandedX: 510, y: 300 },

  // Outputs (Col 5: expandedX=670)
  { id: 'o1', label: ['Salesforce', 'Create / Update'],    kind: 'output',  expandedX: 670, collapsedX: 430, y: 20 },
  { id: 'o2', label: ['Zendesk', 'Ticket Mgmt'],           kind: 'output',  expandedX: 670, collapsedX: 430, y: 95 },
  { id: 'o3', label: ['Teams / Slack', 'Staff Alerts'],    kind: 'output',  expandedX: 670, collapsedX: 430, y: 170 },
  { id: 'o4', label: ['Jira Software', 'Issue Tracking'],  kind: 'output',  expandedX: 670, collapsedX: 430, y: 245 },
  { id: 'o5', label: ['PagerDuty', 'Sev-1 Page'],          kind: 'output',  expandedX: 670, collapsedX: 430, y: 320 },
];

const EDGES: WFEdge[] = [
  // T -> I
  { from: 't1', to: 'i1' }, { from: 't1', to: 'i3' },
  { from: 't2', to: 'i2' }, { from: 't2', to: 'i1' },
  { from: 't3', to: 'i3' }, { from: 't3', to: 'i2' },
  { from: 't4', to: 'i3' }, { from: 't4', to: 'i4' },
  { from: 't5', to: 'i4' }, { from: 't5', to: 'i3' },

  // I -> C
  { from: 'i1', to: 'c1' }, { from: 'i1', to: 'c2' },
  { from: 'i2', to: 'c2' }, { from: 'i2', to: 'c3' },
  { from: 'i3', to: 'c2' }, { from: 'i3', to: 'c3' }, { from: 'i3', to: 'c4' },
  { from: 'i4', to: 'c1' }, { from: 'i4', to: 'c4' },

  // C -> L
  { from: 'c1', to: 'l1' }, { from: 'c1', to: 'l2' },
  { from: 'c2', to: 'l2' }, { from: 'c2', to: 'l3' },
  { from: 'c3', to: 'l3' }, { from: 'c3', to: 'l4' },
  { from: 'c4', to: 'l4' },

  // C -> C (Internal Logic jumps)
  { from: 'c1', to: 'c2' }, { from: 'c3', to: 'c4' },

  // L -> O
  { from: 'l1', to: 'o1' }, { from: 'l1', to: 'o3' },
  { from: 'l2', to: 'o1' }, { from: 'l2', to: 'o2' }, { from: 'l2', to: 'o3' },
  { from: 'l3', to: 'o2' }, { from: 'l3', to: 'o4' },
  { from: 'l4', to: 'o4' }, { from: 'l4', to: 'o5' },
];

/* Cascading active node set for each trigger */
const FLOW_NODES: Record<string, string[]> = {
  // Webform Leads -> Enrichment -> Intent -> Risk/Router -> Salesforce & Slack
  t1: ['t1', 'i1', 'c1', 'l1', 'l2', 'o1', 'o3'],
  
  // Email Inbox -> Parsing -> RAG/Sentiment -> Router -> Zendesk & Slack
  t2: ['t2', 'i2', 'c2', 'c3', 'l2', 'l3', 'o2', 'o3'],
  
  // Support Portal -> Cleaner -> RAG/Sentiment -> Human Loop -> Zendesk & Jira
  t3: ['t3', 'i3', 'c2', 'c3', 'l3', 'o2', 'o4'],
  
  // CRM Webhook -> Cleaner -> Lang Detect -> Cost Optimizer -> Jira & PagerDuty
  t4: ['t4', 'i3', 'c4', 'l4', 'o4', 'o5'],
  
  // Intercom Chat -> Audio Transcribe -> Intent/Lang Detect -> Cost Optimizer -> PagerDuty & Slack
  t5: ['t5', 'i4', 'c1', 'c4', 'l2', 'l4', 'o3', 'o5']
};

const FLOW_EDGES: Record<string, Array<[string, string]>> = {
  t1: [['t1','i1'], ['i1','c1'], ['c1','l1'], ['c1','l2'], ['l1','o1'], ['l2','o3']],
  t2: [['t2','i2'], ['i2','c2'], ['i2','c3'], ['c2','l2'], ['c3','l3'], ['l2','o2'], ['l3','o3']],
  t3: [['t3','i3'], ['i3','c2'], ['i3','c3'], ['c2','l3'], ['c3','l3'], ['l3','o2'], ['l3','o4']],
  t4: [['t4','i3'], ['i3','c4'], ['c4','l4'], ['l4','o4'], ['l4','o5']],
  t5: [['t5','i4'], ['i4','c1'], ['i4','c4'], ['c1','l2'], ['c4','l4'], ['l2','o3'], ['l4','o5']],
};

const TRIGGER_LABELS: Record<string, string> = {
  t1: 'Inbound Lead Enrichment & Routing',
  t2: 'Email Triage & AI Escalation',
  t3: 'Automated Support Ticket Resolution',
  t4: 'CRM State Sync & Cross-Platform Alerting',
  t5: 'Voice/Chat Conversational Agent Handoff'
};

/* ─── Helpers ────────────────────────────────────────────────── */
function nodeCenter(id: string) {
  const n = NODES.find((x) => x.id === id)!;
  return { x: n.expandedX + NODE_W / 2, y: n.y + NODE_H / 2 };
}

function edgeKey(e: WFEdge) { return `${e.from}-${e.to}`; }

/* ─── Animated travelling dot on an edge has been removed ────────────────── */

/* ─── Main component ─────────────────────────────────────────── */
export default function WorkflowBuilder() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [flowStatus, setFlowStatus] = useState<'idle' | 'loading' | 'running'>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const triggerFlow = useCallback((id: string) => {
    // Clear any running timers
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];

    setActiveId(id);
    setFlowStatus('loading');

    // 1) Wait 3 seconds for "loading" animation
    const t1 = setTimeout(() => {
      setFlowStatus('running');
    }, 3000);

    // 2) Extended steady flow resetting after 15s
    const t2 = setTimeout(() => {
      setFlowStatus('idle');
      setActiveId(null);
    }, 15000);

    timerRef.current = [t1, t2];
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
            Explore Enterprise{' '}
            <span className="text-[#b49bff]">Workflows</span>
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4 text-[#F5F0E8]/40 text-sm">
            Select a trigger below to expand and simulate the automation pipeline
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
            <style>
              {`
                @keyframes flowDraw {
                  from { stroke-dashoffset: 400; opacity: 0; }
                  to { stroke-dashoffset: 0; opacity: 1; }
                }
                @keyframes fadeEdge {
                  from { opacity: 0; }
                  to { opacity: 0.8; }
                }
              `}
            </style>
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
            {flowStatus === 'running' && EDGES.map((edge) => {
              const a = nodeCenter(edge.from);
              const b = nodeCenter(edge.to);
              const active = isEdgeActive(edge);
              // Slight curve via cubic bezier
              const cx = (a.x + b.x) / 2;
              const d = `M ${a.x} ${a.y} C ${cx} ${a.y}, ${cx} ${b.y}, ${b.x} ${b.y}`;

              function getEdgeDelay(fromId: string) {
                if (fromId.startsWith('t')) return 0.5;
                if (fromId.startsWith('p')) return 1.1;
                if (fromId.startsWith('a')) return 1.7;
                return 0.5;
              }

              return (
                <g key={edgeKey(edge)}>
                  {/* Base connector */}
                  <path
                    d={d}
                    fill="none"
                    stroke={'rgba(255,255,255,0.06)'}
                    strokeWidth={1}
                    markerEnd={'url(#arrowDim)'}
                    style={{
                      animation: 'fadeEdge 1s ease forwards',
                      animationDelay: '0.4s',
                      opacity: 0,
                    }}
                  />
                  {/* Active animated line drawing reveal */}
                  {active && (
                    <path
                      d={d}
                      fill="none"
                      stroke="#b49bff"
                      strokeWidth="2"
                      markerEnd="url(#arrowPurple)"
                      strokeDasharray="400"
                      style={{
                        animation: 'flowDraw 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                        animationDelay: `${getEdgeDelay(edge.from)}s`,
                        opacity: 0,
                      }}
                    />
                  )}
                </g>
              );
            })}

            {/* ── Nodes ── */}
            {NODES.map((node, ni) => {
              const active = isNodeActive(node.id);
              const isTrigger = node.kind === 'trigger';
              const isOutput = node.kind === 'output';
              const isIntermediate = !isTrigger && !isOutput;
              const isExpanded = flowStatus === 'running';
              const isActivelyLoading = flowStatus === 'loading' && activeId === node.id;

              // Position based on expanded state using pure CSS transform for zero-lag
              const targetX = isExpanded ? node.expandedX : (node.collapsedX ?? node.expandedX);
              
              // Opacity logic: 
              // - Collapsed: Intermediate hidden, Triggers/Outputs visible
              // - Expanded: Active nodes fully visible, inactive nodes dimmed to 15%
              const targetOpacity = !isExpanded 
                ? (isIntermediate ? 0 : 1)
                : (active ? 1 : 0.15);

              return (
                <g
                  key={node.id}
                  onClick={() => isTrigger && triggerFlow(node.id)}
                  style={{ 
                    cursor: isTrigger ? 'pointer' : 'default', 
                    pointerEvents: targetOpacity === 0 ? 'none' : 'auto',
                    transform: `translate(${targetX}px, ${node.y}px)`,
                    opacity: targetOpacity,
                    transition: 'transform 1.8s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.8s ease'
                  }}
                >
                  {/* Minimalist Data Trace Schematic */}
                  
                  {/* Subtle bracket frame for active */}
                  {active && (
                    <path 
                      d="M 5 8 L 5 2 L 125 2 L 125 8 M 125 48 L 125 54 L 5 54 L 5 48" 
                      fill="none" 
                      stroke="rgba(180,155,255,0.4)" 
                      strokeWidth="1" 
                    />
                  )}

                  {/* Core logic point */}
                  <circle cx={65} cy={28} r={active ? 3 : 2} fill={active ? '#b49bff' : 'rgba(255,255,255,0.3)'} />
                  
                  {/* Loading Spinner for actively booted trigger */}
                  {isActivelyLoading && (
                    <>
                      <circle cx={65} cy={28} r={14} fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="8 6">
                        <animateTransform attributeName="transform" type="rotate" from="0 65 28" to="360 65 28" dur="1.2s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={65} cy={28} r={18} fill="none" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.6">
                        <animateTransform attributeName="transform" type="rotate" from="360 65 28" to="0 65 28" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <text x={65} y={62} fill="#fbbf24" fontSize="8" textAnchor="middle" fontWeight="bold" fontFamily="var(--font-mono), monospace" letterSpacing="0.05em">
                        AWAITING SYNC...
                        <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
                      </text>
                    </>
                  )}

                  {/* Horizontal data traces leading in/out */}
                  <line 
                    x1={isTrigger ? 65 : 10} x2={60} 
                    y1={28} y2={28} 
                    stroke={active ? '#b49bff' : 'rgba(255,255,255,0.1)'} 
                    strokeWidth="1" 
                  />
                  <line 
                    x1={70} x2={isOutput ? 65 : 120} 
                    y1={28} y2={28} 
                    stroke={active ? '#b49bff' : 'rgba(255,255,255,0.1)'} 
                    strokeWidth="1" 
                  />

                  {/* Text labels floating above and below the trace */}
                  <text 
                    x={65} y={18} 
                    fill={active ? '#fff' : 'rgba(255,255,255,0.5)'} 
                    fontSize="11" 
                    textAnchor="middle" 
                    fontWeight="bold" 
                    fontFamily="var(--font-mono), monospace" 
                    letterSpacing="0.02em"
                  >
                    {node.label[0]}
                  </text>
                  <text 
                    x={65} y={44} 
                    fill={active ? '#b49bff' : 'rgba(255,255,255,0.2)'} 
                    fontSize="9" 
                    textAnchor="middle" 
                    fontFamily="var(--font-mono), monospace"
                  >
                    {node.label[1]}
                  </text>

                  {/* Pulse hint for idle triggers */}
                  {isTrigger && !activeId && (
                    <circle cx={65} cy={28} r={6} fill="none" stroke="#b49bff">
                      <animate attributeName="r" values="4;10;4" dur={`${2 + ni * 0.4}s`} repeatCount="indefinite" />
                      <animate attributeName="opacity" values="1;0;1" dur={`${2 + ni * 0.4}s`} repeatCount="indefinite" />
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
                {/* Clean Status Dot */}
                <span className="relative flex h-2.5 w-2.5 shrink-0 rounded-full bg-[#b49bff]"
                      style={{ boxShadow: '0 0 8px rgba(180,155,255,0.8)' }} />
                <div className="flex-1">
                  <p className="text-[#b49bff] text-sm font-[family-name:var(--font-mono)] font-bold">
                    Running Sequence //
                  </p>
                  <p className="text-[#F5F0E8]/70 text-xs mt-0.5">
                    {TRIGGER_LABELS[activeId]} — Executing real-time sync with API partners...
                  </p>
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
