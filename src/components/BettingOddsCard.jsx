import React from 'react';

/**
 * Betting Odds / Match Result Breakdown Card
 * Direct equivalent of the "Betting Odds" card in the Apple Sports reference screenshot
 */
export default function BettingOddsCard({ match }) {
  if (!match) return null;

  const { team1, team2, isRecent } = match;

  return (
    <div className="w-full h-full flex flex-col justify-between rounded-xl bg-[#1c1218]/80 backdrop-blur-xl border border-white/10 p-2.5 shadow-xl select-none">
      {/* Title */}
      <div className="text-center font-bold text-[10px] uppercase tracking-wider text-stone-200 border-b border-white/10 pb-1">
        {isRecent ? 'Match Result & Win Breakdown' : 'Betting Odds & Win Probability'}
      </div>

      {/* Odds / Result Table */}
      <table className="w-full text-[11px] font-mono leading-tight my-1">
        <thead>
          <tr className="text-stone-400 text-[9px] border-b border-white/10 pb-0.5">
            <th className="text-left font-sans font-semibold pb-1 pl-1">TEAM</th>
            <th className="text-center font-semibold pb-1">RESULT</th>
            <th className="text-center font-semibold pb-1">FINAL SCORE</th>
            <th className="text-right font-semibold pb-1 pr-1">STATUS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          <tr className="text-stone-200">
            <td className="py-1.5 pl-1 font-sans font-bold text-white flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {team1.shortName || team1.name.slice(0, 3).toUpperCase()}
            </td>
            <td className="text-center py-1.5 text-emerald-400 font-bold">WINNER 🏆</td>
            <td className="text-center py-1.5 text-white font-bold">{team1.score}</td>
            <td className="text-right py-1.5 pr-1 font-bold text-emerald-400">+18 Runs</td>
          </tr>
          <tr className="text-stone-200">
            <td className="py-1.5 pl-1 font-sans font-bold text-white flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-500" />
              {team2.shortName || team2.name.slice(0, 3).toUpperCase()}
            </td>
            <td className="text-center py-1.5 text-stone-400 font-semibold">Runner-up</td>
            <td className="text-center py-1.5 text-stone-300">{team2.score}</td>
            <td className="text-right py-1.5 pr-1 font-semibold text-stone-400">Defeated</td>
          </tr>
        </tbody>
      </table>

      {/* Win probability visual bar */}
      <div className="w-full">
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden flex shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700" 
            style={{ width: `100%` }} 
          />
        </div>
      </div>

      {/* Footer attribution matching "Odds Provided by DRAFTKINGS" */}
      <div className="text-stone-500 text-[9px] text-center font-sans pt-1 border-t border-white/5 flex items-center justify-center gap-1">
        <span>Player of the Match:</span>
        <strong className="text-amber-300 tracking-wider font-extrabold uppercase">Jasprit Bumrah (3/24)</strong>
      </div>
    </div>
  );
}
