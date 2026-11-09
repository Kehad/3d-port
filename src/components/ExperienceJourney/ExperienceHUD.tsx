import React from 'react';
import {
  MapPin,
  Calendar,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  X,
  ExternalLink,
  Award,
  Layers,
} from 'lucide-react';
import { ExperienceItem } from '../../types/experience';
import { EXPERIENCES } from '../../data/experiences';

interface ExperienceHUDProps {
  activeExperience: ExperienceItem | null;
  onClose: () => void;
  onNavigate: (exp: ExperienceItem) => void;
}

export const ExperienceHUD: React.FC<ExperienceHUDProps> = ({
  activeExperience,
  onClose,
  onNavigate,
}) => {
  if (!activeExperience) return null;

  const currentIndex = EXPERIENCES.findIndex((e) => e.id === activeExperience.id);
  const prevExp = currentIndex > 0 ? EXPERIENCES[currentIndex - 1] : null;
  const nextExp = currentIndex < EXPERIENCES.length - 1 ? EXPERIENCES[currentIndex + 1] : null;

  return (
    <aside
      role="region"
      aria-label={`Milestone 0${activeExperience.stationNumber}: ${activeExperience.role} at ${activeExperience.company}`}
      className="fixed top-20 right-4 sm:right-8 z-30 w-[92vw] max-w-lg transition-all duration-500 ease-out transform"
    >
      <div
        className="glass-panel rounded-2xl p-6 sm:p-7 shadow-2xl text-white relative overflow-hidden transition-all duration-300 border"
        style={{
          boxShadow: `0 20px 50px -10px ${activeExperience.accentColor}30, 0 0 20px rgba(0,0,0,0.5)`,
          borderColor: `${activeExperience.accentColor}55`,
        }}
      >
        {/* Top Glow Accent Bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{
            background: `linear-gradient(90deg, transparent, ${activeExperience.accentColor}, transparent)`,
          }}
        />

        {/* Header Bar */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span
              className="px-2.5 py-1 text-xs font-black rounded-lg uppercase tracking-wider text-slate-950 flex items-center gap-1.5 shadow-md"
              style={{ backgroundColor: activeExperience.accentColor }}
            >
              <Award className="w-3.5 h-3.5" />
              Stop 0{activeExperience.stationNumber}
            </span>
            <span className="text-xs font-mono font-medium text-slate-400">
              {activeExperience.stationName}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Dismiss card"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role & Company */}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1">
          {activeExperience.role}
        </h2>
        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs sm:text-sm text-slate-300 font-medium mb-4">
          <span
            className="font-semibold"
            style={{ color: activeExperience.accentColor }}
          >
            {activeExperience.company}
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1 text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            {activeExperience.period}
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1 text-slate-400">
            <MapPin className="w-3.5 h-3.5" />
            {activeExperience.location}
          </span>
        </div>

        {/* Summary */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
          {activeExperience.summary}
        </p>

        {/* Key Metrics */}
        {activeExperience.metrics && activeExperience.metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-5">
            {activeExperience.metrics.map((metric, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex flex-col justify-center"
              >
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                  {metric.label}
                </span>
                <span
                  className="text-lg font-bold font-mono"
                  style={{ color: activeExperience.accentColor }}
                >
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Highlights */}
        <div className="mb-5">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-sky-400" />
            Key Accomplishments
          </div>
          <ul className="space-y-1.5">
            {activeExperience.highlights.map((highlight, i) => (
              <li key={i} className="text-xs sm:text-[13px] text-slate-300 flex items-start gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{ backgroundColor: activeExperience.accentColor }}
                />
                <span className="leading-snug">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech Stack Badges */}
        <div className="mb-6">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            Tech Stack & Tools
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeExperience.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 text-xs rounded-md bg-slate-800/80 text-slate-200 border border-slate-700/60 font-mono"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Checkpoint Navigation Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
          <button
            onClick={() => prevExp && onNavigate(prevExp)}
            disabled={!prevExp}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all ${
              prevExp
                ? 'border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 cursor-pointer'
                : 'border-transparent text-slate-600 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Previous Stop
          </button>

          <span className="font-mono text-slate-400">
            {currentIndex + 1} / {EXPERIENCES.length}
          </span>

          <button
            onClick={() => nextExp && onNavigate(nextExp)}
            disabled={!nextExp}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all ${
              nextExp
                ? 'border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 cursor-pointer'
                : 'border-transparent text-slate-600 cursor-not-allowed'
            }`}
          >
            Next Stop
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

