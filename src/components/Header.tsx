import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sliders, 
  Menu, 
  X, 
  Home, 
  Briefcase, 
  Factory, 
  Info, 
  ShieldCheck, 
  BookOpen, 
  Users, 
  Mail, 
  Sparkles,
  ChevronRight 
} from 'lucide-react';

interface HeaderProps {
  activePage: string;
  onNavigate: (page: string) => void;
  onToggleCustomizer: () => void;
  onPlayIntro: () => void;
  onOpen3dServices?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onNavigate,
  onToggleCustomizer,
  onPlayIntro,
  onOpen3dServices,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', icon: Home },
    { name: 'Projects', icon: Briefcase },
    { name: 'Industries', icon: Factory },
    { name: 'About', icon: Info },
    { name: 'HR Policies', icon: ShieldCheck },
    { name: 'Blogs', icon: BookOpen },
    { name: 'Careers', icon: Users },
    { name: 'Contact', icon: Mail },
  ];

  const handleMobileNav = (pageName: string) => {
    setIsMobileMenuOpen(false);
    onNavigate(pageName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full select-none transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-2xl backdrop-saturate-180 border-b border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)]'
          : 'bg-white/65 backdrop-blur-xl backdrop-saturate-150 border-b border-slate-200/50 shadow-xs'
      }`}
    >
      {/* Subtle Apple Top Specular Ambient Line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none" />

      {/* Main Navbar Container */}
      <div 
        className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-all duration-300 ${
          isScrolled ? 'py-2 sm:py-2.5' : 'py-2.5 sm:py-3.5'
        }`}
      >
        
        {/* Brand Logo with Smooth Spring Hover */}
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setIsMobileMenuOpen(false);
              onNavigate('Home');
              onPlayIntro();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className="flex items-center group text-left py-0.5 cursor-pointer focus:outline-none"
            aria-label="Clyptus Home"
          >
            <img 
              src="/logo.png" 
              alt="Clyptus Logo" 
              className="h-9 sm:h-11 w-auto object-contain transition-transform" 
            />
          </motion.button>
        </div>

        {/* Center Navigation Links (Apple-Style Glassy Pill Dock with Sliding Spring Indicator) */}
        <nav 
          className="hidden lg:flex items-center gap-0.5 p-1 rounded-full bg-slate-200/45 backdrop-blur-xl border border-slate-300/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]"
          onMouseLeave={() => setHoveredLink(null)}
        >
          {navLinks.map((item) => {
            const link = item.name;
            const isActive = activePage === link;
            const isHovered = hoveredLink === link;

            return (
              <button
                key={link}
                onClick={() => onNavigate(link)}
                onMouseEnter={() => setHoveredLink(link)}
                className="relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer focus:outline-none"
              >
                {/* Apple-style sliding active pill */}
                {isActive && (
                  <motion.div
                    layoutId="appleNavActivePill"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    className="absolute inset-0 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] border border-slate-200/90 z-0"
                  />
                )}

                {/* Subtle sliding hover preview pill */}
                {isHovered && !isActive && (
                  <motion.div
                    layoutId="appleNavHoverPill"
                    transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                    className="absolute inset-0 rounded-full bg-white/60 z-0"
                  />
                )}

                <span
                  className={`relative z-10 transition-colors ${
                    isActive
                      ? 'text-slate-900 font-bold'
                      : 'text-slate-600 hover:text-slate-950 font-medium'
                  }`}
                >
                  {link}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Apple-style Iridescent Services Button */}
          {onOpen3dServices && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpen3dServices}
              className="relative group hidden sm:inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white text-xs font-bold shadow-[0_2px_12px_rgba(15,23,42,0.2)] hover:shadow-[0_4px_20px_rgba(56,189,248,0.35)] transition-all overflow-hidden border border-slate-700/60 cursor-pointer"
            >
              {/* Aurora Glow Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/25 via-indigo-500/25 to-purple-500/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <Sparkles className="w-3.5 h-3.5 text-sky-400 group-hover:text-sky-300 animate-pulse relative z-10" />
              <span className="relative z-10 bg-gradient-to-r from-white via-slate-100 to-sky-200 bg-clip-text text-transparent">
                Services
              </span>
            </motion.button>
          )}

          {/* Quick Studio 3D Customizer Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.06, rotate: 15 }}
            whileTap={{ scale: 0.94 }}
            onClick={onToggleCustomizer}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/80 hover:bg-white border border-slate-200/90 text-slate-700 hover:text-sky-600 transition-all shadow-xs flex items-center justify-center cursor-pointer backdrop-blur-md"
            title="Toggle Studio Controls"
            aria-label="Toggle Studio Controls"
          >
            <Sliders className="w-3.5 h-3.5" />
          </motion.button>

          {/* Mobile Glassy Hamburger Menu Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-2xl bg-white/80 hover:bg-white border border-slate-200/80 text-slate-800 shadow-xs backdrop-blur-md transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-5 h-5 text-slate-900" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="w-5 h-5 text-slate-900" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation Drawer with Apple iOS Frosted Glass Sheet Animation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden w-full border-t border-slate-200/70 bg-white/92 backdrop-blur-3xl px-4 py-5 shadow-2xl overflow-hidden max-h-[calc(100vh-65px)] overflow-y-auto"
          >
            {/* Quick 3D Services Banner */}
            {onOpen3dServices && (
              <motion.button
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpen3dServices();
                }}
                className="w-full mb-4 p-3 rounded-2xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 border border-sky-200/80 flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-sm">
                    <Sparkles className="w-4 h-4 animate-spin-slow" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-950 uppercase tracking-tight">Explore 3D Services Universe</div>
                    <div className="text-[11px] text-slate-500 font-medium">SAP, AI Solutions & IT Recruiting</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-sky-600 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            )}

            {/* Navigation Links Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {navLinks.map((item, idx) => {
                const link = item.name;
                const Icon = item.icon;
                const isActive = activePage === link;

                return (
                  <motion.button
                    key={link}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * idx }}
                    onClick={() => handleMobileNav(link)}
                    className={`flex items-center gap-2.5 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
                      isActive
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-500/25 border border-sky-500'
                        : 'bg-slate-50/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span className="truncate">{link}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Bottom Actions in Mobile Menu */}
            <div className="pt-3 border-t border-slate-200/70 flex items-center gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onToggleCustomizer();
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100/90 text-slate-700 hover:text-slate-900 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200"
              >
                <Sliders className="w-3.5 h-3.5 text-sky-600" />
                <span>Studio 3D Controls</span>
              </button>

              <button
                onClick={() => handleMobileNav('Contact')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-950 text-white hover:bg-sky-600 font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact Us</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
