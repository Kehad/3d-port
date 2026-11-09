import React from 'react';
import { Mail, Github, Linkedin, ArrowUp, Send, Check } from 'lucide-react';

export const OutroSection: React.FC = () => {
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="relative bg-[#090a0f] border-t border-white/10 py-24 px-6 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Next Destination
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight mb-4">
              Let&apos;s Build Something Extraordinary.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              Currently open to select technical advisory, senior/lead engineering roles, and high-impact 3D web applications.
            </p>
            <div className="flex items-center gap-4 text-sm font-mono text-slate-400">
              <a
                href="mailto:contact@alexchen.dev"
                className="hover:text-sky-400 transition-colors flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-sky-400" />
                alex@chen.dev
              </a>
            </div>
          </div>

          {/* Quick Message Card */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-3">Send a Transmission</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Your Name / Organization"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
              />
              <textarea
                rows={3}
                placeholder="Brief project outline or opportunity..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-sky-400 transition-colors resize-none"
              />
              <button
                type="submit"
                disabled={submitted}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-sky-500 hover:bg-sky-400 text-slate-950 transition-all flex items-center justify-center gap-2 shadow-glow-cyan"
              >
                {submitted ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Transmission Received</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <div>
            © {new Date().getFullYear()} Alex Chen • Interactive 3D Portfolio built with React, Three.js &amp; Tailwind CSS
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

