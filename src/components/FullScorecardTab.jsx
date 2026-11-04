import React, { useState } from 'react';

export default function FullScorecardTab({ match }) {
  const [selectedInning, setSelectedInning] = useState(2); // Default to 2nd innings

  const isUAEvsOman = match?.team1?.shortName === 'UAE' || match?.team2?.shortName === 'OMAN';

  // UAE vs Oman Scorecard
  const uaeBatting = [
    { name: 'Muhammad Waseem (c)', dismissal: 'c Bilal b Fayyaz', runs: 68, balls: 72, fours: 7, sixes: 2, sr: '94.4' },
    { name: 'Aryansh Sharma (wk)', dismissal: 'c Shoaib b Kaleemullah', runs: 32, balls: 45, fours: 4, sixes: 0, sr: '71.1' },
    { name: 'Vishnu Sukumaran', dismissal: 'lbw b Aqib Ilyas', runs: 41, balls: 54, fours: 3, sixes: 1, sr: '75.9' },
    { name: 'Rahul Chopra', dismissal: 'b Fayyaz Butt', runs: 28, balls: 36, fours: 2, sixes: 0, sr: '77.8' },
    { name: 'Basil Hameed', dismissal: 'c Naseem b Bilal', runs: 18, balls: 22, fours: 1, sixes: 0, sr: '81.8' },
    { name: 'Ali Naseer', dismissal: 'not out', runs: 24, balls: 19, fours: 2, sixes: 1, sr: '126.3' },
  ];

  const omanBowling = [
    { name: 'Bilal Khan', overs: '10.0', runs: 46, wickets: 2, econ: '4.60' },
    { name: 'Kaleemullah', overs: '9.6', runs: 42, wickets: 2, econ: '4.37' },
    { name: 'Fayyaz Butt', overs: '10.0', runs: 48, wickets: 2, econ: '4.80' },
    { name: 'Aqib Ilyas', overs: '10.0', runs: 44, wickets: 1, econ: '4.40' },
    { name: 'Shakeel Ahmad', overs: '10.0', runs: 41, wickets: 1, econ: '4.10' },
  ];

  const omanBatting = [
    { name: 'Kashyap Prajapati', dismissal: 'c Waseem b Junaid', runs: 18, balls: 24, fours: 3, sixes: 0, sr: '75.0' },
    { name: 'Jatinder Singh', dismissal: 'b Ali Naseer', runs: 26, balls: 38, fours: 2, sixes: 1, sr: '68.4' },
    { name: 'Aqib Ilyas (c)', dismissal: 'c Sharma b Simranjeet', runs: 34, balls: 46, fours: 4, sixes: 0, sr: '73.9' },
    { name: 'Ayaan Khan', dismissal: 'c Waseem b Junaid', runs: 24, balls: 38, fours: 2, sixes: 0, sr: '63.2' },
    { name: 'Naseem Khushi (wk) *', dismissal: 'batting', runs: 14, balls: 16, fours: 1, sixes: 1, sr: '87.5' },
    { name: 'Mehran Khan *', dismissal: 'batting', runs: 22, balls: 28, fours: 2, sixes: 0, sr: '78.6' },
  ];

  const uaeBowling = [
    { name: 'Junaid Siddique', overs: '8.6', runs: 38, wickets: 3, econ: '4.38' },
    { name: 'Ali Naseer', overs: '8.0', runs: 32, wickets: 2, econ: '4.00' },
    { name: 'Simranjeet Singh', overs: '7.0', runs: 28, wickets: 1, econ: '4.00' },
    { name: 'Basil Hameed', overs: '8.0', runs: 30, wickets: 1, econ: '3.75' },
  ];

  // NZ vs India Scorecard
  const nzBatting = [
    { name: 'Will Young', dismissal: 'c Rahul b Siraj', runs: 12, balls: 18, fours: 2, sixes: 0, sr: '66.7' },
    { name: 'Rachin Ravindra', dismissal: 'c Kohli b Bumrah', runs: 34, balls: 42, fours: 4, sixes: 1, sr: '81.0' },
    { name: 'Kane Williamson', dismissal: 'lbw b Kuldeep', runs: 45, balls: 62, fours: 5, sixes: 0, sr: '72.6' },
    { name: 'Daryl Mitchell', dismissal: 'c Iyer b Arshdeep', runs: 28, balls: 31, fours: 2, sixes: 1, sr: '90.3' },
    { name: 'Tom Latham (c & wk)', dismissal: 'b Bumrah', runs: 22, balls: 26, fours: 3, sixes: 0, sr: '84.6' },
    { name: 'Glenn Phillips', dismissal: 'c & b Jadeja', runs: 16, balls: 19, fours: 1, sixes: 1, sr: '84.2' },
  ];

  const indBowling = [
    { name: 'Jasprit Bumrah', overs: '8.0', runs: 32, wickets: 3, econ: '4.00' },
    { name: 'Mohammed Siraj', overs: '8.0', runs: 38, wickets: 2, econ: '4.75' },
    { name: 'Arshdeep Singh', overs: '8.0', runs: 39, wickets: 2, econ: '4.88' },
    { name: 'Kuldeep Yadav', overs: '8.2', runs: 41, wickets: 2, econ: '4.92' },
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
  ];

  const isInn1 = selectedInning === 1;
  const currentBatters = isUAEvsOman 
    ? (isInn1 ? uaeBatting : omanBatting)
    : (isInn1 ? nzBatting : indBatting);

  const currentBowlers = isUAEvsOman
    ? (isInn1 ? omanBowling : uaeBowling)
    : (isInn1 ? indBowling : nzBowling);

  const t1Name = match?.team1?.shortName || (isUAEvsOman ? 'UAE' : 'NZ');
  const t2Name = match?.team2?.shortName || (isUAEvsOman ? 'OMAN' : 'IND');
  const t1Score = match?.team1?.score || (isUAEvsOman ? '226/8' : '185/10');
  const t2Score = match?.team2?.score || (isUAEvsOman ? '142/7' : '143/5');
  const t1Overs = match?.team1?.overs || (isUAEvsOman ? '49.6' : '40.2');
  const t2Overs = match?.team2?.overs || (isUAEvsOman ? '41.6' : '22.4');

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
            {t1Name} {t1Score}
          </button>
          <button
            onClick={() => setSelectedInning(2)}
            className={`px-2 py-0.5 rounded-full font-bold transition-all ${
              !isInn1 ? 'bg-red-500/30 text-white border border-red-500/50' : 'text-stone-400 hover:text-white'
            }`}
          >
            {t2Name} {t2Score}
          </button>
        </div>
        <span className="font-mono text-amber-300 font-semibold">
          {isInn1 ? `${t1Name} (${t1Overs} ov)` : `${t2Name} (${t2Overs} ov)`}
        </span>
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
