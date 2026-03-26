import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';

type LineType = 'cmd' | 'info' | 'success' | 'ai' | 'data' | 'result';

interface TerminalLine {
  type: LineType;
  text: string;
}

const terminalLines: TerminalLine[] = [
  { type: 'cmd',     text: '$ sapsynk run --workflow lead-qualification' },
  { type: 'info',    text: '→ Connecting to CRM...' },
  { type: 'success', text: '✓ Salesforce authenticated' },
  { type: 'info',    text: '→ Pulling 847 unqualified leads...' },
  { type: 'ai',      text: '⟡ AI scoring leads by intent signal...' },
  { type: 'data',    text: '  [██████████████░░░░░░] 72% complete' },
  { type: 'success', text: '✓ 312 high-intent leads identified' },
  { type: 'info',    text: '→ Drafting personalized outreach...' },
  { type: 'ai',      text: '⟡ Generating 312 unique emails via Gemini...' },
  { type: 'success', text: '✓ Campaign queued. Est. manual time saved: 38hrs' },
  { type: 'result',  text: '$ _' },
];

const colorMap: Record<LineType, string> = {
  cmd:     '#b49bff',
  info:    'rgba(245,240,232,0.5)',
  success: '#22C55E',
  ai:      '#8B5CF6',
  data:    '#FBBF24',
  result:  '#b49bff',
};

const CHAR_DELAY_MS = 18;
const LINE_PAUSE_MS = 400;

interface Props {
  onComplete?: () => void;
}

export default function TerminalAnimation({ onComplete }: Props) {
  const [displayLines, setDisplayLines] = useState<Array<{ type: LineType; text: string }>>([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [currentCharIdx, setCurrentCharIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [replaying, setReplaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const reset = useCallback(() => {
    setDisplayLines([]);
    setCurrentLineIdx(0);
    setCurrentCharIdx(0);
    setDone(false);
    setReplaying(true);
    setTimeout(() => setReplaying(false), 100);
  }, []);

  useEffect(() => {
    if (replaying) return;
    if (done) return;
    if (currentLineIdx >= terminalLines.length) {
      setDone(true);
      onComplete?.();
      return;
    }

    const line = terminalLines[currentLineIdx];
    const targetText = line.text;

    if (currentCharIdx < targetText.length) {
      const timeout = setTimeout(() => {
        setDisplayLines((prevLines) => {
          const updated = [...prevLines];
          const textSoFar = targetText.slice(0, currentCharIdx + 1);
          if (updated[currentLineIdx] === undefined) {
            updated[currentLineIdx] = { type: line.type, text: textSoFar };
          } else {
            updated[currentLineIdx] = { ...updated[currentLineIdx], text: textSoFar };
          }
          return updated;
        });
        setCurrentCharIdx((prev) => prev + 1);
      }, CHAR_DELAY_MS);

      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLineIdx((prev) => prev + 1);
        setCurrentCharIdx(0);
      }, LINE_PAUSE_MS);

      return () => clearTimeout(timeout);
    }
  }, [currentLineIdx, currentCharIdx, replaying, done, onComplete]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayLines]);

  return (
    <div
      className="relative w-full h-full flex flex-col rounded-2xl overflow-hidden border border-white/10"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' }}
    >
      {/* Terminal chrome */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b border-white/10 shrink-0"
        style={{ background: 'rgba(255,255,255,0.03)' }}
      >
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-3 text-xs font-[family-name:var(--font-mono)] text-white/30 tracking-wider">
          sapsynk — lead-qualification
        </span>
        <button
          onClick={reset}
          className="ml-auto p-1.5 rounded-md text-white/30 hover:text-[#b49bff] hover:bg-white/5 transition-all"
          title="Replay"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Terminal body */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-5 font-[family-name:var(--font-mono)] text-sm leading-relaxed space-y-1"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Display lines */}
        <AnimatePresence initial={false}>
          {displayLines.map((line, idx) => (
            line && (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="whitespace-pre-wrap break-all"
                style={{ color: colorMap[line.type] }}
              >
                {line.text}
                {/* Blinking cursor only on the currently typing line, if not done */}
                {idx === currentLineIdx && !done && (
                  <span className="terminal-cursor" />
                )}
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Final blinking cursor when done */}
        {done && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: '#b49bff' }}
          >
            <span className="terminal-cursor" />
          </motion.div>
        )}
      </div>
    </div>
  );
}
