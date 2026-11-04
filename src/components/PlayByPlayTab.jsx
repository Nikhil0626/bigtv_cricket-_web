import React, { useState } from 'react';

export default function PlayByPlayTab({ match }) {
  const [filter, setFilter] = useState('all');

  // Baseline commentary for India Tour of New Zealand 1st ODI
  const defaultCommentary = [
    {
      over: '18.4',
      bowler: 'Nathan Smith',
      batter: 'Shreyas Iyer',
      runs: 2,
      type: 'runs',
      text: 'Nathan Smith to Shreyas Iyer, 2 runs, fullish around off, Shreyas Iyer inner halves it to deep backward square leg for a couple of runs.'
    },
    {
      over: '18.3',
      bowler: 'Nathan Smith',
      batter: 'Shreyas Iyer',
      runs: 0,
      type: 'dot',
      text: 'Good length delivery on off stump, defended forward solidly towards mid-off.'
    },
    {
      over: '18.2',
      bowler: 'Nathan Smith',
      batter: 'Shubman Gill',
      runs: 'W',
      type: 'wicket',
      text: 'OUT! Shubman Gill c Tom Latham b Nathan Smith 37(56) - 114/2! Slower ball outside off, Gill tries to cut over the infield, edges behind to Latham!'
    },
    {
      over: '18.1',
      bowler: 'Nathan Smith',
      batter: 'Shubman Gill',
      runs: 0,
      type: 'dot',
      text: 'Back of a length angling into off stump, dabbed to backward point.'
    },
    {
      over: '17.6',
      bowler: 'Jacob Duffy',
      batter: 'Virat Kohli',
      runs: 1,
      type: 'single',
      text: 'Fuller outside off, Kohli pushes with soft hands through covers for an easy single.'
    },
    {
      over: '17.5',
      bowler: 'Jacob Duffy',
      batter: 'Virat Kohli',
      runs: 4,
      type: 'four',
      text: 'FOUR! Glorious cover drive! Kohli leans into the half-volley and creams it through extra cover for a boundary!'
    },
    {
      over: '17.4',
      bowler: 'Jacob Duffy',
      batter: 'Virat Kohli',
      runs: 2,
      type: 'runs',
      text: 'Whipped off the hips through square leg, sharp running between wickets for two.'
    },
    {
      over: '17.3',
      bowler: 'Jacob Duffy',
      batter: 'Virat Kohli',
      runs: 0,
      type: 'dot',
      text: 'Beaten outside off! Nip back off the seam, Kohli leaves it alone on length.'
    }
  ];

  // Parse comwrapper from match if available
  let commentaryList = defaultCommentary;
  if (match?.comwrapper && Array.isArray(match.comwrapper) && match.comwrapper.length > 0) {
    const apiCommentary = match.comwrapper.map((item) => {
      const comm = item.commentary || item;
      const text = comm.commtxt || '';
      let type = 'single';
      let runs = 1;

      if (text.toLowerCase().includes('out') || text.toLowerCase().includes('wicket') || comm.eventtype === 'WICKET') {
        type = 'wicket';
        runs = 'W';
      } else if (text.toLowerCase().includes('six') || text.toLowerCase().includes('6 runs')) {
        type = 'six';
        runs = 6;
      } else if (text.toLowerCase().includes('four') || text.toLowerCase().includes('4 runs')) {
        type = 'four';
        runs = 4;
      } else if (text.toLowerCase().includes('2 runs') || text.toLowerCase().includes('couple')) {
        type = 'runs';
        runs = 2;
      } else if (text.toLowerCase().includes('no run') || text.toLowerCase().includes('dot ball')) {
        type = 'dot';
        runs = 0;
      }

      // Try to parse bowler and batter from text "Bowler to Batter, ..."
      let bowler = 'Nathan Smith';
      let batter = 'Shreyas Iyer';
      const parts = text.split(',');
      if (parts[0] && parts[0].includes(' to ')) {
        const names = parts[0].split(' to ');
        bowler = names[0].trim();
        batter = names[1]?.trim() || batter;
      }

      return {
        over: comm.overnum ? String(comm.overnum) : '18.4',
        bowler,
        batter,
        runs,
        type,
        text
      };
    });

    if (apiCommentary.length > 0) {
      // Merge apiCommentary with default list if API only returns 1 ball
      const combined = [...apiCommentary];
      defaultCommentary.forEach(d => {
        if (!combined.some(c => c.over === d.over)) {
          combined.push(d);
        }
      });
      commentaryList = combined;
    }
  }

  const filtered = commentaryList.filter(item => {
    if (filter === 'wickets') return item.type === 'wicket';
    if (filter === 'boundaries') return item.type === 'four' || item.type === 'six';
    return true;
  });

  return (
    <div className="w-full h-full flex flex-col justify-between rounded-xl bg-[#1c1218]/80 backdrop-blur-xl border border-white/10 p-2 shadow-xl overflow-hidden">
      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 pb-1 border-b border-white/10 flex-shrink-0">
        {[
          { id: 'all', label: 'All Balls' },
          { id: 'boundaries', label: 'Boundaries (4s & 6s)' },
          { id: 'wickets', label: 'Wickets 🔴' },
        ].map(chip => (
          <button
            key={chip.id}
            onClick={() => setFilter(chip.id)}
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
              filter === chip.id
                ? 'bg-red-500/30 border border-red-500/50 text-white'
                : 'bg-white/5 border border-white/10 text-stone-400 hover:text-white'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Internal scrollable list */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-1.5 py-1">
        {filtered.map((item, idx) => {
          let badgeBg = 'bg-stone-800 text-stone-300 border-stone-700';
          if (item.type === 'wicket') badgeBg = 'bg-red-600 text-white font-extrabold border-red-400 shadow-[0_0_6px_rgba(239,68,68,0.7)]';
          if (item.type === 'six') badgeBg = 'bg-purple-600 text-white font-extrabold border-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.7)]';
          if (item.type === 'four') badgeBg = 'bg-emerald-600 text-white font-extrabold border-emerald-400';
          if (item.type === 'runs') badgeBg = 'bg-sky-700/80 text-sky-100 font-bold border-sky-500/50';

          return (
            <div
              key={idx}
              className="rounded-lg bg-black/40 border border-white/5 p-1.5 flex gap-2 text-[10px]"
            >
              <div className="flex flex-col items-center flex-shrink-0">
                <span className="font-mono text-[9px] font-bold text-stone-400">
                  {item.over}
                </span>
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center font-mono font-bold text-[10px] ${badgeBg}`}>
                  {item.runs}
                </span>
              </div>
              <div className="flex-1">
                <div className="text-stone-300 font-semibold flex items-center gap-1">
                  <span className="text-white">{item.bowler}</span>
                  <span className="text-stone-500 text-[9px]">to</span>
                  <span className="text-amber-300">{item.batter}</span>
                </div>
                <p className="text-stone-300/80 leading-snug line-clamp-2">
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
