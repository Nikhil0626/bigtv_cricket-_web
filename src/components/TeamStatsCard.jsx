import React from 'react';

/**
 * Team Stats & Match Equation Card
 * Designed identically to the Apple Sports "Team Stats" card with red comparison bars
 */
export default function TeamStatsCard({ match }) {
  if (!match) return null;

  const miniscore = match.miniscore || {};
  const currentRR = miniscore.currentRunRate || 8.73;
  const requiredRR = miniscore.requiredRunRate || 31.50;
  const runs = miniscore.runs || 163;
  const target = miniscore.target || 205;
  const runsNeeded = Math.max(0, target - runs);
  
  // Parse overs & balls remaining
  const overs = miniscore.overs || 18.4;
  const oversParts = String(overs).split('.');
  const completedOvers = parseInt(oversParts[0] || 0, 10);
  const ballsThisOver = parseInt(oversParts[1] || 0, 10);
  const totalBallsBowled = completedOvers * 6 + ballsThisOver;
  const maxBalls = 120; // Assuming 20-over scenario or calculate from status
  const ballsRemaining = Math.max(0, maxBalls - totalBallsBowled);

  // Recent overs tokens
  const recentStats = miniscore.recentOversStats || "1 4 W 1 6 2 | 1 1 4 0 6 1";
  const overBlocks = recentStats.split('|').map(block => block.trim().split(/\s+/).filter(Boolean));

  // Helper to calculate bar percentage between two numbers
  const calcPercentages = (val1, val2) => {
    const v1 = parseFloat(val1) || 0;
    const v2 = parseFloat(val2) || 0;
    const total = v1 + v2;
    if (total === 0) return { p1: 50, p2: 50 };
    return {
      p1: Math.min(90, Math.max(10, Math.round((v1 / total) * 100))),
      p2: Math.min(90, Math.max(10, Math.round((v2 / total) * 100)))
    };
  };

  const rrBars = calcPercentages(currentRR, requiredRR);
  const runBars = calcPercentages(runs, runsNeeded);
  const ballBars = calcPercentages(totalBallsBowled, ballsRemaining);

  return (
    <div className="w-full rounded-2xl bg-[#1d1419]/70 backdrop-blur-xl border border-white/10 p-4 shadow-xl mb-3">
      {/* Card Header */}
      <div className="text-center font-bold text-xs uppercase tracking-wider text-stone-200 mb-4">
        Match Equations & Rates
      </div>

      {/* Comparison Rows (Apple Sports style) */}
      <div className="space-y-4">
        {/* Row 1: Run Rate */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono font-bold text-white mb-1.5 px-1">
            <span className="text-sm">{currentRR}</span>
            <span className="text-[11px] font-sans font-medium text-stone-400 uppercase tracking-wider">
              Current RR vs Req RR
            </span>
            <span className="text-sm text-red-400">{requiredRR}</span>
          </div>
          {/* Dual Red Bars like Apple Sports */}
          <div className="flex items-center gap-2 px-1">
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden flex justify-end">
              <div 
                className="h-full bg-gradient-to-l from-red-500 to-rose-700 rounded-full transition-all duration-500"
                style={{ width: `${rrBars.p1}%` }}
              />
            </div>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden flex justify-start">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-rose-700 rounded-full transition-all duration-500"
                style={{ width: `${rrBars.p2}%` }}
              />
            </div>
          </div>
        </div>

        {/* Row 2: Target Equation */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono font-bold text-white mb-1.5 px-1">
            <span className="text-sm text-emerald-400">{runs}</span>
            <span className="text-[11px] font-sans font-medium text-stone-400 uppercase tracking-wider">
              Runs Scored vs Needed ({target})
            </span>
            <span className="text-sm text-amber-400">{runsNeeded}</span>
          </div>
          {/* Dual Red Bars */}
          <div className="flex items-center gap-2 px-1">
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden flex justify-end">
              <div 
                className="h-full bg-gradient-to-l from-emerald-500 to-teal-700 rounded-full transition-all duration-500"
                style={{ width: `${runBars.p1}%` }}
              />
            </div>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden flex justify-start">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-red-600 rounded-full transition-all duration-500"
                style={{ width: `${runBars.p2}%` }}
              />
            </div>
          </div>
        </div>

        {/* Row 3: Balls Remaining */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono font-bold text-white mb-1.5 px-1">
            <span className="text-sm">{overs} ov</span>
            <span className="text-[11px] font-sans font-medium text-stone-400 uppercase tracking-wider">
              Balls Faced vs Remaining
            </span>
            <span className="text-sm text-stone-300">{ballsRemaining} balls</span>
          </div>
          {/* Dual Red Bars */}
          <div className="flex items-center gap-2 px-1">
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden flex justify-end">
              <div 
                className="h-full bg-gradient-to-l from-red-600 to-red-800 rounded-full transition-all duration-500"
                style={{ width: `${ballBars.p1}%` }}
              />
            </div>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden flex justify-start">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-red-800 rounded-full transition-all duration-500"
                style={{ width: `${ballBars.p2}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Overs (Ball-by-ball pill trail) */}
      <div className="mt-5 pt-3 border-t border-white/10">
        <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Recent Overs (Ball-by-Ball)</span>
          <span className="text-stone-500 text-[10px]">Latest →</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {overBlocks.map((over, overIdx) => (
            <div key={overIdx} className="flex items-center gap-1.5 bg-black/40 px-2 py-1.5 rounded-lg border border-white/5 flex-shrink-0">
              {over.map((ball, bIdx) => {
                const b = ball.trim();
                let badgeClass = "bg-white/10 text-stone-200 border-white/15";
                
                if (b === 'W') {
                  badgeClass = "bg-red-600 text-white font-extrabold shadow-[0_0_8px_rgba(239,68,68,0.7)] border-red-400";
                } else if (b === '6') {
                  badgeClass = "bg-purple-600 text-white font-extrabold shadow-[0_0_8px_rgba(168,85,247,0.7)] border-purple-400";
                } else if (b === '4') {
                  badgeClass = "bg-emerald-600 text-white font-extrabold shadow-[0_0_8px_rgba(16,185,129,0.7)] border-emerald-400";
                } else if (b === '0' || b === '•') {
                  badgeClass = "bg-stone-800 text-stone-500 border-stone-700";
                }

                return (
                  <span
                    key={bIdx}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono border transition-transform hover:scale-110 select-none ${badgeClass}`}
                  >
                    {b}
                  </span>
                );
              })}
              {overIdx < overBlocks.length - 1 && (
                <span className="text-stone-600 font-bold px-0.5">|</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

