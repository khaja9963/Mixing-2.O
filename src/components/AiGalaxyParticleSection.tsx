import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';

interface Particle {
  armIndex: number;
  distanceRatio: number; // 0 (core) to 1 (outer arm)
  baseAngle: number;
  speed: number;
  size: number;
  alpha: number;
  charcoalHex: string;
  wobbleOffset: number;
  wobbleSpeed: number;
  initialSide: number;
  screenTargetX: number; // 0 to 1 normalized width
  screenTargetY: number; // 0 to 1 normalized height
}

interface AiGalaxyParticleSectionProps {
  onNavigateContact?: () => void;
}

export const AiGalaxyParticleSection: React.FC<AiGalaxyParticleSectionProps> = ({ onNavigateContact }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Smooth scroll tracking ref for rendering inside canvas RAF
  const scrollProgressRef = useRef<number>(0);

  // Mouse tracking with useRef
  const mouseRef = useRef({
    targetX: -1000,
    targetY: -1000,
    currX: -1000,
    currY: -1000,
    active: false,
  });

  // Scroll listener for sticky pin progress
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;
      const currentPos = -rect.top;
      const progress = Math.max(0, Math.min(1, currentPos / Math.max(1, totalScrollable)));

      scrollProgressRef.current = progress;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const CHARCOAL_SHADES = [
      '#E74905', // Pitch-black
      '#31338E', // Ultra-deep zinc
      '#E74905', // Deep charcoal
      '#31338E', // Charcoal grey
      '#E74905', // Mid-charcoal
      '#E74905', // Slate grey particle
    ];

    const NUM_ARMS = 4;
    const PARTICLE_COUNT = 2500;
    const particles: Particle[] = [];

    // Initialize spiral galaxy particles once on mount
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const armIndex = i % NUM_ARMS;
      const distanceRatio = Math.pow(Math.random(), 1.6);
      const baseAngle = (armIndex * (2 * Math.PI / NUM_ARMS)) + (Math.random() * 0.4 - 0.2);
      const speed = 0.002 + Math.random() * 0.003;
      const size = Math.random() < 0.2 ? Math.random() * 2.4 + 1.2 : Math.random() * 1.3 + 0.5;
      const alpha = Math.min(1, 0.35 + Math.random() * 0.65);
      const charcoalHex = CHARCOAL_SHADES[Math.floor(Math.random() * CHARCOAL_SHADES.length)];
      const wobbleOffset = Math.random() * Math.PI * 2;
      const wobbleSpeed = 0.02 + Math.random() * 0.03;
      const isLeftSide = i % 2 === 0;
      const initialSide = isLeftSide ? -1 : 1;
      const screenTargetX = isLeftSide 
        ? -0.30 + Math.random() * 0.45  // Left side target: -30% to +15% screen width
        : 0.85 + Math.random() * 0.45;   // Right side target: 85% to 130% screen width
      const screenTargetY = -0.35 + Math.random() * 1.7; // Spreads wide along screen height

      particles.push({
        armIndex,
        distanceRatio,
        baseAngle,
        speed,
        size,
        alpha,
        charcoalHex,
        wobbleOffset,
        wobbleSpeed,
        initialSide,
        screenTargetX,
        screenTargetY,
      });
    }

    const resize = () => {
      if (!canvas || !sectionRef.current) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    let globalRotation = 0;

    const render = () => {
      const progress = scrollProgressRef.current;

      // 1. Clean solid pure white background (#FFFFFF)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(width, height) * 0.45;

      globalRotation += 0.0012; // Smooth orbital spin

      // Interpolate mouse coordinates
      if (mouseRef.current.active) {
        mouseRef.current.currX += (mouseRef.current.targetX - mouseRef.current.currX) * 0.06;
        mouseRef.current.currY += (mouseRef.current.targetY - mouseRef.current.currY) * 0.06;
      }

      // 2. Core Halo Glow (fades out as particles part left and right)
      const coreAlpha = Math.max(0, 1 - progress * 1.8);
      if (coreAlpha > 0.01) {
        const coreGradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, maxRadius * 0.35
        );
        coreGradient.addColorStop(0, `rgba(255, 255, 255, ${coreAlpha})`);
        coreGradient.addColorStop(0.2, `rgba(248, 250, 252, ${coreAlpha * 0.95})`);
        coreGradient.addColorStop(0.5, `rgba(241, 245, 249, ${coreAlpha * 0.6})`);
        coreGradient.addColorStop(0.85, `rgba(226, 232, 240, ${coreAlpha * 0.2})`);
        coreGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, maxRadius * 0.38, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Render Particles with Wide Full Screen Dispersion on Scroll Down
      particles.forEach((p) => {
        const spiralTightness = 4.2;
        const currentAngle = p.baseAngle + globalRotation + (1 - p.distanceRatio) * spiralTightness;
        const currentRadius = p.distanceRatio * maxRadius;

        p.wobbleOffset += p.wobbleSpeed * 0.04;
        const wobbleX = Math.sin(p.wobbleOffset) * 12;
        const wobbleY = Math.cos(p.wobbleOffset) * 12;

        // Spiral Galaxy Center Position (at progress = 0)
        const galaxyX = centerX + Math.cos(currentAngle) * currentRadius;
        const galaxyY = centerY + Math.sin(currentAngle) * currentRadius;

        // Direction vector for wide radial push
        const dxFromCenter = galaxyX - centerX;
        const dyFromCenter = galaxyY - centerY;
        const radAngle = Math.atan2(dyFromCenter, dxFromCenter);
        const wideRadialBoost = Math.pow(progress, 0.85) * Math.max(width, height) * 0.7;

        // Wide Full Screen Overall Target Coordinate (at progress = 1)
        const fullScreenX = p.screenTargetX * width + Math.cos(radAngle) * wideRadialBoost;
        const fullScreenY = p.screenTargetY * height + Math.sin(radAngle) * wideRadialBoost;

        // Interpolate smoothly from Spiral Galaxy to Wide Full Screen Dispersion
        const easeProgress = Math.min(1, Math.max(0, Math.pow(progress, 0.8)));
        let px = galaxyX + (fullScreenX - galaxyX) * easeProgress + wobbleX * (1 - easeProgress * 0.5);
        let py = galaxyY + (fullScreenY - galaxyY) * easeProgress + wobbleY * (1 - easeProgress * 0.5);

        let moveSpeedMultiplier = 1.0;

        // Interactive Mouse Particle Dispersion
        if (mouseRef.current.active) {
          const dx = px - mouseRef.current.currX;
          const dy = py - mouseRef.current.currY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const dispersionRadius = 180;

          if (dist < dispersionRadius && dist > 0) {
            const factor = (dispersionRadius - dist) / dispersionRadius;
            const disperseForceMouse = Math.pow(factor, 1.2) * 30;
            px += (dx / dist) * disperseForceMouse;
            py += (dy / dist) * disperseForceMouse;
            moveSpeedMultiplier = Math.max(0.2, 1.0 - factor * 0.8);
          }
        }

        // Apply distance move speed
        p.distanceRatio -= (p.speed * 0.15) * moveSpeedMultiplier;
        if (p.distanceRatio <= 0.02) {
          p.distanceRatio = 0.98 + Math.random() * 0.02;
        }

        // Particle Alpha calculation (retains ~45% background visibility when text appears)
        const outerFade = p.distanceRatio > 0.85
          ? (1 - p.distanceRatio) / 0.15
          : (p.distanceRatio < 0.1 ? p.distanceRatio / 0.1 : 1);

        const scrollAlphaFade = Math.max(0.45, 1 - Math.min(0.55, progress * 0.7));
        const finalAlpha = Math.max(0, Math.min(1, p.alpha * outerFade * scrollAlphaFade));

        // Draw particle dot only when visible and outside the top navbar area (py >= 90)
        if (finalAlpha > 0.001 && py >= 90) {
          ctx.save();
          ctx.globalAlpha = finalAlpha;
          ctx.fillStyle = p.charcoalHex;
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fill();

          if (p.size > 1.8) {
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(px, py, p.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    mouseRef.current.targetX = e.clientX - rect.left;
    mouseRef.current.targetY = e.clientY - rect.top;
    mouseRef.current.active = true;
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  // Text Reveal Opacity & Scale calculation based on scrollProgress
  const textOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.05) / 0.45));
  const textScale = 0.9 + Math.min(0.1, textOpacity * 0.1);

  return (
    <div
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[220vh] bg-white select-none"
    >
      {/* Sticky Full-Viewport Frozen Canvas Container */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-white">

        {/* 4K Ultra-Crisp Monochrome Spiral Galaxy Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        />

        {/* CENTER REVEALED TYPOGRAPHY ("AI SERVICES") */}
        <div
          className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6 pointer-events-auto transition-all duration-300 ease-out"
          style={{
            opacity: textOpacity,
            transform: `scale(${textScale})`,
            pointerEvents: textOpacity > 0.3 ? 'auto' : 'none',
          }}
        >
          {/* Practice Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50/90 border border-sky-200/80 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-sky-600 animate-ping" />
            <span className="text-xs font-mono font-extrabold tracking-widest uppercase text-sky-700">
              AI SERVICES <span className="text-sky-500 mx-1.5">•</span> ENTERPRISE PRACTICE
            </span>
          </div>

          {/* H1 Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-slate-900 max-w-4xl">
            AI Consulting & <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600">Development Services</span>
          </h1>

          {/* Headline */}
          <p className="text-xl sm:text-2xl font-bold text-slate-900 max-w-3xl">
            “Turn Business Data Into Intelligent Action”
          </p>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed font-medium">
            Clyptus designs and builds AI solutions for enterprises: generative AI, AI assistants and copilots, machine learning, conversational AI and intelligent process automation. Our data engineers prepare and run the platforms behind them, including Databricks and Snowflake.
          </p>

          {/* CTA Button */}
          {onNavigateContact && (
            <button
              onClick={onNavigateContact}
              className="group relative flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all duration-300 mt-2"
            >
              <span>Talk to our AI team</span>
              <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          {/* Scroll Down Indicator */}
          <div className="pt-2 flex flex-col items-center gap-2 text-sky-600 animate-bounce">
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-400">
              SCROLL DOWN TO EXPLORE CAPABILITIES
            </span>
            <div className="w-7 h-7 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
              <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
