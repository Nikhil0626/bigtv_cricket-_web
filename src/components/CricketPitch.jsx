import React from 'react';

/**
 * 3D Isometric Pitch / Match Situation Graphic
 * Cricket equivalent of the NFL field tracker in Apple Sports screenshot
 */
export default function CricketPitch({ match }) {
  if (!match) return null;

  const { miniscore, status, isRecent, team1, team2 } = match;
  const t1Runs = parseInt(team1?.score?.split('/')[0], 10) || 226;
  const target = miniscore?.target || (t1Runs + 1);
  const runs = miniscore?.runs ?? (team2?.score ? parseInt(team2.score.split('/')[0], 10) : 142);

  const isWon = (status || '').toLowerCase().includes('won by') || 
                (status || '').toLowerCase().includes('beat') || 
                (status || '').toLowerCase().includes('drawn') || 
                (status || '').toLowerCase().includes('tied');
  const isCompleted = isRecent || isWon;

  // Calculate target progress percentage
  const progressPercent = isCompleted 
    ? 100 
    : (target && runs ? Math.min(100, Math.max(8, Math.round((runs / target) * 100))) : 65);

  const displayStatus = status || miniscore?.custstatus || `${team2?.name || 'Chasing team'} need ${Math.max(0, target - runs)} runs`;

  return (
    <div className="w-full px-4 my-1 flex flex-col items-center flex-shrink-0">
      {/* Match Status text */}
      <div className="text-[10px] font-bold text-amber-300/95 tracking-wide mb-1 text-center truncate max-w-full flex items-center gap-1.5 justify-center">
        {isCompleted && <span className="text-emerald-400">✓</span>}
        <span className="truncate">{displayStatus}</span>
      </div>

      {/* Isometric 3D Cricket Pitch Container */}
      <div className="w-full max-w-[310px] relative h-[44px] flex items-center justify-center">
        {/* Pitch perspective container */}
        <div 
          className="relative w-full h-[32px] rounded overflow-hidden shadow-md border border-amber-900/40"
          style={{
            background: 'linear-gradient(135deg, #1c2618 0%, #2f3d23 50%, #1e2818 100%)',
            transform: 'perspective(350px) rotateX(24deg)',
            boxShadow: '0 8px 20px -3px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.15)'
          }}
        >
          {/* Grass mown strips pattern */}
          <div className="absolute inset-0 flex">
            {[...Array(9)].map((_, i) => (
              <div 
                key={i} 
                className={`flex-1 h-full border-r border-emerald-900/30 ${i % 2 === 0 ? 'bg-black/10' : 'bg-white/[0.03]'}`} 
              />
            ))}
          </div>

          {/* Central 22-yard clay pitch strip */}
          <div className="absolute top-[18%] bottom-[18%] left-[7%] right-[7%] bg-gradient-to-r from-[#8c6d46] via-[#b39268] to-[#8c6d46] rounded-xs shadow-inner flex items-center justify-between px-2.5 border border-amber-950/60">
            {/* Bowling Crease (Bowler End) */}
            <div className="h-full w-[1.5px] bg-white/80 relative flex items-center justify-center">
              <div className="absolute -left-0.5 w-0.5 h-2 bg-amber-100 rounded-xs" />
            </div>

            {/* Target Chase Glow Line */}
            <div className="absolute left-[7%] right-[7%] h-[2px] bg-black/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500 rounded-full transition-all duration-700 shadow-[0_0_6px_rgba(234,179,8,0.7)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Glowing Cricket Ball at striker end */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-red-600 via-red-500 to-rose-400 border border-white/70 shadow-[0_0_6px_rgba(244,63,94,0.9)] flex items-center justify-center z-10 transition-all duration-700"
              style={{ left: `calc(${progressPercent}% - 5px)` }}
            >
              <div className="w-full h-[0.5px] bg-white/70 rotate-45" />
            </div>

            {/* Popping Crease (Striker End) */}
            <div className="h-full w-[1.5px] bg-white/80 relative flex items-center justify-center">
              <div className="absolute -right-0.5 w-0.5 h-2 bg-amber-100 rounded-xs" />
            </div>
          </div>
        </div>

        {/* Pitch Yard Markers below isometric */}
        <div className="absolute -bottom-1 w-[75%] flex justify-between text-[8px] font-mono font-medium text-stone-500 select-none">
          <span>0m</span>
          <span>5m</span>
          <span>10m</span>
          <span>15m</span>
          <span>20m</span>
          <span>SCG</span>
        </div>
      </div>
    </div>
  );
}
