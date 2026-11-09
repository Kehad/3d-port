import React, { useState } from 'react';
import { Award, Calendar, MapPin, Briefcase, LogOut, CheckCircle2 } from 'lucide-react';
import { EXPERIENCES } from '../../data/experiences';

interface ExperienceInteriorProps {
  onExit: () => void;
}

export const ExperienceInterior: React.FC<ExperienceInteriorProps> = ({ onExit }) => {
  const [selectedExpId, setSelectedExpId] = useState(EXPERIENCES[0].id);

  const activeExp = EXPERIENCES.find((e) => e.id === selectedExpId) || EXPERIENCES[0];

  return (
    <div className="w-full max-w-4xl glass-panel rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-emerald-500/30 overflow-y-auto max-h-[85vh] animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
          <Award className="w-3.5 h-3.5 text-emerald-400" />
          MANSION 03 // TROPHY ROOM &amp; TIMELINE GALLERY
        </span>
        <button
          onClick={onExit}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-1.5 border border-white/10"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Room</span>
        </button>
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
        Career Milestones &amp; History
      </h1>
      <p className="text-xs sm:text-sm text-slate-300 mb-6 font-mono leading-relaxed">
        Chronological archive of shipped systems, team leadership, and engineering achievements.
      </p>

      {/* Interactive Plaque Station Rail */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {EXPERIENCES.map((exp) => {
          const isSelected = selectedExpId === exp.id;
          return (
            <button
              key={exp.id}
              onClick={() => setSelectedExpId(exp.id)}
              className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-950/70 border-emerald-400 shadow-glow-emerald text-white'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-400">
                  Stop 0{exp.stationNumber}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {exp.period.split('—')[0]}
                </span>
              </div>
              <span className="text-xs font-bold leading-tight mt-1 truncate">
                {exp.company}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Plaque Detail View */}
      <div className="bg-slate-900/80 rounded-2xl p-5 sm:p-6 border border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-bold text-slate-950 uppercase tracking-wider font-mono"
            style={{ backgroundColor: activeExp.accentColor }}
          >
            {activeExp.type}
          </span>
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {activeExp.period}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
          {activeExp.role}
        </h2>
        <div className="flex items-center gap-2 text-sm text-emerald-400 font-semibold mb-4">
          <span>{activeExp.company}</span>
          <span className="text-slate-600">•</span>
          <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
            <MapPin className="w-3.5 h-3.5" />
            {activeExp.location}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
          {activeExp.summary}
        </p>

        {/* Metrics Grid */}
        {activeExp.metrics && (
          <div className="grid grid-cols-2 gap-3 mb-5">
            {activeExp.metrics.map((m, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  {m.label}
                </div>
                <div className="text-base font-bold font-mono text-emerald-300">
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Accomplishments */}
        <div className="mb-5">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
            Key Accomplishments
          </div>
          <ul className="space-y-2">
            {activeExp.highlights.map((h, i) => (
              <li key={i} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/10">
          {activeExp.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs rounded-md bg-slate-800 text-slate-200 border border-slate-700 font-mono"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

