import React from 'react';
import { MapPin, Calendar, Trophy, Award } from 'lucide-react';

export default function MatchInfoTab({ match }) {
  if (!match) return null;

  return (
    <div className="w-full space-y-3">
      {/* Match Details Card */}
      <div className="rounded-2xl bg-[#1d1419]/70 backdrop-blur-xl border border-white/10 p-4 shadow-xl">
        <div className="text-xs font-bold uppercase tracking-wider text-stone-200 mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Match Information</span>
        </div>

        <div className="divide-y divide-white/5 text-xs">
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-stone-400">Series</span>
            <span className="text-white font-semibold text-right max-w-[220px]">{match.seriesName}</span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-stone-400">Match</span>
            <span className="text-white font-semibold">{match.matchDesc}</span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-stone-400">Format</span>
            <span className="text-amber-300 font-bold">{match.matchFormat || 'CRICKET'}</span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-stone-400">Venue</span>
            <span className="text-white font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              {match.venue}, {match.city}
            </span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-stone-400">Date & Time</span>
            <span className="text-stone-200 flex items-center gap-1 font-mono">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              {match.startTime ? new Date(match.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Today'}
            </span>
          </div>
          <div className="py-2.5 flex justify-between items-center">
            <span className="text-stone-400">Toss</span>
            <span className="text-stone-200">{match.team1?.name} won the toss & chose to bat</span>
          </div>
        </div>
      </div>

      {/* Officials & Umpires Card */}
      <div className="rounded-2xl bg-[#1d1419]/70 backdrop-blur-xl border border-white/10 p-4 shadow-xl">
        <div className="text-xs font-bold uppercase tracking-wider text-stone-200 mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-purple-400" />
          <span>Match Officials</span>
        </div>

        <div className="divide-y divide-white/5 text-xs">
          <div className="py-2 flex justify-between">
            <span className="text-stone-400">On-field Umpires</span>
            <span className="text-stone-200 font-medium">Richard Kettleborough, Nitin Menon</span>
          </div>
          <div className="py-2 flex justify-between">
            <span className="text-stone-400">Third Umpire</span>
            <span className="text-stone-200 font-medium">Kumar Dharmasena</span>
          </div>
          <div className="py-2 flex justify-between">
            <span className="text-stone-400">Match Referee</span>
            <span className="text-stone-200 font-medium">Javagal Srinath</span>
          </div>
        </div>
      </div>
    </div>
  );
}

