import React, { useState } from 'react';
import { ExternalLink, Github, Sparkles, Layers, LogOut } from 'lucide-react';
import { PROJECTS } from '../../data/projects';

interface ProjectInteriorProps {
  onExit: () => void;
}

export const ProjectInterior: React.FC<ProjectInteriorProps> = ({ onExit }) => {
  const [selectedProjId, setSelectedProjId] = useState(PROJECTS[0].id);

  const activeProj = PROJECTS.find((p) => p.id === selectedProjId) || PROJECTS[0];

  return (
    <div className="w-full max-w-4xl glass-panel rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-amber-500/30 overflow-y-auto max-h-[85vh] animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          MANSION 04 // DIGITAL EXHIBITION ROOM
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
        Shipped Projects &amp; Demos
      </h1>
      <p className="text-xs sm:text-sm text-slate-300 mb-6 font-mono leading-relaxed">
        Interactive 3D showcases, architecture overviews, and live deployment links for featured systems.
      </p>

      {/* Project Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6">
        {PROJECTS.map((proj) => {
          const isSelected = selectedProjId === proj.id;
          return (
            <button
              key={proj.id}
              onClick={() => setSelectedProjId(proj.id)}
              className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-950/70 border-amber-400 shadow-glow-amber text-white'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] font-mono uppercase font-bold text-amber-400">
                  Bay 0{proj.bayNumber}
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  {proj.hologramType}
                </span>
              </div>
              <span className="text-sm font-bold text-white truncate">
                {proj.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Featured Project Showcase */}
      <div className="bg-slate-900/80 rounded-2xl p-5 sm:p-6 border border-white/10">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-bold text-slate-950 uppercase tracking-wider font-mono"
            style={{ backgroundColor: activeProj.accentColor }}
          >
            0{activeProj.bayNumber} // Shipped Showcase
          </span>
          <span className="text-xs font-mono text-slate-400">
            {activeProj.hologramType.toUpperCase()} HOLOGRAM
          </span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-1">
          {activeProj.title}
        </h2>
        <p className="text-sm text-amber-400 font-mono mb-4">
          {activeProj.subtitle}
        </p>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
          {activeProj.description}
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {activeProj.metrics.map((m, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                {m.label}
              </div>
              <div className="text-base font-bold font-mono text-amber-300">
                {m.value}
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack Tags */}
        <div className="mb-6">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Architecture &amp; Libraries
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeProj.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 text-xs rounded-md bg-slate-800 text-slate-200 border border-slate-700 font-mono"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons: Live Prototype & Source Repo */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
          {activeProj.liveUrl && (
            <a
              href={activeProj.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-glow-amber transition-all flex items-center justify-center gap-2"
            >
              <span>Launch Live Prototype</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {activeProj.githubUrl && (
            <a
              href={activeProj.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="py-3 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all flex items-center gap-2 border border-white/15"
            >
              <Github className="w-4 h-4" />
              <span>Inspect Source Code</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

