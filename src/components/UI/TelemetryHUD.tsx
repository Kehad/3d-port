import React from 'react';
import { Compass, Volume2, VolumeX, Eye, Video, RotateCcw, Car as CarIcon, Bike, Footprints } from 'lucide-react';
import { getZoneFromProgress } from '../../utils/roadCurve';
import type { CameraMode } from '../../types/experience';
import type { TravelMode } from '../../types/portfolio';

interface TelemetryHUDProps {
  progress: number;
  speed: number;
  travelMode: TravelMode;
  onSelectMode: (mode: TravelMode) => void;
  carCoords: { x: number; y: number; z: number };
  cameraMode: CameraMode;
  onCameraModeChange: (mode: CameraMode) => void;
  isAudioActive: boolean;
  onToggleAudio: () => void;
  onJumpToSector: (progress: number) => void;
  onReset: () => void;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({
  progress,
  speed,
  travelMode,
  onSelectMode,
  carCoords,
  cameraMode,
  onCameraModeChange,
  isAudioActive,
  onToggleAudio,
  onJumpToSector,
  onReset,
}) => {
  const zone = getZoneFromProgress(progress);

  // Speed scaling depends on mode: Walking max ~15 km/h, Car ~180, Bike ~220
  const speedMultiplier = travelMode === 'walk' ? 90 : travelMode === 'motorcycle' ? 1150 : 950;
  const maxDisplaySpeed = travelMode === 'walk' ? 14 : travelMode === 'motorcycle' ? 220 : 180;
  const displaySpeed = Math.round(Math.min(maxDisplaySpeed, Math.abs(speed) * speedMultiplier));

  const sectors = [
    { label: 'GARAGE', code: '01', progress: 0.01 },
    { label: 'SKILLS', code: '02', progress: 0.24 },
    { label: 'EXPERIENCE', code: '03', progress: 0.52 },
    { label: 'SHOWROOM', code: '04', progress: 0.79 },
  ];

  return (
    <>
      {/* Top Left: Minimal Sector & World Coordinates */}
      <header className="fixed top-6 left-6 z-30 pointer-events-none select-none flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
          <span className="text-[11px] font-mono tracking-widest text-sky-400 font-bold uppercase">
            {zone.code} // {zone.name}
          </span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 flex items-center gap-3">
          <span>X: {carCoords.x.toFixed(1)}</span>
          <span>Y: {carCoords.y.toFixed(1)}</span>
          <span>Z: {carCoords.z.toFixed(1)}</span>
          <span className="text-sky-300 font-semibold">[{Math.round(progress * 100)}%]</span>
        </div>
      </header>

      {/* Top Right: Quick Mode Switcher & Utility Buttons */}
      <div className="fixed top-6 right-6 z-30 flex items-center gap-2 pointer-events-auto">
        {/* Travel Mode Toggle */}
        <div className="glass-panel p-1 rounded-full border border-white/10 flex items-center gap-1">
          <button
            onClick={() => onSelectMode('walk')}
            className={`p-1.5 rounded-full transition-all text-xs flex items-center gap-1 ${
              travelMode === 'walk'
                ? 'bg-emerald-500/25 text-emerald-300 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Switch mode: Walk on foot"
          >
            <Footprints className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono hidden sm:inline px-1">Walk</span>
          </button>

          <button
            onClick={() => onSelectMode('car')}
            className={`p-1.5 rounded-full transition-all text-xs flex items-center gap-1 ${
              travelMode === 'car'
                ? 'bg-sky-500/25 text-sky-300 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Switch mode: Drive a car"
          >
            <CarIcon className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono hidden sm:inline px-1">Car</span>
          </button>

          <button
            onClick={() => onSelectMode('motorcycle')}
            className={`p-1.5 rounded-full transition-all text-xs flex items-center gap-1 ${
              travelMode === 'motorcycle'
                ? 'bg-purple-500/25 text-purple-300 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Switch mode: Drive a motorcycle"
          >
            <Bike className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono hidden sm:inline px-1">Bike</span>
          </button>
        </div>

        {/* Camera Mode Cycle */}
        <button
          onClick={() => {
            const nextMode: CameraMode =
              cameraMode === 'cinematic'
                ? 'chase'
                : cameraMode === 'chase'
                ? 'topDown'
                : cameraMode === 'topDown'
                ? 'freeOrbit'
                : 'cinematic';
            onCameraModeChange(nextMode);
          }}
          className="glass-pill px-3 py-1.5 rounded-full text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-1.5 shadow-md border border-white/10 hover:border-white/20"
          title="Switch Camera View: Cinematic / Sport / TopDown / 360 Orbit"
        >
          {cameraMode === 'freeOrbit' ? (
            <Compass className="w-3.5 h-3.5 text-purple-400" />
          ) : cameraMode === 'topDown' ? (
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Video className="w-3.5 h-3.5 text-sky-400" />
          )}
          <span className="uppercase text-[11px]">{cameraMode}</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={onToggleAudio}
          className={`p-2 rounded-full border transition-all ${
            isAudioActive
              ? 'border-sky-400 bg-sky-500/20 text-sky-300 shadow-glow-cyan'
              : 'border-white/10 bg-slate-900/60 text-slate-400 hover:text-white'
          }`}
          title={isAudioActive ? 'Mute engine audio' : 'Enable engine audio'}
        >
          {isAudioActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        {/* Reset to Garage */}
        <button
          onClick={onReset}
          className="p-2 rounded-full border border-white/10 bg-slate-900/60 text-slate-400 hover:text-white transition-all"
          title="Reset back to Garage"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Right: Cyber Speedometer & Telemetry Pod */}
      <aside
        aria-label="Vehicle Telemetry"
        className="fixed bottom-6 right-6 z-30 pointer-events-auto select-none"
      >
        <div className="glass-panel p-3.5 sm:p-4 rounded-2xl border border-white/15 shadow-2xl flex items-center gap-4">
          {/* Speed & Gear Gauge */}
          <div className="flex flex-col items-center border-r border-white/10 pr-3 sm:pr-4">
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-2xl sm:text-3xl font-black text-white leading-none tracking-tight">
                {displaySpeed.toString().padStart(3, '0')}
              </span>
              <span className="text-[10px] text-sky-400 font-semibold uppercase">
                KM/H
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[10px] font-mono text-slate-400">
              <span
                className={`px-1.5 py-0.2 rounded font-bold uppercase ${
                  travelMode === 'walk'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : zone.gear === 'P'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-sky-500/20 text-sky-300'
                }`}
              >
                {travelMode === 'walk' ? 'WALK' : `GEAR: ${zone.gear}`}
              </span>
            </div>
          </div>

          {/* Sector Dot Rail */}
          <nav aria-label="Sector checkpoints" className="flex flex-col gap-1.5">
            <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
              SECTORS
            </div>
            <div className="flex items-center gap-2">
              {sectors.map((s, idx) => {
                const isCurrentSector =
                  (idx === 0 && progress < 0.18) ||
                  (idx === 1 && progress >= 0.18 && progress < 0.48) ||
                  (idx === 2 && progress >= 0.48 && progress < 0.74) ||
                  (idx === 3 && progress >= 0.74);

                return (
                  <button
                    key={s.code}
                    onClick={() => onJumpToSector(s.progress)}
                    className="group relative flex flex-col items-center py-1 cursor-pointer"
                    title={`Jump to Sector ${s.code}: ${s.label}`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                        isCurrentSector
                          ? 'border-sky-400 bg-sky-400 scale-125 shadow-glow-cyan'
                          : 'border-slate-600 bg-slate-900 group-hover:border-slate-400'
                      }`}
                    />
                    <span
                      className={`text-[9px] font-mono mt-1 transition-colors ${
                        isCurrentSector ? 'text-sky-300 font-bold' : 'text-slate-500'
                      }`}
                    >
                      {s.code}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </aside>

      {/* Minimal Left-Edge Vertical Scroll Progress Rail */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center gap-2 pointer-events-none select-none">
        <span className="text-[9px] font-mono text-slate-500 rotate-90 origin-center mb-4 tracking-widest">
          PROGRESS
        </span>
        <div className="w-1 h-36 rounded-full bg-slate-800/80 overflow-hidden relative">
          <div
            className="w-full bg-gradient-to-b from-sky-400 via-purple-400 to-amber-400 rounded-full transition-all duration-75"
            style={{ height: `${Math.min(progress * 100, 100)}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-slate-400 mt-2">
          {Math.round(progress * 100)}%
        </span>
      </div>
    </>
  );
};
