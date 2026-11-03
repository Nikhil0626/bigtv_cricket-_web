import React from 'react';
import TeamLogo from './TeamLogo';

export default function ScoreHero({ match }) {
  if (!match) return null;

  const {
    seriesName,
    matchDesc,
    matchFormat,
    team1,
    team2,
    miniscore
  } = match;

  const t1Score = team1.score || '0/0';
  const t2Score = team2.score || '0/0';
  const currentOvers = miniscore?.overs ? `${miniscore.overs} ov` : team2.overs ? `${team2.overs} ov` : 'Live';

  return (
    <div className="w-full pt-1 pb-1 px-3 flex flex-col items-center flex-shrink-0">
      {/* Category Tag (e.g. NFL in screenshot -> CRICKET • TEST) */}
      <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase text-stone-400 mb-0.5">
        <span className="text-red-400 font-bold">{matchFormat || 'CRICKET'}</span>
        <span>•</span>
        <span className="truncate max-w-[200px] text-stone-300">{matchDesc || seriesName}</span>
      </div>

      {/* Main Big Scoreboard Row */}
      <div className="w-full flex items-baseline justify-between px-3">
        {/* Team 1 Score (Left) */}
        <div className="flex-1 flex flex-col items-center text-center">
          <div className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono leading-none drop-shadow-sm">
            {t1Score.includes('&') ? (
              <div className="flex flex-col items-center leading-none">
                <span className="text-sm text-stone-300 font-semibold">{t1Score.split('&')[0].trim()}</span>
                <span className="text-2xl sm:text-3xl font-black mt-0.5">{t1Score.split('&')[1].trim()}</span>
              </div>
            ) : (
              t1Score
            )}
          </div>
          <div className="text-stone-500 tracking-widest text-[9px] mt-0.5 font-mono">---</div>
        </div>

        {/* Center Cricket Ball & Overs Status */}
        <div className="flex flex-col items-center px-2 z-10 -mt-1">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-dot" />
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-600 to-rose-900 border border-red-400/50 shadow-inner flex items-center justify-center">
              <span className="text-[9px] leading-none">🏏</span>
            </div>
          </div>
          <span className="text-[11px] font-bold tracking-tight text-stone-200 uppercase bg-black/40 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-sm">
            {currentOvers}
          </span>
          {miniscore?.target && (
            <span className="text-[9px] font-medium text-amber-300/90 mt-0.5">
              Target {miniscore.target}
            </span>
          )}
        </div>

        {/* Team 2 Score (Right) */}
        <div className="flex-1 flex flex-col items-center text-center">
          <div className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono leading-none drop-shadow-sm">
            {t2Score}
          </div>
          <div className="text-stone-500 tracking-widest text-[9px] mt-0.5 font-mono">---</div>
        </div>
      </div>

      {/* Team Logos & Labels (Commands vs 49ers style) */}
      <div className="w-full grid grid-cols-2 gap-2 mt-1 px-2">
        {/* Team 1 Info */}
        <div className="flex flex-col items-center text-center">
          <TeamLogo shortName={team1.shortName} name={team1.name} size={36} className="mb-0.5" />
          <h2 className="text-xs font-bold text-white tracking-tight leading-none truncate max-w-[130px]">
            {team1.name}
          </h2>
          <span className="text-[10px] text-stone-400 font-medium mt-0.5 leading-none">
            {team1.overs ? `${team1.overs} ov` : team1.shortName}
          </span>
        </div>

        {/* Team 2 Info */}
        <div className="flex flex-col items-center text-center">
          <TeamLogo shortName={team2.shortName} name={team2.name} size={36} className="mb-0.5" />
          <h2 className="text-xs font-bold text-white tracking-tight leading-none truncate max-w-[130px]">
            {team2.name}
          </h2>
          <span className="text-[10px] text-stone-400 font-medium mt-0.5 leading-none">
            {team2.overs ? `${team2.overs} ov` : team2.shortName}
          </span>
        </div>
      </div>
    </div>
  );
}
