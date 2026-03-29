import { useState } from "react";
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

/* --- LEGAL CONTENT --- */
const legalData = {
  privacy: {
    title: "Privacy Policy",
    date: "Last Updated: March 2025",
    content: (
      <div className="space-y-6 text-sm text-white/70 leading-relaxed font-sans">
        <p>At SapSynk, we prioritize the protection of your data. This Privacy Policy outlines our practices regarding the collection, execution, and safeguarding of data across our AI automation infrastructure.</p>
        
        <h4 className="text-white font-semibold text-lg mt-8 mb-4 border-b border-white/10 pb-2">1. Artificial Intelligence Data Processing</h4>
        <p>When utilizing our Document AI, Lead Qualification, or Workflow offerings, data is processed ephemerally. SapSynk does not use client proprietary data to train base foundational models without explicit multi-party consent.</p>
        <ul className="list-disc pl-5 space-y-2 text-white/60">
          <li><strong>Zero-Retention Processing:</strong> PII passed through our API bridges is purged within 72 hours of successful pipeline execution.</li>
          <li><strong>Vendor Compliance:</strong> Underlying LLM providers (Google Gemini, OpenAI, Anthropic) are bound by enterprise strict zero-retention data processing agreements (DPA).</li>
        </ul>

        <h4 className="text-white font-semibold text-lg mt-8 mb-4 border-b border-white/10 pb-2">2. Telemetry and Analytics</h4>
        <p>To provide accurate ROI dashboards and monitoring, we collect anonymized telemetry: workflow execution times, token counts, and error rates. This telemetry contains no underlying user payload data.</p>
        
        <h4 className="text-white font-semibold text-lg mt-8 mb-4 border-b border-white/10 pb-2">3. Voice AI & Conversational Storage</h4>
        <p>For autonomous Voice Agents, call recordings and transcripts are encrypted at rest (AES-256) and stored strictly within your designated cloud bucket (AWS S3, GCP) to maintain your full ownership and compliance with regional audio recording laws.</p>
      </div>
    )
  },
  terms: {
    title: "Terms & Conditions",
    date: "Effective from: Q1 2025",
    content: (
      <div className="space-y-6 text-sm text-white/70 leading-relaxed font-sans">
        <p>These Terms & Conditions govern the usage of SapSynk's bespoke automation implementations and AI agent deployments.</p>

        <h4 className="text-white font-semibold text-lg mt-8 mb-4 border-b border-white/10 pb-2">1. Service Level Agreements (SLA)</h4>
        <p>SapSynk guarantees a 99.9% uptime for fully managed workflow pipelines. Interruption of integrations outside of SapSynk's perimeter (e.g. OpenAI outage, Salesforce API limits) do not qualify for SLA breach credits.</p>

        <h4 className="text-white font-semibold text-lg mt-8 mb-4 border-b border-white/10 pb-2">2. Liability & AI Hallucinations</h4>
        <p>Generative Artificial Intelligence is inherently probabilistic. SapSynk implements rigorous guardrails, but cannot be held liable for edge-case hallucinations or errant categorizations made by autonomous agents. Clients must maintain human-in-the-loop review for critical financial or medical decisions.</p>

        <h4 className="text-white font-semibold text-lg mt-8 mb-4 border-b border-white/10 pb-2">3. Intellectual Property</h4>
        <p>Any custom prompt engineering, workflow logic schemas, and routing architecture developed during the engagement remain the intellectual property of SapSynk unless explicitly transferred via a Master Service Agreement (MSA). The client retains full ownership of all data ingested and outputted.</p>
      </div>
    )
  }
};

export const Footer = () => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);

  // Lock body scroll when modal is open
  if (typeof document !== 'undefined') {
     document.body.style.overflow = activeModal ? 'hidden' : 'unset';
  }

  return (
    <div className="relative w-full overflow-hidden bg-[#000005]">
      
      {/* Aurora Mesh Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden h-full">
         <div className="absolute top-0 right-[10%] w-[800px] h-[800px] bg-[#b49bff]/10 blur-[200px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
         <div className="absolute bottom-[20%] left-[5%] w-[1000px] h-[1000px] bg-[#8B5CF6]/10 blur-[200px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
      </div>

      <div className="w-full relative z-10 p-[15px] max-w-7xl mx-auto">
        
        {/* === MISSION & VISION SECTION === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 pt-32 pb-16 relative">
           {/* Center ambient glow divider */}
           <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-[60%] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
           
           {/* Mission Card */}
           <div className="flex flex-col gap-6 p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl relative group overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#f97316]/10 blur-3xl group-hover:bg-[#f97316]/20 transition-all duration-700 rounded-full" />
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md w-fit shadow-[0_0_20px_rgba(255,255,255,0.02)]">
               <div className="w-1.5 h-1.5 rounded-full bg-[#f97316] animate-pulse" />
               <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/80">Our Mission</span>
             </div>
             <p className="text-2xl md:text-3xl font-light text-white leading-relaxed tracking-tight">
               To execute world-class automation frameworks that scale regional businesses <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">ahead of the local market curve.</span>
             </p>
           </div>

           {/* Vision Card */}
           <div className="flex flex-col gap-6 p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl relative group overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#06b6d4]/10 blur-3xl group-hover:bg-[#06b6d4]/20 transition-all duration-700 rounded-full" />
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md w-fit shadow-[0_0_20px_rgba(255,255,255,0.02)]">
               <div className="w-1.5 h-1.5 rounded-full bg-[#06b6d4] animate-pulse" />
               <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/80">Our Vision</span>
             </div>
             <p className="text-2xl md:text-3xl font-light text-white leading-relaxed tracking-tight">
               Architect the universal standard for autonomous, <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">high-yield Enterprise operations.</span>
             </p>
           </div>
        </div>



        {/* Footer Links & Info */}
        <div className="w-full max-w-7xl mx-auto border-t border-white/10 pt-16 pb-8 flex flex-col items-center">
          <div className="w-full flex flex-col items-center text-center gap-6">
            
            {/* Brand Column */}
            <span className="text-4xl font-['Grand_Hotel'] text-[#F5F0E8] tracking-widest mt-6">
              Sap<span className="text-[#b49bff]">synk</span>
            </span>
            <p className="text-base text-white/40 leading-relaxed font-sans max-w-xl mx-auto">
              Pioneering autonomous business operations through advanced AI, custom workflow engineering, and intelligent data pipelines.
            </p>
          </div>

          <div className="w-full border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] text-white/30 font-mono tracking-wider">
            <div>&copy; {new Date().getFullYear()} SapSynk Inc. All rights reserved.</div>
            <div className="flex gap-6">
              <button onClick={() => setActiveModal('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
              <button onClick={() => setActiveModal('terms')} className="hover:text-white transition-colors">Terms of Service</button>
            </div>
          </div>
        </div>
      </div>

      {/* Extreme Luxury Glassmorphic Legal Modal */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
            />
            
            {/* Modal Content */}
            <motion.div 
              className="relative w-full max-w-4xl max-h-full bg-[#050508]/90 border border-white/10 rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                 <div className="flex items-center gap-4">
                   <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                     <div className="w-2 h-2 rounded-full bg-[#b49bff] animate-pulse" />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold text-white tracking-tight">{legalData[activeModal].title}</h3>
                     <p className="text-xs text-white/40 font-mono mt-1">{legalData[activeModal].date}</p>
                   </div>
                 </div>
                 <button 
                   onClick={() => setActiveModal(null)}
                   className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 text-white/60 hover:text-white transition-all"
                 >
                   <X className="w-5 h-5" />
                 </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 overflow-y-auto scrollbar-hide">
                 <div className="max-w-3xl mx-auto">
                    {legalData[activeModal].content}
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
