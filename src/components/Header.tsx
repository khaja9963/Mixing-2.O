import React, { useState } from 'react';
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
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-sm select-none">
      {/* Main Navbar */}
      <div className="w-full px-4 sm:px-6 lg:px-10 py-2.5 sm:py-3 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setIsMobileMenuOpen(false);
              onNavigate('Home');
              onPlayIntro();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className="flex items-center group text-left py-0.5"
          >
            <img 
              src="/logo.png" 
              alt="Clyptus Logo" 
              className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform" 
            />
          </button>
        </div>

        {/* Center Navigation Links (Pill Container on Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100/90 border border-slate-200 shadow-inner">
          {navLinks.map((item) => {
            const link = item.name;
            const isActive = activePage === link;

            return (
              <button
                key={link}
                onClick={() => onNavigate(link)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm font-bold border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {link}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full bg-sky-600" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 3D Services Quick Button (Desktop & Tablet) */}
          {onOpen3dServices && (
            <button
              onClick={onOpen3dServices}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 hover:bg-sky-100 text-xs font-bold transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
              <span>Services</span>
            </button>
          )}

          {/* Quick Studio Toggle on mobile/desktop */}
          <button
            onClick={onToggleCustomizer}
            className="p-2 sm:p-2.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:text-sky-600 transition-all text-xs font-semibold cursor-pointer"
            title="Toggle Studio Controls"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Mobile Hamburger Menu Button (visible below lg) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 hover:bg-slate-200 transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-slate-900" />
            ) : (
              <Menu className="w-5 h-5 text-slate-900" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden w-full border-t border-slate-200/80 bg-white/98 backdrop-blur-2xl px-4 py-5 shadow-2xl animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-65px)] overflow-y-auto">
          {/* Quick Services Banner for Mobile */}
          {onOpen3dServices && (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpen3dServices();
              }}
              className="w-full mb-4 p-3 rounded-2xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 border border-sky-200/80 flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-950 uppercase tracking-tight">Explore 3D Services Universe</div>
                  <div className="text-[11px] text-slate-500 font-medium">SAP, AI Solutions & IT Recruiting</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-sky-600 group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          {/* Navigation Links Grid */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {navLinks.map((item) => {
              const link = item.name;
              const Icon = item.icon;
              const isActive = activePage === link;

              return (
                <button
                  key={link}
                  onClick={() => handleMobileNav(link)}
                  className={`flex items-center gap-2.5 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-500/25 border border-sky-500'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="truncate">{link}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom Actions in Mobile Menu */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onToggleCustomizer();
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200"
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
        </div>
      )}
    </header>
  );
};


