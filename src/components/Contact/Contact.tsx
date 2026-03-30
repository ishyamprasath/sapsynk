import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import { toast } from "sonner";
import { EarthCanvas } from "./canvas";

// Luxury Floating Input Component
const LuxuryInput = ({
  label, name, type = "text", value, onChange, error, disabled, isTextArea = false
}: {
  label: string, name: string, type?: string, value: string, onChange: any, error: string | null, disabled: boolean, isTextArea?: boolean
}) => {
  const [focused, setFocused] = useState(false);
  const isFilled = value.length > 0;
  const active = focused || isFilled;

  return (
    <div className="relative w-full group mb-8">
      <motion.label
        htmlFor={name}
        initial={false}
        animate={{
          y: active ? -24 : 16,
          scale: active ? 0.85 : 1,
          opacity: active ? 1 : 0.5,
          color: focused ? "#b49bff" : "#ffffff",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute left-0 top-0 origin-top-left pointer-events-none font-medium tracking-wide"
      >
        {label}
      </motion.label>

      {isTextArea ? (
        <textarea
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          rows={3}
          className="w-full bg-transparent border-b-2 border-white/10 text-white py-4 outline-none transition-all duration-300 resize-none font-sans"
          style={{
            borderColor: focused ? '#b49bff' : isFilled ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
            boxShadow: focused ? '0 10px 20px -10px rgba(180, 155, 255, 0.3)' : 'none'
          }}
        />
      ) : (
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          className="w-full bg-transparent border-b-2 border-white/10 text-white py-4 outline-none transition-all duration-300 font-sans"
          style={{
            borderColor: focused ? '#b49bff' : isFilled ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
            boxShadow: focused ? '0 10px 20px -10px rgba(180, 155, 255, 0.3)' : 'none'
          }}
        />
      )}

      {/* Animated Bottom Glow Line */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#b49bff] to-[#8B5CF6]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.4, ease: "circOut" }}
        style={{ transformOrigin: "left" }}
      />

      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
            className="absolute -bottom-6 left-0 text-red-400 text-xs font-mono tracking-wider"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Contact = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [form, setForm] = useState({ name: "", email: "", company: "", industry: "", needs: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null }); // Clear error on typing
  };

  const validateForm = () => {
    const newErrors: Record<string, string | null> = {};
    const email_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (form.name.trim().length < 3) newErrors.name = "Valid name required.";
    if (!form.email.trim().toLowerCase().match(email_regex)) newErrors.email = "Valid email required.";
    if (form.company.trim().length < 2) newErrors.company = "Company required.";
    if (form.industry.trim().length < 2) newErrors.industry = "Industry required.";
    if (form.needs.trim().length < 10) newErrors.needs = "Please detail your requirements.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return false;
    setLoading(true);

    fetch("https://formspree.io/f/xdapedaq", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email.trim().toLowerCase(),
        company: form.company,
        industry: form.industry,
        needs: form.needs,
        additional_message: form.message,
        _subject: `New SapSynk Inquiry: ${form.company} (${form.industry})`
      }),
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Inquiry received. We'll be in touch.");
          setForm({ name: "", email: "", company: "", industry: "", needs: "", message: "" });
        } else {
          throw new Error("Network response was not ok");
        }
      })
      .catch((error) => {
        console.log("[CONTACT_ERROR]: ", error);
        toast.error("Transmission failed. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <section id="contact" className="relative py-32 bg-[#000005] overflow-hidden">

      {/* Structural Lighting */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#b49bff]/5 blur-[200px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#8B5CF6]/5 blur-[200px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 flex flex-col xl:flex-row gap-16 lg:gap-24 items-center">

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex-1 w-full bg-[#030014]/60 backdrop-blur-3xl border border-white/5 p-10 md:p-14 lg:p-16 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
        >
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/5 backdrop-blur-md mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#b49bff] animate-pulse" />
              <p className="text-[10px] font-mono tracking-[0.25em] font-bold uppercase text-white/50">Initiate Sequence</p>
            </div>
            <h3 className="text-5xl md:text-6xl font-['Cabinet_Grotesk'] font-bold text-white tracking-tight leading-[1.1]">
              Automate your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b49bff] to-[#8B5CF6]">future today.</span>
            </h3>
            <p className="mt-6 text-white/50 font-sans text-lg max-w-sm leading-relaxed">
              Partner with us to engineer customized AI infrastructure that continuously scales your operations.
            </p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-x-8">
              <LuxuryInput label="Full Name*" name="name" value={form.name} onChange={handleChange} error={errors.name} disabled={loading} />
              <LuxuryInput label="Work Email*" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} disabled={loading} />
            </div>
            <div className="flex flex-col md:flex-row gap-x-8">
              <LuxuryInput label="Company*" name="company" value={form.company} onChange={handleChange} error={errors.company} disabled={loading} />
              <LuxuryInput label="Industry*" name="industry" value={form.industry} onChange={handleChange} error={errors.industry} disabled={loading} />
            </div>

            <LuxuryInput label="What workflow needs automation?*" name="needs" isTextArea value={form.needs} onChange={handleChange} error={errors.needs} disabled={loading} />
            <LuxuryInput label="Additional Technical Constraints" name="message" isTextArea value={form.message} onChange={handleChange} error={errors.message} disabled={loading} />

            <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
              <p className="text-[10px] uppercase font-mono tracking-widest text-white/30 text-center sm:text-left max-w-[200px]">
                Encrypted transmission via secure tunnel.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="relative group overflow-hidden w-full sm:w-auto px-12 py-5 rounded-full bg-white text-black font-semibold tracking-wide transition-all disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? "Transmitting..." : "Initialize Project"}
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#b49bff] to-[#8B5CF6] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </button>
            </div>
          </form>
        </motion.div>

        {/* 3D Global Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          className="xl:flex-[0.8] w-full h-[500px] xl:h-[700px] relative mt-12 xl:mt-0"
        >
          {/* Decorative UI overlaying the earth */}
          <div className="absolute top-[10%] left-0 z-20 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-3 shadow-2xl">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#22C55E] animate-ping opacity-50" />
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-white/50 uppercase tracking-widest">Global Reach</span>
              <span className="text-white text-xs font-bold font-sans">14 Nodes Active</span>
            </div>
          </div>

          <EarthCanvas />
        </motion.div>

      </div>
    </section>
  );
};
