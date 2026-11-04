/**
 * Cricket Live Score & Recent Matches API Service
 * Handles fetching recent matches and detailed match scores from PravasaMedia Cricket API.
 */

const BASE_URL = 'https://api.pravasamedia.com/api/v1/cricket';

// High-fidelity fallback data matching the recent matches API response
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
 * Hits the Live Score API using the matchId key:
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
    const found = FALLBACK_RECENT_MATCHES.find(m => String(m.matchId) === String(matchId));
    return { scoreData: found || FALLBACK_RECENT_MATCHES[0], raw: null, isFallback: true };
  } catch (err) {
    console.warn(`getMatchLiveScore(${matchId}) failed, using fallback:`, err);
    const found = FALLBACK_RECENT_MATCHES.find(m => String(m.matchId) === String(matchId));
    return { scoreData: found || FALLBACK_RECENT_MATCHES[0], raw: null, isFallback: true, error: err.message };
  }
}

/**
 * Explicitly normalizes data by taking the matchId key from recent matches API
 * and combining with the match livescore response.
 */
export function normalizeMatch(matchOverview, liveDetail) {
  if (!matchOverview && !liveDetail) return null;

  const overview = matchOverview || {};
  const detail = liveDetail || {};

  // Take the matchId key explicitly
  const matchId = String(overview.matchId || detail.matchId || "1000");

  // Extract Team 1 data (India)
  const team1 = {
    id: String(detail.team1?.id || overview.team1Id || "2"),
    name: detail.team1?.name || overview.team1Name || "India",
    shortName: detail.team1?.shortName || overview.team1ShortName || "IND",
    score: detail.team1?.score || overview.team1Score || "188/6",
    overs: detail.team1?.overs || overview.team1Overs || "20.0"
  };

  // Extract Team 2 data (Australia)
  const team2 = {
    id: String(detail.team2?.id || overview.team2Id || "3"),
    name: detail.team2?.name || overview.team2Name || "Australia",
    shortName: detail.team2?.shortName || overview.team2ShortName || "AUS",
    score: detail.team2?.score || overview.team2Score || "170/9",
    overs: detail.team2?.overs || overview.team2Overs || "20.0"
  };

  const livePayload = detail.liveScorePayload || overview.liveScorePayload || null;
  const miniscore = livePayload?.miniscore || null;
  const state = String(detail.state || overview.state || "recent").toLowerCase();
  const isRecent = state === 'recent' || !livePayload;

  return {
    matchId, // matchId key
    seriesName: detail.seriesName || overview.seriesName || "India Tour of Australia, 2026",
    matchDesc: detail.matchDesc || overview.matchDesc || "2nd T20I",
    matchFormat: overview.matchFormat || detail.matchFormat || "T20",
    state: isRecent ? "recent" : "live",
    status: detail.status || overview.status || "India won by 18 runs",
    venue: detail.venue || overview.venue || "Sydney Cricket Ground",
    city: detail.city || overview.city || "Sydney",
    startTime: detail.startTime || overview.startTime || "2026-10-27T07:26:14.676Z",
    currentInnings: detail.currentInnings || overview.currentInnings || (isRecent ? 2 : 1),
    currentBattingTeam: detail.currentBattingTeam || overview.currentBattingTeam || null,
    lastSyncedAt: detail.lastSyncedAt || overview.lastSyncedAt || new Date().toISOString(),
    team1,
    team2,
    liveScorePayload,
    miniscore,
    isRecent
  };
}
