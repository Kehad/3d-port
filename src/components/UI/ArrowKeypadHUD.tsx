import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Keyboard, LogIn } from 'lucide-react';
import type { VehicleControlsState } from '../../hooks/useVehicleControls';

interface ArrowKeypadHUDProps {
  controls: VehicleControlsState;
  onSetControl: (key: keyof VehicleControlsState, value: boolean) => void;
  showEnterAction?: boolean;
  onEnterAction?: () => void;
}

export const ArrowKeypadHUD: React.FC<ArrowKeypadHUDProps> = ({
  controls,
  onSetControl,
  showEnterAction = false,
  onEnterAction,
}) => {
  return (
    <div className="fixed bottom-6 left-6 z-30 select-none pointer-events-auto flex items-end gap-3">
      <div className="glass-panel p-3 sm:p-3.5 rounded-2xl border border-white/15 shadow-2xl flex flex-col items-center gap-1.5">
        {/* Header Indicator */}
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400 uppercase tracking-widest">
          <Keyboard className="w-3 h-3 text-sky-400" />
          <span>CONTROLS</span>
        </div>

        {/* Directional Pad */}
        <div className="flex flex-col items-center gap-1.5">
          {/* UP Button */}
          <button
            onMouseDown={() => onSetControl('up', true)}
            onMouseUp={() => onSetControl('up', false)}
            onMouseLeave={() => onSetControl('up', false)}
            onTouchStart={(e) => {
              e.preventDefault();
              onSetControl('up', true);
            }}
            onTouchEnd={() => onSetControl('up', false)}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
              controls.up
                ? 'bg-sky-500 text-slate-950 border-sky-300 shadow-glow-cyan scale-95'
                : 'bg-slate-900/80 text-white border-white/15 hover:bg-slate-800'
            }`}
            title="Accelerate / Move Forward (W / Up)"
            aria-label="Forward"
          >
            <ArrowUp className="w-4 h-4" />
          </button>

          {/* LEFT, DOWN, RIGHT Row */}
          <div className="flex items-center gap-1.5">
            <button
              onMouseDown={() => onSetControl('left', true)}
              onMouseUp={() => onSetControl('left', false)}
              onMouseLeave={() => onSetControl('left', false)}
              onTouchStart={(e) => {
                e.preventDefault();
                onSetControl('left', true);
              }}
              onTouchEnd={() => onSetControl('left', false)}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                controls.left
                  ? 'bg-sky-500 text-slate-950 border-sky-300 shadow-glow-cyan scale-95'
                  : 'bg-slate-900/80 text-white border-white/15 hover:bg-slate-800'
              }`}
              title="Steer Left (A / Left)"
              aria-label="Left"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onMouseDown={() => onSetControl('down', true)}
              onMouseUp={() => onSetControl('down', false)}
              onMouseLeave={() => onSetControl('down', false)}
              onTouchStart={(e) => {
                e.preventDefault();
                onSetControl('down', true);
              }}
              onTouchEnd={() => onSetControl('down', false)}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                controls.down
                  ? 'bg-rose-500 text-slate-950 border-rose-300 shadow-lg scale-95'
                  : 'bg-slate-900/80 text-white border-white/15 hover:bg-slate-800'
              }`}
              title="Brake / Reverse (S / Down)"
              aria-label="Brake or Reverse"
            >
              <ArrowDown className="w-4 h-4" />
            </button>

            <button
              onMouseDown={() => onSetControl('right', true)}
              onMouseUp={() => onSetControl('right', false)}
              onMouseLeave={() => onSetControl('right', false)}
              onTouchStart={(e) => {
                e.preventDefault();
                onSetControl('right', true);
              }}
              onTouchEnd={() => onSetControl('right', false)}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                controls.right
                  ? 'bg-sky-500 text-slate-950 border-sky-300 shadow-glow-cyan scale-95'
                  : 'bg-slate-900/80 text-white border-white/15 hover:bg-slate-800'
              }`}
              title="Steer Right (D / Right)"
              aria-label="Right"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Action / Enter Button (shown when near mansion or always available) */}
      {showEnterAction && (
        <button
          onClick={onEnterAction}
          className="glass-panel py-3 px-3.5 rounded-2xl border border-sky-400 bg-sky-500/20 text-white shadow-glow-cyan flex flex-col items-center gap-1 cursor-pointer hover:scale-105 active:scale-95 transition-all"
        >
          <LogIn className="w-5 h-5 text-sky-400" />
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase">
            ENTER [E]
          </span>
        </button>
      )}
    </div>
  );
};
