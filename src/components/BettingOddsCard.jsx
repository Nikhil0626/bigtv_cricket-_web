import React from 'react';

/**
 * Betting Odds / Match Result Breakdown Card
 * Dynamic win probability & equation calculator
 */
export default function BettingOddsCard({ match }) {
  if (!match) return null;

  const { team1, team2, miniscore, isRecent, status } = match;

  const target = miniscore?.target || 0;
  const runs = miniscore?.runs || 0;
  const runsNeeded = target > 0 ? Math.max(0, target - runs) : 0;
  const ballsrem = miniscore?.ballsrem || 0;
  const currentRR = miniscore?.currentRunRate || 0;
  const reqRR = miniscore?.requiredRunRate || 0;

  // Dynamic Win Probability Calculation
  let t2WinProb = 50;
  let t1WinProb = 50;

  const statusLower = (status || '').toLowerCase();
  const t1NameLower = (team1.name || '').toLowerCase();
  const t1ShortLower = (team1.shortName || '').toLowerCase();
  const t2NameLower = (team2.name || '').toLowerCase();
  const t2ShortLower = (team2.shortName || '').toLowerCase();

  if (isRecent) {
    if (statusLower.includes(`${t2ShortLower} won`) || statusLower.includes(`${t2NameLower} won`)) {
      t2WinProb = 100;
      t1WinProb = 0;
    } else if (statusLower.includes(`${t1ShortLower} won`) || statusLower.includes(`${t1NameLower} won`)) {
      t1WinProb = 100;
      t2WinProb = 0;
    } else {
      t2WinProb = 50;
      t1WinProb = 50;
    }
  } else if (target > 0 && ballsrem > 0) {
    const r = reqRR > 0 ? reqRR : (runsNeeded / (ballsrem / 6));
    if (r <= 5) {
      t2WinProb = 88;
    } else if (r <= 7) {
      t2WinProb = 72;
    } else if (r <= 9) {
      t2WinProb = 55;
    } else if (r <= 11) {
      t2WinProb = 35;
    } else if (r <= 14) {
      t2WinProb = 20;
    } else {
      t2WinProb = 10;
    }
    t1WinProb = 100 - t2WinProb;
  }

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
          {/* Team 2 (Chasing or 2nd Innings) */}
          <tr className="text-stone-200">
            <td className="py-1.5 pl-1 font-sans font-bold text-white flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isRecent ? 'bg-amber-400' : 'bg-emerald-500 animate-pulse-dot'}`} />
              {team2.shortName || 'TM2'}
            </td>
            <td className="text-center py-1.5 text-emerald-400 font-bold">{t2WinProb}%</td>
            <td className="text-center py-1.5 text-white font-bold">{team2.score}</td>
            <td className="text-right py-1.5 pr-1 font-bold text-emerald-400 truncate max-w-[130px]">
              {isRecent 
                ? (t2WinProb === 100 ? 'Won Match' : '2nd Inn') 
                : (runsNeeded > 0 ? `Need ${runsNeeded}r (${ballsrem}b)` : `Target ${target}`)}
            </td>
          </tr>
          {/* Team 1 (Defending or 1st Innings) */}
          <tr className="text-stone-200">
            <td className="py-1.5 pl-1 font-sans font-bold text-white flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              {team1.shortName || 'TM1'}
            </td>
            <td className="text-center py-1.5 text-stone-400 font-semibold">{t1WinProb}%</td>
            <td className="text-center py-1.5 text-stone-300">{team1.score}</td>
            <td className="text-right py-1.5 pr-1 font-semibold text-stone-400 truncate max-w-[130px]">
              {isRecent 
                ? (t1WinProb === 100 ? 'Won Match' : '1st Inn') 
                : (target > 0 ? `Defending ${target}` : `${team1.score} (${team1.overs} ov)`)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Win probability visual bar */}
      <div className="w-full my-1">
        <div className="flex justify-between text-[9px] font-mono text-stone-400 mb-0.5 px-0.5">
          <span className="text-emerald-400 font-bold">{team2.shortName}: {t2WinProb}%</span>
          <span className="text-blue-400 font-bold">{team1.shortName}: {t1WinProb}%</span>
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
          {status || (runsNeeded > 0 ? `${team2.shortName} need ${runsNeeded} runs in ${ballsrem} balls` : team2.score)}
        </strong>
      </div>
    </div>
  );
}
