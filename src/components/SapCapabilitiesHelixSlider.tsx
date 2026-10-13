import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import {
  Layers,
  Cloud,
  Code,
  Users,
  CreditCard,
  Sparkles,
  ShieldCheck,
  Cpu,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

import { CapabilityDetailView } from './CapabilityDetailView';

export interface SapCapability {
  num: string;
  title: string;
  desc: string;
  badge: string;
  icon: React.ElementType;
  accentHex: string;
}

export const CAPABILITIES_DATA: SapCapability[] = [
  {
    num: '01',
    title: 'SAP S/4HANA',
    desc: 'Greenfield implementation, migration and upgrade to S/4HANA.',
    badge: 'S/4HANA',
    icon: Layers,
    accentHex: '#2563EB',
  },
  {
    num: '02',
    title: 'SAP Cloud Services',
    desc: 'SAP cloud deployment and services.',
    badge: 'SAP CLOUD',
    icon: Cloud,
    accentHex: '#0284C7',
  },
  {
    num: '03',
    title: 'SAP BTP and Add-ons',
    desc: 'BTP-first extensions and custom SAP add-on solutions.',
    badge: 'BTP & EXTENSIONS',
    icon: Code,
    accentHex: '#7C3AED',
  },
  {
    num: '04',
    title: 'SAP HCM',
    desc: 'Human capital management on SAP, part of the practice since the company began.',
    badge: 'HCM & TALENT',
    icon: Users,
    accentHex: '#EA580C',
  },
  {
    num: '05',
    title: 'SAP BRIM',
    desc: 'Subscription billing, usage-based charging, invoicing and revenue management.',
    badge: 'BRIM MONETIZATION',
    icon: CreditCard,
    accentHex: '#F59E0B',
  },
  {
    num: '06',
    title: 'SAP AI',
    desc: 'SAP AI capabilities integrated into SAP solutions.',
    badge: 'INTELLIGENT AI',
    icon: Sparkles,
    accentHex: '#10B981',
  },
  {
    num: '07',
    title: 'SAP AMS and Support',
    desc: 'Application management and support after go-live.',
    badge: 'AMS & SLA',
    icon: ShieldCheck,
    accentHex: '#DC2626',
  },
  {
    num: '08',
    title: 'Oracle Cloud ERP',
    desc: 'Oracle ERP implementation and support.',
    badge: 'ORACLE ERP',
    icon: Cpu,
    accentHex: '#2563EB',
  },
  {
    num: '09',
    title: 'Microsoft Dynamics 365',
    desc: 'Dynamics 365 implementation and support.',
    badge: 'DYNAMICS 365',
    icon: RefreshCw,
    accentHex: '#0284C7',
  },
];

interface SapCapabilitiesHelixSliderProps {
  onContactClick?: () => void;
}

export const SapCapabilitiesHelixSlider: React.FC<SapCapabilitiesHelixSliderProps> = ({
  onContactClick,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedCapabilityNum, setSelectedCapabilityNum] = useState<string | null>(null);
  const totalCards = CAPABILITIES_DATA.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll-driven progress to cycle through 9 cards while screen is pinned (Desktop only)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (isMobile) return;
    const calculatedIndex = Math.min(
      totalCards - 1,
      Math.floor(latest * totalCards)
    );
    setActiveIndex(calculatedIndex);
  });

  const scrollToCard = (index: number) => {
    setActiveIndex(index);
    if (mobileScrollRef.current) {
      const child = mobileScrollRef.current.children[index] as HTMLElement;
      if (child) {
        child.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % totalCards;
    if (isMobile) {
      scrollToCard(nextIdx);
    } else {
      setActiveIndex(nextIdx);
    }
  };

  const handlePrev = () => {
    const prevIdx = (activeIndex - 1 + totalCards) % totalCards;
    if (isMobile) {
      scrollToCard(prevIdx);
    } else {
      setActiveIndex(prevIdx);
    }
  };

  const handleMobileScroll = () => {
    if (!mobileScrollRef.current) return;
    const el = mobileScrollRef.current;
    const scrollLeft = el.scrollLeft;
    const cardEl = el.children[0] as HTMLElement;
    if (!cardEl) return;
    const cardWidth = cardEl.offsetWidth + 16;
    const newIdx = Math.min(totalCards - 1, Math.max(0, Math.round(scrollLeft / cardWidth)));
    if (newIdx !== activeIndex) {
      setActiveIndex(newIdx);
    }
  };

  return (
    <div
      ref={containerRef}
      id="core-capabilities"
      className={`relative w-full ${isMobile ? 'h-auto py-12' : 'h-[350vh]'}`}
    >
      {/* Sticky screen container on desktop, clean fluid section on mobile */}
      <div className={isMobile ? 'relative w-full flex flex-col justify-center px-4 max-w-7xl mx-auto select-none' : 'sticky top-0 h-screen w-full flex flex-col justify-center px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto select-none overflow-hidden'}>
        {/* Section Heading */}
        <div className="text-center flex flex-col items-center gap-2 mb-3">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Core ERP &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-orange-500">
              SAP Capabilities
            </span>
          </h2>
        </div>
      {/* Top Header Telemetry & Controls */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-extrabold shadow-sm">
            [ {String(activeIndex + 1).padStart(2, '0')} / {String(totalCards).padStart(2, '0')} ]
          </span>
        </div>

        {/* Carousel Prev / Next Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 shadow-sm transition-all active:scale-95"
            aria-label="Previous Capability"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 shadow-sm transition-all active:scale-95"
            aria-label="Next Capability"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= DESKTOP 3D HELIX / SPIRAL STAGE (≥ 768px) ================= */}
      <div className="hidden md:block relative w-full h-[520px] overflow-visible perspective-[1200px]">
        <div className="absolute inset-0 flex items-center justify-center transform-style-3d">
          {CAPABILITIES_DATA.map((item, idx) => {
            // Calculate relative offset from active card
            let offset = idx - activeIndex;
            if (offset > totalCards / 2) offset -= totalCards;
            if (offset < -totalCards / 2) offset += totalCards;

            const isCenter = offset === 0;

            // Mathematical Helix Curve Geometry
            const angleStep = (2 * Math.PI) / totalCards;
            const currentAngle = offset * angleStep;

            const radius = 380; // Distance from cylindrical center
            const x = Math.sin(currentAngle) * (radius * 0.85);
            const z = Math.cos(currentAngle) * radius - radius;
            const y = Math.sin(currentAngle * 0.5) * 40 + offset * 12;

            const rotateY = (currentAngle * 180) / Math.PI;
            const rotateZ = Math.sin(currentAngle) * -5;

            // Active Focus & Depth Cull Scale / Opacity Calculation
            const absOffset = Math.abs(offset);
            const opacity = isCenter
              ? 1
              : absOffset === 1
              ? 0.75
              : absOffset === 2
              ? 0.4
              : 0.15;

            const scale = isCenter ? 1.05 : Math.max(0.72, 1 - absOffset * 0.12);
            const zIndex = Math.round(100 - Math.abs(z));

            const IconComp = item.icon;

            return (
              <motion.div
                key={item.num}
                onClick={() => {
                  setActiveIndex(idx);
                }}
                animate={{
                  x,
                  y,
                  z,
                  rotateY,
                  rotateZ,
                  scale,
                  opacity,
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  zIndex,
                  transformStyle: 'preserve-3d',
                }}
                className={`absolute w-[360px] cursor-pointer rounded-3xl p-7 transition-shadow duration-300 ${
                  isCenter
                    ? 'bg-white border-2 border-blue-500 shadow-[0_25px_45px_-10px_rgba(37,99,235,0.18)] pointer-events-auto'
                    : 'bg-white/95 border border-slate-200/90 shadow-sm hover:border-blue-300 pointer-events-auto'
                }`}
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-5">
                  <span
                    className={`text-xs font-mono font-extrabold px-3 py-1 rounded-full border ${
                      isCenter
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {item.num}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {item.badge}
                  </span>
                </div>

                {/* Title & Icon */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`p-3 rounded-2xl shadow-sm ${
                      isCenter
                        ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {item.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-slate-600 text-sm leading-relaxed font-medium mb-4">
                  {item.desc}
                </p>

                {/* Bottom Action Line */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isCenter) {
                        setSelectedCapabilityNum(item.num);
                      } else {
                        setActiveIndex(idx);
                      }
                    }}
                    className="text-xs font-extrabold text-blue-600 flex items-center gap-1 group hover:text-blue-700 transition-colors"
                  >
                    <span>Explore Capability</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  {isCenter && (
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ================= MOBILE FALLBACK HORIZONTAL SNAP CAROUSEL (< 768px) ================= */}
      <div className="block md:hidden relative w-full">
        <div 
          ref={mobileScrollRef}
          onScroll={handleMobileScroll}
          className="w-full overflow-x-auto snap-x snap-mandatory flex gap-4 pb-6 pt-2 scrollbar-none"
        >
          {CAPABILITIES_DATA.map((item, idx) => {
            const IconComp = item.icon;
            const isCenter = idx === activeIndex;

            return (
              <div
                key={item.num}
                onClick={() => scrollToCard(idx)}
                className={`snap-center shrink-0 w-[85vw] max-w-[320px] p-6 rounded-3xl bg-white border transition-all cursor-pointer ${
                  isCenter
                    ? 'border-2 border-blue-500 shadow-xl'
                    : 'border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {item.num}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {item.badge}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-sm">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {item.title}
                  </h3>
                </div>

                <p className="text-slate-600 text-xs font-medium leading-relaxed mb-4">
                  {item.desc}
                </p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCapabilityNum(item.num);
                  }}
                  className="flex items-center text-xs font-bold text-blue-600 gap-1 hover:text-blue-700 transition-colors"
                >
                  <span>Explore Capability</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Mobile Page Dot Indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-2">
          {CAPABILITIES_DATA.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToCard(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex ? 'w-6 bg-blue-600' : 'w-1.5 bg-slate-300'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Capability Verbatim Detail Reader Modal */}
      <CapabilityDetailView
        capabilityNum={selectedCapabilityNum}
        onClose={() => setSelectedCapabilityNum(null)}
        onContactClick={onContactClick}
      />
      </div>
    </div>
  );
};

