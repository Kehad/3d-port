import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Video,
  Eye,
  Compass,
  Car as CarIcon,
  Sparkles,
} from 'lucide-react';
import { CameraMode, ExperienceItem } from '../../types/experience';
import { EXPERIENCES } from '../../data/experiences';

interface JourneyControlsProps {
  progress: number;
  onSeek: (progress: number) => void;
  activeExperience: ExperienceItem | null;
  onSelectExperience: (exp: ExperienceItem) => void;
  cameraMode: CameraMode;
  onCameraModeChange: (mode: CameraMode) => void;
  isAutoDriving: boolean;
  onToggleAutoDrive: () => void;
  isAudioActive: boolean;
  onToggleAudio: () => void;
  onReset: () => void;
  showWorldCard: boolean;
  onToggleWorldCard: () => void;
}

export const JourneyControls: React.FC<JourneyControlsProps> = ({
  progress,
  onSeek,
  activeExperience,
  onSelectExperience,
  cameraMode,
  onCameraModeChange,
  isAutoDriving,
  onToggleAutoDrive,
  isAudioActive,
  onToggleAudio,
  onReset,
  showWorldCard,
  onToggleWorldCard,
}) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-[95vw] max-w-4xl flex flex-col items-center gap-3 pointer-events-none">
      {/* Milestone Checkpoint Station Pills */}
      <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2.5 pointer-events-auto">
        {EXPERIENCES.map((exp) => {
          const isSelected = activeExperience?.id === exp.id;
          return (
            <button
              key={exp.id}
              onClick={() => onSelectExperience(exp)}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${
                isSelected
                  ? 'border-white/40 bg-slate-900/90 shadow-lg scale-105'
                  : 'border-white/10 bg-slate-950/70 hover:bg-slate-900/90 hover:border-white/20 text-slate-300'
              }`}
              style={{
                boxShadow: isSelected ? `0 0 20px ${exp.accentColor}55` : undefined,
                borderColor: isSelected ? exp.accentColor : undefined,
              }}
            >
              <span
                className="w-2 h-2 rounded-full transition-transform group-hover:scale-125"
                style={{ backgroundColor: exp.accentColor }}
              />
              <span className="font-mono text-[11px] text-slate-400 group-hover:text-white">
                0{exp.stationNumber}
              </span>
              <span className="font-semibold text-slate-100 hidden sm:inline">
                {exp.company}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Glass Control Dock */}
      <div className="glass-panel w-full rounded-2xl p-3 sm:p-4 shadow-2xl flex flex-col sm:flex-row items-center gap-3 sm:gap-5 border border-white/15 pointer-events-auto">
        {/* Play/Pause & Reset Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleAutoDrive}
            className={`p-2.5 rounded-xl transition-all font-semibold flex items-center gap-1.5 text-xs ${
              isAutoDriving
                ? 'bg-sky-500 text-slate-950 shadow-glow-cyan'
                : 'bg-white/10 hover:bg-white/15 text-white'
            }`}
            title={isAutoDriving ? 'Pause auto-cruise' : 'Start auto-cruise tour'}
          >
            {isAutoDriving ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span className="hidden md:inline">
              {isAutoDriving ? 'Cruising' : 'Auto-Drive'}
            </span>
          </button>

          <button
            onClick={onReset}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
            title="Reset road journey to start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Scrub Timeline with Station Notches */}
        <div className="relative flex-1 w-full flex items-center py-2">
          {/* Track Bar Background */}
          <div className="relative w-full h-2 rounded-full bg-slate-800/90 overflow-hidden cursor-pointer">
            <div
              className="h-full bg-gradient-to-r from-sky-400 via-purple-400 to-amber-400 transition-all duration-75"
              style={{ width: `${Math.min(progress * 100, 100)}%` }}
            />
          </div>

          {/* Hidden range input over timeline for smooth scrub */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.002"
            value={progress}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-ew-resize z-20"
            aria-label="Experience Road Timeline Progress"
          />

          {/* Station Markers on Timeline */}
          {EXPERIENCES.map((exp) => (
            <div
              key={exp.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectExperience(exp);
              }}
              style={{ left: `${exp.progress * 100}%` }}
              className="absolute -top-1 -translate-x-1/2 cursor-pointer z-10 group"
              title={`Jump to 0${exp.stationNumber}: ${exp.company}`}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                  activeExperience?.id === exp.id
                    ? 'border-white scale-125'
                    : 'border-slate-800 group-hover:scale-110'
                }`}
                style={{ backgroundColor: exp.accentColor }}
              >
                <div className="w-1 h-1 rounded-full bg-slate-950" />
              </div>
            </div>
          ))}

          {/* Car Icon Tracker Indicator */}
          <div
            className="absolute -top-2.5 -translate-x-1/2 pointer-events-none transition-all duration-75 z-20"
            style={{ left: `${progress * 100}%` }}
          >
            <div className="w-7 h-7 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center shadow-lg shadow-sky-400/50">
              <CarIcon className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Camera Views & Audio Dock */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Camera Mode Selector */}
          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => onCameraModeChange('cinematic')}
              className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                cameraMode === 'cinematic'
                  ? 'bg-sky-500/20 text-sky-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Dynamic Cinematic Chase Cam"
            >
              <Video className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Cinema</span>
            </button>
            <button
              onClick={() => onCameraModeChange('chase')}
              className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                cameraMode === 'chase'
                  ? 'bg-sky-500/20 text-sky-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Sport Cockpit / Bumper Cam"
            >
              <CarIcon className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Sport</span>
            </button>
            <button
              onClick={() => onCameraModeChange('topDown')}
              className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                cameraMode === 'topDown'
                  ? 'bg-sky-500/20 text-sky-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Top-Down Bird's Eye View"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Iso</span>
            </button>
            <button
              onClick={() => onCameraModeChange('freeOrbit')}
              className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                cameraMode === 'freeOrbit'
                  ? 'bg-sky-500/20 text-sky-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Free 360° Orbit (Drag to rotate)"
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">360°</span>
            </button>
          </div>

          {/* Toggle Drei 3D World Card vs 2D HUD Card */}
          <button
            onClick={onToggleWorldCard}
            className={`p-2.5 rounded-xl border transition-all text-xs flex items-center gap-1 ${
              showWorldCard
                ? 'border-purple-400 bg-purple-500/20 text-purple-300'
                : 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
            title="Toggle between 3D In-World Station Card vs Fixed 2D Overlay Card"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Audio Engine Hum & Chimes */}
          <button
            onClick={onToggleAudio}
            className={`p-2.5 rounded-xl border transition-all ${
              isAudioActive
                ? 'border-sky-400 bg-sky-500/20 text-sky-300 shadow-glow-cyan'
                : 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-400'
            }`}
            title={isAudioActive ? 'Mute engine audio' : 'Enable realistic engine sound effects'}
          >
            {isAudioActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

