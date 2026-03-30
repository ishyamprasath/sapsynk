import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#workflow', label: 'Workflow' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-[9990] flex items-center justify-between px-6 py-4 transition-all duration-300 ${
        scrolled
          ? 'glass border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      {/* Logo */}
      <a href="#" className="flex items-center gap-2 group">
        <span className="text-2xl font-['Grand_Hotel'] text-[#F5F0E8] tracking-wide">
          Sap<span className="text-[#b49bff]">synk</span>
        </span>
        <div className="w-2 h-2 rounded-full bg-[#b49bff] animate-pulse" />
      </a>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-[#F5F0E8]/60 hover:text-[#b49bff] transition-colors duration-200 tracking-wide"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* CTA */}
      <div className="hidden md:flex items-center">
        <motion.a
          href="#contact"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="px-5 py-2.5 rounded-full border border-[#b49bff]/30 text-[#b49bff] text-sm font-medium
                     hover:bg-[#b49bff]/10 transition-all duration-200 font-[family-name:var(--font-body)]"
        >
          Book a Call ↗
        </motion.a>
      </div>

      {/* Mobile menu toggle */}
      <button
        className="md:hidden text-[#F5F0E8] p-2"
        onClick={() => setMenuOpen((p) => !p)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 glass border-b border-white/5 p-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-[#F5F0E8]/70 hover:text-[#b49bff] transition-colors text-lg"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="mt-2 px-5 py-3 rounded-full border border-[#b49bff]/30 text-[#b49bff] text-center font-medium"
            >
              Book a Call ↗
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
