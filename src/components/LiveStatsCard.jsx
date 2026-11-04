import React from 'react';

/**
 * Consolidated Live Stats & Match Equations Card
 * Handles both live matches (active striker/bowler) and recent completed matches (top performers & match stats)
 */
export default function LiveStatsCard({ match }) {
  if (!match) return null;

  const { miniscore, isRecent, team1, team2 } = match;

  const isMatchCompleted = isRecent || (!miniscore && match.state === 'recent');

  const striker = miniscore?.batsmanStriker || {
    name: 'Shreyas Iyer',
    runs: 2,
    balls: 2,
    fours: 0,
    sixes: 0,
    strikeRate: '100'
  };

  const nonStriker = miniscore?.batsmanNonStriker || {
    name: 'Virat Kohli',
    runs: 69,
    balls: 48,
    fours: 12,
    sixes: 1,
    strikeRate: '143.75'
  };

  const bowler = miniscore?.bowlerStriker || {
    name: 'Nathan Smith',
    overs: '2.4',
    maidens: 0,
    runs: 10,
    wickets: 1,
    economy: '3.8'
  };

  const bowler2 = miniscore?.bowlerNonStriker || {
    name: 'Jacob Duffy',
    overs: '5.0',
    maidens: 0,
    runs: 33,
    wickets: 0,
    economy: '6.6'
  };

  const partnership = miniscore?.partnerShip || { runs: 2, balls: 2 };

  // Calculate run rates
  const currentRR = miniscore?.currentRunRate ?? 6.21;
  const requiredRR = miniscore?.requiredRunRate ?? 2.03;

  // Runs and target calculations
  const runsScored = miniscore?.runs ?? parseInt(team2.score?.split('/')[0], 10) ?? 116;
  const wktsDown = miniscore?.wickets ?? parseInt(team2.score?.split('/')[1], 10) ?? 2;
  const target = miniscore?.target ?? 143;
  const runsNeeded = Math.max(0, target - runsScored);
  const ballsRemaining = miniscore?.ballsrem ?? 80;

  // Recent overs tokens from curovsstats (e.g. "0 W 0 2")
  const recentStats = miniscore?.recentOversStats || "0 W 0 2";
  const overBlocks = recentStats.split('|').map(block => block.trim().split(/\s+/).filter(Boolean));

  // Dual comparison percentage calculator
  const calcPercentages = (val1, val2) => {
    const v1 = Math.max(0, parseFloat(val1) || 0);
    const v2 = Math.max(0, parseFloat(val2) || 0);
    const total = v1 + v2;
    if (total === 0) return { p1: 50, p2: 50 };
    const p1 = Math.min(88, Math.max(12, Math.round((v1 / total) * 100)));
    return { p1, p2: 100 - p1 };
  };

  const rrBars = calcPercentages(currentRR, requiredRR);
  const runBars = calcPercentages(runsScored, runsNeeded > 0 ? runsNeeded : 1);

  return (
    <div className="w-full h-full flex flex-col justify-between rounded-xl bg-[#1c1218]/80 backdrop-blur-xl border border-white/10 p-2.5 shadow-xl select-none">
      {/* 1. Batting & Bowling Section */}
      <div className="w-full">
        {/* Header row */}
        <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-stone-300 border-b border-white/10 pb-1 mb-1">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isMatchCompleted ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse-dot'}`} />
            <span>{isMatchCompleted ? 'Match Summary' : 'Live Batting & Bowling'}</span>
          </div>
          <div className="text-[10px] font-mono text-stone-400">
            {isMatchCompleted ? (
              <span className="text-amber-300 font-semibold">{match.status || 'Match Finished'}</span>
            ) : (
              <>P'SHIP: <strong className="text-amber-300 font-bold">{partnership.runs}</strong> ({partnership.balls}B)</>
            )}
          </div>
        </div>

        {/* Players mini table */}
        <div className="space-y-1 text-[11px] font-mono">
          {/* Batter 1 (Striker) */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-1 truncate max-w-[150px]">
              <span className="text-amber-400 text-[10px]">{isMatchCompleted ? '★' : '⚡'}</span>
              <span className="font-sans font-bold truncate">{striker.name}</span>
              {!isMatchCompleted && <span className="text-amber-400 text-[10px] font-black">*</span>}
            </div>
            <div className="flex items-center gap-2 text-stone-300 text-[10px]">
              <span className="font-bold text-white text-xs">{striker.runs}</span>
              <span className="text-stone-400">({striker.balls}b)</span>
              <span className="text-stone-400">{striker.fours}x4 {striker.sixes}x6</span>
              <span className="text-emerald-400 font-semibold">{striker.strikeRate}</span>
            </div>
          </div>

          {/* Batter 2 (Non-Striker) */}
          <div className="flex items-center justify-between text-stone-300">
            <div className="flex items-center gap-1 truncate max-w-[150px] pl-3">
              <span className="font-sans font-medium truncate">{nonStriker.name}</span>
            </div>
            <div className="flex items-center gap-2 text-stone-400 text-[10px]">
              <span className="font-semibold text-stone-200">{nonStriker.runs}</span>
              <span>({nonStriker.balls}b)</span>
              <span>{nonStriker.fours}x4 {nonStriker.sixes}x6</span>
              <span className="text-stone-300">{nonStriker.strikeRate}</span>
            </div>
          </div>

          {/* Bowler 1 (Active Bowler) */}
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

          {/* Bowler 2 (Secondary Bowler, if available) */}
          {bowler2?.name && (
            <div className="flex items-center justify-between text-stone-400 text-[9.5px]">
              <div className="flex items-center gap-1 truncate max-w-[150px] pl-3">
                <span className="font-sans truncate">{bowler2.name}</span>
              </div>
              <div className="flex items-center gap-2 text-[9.5px]">
                <span>{bowler2.overs} ov</span>
                <span>{bowler2.runs}r</span>
                <span className="text-stone-300 font-medium">{bowler2.wickets}w</span>
                <span className="text-stone-500">Eco {bowler2.economy}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Team Stats Section with Dual Comparison Bars */}
      <div className="w-full pt-1 border-t border-white/10 mt-0.5">
        {/* Row A: Run Rate Comparison */}
        <div className="mb-1">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-white mb-0.5 px-0.5">
            <span className="text-emerald-400">{currentRR}</span>
            <span className="text-[9px] font-sans font-medium text-stone-400 uppercase tracking-wider">
              {isMatchCompleted ? `${team1.shortName} RR vs ${team2.shortName} RR` : 'Current RR vs Req RR'}
            </span>
            <span className={isMatchCompleted ? "text-amber-400" : "text-rose-400"}>{requiredRR}</span>
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
                className="h-full bg-gradient-to-r from-rose-500 to-red-700 rounded-full transition-all duration-500"
                style={{ width: `${rrBars.p2}%` }}
              />
            </div>
          </div>
        </div>

        {/* Row B: Runs Scored vs Needed */}
        <div className="mb-1">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-white mb-0.5 px-0.5">
            <span className="text-emerald-400">{runsScored}/{wktsDown}</span>
            <span className="text-[9px] font-sans font-medium text-stone-400 uppercase tracking-wider">
              {isMatchCompleted ? 'Match Score' : `Runs Scored vs Needed (Target ${target})`}
            </span>
            <span className="text-amber-300 font-semibold">
              {isMatchCompleted ? team1.score : `${runsNeeded} off ${ballsRemaining}b`}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-0.5">
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden flex justify-end">
              <div 
                className="h-full bg-gradient-to-l from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${runBars.p1}%` }}
              />
            </div>
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden flex justify-start">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-rose-600 rounded-full transition-all duration-500"
                style={{ width: `${runBars.p2}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3. Ball-by-ball pill trail & Last Wicket */}
        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">
            {isMatchCompleted ? 'Final Overs:' : 'Recent Balls:'}
          </span>
          <div className="flex items-center gap-1 overflow-hidden">
            {overBlocks.map((over, oIdx) => (
              <div key={oIdx} className="flex items-center gap-1">
                {over.map((b, bIdx) => {
                  let cls = "bg-white/10 text-stone-200 border-white/15";
                  if (b === 'W' || b === 'w') cls = "bg-red-600 text-white font-extrabold border-red-400 shadow-[0_0_6px_rgba(239,68,68,0.7)]";
                  else if (b === '6') cls = "bg-purple-600 text-white font-extrabold border-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.7)]";
                  else if (b === '4') cls = "bg-emerald-600 text-white font-extrabold border-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.7)]";
                  else if (b === '0' || b === '•') cls = "bg-stone-800 text-stone-400 border-stone-700";
                  else if (b === '2' || b === '3') cls = "bg-sky-600/60 text-sky-200 font-bold border-sky-400/50";
                  else if (b === '1') cls = "bg-white/15 text-stone-200 border-white/20";

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
