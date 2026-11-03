import React, { useState } from 'react';
import { RefreshCw, Share2, Check, Clock } from 'lucide-react';

/**
 * Action Banner matching "Open in tv" + Broadcast channel pill in screenshot
 * Shows live 5-minute countdown and manual refresh toggle
 */
export default function ActionBanner({ 
  match, 
  onRefresh, 
  isRefreshing, 
  autoRefresh, 
  toggleAutoRefresh,
  secondsLeft = 300,
  lastSyncedText = ''
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${match?.team1?.name} vs ${match?.team2?.name} - Live Cricket Score`,
        text: `${match?.team1?.name} ${match?.team1?.score} vs ${match?.team2?.name} ${match?.team2?.score}. Status: ${match?.status}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = String(secondsLeft % 60).padStart(2, '0');
  const timerLabel = autoRefresh ? `${minutes}:${seconds}` : 'Off';

  return (
    <div className="w-full flex flex-col items-center my-1 px-4 flex-shrink-0 select-none">
      {/* Button Row */}
      <div className="flex items-center gap-2">
        {/* Main Pill Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-8 px-4 rounded-full bg-white/15 hover:bg-white/20 active:scale-95 transition-all backdrop-blur-xl border border-white/20 shadow-md flex items-center gap-1.5 text-white font-semibold text-xs group"
          title="Hit live score API now"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-red-400 group-hover:text-red-300 transition-transform ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Updating...' : 'Live Sync'}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
        </button>

        {/* 5-Minute Auto Refresh Timer Toggle with Live Countdown */}
        <button
          onClick={toggleAutoRefresh}
          title={autoRefresh ? `Auto-refreshing every 5 minutes (next sync in ${timerLabel})` : "Auto-refresh paused. Click to enable 5-minute sync."}
          className={`h-8 px-2.5 rounded-full flex items-center gap-1 justify-center transition-all backdrop-blur-xl border active:scale-90 ${
            autoRefresh 
              ? 'bg-red-500/20 border-red-500/40 text-red-300' 
              : 'bg-white/10 border-white/15 text-stone-400'
          }`}
        >
          <Clock className="w-3 h-3 text-stone-400" />
          <span className="text-[10px] font-mono font-bold tracking-tight">{timerLabel}</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          title="Share scorecard"
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 active:scale-90 transition-all backdrop-blur-xl border border-white/15 text-stone-200 flex items-center justify-center"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Broadcast Network & 5-Min Sync Subtitle */}
      <div className="text-[10px] font-medium text-stone-400/90 mt-1 flex items-center gap-1.5">
        <span className="text-red-400 font-semibold">Live on Sky Sports, Star Sports</span>
        <span>•</span>
        <span className="truncate max-w-[140px]">{match?.venue || "Lord's Ground"}</span>
        <span>•</span>
        <span className="text-stone-400 font-mono text-[9px]">{lastSyncedText || 'Sync 5m'}</span>
      </div>
    </div>
  );
}
