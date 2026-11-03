import React, { useState } from 'react';

export default function FullScorecardTab({ match }) {
  const [selectedInning, setSelectedInning] = useState(2);

  const battingData = [
    { name: 'Glenn Maxwell', dismissal: 'batting', runs: match?.miniscore?.batsmanStriker?.runs || 46, balls: match?.miniscore?.batsmanStriker?.balls || 22, fours: 4, sixes: 3, sr: '190.9' },
    { name: 'Tim David', dismissal: 'batting', runs: match?.miniscore?.batsmanNonStriker?.runs || 18, balls: match?.miniscore?.batsmanNonStriker?.balls || 9, fours: 1, sixes: 1, sr: '200.0' },
    { name: 'David Warner', dismissal: 'c Kohli b Bumrah', runs: 28, balls: 19, fours: 3, sixes: 1, sr: '147.4' },
    { name: 'Travis Head', dismissal: 'b Siraj', runs: 34, balls: 22, fours: 4, sixes: 2, sr: '154.5' },
    { name: 'Marcus Stoinis', dismissal: 'c Pant b Bumrah', runs: 14, balls: 10, fours: 1, sixes: 1, sr: '140.0' },
  ];

  const bowlingData = [
    { name: 'Jasprit Bumrah', overs: '3.4', runs: 28, wickets: 2, econ: '7.63' },
    { name: 'Arshdeep Singh', overs: '4.0', runs: 38, wickets: 1, econ: '9.50' },
    { name: 'Mohammed Siraj', overs: '4.0', runs: 42, wickets: 1, econ: '10.50' },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between rounded-xl bg-[#1c1218]/80 backdrop-blur-xl border border-white/10 p-2 shadow-xl overflow-hidden text-[10px]">
      <div className="flex items-center justify-between border-b border-white/10 pb-1 flex-shrink-0">
        <span className="font-bold text-white uppercase tracking-wider">Full Scorecard</span>
        <span className="font-mono text-amber-300 font-semibold">{match?.team2?.name}: {match?.miniscore?.runs || 163}/{match?.miniscore?.wickets || 5}</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 py-1">
        {/* Batting table */}
        <div>
          <div className="text-[9px] uppercase font-bold text-stone-400 mb-0.5">Batting</div>
          <table className="w-full font-mono">
            <thead>
              <tr className="text-stone-400 text-[8px] border-b border-white/10">
                <th className="text-left font-sans pb-0.5">BATTER</th>
                <th className="text-center pb-0.5">R</th>
                <th className="text-center pb-0.5">B</th>
                <th className="text-center pb-0.5">4s</th>
                <th className="text-center pb-0.5">6s</th>
                <th className="text-right pb-0.5">SR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {battingData.map((b, i) => (
                <tr key={i}>
                  <td className="py-1 text-left font-sans font-medium text-white truncate max-w-[90px]">{b.name}</td>
                  <td className="text-center py-1 font-bold text-white">{b.runs}</td>
                  <td className="text-center py-1 text-stone-400">{b.balls}</td>
                  <td className="text-center py-1 text-stone-300">{b.fours}</td>
                  <td className="text-center py-1 text-stone-300">{b.sixes}</td>
                  <td className="text-right py-1 text-emerald-400">{b.sr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bowling table */}
        <div className="pt-1 border-t border-white/5">
          <div className="text-[9px] uppercase font-bold text-stone-400 mb-0.5">Bowling</div>
          <table className="w-full font-mono">
            <thead>
              <tr className="text-stone-400 text-[8px] border-b border-white/10">
                <th className="text-left font-sans pb-0.5">BOWLER</th>
                <th className="text-center pb-0.5">O</th>
                <th className="text-center pb-0.5">R</th>
                <th className="text-center pb-0.5">W</th>
                <th className="text-right pb-0.5">ECO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bowlingData.map((bw, i) => (
                <tr key={i}>
                  <td className="py-1 text-left font-sans font-medium text-white truncate max-w-[90px]">{bw.name}</td>
                  <td className="text-center py-1 text-stone-300">{bw.overs}</td>
                  <td className="text-center py-1 text-stone-300">{bw.runs}</td>
                  <td className="text-center py-1 font-bold text-red-400">{bw.wickets}</td>
                  <td className="text-right py-1 text-stone-300">{bw.econ}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
