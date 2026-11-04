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
  selectedMatchIdRef.current = selectedMatchId;

  // Format time helper
  const updateLastSyncedTime = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastSyncedText(`Synced ${timeStr}`);
  };

  // 1. Initial Load: Fetch Recent Matches API
  // curl -X 'GET' 'https://api.pravasamedia.com/api/v1/cricket/matches/recent'
  const loadInitialData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const recentRes = await getRecentMatches();
      const fetchedMatches = recentRes.matches || [];
      setMatches(fetchedMatches);

      if (fetchedMatches.length > 0) {
        // Send the first ID in the recent matches list as input
        const firstMatchId = fetchedMatches[0].matchId || '1000';
        setSelectedMatchId(firstMatchId);
        
        // 2. Fetch Match Live Score API for the first match (ID 1000)
        // curl -X 'GET' 'https://api.pravasamedia.com/api/v1/cricket/matches/{matchId}/livescore'
        const scoreRes = await getMatchLiveScore(firstMatchId);
        const normalized = normalizeMatch(fetchedMatches[0], scoreRes.scoreData);
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

  // 3. Switch match handler
  const handleSelectMatch = async (matchId) => {
    setSelectedMatchId(matchId);
    setShowMatchPicker(false);
    setRefreshing(true);
    try {
      const matchOverview = matches.find(m => String(m.matchId) === String(matchId));
      const scoreRes = await getMatchLiveScore(matchId);
      const normalized = normalizeMatch(matchOverview, scoreRes.scoreData);
      setCurrentMatch(normalized);
      setSecondsLeft(FIVE_MINUTES_SECONDS);
      updateLastSyncedTime();
    } catch (err) {
      console.error('Error switching match:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // 4. Refresh current match live score
  const handleRefresh = useCallback(async () => {
    const matchId = selectedMatchIdRef.current;
    if (!matchId) return;

    setRefreshing(true);
    try {
      const [recentRes, scoreRes] = await Promise.all([
        getRecentMatches(),
        getMatchLiveScore(matchId)
      ]);
      if (recentRes.matches) {
        setMatches(recentRes.matches);
      }
      const matchOverview = recentRes.matches?.find(m => String(m.matchId) === String(matchId));
      const normalized = normalizeMatch(matchOverview, scoreRes.scoreData);
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

          {/* Center Title: "Today" with match switch dropdown */}
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
              <div className="absolute top-7 left-1/2 -translate-x-1/2 w-56 rounded-xl bg-black/90 border border-white/15 p-1 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95">
                <div className="text-[9px] uppercase font-bold text-stone-400 px-2 py-1 border-b border-white/10">
                  Select Match
                </div>
                {matches.map(m => (
                  <button
                    key={m.matchId}
                    onClick={() => handleSelectMatch(m.matchId)}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      String(m.matchId) === String(selectedMatchId)
                        ? 'bg-red-950/80 text-white font-bold border border-red-500/40'
                        : 'text-stone-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="truncate">{m.team1ShortName || m.team1Name} vs {m.team2ShortName || m.team2Name}</span>
                    <span className="text-[9px] px-1 rounded bg-stone-800 text-amber-300">{m.matchFormat || 'T20'}</span>
                  </button>
                ))}
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
            <p className="text-[10px] text-stone-400 mt-0.5">Fetching from pravasamedia API</p>
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

              {/* 3. Innings Breakdown Table (WAS vs SF quarters table style) */}
              <InningsTable match={currentMatch} />

              {/* 4. Action Banner ("Open in tv" button + 5-min Live Sync + Broadcaster info) */}
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
