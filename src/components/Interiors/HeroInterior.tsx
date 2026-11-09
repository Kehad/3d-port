import React from 'react';
import {
  FileText,
  Mail,
  Github,
  Linkedin,
  MapPin,
  ExternalLink,
  Sparkles,
  LogOut,
  Download,
} from 'lucide-react';
import { HERO_BIO } from '../../data/mansionsData';

interface HeroInteriorProps {
  onExit: () => void;
}

export const HeroInterior: React.FC<HeroInteriorProps> = ({ onExit }) => {
  return (
    <div className="w-full max-w-2xl glass-panel rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-sky-500/30 overflow-y-auto max-h-[85vh] animate-in fade-in duration-300">
      {/* Header Badge */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center gap-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          MANSION 01 // LIVING ROOM &amp; STUDY
        </span>
        <button
          onClick={onExit}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-1.5 border border-white/10"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Room</span>
        </button>
      </div>

      {/* Name & Headline */}
      <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
        {HERO_BIO.name}
      </h1>
      <p className="text-base sm:text-lg font-bold bg-gradient-to-r from-sky-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent mb-2">
        {HERO_BIO.headline}
      </p>
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mb-6">
        <MapPin className="w-3.5 h-3.5 text-sky-400" />
        <span>{HERO_BIO.location}</span>
      </div>

      {/* Professional Summary */}
      <div className="bg-slate-900/60 rounded-2xl p-4 sm:p-5 border border-white/10 mb-6">
        <h2 className="text-xs font-mono uppercase tracking-wider text-sky-400 mb-2 font-bold">
          Professional Narrative
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
          {HERO_BIO.summary}
        </p>
        <p className="text-xs text-slate-400 italic font-serif border-l-2 border-sky-400 pl-3">
          &ldquo;{HERO_BIO.philosophy}&rdquo;
        </p>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
        {HERO_BIO.stats.map((stat, i) => (
          <div
            key={i}
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-center flex flex-col justify-center"
          >
            <span className="text-lg sm:text-xl font-black text-sky-300 font-mono">
              {stat.value}
            </span>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mt-0.5">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Action Links & Resume Download */}
      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
        <a
          href={HERO_BIO.resumeUrl}
          onClick={(e) => {
            e.preventDefault();
            alert('Resume download triggered: Alex_Chen_Resume_2026.pdf');
          }}
          className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-glow-cyan transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Download Official Resume (PDF)</span>
        </a>

        <div className="flex items-center gap-2">
          <a
            href={HERO_BIO.socials.github}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors border border-white/10"
            title="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={HERO_BIO.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors border border-white/10"
            title="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href={`mailto:${HERO_BIO.socials.email}`}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors border border-white/10"
            title="Send Email"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

