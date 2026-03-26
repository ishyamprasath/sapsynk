export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 py-14 px-6 relative z-10 bg-[#030014]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <span className="text-2xl font-['Grand_Hotel'] text-[#F5F0E8]">
            Sap<span className="text-[#b49bff]">synk</span>
          </span>
          <div className="w-2 h-2 rounded-full bg-[#b49bff] animate-pulse" />
        </div>

        {/* Links */}
        <div className="flex gap-8 text-sm text-[#F5F0E8]/40">
          <a href="#services" className="hover:text-[#b49bff] transition-colors">Services</a>
          <a href="#team" className="hover:text-[#b49bff] transition-colors">Team</a>
          <a href="#contact" className="hover:text-[#b49bff] transition-colors">Contact</a>
        </div>

        {/* Copyright */}
        <div className="text-xs text-[#F5F0E8]/25 font-[family-name:var(--font-mono)]">
          © {year} SapSynk Agency. All rights reserved.
        </div>
      </div>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[1px] bg-gradient-to-r from-transparent via-[#b49bff]/20 to-transparent" />
    </footer>
  );
}
