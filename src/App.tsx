import React, { useState } from 'react';
import PanoramaViewer from './components/PanoramaViewer';
import DashboardUI from './components/DashboardUI';
import { Hotspot } from './types';

export default function App() {
  const [autoRotate, setAutoRotate] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [activeFloor, setActiveFloor] = useState(1);

  const handleHotspotClick = (hotspot: Hotspot) => {
    setSelectedHotspot(hotspot);
    setAutoRotate(false); // Stop auto-rotating when focusing on a hotspot details panel
  };

  const handleSelectFloor = (floor: number) => {
    setActiveFloor(floor);
    setSelectedHotspot(null); // Clear selected hotspot when changing floor heights
  };

  const handleCloseHotspot = () => {
    setSelectedHotspot(null);
  };

  const handleToggleAutoRotate = () => {
    setAutoRotate(prev => !prev);
  };

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden" id="app-viewport">
      {/* Three.js 360-degree Panorama Layer */}
      <PanoramaViewer
        onHotspotClick={handleHotspotClick}
        autoRotate={autoRotate}
        selectedHotspot={selectedHotspot}
        activeFloor={activeFloor}
      />

      {/* Floating Aero Navigation Dashboard UI Overlays */}
      <DashboardUI
        autoRotate={autoRotate}
        onToggleAutoRotate={handleToggleAutoRotate}
        selectedHotspot={selectedHotspot}
        onCloseHotspot={handleCloseHotspot}
        activeFloor={activeFloor}
        onSelectFloor={handleSelectFloor}
      />
    </div>
  );
}
