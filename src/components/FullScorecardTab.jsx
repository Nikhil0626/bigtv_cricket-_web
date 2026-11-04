import React, { useState } from 'react';

export default function FullScorecardTab({ match }) {
  const [selectedInning, setSelectedInning] = useState(2); // Default to live 2nd inning

  const team1 = match?.team1 || { name: 'Team 1', shortName: 'TM1', score: '0/0', overs: '0.0' };
  const team2 = match?.team2 || { name: 'Team 2', shortName: 'TM2', score: '0/0', overs: '0.0' };
  const miniscore = match?.miniscore;

  const t1Score = team1.score || '0/0';
  const t2Score = team2.score || '0/0';
  const t1Overs = team1.overs || '0.0';
  const t2Overs = miniscore?.overs || team2.overs || '0.0';

  const isInn1 = selectedInning === 1;

  // Extract from match.scorecard if loaded via RapidAPI /scard endpoint
  const rawScorecard = match?.scorecard;
  let inn1Data = null;
  let inn2Data = null;

  if (Array.isArray(rawScorecard) && rawScorecard.length > 0) {
    inn1Data = rawScorecard.find(inn => inn.inningsid === 1) || rawScorecard[0];
    inn2Data = rawScorecard.find(inn => inn.inningsid === 2) || rawScorecard[1] || null;
  }

  // Active inning object from RapidAPI
  const activeInningApi = isInn1 ? inn1Data : inn2Data;

  // Batters list
  let currentBatters = [];
  if (activeInningApi?.batsman && activeInningApi.batsman.length > 0) {
    currentBatters = activeInningApi.batsman.map(b => ({
      name: b.name || b.nickname || 'Batter',
      dismissal: b.outdec || (b.balls > 0 ? 'batting' : 'not out'),
      runs: b.runs ?? 0,
      balls: b.balls ?? 0,
      fours: b.fours ?? 0,
      sixes: b.sixes ?? 0,
      sr: b.strkrate ? String(b.strkrate) : (b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(1) : '0.0')
    }));
  } else if (!isInn1 && miniscore?.batsmanStriker) {
    // Construct from live miniscore for 2nd innings
    currentBatters = [
      {
        name: miniscore.batsmanStriker.name + ' *',
        dismissal: 'batting',
        runs: miniscore.batsmanStriker.runs,
        balls: miniscore.batsmanStriker.balls,
        fours: miniscore.batsmanStriker.fours,
        sixes: miniscore.batsmanStriker.sixes,
        sr: miniscore.batsmanStriker.strikeRate
      }
    ];
    if (miniscore.batsmanNonStriker) {
      currentBatters.push({
        name: miniscore.batsmanNonStriker.name,
        dismissal: 'batting',
        runs: miniscore.batsmanNonStriker.runs,
        balls: miniscore.batsmanNonStriker.balls,
        fours: miniscore.batsmanNonStriker.fours,
        sixes: miniscore.batsmanNonStriker.sixes,
        sr: miniscore.batsmanNonStriker.strikeRate
      });
    }
  } else {
    // Default fallback
    currentBatters = [
      { name: isInn1 ? `${team1.shortName} Opener 1` : `${team2.shortName} Opener 1`, dismissal: 'c & b Bowler', runs: 38, balls: 43, fours: 3, sixes: 2, sr: '88.4' },
      { name: isInn1 ? `${team1.shortName} Opener 2` : `${team2.shortName} Opener 2`, dismissal: 'not out', runs: 47, balls: 53, fours: 1, sixes: 3, sr: '88.7' },
      { name: isInn1 ? `${team1.shortName} Top Order` : `${team2.shortName} Top Order`, dismissal: 'c keeper b Bowler', runs: 47, balls: 79, fours: 2, sixes: 0, sr: '59.5' },
      { name: isInn1 ? `${team1.shortName} Middle Order` : `${team2.shortName} Middle Order`, dismissal: 'not out', runs: 43, balls: 45, fours: 3, sixes: 2, sr: '95.6' }
    ];
  }

  // Bowlers list
  let currentBowlers = [];
  if (activeInningApi?.bowler && activeInningApi.bowler.length > 0) {
    currentBowlers = activeInningApi.bowler.map(bw => ({
      name: bw.name || bw.nickname || 'Bowler',
      overs: bw.overs ? String(bw.overs) : '0.0',
      maidens: bw.maidens ?? 0,
      runs: bw.runs ?? 0,
      wickets: bw.wickets ?? 0,
      econ: bw.economy ? String(bw.economy) : (parseFloat(bw.overs) > 0 ? (bw.runs / parseFloat(bw.overs)).toFixed(2) : '0.0')
    }));
  } else if (!isInn1 && miniscore?.bowlerStriker) {
    currentBowlers = [
      {
        name: miniscore.bowlerStriker.name,
        overs: miniscore.bowlerStriker.overs,
        maidens: miniscore.bowlerStriker.maidens,
        runs: miniscore.bowlerStriker.runs,
        wickets: miniscore.bowlerStriker.wickets,
        econ: miniscore.bowlerStriker.economy
      }
    ];
    if (miniscore.bowlerNonStriker) {
      currentBowlers.push({
        name: miniscore.bowlerNonStriker.name,
        overs: miniscore.bowlerNonStriker.overs,
        maidens: miniscore.bowlerNonStriker.maidens,
        runs: miniscore.bowlerNonStriker.runs,
        wickets: miniscore.bowlerNonStriker.wickets,
        econ: miniscore.bowlerNonStriker.economy
      });
    }
  } else {
    currentBowlers = [
      { name: isInn1 ? `${team2.shortName} Bowler 1` : `${team1.shortName} Bowler 1`, overs: '10.0', runs: 42, wickets: 3, econ: '4.20' },
      { name: isInn1 ? `${team2.shortName} Bowler 2` : `${team1.shortName} Bowler 2`, overs: '10.0', runs: 53, wickets: 2, econ: '5.30' }
    ];
  }

  return (
    <div className="w-full h-full flex flex-col justify-between rounded-xl bg-[#1c1218]/80 backdrop-blur-xl border border-white/10 p-2 shadow-xl overflow-hidden text-[10px]">
      {/* Innings Selector */}
      <div className="flex items-center justify-between border-b border-white/10 pb-1 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedInning(1)}
            className={`px-2 py-0.5 rounded-full font-bold transition-all ${
              isInn1 ? 'bg-red-500/30 text-white border border-red-500/50 shadow-inner' : 'text-stone-400 hover:text-white'
            }`}
          >
            {team1.shortName || '1ST INN'} {t1Score}
          </button>
          <button
            onClick={() => setSelectedInning(2)}
            className={`px-2 py-0.5 rounded-full font-bold transition-all ${
              !isInn1 ? 'bg-red-500/30 text-white border border-red-500/50 shadow-inner' : 'text-stone-400 hover:text-white'
            }`}
          >
            {team2.shortName || '2ND INN'} {t2Score}
          </button>
        </div>
        <span className="font-mono text-amber-300 font-semibold">
          {isInn1 ? `${team1.shortName} (${t1Overs} ov)` : `${team2.shortName} (${t2Overs} ov)`}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 py-1">
        {/* Batting table */}
        <div>
          <div className="text-[9px] uppercase font-bold text-stone-400 mb-0.5 flex items-center justify-between">
            <span>Batting</span>
            {activeInningApi?.score !== undefined && (
              <span className="text-stone-300 font-mono font-bold">{activeInningApi.score}/{activeInningApi.wickets} ({activeInningApi.overs} ov)</span>
            )}
          </div>
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
                  <td className="py-1 text-left font-sans font-medium text-white truncate max-w-[95px]">
                    <div className="truncate">{b.name}</div>
                    {b.dismissal && <div className="text-[7.5px] text-stone-500 font-sans truncate">{b.dismissal}</div>}
                  </td>
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
                <th className="text-center pb-0.5">M</th>
                <th className="text-center pb-0.5">R</th>
                <th className="text-center pb-0.5">W</th>
                <th className="text-right pb-0.5">ECO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentBowlers.map((bw, i) => (
                <tr key={i}>
                  <td className="py-1 text-left font-sans font-medium text-white truncate max-w-[95px]">{bw.name}</td>
                  <td className="text-center py-1 text-stone-400">{bw.overs}</td>
                  <td className="text-center py-1 text-stone-400">{bw.maidens ?? 0}</td>
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
