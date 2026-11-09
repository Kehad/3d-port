import React from 'react';
import { DoorOpen, Sparkles } from 'lucide-react';
import { MansionWaypoint } from '../../types/testsprite';

interface ActionPromptHUDProps {
  nearbyMansion: MansionWaypoint | null;
  onEnter: (waypoint: MansionWaypoint) => void;
}

export const ActionPromptHUD: React.FC<ActionPromptHUDProps> = ({
  nearbyMansion,
  onEnter,
}) => {
  if (!nearbyMansion) return null;

  return (
    <aside
      aria-label="Mansion entrance interaction prompt"
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 pointer-events-auto select-none animate-bounce"
    >
      <button
        onClick={() => onEnter(nearbyMansion)}
        className="glass-panel py-3 px-6 rounded-2xl border border-sky-400/80 shadow-2xl flex items-center gap-3 cursor-pointer hover:bg-slate-900/90 hover:scale-105 active:scale-95 transition-all"
        style={{
          boxShadow: `0 0 35px ${nearbyMansion.themeColor}55`,
        }}
      >
        <div
          className="p-2 rounded-xl"
          style={{ backgroundColor: `${nearbyMansion.themeColor}25` }}
        >
          <DoorOpen className="w-5 h-5" style={{ color: nearbyMansion.themeColor }} />
        </div>
        <div className="text-left">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase font-bold text-sky-400">
            <Sparkles className="w-3 h-3" />
            <span>DRIVEWAY THRESHOLD // READY TO ENTER</span>
          </div>
          <div className="text-base font-black text-white">
            Enter House &bull; {nearbyMansion.name}
          </div>
        </div>
        <div className="ml-2 px-3 py-1.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/50 text-xs font-mono font-bold flex items-center gap-1">
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 rounded bg-sky-500/30 text-white border border-sky-400">E</kbd>
        </div>
      </button>
    </aside>
  );
};

