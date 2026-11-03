import React from 'react';

/**
 * Innings Breakdown Table
 * Styled exactly like the Q1-Q4 / Total score table in Apple Sports screenshot
 */
export default function InningsTable({ match }) {
  if (!match) return null;

  const { team1, team2, matchFormat, miniscore } = match;
  const isTest = (matchFormat || '').toUpperCase().includes('TEST') || (team1.score && team1.score.includes('&'));

  let t1Inn1 = '-';
  let t1Inn2 = '-';
  if (team1.score?.includes('&')) {
    const parts = team1.score.split('&');
    t1Inn1 = parts[0]?.trim() || '-';
    t1Inn2 = parts[1]?.trim() || '-';
  } else {
    t1Inn1 = team1.score || '-';
  }

  const t2Inn1 = team2.score || (miniscore?.runs ? `${miniscore.runs}/${miniscore.wickets}` : '-');

  if (isTest) {
    return (
      <div className="w-full px-4 my-1 flex-shrink-0">
        <div className="w-full rounded-lg bg-black/30 backdrop-blur-md border border-white/5 px-2.5 py-1">
          <table className="w-full text-[10px] font-mono leading-tight">
            <thead>
              <tr className="text-stone-400 border-b border-white/10 pb-0.5">
                <th className="text-left font-sans font-semibold pb-1 pl-1 w-16">TEAM</th>
                <th className="text-center font-medium pb-1">1ST</th>
                <th className="text-center font-medium pb-1">2ND</th>
                <th className="text-center font-medium pb-1">OVERS</th>
                <th className="text-right font-bold text-white pb-1 pr-1">TOTAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="text-stone-200">
                <td className="py-1 pl-1 font-sans font-bold text-white flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
                  {team1.shortName || team1.name.slice(0, 3).toUpperCase()}
                </td>
                <td className="text-center py-1 text-stone-300">{t1Inn1}</td>
                <td className="text-center py-1 text-stone-300">{t1Inn2}</td>
                <td className="text-center py-1 text-stone-400">{team1.overs || '-'}</td>
                <td className="text-right py-1 pr-1 font-bold text-white">{team1.score}</td>
              </tr>
              <tr className="text-stone-200">
                <td className="py-1 pl-1 font-sans font-bold text-white flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-dot" />
                  {team2.shortName || team2.name.slice(0, 3).toUpperCase()}
                </td>
                <td className="text-center py-1 text-stone-300">{t2Inn1}</td>
                <td className="text-center py-1 text-stone-500">-</td>
                <td className="text-center py-1 text-stone-400">{miniscore?.overs || team2.overs || '-'}</td>
                <td className="text-right py-1 pr-1 font-bold text-amber-300">{t2Inn1}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Limited overs (T20 / ODI)
  return (
    <div className="w-full px-4 my-1 flex-shrink-0">
      <div className="w-full rounded-lg bg-black/30 backdrop-blur-md border border-white/5 px-2.5 py-1">
        <table className="w-full text-[10px] font-mono leading-tight">
          <thead>
            <tr className="text-stone-400 border-b border-white/10 pb-0.5">
              <th className="text-left font-sans font-semibold pb-1 pl-1 w-16">TEAM</th>
              <th className="text-center font-medium pb-1">RUNS</th>
              <th className="text-center font-medium pb-1">WKTS</th>
              <th className="text-center font-medium pb-1">OVERS</th>
              <th className="text-right font-bold text-white pb-1 pr-1">CR/RR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr className="text-stone-200">
              <td className="py-1 pl-1 font-sans font-bold text-white flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                {team1.shortName || team1.name.slice(0, 3).toUpperCase()}
              </td>
              <td className="text-center py-1 text-stone-300">{team1.score?.split('/')[0] || team1.score}</td>
              <td className="text-center py-1 text-stone-300">{team1.score?.split('/')[1] || '-'}</td>
              <td className="text-center py-1 text-stone-400">{team1.overs || '-'}</td>
              <td className="text-right py-1 pr-1 font-bold text-white">10.20</td>
            </tr>
            <tr className="text-stone-200">
              <td className="py-1 pl-1 font-sans font-bold text-white flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse-dot" />
                {team2.shortName || team2.name.slice(0, 3).toUpperCase()}
              </td>
              <td className="text-center py-1 text-stone-300">{miniscore?.runs || team2.score?.split('/')[0]}</td>
              <td className="text-center py-1 text-stone-300">{miniscore?.wickets || team2.score?.split('/')[1]}</td>
              <td className="text-center py-1 text-stone-400">{miniscore?.overs || team2.overs}</td>
              <td className="text-right py-1 pr-1 font-bold text-amber-300">
                {miniscore?.currentRunRate || '8.73'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
