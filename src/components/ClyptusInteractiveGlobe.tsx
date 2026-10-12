import React, { useEffect, useRef, useState } from 'react';
import Globe, { type GlobeInstance } from 'globe.gl';

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
  { id: 'usa', name: 'USA — Temecula', lat: 33.4936, lng: -117.1484, color: HIGHLIGHT.USA },
  { id: 'dubai', name: 'UAE — Dubai', lat: 25.2137, lng: 55.2814, color: HIGHLIGHT.ARE },
  { id: 'hyderabad', name: 'India — Hyderabad', lat: 17.45, lng: 78.38, color: HIGHLIGHT.IND },
];

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

  // Focus location camera smoothly when selectedLocationId changes
  useEffect(() => {
    if (!worldRef.current || !selectedLocationId) return;
    const target = LOCATIONS.find((l) => l.id === selectedLocationId);
    if (target) {
      worldRef.current.pointOfView(
        { lat: target.lat, lng: target.lng, altitude: 2.1 },
        1200
      );
    }
  }, [selectedLocationId]);

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
            return HIGHLIGHT[feat.properties?.ISO_A3] ? 0.02 : 0.006;
          })
          .arcsData(ARCS)
          .arcColor('color')
          .arcDashLength(0.4)
          .arcDashGap(0.25)
          .arcDashAnimateTime(reduceMotion ? 0 : 2200)
          .arcStroke(0.55)
          .arcAltitude(0.25)
          .pointsData(LOCATIONS)
          .pointLat('lat')
          .pointLng('lng')
          .pointColor('color')
          .pointRadius(0.4)
          .pointAltitude(0.012)
          .onPointClick((point: unknown) => {
            const p = point as { id: 'hyderabad' | 'dubai' | 'usa' };
            if (p?.id && onSelectLocation) {
              onSelectLocation(p.id);
            }
          });

        const mat = world.globeMaterial() as unknown as { color: { set: (c: string) => void }; opacity: number; transparent: boolean };
        mat.color.set('#12142f');
        mat.opacity = 0.92;
        mat.transparent = true;

        const controls = world.controls();
        controls.autoRotate = !reduceMotion;
        controls.autoRotateSpeed = 0.6;
        controls.enableZoom = false;

        worldRef.current = world;

        const handleResize = () => {
          if (!mount || !world) return;
          world.width(mount.clientWidth).height(mount.clientHeight);
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
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};
