import React from 'react';
import { Terminal, Github, Linkedin, Mail } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between glass-panel border-b border-white/10">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-glow-cyan">
          <Terminal className="w-5 h-5" />
        </div>
        <div>
          <div className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
            Alex Chen
            <span className="w-2 h-2 rounded-full bg-emerald-400" title="Available for projects" />
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            Creative Technologist & 3D Engineer
          </div>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-6 text-xs font-mono">
        <a href="#hero" className="text-slate-300 hover:text-sky-400 transition-colors">
          01 // About
        </a>
        <a href="#experience" className="text-slate-300 hover:text-sky-400 transition-colors">
          02 // Journey
        </a>
        <a href="#contact" className="text-slate-300 hover:text-sky-400 transition-colors">
          03 // Contact
        </a>
      </div>

      <div className="flex items-center gap-2.5">
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          title="GitHub"
        >
          <Github className="w-4 h-4" />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noreferrer"
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          title="LinkedIn"
        >
          <Linkedin className="w-4 h-4" />
        </a>
        <a
          href="#contact"
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors flex items-center gap-1.5"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Hire Me</span>
        </a>
      </div>
    </nav>
  );
};

