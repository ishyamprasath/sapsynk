import { motion } from 'motion/react';
import { Linkedin } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import React from 'react';

interface TeamMember {
  name: string;
  role: string;
  skills: string[];
  funFact: string;
  emoji: string;
}

const team: TeamMember[] = [
  {
    name: 'Boobesh',
    role: 'Strategy Leader',
    skills: ['Business Strategy', 'Product Vision', 'Client Relations'],
    funFact: 'Closed 3 enterprise deals before his morning coffee ☕',
    emoji: '🧭',
  },
  {
    name: 'Haresh',
    role: 'Automation Specialist',
    skills: ['n8n / Make', 'API Integration', 'Workflow Design'],
    funFact: 'Automated 97% of his own job tasks on day one 🤖',
    emoji: '⚡',
  },
  {
    name: 'Eahiya',
    role: 'Data Scientist',
    skills: ['ML Models', 'Data Pipelines', 'Predictive Analytics'],
    funFact: 'Can spot data anomalies that even charts miss 📊',
    emoji: '🔬',
  },
  {
    name: 'Shyam',
    role: 'AI Engineer',
    skills: ['LLM Integration', 'Gemini API', 'Vector Databases'],
    funFact: 'Ships production models faster than most debug dev environments 🚀',
    emoji: '🧠',
  },
];

const avatars = [
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=256&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=256&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&q=80",
];

const memberColors = ['#b49bff', '#8B5CF6', '#F97316', '#22C55E'];

function TeamCard({ member, color, index }: { member: TeamMember; color: string; index: number }) {
  const LinkedInLink = () => (
    <a
      href="#"
      className="inline-flex items-center gap-2 mt-auto text-sm font-semibold tracking-wide transition-all mx-auto bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full border border-white/10"
      style={{ color: '#F5F0E8', backdropFilter: 'blur(10px)' }}
    >
      <div className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
        <Linkedin className="w-4 h-4" />
      </div>
      <span className="opacity-90 hover:opacity-100">Connect</span>
    </a>
  );

  return (
    <div className="w-full h-[450px] group cursor-pointer perspective-[1500px]">
      <div 
        className="relative w-full h-full transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:[transform:rotateY(180deg)]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        
        {/* ================= FRONT SIDE ================= */}
        <div 
          className="absolute inset-0 w-full h-full rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-end pb-8 shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-white/10"
          style={{ 
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Stunning Large Portrait Background */}
          <div className="absolute inset-0 z-0">
            <img 
              src={avatars[index]} 
              alt={member.name} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
            />
            {/* Dynamic bottom gradient to make text legible */}
            <div 
              className="absolute inset-0 pointer-events-none" 
              style={{
                background: `linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 30%, transparent 60%, rgba(0,0,0,0.4) 100%)`
              }}
            />
            {/* Color tint ambient */}
            <div className="absolute inset-0 mix-blend-overlay opacity-40" style={{ backgroundColor: color }} />
          </div>

          <div 
            className="relative z-10 flex flex-col items-center justify-end w-full px-6"
            style={{ transform: 'translateZ(40px)' }}
          >
            {/* Minimal Role Pill */}
            <div 
              className="px-4 py-1.5 rounded-full text-[10px] font-[family-name:var(--font-mono)] tracking-[0.15em] uppercase font-bold mb-3 backdrop-blur-md"
              style={{ color: '#fff', backgroundColor: `${color}40`, border: `1px solid ${color}60` }}
            >
              {member.role}
            </div>

            <h3 className="text-4xl font-[family-name:var(--font-heading)] font-black text-white mb-6 tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
              {member.name}
            </h3>

            <LinkedInLink />
          </div>
        </div>


        {/* ================= BACK SIDE ================= */}
        <div 
          className="absolute inset-0 w-full h-full rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.8)] border"
          style={{ 
            backgroundColor: '#050508', // very dark solid back
            borderColor: `${color}40`,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Premium Tech Grid / Circuit Board vibe background */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div 
            className="absolute -top-32 -left-32 w-64 h-64 rounded-full blur-[80px] opacity-30"
            style={{ backgroundColor: color }}
          />

          <div 
            className="relative z-10 flex flex-col h-full w-full p-8"
            style={{ transform: 'translateZ(50px)' }}
          >
            {/* Header Identity */}
            <div className="flex items-center gap-4 mb-6">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-white/10 shrink-0"
                style={{ background: `linear-gradient(135deg, ${color}20, transparent)` }}
              >
                {member.emoji}
              </div>
              <div className="flex flex-col">
                <h4 className="text-xl font-[family-name:var(--font-heading)] text-white font-bold tracking-tight">{member.name}</h4>
                <p className="text-xs font-[family-name:var(--font-mono)] opacity-80" style={{ color }}>{member.role}</p>
              </div>
            </div>

            {/* Core Skills - Futuristic Tags */}
            <div className="mb-4">
              <h5 className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-3 font-bold">Domain Expertise</h5>
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill) => (
                  <span 
                    key={skill}
                    className="text-xs px-3 py-1.5 rounded border text-white/90 backdrop-blur-sm"
                    style={{ backgroundColor: `${color}10`, borderColor: `${color}20` }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Memorable Fact */}
            <div className="mb-auto p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <p className="text-sm leading-relaxed text-white/70 italic">
                "{member.funFact}"
              </p>
            </div>

            <div className="pt-6 w-full flex justify-center">
              <LinkedInLink />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Team() {
  return (
    <section id="team" className="py-32 px-6 relative bg-[#030014]">
      {/* Top Border Glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-md mb-6">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <p className="text-xs font-[family-name:var(--font-mono)] tracking-[0.2em] font-bold uppercase text-white/70">
              The Builders
            </p>
          </div>
          <h2 className="text-5xl md:text-7xl font-[family-name:var(--font-heading)] font-black text-white tracking-tight leading-tight">
            The team behind <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b49bff] via-[#8B5CF6] to-[#b49bff] animate-text-gradient bg-[length:200%_auto]">the automation</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8, type: "spring", stiffness: 80 }}
            >
              <TeamCard member={member} color={memberColors[i]} index={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
