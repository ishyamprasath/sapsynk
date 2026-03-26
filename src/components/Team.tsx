import { motion } from 'motion/react';
import { Linkedin } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  skills: string[];
  funFact: string;
  emoji: string;
  pattern: string; // SVG pattern name
}

const team: TeamMember[] = [
  {
    name: 'Boobesh',
    role: 'Strategy Leader',
    skills: ['Business Strategy', 'Product Vision', 'Client Relations'],
    funFact: 'Closed 3 enterprise deals before his morning coffee ☕',
    emoji: '🧭',
    pattern: 'hexagon',
  },
  {
    name: 'Haresh',
    role: 'Automation Specialist',
    skills: ['n8n / Make', 'API Integration', 'Workflow Design'],
    funFact: 'Automated 97% of his own job tasks on day one 🤖',
    emoji: '⚡',
    pattern: 'dots',
  },
  {
    name: 'Eahiya',
    role: 'Data Scientist',
    skills: ['ML Models', 'Data Pipelines', 'Predictive Analytics'],
    funFact: 'Can spot data anomalies that even charts miss 📊',
    emoji: '🔬',
    pattern: 'circuit',
  },
  {
    name: 'Shyam',
    role: 'AI Engineer',
    skills: ['LLM Integration', 'Gemini API', 'Vector Databases'],
    funFact: 'Ships production models faster than most debug dev environments 🚀',
    emoji: '🧠',
    pattern: 'wave',
  },
];

function GeometricPattern({ pattern, color }: { pattern: string; color: string }) {
  const opacity = 0.15;
  if (pattern === 'hexagon') {
    return (
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {[0,1,2].map((row) =>
          [0,1,2].map((col) => (
            <polygon
              key={`${row}-${col}`}
              points="30,0 60,17 60,53 30,70 0,53 0,17"
              transform={`translate(${col * 72 - 20}, ${row * 60 - 10})`}
              fill="none"
              stroke={color}
              strokeWidth="1"
              opacity={opacity}
            />
          ))
        )}
      </svg>
    );
  }
  if (pattern === 'dots') {
    return (
      <svg className="absolute inset-0 w-full h-full">
        {Array.from({ length: 25 }).map((_, i) => (
          <circle key={i} cx={(i % 5) * 45 + 20} cy={Math.floor(i / 5) * 45 + 20} r="2" fill={color} opacity={opacity} />
        ))}
      </svg>
    );
  }
  if (pattern === 'circuit') {
    return (
      <svg className="absolute inset-0 w-full h-full">
        <path d="M20,40 H80 V80 H140 V40 H200" stroke={color} strokeWidth="1" fill="none" opacity={opacity} />
        <path d="M40,20 V100 M100,20 V60 M160,40 V100" stroke={color} strokeWidth="1" fill="none" opacity={opacity} />
        {[40, 100, 160].map((x) => [40, 80].map((y) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill={color} opacity={opacity * 1.5} />
        )))}
      </svg>
    );
  }
  // wave
  return (
    <svg className="absolute inset-0 w-full h-full">
      {[20,50,80,110].map((y, i) => (
        <path
          key={i}
          d={`M0,${y} Q50,${y - 20} 100,${y} Q150,${y + 20} 200,${y}`}
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity={opacity}
        />
      ))}
    </svg>
  );
}

const memberColors = ['#b49bff', '#8B5CF6', '#F97316', '#22C55E'];

function TeamCard({ member, color }: { member: TeamMember; color: string }) {
  return (
    <div className="team-card-wrapper h-[340px]">
      <div className="team-card-inner h-full">
        {/* FRONT */}
        <div
          className="team-card-front absolute inset-0 rounded-2xl border border-white/8 overflow-hidden flex flex-col items-center justify-center p-8 text-center"
          style={{ background: '#0f0f0f' }}
        >
          <GeometricPattern pattern={member.pattern} color={color} />
          <div className="relative z-10">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-6 mx-auto"
              style={{ background: `${color}15`, border: `1px solid ${color}30` }}
            >
              {member.emoji}
            </div>
            <h3 className="text-xl font-[family-name:var(--font-heading)] font-bold text-[#F5F0E8] mb-1">
              {member.name}
            </h3>
            <p className="text-sm font-[family-name:var(--font-mono)]" style={{ color }}>
              {member.role}
            </p>
            <p className="text-xs text-[#F5F0E8]/30 mt-4">Hover to see more →</p>
          </div>
        </div>

        {/* BACK */}
        <div
          className="team-card-back rounded-2xl border border-white/8 overflow-hidden p-6 flex flex-col justify-center"
          style={{ background: `linear-gradient(135deg, #0f0f0f, ${color}08)` }}
        >
          <div className="text-2xl mb-4">{member.emoji}</div>
          <h3 className="text-lg font-[family-name:var(--font-heading)] font-bold text-[#F5F0E8] mb-1">
            {member.name}
          </h3>
          <p className="text-xs font-[family-name:var(--font-mono)] mb-4" style={{ color }}>
            {member.role}
          </p>

          <div className="space-y-2 mb-5">
            {member.skills.map((skill) => (
              <div key={skill} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                <span className="text-[#F5F0E8]/70">{skill}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-[#F5F0E8]/40 italic leading-relaxed mb-4">
            "{member.funFact}"
          </p>

          <a
            href="#"
            className="flex items-center gap-2 text-xs font-medium transition-colors hover:text-[#F5F0E8]"
            style={{ color }}
          >
            <Linkedin className="w-4 h-4" /> Connect on LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Team() {
  return (
    <section id="team" className="py-28 px-6 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-[family-name:var(--font-mono)] tracking-[0.3em] uppercase text-[#F5F0E8]/30 mb-3">
            The Builders
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-[family-name:var(--font-heading)] font-bold text-[#F5F0E8]"
          >
            The team behind{' '}
            <span className="text-[#b49bff]">the automation</span>
          </motion.h2>
          <p className="mt-4 text-[#F5F0E8]/40 text-sm">Hover each card to learn more</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <TeamCard member={member} color={memberColors[i]} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
