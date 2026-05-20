import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Hotspot } from '../types';
import { Compass, Info, MapPin } from 'lucide-react';

interface PanoramaViewerProps {
  onHotspotClick: (hotspot: Hotspot) => void;
  autoRotate: boolean;
  selectedHotspot: Hotspot | null;
  activeFloor: number;
}

// Our 4 carefully-crafted hotspots
const HOTSPOTS: Hotspot[] = [
  {
    id: 'spruce_canopy',
    name: 'フィンランド製スプルースの波状ファサード / Wooden Spruce Facade',
    description: '1F entrance canopy. The sweeping wooden waves are made from local Finnish spruce, blending traditional craftsmanship with natural curves.',
    lat: -5,
    lon: 170,
    category: 'architecture',
  },
  {
    id: 'book_heaven',
    name: '3F「本の天国」/ Floating Book Heaven',
    description: 'The top floor library features a completely glass-walled ceiling, bringing local Nordic light indoors to create a warm, calm reading space.',
    lat: 15,
    lon: 180,
    category: 'interior',
  },
  {
    id: 'kansalaistori',
    name: '市民広場 / Kansalaistori Public Plaza',
    description: 'The civic square directly outside Oodi integrates the library building with the urban public space, hosting festivals and cultural gatherings.',
    lat: -14,
    lon: 140,
    category: 'urban',
  },
  {
    id: 'parliament_connection',
    name: '国会議事堂との対話 / Architectural Dialogue',
    description: 'Oodi sits directly opposite Finland\'s Parliament House. This conscious alignment symbolises transparency and citizens\' active democratic role.',
    lat: 2,
    lon: -25,
    category: 'history',
  }
];

export default function PanoramaViewer({
  onHotspotClick,
  autoRotate,
  selectedHotspot,
  activeFloor,
}: PanoramaViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hotspotContainerRef = useRef<HTMLDivElement>(null);
  const hotspotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Camera settings
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Use refs to avoid recreating animating handlers on state changes
  const statesRef = useRef({
    lon: 45, // longitudinal angle in degrees
    lat: 3,  // latitudinal angle in degrees
    targetLon: 150,
    targetLat: 0,
    isUserInteracting: false,
    onPointerDownPointerX: 0,
    onPointerDownPointerY: 0,
    onPointerDownLon: 0,
    onPointerDownLat: 0,
    fov: 75,
    lastInteractionTime: 0,
    activeFloor: 1,
  });

  // Track active floor updates to trigger smooth look-to rotations
  useEffect(() => {
    statesRef.current.activeFloor = activeFloor;
    const now = Date.now();
    statesRef.current.lastInteractionTime = now;
    
    // Smoothly pan camera to face floor specific angles
    if (activeFloor === 1) {
      statesRef.current.targetLon = 170; // Sweep spruce
      statesRef.current.targetLat = -5;
    } else if (activeFloor === 2) {
      statesRef.current.targetLon = -25; // Floor 2 focused on city
      statesRef.current.targetLat = 2;
    } else if (activeFloor === 3) {
      statesRef.current.targetLon = 180; // Sky-lit roof
      statesRef.current.targetLat = 15;
    }
  }, [activeFloor]);

  // Hook to handle selected hotspot centering
  useEffect(() => {
    if (selectedHotspot) {
      statesRef.current.targetLon = selectedHotspot.lon;
      statesRef.current.targetLat = selectedHotspot.lat;
      statesRef.current.lastInteractionTime = Date.now();
    }
  }, [selectedHotspot]);

  // Main Three.js Boilerplate and Lifecycle management
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // SCENE, CAMERA & RENDERER
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(statesRef.current.fov, width / height, 1, 1100);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    // SPHERE GEOMETRY & MATERIAL
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    // Invert the sphere geometry to display the texture inside out
    geometry.scale(-1, 1, 1);

    // TEXTURE LOADER WITH FALLBACK
    const textureLoader = new THREE.TextureLoader();
    let sphereMaterial: THREE.MeshBasicMaterial;

    setLoading(true);

    // Primary image path
    const primaryTextureUrl = '/image.png';
    // Clean sunset panoramic sphere fallback (hosted stably on netlify)
    const fallbackTextureUrl = 'https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg';

    const loadTexture = (url: string, isFallback: boolean) => {
      textureLoader.load(
        url,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          
          if (!sphereMaterial) {
            sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });
            const sphere = new THREE.Mesh(geometry, sphereMaterial);
            scene.add(sphere);
          } else {
            sphereMaterial.map = texture;
            sphereMaterial.needsUpdate = true;
          }
          setLoading(false);
          setLoadError(isFallback); // Show notice if using fallback
        },
        undefined,
        (err) => {
          console.warn(`Failed to load texture from: ${url}. Error:`, err);
          if (!isFallback) {
            // Attempt fallback immediately
            console.log('Loading high-fidelity sunset panorama fallback...');
            loadTexture(fallbackTextureUrl, true);
          } else {
            setLoading(false);
            setLoadError(true);
          }
        }
      );
    };

    loadTexture(primaryTextureUrl, false);

    // ANIMATION & FRAME LOOP
    let animationFrameId: number;
    const tempV = new THREE.Vector3();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const states = statesRef.current;
      const now = Date.now();

      // If user is not interacting, either slowly auto-rotate OR smoothly transition to targeting point
      if (!states.isUserInteracting) {
        const timeSinceActive = now - states.lastInteractionTime;
        
        // Dynamic smooth centering animation
        const centerSpeed = 0.05;
        const lonDiff = states.targetLon - states.lon;
        const latDiff = states.targetLat - states.lat;

        // Apply smooth interpolation for floor transitions and clicks
        if (Math.abs(lonDiff) > 0.1 || Math.abs(latDiff) > 0.1) {
          states.lon += lonDiff * centerSpeed;
          states.lat += latDiff * centerSpeed;
        } else if (autoRotate && timeSinceActive > 3000) {
          // Slow drift auto-rotation when inactive
          states.lon += 0.04;
        }
      }

      // Constrain latitude between -85 and 85 to prevent camera flipping at the poles
      states.lat = Math.max(-85, Math.min(85, states.lat));

      // Coordinate matching: Convert angles to look direction
      const phi = THREE.MathUtils.degToRad(90 - states.lat);
      const theta = THREE.MathUtils.degToRad(states.lon);

      const target = new THREE.Vector3();
      target.x = 500 * Math.sin(phi) * Math.sin(theta);
      target.y = 500 * Math.cos(phi);
      target.z = 500 * Math.sin(phi) * Math.cos(theta);

      camera.lookAt(target);

      // Render Scene
      renderer.render(scene, camera);

      // PROJECT HOTSPOTS
      HOTSPOTS.forEach((hotspot, idx) => {
        const el = hotspotRefs.current[idx];
        if (!el) return;

        const hPhi = THREE.MathUtils.degToRad(hotspot.lat);
        const hTheta = THREE.MathUtils.degToRad(hotspot.lon);

        // Convert spherical coords of hotspot to 3D Cartesian
        tempV.set(
          400 * Math.sin(hTheta) * Math.cos(hPhi),
          400 * Math.sin(hPhi),
          400 * Math.cos(hTheta) * Math.cos(hPhi)
        );

        // Project the vector onto screen coordinates using current camera projection
        tempV.project(camera);

        // Check if the hotspot is behind the camera frustum (z > 1)
        const isBehind = tempV.z > 1;

        if (isBehind) {
          el.style.display = 'none';
        } else {
          el.style.display = 'flex';
          // Convert clip space coordinates (-1 to 1) to screen percentage (0 to 100%)
          const posX = (tempV.x * 0.5 + 0.5) * 100;
          const posY = (-tempV.y * 0.5 + 0.5) * 100;
          
          el.style.left = `${posX}%`;
          el.style.top = `${posY}%`;
        }
      });
    };

    animate();

    // INTERACTION EVENT HANDLERS
    const onPointerDown = (event: PointerEvent) => {
      // Disable if clicking on an interactive button/element directly
      if ((event.target as HTMLElement).closest('.hotspot-btn')) return;

      const states = statesRef.current;
      states.isUserInteracting = true;
      states.lastInteractionTime = Date.now();

      states.onPointerDownPointerX = event.clientX;
      states.onPointerDownPointerY = event.clientY;
      states.onPointerDownLon = states.lon;
      states.onPointerDownLat = states.lat;

      containerRef.current?.classList.add('cursor-grabbing');
    };

    const onPointerMove = (event: PointerEvent) => {
      const states = statesRef.current;
      if (!states.isUserInteracting) return;

      const dX = event.clientX - states.onPointerDownPointerX;
      const dY = event.clientY - states.onPointerDownPointerY;

      // Sensitivity factor. Higher is faster camera drag speed.
      const sensitivity = 0.15;
      states.lon = states.onPointerDownLon - dX * sensitivity;
      states.lat = states.onPointerDownLat + dY * sensitivity;
      states.lastInteractionTime = Date.now();

      // Sync targets with current lon/lat once drag starts to prevent immediate snaps
      states.targetLon = states.lon;
      states.targetLat = states.lat;
    };

    const onPointerUp = () => {
      statesRef.current.isUserInteracting = false;
      containerRef.current?.classList.remove('cursor-grabbing');
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const states = statesRef.current;
      // Scroll to modify zoom (FOV)
      states.fov = Math.max(30, Math.min(110, states.fov + event.deltaY * 0.05));
      camera.fov = states.fov;
      camera.updateProjectionMatrix();
      states.lastInteractionTime = Date.now();
    };

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    // Attach listeners
    const el = containerRef.current;
    el.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    el.addEventListener('wheel', onWheel, { passive: false });
    
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(el);

    // Cleanup functions
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      el.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('wheel', onWheel);

      if (containerRef.current && renderer.domElement) {
        try {
          containerRef.current.removeChild(renderer.domElement);
        } catch (e) {
          // already removed or unmounted
        }
      }
      
      geometry.dispose();
      if (sphereMaterial) {
        sphereMaterial.dispose();
        if (sphereMaterial.map) sphereMaterial.map.dispose();
      }
      renderer.dispose();
    };
  }, [autoRotate]);

  return (
    <div className="absolute inset-0 w-full h-full select-none" id="panorama-stage">
      {/* Canvas Mount */}
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab transition-all duration-300"
      />

      {/* Overlaid 3D Hotspots Mount */}
      <div 
        ref={hotspotContainerRef} 
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {HOTSPOTS.map((hotspot, idx) => {
          const isSelected = selectedHotspot?.id === hotspot.id;
          return (
            <button
              key={hotspot.id}
              ref={(el) => {
                hotspotRefs.current[idx] = el;
              }}
              onClick={() => onHotspotClick(hotspot)}
              className="hotspot-btn absolute justify-center items-center pointer-events-auto"
              style={{
                display: 'none',
                transform: 'translate(-50%, -50%)',
                zIndex: isSelected ? 30 : 20,
              }}
              title={hotspot.name}
              id={`hotspot-${hotspot.id}`}
            >
              {/* Hotspot Ring Animation */}
              <span className="relative flex h-8 w-8 items-center justify-center">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${
                  isSelected ? 'bg-sky-400' : 'bg-cyan-500'
                }`} />
                <span className={`relative inline-flex rounded-full h-6 w-6 items-center justify-center border border-white/20 shadow-lg cursor-pointer transition-transform duration-300 hover:scale-125 focus:ring-2 focus:ring-sky-500 focus:outline-none ${
                  isSelected 
                    ? 'bg-sky-400 text-slate-950 shadow-[0_0_15px_rgba(56,189,248,0.8)]' 
                    : 'bg-slate-900/80 text-cyan-300 hover:bg-slate-950/90'
                }`}>
                  {hotspot.category === 'architecture' && <Compass className="w-3.5 h-3.5" />}
                  {hotspot.category === 'interior' && <Info className="w-3.5 h-3.5" />}
                  {hotspot.category === 'urban' && <MapPin className="w-3.5 h-3.5" />}
                  {hotspot.category === 'history' && <MapPin className="w-3.5 h-3.5" />}
                </span>
              </span>

              {/* Minimal floating tag */}
              <div className={`hidden md:block absolute left-full ml-3 py-1 px-2.5 rounded-md border text-xs whitespace-nowrap select-none shadow-md backdrop-blur-md transition-all duration-300 ${
                isSelected 
                  ? 'bg-sky-500/80 text-white border-sky-400' 
                  : 'bg-slate-950/70 border-white/10 text-white/90 hover:bg-slate-900/80'
              }`}>
                {hotspot.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md z-50">
          <div className="relative w-16 h-16 flex items-center justify-center mb-4">
            <div className="absolute w-12 h-12 rounded-full border-2 border-t-sky-500 border-r-sky-500 border-b-transparent border-l-transparent animate-spin" />
            <div className="absolute w-16 h-16 rounded-full border border-sky-500/20" />
            <div className="text-sky-400 font-mono text-[10px] uppercase tracking-widest animate-pulse">OODI</div>
          </div>
          <div className="text-sm font-medium text-slate-300 mb-1">
            Loading Virtual Space...
          </div>
          <div className="text-[10px] font-mono text-slate-500 animate-pulse">
            CYLINDRICAL RADIUS: 500PX | FOV: 75
          </div>
        </div>
      )}

      {/* Fallback Notice */}
      {loadError && !loading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-950/80 border border-sky-500/30 text-sky-400 text-[11px] font-mono py-1.5 px-3 rounded-full shadow-lg backdrop-blur-md z-40 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          IMAGE PROXIED IN DEMO MODE (FALLBACK LOADED)
        </div>
      )}
    </div>
  );
}
