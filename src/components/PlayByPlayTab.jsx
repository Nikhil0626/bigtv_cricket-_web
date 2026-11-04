import React, { useState } from 'react';

export default function PlayByPlayTab({ match }) {
  const [filter, setFilter] = useState('all');

  const commentaryList = [
    {
      over: '19.6',
      bowler: 'Jasprit Bumrah',
      batter: 'Mitchell Starc',
      runs: 'W',
      type: 'wicket',
      text: 'OUT! CLEAN BOWLED! Bumrah finishes in supreme style! 142kph toe-crusher rips out middle stump! India seal an 18-run victory at the SCG!'
    },
    {
      over: '19.5',
      bowler: 'Jasprit Bumrah',
      batter: 'Adam Zampa',
      runs: 1,
      type: 'single',
      text: 'Pinpoint yorker on leg stump, jammed out into the off-side for a single.'
    },
    {
      over: '19.4',
      bowler: 'Jasprit Bumrah',
      batter: 'Tim David',
      runs: 'W',
      type: 'wicket',
      text: 'OUT! CAUGHT AT LONG-ON! Slower cutter into the deck, David tries to clear the ropes, mistimes it straight down Hardik Pandya throat!'
    },
    {
      over: '19.3',
      bowler: 'Jasprit Bumrah',
      batter: 'Tim David',
      runs: 2,
      type: 'runs',
      text: 'Full and angled into the pads, flicked wide of long-on for a hurried couple.'
    },
    {
      over: '19.2',
      bowler: 'Jasprit Bumrah',
      batter: 'Tim David',
      runs: 0,
      type: 'dot',
      text: 'Dot ball! Perfect blockhole yorker, David cannot get underneath it!'
    },
    {
      over: '18.6',
      bowler: 'Arshdeep Singh',
      batter: 'Mitchell Marsh',
      runs: 'W',
      type: 'wicket',
      text: 'OUT! CAUGHT! Crucial wicket! Marsh looks to launch over extra cover, slice flies to Virat Kohli who takes a tumbling catch!'
    },
    {
      over: '18.5',
      bowler: 'Arshdeep Singh',
      batter: 'Mitchell Marsh',
      runs: 6,
      type: 'six',
      text: 'SIX! Crunched into the SCG stands! Marsh deposits the slot ball 89 meters over long-on!'
    },
    {
      over: '18.4',
      bowler: 'Arshdeep Singh',
      batter: 'Tim David',
      runs: 1,
      type: 'single',
      text: 'Full toss pushed down to mid-off for one.'
    }
  ];

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
          { id: 'boundaries', label: 'Boundaries (6s)' },
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
