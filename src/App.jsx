import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Share2, 
  ChevronDown, 
  AlertCircle
} from 'lucide-react';
import { getRecentMatches, getMatchLiveScore, normalizeMatch } from './services/api';
import ScoreHero from './components/ScoreHero';
import CricketPitch from './components/CricketPitch';
import InningsTable from './components/InningsTable';
import ActionBanner from './components/ActionBanner';
import LiveStatsCard from './components/LiveStatsCard';
import BettingOddsCard from './components/BettingOddsCard';
import PlayByPlayTab from './components/PlayByPlayTab';
import FullScorecardTab from './components/FullScorecardTab';

const FIVE_MINUTES_SECONDS = 5 * 60; // 300 seconds

export default function App() {
  const [matches, setMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(FIVE_MINUTES_SECONDS);
  const [lastSyncedText, setLastSyncedText] = useState('Sync 5m');
  const [activeTab, setActiveTab] = useState('stats'); // 'stats' | 'odds' | 'playbyplay' | 'scorecard'
  const [errorMessage, setErrorMessage] = useState(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [showMatchPicker, setShowMatchPicker] = useState(false);

  const selectedMatchIdRef = useRef(selectedMatchId);
  const matchesRef = useRef(matches);

  useEffect(() => {
    selectedMatchIdRef.current = selectedMatchId;
  }, [selectedMatchId]);

  useEffect(() => {
    matchesRef.current = matches;
  }, [matches]);

  // Format time helper
  const updateLastSyncedTime = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastSyncedText(`Synced ${timeStr}`);
  };

  // 1. Initial Load: Fetch Recent Matches API
  // GET https://api.pravasamedia.com/api/v1/cricket/matches/recent
  const loadInitialData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      // Step A: Hit the Recent Matches API
      const recentRes = await getRecentMatches();
      const fetchedMatches = recentRes.matches || [];
      setMatches(fetchedMatches);
      matchesRef.current = fetchedMatches;

      if (fetchedMatches.length > 0) {
        // Step B: Pick the first match (prioritizing 'live' state if available)
        const liveMatch = fetchedMatches.find(m => String(m.state || '').toLowerCase() === 'live') || fetchedMatches[0];
        const matchIdKey = String(liveMatch.matchId || "176375");
        setSelectedMatchId(matchIdKey);
        selectedMatchIdRef.current = matchIdKey;
        
        // Step C: Fetch detailed score data using liveCrickBuzzUrl and user access key
        const scoreRes = await getMatchLiveScore(matchIdKey, liveMatch);
        const normalized = normalizeMatch(liveMatch, scoreRes.scoreData, scoreRes.scorecardData);
        setCurrentMatch(normalized);
        setSecondsLeft(FIVE_MINUTES_SECONDS);
        updateLastSyncedTime();
      }
    } catch (err) {
      console.error('Failed to load recent cricket matches:', err);
      setErrorMessage(err.message || 'Unable to connect to cricket API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // 3. Switch match handler using matchId key
  const handleSelectMatch = async (matchIdKey) => {
    const targetMatchId = String(matchIdKey);
    setSelectedMatchId(targetMatchId);
    selectedMatchIdRef.current = targetMatchId;
    setShowMatchPicker(false);
    setRefreshing(true);
    try {
      const matchOverview = matchesRef.current.find(m => String(m.matchId) === targetMatchId);
      const scoreRes = await getMatchLiveScore(targetMatchId, matchOverview);
      const normalized = normalizeMatch(matchOverview, scoreRes.scoreData, scoreRes.scorecardData);
      setCurrentMatch(normalized);
      setSecondsLeft(FIVE_MINUTES_SECONDS);
      updateLastSyncedTime();
    } catch (err) {
      console.error('Error switching match:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // 4. Refresh current match live score using liveCrickBuzzUrl
  const handleRefresh = useCallback(async () => {
    const matchIdKey = selectedMatchIdRef.current;
    if (!matchIdKey) return;

    setRefreshing(true);
    try {
      const recentRes = await getRecentMatches();
      let updatedMatches = matchesRef.current;
      if (recentRes.matches && recentRes.matches.length > 0) {
        setMatches(recentRes.matches);
        matchesRef.current = recentRes.matches;
        updatedMatches = recentRes.matches;
      }
      const matchOverview = updatedMatches.find(m => String(m.matchId) === String(matchIdKey));
      const scoreRes = await getMatchLiveScore(matchIdKey, matchOverview);
      const normalized = normalizeMatch(matchOverview, scoreRes.scoreData, scoreRes.scorecardData);
      setCurrentMatch(normalized);
      setSecondsLeft(FIVE_MINUTES_SECONDS);
      updateLastSyncedTime();
    } catch (err) {
      console.warn('Refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // 5. Auto Refresh Polling: hits the API every 5 minutes (300 seconds)
  useEffect(() => {
    if (!autoRefresh || !selectedMatchId) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          handleRefresh();
          return FIVE_MINUTES_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRefresh, selectedMatchId, handleRefresh]);

  const handleShareClick = () => {
    if (navigator.share && currentMatch) {
      navigator.share({
        title: `${currentMatch.team1?.name} vs ${currentMatch.team2?.name} - Cricket Scorecard`,
        text: `${currentMatch.status}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const isFinal = currentMatch?.isRecent || currentMatch?.state === 'recent';

  return (
    <div className="w-full h-[100dvh] max-h-[100dvh] bg-[#080204] text-white flex flex-col items-center justify-between overflow-hidden select-none">
      {/* Centered Web Viewport Container - fits 100% mobile screen without scrolling */}
      <div 
        className="w-full max-w-[430px] h-[100dvh] max-h-[100dvh] flex flex-col justify-between overflow-hidden relative shadow-2xl"
        style={{
          background: 'radial-gradient(ellipse 115% 75% at 50% 0%, #5c0b19 0%, #30040d 38%, #160206 72%, #080103 100%)'
        }}
      >
        {/* Top Header Bar matching Apple Sports (Today + Dropdown + Share button) */}
        <header className="w-full pt-2 pb-1 px-4 flex items-center justify-between z-30 flex-shrink-0">
          {/* Left: Final or Live Badge */}
          {isFinal ? (
            <div className="flex items-center gap-1.5 bg-amber-950/70 px-2.5 py-0.5 rounded-full border border-amber-500/30 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-[10px] font-bold text-amber-300 tracking-wider">FINAL</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-dot" />
              <span className="text-[10px] font-bold text-red-400 tracking-wider">LIVE</span>
            </div>
          )}

          {/* Center Title: "Recent Matches" with match switch dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMatchPicker(!showMatchPicker)}
              className="flex items-center gap-1 text-white font-bold text-sm tracking-tight hover:text-stone-200 transition-colors"
            >
              <span>Recent Matches</span>
              {matches.length > 1 && (
                <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${showMatchPicker ? 'rotate-180' : ''}`} />
              )}
            </button>

            {/* Dropdown Match Switcher if multiple matches */}
            {showMatchPicker && matches.length > 1 && (
              <div className="absolute top-7 left-1/2 -translate-x-1/2 w-64 rounded-xl bg-black/95 border border-white/15 p-1 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95">
                <div className="text-[9px] uppercase font-bold text-stone-400 px-2 py-1 border-b border-white/10 flex items-center justify-between">
                  <span>Select Match</span>
                  <span className="text-stone-500">{matches.length} Available</span>
                </div>
                {matches.map(m => {
                  const isSelected = String(m.matchId) === String(selectedMatchId);
                  const isMatchLive = String(m.state || '').toLowerCase() === 'live';
                  return (
                    <button
                      key={m.matchId}
                      onClick={() => handleSelectMatch(m.matchId)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors my-0.5 ${
                        isSelected
                          ? 'bg-red-950/90 text-white font-bold border border-red-500/50 shadow-inner'
                          : 'text-stone-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className={`w-1.5 h-1.5 rounded-full ${isMatchLive ? 'bg-red-500 animate-pulse-dot' : 'bg-stone-500'}`} />
                        <span className="truncate">{m.team1ShortName || m.team1Name} vs {m.team2ShortName || m.team2Name}</span>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${isMatchLive ? 'bg-red-900/60 text-red-300' : 'bg-stone-800 text-stone-400'}`}>
                        {isMatchLive ? 'LIVE' : (m.matchFormat || 'ODI')}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Action: Share Button */}
          <button
            onClick={handleShareClick}
            aria-label="Share scorecard"
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 transition-all border border-white/15 flex items-center justify-center text-white"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </header>

        {/* Loading State */}
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full border-2 border-red-500/30 border-t-red-500 animate-spin mb-3" />
            <p className="text-xs font-semibold text-stone-200">Loading Cricket Scorecard...</p>
            <p className="text-[10px] text-stone-400 mt-0.5">Fetching match {selectedMatchId || '...'} from Cricbuzz RapidAPI</p>
          </div>
        )}

        {/* Error State */}
        {errorMessage && !loading && (
          <div className="mx-3 my-1 p-2 rounded-lg bg-red-950/60 border border-red-500/40 text-[11px] text-red-200 flex items-center gap-2 flex-shrink-0">
            <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
            <span className="flex-1">{errorMessage}</span>
            <button 
              onClick={loadInitialData}
              className="px-2 py-0.5 bg-red-800 rounded font-semibold text-white hover:bg-red-700 text-[10px]"
            >
              Retry
            </button>
          </div>
        )}

        {/* Main Content Area: Strictly fitted to 100dvh without vertical page scroll */}
        {!loading && currentMatch && (
          <div className="w-full flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
            {/* Top Group: Hero Scoreboard, Pitch Graphic, Innings Table, Action Pill */}
            <div className="w-full flex flex-col flex-shrink-0">
              {/* 1. Score Hero Section (Huge numbers, team logos, match category) */}
              <ScoreHero match={currentMatch} />

              {/* 2. Cricket Pitch Graphic (Isometric 3D pitch matching the NFL yardage tracker) */}
              <CricketPitch match={currentMatch} />

              {/* 3. Innings Breakdown Table (Quarters table style) */}
              <InningsTable match={currentMatch} />

              {/* 4. Action Banner (Live Sync + 5-min Countdown + Broadcaster info) */}
              <ActionBanner 
                match={currentMatch}
                onRefresh={handleRefresh}
                isRefreshing={refreshing}
                autoRefresh={autoRefresh}
                toggleAutoRefresh={() => setAutoRefresh(!autoRefresh)}
                secondsLeft={secondsLeft}
                lastSyncedText={lastSyncedText}
              />
            </div>

            {/* Bottom Group: Tab Selector + Bottom Glass Card */}
            <div className="w-full flex-1 min-h-0 flex flex-col justify-between px-3 pb-2 pt-1 overflow-hidden">
              {/* Navigation Tabs (Stats, Betting Odds / Result, Play-By-Play, Scorecard) */}
              <div className="w-full flex items-center justify-around border-b border-white/10 text-xs font-semibold mb-1 flex-shrink-0 select-none">
                {[
                  { id: 'stats', label: 'Stats' },
                  { id: 'odds', label: isFinal ? 'Match Result' : 'Betting Odds' },
                  { id: 'playbyplay', label: 'Play-By-Play' },
                  { id: 'scorecard', label: 'Scorecard' },
                ].map(tab => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative pb-1.5 transition-all text-xs font-semibold ${
                        isActive 
                          ? 'text-white' 
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Bottom Card Container (Takes remaining height, zero page scroll) */}
              <div className="w-full flex-1 min-h-0 overflow-hidden">
                {/* STATS TAB: Top Performers / Batting/Bowling + Team Stats with dual red bars (Default) */}
                {activeTab === 'stats' && (
                  <LiveStatsCard match={currentMatch} />
                )}

                {/* BETTING ODDS / RESULT TAB */}
                {activeTab === 'odds' && (
                  <BettingOddsCard match={currentMatch} />
                )}

                {/* PLAY-BY-PLAY TAB: Ball-by-ball timeline */}
                {activeTab === 'playbyplay' && (
                  <PlayByPlayTab match={currentMatch} />
                )}

                {/* SCORECARD TAB: Full scorecard table */}
                {activeTab === 'scorecard' && (
                  <FullScorecardTab match={currentMatch} />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Copied Toast Notification */}
        {copiedShare && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-stone-900/95 text-white text-[10px] font-semibold rounded-full border border-white/20 shadow-2xl backdrop-blur-md z-50 animate-fade-in">
            Scorecard Link Copied!
          </div>
        )}
      </div>
    </div>
  );
}
