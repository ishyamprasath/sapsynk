import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { NAV_LINKS } from "@/constants";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header 
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 will-change-[background,backdrop-filter,border,height] ${
        scrolled 
          ? "h-[70px] bg-[#030014]/60 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]" 
          : "h-[100px] bg-transparent border-b border-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
       <div className="w-full h-full max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12">
        
        {/* Logo */}
        <a href="#about-me" className="flex items-center group">
          <span className="text-3xl font-['Grand_Hotel'] text-[#F5F0E8] tracking-widest group-hover:text-white transition-colors duration-500">
            Sap<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b49bff] to-[#8B5CF6]">synk</span>
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#b49bff] animate-pulse ml-2 shadow-[0_0_10px_#b49bff]" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.title}
                href={link.link}
                className="relative text-sm font-medium text-white/60 hover:text-white transition-colors duration-300 group py-2"
              >
                {link.title}
                {/* Underline effect */}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#b49bff] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
              </a>
            ))}
          </div>

          <a
            href="#contact"
            className="group relative px-6 py-2.5 rounded-full overflow-hidden border border-white/10 bg-white/5 hover:border-[#b49bff]/50 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#b49bff]/20 to-[#8B5CF6]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 text-sm font-semibold text-white tracking-wide">
              Book a Call <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
            </span>
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col items-end justify-center gap-1.5 w-8 h-8 z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className={`h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'w-6 rotate-45 translate-y-2' : 'w-8'}`} />
          <span className={`h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'w-0 opacity-0' : 'w-6'}`} />
          <span className={`h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-4'}`} />
        </button>

      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 top-[70px] bg-[#030014]/95 backdrop-blur-3xl flex flex-col items-center pt-20 md:hidden border-t border-white/5"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="flex flex-col items-center gap-8 w-full px-6">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.title}
                  href={link.link}
                  className="text-2xl font-light text-white/70 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {link.title}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                className="mt-8 px-8 py-4 w-full text-center rounded-full bg-white/10 border border-white/20 text-white font-medium active:bg-white/20"
                onClick={() => setIsMobileMenuOpen(false)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Book a Call ↗
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.header>
  );
};