import React from 'react';

/**
 * Betting Odds / Win Probability Card
 * Direct equivalent of the "Betting Odds" card in the Apple Sports reference screenshot
 */
export default function BettingOddsCard({ match }) {
  if (!match) return null;

  const { team1, team2, miniscore } = match;
  const target = miniscore?.target || 205;
  const requiredRR = parseFloat(miniscore?.requiredRunRate) || 31.5;

  let team2WinProb = 15;
  if (requiredRR < 8) team2WinProb = 75;
  else if (requiredRR < 12) team2WinProb = 55;
  else if (requiredRR < 18) team2WinProb = 30;
  else if (requiredRR < 25) team2WinProb = 18;
  else team2WinProb = 12;

  const team1WinProb = 100 - team2WinProb;

  return (
    <div className="w-full h-full flex flex-col justify-between rounded-xl bg-[#1c1218]/80 backdrop-blur-xl border border-white/10 p-2.5 shadow-xl select-none">
      {/* Title */}
      <div className="text-center font-bold text-[10px] uppercase tracking-wider text-stone-200 border-b border-white/10 pb-1">
        Betting Odds &amp; Win Probability
      </div>

      {/* Odds Table */}
      <table className="w-full text-[11px] font-mono leading-tight my-1">
        <thead>
          <tr className="text-stone-400 text-[9px] border-b border-white/10 pb-0.5">
            <th className="text-left font-sans font-semibold pb-1 pl-1">TEAM</th>
            <th className="text-center font-semibold pb-1">WIN PROB</th>
            <th className="text-center font-semibold pb-1">PROJECTED</th>
            <th className="text-right font-semibold pb-1 pr-1">WIN ODDS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          <tr className="text-stone-200">
            <td className="py-1.5 pl-1 font-sans font-bold text-white flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {team1.shortName || team1.name.slice(0, 3).toUpperCase()}
            </td>
            <td className="text-center py-1.5 text-emerald-400 font-bold">{team1WinProb}%</td>
            <td className="text-center py-1.5 text-stone-300">DEF {target - 1}</td>
            <td className="text-right py-1.5 pr-1 font-bold text-white">1.28</td>
          </tr>
          <tr className="text-stone-200">
            <td className="py-1.5 pl-1 font-sans font-bold text-white flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              {team2.shortName || team2.name.slice(0, 3).toUpperCase()}
            </td>
            <td className="text-center py-1.5 text-red-400 font-bold">{team2WinProb}%</td>
            <td className="text-center py-1.5 text-stone-300">REQ {target}</td>
            <td className="text-right py-1.5 pr-1 font-bold text-white">3.95</td>
          </tr>
        </tbody>
      </table>

      {/* Win probability visual bar */}
      <div className="w-full">
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden flex shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700" 
            style={{ width: `${team1WinProb}%` }} 
          />
          <div 
            className="h-full bg-gradient-to-r from-rose-500 to-red-600 transition-all duration-700" 
            style={{ width: `${team2WinProb}%` }} 
          />
        </div>
      </div>

      {/* Footer attribution matching "Odds Provided by DRAFTKINGS" */}
      <div className="text-stone-500 text-[9px] text-center font-sans pt-1 border-t border-white/5 flex items-center justify-center gap-1">
        <span>Odds &amp; Projections by</span>
        <strong className="text-stone-300 tracking-wider font-extrabold uppercase">CRIC-ANALYTICS</strong>
      </div>
    </div>
  );
}
