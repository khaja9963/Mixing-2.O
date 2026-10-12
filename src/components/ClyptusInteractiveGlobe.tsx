import React, { useEffect, useRef, useState } from 'react';
import Globe, { type GlobeInstance } from 'globe.gl';
import { ZoomIn, ZoomOut, RotateCcw, Compass } from 'lucide-react';

export interface OfficeLocation {
  id: 'hyderabad' | 'dubai' | 'usa';
  city: string;
  country: string;
  label: string;
  badge: string;
  lat: number;
  lon: number;
  color: string;
  address: string;
  emails: string[];
  phones: string[];
  mapUrl: string;
  description: string;
}

export const CLYPTUS_OFFICES: OfficeLocation[] = [
  {
    id: 'hyderabad',
    city: 'Hyderabad',
    country: 'India',
    label: 'Hyderabad, India',
    badge: 'HEAD OFFICE',
    lat: 17.45,
    lon: 78.38,
    color: '#e8501e',
    address: '12A01A, 13th Floor, Manjeera Trinity Corporate, JNTU–Hitech City Road, Kukatpally, Hyderabad, Telangana 500072',
    emails: ['hr.india@clyptus.com', 'Sales@clyptus.com'],
    phones: ['+91 77999 88139 (Sales)'],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Manjeera+Trinity+Corporate+Hyderabad',
    description: 'Corporate Headquarters & Global Delivery Center',
  },
  {
    id: 'dubai',
    city: 'Dubai',
    country: 'UAE',
    label: 'Dubai, UAE',
    badge: 'UAE OFFICE',
    lat: 25.2137,
    lon: 55.2814,
    color: '#e8501e',
    address: '101 Sheikh Zayed Rd, Trade Centre, DIFC, Dubai, UAE',
    emails: ['hr.uae@clyptus.com'],
    phones: ['+971 52 350 3297'],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=101+Sheikh+Zayed+Rd+Trade+Centre+DIFC+Dubai',
    description: 'Middle East Regional Center & DIFC Operations',
  },
  {
    id: 'usa',
    city: 'California',
    country: 'USA',
    label: 'California, USA',
    badge: 'USA OFFICE',
    lat: 33.4936,
    lon: -117.1484,
    color: '#ff7a42',
    address: '45627 Basswood Ct, Temecula, California 92592',
    emails: ['hr.usa@clyptus.com'],
    phones: ['+1 (480) 427-6373'],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=45627+Basswood+Ct+Temecula+California+92592',
    description: 'North America Business Hub & Strategic Enterprise Accounts',
  },
];

const HIGHLIGHT: Record<string, string> = {
  USA: '#ff7a42',
  ARE: '#e8501e',
  IND: '#e8501e',
};

const LOCATIONS = [
  { id: 'usa', name: 'USA — California', lat: 33.4936, lng: -117.1484, color: HIGHLIGHT.USA },
  { id: 'dubai', name: 'UAE — Dubai', lat: 25.2137, lng: 55.2814, color: HIGHLIGHT.ARE },
  { id: 'hyderabad', name: 'India — Hyderabad', lat: 17.45, lng: 78.38, color: HIGHLIGHT.IND },
];

const LABELS = [
  { id: 'hyderabad', text: 'Hyderabad (HQ)', lat: 17.45, lng: 78.38, size: 1.1, color: '#ffffff' },
  { id: 'dubai', text: 'Dubai (Hub)', lat: 25.2137, lng: 55.2814, size: 1.0, color: '#ffffff' },
  { id: 'usa', text: 'California (Hub)', lat: 33.4936, lng: -117.1484, size: 1.0, color: '#ffffff' },
];

const RINGS = LOCATIONS.map((loc) => ({
  lat: loc.lat,
  lng: loc.lng,
  maxR: loc.id === 'hyderabad' ? 5.5 : 4.5,
  propagationSpeed: 2.5,
  repeatPeriod: 1100,
  color: loc.id === 'hyderabad' ? '#e8501e' : loc.color,
}));

const ARCS = [
  {
    startLat: LOCATIONS[0].lat,
    startLng: LOCATIONS[0].lng,
    endLat: LOCATIONS[1].lat,
    endLng: LOCATIONS[1].lng,
    color: [HIGHLIGHT.USA, HIGHLIGHT.ARE],
  },
  {
    startLat: LOCATIONS[1].lat,
    startLng: LOCATIONS[1].lng,
    endLat: LOCATIONS[2].lat,
    endLng: LOCATIONS[2].lng,
    color: [HIGHLIGHT.ARE, HIGHLIGHT.IND],
  },
  {
    startLat: LOCATIONS[2].lat,
    startLng: LOCATIONS[2].lng,
    endLat: LOCATIONS[0].lat,
    endLng: LOCATIONS[0].lng,
    color: [HIGHLIGHT.IND, HIGHLIGHT.USA],
  },
];

interface ClyptusInteractiveGlobeProps {
  selectedLocationId?: string | null;
  onSelectLocation?: (id: 'hyderabad' | 'dubai' | 'usa') => void;
  hoveredLocationId?: string | null;
  onHoverLocation?: (id: string | null) => void;
  className?: string;
}

export const ClyptusInteractiveGlobe: React.FC<ClyptusInteractiveGlobeProps> = ({
  selectedLocationId,
  onSelectLocation,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<GlobeInstance | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Smooth cinematic camera zoom into location (India / Hyderabad, Dubai, USA)
  useEffect(() => {
    if (!worldRef.current) return;
    const world = worldRef.current;
    const controls = world.controls();

    if (selectedLocationId) {
      const target = LOCATIONS.find((l) => l.id === selectedLocationId);
      if (target) {
        // Deep cinematic zoom into city & country (altitude 1.2 gives crisp regional focus)
        world.pointOfView(
          { lat: target.lat, lng: target.lng, altitude: 1.2 },
          1400
        );
        if (controls) {
          controls.autoRotate = false; // pause rotation so India/hub remains steady in view
        }
      }
    } else {
      // Zoom out to global overview
      world.pointOfView({ altitude: 2.2 }, 1200);
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 2.5;
      }
    }
  }, [selectedLocationId]);

  const handleZoomIn = () => {
    if (!worldRef.current) return;
    const currentPov = worldRef.current.pointOfView();
    worldRef.current.pointOfView(
      { ...currentPov, altitude: Math.max(0.6, (currentPov.altitude || 2.2) * 0.75) },
      600
    );
  };

  const handleZoomOut = () => {
    if (!worldRef.current) return;
    const currentPov = worldRef.current.pointOfView();
    worldRef.current.pointOfView(
      { ...currentPov, altitude: Math.min(3.5, (currentPov.altitude || 2.2) * 1.35) },
      600
    );
  };

  const handleResetOverview = () => {
    if (!worldRef.current) return;
    worldRef.current.pointOfView({ lat: 20, lng: 50, altitude: 2.2 }, 1200);
    const controls = worldRef.current.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 2.5;
    }
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let isDisposed = false;
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    async function init() {
      try {
        let countriesData = (window as unknown as { __CLYPTUS_COUNTRIES__?: { features: unknown[] } }).__CLYPTUS_COUNTRIES__;
        if (!countriesData) {
          const res = await fetch('/countries-data.json');
          countriesData = await res.json();
          (window as unknown as { __CLYPTUS_COUNTRIES__?: unknown }).__CLYPTUS_COUNTRIES__ = countriesData;
        }

        if (isDisposed || !mount) return;

        // Initialize Globe
        const world = new Globe(mount)
          .backgroundColor('rgba(0,0,0,0)')
          .showAtmosphere(true)
          .atmosphereColor('#8b87ea')
          .atmosphereAltitude(0.2)
          .polygonsData((countriesData as { features: object[] }).features)
          .polygonCapColor((f: unknown) => {
            const feat = f as { properties: { ISO_A3: string } };
            return HIGHLIGHT[feat.properties?.ISO_A3] || 'rgba(139,135,234,0.28)';
          })
          .polygonSideColor(() => 'rgba(74,71,196,0.12)')
          .polygonStrokeColor(() => 'rgba(231,236,242,0.25)')
          .polygonAltitude((f: unknown) => {
            const feat = f as { properties: { ISO_A3: string } };
            return HIGHLIGHT[feat.properties?.ISO_A3] ? 0.025 : 0.006;
          })
          // Zoom into India, Dubai or USA on country polygon click
          .onPolygonClick((f: unknown) => {
            const feat = f as { properties: { ISO_A3: string } };
            const iso = feat?.properties?.ISO_A3;
            if (iso === 'IND' && onSelectLocation) {
              onSelectLocation('hyderabad');
            } else if (iso === 'ARE' && onSelectLocation) {
              onSelectLocation('dubai');
            } else if (iso === 'USA' && onSelectLocation) {
              onSelectLocation('usa');
            }
          })
          .arcsData(ARCS)
          .arcColor('color')
          .arcDashLength(0.4)
          .arcDashGap(0.25)
          .arcDashAnimateTime(reduceMotion ? 0 : 1500)
          .arcStroke(0.55)
          .arcAltitude(0.25)
          .pointsData(LOCATIONS)
          .pointLat('lat')
          .pointLng('lng')
          .pointColor('color')
          .pointRadius(0.45)
          .pointAltitude(0.015)
          .onPointClick((point: unknown) => {
            const p = point as { id: 'hyderabad' | 'dubai' | 'usa' };
            if (p?.id && onSelectLocation) {
              onSelectLocation(p.id);
            }
          })
          // Animated Ripple Radar Rings
          .ringsData(RINGS)
          .ringLat('lat')
          .ringLng('lng')
          .ringMaxRadius('maxR')
          .ringPropagationSpeed('propagationSpeed')
          .ringRepeatPeriod('repeatPeriod')
          .ringColor((r: unknown) => {
            const ring = r as { color: string };
            return (t: number) => {
              const alpha = Math.max(0, 1 - t) * 0.75;
              return ring.color === '#e8501e'
                ? `rgba(232, 80, 30, ${alpha})`
                : `rgba(255, 122, 66, ${alpha})`;
            };
          })
          // Visible City & Hub Labels
          .labelsData(LABELS)
          .labelLat('lat')
          .labelLng('lng')
          .labelText('text')
          .labelSize('size')
          .labelDotRadius(0.3)
          .labelColor('color')
          .labelAltitude(0.02)
          .onLabelClick((l: unknown) => {
            const label = l as { id: 'hyderabad' | 'dubai' | 'usa' };
            if (label?.id && onSelectLocation) {
              onSelectLocation(label.id);
            }
          });

        const mat = world.globeMaterial() as unknown as { color: { set: (c: string) => void }; opacity: number; transparent: boolean };
        mat.color.set('#12142f');
        mat.opacity = 0.92;
        mat.transparent = true;

        const controls = world.controls();
        controls.autoRotate = !reduceMotion;
        controls.autoRotateSpeed = 2.5;
        controls.enableZoom = true; // allow interactive user zooming as well

        worldRef.current = world;

        const handleResize = () => {
          if (!mount || !world) return;
          const w = mount.clientWidth || 550;
          const h = mount.clientHeight || 550;
          world.width(w).height(h);
        };

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(mount);
        handleResize();

        setLoading(false);

        return () => {
          resizeObserver.disconnect();
          try {
            world._destructor?.();
          } catch {
            // fallback
          }
        };
      } catch (err) {
        console.error('Globe init error:', err);
        setLoading(false);
      }
    }

    const cleanupPromise = init();

    return () => {
      isDisposed = true;
      cleanupPromise.then((cleanup) => cleanup?.());
    };
  }, [onSelectLocation]);

  return (
    <div className={`relative w-full h-full min-h-[380px] sm:min-h-[480px] lg:min-h-[560px] flex items-center justify-center overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-3.5 h-3.5 rounded-full border-2 border-indigo-400/40 border-t-indigo-500 animate-spin" />
          <span>Loading globe…</span>
        </div>
      )}
      
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Interactive Camera Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/90 shadow-md">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          aria-label="Zoom In"
          className="p-2 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-600 transition-colors cursor-pointer"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          aria-label="Zoom Out"
          className="p-2 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-600 transition-colors cursor-pointer"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleResetOverview}
          title="Reset to Global Overview"
          aria-label="Reset to Global Overview"
          className="p-2 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-600 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hint Badge */}
      <div className="absolute top-4 left-4 z-20 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 text-[10px] font-mono text-slate-600 font-bold shadow-xs pointer-events-none">
        <Compass className="w-3 h-3 text-sky-600 animate-spin" />
        <span>Click India, Dubai, or USA to zoom in</span>
      </div>
    </div>
  );
};
