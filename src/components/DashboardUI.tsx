import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, Search, Bell, Settings, Clock, Cloud, 
  MapPin, HelpCircle, Volume2, VolumeX, RotateCw, 
  Building, Book, Hammer, Grid, Calendar, Compass as CompassIcon,
  X, Info, ExternalLink, ArrowRight
} from 'lucide-react';
import { Hotspot, FloorInfo } from '../types';

interface DashboardUIProps {
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  selectedHotspot: Hotspot | null;
  onCloseHotspot: () => void;
  activeFloor: number;
  onSelectFloor: (floor: number) => void;
}

// Floor Details corresponding to the flight stops
const FLOOR_INFOS: FloorInfo[] = [
  {
    id: 1,
    name: "1階 = 交流・イベント / Interaction & Public Space",
    tagline: "VIBRANT SOCIAL GATEWAY",
    description: "Features Oodi's spacious wooden lobby, the high-quality Kino Regina cinema, a vibrant restaurant, and public lecture venues. Designed to act as a seamless covered continuation of Helsinki's outdoor Kansalaistori public square.",
    targetLat: -5,
    targetLon: 170,
    stats: [
      { label: "Key Spaces", value: "Kino Regina, Restaurant" },
      { label: "Atmosphere", value: "Bustling, Open & Social" },
      { label: "Materials", value: "Spruce & Polished Glass" }
    ]
  },
  {
    id: 2,
    name: "2階 = 創作と実践 / Creation & Learning",
    tagline: "MAKER AND STUDIO PLAYGROUND",
    description: "An incredibly equipped digital laboratory featuring rows of 3D printers, sewing machines, high-tech recording studios, editing suites, gaming rooms, and quiet workspaces. A creative engine emphasizing active production over reading.",
    targetLat: 2,
    targetLon: -25,
    stats: [
      { label: "Tech Specs", value: "3D Printers, Laser Cutters" },
      { label: "Workstations", value: "30+ Creative Studios" },
      { label: "Concept", value: "Public Learning Workshop" }
    ]
  },
  {
    id: 3,
    name: "3階 = 本の天国 / Book Heaven",
    tagline: "FLOATING NORDIC SANCTUARY",
    description: "The traditional quiet library space, floating under an expansive cloud-like glass ceiling. Contains 100k books, fully-grown indoor trees, and lead-outs to the massive exterior Civic Balcony overlooking the country's Parliament.",
    targetLat: 15,
    targetLon: 180,
    stats: [
      { label: "Book Count", value: "100,000+ Volumes" },
      { label: "Unique Feature", value: "Living Indoor Trees" },
      { label: "View Deck", value: "Civic Balcony Landmark" }
    ]
  }
];

export default function DashboardUI({
  autoRotate,
  onToggleAutoRotate,
  selectedHotspot,
  onCloseHotspot,
  activeFloor,
  onSelectFloor
}: DashboardUIProps) {
  // Real-time Helsinki Clock in European style (EET/EEST, i.e., Eastern European timezone)
  const [helsinkiTime, setHelsinkiTime] = useState('');
  const [helsinkiDate, setHelsinkiDate] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showArchSpecs, setShowArchSpecs] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const timeOpts: Intl.DateTimeFormatOptions = {
        timeZone: 'Europe/Helsinki',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const dateOpts: Intl.DateTimeFormatOptions = {
        timeZone: 'Europe/Helsinki',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      };
      
      const now = new Date();
      setHelsinkiTime(new Intl.DateTimeFormat('en-US', timeOpts).format(now));
      setHelsinkiDate(new Intl.DateTimeFormat('en-US', dateOpts).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentFloorInfo = FLOOR_INFOS.find(f => f.id === activeFloor) || FLOOR_INFOS[0];

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-8 pointer-events-none text-white font-sans overflow-hidden select-none z-10" id="main-dashboard-ui">
      
      {/* 1. TOP NAVBAR (Artistic Flair Style, Fine Glass Backdrop) */}
      <nav className="w-full h-16 flex items-center justify-between bg-slate-950/50 backdrop-blur-xl rounded-2xl border border-white/10 px-6 pointer-events-auto shadow-2xl shrink-0">
        {/* Left Logo / Tag */}
        <div className="flex items-center gap-3.5">
          {/* Elegant Circular Logo matching the design */}
          <div className="w-8 h-8 border border-white rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-white leading-none">HELSINKI / FI</span>
            <span className="text-[8px] font-mono text-zinc-400 tracking-wider mt-0.5 uppercase">Central Library Virtual Tour</span>
          </div>
        </div>

        {/* Center Navigation Links (Adapted beautiful serif-serif typography) */}
        <div className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-widest font-light opacity-85">
          <button 
            className={`transition-all pointer-events-auto py-1 px-1.5 ${
              activeFloor === 1 ? 'border-b border-white pb-1 font-semibold text-white' : 'opacity-60 hover:opacity-100'
            }`}
            onClick={() => onSelectFloor(1)}
          >
            1F Social Events
          </button>
          <button 
            className={`transition-all pointer-events-auto py-1 px-1.5 ${
              activeFloor === 2 ? 'border-b border-white pb-1 font-semibold text-white' : 'opacity-60 hover:opacity-100'
            }`}
            onClick={() => onSelectFloor(2)}
          >
            2F Maker Studio
          </button>
          <button 
            className={`transition-all pointer-events-auto py-1 px-1.5 ${
              activeFloor === 3 ? 'border-b border-white pb-1 font-semibold text-white' : 'opacity-60 hover:opacity-100'
            }`}
            onClick={() => onSelectFloor(3)}
          >
            3F Book Heaven
          </button>
          <div className="h-3 w-px bg-white/10" />
          <button 
            className="font-semibold relative pointer-events-auto flex items-center gap-1.5 text-white"
            onClick={() => setShowArchSpecs(true)}
          >
            <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '12s' }} />
            Oodi Overview
          </button>
        </div>

        {/* Right Utilitarian Icons */}
        <div className="flex items-center gap-3.5 pointer-events-auto">
          {/* Audio toggle */}
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors duration-200"
            title="Music Toggle (Ambient Background)"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Auto rotate switch */}
          <button 
            onClick={onToggleAutoRotate}
            className={`p-2 rounded-xl hover:bg-white/5 transition-all duration-300 ${
              autoRotate ? 'text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Auto Rotate Toggle"
          >
            <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '24s' }} />
          </button>

          <div className="h-5 w-px bg-white/10 hidden sm:block" />
          
          <button 
            className="p-2 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
            onClick={() => setShowArchSpecs(true)}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Audio Element */}
      {soundEnabled && (
        <iframe 
          className="hidden" 
          src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&loop=1&playlist=jfKfPfyJRdk" 
          allow="autoplay"
        />
      )}

      {/* 2. MIDDLE VIEWPORTS (Dynamic Floating Information & Sidebar) */}
      <div className="flex-1 w-full flex flex-col md:flex-row items-start justify-between py-6 select-none overflow-hidden min-h-0">
        
        {/* Left Side: Destination Display (Helsinki, Finland) */}
        <div className="flex flex-col items-start gap-1 p-2 shrink-0">
          <div className="flex items-center gap-2 pointer-events-auto">
            <button 
              onClick={() => onSelectFloor(activeFloor === 1 ? 3 : activeFloor - 1)}
              className="flex items-center gap-1.5 py-1 px-4 rounded-full border border-white/20 bg-white/5 text-[10px] font-mono hover:bg-white/10 active:scale-95 transition-all text-slate-300"
            >
              ← Back Level
            </button>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[100px] md:text-[120px] font-serif italic leading-none mb-1 -ml-2 select-text text-white font-serif drop-shadow-md"
          >
            Oodi
          </motion.h1>
          <div className="flex flex-col select-text">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-[0.4em] leading-none">HELSINKI CENTRAL LIBRARY</span>
            <span className="text-sm font-light text-zinc-300 tracking-wide mt-2 max-w-sm">
              A modern functional space for literature, creative learning, and cultural exchange.
            </span>
          </div>

          <div className="mt-4 pointer-events-auto">
            <button 
              onClick={() => setShowArchSpecs(true)}
              className="group flex items-center gap-2.5 py-2.5 px-6 rounded-full bg-white text-black text-[11px] uppercase tracking-widest font-bold hover:bg-zinc-200 transition-all duration-300 shadow-xl"
            >
              Explore 360° Specs
              <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Center-Right Floating Panels for Hotspot or Building info */}
        <div className="w-full md:w-[360px] flex flex-col gap-4 max-h-full overflow-y-auto pointer-events-auto shrink-0 mt-4 md:mt-0">
          <AnimatePresence mode="wait">
            
            {/* If a hotspot is clicked, show its inspection drawer */}
            {selectedHotspot ? (
              <motion.div
                key={`hotspot-panel-${selectedHotspot.id}`}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.95 }}
                className="w-full rounded-3xl glass-panel-light p-6 shadow-2xl relative"
              >
                {/* Close Button */}
                <button 
                  onClick={onCloseHotspot}
                  className="absolute top-5 right-5 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Tag Header */}
                <div className="flex items-center gap-2 mb-3 text-zinc-300">
                  <span className="text-[9px] font-mono tracking-widest uppercase border border-white/20 px-2 py-0.5 rounded bg-white/5">
                    {selectedHotspot.category}
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                {/* Hotspot Name */}
                <h3 className="text-lg font-serif italic text-white select-text mb-2.5">
                  {selectedHotspot.name}
                </h3>

                {/* Content Paragraph */}
                <p className="text-xs text-zinc-300 leading-relaxed font-light mb-4 select-text">
                  {selectedHotspot.description}
                </p>

                {/* Interactive Action inside Hotspot Card */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-300 select-text">
                  <div className="flex items-center gap-1.5">
                    <CompassIcon className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '15s' }} />
                    <span>COORDS: {selectedHotspot.lat}°S, {selectedHotspot.lon}°E</span>
                  </div>
                  <span className="text-zinc-400">ACTIVE POINT</span>
                </div>
              </motion.div>
            ) : (
              /* Otherwise show Floor Specific Exploration Info Card */
              <motion.div
                key={`floor-panel-${currentFloorInfo.id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full rounded-3xl glass-panel-light p-6 shadow-2xl"
              >
                <div className="flex items-center gap-2 mb-3 text-zinc-300">
                  <span className="text-[9px] font-mono tracking-widest uppercase border border-white/20 px-2 py-0.5 rounded bg-white/5">
                    EXPLORING LEVEL
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <h3 className="text-xs font-semibold tracking-wider text-zinc-400 uppercase mb-1 font-mono">
                  {currentFloorInfo.tagline}
                </h3>
                <h2 className="text-xl font-serif italic text-white mb-3 leading-snug select-text">
                  {currentFloorInfo.name}
                </h2>

                <p className="text-xs text-zinc-300 font-light leading-relaxed mb-4 select-text">
                  {currentFloorInfo.description}
                </p>

                {/* Floor specs list */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  {currentFloorInfo.stats.map((stat, i) => (
                    <div key={i} className="flex items-center justify-between text-xs select-text">
                      <span className="text-zinc-400">{stat.label}</span>
                      <span className="text-white font-medium font-mono text-[11px]">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. LOWER SECTION (THREE GLASS WIDGETS & BOTTOM FLOW SLIDER) */}
      <div className="w-full space-y-4 pointer-events-auto shrink-0 select-text">
        {/* Three Horizontal Glass Cards (Museum style glass grids) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Time in Helsinki */}
          <div className="flex items-center justify-between p-5 rounded-2xl glass-panel-light shadow-2xl relative group overflow-hidden">
            {/* Elegant fine indicator line */}
            <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-white/45" />
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase">LOCAL TIME</span>
              <span className="text-2xl font-normal font-mono tracking-wide text-white tabular-nums">
                {helsinkiTime || "00:00:00"}
              </span>
              <span className="text-[10px] text-zinc-400 italic font-serif">
                Helsinki, {helsinkiDate || "Loading Date..."}
              </span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 shrink-0">
              <Clock className="w-5 h-5 text-white/80" />
            </div>
          </div>

          {/* Card 2: Weather in Helsinki */}
          <div className="flex items-center justify-between p-5 rounded-2xl glass-panel-light shadow-2xl relative group overflow-hidden">
            <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-white/45" />
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase">WEATHER CONDITION</span>
              <span className="text-2xl font-serif italic text-white leading-none">
                16°C
              </span>
              <span className="text-[10px] text-zinc-400 italic font-serif">
                Sunny Sunset  •  Wind: NNE 9 km/h
              </span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 shrink-0">
              <Cloud className="w-5 h-5 text-white/80" />
            </div>
          </div>

          {/* Card 3: Library Geo Stats */}
          <div className="flex items-center justify-between p-5 rounded-2xl glass-panel-light shadow-2xl relative group overflow-hidden">
            <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-white/45" />
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase">GEO COORDINATES</span>
              <span className="text-2xl font-normal font-mono tracking-wide text-white">
                60.1719° N
              </span>
              <span className="text-[10px] text-zinc-400 italic font-serif">
                24.9384° E  •  Kansalaistori Square
              </span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 shrink-0">
              <MapPin className="w-5 h-5 text-white/80" />
            </div>
          </div>
        </div>

        {/* Bottom Stepped Flow Slider (Artistic timeline with fine indicator dot tracking) */}
        <div className="w-full bg-slate-950/60 backdrop-blur-xl border border-white/10 rounded-2xl py-6 px-6 shadow-2xl relative overflow-hidden">
          {/* Timeline Stepper Progress */}
          <div className="w-full relative flex items-center justify-between h-5">
            {/* Horizontal Line track */}
            <div className="absolute left-0 right-0 h-[1px] bg-white/10 rounded" />
            {/* Beautiful White Active tracking line */}
            <div 
              className="absolute left-0 h-[1px] bg-white shadow-[0_0_10px_rgba(255,255,255,0.6)] transition-all duration-700 ease-out" 
              style={{
                width: `${activeFloor === 1 ? '0%' : activeFloor === 2 ? '50%' : '100%'}`
              }}
            />

            {/* Jet shuttle fly icon offset along the path */}
            <div 
              className="absolute h-6 -mt-3 top-1/2 flex items-center justify-center -translate-x-1/2 transition-all duration-700 ease-out"
              style={{
                left: `${activeFloor === 1 ? '0%' : activeFloor === 2 ? '50%' : '100%'}`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {/* Artistic Circle Indicator replacing standard flight jet */}
              <div className="w-5 h-5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.7)] flex items-center justify-center text-slate-950 scale-90 border border-black/40">
                <div className="w-1.5 h-1.5 bg-black rounded-full" />
              </div>
            </div>

            {/* Step Node 1: Floor 1 */}
            <button 
              onClick={() => onSelectFloor(1)}
              className="relative flex flex-col items-start z-10 font-mono transition-transform duration-300 hover:scale-105 group focus:outline-none"
            >
              <div className={`nav-dot ${activeFloor >= 1 ? 'active' : ''}`} />
            </button>

            {/* Step Node 2: Floor 2 */}
            <button 
              onClick={() => onSelectFloor(2)}
              className="relative flex flex-col items-center z-10 font-mono transition-transform duration-300 hover:scale-105 group focus:outline-none"
            >
              <div className={`nav-dot ${activeFloor >= 2 ? 'active' : ''}`} />
            </button>

            {/* Step Node 3: Floor 3 */}
            <button 
              onClick={() => onSelectFloor(3)}
              className="relative flex flex-col items-end z-10 font-mono transition-transform duration-300 hover:scale-105 group focus:outline-none"
            >
              <div className={`nav-dot ${activeFloor >= 3 ? 'active' : ''}`} />
            </button>
          </div>

          {/* Stepper text labels with fine italics */}
          <div className="flex justify-between items-center mt-3 text-[11px] font-mono font-medium">
            {/* Floor 1 label */}
            <div className="flex flex-col items-start">
              <span className={`uppercase tracking-widest text-[8px] ${activeFloor === 1 ? 'text-white font-bold' : 'text-zinc-500'}`}>01 • BASE LEVEL</span>
              <span className={`text-[13px] font-serif italic mt-0.5 ${activeFloor === 1 ? 'text-white font-semibold' : 'text-zinc-400'}`}>1F Lobby & Cinema</span>
              <span className="text-zinc-400 text-[10px] mt-0.5">Interaction Space</span>
            </div>

            {/* Floor 2 label */}
            <div className="flex flex-col items-center text-center">
              <span className={`uppercase tracking-widest text-[8px] ${activeFloor === 2 ? 'text-white font-bold' : 'text-zinc-500'}`}>02 • LAB LEVEL</span>
              <span className={`text-[13px] font-serif italic mt-0.5 ${activeFloor === 2 ? 'text-white font-semibold' : 'text-zinc-400'}`}>2F Maker Labs</span>
              <span className="text-zinc-400 text-[10px] mt-0.5">Creative Production</span>
            </div>

            {/* Floor 3 label */}
            <div className="flex flex-col items-end text-right">
              <span className={`uppercase tracking-widest text-[8px] ${activeFloor === 3 ? 'text-white font-bold' : 'text-zinc-500'}`}>03 • HEAVEN</span>
              <span className={`text-[13px] font-serif italic mt-0.5 ${activeFloor === 3 ? 'text-white font-semibold' : 'text-zinc-400'}`}>3F Book Sanctuary</span>
              <span className="text-zinc-400 text-[10px] mt-0.5">Quiet Study & Balcony</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MODAL DRAWER FOR ARCHITECTURAL SPECS */}
      <AnimatePresence>
        {showArchSpecs && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 pointer-events-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
            >
              {/* Decorative top strip */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-white/10 via-white/50 to-white/10" />

              {/* Drawer Header */}
              <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full " />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif italic text-white">ヘルシンキ中央図書館 Oodi 概要</h2>
                    <p className="text-zinc-400 text-[9px] font-mono tracking-widest uppercase mt-0.5">
                      HELSINKI CENTRAL LIBRARY OODI SPECS
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowArchSpecs(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all focus:outline-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body content */}
              <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[60vh] text-sm leading-relaxed text-zinc-300 font-sans font-light select-text">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-left bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="block text-[9px] font-mono tracking-widest text-zinc-400 uppercase">ARCHITECTS</span>
                    <span className="text-xs font-serif italic text-white mt-0.5 block">ALA Architects (Helsinki)</span>
                  </div>
                  <div className="text-left bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="block text-[9px] font-mono tracking-widest text-zinc-400 uppercase">YEAR COMPLETED</span>
                    <span className="text-xs font-serif italic text-white mt-0.5 block">2018 (独立100周年記念)</span>
                  </div>
                  <div className="text-left bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="block text-[9px] font-mono tracking-widest text-zinc-400 uppercase">FACADE MATERIAL</span>
                    <span className="text-xs font-serif italic text-white mt-0.5 block">Finnish Spruce wood cladding</span>
                  </div>
                  <div className="text-left bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="block text-[9px] font-mono tracking-widest text-zinc-400 uppercase">VISIT LEVEL</span>
                    <span className="text-xs font-serif italic text-white mt-0.5 block">20,000 sqm / 2.5m visitors annual</span>
                  </div>
                </div>

                <div className="space-y-4 pt-1 text-xs text-zinc-300 leading-relaxed font-light">
                  <p>
                    <strong>ヘルシンキ中央図書館「Oodi（オーディ）」</strong>は、フィンランド独立100周年記念事業の目玉として、2018年12月にオープンしました。「Oodi」とはフィンランド語で<strong>「頌歌（オード）」</strong>を意味し、市民や読書、デモクラシー（民主主義）を称える記念的な建築です。
                  </p>
                  <p>
                    この建物は3つのフロアがまったく異なる空間的テーマを持つ点が最大の特徴です。
                    1階は賑やかなガラス張りのオープンスペース（レストランやシアター）、2階は本格的なものづくりが体験できる工作・ラボスタジオ（3Dプリンターや録音ブース）、3階は10万冊の本に包まれる穏やかな「本の天国」となっています。
                  </p>
                  <p>
                    ALA設計事務所による巨大な木製の波状曲線ファサードは、都市環境の中で有機的に自律しながら、向かい合うフィンランド国会議事堂と視覚的、かつ社会的な対話を続けています。
                  </p>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="px-8 py-5 bg-black/45 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400 select-text">
                <span className="font-mono text-[9px]">BUILDING_UID: HELSINKI-OODI-2018</span>
                <a 
                  href="https://oodihelsinki.fi/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-1 text-white hover:underline font-serif italic text-[11px]"
                >
                  Official Web
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
