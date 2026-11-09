import React, { useState } from 'react';
import { Wrench, Sparkles, LogOut, CheckCircle2, Cpu, ExternalLink, ShieldCheck, Zap } from 'lucide-react';
import { SKILL_GATES } from '../../data/skills';

interface SkillsInteriorProps {
  onExit: () => void;
}

export const SkillsInterior: React.FC<SkillsInteriorProps> = ({ onExit }) => {
  const [selectedCategory, setSelectedCategory] = useState(SKILL_GATES[0].id);
  const activeGate = SKILL_GATES.find((g) => g.id === selectedCategory) || SKILL_GATES[0];
  const [selectedSkillName, setSelectedSkillName] = useState(activeGate.skills[0].name);

  // Sync selected skill when category changes
  const currentSkill =
    activeGate.skills.find((s) => s.name === selectedSkillName) || activeGate.skills[0];

  // Helper metadata per skill
  const getSkillMeta = (name: string, level: number) => {
    const years = level > 92 ? '5+ Years' : level > 85 ? '3-4 Years' : '2+ Years';
    const status = level > 92 ? 'Mastery / Production Core' : level > 85 ? 'Advanced / High-Throughput' : 'Proficient / Production';
    const relatedProject =
      name.includes('Three') || name.includes('GLSL')
        ? 'NeuroSpatial 3D Engine & TestSprite Portfolio'
        : name.includes('React') || name.includes('TypeScript')
        ? 'AeroDynamics Telemetry Studio'
        : name.includes('Rust') || name.includes('Wasm')
        ? 'QuantumLedger Zero-Knowledge Rollup'
        : 'Enterprise High-Scale Microservices';
    return { years, status, relatedProject };
  };

  const meta = getSkillMeta(currentSkill.name, currentSkill.level);

  return (
    <div className="w-full max-w-3xl glass-panel rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-purple-500/30 overflow-y-auto max-h-[85vh] animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1.5 shadow-sm">
          <Wrench className="w-3.5 h-3.5 text-purple-400" />
          MANSION 02 // INTERACTIVE WAREHOUSE &amp; TOOLBOARD
        </span>
        <button
          onClick={onExit}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-1.5 border border-white/10 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit to Overworld</span>
        </button>
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
        Technical Skills &amp; Hardware Toolboard
      </h1>
      <p className="text-xs sm:text-sm text-slate-300 mb-6 font-mono leading-relaxed">
        Select a toolboard category and click any hardware chip or tool to inspect production proficiencies, experience depth, and shipped implementations.
      </p>

      {/* Category Tabs (PRD §4.5) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {SKILL_GATES.map((gate) => {
          const isSelected = selectedCategory === gate.id;
          return (
            <button
              key={gate.id}
              onClick={() => {
                setSelectedCategory(gate.id);
                setSelectedSkillName(gate.skills[0].name);
              }}
              className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-purple-900/40 border-purple-400 shadow-glow-purple text-white'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10'
              }`}
            >
              <span className="text-[10px] font-mono uppercase tracking-wider block opacity-75">
                0{gate.gateNumber}
              </span>
              <span className="text-xs font-bold leading-tight mt-1">
                {gate.category.split('&')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Category Toolboard */}
      <div className="bg-slate-900/70 rounded-2xl p-5 border border-white/10 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: activeGate.accentColor }}
            />
            {activeGate.category}
          </h2>
          <span className="text-xs font-mono text-slate-400">
            {activeGate.gateName}
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed mb-5">
          {activeGate.description}
        </p>

        {/* Skill Gauges / Clickable Toolboard Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {activeGate.skills.map((skill) => {
            const isSkillSelected = currentSkill.name === skill.name;
            return (
              <button
                key={skill.name}
                onClick={() => setSelectedSkillName(skill.name)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSkillSelected
                    ? 'bg-purple-500/20 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)] scale-[1.02]'
                    : 'bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5 w-full">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                    {skill.name}
                  </span>
                  <span
                    className="text-xs font-mono font-bold"
                    style={{ color: activeGate.accentColor }}
                  >
                    {skill.level}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${skill.level}%`,
                      backgroundColor: activeGate.accentColor,
                    }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>{isSkillSelected ? 'INSPECTING' : 'CLICK TO INSPECT'}</span>
                  {skill.tag && (
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                      {skill.tag}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* ITEM INSPECTION WORKBENCH (PRD §4.5: Tool & Hardware Chip Inspection) */}
        <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 animate-in fade-in duration-200">
          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-purple-500/20">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                CHIP INSPECTION // {currentSkill.name}
              </span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 border border-purple-400/30">
              {meta.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-white/5">
              <span className="text-[10px] font-mono text-slate-400 block mb-0.5">
                EXPERIENCE DEPTH
              </span>
              <span className="font-bold text-white flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                {meta.years}
              </span>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-white/5">
              <span className="text-[10px] font-mono text-slate-400 block mb-0.5">
                PROFICIENCY SCORE
              </span>
              <span className="font-bold text-purple-300 font-mono">
                {currentSkill.level} / 100 Benchmark
              </span>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-white/5">
              <span className="text-[10px] font-mono text-slate-400 block mb-0.5">
                CODE AUDIT
              </span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified in Prod
              </span>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-300">
            <span className="text-slate-400">Shipped Reference Implementation: </span>
            <span className="font-bold text-sky-300">{meta.relatedProject}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
