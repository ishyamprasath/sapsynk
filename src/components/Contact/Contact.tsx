import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import { toast } from "sonner";

import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../../hoc";
import { styles } from "../../styles";
import { slideIn } from "../../utils/motion";

// Contact
export const Contact = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    industry: "",
    needs: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  // handle form change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // validate form on submit
  const validateForm = () => {
    const { name, email, company, industry, needs, message } = form;

    type Current = {
      name: boolean;
      email: boolean;
      company: boolean;
      industry: boolean;
      needs: boolean;
      message: boolean;
    };

    // Error messages
    const nameError = document.querySelector("#name-error")!;
    const emailError = document.querySelector("#email-error")!;
    const companyError = document.querySelector("#company-error")!;
    const industryError = document.querySelector("#industry-error")!;
    const needsError = document.querySelector("#needs-error")!;
    const messageError = document.querySelector("#message-error")!;

    const current: Current = { name: false, email: false, company: false, industry: false, needs: false, message: false };

    // validate name
    if (name.trim().length < 3) {
      nameError.classList.remove("hidden");
      current["name"] = false;
    } else {
      nameError.classList.add("hidden");
      current["name"] = true;
    }

    const email_regex =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // validate email
    if (!email.trim().toLowerCase().match(email_regex)) {
      emailError.classList.remove("hidden");
      current["email"] = false;
    } else {
      emailError.classList.add("hidden");
      current["email"] = true;
    }

    // validate company
    if (company.trim().length < 2) {
      companyError.classList.remove("hidden");
      current["company"] = false;
    } else {
      companyError.classList.add("hidden");
      current["company"] = true;
    }

    // validate industry
    if (industry.trim().length < 2) {
      industryError.classList.remove("hidden");
      current["industry"] = false;
    } else {
      industryError.classList.add("hidden");
      current["industry"] = true;
    }

    // validate needs
    if (needs.trim().length < 10) {
      needsError.classList.remove("hidden");
      current["needs"] = false;
    } else {
      needsError.classList.add("hidden");
      current["needs"] = true;
    }

    // validate message (optional or short is fine since needs covers the bulk, but keeping original length check)
    if (message.trim().length < 5) {
      messageError.classList.remove("hidden");
      current["message"] = false;
    } else {
      messageError.classList.add("hidden");
      current["message"] = true;
    }

    return Object.keys(current).every(
      (k) => current[k as keyof typeof current],
    );
  };

  // handle form submit
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return false;

    setLoading(true);

    const compiledMessage = `
Company: ${form.company}
Industry: ${form.industry}

What they need from us:
${form.needs}

Additional Message:
${form.message}
    `.trim();

    emailjs
      .send(
        (import.meta as any).env.VITE_APP_SERVICE_ID,
        (import.meta as any).env.VITE_APP_TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: "Team",
          from_email: form.email.trim().toLowerCase(),
          to_email: (import.meta as any).env.VITE_APP_EMAILJS_RECIEVER,
          message: compiledMessage,
        },
        (import.meta as any).env.VITE_APP_EMAILJS_KEY,
      )
      .then(() => toast.success("Thanks for reaching out! We'll be in touch."))
      .catch((error) => {
        console.log("[CONTACT_ERROR]: ", error);
        toast.error("Something went wrong.");
      })
      .finally(() => {
        setLoading(false);
        setForm({
          name: "",
          email: "",
          company: "",
          industry: "",
          needs: "",
          message: "",
        });
      });
  };

  return (
    <SectionWrapper idName="contact">
      <div className="xl:mt-12 xl:flex-row flex-col-reverse flex gap-10 overflow-hidden">
        <motion.div
          variants={slideIn("left", "tween", 0.2, 1)}
          className="flex-[0.75] bg-black-100 p-8 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className={styles.sectionSubText}>Let's talk automation</p>
          <h3 className={styles.sectionHeadText}>Contact Us.</h3>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mt-12 flex flex-col gap-8"
          >
            <div className="flex flex-col md:flex-row gap-8">
              {/* Name */}
              <label htmlFor="name" className="flex flex-col flex-1">
                <span className="text-white font-medium mb-4">Your Name*</span>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  disabled={loading}
                  className="bg-transparent py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border border-white/10 font-medium disabled:bg-white/5 disabled:text-white/60 focus:border-[#b49bff]/30 transition-all"
                />
                <span className="text-red-400 mt-2 hidden text-sm" id="name-error">
                  Please enter a valid name.
                </span>
              </label>

              {/* Email */}
              <label htmlFor="email" className="flex flex-col flex-1">
                <span className="text-white font-medium mb-4">Your Email*</span>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@company.com"
                  disabled={loading}
                  className="bg-transparent py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border border-white/10 font-medium disabled:bg-white/5 disabled:text-white/60 focus:border-[#b49bff]/30 transition-all"
                />
                <span className="text-red-400 mt-2 hidden text-sm" id="email-error">
                  Please enter a valid email address.
                </span>
              </label>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Company */}
              <label htmlFor="company" className="flex flex-col flex-1">
                <span className="text-white font-medium mb-4">Company Name*</span>
                <input
                  type="text"
                  name="company"
                  id="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Acme Corp"
                  disabled={loading}
                  className="bg-transparent py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border border-white/10 font-medium disabled:bg-white/5 disabled:text-white/60 focus:border-[#b49bff]/30 transition-all"
                />
                <span className="text-red-400 mt-2 hidden text-sm" id="company-error">
                  Company name is required.
                </span>
              </label>

              {/* Industry */}
              <label htmlFor="industry" className="flex flex-col flex-1">
                <span className="text-white font-medium mb-4">Industry*</span>
                <input
                  type="text"
                  name="industry"
                  id="industry"
                  value={form.industry}
                  onChange={handleChange}
                  placeholder="e.g. Healthcare, E-commerce..."
                  disabled={loading}
                  className="bg-transparent py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border border-white/10 font-medium disabled:bg-white/5 disabled:text-white/60 focus:border-[#b49bff]/30 transition-all"
                />
                <span className="text-red-400 mt-2 hidden text-sm" id="industry-error">
                  Please specify your industry.
                </span>
              </label>
            </div>

            {/* Needs */}
            <label htmlFor="needs" className="flex flex-col">
              <span className="text-white font-medium mb-4">What do you need from us?*</span>
              <textarea
                rows={4}
                name="needs"
                id="needs"
                value={form.needs}
                onChange={handleChange}
                placeholder="We are looking to automate our invoicing workflows and support tickets..."
                disabled={loading}
                className="bg-transparent py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border border-white/10 font-medium disabled:bg-white/5 disabled:text-white/60 disabled:resize-none focus:border-[#b49bff]/30 transition-all text-sm"
              />
              <span className="text-red-400 mt-2 hidden text-sm" id="needs-error">
                Please provide more details on what you need (min 10 characters).
              </span>
            </label>

            {/* Message */}
            <label htmlFor="message" className="flex flex-col">
              <span className="text-white font-medium mb-4">Additional Details*</span>
              <textarea
                rows={4}
                name="message"
                id="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Any other specific constraints, timelines, or tools we should know about..."
                disabled={loading}
                className="bg-transparent py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border border-white/10 font-medium disabled:bg-white/5 disabled:text-white/60 disabled:resize-none focus:border-[#b49bff]/30 transition-all text-sm"
              />
              <span className="text-red-400 mt-2 hidden text-sm" id="message-error">
                Please provide some context.
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              title={loading ? "Sending..." : "Submit Inquiry"}
              className="mt-4 py-4 px-12 outline-none w-full md:w-fit text-[#030014] font-bold rounded-xl bg-[#b49bff] disabled:bg-[#b49bff]/20 disabled:text-white/60 hover:bg-[#c2adff] transition-all self-end"
              style={{ boxShadow: '0 0 20px rgba(180, 155, 255,0.2)' }}
              disabled={loading}
            >
              {loading ? "Sending Inquiry..." : "Submit Inquiry"}
            </button>
          </form>
        </motion.div>

        {/* Earth Model */}
        <motion.div
          variants={slideIn("right", "tween", 0.2, 1)}
          className="xl:flex-1 xl:h-auto md:h-[600px] h-[450px] w-full min-h-[400px]"
        >
          <EarthCanvas />
        </motion.div>
      </div>
    </SectionWrapper>
  );
};
