import React, { useState } from 'react';

export default function FullScorecardTab({ match }) {
  const [selectedInning, setSelectedInning] = useState(2); // Default to live 2nd inning (India chase)

  const nzBatting = [
    { name: 'Will Young', dismissal: 'c Rahul b Siraj', runs: 12, balls: 18, fours: 2, sixes: 0, sr: '66.7' },
    { name: 'Rachin Ravindra', dismissal: 'c Kohli b Bumrah', runs: 34, balls: 42, fours: 4, sixes: 1, sr: '81.0' },
    { name: 'Kane Williamson', dismissal: 'lbw b Kuldeep', runs: 45, balls: 62, fours: 5, sixes: 0, sr: '72.6' },
    { name: 'Daryl Mitchell', dismissal: 'c Iyer b Arshdeep', runs: 28, balls: 31, fours: 2, sixes: 1, sr: '90.3' },
    { name: 'Tom Latham (c & wk)', dismissal: 'b Bumrah', runs: 22, balls: 26, fours: 3, sixes: 0, sr: '84.6' },
    { name: 'Glenn Phillips', dismissal: 'c & b Jadeja', runs: 16, balls: 19, fours: 1, sixes: 1, sr: '84.2' },
    { name: 'Mitchell Santner', dismissal: 'c Gill b Siraj', runs: 18, balls: 24, fours: 1, sixes: 0, sr: '75.0' },
    { name: 'Nathan Smith', dismissal: 'c Rahul b Bumrah', runs: 5, balls: 9, fours: 0, sixes: 0, sr: '55.6' },
    { name: 'Jacob Duffy', dismissal: 'not out', runs: 3, balls: 11, fours: 0, sixes: 0, sr: '27.3' },
  ];

  const indBowling = [
    { name: 'Jasprit Bumrah', overs: '8.0', runs: 32, wickets: 3, econ: '4.00' },
    { name: 'Mohammed Siraj', overs: '8.0', runs: 38, wickets: 2, econ: '4.75' },
    { name: 'Arshdeep Singh', overs: '8.0', runs: 39, wickets: 2, econ: '4.88' },
    { name: 'Kuldeep Yadav', overs: '8.2', runs: 41, wickets: 2, econ: '4.92' },
    { name: 'Ravindra Jadeja', overs: '8.0', runs: 35, wickets: 1, econ: '4.38' },
  ];

  const indBatting = [
    { name: 'Rohit Sharma (c)', dismissal: 'c Mitchell b Duffy', runs: 8, balls: 10, fours: 1, sixes: 0, sr: '80.0' },
    { name: 'Shubman Gill', dismissal: 'c Latham b Nathan Smith', runs: 37, balls: 56, fours: 4, sixes: 1, sr: '66.1' },
    { name: 'Virat Kohli *', dismissal: 'batting', runs: 69, balls: 48, fours: 12, sixes: 1, sr: '143.75' },
    { name: 'Shreyas Iyer *', dismissal: 'batting', runs: 2, balls: 2, fours: 0, sixes: 0, sr: '100.0' },
  ];

  const nzBowling = [
    { name: 'Nathan Smith', overs: '2.4', runs: 10, wickets: 1, econ: '3.75' },
    { name: 'Jacob Duffy', overs: '5.0', runs: 33, wickets: 1, econ: '6.60' },
    { name: 'Trent Boult', overs: '6.0', runs: 38, wickets: 0, econ: '6.33' },
    { name: 'Mitchell Santner', overs: '5.0', runs: 35, wickets: 0, econ: '7.00' },
  ];

  const isInn1 = selectedInning === 1;
  const currentBatters = isInn1 ? nzBatting : indBatting;
  const currentBowlers = isInn1 ? indBowling : nzBowling;

  const t1Score = match?.team1?.score || '185/10';
  const t2Score = match?.team2?.score || '116/2';
  const t1Overs = match?.team1?.overs || '40.2';
  const t2Overs = match?.team2?.overs || '18.4';

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
            NZ {t1Score}
          </button>
          <button
            onClick={() => setSelectedInning(2)}
            className={`px-2 py-0.5 rounded-full font-bold transition-all ${
              !isInn1 ? 'bg-red-500/30 text-white border border-red-500/50' : 'text-stone-400 hover:text-white'
            }`}
          >
            IND {t2Score}
          </button>
        </div>
        <span className="font-mono text-amber-300 font-semibold">{isInn1 ? `NZ (${t1Overs} ov)` : `IND (${t2Overs} ov)`}</span>
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
                  <td className="text-center py-1 text-stone-400">{bw.overs}</td>
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
