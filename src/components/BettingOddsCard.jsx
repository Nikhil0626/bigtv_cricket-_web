import React from 'react';

/**
 * Betting Odds / Match Result Breakdown Card
 * Direct equivalent of the "Betting Odds" card in the Apple Sports reference screenshot
 */
export default function BettingOddsCard({ match }) {
  if (!match) return null;

  const { team1, team2, miniscore, isRecent, status } = match;

  const target = miniscore?.target || (parseInt(team1.score?.split('/')[0], 10) + 1) || 227;
  const runs = miniscore?.runs ?? parseInt(team2.score?.split('/')[0], 10) ?? 142;
  const wkts = miniscore?.wickets ?? parseInt(team2.score?.split('/')[1], 10) ?? 7;
  const runsNeeded = Math.max(0, target - runs);
  const ballsrem = miniscore?.ballsrem ?? 48;

  // Dynamic Win Probability calculation
  let t2WinProb = 50;
  if (isRecent) {
    t2WinProb = status.toLowerCase().includes(team2.shortName.toLowerCase()) || status.toLowerCase().includes(team2.name.toLowerCase()) ? 100 : 0;
  } else {
    // Live match calculation based on runs needed, wickets in hand, and balls left
    const wicketsInHand = Math.max(0, 10 - wkts);
    const reqRR = ballsrem > 0 ? (runsNeeded / ballsrem) * 6 : 99;
    if (runsNeeded === 0) {
      t2WinProb = 100;
    } else if (wicketsInHand === 0 || (ballsrem === 0 && runsNeeded > 0)) {
      t2WinProb = 0;
    } else {
      // Base win probability from required run rate & wickets
      const factor = (wicketsInHand / 10) * 100 - (reqRR - 6) * 8;
      t2WinProb = Math.min(96, Math.max(4, Math.round(factor)));
    }
  }

  const t1WinProb = 100 - t2WinProb;

  return (
    <div className="w-full h-full flex flex-col justify-between rounded-xl bg-[#1c1218]/80 backdrop-blur-xl border border-white/10 p-2.5 shadow-xl select-none">
      {/* Title */}
      <div className="text-center font-bold text-[10px] uppercase tracking-wider text-stone-200 border-b border-white/10 pb-1">
        {isRecent ? 'Match Result & Win Breakdown' : 'Live Win Probability & Match Situation'}
      </div>

      {/* Odds / Win Probability Table */}
      <table className="w-full text-[11px] font-mono leading-tight my-1">
        <thead>
          <tr className="text-stone-400 text-[9px] border-b border-white/10 pb-0.5">
            <th className="text-left font-sans font-semibold pb-1 pl-1">TEAM</th>
            <th className="text-center font-semibold pb-1">WIN PROB</th>
            <th className="text-center font-semibold pb-1">SCORE</th>
            <th className="text-right font-semibold pb-1 pr-1">EQUATION</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {/* Team 2 (Chasing) */}
          <tr className="text-stone-200">
            <td className="py-1.5 pl-1 font-sans font-bold text-white flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isRecent ? (t2WinProb === 100 ? 'bg-amber-400' : 'bg-stone-500') : 'bg-emerald-500 animate-pulse-dot'}`} />
              {team2.shortName || 'T2'}
            </td>
            <td className={`text-center py-1.5 font-bold ${t2WinProb >= 50 ? 'text-emerald-400' : 'text-stone-400'}`}>{t2WinProb}%</td>
            <td className="text-center py-1.5 text-white font-bold">{team2.score}</td>
            <td className="text-right py-1.5 pr-1 font-bold text-stone-300">
              {isRecent 
                ? (t2WinProb === 100 ? 'Winner 🏆' : 'Runner-up')
                : `Need ${runsNeeded}r (${ballsrem}b)`}
            </td>
          </tr>
          {/* Team 1 (Defending) */}
          <tr className="text-stone-200">
            <td className="py-1.5 pl-1 font-sans font-bold text-white flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isRecent ? (t1WinProb === 100 ? 'bg-amber-400' : 'bg-stone-500') : 'bg-blue-500'}`} />
              {team1.shortName || 'T1'}
            </td>
            <td className={`text-center py-1.5 font-bold ${t1WinProb >= 50 ? 'text-emerald-400' : 'text-stone-400'}`}>{t1WinProb}%</td>
            <td className="text-center py-1.5 text-stone-300">{team1.score}</td>
            <td className="text-right py-1.5 pr-1 font-semibold text-stone-400">
              {isRecent
                ? (t1WinProb === 100 ? 'Winner 🏆' : 'Runner-up')
                : `Defending ${target}`}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Win probability visual bar */}
      <div className="w-full my-1">
        <div className="flex justify-between text-[9px] font-mono text-stone-400 mb-0.5 px-0.5">
          <span className={t2WinProb >= 50 ? "text-emerald-400 font-bold" : "text-stone-400 font-bold"}>
            {team2.shortName}: {t2WinProb}%
          </span>
          <span className={t1WinProb >= 50 ? "text-emerald-400 font-bold" : "text-stone-400 font-bold"}>
            {team1.shortName}: {t1WinProb}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden flex shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700" 
            style={{ width: `${t2WinProb}%` }} 
          />
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700" 
            style={{ width: `${t1WinProb}%` }} 
          />
        </div>
      </div>

      {/* Footer attribution */}
      <div className="text-stone-500 text-[9px] text-center font-sans pt-1 border-t border-white/5 flex items-center justify-center gap-1 truncate">
        <span>Current Status:</span>
        <strong className="text-amber-300 tracking-tight font-semibold truncate">
          {status || `${team2.name} need ${runsNeeded} runs in ${ballsrem} balls`}
        </strong>
      </div>
    </div>
  );
}
