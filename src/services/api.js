/**
 * Cricket Live Score & Recent Matches API Service
 * Handles fetching recent matches and detailed match scores from PravasaMedia Cricket API.
 */

const BASE_URL = 'https://api.pravasamedia.com/api/v1/cricket';

// High-fidelity fallback data in case of network interruption
export const FALLBACK_RECENT_MATCHES = [
  {
    id: "911a4c79-5848-4592-9c31-0aa3f0c99fe7",
    matchId: "1000",
    seriesId: "501",
    seriesName: "India Tour of Australia, 2026",
    matchDesc: "2nd T20I",
    matchFormat: "T20",
    state: "recent",
    status: "India won by 18 runs",
    team1Id: "2",
    team1Name: "India",
    team1ShortName: "IND",
    team1Score: "188/6",
    team1Overs: "20.0",
    team2Id: "3",
    team2Name: "Australia",
    team2ShortName: "AUS",
    team2Score: "170/9",
    team2Overs: "20.0",
    currentInnings: null,
    currentBattingTeam: null,
    venue: "Sydney Cricket Ground",
    city: "Sydney",
    startTime: "2026-10-27T07:26:14.676Z",
    endTime: null,
    isPublished: true,
    publishedAt: "2026-11-03T08:15:13.395Z",
    liveScorePayload: null,
    miniScorecardPayload: null,
    lastSyncedAt: new Date().toISOString(),
    createdAt: "2026-10-29T07:26:14.678Z",
    updatedAt: new Date().toISOString()
  }
];

/**
 * Hits the Recent Matches API:
 * GET https://api.pravasamedia.com/api/v1/cricket/matches/recent
 */
export async function getRecentMatches() {
  try {
    const res = await fetch(`${BASE_URL}/matches/recent`, {
      headers: {
        'accept': '*/*'
      }
    });
    if (!res.ok) {
      throw new Error(`Recent matches API error: HTTP ${res.status}`);
    }
    const data = await res.json();
    if (data?.data?.matches && data.data.matches.length > 0) {
      return { matches: data.data.matches, raw: data, isFallback: false };
    }
    return { matches: FALLBACK_RECENT_MATCHES, raw: null, isFallback: true };
  } catch (err) {
    console.warn('getRecentMatches failed, using fallback:', err);
    return { matches: FALLBACK_RECENT_MATCHES, raw: null, isFallback: true, error: err.message };
  }
}

/**
 * Hits the Live Score API for a specific match:
 * GET https://api.pravasamedia.com/api/v1/cricket/matches/{matchId}/livescore
 */
export async function getMatchLiveScore(matchId) {
  try {
    const res = await fetch(`${BASE_URL}/matches/${matchId}/livescore`, {
      headers: {
        'accept': '*/*'
      }
    });
    if (!res.ok) {
      throw new Error(`Match livescore API error: HTTP ${res.status}`);
    }
    const data = await res.json();
    if (data?.data) {
      return { scoreData: data.data, raw: data, isFallback: false };
    }
    const found = FALLBACK_RECENT_MATCHES.find(m => m.matchId === String(matchId));
    return { scoreData: found || FALLBACK_RECENT_MATCHES[0], raw: null, isFallback: true };
  } catch (err) {
    console.warn(`getMatchLiveScore(${matchId}) failed, using fallback:`, err);
    const found = FALLBACK_RECENT_MATCHES.find(m => m.matchId === String(matchId));
    return { scoreData: found || FALLBACK_RECENT_MATCHES[0], raw: null, isFallback: true, error: err.message };
  }
}

/**
 * Normalizes recent match overview and livescore detail into a consistent model
 */
export function normalizeMatch(matchOverview, liveDetail) {
  const m = liveDetail || matchOverview;
  if (!m) return null;

  // Extract team 1 (India)
  const team1 = {
    id: m.team1?.id || m.team1Id || "2",
    name: m.team1?.name || m.team1Name || "India",
    shortName: m.team1?.shortName || m.team1ShortName || "IND",
    score: m.team1?.score || m.team1Score || "188/6",
    overs: m.team1?.overs || m.team1Overs || "20.0"
  };

  // Extract team 2 (Australia)
  const team2 = {
    id: m.team2?.id || m.team2Id || "3",
    name: m.team2?.name || m.team2Name || "Australia",
    shortName: m.team2?.shortName || m.team2ShortName || "AUS",
    score: m.team2?.score || m.team2Score || "170/9",
    overs: m.team2?.overs || m.team2Overs || "20.0"
  };

  const livePayload = m.liveScorePayload || matchOverview?.liveScorePayload || null;
  const miniscore = livePayload?.miniscore || null;

  const isRecent = (m.state || matchOverview?.state || '').toLowerCase() === 'recent' || !livePayload;

  return {
    matchId: String(m.matchId || matchOverview?.matchId || "1000"),
    seriesName: m.seriesName || matchOverview?.seriesName || "India Tour of Australia, 2026",
    matchDesc: m.matchDesc || matchOverview?.matchDesc || "2nd T20I",
    matchFormat: m.matchFormat || matchOverview?.matchFormat || "T20",
    state: m.state || matchOverview?.state || (isRecent ? "recent" : "live"),
    status: m.status || matchOverview?.status || "India won by 18 runs",
    venue: m.venue || matchOverview?.venue || "Sydney Cricket Ground",
    city: m.city || matchOverview?.city || "Sydney",
    startTime: m.startTime || matchOverview?.startTime || "2026-10-27T07:26:14.676Z",
    currentInnings: m.currentInnings || matchOverview?.currentInnings || (isRecent ? 2 : 1),
    currentBattingTeam: m.currentBattingTeam || matchOverview?.currentBattingTeam || null,
    lastSyncedAt: m.lastSyncedAt || matchOverview?.lastSyncedAt || new Date().toISOString(),
    team1,
    team2,
    liveScorePayload,
    miniscore,
    isRecent
  };
}
