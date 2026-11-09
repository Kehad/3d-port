import React from 'react';
import { Calendar, MapPin, Briefcase, Award, CheckCircle2 } from 'lucide-react';
import { EXPERIENCES } from '../../data/experiences';

export const FallbackTimeline: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto text-white">
      <div className="text-center mb-16">
        <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20">
          Career Trajectory
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight">
          Experience Milestones
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
          Standard timeline view of career stops, engineering leadership, and key technological achievements.
        </p>
      </div>

      <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-8 space-y-12">
        {EXPERIENCES.map((exp) => (
          <div key={exp.id} className="relative pl-6 sm:pl-10">
            {/* Glowing Milestone Checkpoint Node */}
            <div
              className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full border-4 border-slate-950 flex items-center justify-center shadow-lg"
              style={{ backgroundColor: exp.accentColor }}
            >
              <span className="text-[11px] font-black text-slate-950 font-mono">
                {exp.stationNumber}
              </span>
            </div>

            {/* Content Card */}
            <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-white/10 hover:border-white/20 transition-all shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold text-slate-950 uppercase tracking-wider"
                  style={{ backgroundColor: exp.accentColor }}
                >
                  {exp.type}
                </span>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {exp.period}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{exp.role}</h3>
              <div className="flex items-center gap-2 text-sm text-sky-400 font-medium mb-3">
                <span>{exp.company}</span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-slate-400 text-xs">
                  <MapPin className="w-3.5 h-3.5" />
                  {exp.location}
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                {exp.summary}
              </p>

              {/* Highlights */}
              <div className="space-y-2 mb-5">
                {exp.highlights.map((highlight, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2
                      className="w-4 h-4 flex-shrink-0 mt-0.5"
                      style={{ color: exp.accentColor }}
                    />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              {/* Tech Badges */}
              <div className="flex flex-wrap gap-1.5">
                {exp.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-xs rounded-md bg-slate-800 text-slate-300 border border-slate-700/60 font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

