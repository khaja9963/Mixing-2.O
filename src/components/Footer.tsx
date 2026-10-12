import React from 'react';
import { ClyptusLogo } from './ClyptusLogo';

interface FooterProps {
  onNavigate?: (page: string, sectionId?: string) => void;
  onOpen3dServices?: () => void;
  onOpenResourceModal?: (type: 'privacy' | 'terms' | 'cookies' | 'faqs' | 'insights') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenResourceModal }) => {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 font-sans">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-8 pb-12 border-b border-slate-800">
          
          {/* Column 1: Brand Section */}
          <div className="col-span-2 lg:col-span-1 flex flex-col justify-between mb-2 lg:mb-0">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <ClyptusLogo 
                  theme="dark" 
                  className="h-10 w-auto object-contain" 
                />
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-medium max-w-sm mt-3">
                Delivering enterprise-grade SAP ERP transformation, cutting-edge AI intelligent architectures, and specialized IT talent solutions to power modern global enterprises.
              </p>
            </div>
          </div>

          {/* Column 2: Company */}
          <div>
            <h4 className="text-xs font-mono font-extrabold text-slate-400 uppercase tracking-widest mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <button 
                  onClick={() => {
                    onNavigate?.('About');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('About', 'journey')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Our Journey
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('About', 'leadership')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Leadership / Our Team
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onNavigate?.('Careers');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Careers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onNavigate?.('Projects');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Projects / Case Studies
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onNavigate?.('Contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="text-xs font-mono font-extrabold text-slate-400 uppercase tracking-widest mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <button 
                  onClick={() => {
                    onNavigate?.('SAP');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  SAP Solutions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onNavigate?.('AI');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="text-slate-400 hover:text-sky-400 transition-colors cursor-pointer"
                >
                  AI Solutions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onNavigate?.('Recruiting');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="text-slate-400 hover:text-purple-400 transition-colors cursor-pointer"
                >
                  IT Recruitment
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div>
            <h4 className="text-xs font-mono font-extrabold text-slate-400 uppercase tracking-widest mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <button 
                  onClick={() => {
                    onNavigate?.('HR Policies');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  HR Policies
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onNavigate?.('Blogs');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Insights / Blog
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Connect With Us (Social Icons) */}
          <div>
            <h4 className="text-xs font-mono font-extrabold text-slate-400 uppercase tracking-widest mb-4">
              CONNECT WITH US
            </h4>
            <div className="flex items-center gap-3">
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/clyptus/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl bg-slate-800/90 hover:bg-blue-600 text-slate-300 hover:text-white transition-all flex items-center justify-center border border-slate-700/80 hover:border-blue-500 shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.7a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26Z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-slate-800/90 hover:bg-pink-600 text-slate-300 hover:text-white transition-all flex items-center justify-center border border-slate-700/80 hover:border-pink-500 shadow-sm"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-xl bg-slate-800/90 hover:bg-blue-600 text-slate-300 hover:text-white transition-all flex items-center justify-center border border-slate-700/80 hover:border-blue-500 shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7.5v-3H10V9.5C10 7.01 11.49 5.63 13.77 5.63c1.09 0 2.23.19 2.23.19v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 3h-2.33v6.8c4.56-.93 8-4.96 8-9.8z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-xl bg-slate-800/90 hover:bg-red-600 text-slate-300 hover:text-white transition-all flex items-center justify-center border border-slate-700/80 hover:border-red-500 shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar / Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div>
            © 2026 Clyptus Software Solutions. All Rights Reserved.
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => onOpenResourceModal?.('privacy')} 
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => onOpenResourceModal?.('terms')} 
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
            <button 
              onClick={() => onOpenResourceModal?.('cookies')} 
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Cookie Policy
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
