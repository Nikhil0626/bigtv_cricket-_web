import React from 'react';

/**
 * Consolidated Live Stats & Equations Card
 * Combines active batters, active bowlers, and team comparison bars
 * to fit cleanly in the remaining vertical space without any scrolling.
 */
export default function LiveStatsCard({ match }) {
  if (!match) return null;

  const miniscore = match.miniscore || {};
  const striker = miniscore.batsmanStriker || {
    name: 'Glenn Maxwell',
    runs: 46,
    balls: 22,
    fours: 4,
    sixes: 3,
    strikeRate: 190.9
  };

  const nonStriker = miniscore.batsmanNonStriker || {
    name: 'Tim David',
    runs: 18,
    balls: 9,
    fours: 1,
    sixes: 1,
    strikeRate: 200.0
  };

  const bowler = miniscore.bowlerStriker || {
    name: 'Jasprit Bumrah',
    overs: 3.4,
    maidens: 0,
    runs: 28,
    wickets: 2,
    economy: 7.63
  };

  const partnership = miniscore.partnerShip || { runs: 36, balls: 18 };
  const currentRR = miniscore.currentRunRate || 8.73;
  const requiredRR = miniscore.requiredRunRate || 31.50;
  const runs = miniscore.runs || 163;
  const target = miniscore.target || 205;
  const runsNeeded = Math.max(0, target - runs);

  // Recent overs tokens
  const recentStats = miniscore.recentOversStats || "1 4 W 1 6 2 | 1 1 4 0 6 1";
  const overBlocks = recentStats.split('|').map(block => block.trim().split(/\s+/).filter(Boolean));

  // Dual red comparison bars like Apple Sports screenshot
  const calcPercentages = (val1, val2) => {
    const v1 = parseFloat(val1) || 0;
    const v2 = parseFloat(val2) || 0;
    const total = v1 + v2;
    if (total === 0) return { p1: 50, p2: 50 };
    return {
      p1: Math.min(85, Math.max(15, Math.round((v1 / total) * 100))),
      p2: Math.min(85, Math.max(15, Math.round((v2 / total) * 100)))
    };
  };

  const rrBars = calcPercentages(currentRR, requiredRR);
  const runBars = calcPercentages(runs, runsNeeded);

  return (
    <div className="w-full h-full flex flex-col justify-between rounded-xl bg-[#1c1218]/80 backdrop-blur-xl border border-white/10 p-2.5 shadow-xl select-none">
      {/* 1. Live Batting & Bowling Section */}
      <div className="w-full">
        {/* Header row */}
        <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-stone-300 border-b border-white/10 pb-1 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
            <span>Live Batting &amp; Bowling</span>
          </div>
          <div className="text-[10px] font-mono text-stone-400">
            P'ship: <strong className="text-amber-300 font-bold">{partnership.runs}</strong> ({partnership.balls}b)
          </div>
        </div>

        {/* Players mini table */}
        <div className="space-y-1 text-[11px] font-mono">
          {/* Striker */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-1 truncate max-w-[150px]">
              <span className="text-amber-400 text-[10px]">⚡</span>
              <span className="font-sans font-bold truncate">{striker.name}</span>
              <span className="text-amber-400 text-[9px]">*</span>
            </div>
            <div className="flex items-center gap-2 text-stone-300 text-[10px]">
              <span className="font-bold text-white text-xs">{striker.runs}</span>
              <span className="text-stone-400">({striker.balls}b)</span>
              <span className="text-stone-400">{striker.fours}x4 {striker.sixes}x6</span>
              <span className="text-emerald-400 font-semibold">{striker.strikeRate}</span>
            </div>
          </div>

          {/* Non-striker */}
          <div className="flex items-center justify-between text-stone-300">
            <div className="flex items-center gap-1 truncate max-w-[150px] pl-3">
              <span className="font-sans font-medium truncate">{nonStriker.name}</span>
            </div>
            <div className="flex items-center gap-2 text-stone-400 text-[10px]">
              <span className="font-semibold text-stone-200">{nonStriker.runs}</span>
              <span>({nonStriker.balls}b)</span>
              <span>{nonStriker.fours}x4 {nonStriker.sixes}x6</span>
              <span>{nonStriker.strikeRate}</span>
            </div>
          </div>

          {/* Bowler */}
          <div className="flex items-center justify-between text-stone-300 pt-0.5 border-t border-white/5">
            <div className="flex items-center gap-1 truncate max-w-[150px]">
              <span className="text-red-400 text-[10px]">🎯</span>
              <span className="font-sans font-bold text-white truncate">{bowler.name}</span>
            </div>
            <div className="flex items-center gap-2 text-stone-300 text-[10px]">
              <span>{bowler.overs} ov</span>
              <span>{bowler.runs}r</span>
              <span className="text-red-400 font-bold">{bowler.wickets}w</span>
              <span className="text-stone-400 font-semibold">Eco {bowler.economy}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Team Stats Section with Dual Red Bars (Direct Apple Sports match) */}
      <div className="w-full pt-1.5 border-t border-white/10 mt-1">
        {/* Row A: Run Rate */}
        <div className="mb-1">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-white mb-0.5 px-0.5">
            <span>{currentRR}</span>
            <span className="text-[9px] font-sans font-medium text-stone-400 uppercase tracking-wider">
              Current RR vs Req RR
            </span>
            <span className="text-red-400">{requiredRR}</span>
          </div>
          <div className="flex items-center gap-1.5 px-0.5">
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden flex justify-end">
              <div 
                className="h-full bg-gradient-to-l from-red-500 to-rose-700 rounded-full transition-all duration-500"
                style={{ width: `${rrBars.p1}%` }}
              />
            </div>
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden flex justify-start">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-rose-700 rounded-full transition-all duration-500"
                style={{ width: `${rrBars.p2}%` }}
              />
            </div>
          </div>
        </div>

        {/* Row B: Runs Scored vs Needed */}
        <div className="mb-1">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-white mb-0.5 px-0.5">
            <span className="text-emerald-400">{runs}</span>
            <span className="text-[9px] font-sans font-medium text-stone-400 uppercase tracking-wider">
              Runs Scored vs Needed ({target})
            </span>
            <span className="text-amber-400">{runsNeeded}</span>
          </div>
          <div className="flex items-center gap-1.5 px-0.5">
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden flex justify-end">
              <div 
                className="h-full bg-gradient-to-l from-emerald-500 to-teal-700 rounded-full transition-all duration-500"
                style={{ width: `${runBars.p1}%` }}
              />
            </div>
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden flex justify-start">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-red-600 rounded-full transition-all duration-500"
                style={{ width: `${runBars.p2}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3. Recent Overs (Ball-by-ball pill trail) */}
        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">Recent Balls:</span>
          <div className="flex items-center gap-1 overflow-hidden">
            {overBlocks.map((over, oIdx) => (
              <div key={oIdx} className="flex items-center gap-1">
                {over.map((b, bIdx) => {
                  let cls = "bg-white/10 text-stone-200 border-white/15";
                  if (b === 'W') cls = "bg-red-600 text-white font-extrabold border-red-400 shadow-[0_0_6px_rgba(239,68,68,0.7)]";
                  else if (b === '6') cls = "bg-purple-600 text-white font-extrabold border-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.7)]";
                  else if (b === '4') cls = "bg-emerald-600 text-white font-extrabold border-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.7)]";
                  else if (b === '0' || b === '•') cls = "bg-stone-800 text-stone-500 border-stone-700";

                  return (
                    <span 
                      key={bIdx}
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono border ${cls}`}
                    >
                      {b}
                    </span>
                  );
                })}
                {oIdx < overBlocks.length - 1 && <span className="text-stone-600 text-[10px]">|</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

