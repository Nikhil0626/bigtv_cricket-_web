/**
 * Cricket Live Score API Service
 * Handles fetching live matches and detailed live scores from PravasaMedia Cricket API.
 */

const BASE_URL = 'https://api.pravasamedia.com/api/v1/cricket';

// High-fidelity fallback data in case of network interruption
export const FALLBACK_MATCHES = [
  {
    id: "ee9002eb-6977-46a6-b384-78e103708024",
    matchId: "1002",
    seriesId: "502",
    seriesName: "England vs South Africa Test Series, 2026",
    matchDesc: "2nd Test - Day 3",
    matchFormat: "TEST",
    state: "live",
    status: "Australia need 42 runs in 8 balls",
    team1Id: "4",
    team1Name: "South Africa",
    team1ShortName: "SA",
    team1Score: "380 & 195/4",
    team1Overs: "58.0",
    team2Id: "5",
    team2Name: "England",
    team2ShortName: "ENG",
    team2Score: "163/5",
    team2Overs: "18.4",
    currentInnings: 3,
    currentBattingTeam: "Australia",
    venue: "Lord's Cricket Ground",
    city: "London",
    startTime: "2026-10-28T07:26:14.663Z",
    endTime: null,
    liveScorePayload: {
      state: "In Progress",
      status: "Australia need 42 runs in 8 balls",
      matchId: "1002",
      miniscore: {
        runs: 163,
        overs: 18.4,
        target: 205,
        batTeam: {
          teamId: 3,
          teamName: "Australia",
          teamSName: "AUS"
        },
        wickets: 5,
        inningsId: 2,
        lastUpdated: new Date().toISOString(),
        partnerShip: {
          runs: 36,
          balls: 18
        },
        bowlerStriker: {
          id: 9654,
          name: "Jasprit Bumrah",
          runs: 28,
          overs: 3.4,
          economy: 7.63,
          maidens: 0,
          wickets: 2
        },
        batsmanStriker: {
          id: 1432,
          name: "Glenn Maxwell",
          runs: 46,
          balls: 22,
          fours: 4,
          sixes: 3,
          strikeRate: 190.9
        },
        currentRunRate: 8.73,
        requiredRunRate: 31.5,
        bowlerNonStriker: {
          id: 5431,
          name: "Arshdeep Singh",
          runs: 38,
          overs: 4,
          economy: 9.5,
          maidens: 0,
          wickets: 1
        },
        recentOversStats: "1 4 W 1 6 2 | 1 1 4 0 6 1",
        batsmanNonStriker: {
          id: 8762,
          name: "Tim David",
          runs: 18,
          balls: 9,
          fours: 1,
          sixes: 1,
          strikeRate: 200
        }
      }
    }
  },
  {
    id: "10b78d5d-4472-4323-b84c-66c77c5c70aa",
    matchId: "1001",
    seriesId: "501",
    seriesName: "India Tour of Australia, 2026",
    matchDesc: "3rd T20I (Night)",
    matchFormat: "T20",
    state: "live",
    status: "Australia need 42 runs in 8 balls",
    team1Id: "2",
    team1Name: "India",
    team1ShortName: "IND",
    team1Score: "204/5",
    team1Overs: "20.0",
    team2Id: "3",
    team2Name: "Australia",
    team2ShortName: "AUS",
    team2Score: "163/5",
    team2Overs: "18.4",
    currentInnings: 2,
    currentBattingTeam: "Australia",
    venue: "Melbourne Cricket Ground (MCG)",
    city: "Melbourne",
    startTime: "2026-10-29T05:26:14.663Z",
    endTime: null,
    liveScorePayload: {
      state: "In Progress",
      status: "Australia need 42 runs in 8 balls",
      matchId: "1001",
      miniscore: {
        runs: 163,
        overs: 18.4,
        target: 205,
        batTeam: {
          teamId: 3,
          teamName: "Australia",
          teamSName: "AUS"
        },
        wickets: 5,
        inningsId: 2,
        lastUpdated: new Date().toISOString(),
        partnerShip: {
          runs: 36,
          balls: 18
        },
        bowlerStriker: {
          id: 9654,
          name: "Jasprit Bumrah",
          runs: 28,
          overs: 3.4,
          economy: 7.63,
          maidens: 0,
          wickets: 2
        },
        batsmanStriker: {
          id: 1432,
          name: "Glenn Maxwell",
          runs: 46,
          balls: 22,
          fours: 4,
          sixes: 3,
          strikeRate: 190.9
        },
        currentRunRate: 8.73,
        requiredRunRate: 31.5,
        bowlerNonStriker: {
          id: 5431,
          name: "Arshdeep Singh",
          runs: 38,
          overs: 4,
          economy: 9.5,
          maidens: 0,
          wickets: 1
        },
        recentOversStats: "1 4 W 1 6 2 | 1 1 4 0 6 1",
        batsmanNonStriker: {
          id: 8762,
          name: "Tim David",
          runs: 18,
          balls: 9,
          fours: 1,
          sixes: 1,
          strikeRate: 200
        }
      }
    }
  }
];

export async function getLiveMatches() {
  try {
    const res = await fetch(`${BASE_URL}/matches/live`, {
      headers: {
        'accept': '*/*'
      }
    });
    if (!res.ok) {
      throw new Error(`Live matches API error: HTTP ${res.status}`);
    }
    const data = await res.json();
    if (data?.data?.matches && data.data.matches.length > 0) {
      return { matches: data.data.matches, raw: data, isFallback: false };
    }
    return { matches: FALLBACK_MATCHES, raw: null, isFallback: true };
  } catch (err) {
    console.warn('getLiveMatches failed, using fallback:', err);
    return { matches: FALLBACK_MATCHES, raw: null, isFallback: true, error: err.message };
  }
}

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
    // Fallback to match in fallback list
    const found = FALLBACK_MATCHES.find(m => m.matchId === String(matchId));
    return { scoreData: found || FALLBACK_MATCHES[0], raw: null, isFallback: true };
  } catch (err) {
    console.warn(`getMatchLiveScore(${matchId}) failed, using fallback:`, err);
    const found = FALLBACK_MATCHES.find(m => m.matchId === String(matchId));
    return { scoreData: found || FALLBACK_MATCHES[0], raw: null, isFallback: true, error: err.message };
  }
}

/**
 * Normalizes either match list item or livescore detail into a single consistent model
 */
export function normalizeMatch(matchOverview, liveDetail) {
  const m = liveDetail || matchOverview;
  if (!m) return null;

  // Extract team 1
  const team1 = {
    id: m.team1?.id || m.team1Id || "1",
    name: m.team1?.name || m.team1Name || "Team 1",
    shortName: m.team1?.shortName || m.team1ShortName || "T1",
    score: m.team1?.score || m.team1Score || "0/0",
    overs: m.team1?.overs || m.team1Overs || "0.0"
  };

  // Extract team 2
  const team2 = {
    id: m.team2?.id || m.team2Id || "2",
    name: m.team2?.name || m.team2Name || "Team 2",
    shortName: m.team2?.shortName || m.team2ShortName || "T2",
    score: m.team2?.score || m.team2Score || "0/0",
    overs: m.team2?.overs || m.team2Overs || "0.0"
  };

  const livePayload = m.liveScorePayload || matchOverview?.liveScorePayload || {};
  const miniscore = livePayload.miniscore || {};

  return {
    matchId: String(m.matchId || matchOverview?.matchId || "1002"),
    seriesName: m.seriesName || matchOverview?.seriesName || "International Cricket Series",
    matchDesc: m.matchDesc || matchOverview?.matchDesc || "Match",
    matchFormat: m.matchFormat || matchOverview?.matchFormat || "CRICKET",
    state: m.state || "live",
    status: m.status || livePayload.status || "Match In Progress",
    venue: m.venue || matchOverview?.venue || "Cricket Ground",
    city: m.city || matchOverview?.city || "London",
    startTime: m.startTime || matchOverview?.startTime,
    currentInnings: m.currentInnings || matchOverview?.currentInnings || miniscore.inningsId || 2,
    currentBattingTeam: m.currentBattingTeam || miniscore.batTeam?.teamName || team2.name,
    lastSyncedAt: m.lastSyncedAt || new Date().toISOString(),
    team1,
    team2,
    liveScorePayload: livePayload,
    miniscore
  };
}

