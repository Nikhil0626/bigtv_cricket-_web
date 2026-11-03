import React from 'react';

/**
 * Batting & Bowling Card
 * Frosted glass card with clean tabular view of active batters and bowlers
 */
export default function BattingBowlingCard({ match }) {
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

  const bowlerNonStriker = miniscore.bowlerNonStriker || {
    name: 'Arshdeep Singh',
    overs: 4.0,
    maidens: 0,
    runs: 38,
    wickets: 1,
    economy: 9.50
  };

  const partnership = miniscore.partnerShip || { runs: 36, balls: 18 };

  return (
    <div className="w-full rounded-2xl bg-[#1d1419]/70 backdrop-blur-xl border border-white/10 p-4 shadow-xl mb-3">
      {/* Section Title */}
      <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-200">
            Current Batting & Bowling
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
        </div>
        <div className="text-[11px] font-mono text-stone-400">
          P'ship: <strong className="text-amber-300 font-bold">{partnership.runs}</strong> ({partnership.balls}b)
        </div>
      </div>

      {/* Batters Table */}
      <div className="mb-3">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-stone-400 text-[10px] font-mono border-b border-white/5 pb-1">
              <th className="text-left font-sans font-semibold pb-1">BATTER</th>
              <th className="text-center font-semibold pb-1">R</th>
              <th className="text-center font-semibold pb-1">B</th>
              <th className="text-center font-semibold pb-1">4s</th>
              <th className="text-center font-semibold pb-1">6s</th>
              <th className="text-right font-semibold pb-1">SR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {/* Striker */}
            <tr className="text-stone-200 hover:bg-white/[0.02]">
              <td className="py-2 text-left font-sans font-bold text-white flex items-center gap-1.5">
                <span className="text-amber-400 text-xs" title="On strike">⚡</span>
                <span className="truncate max-w-[120px]">{striker.name}</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">*</span>
              </td>
              <td className="text-center py-2 font-bold text-white text-sm">{striker.runs}</td>
              <td className="text-center py-2 text-stone-400">{striker.balls}</td>
              <td className="text-center py-2 text-stone-300">{striker.fours}</td>
              <td className="text-center py-2 text-stone-300">{striker.sixes}</td>
              <td className="text-right py-2 font-semibold text-emerald-400">{striker.strikeRate}</td>
            </tr>

            {/* Non-Striker */}
            <tr className="text-stone-300 hover:bg-white/[0.02]">
              <td className="py-2 text-left font-sans font-medium text-stone-300 flex items-center gap-1.5">
                <span className="w-3" />
                <span className="truncate max-w-[120px]">{nonStriker.name}</span>
              </td>
              <td className="text-center py-2 font-semibold text-stone-200">{nonStriker.runs}</td>
              <td className="text-center py-2 text-stone-400">{nonStriker.balls}</td>
              <td className="text-center py-2 text-stone-300">{nonStriker.fours}</td>
              <td className="text-center py-2 text-stone-300">{nonStriker.sixes}</td>
              <td className="text-right py-2 text-stone-400">{nonStriker.strikeRate}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bowlers Table */}
      <div className="pt-2 border-t border-white/5">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-stone-400 text-[10px] font-mono border-b border-white/5 pb-1">
              <th className="text-left font-sans font-semibold pb-1">BOWLER</th>
              <th className="text-center font-semibold pb-1">O</th>
              <th className="text-center font-semibold pb-1">M</th>
              <th className="text-center font-semibold pb-1">R</th>
              <th className="text-center font-semibold pb-1">W</th>
              <th className="text-right font-semibold pb-1">ECO</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {/* Striker Bowler */}
            <tr className="text-stone-200 hover:bg-white/[0.02]">
              <td className="py-2 text-left font-sans font-bold text-white flex items-center gap-1.5">
                <span className="text-red-400 text-xs" title="Bowling">🎯</span>
                <span className="truncate max-w-[120px]">{bowler.name}</span>
              </td>
              <td className="text-center py-2 text-stone-300">{bowler.overs}</td>
              <td className="text-center py-2 text-stone-400">{bowler.maidens}</td>
              <td className="text-center py-2 text-stone-300">{bowler.runs}</td>
              <td className="text-center py-2 font-bold text-red-400 text-sm">{bowler.wickets}</td>
              <td className="text-right py-2 text-stone-300 font-semibold">{bowler.economy}</td>
            </tr>

            {/* Non-Striker Bowler */}
            {bowlerNonStriker && (
              <tr className="text-stone-300 hover:bg-white/[0.02]">
                <td className="py-2 text-left font-sans font-medium text-stone-300 flex items-center gap-1.5">
                  <span className="w-3" />
                  <span className="truncate max-w-[120px]">{bowlerNonStriker.name}</span>
                </td>
                <td className="text-center py-2 text-stone-300">{bowlerNonStriker.overs}</td>
                <td className="text-center py-2 text-stone-400">{bowlerNonStriker.maidens}</td>
                <td className="text-center py-2 text-stone-300">{bowlerNonStriker.runs}</td>
                <td className="text-center py-2 font-semibold text-stone-300">{bowlerNonStriker.wickets}</td>
                <td className="text-right py-2 text-stone-400">{bowlerNonStriker.economy}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

