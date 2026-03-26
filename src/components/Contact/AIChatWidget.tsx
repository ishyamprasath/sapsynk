import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, AlertCircle } from 'lucide-react';
import { sendMessageToSynk, AI_KEY_AVAILABLE } from '../../utils/gemini';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const OPENING_MESSAGE: Message = {
  role: 'ai',
  text: "Hi! I'm Synk, SapSynk's AI assistant. I'd love to learn about your business so I can connect you with the right team.\n\nWhat's your biggest operational bottleneck right now?",
};

export default function AIChatWidget() {
  const [messages, setMessages] = useState<Message[]>([OPENING_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [done, setDone] = useState(false);
  const [apiError, setApiError] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading || done) return;

    const userMsg: Message = { role: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Build conversation history for Gemini
      const history = messages.map((m) => ({
        role: m.role === 'ai' ? 'model' : 'user' as 'model' | 'user',
        text: m.text,
      }));

      const response = await sendMessageToSynk(history, userMsg.text);
      const aiMsg: Message = { role: 'ai', text: response };
      setMessages((prev) => [...prev, aiMsg]);
      setQuestionCount((prev) => prev + 1);

      // After 3 answers, qualification is complete
      if (questionCount + 1 >= 3) setDone(true);
    } catch {
      setApiError(true);
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: "Sorry, I'm having trouble connecting right now. Please fill out the form below and we'll be in touch within 24 hours!",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!AI_KEY_AVAILABLE) {
    return (
      <div className="p-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-[#F5F0E8]/70">
            AI chat requires a Gemini API key.{' '}
            <span className="text-yellow-400 font-[family-name:var(--font-mono)]">VITE_GEMINI_API_KEY</span>{' '}
            not found in environment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] rounded-2xl border border-white/10 overflow-hidden"
         style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8"
           style={{ background: 'rgba(180, 155, 255,0.04)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
             style={{ background: 'rgba(180, 155, 255,0.15)', border: '1px solid rgba(180, 155, 255,0.3)' }}>
          <Bot className="w-5 h-5 text-[#b49bff]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#F5F0E8]">Synk</p>
          <div className="flex items-center gap-1.5">
            <div className="live-dot" />
            <span className="text-xs text-[#22C55E] font-[family-name:var(--font-mono)]">AI • Online</span>
          </div>
        </div>
        {done && (
          <div className="ml-auto text-xs font-[family-name:var(--font-mono)] text-[#b49bff] px-2 py-1 rounded-full"
               style={{ background: 'rgba(180, 155, 255,0.1)', border: '1px solid rgba(180, 155, 255,0.2)' }}>
            ✓ Qualified
          </div>
        )}
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-5 space-y-4"
        aria-live="polite"
        aria-atomic="false"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'ai' && (
                <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center mt-1"
                     style={{ background: 'rgba(180, 155, 255,0.12)' }}>
                  <Bot className="w-4 h-4 text-[#b49bff]" />
                </div>
              )}
              <div
                className="max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line"
                style={
                  msg.role === 'ai'
                    ? { background: 'rgba(180, 155, 255,0.06)', color: '#F5F0E8', border: '1px solid rgba(180, 155, 255,0.12)' }
                    : { background: 'rgba(139,92,246,0.15)', color: '#F5F0E8', border: '1px solid rgba(139,92,246,0.25)' }
                }
              >
                {msg.text}
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center mt-1"
                     style={{ background: 'rgba(139,92,246,0.15)' }}>
                  <User className="w-4 h-4 text-[#8B5CF6]" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading dots */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5 px-4 py-3 rounded-2xl w-fit"
            style={{ background: 'rgba(180, 155, 255,0.06)', border: '1px solid rgba(180, 155, 255,0.12)' }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-[#b49bff]"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        )}

        {/* Calendly CTA after qualification */}
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center pt-2"
          >
            <a
              href="#contact"
              className="px-6 py-3 rounded-full text-sm font-semibold text-[#030014] bg-[#b49bff]
                         hover:bg-[#b49bff]/90 transition-all"
            >
              📅 Book Your Strategy Call →
            </a>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {!done && !apiError && (
        <div className="px-4 py-4 border-t border-white/8 flex gap-3 items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type your answer..."
            className="flex-1 bg-transparent text-sm text-[#F5F0E8] placeholder:text-[#F5F0E8]/30
                       border border-white/10 rounded-xl px-4 py-2.5 outline-none
                       focus:border-[#b49bff]/30 transition-all font-[family-name:var(--font-body)]"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0
                       disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            style={{ background: 'rgba(180, 155, 255,0.15)', border: '1px solid rgba(180, 155, 255,0.3)', color: '#b49bff' }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
