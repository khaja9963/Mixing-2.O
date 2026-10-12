import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Play, Pause, RotateCcw } from 'lucide-react';

export interface OfficeLocation {
  id: 'hyderabad' | 'bengaluru' | 'dubai';
  city: string;
  country: string;
  label: string;
  badge: string;
  lat: number;
  lon: number;
  color: string;
  ringColor: string;
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
    badge: 'GLOBAL HEADQUARTERS',
    lat: 17.4947,
    lon: 78.3888,
    color: '#0077ED',
    ringColor: '#38BDF8',
    address: '12A01A 13th Floor, Manjeera Trinity Corporate, JNTU - Hitech City Road, Kukatpally Housing Board Colony, Kukatpally, Hyderabad, Telangana 500072',
    emails: ['Sales@clyptus.com', 'hr.india@clyptus.com'],
    phones: ['+91 7799988139 (Sales)', '+91 9100115466 (HR)'],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Manjeera+Trinity+Corporate+Hyderabad',
    description: 'Clyptus Worldwide Corporate Headquarters & Primary Global Delivery Center.',
  },
  {
    id: 'bengaluru',
    city: 'Bengaluru',
    country: 'India',
    label: 'Bengaluru, India',
    badge: 'TECH INNOVATION CENTER',
    lat: 12.9716,
    lon: 77.5946,
    color: '#0284C7',
    ringColor: '#60A5FA',
    address: 'No. 3, 7th Cross, Venkateswara Layout, Bangalore, Karnataka 560068',
    emails: ['Sales@clyptus.com', 'hr.india@clyptus.com'],
    phones: ['+91 7799988139'],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Venkateswara+Layout+Bangalore',
    description: 'Enterprise Engineering, Cloud ERP Specialization & Next-Gen AI R&D.',
  },
  {
    id: 'dubai',
    city: 'Dubai',
    country: 'UAE',
    label: 'Dubai, UAE',
    badge: 'MIDDLE EAST REGIONAL HUB',
    lat: 25.2048,
    lon: 55.2708,
    color: '#059669',
    ringColor: '#34D399',
    address: '101 Sheikh Zayed Rd - Trade Centre - DIFC - Dubai - United Arab Emirates',
    emails: ['hr.uae@clyptus.com', 'shabana.shaik@clyptus.com'],
    phones: ['+971 504836190'],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=101+Sheikh+Zayed+Rd+DIFC+Dubai',
    description: 'Regional Business Strategy, Middle East Enterprise Operations & Strategic Alliances.',
  },
];

// Mathematical conversion from latitude/longitude to 3D Sphere Cartesian Coordinates
export function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const latRad = (lat * Math.PI) / 180;
  const lonRad = (lon * Math.PI) / 180;
  const y = radius * Math.sin(latRad);
  const x = radius * Math.cos(latRad) * Math.cos(lonRad);
  const z = -radius * Math.cos(latRad) * Math.sin(lonRad);
  return new THREE.Vector3(x, y, z);
}

// Rotation angles required to bring specific longitude & latitude directly facing the viewer
export function getTargetRotationY(lon: number): number {
  return -(lon * Math.PI / 180) - Math.PI / 2;
}

export function getTargetRotationX(lat: number): number {
  return (lat * Math.PI / 180) * 0.32;
}

interface ClyptusInteractiveGlobeProps {
  selectedLocationId: 'hyderabad' | 'bengaluru' | 'dubai' | null;
  onSelectLocation: (id: 'hyderabad' | 'bengaluru' | 'dubai') => void;
  hoveredLocationId?: string | null;
  onHoverLocation?: (id: string | null) => void;
  className?: string;
}

export const ClyptusInteractiveGlobe: React.FC<ClyptusInteractiveGlobeProps> = ({
  selectedLocationId,
  onSelectLocation,
  hoveredLocationId: _hoveredLocationId,
  onHoverLocation,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [isWebGLSupported, setIsWebGLSupported] = useState<boolean>(true);

  // Animation & Three.js state references
  const animStateRef = useRef({
    currentRotY: 0,
    currentRotX: 0.15,
    targetRotY: getTargetRotationY(78.3888), // default focus on India
    targetRotX: getTargetRotationX(17.4947),
    isUserInteracting: false,
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    scrollOffset: 0,
    isRotating: true,
    lastSelectedId: null as string | null,
    selectedId: selectedLocationId,
  });

  // Keep state sync
  useEffect(() => {
    animStateRef.current.isRotating = isRotating;
  }, [isRotating]);

  useEffect(() => {
    animStateRef.current.selectedId = selectedLocationId;
    if (selectedLocationId) {
      const loc = CLYPTUS_OFFICES.find((o) => o.id === selectedLocationId);
      if (loc) {
        animStateRef.current.targetRotY = getTargetRotationY(loc.lon);
        animStateRef.current.targetRotX = getTargetRotationX(loc.lat);
        // Temporarily pause auto-spin to allow user to inspect the location
        setIsRotating(false);
      }
    }
  }, [selectedLocationId]);

  // Handle user mouse movement for subtle parallax
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    animStateRef.current.targetMouseX = nx * 0.12;
    animStateRef.current.targetMouseY = ny * 0.1;
  }, []);

  const handleMouseLeave = useCallback(() => {
    animStateRef.current.targetMouseX = 0;
    animStateRef.current.targetMouseY = 0;
    onHoverLocation?.(null);
  }, [onHoverLocation]);

  // Main Three.js Lifecycle
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. WebGL Support Check
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setIsWebGLSupported(false);
        return;
      }
    } catch {
      setIsWebGLSupported(false);
      return;
    }

    // Respect reduced-motion accessibility preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsRotating(false);
      animStateRef.current.isRotating = false;
    }

    // 2. Setup Three.js Scene, Camera, Renderer
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(0, 0, 240);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Root Globe Group (holds globe, markers, arcs)
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const GLOBE_RADIUS = 76;

    // 3. Lighting Setup: Elegant white & light-blue corporate lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xe0f2fe, 2.5);
    dirLight1.position.set(150, 100, 160);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xbae6fd, 1.0);
    dirLight2.position.set(-140, -80, -100);
    scene.add(dirLight2);

    // 4. Procedural Canvas Texture Generation (White oceans + Light blue continents + Clyptus Blue borders)
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    const earthTexture = new THREE.CanvasTexture(canvas);
    earthTexture.colorSpace = THREE.SRGBColorSpace;

    // Load topology bump map
    const textureLoader = new THREE.TextureLoader();
    const bumpMap = textureLoader.load('/earth-topology.png');

    // Create Base Globe Material
    const globeMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      bumpMap: bumpMap,
      bumpScale: 0.04,
      roughness: 0.65,
      metalness: 0.08,
      color: 0xffffff,
    });

    const globeGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    globeGroup.add(globeMesh);

    // Generate styled texture from /earth-water.png
    if (ctx) {
      // Immediate clean gradient while image loads
      const baseGrad = ctx.createLinearGradient(0, 0, 0, 800);
      baseGrad.addColorStop(0, '#f0f9ff');
      baseGrad.addColorStop(0.5, '#ffffff');
      baseGrad.addColorStop(1, '#f0f9ff');
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, 1600, 800);
      earthTexture.needsUpdate = true;

      const maskImg = new Image();
      maskImg.crossOrigin = 'anonymous';
      maskImg.src = '/earth-water.png';
      maskImg.onload = () => {
        ctx.drawImage(maskImg, 0, 0, 1600, 800);
        const imgData = ctx.getImageData(0, 0, 1600, 800);
        const data = imgData.data;

        // Process pixels: Land is black (< 128) in earth-water.png
        for (let y = 0; y < 800; y++) {
          for (let x = 0; x < 1600; x++) {
            const idx = (y * 1600 + x) * 4;
            const isLand = data[idx] < 128;

            if (isLand) {
              // Continents: Soft corporate light-blue
              data[idx] = 205;     // R
              data[idx + 1] = 226; // G
              data[idx + 2] = 249; // B
              data[idx + 3] = 255;
            } else {
              // Oceans: Crisp clean pearl white with subtle grid
              const isGridLine =
                (x % 80 === 0 && x > 20 && x < 1580) ||
                (y % 80 === 0 && y > 20 && y < 780);

              if (isGridLine) {
                data[idx] = 228;     // R
                data[idx + 1] = 239; // G
                data[idx + 2] = 252; // B
                data[idx + 3] = 255;
              } else {
                data[idx] = 249;     // R
                data[idx + 1] = 252; // G
                data[idx + 2] = 255; // B
                data[idx + 3] = 255;
              }
            }
          }
        }

        // Draw crisp Clyptus Blue outline on continent coastlines
        const isLandPixel = (px: number, py: number) => {
          if (px < 0 || px >= 1600 || py < 0 || py >= 800) return false;
          return data[(py * 1600 + px) * 4] < 220;
        };

        for (let y = 1; y < 799; y += 2) {
          for (let x = 1; x < 1599; x += 2) {
            if (isLandPixel(x, y)) {
              if (
                !isLandPixel(x + 1, y) ||
                !isLandPixel(x - 1, y) ||
                !isLandPixel(x, y + 1) ||
                !isLandPixel(x, y - 1)
              ) {
                const cIdx = (y * 1600 + x) * 4;
                data[cIdx] = 0;       // R (#0077ED)
                data[cIdx + 1] = 119; // G
                data[cIdx + 2] = 237; // B
                data[cIdx + 3] = 255;
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        earthTexture.needsUpdate = true;
      };
    }

    // 5. Atmospheric Rim Glow Shader Mesh
    const atmosphereVertexShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const atmosphereFragmentShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vec3 viewDir = normalize(-vPosition);
        float intensity = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);
        vec3 glowColor = vec3(0.0, 0.467, 0.929); // Clyptus Electric Blue #0077ED
        gl_FragColor = vec4(glowColor, intensity * 0.75);
      }
    `;

    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });

    const atmosphereMesh = new THREE.Mesh(
      new THREE.SphereGeometry(GLOBE_RADIUS * 1.042, 64, 64),
      atmosphereMaterial
    );
    globeGroup.add(atmosphereMesh);

    // 6. Branch Location 3D Markers & Interactive Hit Targets
    const markerObjects: Array<{
      id: string;
      position: THREE.Vector3;
      ringMesh: THREE.Mesh;
      pulseScale: number;
      hitMesh: THREE.Mesh;
      impactIntensity: number;
    }> = [];

    const markerGroup = new THREE.Group();
    globeGroup.add(markerGroup);

    CLYPTUS_OFFICES.forEach((office) => {
      const pos = latLonToVector3(office.lat, office.lon, GLOBE_RADIUS);
      const normal = pos.clone().normalize();

      // Base glowing sphere on surface
      const coreGeo = new THREE.SphereGeometry(1.6, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({ color: office.color });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.copy(pos);
      markerGroup.add(coreMesh);

      // Elevated beacon tip
      const tipPos = pos.clone().add(normal.clone().multiplyScalar(4.8));
      const tipGeo = new THREE.SphereGeometry(1.2, 16, 16);
      const tipMat = new THREE.MeshBasicMaterial({ color: office.ringColor });
      const tipMesh = new THREE.Mesh(tipGeo, tipMat);
      tipMesh.position.copy(tipPos);
      markerGroup.add(tipMesh);

      // Vertical beacon line
      const lineCurve = new THREE.LineCurve3(pos, tipPos);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(lineCurve.getPoints(2));
      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(office.color),
        transparent: true,
        opacity: 0.85,
      });
      const beaconLine = new THREE.Line(lineGeo, lineMat);
      markerGroup.add(beaconLine);

      // Pulsing concentric ripple ring oriented along the surface normal
      const ringGeo = new THREE.RingGeometry(1.6, 2.8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: office.ringColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos.clone().add(normal.clone().multiplyScalar(0.2)));
      ringMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      markerGroup.add(ringMesh);

      // Invisible Raycast Hit Sphere for clicking/hovering
      const hitGeo = new THREE.SphereGeometry(6.5, 12, 12);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.copy(tipPos);
      hitMesh.userData = { officeId: office.id };
      markerGroup.add(hitMesh);

      markerObjects.push({
        id: office.id,
        position: tipPos,
        ringMesh,
        pulseScale: 1,
        hitMesh,
        impactIntensity: 0,
      });
    });

    // 7. Dynamic Jumping Lines Arcing from One Branch to Another
    // Routes connecting branches with parabolic trajectories and traveling luminous trails
    const jumpingRoutes = [
      { from: 'hyderabad', to: 'dubai', color: '#0077ED', headColor: '#38BDF8', duration: 2.2, delay: 0.0, trailLength: 0.36 },
      { from: 'dubai', to: 'bengaluru', color: '#0284C7', headColor: '#60A5FA', duration: 2.4, delay: 1.1, trailLength: 0.36 },
      { from: 'bengaluru', to: 'hyderabad', color: '#059669', headColor: '#34D399', duration: 1.3, delay: 0.4, trailLength: 0.32 },
      { from: 'hyderabad', to: 'bengaluru', color: '#38BDF8', headColor: '#93C5FD', duration: 1.3, delay: 1.8, trailLength: 0.32 },
      { from: 'dubai', to: 'hyderabad', color: '#6366F1', headColor: '#C7D2FE', duration: 2.3, delay: 2.4, trailLength: 0.36 },
    ];

    interface JumpingBeam {
      fromId: string;
      toId: string;
      curve: THREE.QuadraticBezierCurve3;
      color: THREE.Color;
      headColor: THREE.Color;
      duration: number;
      delay: number;
      trailLength: number;
      // Three.js dynamic objects
      headMesh: THREE.Mesh;
      headGlowMesh: THREE.Mesh;
      trailLine: THREE.Line;
      posAttr: THREE.BufferAttribute;
      colAttr: THREE.BufferAttribute;
      trailCount: number;
    }

    const jumpingBeams: JumpingBeam[] = [];
    const arcGroup = new THREE.Group();
    globeGroup.add(arcGroup);

    jumpingRoutes.forEach((route) => {
      const fromOffice = CLYPTUS_OFFICES.find((o) => o.id === route.from)!;
      const toOffice = CLYPTUS_OFFICES.find((o) => o.id === route.to)!;

      const pA = latLonToVector3(fromOffice.lat, fromOffice.lon, GLOBE_RADIUS);
      const pB = latLonToVector3(toOffice.lat, toOffice.lon, GLOBE_RADIUS);

      const dist = pA.distanceTo(pB);
      // Parabolic jump altitude proportional to distance
      const mid = pA.clone().add(pB).multiplyScalar(0.5);
      const midLift = Math.max(9, dist * 0.30);
      mid.normalize().multiplyScalar(GLOBE_RADIUS + midLift);

      const curve = new THREE.QuadraticBezierCurve3(pA, mid, pB);

      // Background subtle guide line showing orbital arc
      const guidePoints = curve.getPoints(50);
      const guideGeo = new THREE.BufferGeometry().setFromPoints(guidePoints);
      const guideMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(route.color),
        transparent: true,
        opacity: 0.22,
      });
      const guideLine = new THREE.Line(guideGeo, guideMat);
      arcGroup.add(guideLine);

      // Dynamic Jumping Beam Trail Geometry (32 vertex points along the active curve slice)
      const trailCount = 32;
      const positions = new Float32Array(trailCount * 3);
      const colors = new Float32Array(trailCount * 3);

      const trailGeo = new THREE.BufferGeometry();
      const posAttr = new THREE.BufferAttribute(positions, 3);
      const colAttr = new THREE.BufferAttribute(colors, 3);
      trailGeo.setAttribute('position', posAttr);
      trailGeo.setAttribute('color', colAttr);

      const trailMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const trailLine = new THREE.Line(trailGeo, trailMat);
      arcGroup.add(trailLine);

      // Jumping Head Core (Brilliant white core)
      const headCoreGeo = new THREE.SphereGeometry(1.6, 16, 16);
      const headCoreMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
      });
      const headMesh = new THREE.Mesh(headCoreGeo, headCoreMat);
      arcGroup.add(headMesh);

      // Jumping Head Outer Glow Halo (Vibrant colored aura)
      const headHaloGeo = new THREE.SphereGeometry(3.0, 16, 16);
      const headHaloMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(route.headColor),
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const headGlowMesh = new THREE.Mesh(headHaloGeo, headHaloMat);
      arcGroup.add(headGlowMesh);

      jumpingBeams.push({
        fromId: route.from,
        toId: route.to,
        curve,
        color: new THREE.Color(route.color),
        headColor: new THREE.Color(route.headColor),
        duration: route.duration,
        delay: route.delay,
        trailLength: route.trailLength,
        headMesh,
        headGlowMesh,
        trailLine,
        posAttr,
        colAttr,
        trailCount,
      });
    });

    // 8. Raycaster for 3D Marker Interactivity
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasPointerMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);
      const hitMeshes = markerObjects.map((m) => m.hitMesh);
      const intersects = raycaster.intersectObjects(hitMeshes);

      if (intersects.length > 0) {
        const foundId = intersects[0].object.userData.officeId;
        renderer.domElement.style.cursor = 'pointer';
        onHoverLocation?.(foundId);
      } else {
        renderer.domElement.style.cursor = 'grab';
        onHoverLocation?.(null);
      }
    };

    const handleCanvasClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const hitMeshes = markerObjects.map((m) => m.hitMesh);
      const intersects = raycaster.intersectObjects(hitMeshes);
      if (intersects.length > 0) {
        const foundId = intersects[0].object.userData.officeId as 'hyderabad' | 'bengaluru' | 'dubai';
        onSelectLocation(foundId);
      }
    };

    renderer.domElement.addEventListener('mousemove', handleCanvasPointerMove);
    renderer.domElement.addEventListener('click', handleCanvasClick);

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 10. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const renderLoop = () => {
      animationFrameId = requestAnimationFrame(renderLoop);
      clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      const state = animStateRef.current;

      // Smooth mouse parallax interpolation
      state.mouseX += (state.targetMouseX - state.mouseX) * 0.05;
      state.mouseY += (state.targetMouseY - state.mouseY) * 0.05;

      // Auto-rotation around vertical axis if active
      if (state.isRotating) {
        state.targetRotY += 0.0018;
      }

      // Smooth spherical interpolation (damping/easing) toward target rotation
      state.currentRotY += (state.targetRotY - state.currentRotY) * 0.06;
      state.currentRotX += (state.targetRotX - state.currentRotX) * 0.06;

      // Apply rotations to globe
      globeGroup.rotation.y = state.currentRotY + state.mouseX;
      globeGroup.rotation.x = state.currentRotX + state.mouseY;

      // Animate marker ripple rings and landing impact flashes
      markerObjects.forEach((m, idx) => {
        m.impactIntensity = Math.max(0, m.impactIntensity - 0.035);
        const speed = 1.6;
        const phase = (elapsedTime * speed + idx * 0.5) % 1;
        const baseScale = 1.0 + phase * 1.5;
        const impactScale = 1.0 + m.impactIntensity * 2.0;
        const currentScale = Math.max(baseScale, impactScale);

        m.ringMesh.scale.set(currentScale, currentScale, currentScale);
        const baseAlpha = Math.max(0, 1.0 - phase) * 0.7;
        const impactAlpha = m.impactIntensity * 0.95;
        (m.ringMesh.material as THREE.MeshBasicMaterial).opacity = Math.max(baseAlpha, impactAlpha);
      });

      // Animate dynamic jumping lines hopping from branch to branch
      jumpingBeams.forEach((beam) => {
        const cycleDuration = beam.duration + 0.55; // jump time + pause before launching next
        const localTime = (elapsedTime + beam.delay) % cycleDuration;
        const isJumping = localTime < beam.duration;

        if (!isJumping) {
          beam.headMesh.visible = false;
          beam.headGlowMesh.visible = false;
          // Clear trail
          const posArr = beam.posAttr.array as Float32Array;
          posArr.fill(0);
          beam.posAttr.needsUpdate = true;
          return;
        }

        beam.headMesh.visible = true;
        beam.headGlowMesh.visible = true;

        // Progress 0 to 1
        const progress = localTime / beam.duration;

        // Ballistic parabolic jump easing: slow launch -> rapid mid-flight arc -> smooth dive landing
        const easedT =
          progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        // Position head at current point along curve
        const headPoint = beam.curve.getPoint(easedT);
        beam.headMesh.position.copy(headPoint);
        beam.headGlowMesh.position.copy(headPoint);

        // Pulsing head scale for high energy
        const pulse = 1.0 + Math.sin(elapsedTime * 18) * 0.22;
        beam.headMesh.scale.set(pulse, pulse, pulse);
        beam.headGlowMesh.scale.set(pulse * 1.5, pulse * 1.5, pulse * 1.5);

        // Update jumping line trail geometry (trailing elastic curved ribbon)
        const count = beam.trailCount;
        const posArr = beam.posAttr.array as Float32Array;
        const colArr = beam.colAttr.array as Float32Array;

        for (let i = 0; i < count; i++) {
          const frac = i / (count - 1); // 0 at tail, 1 at head
          // Parameter along curve
          const s = Math.max(0, Math.min(1, easedT - beam.trailLength * (1 - frac)));
          const pt = beam.curve.getPoint(s);

          posArr[i * 3] = pt.x;
          posArr[i * 3 + 1] = pt.y;
          posArr[i * 3 + 2] = pt.z;

          // Power alpha curve: bright near head, tapering smoothly at tail
          const alpha = Math.pow(frac, 1.8);
          // Color transition: blends from branch color at tail to luminous head color
          const c = beam.color.clone().lerp(beam.headColor, frac);
          colArr[i * 3] = c.r * alpha;
          colArr[i * 3 + 1] = c.g * alpha;
          colArr[i * 3 + 2] = c.b * alpha;
        }

        beam.posAttr.needsUpdate = true;
        beam.colAttr.needsUpdate = true;

        // When jumping line arrives at destination (progress > 0.88), trigger landing impact
        if (progress > 0.88) {
          const destMarker = markerObjects.find((m) => m.id === beam.toId);
          if (destMarker) {
            destMarker.impactIntensity = Math.max(
              destMarker.impactIntensity,
              1.0 - (progress - 0.88) / 0.12
            );
          }
        }
      });

      renderer.render(scene, camera);
    };

    renderLoop();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('mousemove', handleCanvasPointerMove);
      renderer.domElement.removeEventListener('click', handleCanvasClick);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      globeGeometry.dispose();
      globeMaterial.dispose();
      earthTexture.dispose();
      bumpMap.dispose();
    };
  }, [onSelectLocation, onHoverLocation]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-full min-h-[460px] sm:min-h-[560px] lg:min-h-[640px] select-none overflow-hidden ${className}`}
    >
      {/* Fallback if WebGL is disabled */}
      {!isWebGLSupported && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-sky-50/80 backdrop-blur-sm rounded-3xl border border-sky-100" />
      )}

      {/* Floating 3D Globe Control Panel (Icon-Only Rotate/Pause and Reset View) */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/80 shadow-md">
        <button
          onClick={() => setIsRotating(!isRotating)}
          title={isRotating ? 'Pause rotation' : 'Resume auto-rotation'}
          aria-label={isRotating ? 'Pause rotation' : 'Resume auto-rotation'}
          className="p-2 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-600 transition-colors cursor-pointer"
        >
          {isRotating ? (
            <Pause className="w-4 h-4 text-amber-500" />
          ) : (
            <Play className="w-4 h-4 text-emerald-500" />
          )}
        </button>

        <button
          onClick={() => {
            animStateRef.current.targetRotY = getTargetRotationY(78.3888);
            animStateRef.current.targetRotX = getTargetRotationX(17.4947);
            setIsRotating(true);
          }}
          title="Reset globe view"
          aria-label="Reset globe view"
          className="p-2 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-600 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
