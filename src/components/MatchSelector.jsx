import React from 'react';
import TeamLogo from './TeamLogo';

/**
 * Match Selector Pills / Carousel
 * Lets users switch between available live matches while defaulting to the first match
 */
export default function MatchSelector({ matches = [], selectedMatchId, onSelectMatch }) {
  if (!matches || matches.length <= 1) return null;

  return (
    <div className="w-full px-4 mb-2">
      <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 px-1 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-dot" />
          <span>Live Matches ({matches.length})</span>
        </span>
        <span className="text-stone-500 font-normal">Tap to switch</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {matches.map((m) => {
          const isSelected = String(m.matchId) === String(selectedMatchId);
          const t1Code = m.team1ShortName || m.team1Name?.slice(0, 3) || 'T1';
          const t2Code = m.team2ShortName || m.team2Name?.slice(0, 3) || 'T2';

          return (
            <button
              key={m.matchId}
              onClick={() => onSelectMatch(m.matchId)}
              className={`flex-shrink-0 flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all border ${
                isSelected
                  ? 'bg-red-950/60 border-red-500/60 shadow-lg text-white scale-[1.02]'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-stone-300'
              }`}
            >
              <div className="flex items-center -space-x-1.5">
                <TeamLogo shortName={t1Code} name={m.team1Name} size={22} />
                <TeamLogo shortName={t2Code} name={m.team2Name} size={22} />
              </div>
              
              <div className="flex flex-col text-left">
                <div className="text-xs font-bold font-mono tracking-tight flex items-center gap-1">
                  <span>{t1Code}</span>
                  <span className="text-stone-500 text-[10px]">vs</span>
                  <span>{t2Code}</span>
                  <span className="text-[9px] px-1 rounded bg-black/40 text-amber-300 font-sans uppercase">
                    {m.matchFormat || 'LIVE'}
                  </span>
                </div>
                <div className="text-[10px] text-stone-400 truncate max-w-[140px]">
                  {m.matchDesc || m.seriesName}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

