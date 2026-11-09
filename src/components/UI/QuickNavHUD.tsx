import React from 'react';
import {
  Home,
  Wrench,
  Award,
  Layers,
  Volume2,
  VolumeX,
  Footprints,
  Bike,
  Car as CarIcon,
  Compass,
  RotateCcw,
} from 'lucide-react';
import { MansionId, LocomotionMode } from '../../types/testsprite';
import { MANSION_WAYPOINTS } from '../../data/mansionsData';

interface QuickNavHUDProps {
  currentMansionId: MansionId | null;
  locomotion: LocomotionMode;
  speed: number;
  progress: number;
  isInterior: boolean;
  isAudioActive: boolean;
  onToggleAudio: () => void;
  onFastJumpToMansion: (id: MansionId) => void;
  onDirectOpenInterior: (id: MansionId) => void;
  onResetToStart: () => void;
}

export const QuickNavHUD: React.FC<QuickNavHUDProps> = ({
  currentMansionId,
  locomotion,
  speed,
  progress,
  isInterior,
  isAudioActive,
  onToggleAudio,
  onFastJumpToMansion,
  onDirectOpenInterior,
  onResetToStart,
}) => {
  const speedDisplay = Math.round(
    Math.min(
      locomotion === 'foot' ? 14 : locomotion === 'bicycle' ? 45 : 160,
      Math.abs(speed) * (locomotion === 'foot' ? 100 : locomotion === 'bicycle' ? 380 : 850)
    )
  );

  const navItems: { id: MansionId; label: string; icon: React.ReactNode }[] = [
    { id: 'hero', label: 'Hero Manor', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'skills', label: 'Skills Lab', icon: <Wrench className="w-3.5 h-3.5" /> },
    { id: 'experience', label: 'Experience Archive', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'projects', label: 'Project Pavilion', icon: <Layers className="w-3.5 h-3.5" /> },
  ];

  return (
    <>
      {/* Top Center: Recruiter Fast-Track Navigation Override */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-40 pointer-events-auto select-none max-w-full px-2">
        <div className="glass-panel py-1.5 px-2.5 sm:px-4 rounded-full border border-white/15 shadow-2xl flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1.5 pr-2 border-r border-white/10 hidden md:flex">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
              FAST NAV
            </span>
          </div>

          {/* Mansion Quick Jump Buttons */}
          {navItems.map((item) => {
            const isCurrent = currentMansionId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onDirectOpenInterior(item.id)}
                className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                  isCurrent
                    ? 'bg-sky-500/25 border border-sky-400 text-sky-300 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title={`Fast Jump into ${item.label}`}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Top Right: Telemetry & Sound Utility */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2 pointer-events-auto">
        <button
          onClick={onToggleAudio}
          className={`p-2 rounded-full border transition-all ${
            isAudioActive
              ? 'border-sky-400 bg-sky-500/20 text-sky-300 shadow-glow-cyan'
              : 'border-white/10 bg-slate-900/60 text-slate-400 hover:text-white'
          }`}
          title={isAudioActive ? 'Mute sound' : 'Enable sound'}
        >
          {isAudioActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={onResetToStart}
          className="p-2 rounded-full border border-white/10 bg-slate-900/60 text-slate-400 hover:text-white transition-all"
          title="Reset back to starting driveway"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Right: Cyber/Speed Telemetry */}
      {!isInterior && (
        <aside
          aria-label="Vehicle Telemetry"
          className="fixed bottom-6 right-6 z-30 pointer-events-auto select-none hidden sm:block"
        >
          <div className="glass-panel p-3.5 rounded-2xl border border-white/15 shadow-2xl flex items-center gap-4">
            <div className="flex flex-col items-center pr-3 border-r border-white/10">
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-2xl font-black text-white leading-none">
                  {speedDisplay.toString().padStart(3, '0')}
                </span>
                <span className="text-[10px] text-sky-400 font-bold uppercase">KM/H</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 uppercase mt-0.5 flex items-center gap-1">
                {locomotion === 'foot' && <Footprints className="w-3 h-3 text-emerald-400" />}
                {locomotion === 'bicycle' && <Bike className="w-3 h-3 text-sky-400" />}
                {locomotion === 'car' && <CarIcon className="w-3 h-3 text-amber-400" />}
                {locomotion}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                ROUTE PROGRESS
              </span>
              <div className="w-24 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 via-purple-400 to-amber-400"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {Math.round(progress * 100)}% Traveled
              </span>
            </div>
          </div>
        </aside>
      )}
    </>
  );
};

