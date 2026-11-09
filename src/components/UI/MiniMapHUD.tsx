import React, { useMemo } from 'react';
import { MANSION_WAYPOINTS } from '../../data/mansionsData';
import { MansionId } from '../../types/testsprite';
import { Compass, Navigation } from 'lucide-react';

interface MiniMapHUDProps {
  progress: number; // 0 to 1 along curve
  playerHeading?: number; // radians
  nearbyMansionId: MansionId | null;
  onWaypointClick: (id: MansionId) => void;
}

export const MiniMapHUD: React.FC<MiniMapHUDProps> = ({
  progress,
  playerHeading = 0,
  nearbyMansionId,
  onWaypointClick,
}) => {
  // Roadway spline control points projected into a 100x100 SVG space
  // Road goes from bottom (Z: -230, progress: 0) to top (Z: 480, progress: 1)
  const roadPathD = useMemo(() => {
    // Generate sampled points along normalized progress
    return 'M 50 88 C 50 78, 62 66, 60 56 C 58 46, 38 38, 42 28 C 45 20, 56 16, 50 12';
  }, []);

  // Map progress (0 to 1) to (x, y) along the mini-map SVG curve
  const getMapCoordinates = (t: number) => {
    // Piecewise cubic approximation matching the S-curve road
    // t: 0 -> (50, 88)
    // t: 0.12 (Hero) -> (56, 76)
    // t: 0.38 (Skills) -> (52, 54)
    // t: 0.65 (Experience) -> (41, 35)
    // t: 0.90 (Projects) -> (51, 19)
    // t: 1.0 -> (50, 12)
    const y = 88 - t * 76;
    let x = 50;
    if (t < 0.25) {
      x = 50 + Math.sin(t * Math.PI * 2) * 12;
    } else if (t < 0.55) {
      x = 50 + Math.sin((t - 0.25) * Math.PI * 2) * 14;
    } else if (t < 0.8) {
      x = 50 - Math.sin((t - 0.55) * Math.PI * 2) * 12;
    } else {
      x = 50 + Math.sin((t - 0.8) * Math.PI * 2) * 8;
    }
    return { x, y };
  };

  const playerPos = getMapCoordinates(progress);

  return (
    <aside
      aria-label="Interactive Navigation Mini-Map"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 select-none pointer-events-auto"
    >
      <div className="relative group">
        {/* Radar Map Container: 105px on mobile, 165px on desktop (PRD §4.3 & §5) */}
        <div className="w-[105px] h-[105px] sm:w-[165px] sm:h-[165px] rounded-full bg-slate-950/85 backdrop-blur-md border-2 border-sky-500/40 shadow-2xl relative overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:border-sky-400 group-hover:shadow-[0_0_25px_rgba(56,189,248,0.35)]">
          {/* Subtle Radar Background Grid Rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
            <div className="w-3/4 h-3/4 rounded-full border border-sky-400" />
            <div className="absolute w-1/2 h-1/2 rounded-full border border-sky-400" />
            <div className="absolute w-full h-[1px] bg-sky-400/40" />
            <div className="absolute h-full w-[1px] bg-sky-400/40" />
          </div>

          {/* Rotating Radar Sweep Beam */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background: 'conic-gradient(from 0deg at 50% 50%, rgba(56, 189, 248, 0.4) 0deg, transparent 60deg, transparent 360deg)',
              animation: 'spin 4s linear infinite',
            }}
          />

          {/* Compass Cardinal Marks */}
          <span className="absolute top-1 text-[8px] sm:text-[9px] font-mono font-bold text-sky-400/70 pointer-events-none">
            N
          </span>
          <span className="absolute bottom-1 text-[8px] sm:text-[9px] font-mono font-bold text-slate-500 pointer-events-none">
            S
          </span>
          <span className="absolute left-1 text-[8px] sm:text-[9px] font-mono font-bold text-slate-500 pointer-events-none">
            W
          </span>
          <span className="absolute right-1 text-[8px] sm:text-[9px] font-mono font-bold text-slate-500 pointer-events-none">
            E
          </span>

          {/* SVG Map Canvas */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full relative z-10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Roadway Spline Path */}
            <path
              d={roadPathD}
              stroke="#334155"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d={roadPathD}
              stroke="#0284c7"
              strokeWidth="2"
              strokeDasharray="2 3"
              strokeLinecap="round"
              className="opacity-70"
            />

            {/* Traveled portion highlight */}
            <circle
              cx={playerPos.x}
              cy={playerPos.y}
              r="2.5"
              fill="#38bdf8"
              className="animate-pulse"
            />

            {/* 4 Landmark Mansions Waypoints */}
            {MANSION_WAYPOINTS.map((wp, index) => {
              const wpPos = getMapCoordinates(wp.progress);
              const isNearby = nearbyMansionId === wp.id;
              const waypointNumber = index + 1;

              return (
                <g
                  key={wp.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onWaypointClick(wp.id);
                  }}
                  className="cursor-pointer transition-transform hover:scale-125"
                >
                  {/* Glowing Radius Ring when in detection range */}
                  {isNearby && (
                    <circle
                      cx={wpPos.x}
                      cy={wpPos.y}
                      r="6.5"
                      fill="none"
                      stroke={wp.themeColor}
                      strokeWidth="1.2"
                      className="animate-ping opacity-75"
                    />
                  )}

                  {/* Waypoint Base Pin */}
                  <circle
                    cx={wpPos.x}
                    cy={wpPos.y}
                    r={isNearby ? '4.5' : '3.6'}
                    fill={isNearby ? wp.themeColor : '#0f172a'}
                    stroke={wp.themeColor}
                    strokeWidth="1.5"
                  />

                  {/* Waypoint Number Label (1, 2, 3, 4) */}
                  <text
                    x={wpPos.x}
                    y={wpPos.y + 1.2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isNearby ? '#020617' : '#ffffff'}
                    fontSize="3.8"
                    fontFamily="monospace"
                    fontWeight="bold"
                    className="select-none pointer-events-none"
                  >
                    {waypointNumber}
                  </text>
                </g>
              );
            })}

            {/* Live-updating Player Directional Pin (PRD §4.3) */}
            <g
              transform={`translate(${playerPos.x}, ${playerPos.y}) rotate(${
                (playerHeading * 180) / Math.PI
              })`}
            >
              {/* Player Arrow / Directional Chevron */}
              <polygon
                points="0,-4.5 3.5,3.5 0,1.8 -3.5,3.5"
                fill="#38bdf8"
                stroke="#ffffff"
                strokeWidth="0.8"
              />
            </g>
          </svg>
        </div>

        {/* Mini-map Title & Legend */}
        <div className="mt-1 text-center">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/90 border border-white/10 text-[9px] sm:text-[10px] font-mono text-slate-300">
            <Compass className="w-2.5 h-2.5 text-sky-400" />
            <span>RADAR // 4 MANSIONS</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

