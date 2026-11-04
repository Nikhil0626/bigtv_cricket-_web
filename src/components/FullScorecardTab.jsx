import React, { useState } from 'react';

export default function FullScorecardTab({ match }) {
  const [selectedInning, setSelectedInning] = useState(1);

  const indiaBatting = [
    { name: 'Rohit Sharma (c)', dismissal: 'c Warner b Starc', runs: 22, balls: 14, fours: 3, sixes: 1, sr: '157.1' },
    { name: 'Yashasvi Jaiswal', dismissal: 'c Marsh b Hazlewood', runs: 18, balls: 11, fours: 2, sixes: 1, sr: '163.6' },
    { name: 'Virat Kohli', dismissal: 'c Head b Zampa', runs: 64, balls: 39, fours: 6, sixes: 2, sr: '164.1' },
    { name: 'Suryakumar Yadav', dismissal: 'c Inglis b Cummins', runs: 28, balls: 15, fours: 3, sixes: 2, sr: '186.7' },
    { name: 'Hardik Pandya', dismissal: 'not out', runs: 42, balls: 19, fours: 3, sixes: 3, sr: '221.1' },
    { name: 'Rinku Singh', dismissal: 'b Starc', runs: 8, balls: 5, fours: 1, sixes: 0, sr: '160.0' },
  ];

  const ausBowling = [
    { name: 'Mitchell Starc', overs: '4.0', runs: 38, wickets: 2, econ: '9.50' },
    { name: 'Josh Hazlewood', overs: '4.0', runs: 30, wickets: 1, econ: '7.50' },
    { name: 'Pat Cummins', overs: '4.0', runs: 34, wickets: 1, econ: '8.50' },
    { name: 'Adam Zampa', overs: '4.0', runs: 42, wickets: 2, econ: '10.50' },
  ];

  const ausBatting = [
    { name: 'David Warner', dismissal: 'c sub b Bumrah', runs: 15, balls: 10, fours: 2, sixes: 0, sr: '150.0' },
    { name: 'Travis Head', dismissal: 'b Siraj', runs: 24, balls: 16, fours: 3, sixes: 1, sr: '150.0' },
    { name: 'Mitchell Marsh (c)', dismissal: 'c Kohli b Arshdeep', runs: 56, balls: 34, fours: 5, sixes: 3, sr: '164.7' },
    { name: 'Glenn Maxwell', dismissal: 'b Bumrah', runs: 21, balls: 14, fours: 2, sixes: 1, sr: '150.0' },
    { name: 'Marcus Stoinis', dismissal: 'lbw b Axar', runs: 12, balls: 9, fours: 1, sixes: 0, sr: '133.3' },
    { name: 'Tim David', dismissal: 'b Bumrah', runs: 18, balls: 12, fours: 1, sixes: 1, sr: '150.0' },
  ];

  const indBowling = [
    { name: 'Jasprit Bumrah', overs: '4.0', runs: 24, wickets: 3, econ: '6.00' },
    { name: 'Arshdeep Singh', overs: '4.0', runs: 32, wickets: 2, econ: '8.00' },
    { name: 'Mohammed Siraj', overs: '4.0', runs: 38, wickets: 2, econ: '9.50' },
    { name: 'Axar Patel', overs: '4.0', runs: 36, wickets: 1, econ: '9.00' },
  ];

  const isInn1 = selectedInning === 1;
  const currentBatters = isInn1 ? indiaBatting : ausBatting;
  const currentBowlers = isInn1 ? ausBowling : indBowling;

  return (
    <div className="w-full h-full flex flex-col justify-between rounded-xl bg-[#1c1218]/80 backdrop-blur-xl border border-white/10 p-2 shadow-xl overflow-hidden text-[10px]">
      {/* Innings Selector */}
      <div className="flex items-center justify-between border-b border-white/10 pb-1 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedInning(1)}
            className={`px-2 py-0.5 rounded-full font-bold transition-all ${
              isInn1 ? 'bg-red-500/30 text-white border border-red-500/50' : 'text-stone-400 hover:text-white'
            }`}
          >
            India 188/6
          </button>
          <button
            onClick={() => setSelectedInning(2)}
            className={`px-2 py-0.5 rounded-full font-bold transition-all ${
              !isInn1 ? 'bg-red-500/30 text-white border border-red-500/50' : 'text-stone-400 hover:text-white'
            }`}
          >
            Australia 170/9
          </button>
        </div>
        <span className="font-mono text-amber-300 font-semibold">{isInn1 ? 'IND (20.0 ov)' : 'AUS (20.0 ov)'}</span>
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
              {currentBatters.map((b, i) => (
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
              {currentBowlers.map((bw, i) => (
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
