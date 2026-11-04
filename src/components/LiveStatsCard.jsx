import React from 'react';

/**
 * Consolidated Live Stats & Match Equations Card
 * Handles both live matches (active striker/bowler) and recent completed matches (top performers & match stats)
 */
export default function LiveStatsCard({ match }) {
  if (!match) return null;

  const { miniscore, isRecent, team1, team2 } = match;

  // Recent completed match defaults (e.g. India vs Australia 2nd T20I)
  const isMatchCompleted = isRecent || !miniscore;

  const striker = miniscore?.batsmanStriker || {
    name: 'Virat Kohli',
    runs: 64,
    balls: 39,
    fours: 6,
    sixes: 2,
    strikeRate: 164.1
  };

  const nonStriker = miniscore?.batsmanNonStriker || {
    name: 'Hardik Pandya',
    runs: 42,
    balls: 19,
    fours: 3,
    sixes: 3,
    strikeRate: 221.1
  };

  const bowler = miniscore?.bowlerStriker || {
    name: 'Jasprit Bumrah',
    overs: 4.0,
    maidens: 0,
    runs: 24,
    wickets: 3,
    economy: 6.00
  };

  const partnership = miniscore?.partnerShip || { runs: 78, balls: 45 };

  // Calculate run rates
  const currentRR = miniscore?.currentRunRate || 9.40;
  const requiredRR = miniscore?.requiredRunRate || 8.50;

  // Recent overs tokens
  const recentStats = miniscore?.recentOversStats || "0 1 W 2 1 W | 4 1 0 1 2 W";
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
  const runBars = calcPercentages(188, 170);

  return (
    <div className="w-full h-full flex flex-col justify-between rounded-xl bg-[#1c1218]/80 backdrop-blur-xl border border-white/10 p-2.5 shadow-xl select-none">
      {/* 1. Batting & Bowling Section */}
      <div className="w-full">
        {/* Header row */}
        <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-stone-300 border-b border-white/10 pb-1 mb-1">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isMatchCompleted ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse-dot'}`} />
            <span>{isMatchCompleted ? 'Top Match Performers' : 'Live Batting & Bowling'}</span>
          </div>
          <div className="text-[10px] font-mono text-stone-400">
            {isMatchCompleted ? (
              <span className="text-amber-300 font-semibold">POTM: Bumrah (3/24)</span>
            ) : (
              <>P'ship: <strong className="text-amber-300 font-bold">{partnership.runs}</strong> ({partnership.balls}b)</>
            )}
          </div>
        </div>

        {/* Players mini table */}
        <div className="space-y-1 text-[11px] font-mono">
          {/* Batter 1 */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-1 truncate max-w-[150px]">
              <span className="text-amber-400 text-[10px]">{isMatchCompleted ? '★' : '⚡'}</span>
              <span className="font-sans font-bold truncate">{striker.name}</span>
              {!isMatchCompleted && <span className="text-amber-400 text-[9px]">*</span>}
            </div>
            <div className="flex items-center gap-2 text-stone-300 text-[10px]">
              <span className="font-bold text-white text-xs">{striker.runs}</span>
              <span className="text-stone-400">({striker.balls}b)</span>
              <span className="text-stone-400">{striker.fours}x4 {striker.sixes}x6</span>
              <span className="text-emerald-400 font-semibold">{striker.strikeRate}</span>
            </div>
          </div>

          {/* Batter 2 */}
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

      {/* 2. Team Stats Section with Dual Red Bars */}
      <div className="w-full pt-1.5 border-t border-white/10 mt-1">
        {/* Row A: Run Rate */}
        <div className="mb-1">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-white mb-0.5 px-0.5">
            <span>{currentRR}</span>
            <span className="text-[9px] font-sans font-medium text-stone-400 uppercase tracking-wider">
              {isMatchCompleted ? `${team1.shortName} RR vs ${team2.shortName} RR` : 'Current RR vs Req RR'}
            </span>
            <span className={isMatchCompleted ? "text-amber-400" : "text-red-400"}>{requiredRR}</span>
          </div>
          <div className="flex items-center gap-1.5 px-0.5">
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden flex justify-end">
              <div 
                className="h-full bg-gradient-to-l from-emerald-500 to-teal-700 rounded-full transition-all duration-500"
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

        {/* Row B: Total Runs & Margin */}
        <div className="mb-1">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-white mb-0.5 px-0.5">
            <span className="text-emerald-400">188/6</span>
            <span className="text-[9px] font-sans font-medium text-stone-400 uppercase tracking-wider">
              {isMatchCompleted ? 'Match Score (Won by 18 runs)' : 'Runs Scored vs Needed'}
            </span>
            <span className="text-stone-300">170/9</span>
          </div>
          <div className="flex items-center gap-1.5 px-0.5">
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden flex justify-end">
              <div 
                className="h-full bg-gradient-to-l from-blue-500 to-indigo-700 rounded-full transition-all duration-500"
                style={{ width: `${runBars.p1}%` }}
              />
            </div>
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden flex justify-start">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full transition-all duration-500"
                style={{ width: `${runBars.p2}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3. Final / Recent Overs (Ball-by-ball pill trail) */}
        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">
            {isMatchCompleted ? 'Final Overs:' : 'Recent Balls:'}
          </span>
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
