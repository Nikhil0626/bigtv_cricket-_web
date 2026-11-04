/**
 * Cricket Live Score & Recent Matches API Service
 * Handles fetching recent matches and detailed match scores from PravasaMedia and CricBuzz RapidAPI.
 * Sanitizes access keys and supports both standard and lowercase nested keys.
 */

const BASE_URL = 'https://api.pravasamedia.com/api/v1/cricket';

// Default access key provided by user (sanitized to standard Latin-1 ASCII)
export const DEFAULT_RAPIDAPI_KEY = "3a33370404msh6ec9c0eadd182a3p176e73jsn818df7f5e504";

/**
 * Sanitizes RapidAPI key by replacing Cyrillic 'а' (\u0430) with Latin 'a' and stripping non-ASCII characters
 */
export function sanitizeApiKey(rawKey) {
  if (!rawKey) return DEFAULT_RAPIDAPI_KEY;
  return String(rawKey)
    .replace(/\u0430/g, 'a')
    .replace(/[^\x20-\x7E]/g, '')
    .trim() || DEFAULT_RAPIDAPI_KEY;
}

// Fallback matches when network or external API is completely offline
export const FALLBACK_RECENT_MATCHES = [
  {
    matchId: "176375",
    seriesId: "7572",
    seriesName: "ICC Cricket World Cup League Two 2023-27",
    matchDesc: "145th Match",
    matchFormat: "ODI",
    state: "live",
    status: "Oman need 85 runs in 48 balls",
    team1Id: "7",
    team1Name: "United Arab Emirates",
    team1ShortName: "UAE",
    team1Score: "226/8",
    team1Overs: "49.6",
    team2Id: "304",
    team2Name: "Oman",
    team2ShortName: "OMAN",
    team2Score: "142/7",
    team2Overs: "41.6",
    pravasaStatus: "published",
    liveUrl: "https://api.pravasamedia.com/api/v1/cricket/matches/176375/livescore",
    liveCrickBuzzUrl: "https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/176375/livescore",
    accessKey: DEFAULT_RAPIDAPI_KEY
  },
  {
    matchId: "161245",
    seriesId: "12543",
    seriesName: "India tour of New Zealand 2026",
    matchDesc: "1st ODI",
    matchFormat: "ODI",
    state: "recent",
    status: "India won by 5 wkts  -  2nd inns reduced to 32 overs - DLS Target 143",
    team1Id: "13",
    team1Name: "New Zealand",
    team1ShortName: "NZ",
    team1Score: "185/10",
    team1Overs: "40.2",
    team2Id: "2",
    team2Name: "India",
    team2ShortName: "IND",
    team2Score: "143/5",
    team2Overs: "22.4",
    pravasaStatus: "published",
    liveUrl: "https://api.pravasamedia.com/api/v1/cricket/matches/161245/livescore",
    liveCrickBuzzUrl: "https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/161245/livescore",
    accessKey: DEFAULT_RAPIDAPI_KEY
  }
];

/**
 * Hits the Recent Matches API:
 * GET https://api.pravasamedia.com/api/v1/cricket/matches/recent
 * Supports root-level keys: count, liveUrl, liveCrickBuzzUrl, accessKey, matches
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
    const matches = data?.matches || data?.data?.matches || [];
    if (matches.length > 0) {
      return { 
        matches, 
        count: data.count || matches.length,
        liveUrl: data.liveUrl,
        liveCrickBuzzUrl: data.liveCrickBuzzUrl || data.liveCricBuzzUrl,
        accessKey: sanitizeApiKey(data.accessKey || DEFAULT_RAPIDAPI_KEY),
        raw: data, 
        isFallback: false 
      };
    }
    return { matches: FALLBACK_RECENT_MATCHES, raw: null, isFallback: true };
  } catch (err) {
    console.warn('getRecentMatches failed, using fallback:', err);
    return { matches: FALLBACK_RECENT_MATCHES, raw: null, isFallback: true, error: err.message };
  }
}

/**
 * Synthesizes a valid miniscore structure when live endpoints return 429 quota or 404
 */
function createSynthesizedScore(matchObj, matchId) {
  const m = matchObj || FALLBACK_RECENT_MATCHES.find(f => String(f.matchId) === String(matchId)) || FALLBACK_RECENT_MATCHES[0];

  const t1Score = m.team1Score || '226/8';
  const t2Score = m.team2Score || '142/7';
  const t1Parts = t1Score.split('/');
  const t2Parts = t2Score.split('/');
  const t1Runs = parseInt(t1Parts[0], 10) || 226;
  const t1Wkts = parseInt(t1Parts[1], 10) || 8;
  const t2Runs = parseInt(t2Parts[0], 10) || 142;
  const t2Wkts = parseInt(t2Parts[1], 10) || 7;
  const t1Overs = m.team1Overs || '49.6';
  const t2Overs = m.team2Overs || '41.6';

  const isLive = String(m.state || '').toLowerCase() === 'live';
  const target = t1Runs + 1; // 227
  const runsNeeded = Math.max(0, target - t2Runs); // 85
  const oversFloated = parseFloat(t2Overs) || 41.6;
  const ballsBowled = Math.floor(oversFloated) * 6 + Math.round((oversFloated % 1) * 10);
  const totalBalls = (m.matchFormat === 'T20' ? 20 : 50) * 6;
  const ballsrem = Math.max(0, totalBalls - ballsBowled) || 48;

  const crr = oversFloated > 0 ? parseFloat((t2Runs / oversFloated).toFixed(2)) : 3.41;
  const rrr = ballsrem > 0 ? parseFloat(((runsNeeded / ballsrem) * 6).toFixed(2)) : 10.62;

  const isOman = m.team2ShortName === 'OMAN' || m.team2Name?.includes('Oman');

  return {
    matchId: parseInt(matchId, 10) || 176375,
    inningsid: isLive ? 2 : 1,
    status: m.status || (isLive ? `${m.team2ShortName || 'OMAN'} need ${runsNeeded} runs in ${ballsrem} balls` : 'Match Completed'),
    miniscore: {
      inningsid: isLive ? 2 : 1,
      crr,
      rrr,
      target,
      ballsrem,
      custstatus: m.status || `${m.team2ShortName || 'OMAN'} need ${runsNeeded} runs in ${ballsrem} balls`,
      curovsstats: isLive ? "1 0 W 1 4 0" : "1 4 0 1 6 2",
      partnership: isOman ? "18(22)" : "2(2)",
      lastwkt: isOman ? "Ayaan Khan c Muhammad Waseem b Junaid Siddique 24(38) - 124/7" : "Shubman Gill c Latham b Nathan Smith 37(56) - 114/2",
      batteamscore: {
        teamid: parseInt(m.team2Id, 10) || 304,
        teamscore: t2Runs,
        teamwkts: t2Wkts
      },
      batsmanstriker: {
        name: isOman ? "Naseem Khushi" : "Virat Kohli",
        runs: isOman ? 14 : 69,
        balls: isOman ? 16 : 48,
        fours: isOman ? 1 : 12,
        sixes: isOman ? 1 : 1,
        strkrate: isOman ? "87.5" : "143.75"
      },
      batsmannonstriker: {
        name: isOman ? "Mehran Khan" : "Shreyas Iyer",
        runs: isOman ? 22 : 2,
        balls: isOman ? 28 : 2,
        fours: isOman ? 2 : 0,
        sixes: isOman ? 0 : 0,
        strkrate: isOman ? "78.6" : "100.0"
      },
      bowlerstriker: {
        name: isOman ? "Junaid Siddique" : "Nathan Smith",
        overs: isOman ? "8.6" : "2.4",
        maidens: 1,
        runs: isOman ? 38 : 10,
        wickets: isOman ? 3 : 1,
        economy: isOman ? "4.3" : "3.8"
      },
      bowlernonstriker: {
        name: isOman ? "Ali Naseer" : "Jacob Duffy",
        overs: isOman ? "8.0" : "5.0",
        maidens: 0,
        runs: isOman ? 32 : 33,
        wickets: isOman ? 2 : 0,
        economy: isOman ? "4.0" : "6.6"
      },
      inningsscores: {
        inningsscore: [
          {
            inningsid: 2,
            batteamid: parseInt(m.team2Id, 10) || 304,
            batteamshortname: m.team2ShortName || "OMAN",
            runs: t2Runs,
            wickets: t2Wkts,
            overs: t2Overs,
            target,
            balls: ballsBowled
          },
          {
            inningsid: 1,
            batteamid: parseInt(m.team1Id, 10) || 7,
            batteamshortname: m.team1ShortName || "UAE",
            runs: t1Runs,
            wickets: t1Wkts,
            overs: t1Overs,
            target,
            balls: 300
          }
        ]
      }
    },
    comwrapper: [
      {
        commentary: {
          commtxt: `${isOman ? 'Junaid Siddique to Naseem Khushi' : 'Nathan Smith to Shreyas Iyer'}, no run, good length delivery on off stump, defended solidly towards mid-off.`,
          overnum: t2Overs,
          inningsid: isLive ? 2 : 1
        }
      }
    ]
  };
}

/**
 * Hits the Live Score API using the liveCrickBuzzUrl with RapidAPI key,
 * falling back to PravasaMedia proxy and local overview synthesis.
 */
export async function getMatchLiveScore(matchOrId, customKey) {
  let matchId = '';
  let matchObj = null;
  let liveCrickBuzzUrl = '';

  if (typeof matchOrId === 'object' && matchOrId !== null) {
    matchObj = matchOrId;
    matchId = String(matchObj.matchId || '');
    liveCrickBuzzUrl = matchObj.liveCrickBuzzUrl || matchObj.liveCricBuzzUrl || '';
  } else {
    matchId = String(matchOrId || '');
  }

  if (!liveCrickBuzzUrl && matchId) {
    liveCrickBuzzUrl = `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${matchId}/livescore`;
  }

  const accessKeyToUse = sanitizeApiKey(customKey || matchObj?.accessKey || DEFAULT_RAPIDAPI_KEY);

  // 1. Primary Attempt: Access the liveCrickBuzzUrl directly with RapidAPI headers
  if (liveCrickBuzzUrl) {
    try {
      const res = await fetch(liveCrickBuzzUrl, {
        headers: {
          'x-rapidapi-key': accessKeyToUse,
          'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com',
          'Accept': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.miniscore || data?.matchId || data?.data) {
          return { scoreData: data.data || data, raw: data, isFallback: false, source: 'rapidapi' };
        }
      } else {
        console.warn(`RapidAPI live score responded with HTTP ${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      console.warn('RapidAPI livescore request failed:', err.message);
    }
  }

  // 2. Secondary Attempt: PravasaMedia liveUrl
  const pravasaUrl = matchObj?.liveUrl || `${BASE_URL}/matches/${matchId}/livescore`;
  try {
    const res = await fetch(pravasaUrl, {
      headers: { 'accept': '*/*' }
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.miniscore || data?.matchId || data?.data) {
        return { scoreData: data.data || data, raw: data, isFallback: false, source: 'pravasamedia' };
      }
    }
  } catch (err) {
    console.warn('PravasaMedia livescore proxy failed:', err.message);
  }

  // 3. Graceful Fallback: Synthesize live data from match overview
  const synthesized = createSynthesizedScore(matchObj, matchId);
  return { scoreData: synthesized, raw: null, isFallback: true, source: 'overview-synthesis' };
}

/**
 * Helper to parse partnership whether string e.g. "2(2)" or object { runs, balls }
 */
function parsePartnership(p) {
  if (!p) return { runs: 0, balls: 0 };
  if (typeof p === 'object') {
    return { runs: p.runs || 0, balls: p.balls || 0 };
  }
  if (typeof p === 'string') {
    const match = p.match(/(\d+)\s*\(\s*(\d+)\s*\)/);
    if (match) {
      return { runs: parseInt(match[1], 10), balls: parseInt(match[2], 10) };
    }
  }
  return { runs: parseInt(p, 10) || 0, balls: 0 };
}

/**
 * Normalizes match data, mapping both lowercase and camelCase keys from the API.
 */
export function normalizeMatch(matchOverview, liveDetail) {
  if (!matchOverview && !liveDetail) return null;

  const overview = matchOverview || {};
  const detail = liveDetail || {};

  // Extract matchId
  const matchId = String(detail.matchId || overview.matchId || "176375");

  // Extract miniscore from either detail.miniscore, detail.liveScorePayload.miniscore, or overview.liveScorePayload.miniscore
  const rawMiniscore = detail.miniscore || 
                       detail.liveScorePayload?.miniscore || 
                       overview.liveScorePayload?.miniscore || 
                       null;

  // Extract Team 1 baseline
  const team1 = {
    id: String(detail.team1?.id || overview.team1Id || "7"),
    name: detail.team1?.name || overview.team1Name || "United Arab Emirates",
    shortName: detail.team1?.shortName || overview.team1ShortName || "UAE",
    score: detail.team1?.score || overview.team1Score || "226/8",
    overs: detail.team1?.overs || overview.team1Overs || "49.6"
  };

  // Extract Team 2 baseline
  const team2 = {
    id: String(detail.team2?.id || overview.team2Id || "304"),
    name: detail.team2?.name || overview.team2Name || "Oman",
    shortName: detail.team2?.shortName || overview.team2ShortName || "OMAN",
    score: detail.team2?.score || overview.team2Score || "142/7",
    overs: detail.team2?.overs || overview.team2Overs || "41.6"
  };

  // If inningsscores array exists in miniscore, use the exact live score numbers!
  const inningsList = rawMiniscore?.inningsscores?.inningsscore || [];
  if (Array.isArray(inningsList) && inningsList.length > 0) {
    inningsList.forEach(inn => {
      const sName = (inn.batteamshortname || '').toUpperCase();
      const bId = String(inn.batteamid || '');
      if (sName === team1.shortName.toUpperCase() || bId === team1.id) {
        team1.score = `${inn.runs}/${inn.wickets}`;
        team1.overs = String(inn.overs);
      } else if (sName === team2.shortName.toUpperCase() || bId === team2.id) {
        team2.score = `${inn.runs}/${inn.wickets}`;
        team2.overs = String(inn.overs);
      }
    });
  }

  // If batteamscore exists in miniscore, enforce latest live score for current batting team
  if (rawMiniscore?.batteamscore) {
    const batTeamId = String(rawMiniscore.batteamscore.teamid || '');
    const currentBatScore = `${rawMiniscore.batteamscore.teamscore}/${rawMiniscore.batteamscore.teamwkts}`;
    if (batTeamId === team2.id) {
      team2.score = currentBatScore;
    } else if (batTeamId === team1.id) {
      team1.score = currentBatScore;
    } else {
      team2.score = currentBatScore;
    }
  }

  // Find live overs for current batting team
  let liveBattingOvers = team2.overs;
  if (inningsList.length > 0) {
    const currentInn = inningsList.find(i => String(i.batteamid) === team2.id || (i.batteamshortname || '').toUpperCase() === team2.shortName.toUpperCase());
    if (currentInn?.overs) {
      liveBattingOvers = String(currentInn.overs);
      team2.overs = liveBattingOvers;
    }
  }

  // Normalize miniscore keys (handling lowercase vs camelCase)
  let miniscore = null;
  if (rawMiniscore) {
    const bStriker = rawMiniscore.batsmanstriker || rawMiniscore.batsmanStriker;
    const bNonStriker = rawMiniscore.batsmannonstriker || rawMiniscore.batsmanNonStriker;
    const bowStriker = rawMiniscore.bowlerstriker || rawMiniscore.bowlerStriker;
    const bowNonStriker = rawMiniscore.bowlernonstriker || rawMiniscore.bowlerNonStriker;

    const runs = rawMiniscore.batteamscore?.teamscore ?? rawMiniscore.runs ?? parseInt(team2.score.split('/')[0], 10) ?? 142;
    const wickets = rawMiniscore.batteamscore?.teamwkts ?? rawMiniscore.wickets ?? parseInt(team2.score.split('/')[1], 10) ?? 7;
    const target = rawMiniscore.target || (parseInt(team1.score.split('/')[0], 10) + 1) || 227;
    const ballsrem = rawMiniscore.ballsrem || 48;

    miniscore = {
      runs,
      wickets,
      overs: liveBattingOvers || team2.overs || "41.6",
      target,
      ballsrem,
      currentRunRate: rawMiniscore.crr || rawMiniscore.currentRunRate || 3.41,
      requiredRunRate: rawMiniscore.rrr || rawMiniscore.requiredRunRate || 10.62,
      recentOversStats: rawMiniscore.curovsstats || rawMiniscore.recentOversStats || "1 0 W 1 4 0",
      partnerShip: parsePartnership(rawMiniscore.partnership || rawMiniscore.partnerShip),
      lastWicket: rawMiniscore.lastwkt || rawMiniscore.lastWicket || "",
      batsmanStriker: bStriker ? {
        id: bStriker.id,
        name: bStriker.name || bStriker.nickname || "Naseem Khushi",
        runs: bStriker.runs ?? 14,
        balls: bStriker.balls ?? 16,
        fours: bStriker.fours ?? 1,
        sixes: bStriker.sixes ?? 1,
        strikeRate: bStriker.strkrate || bStriker.strikeRate || "87.5"
      } : null,
      batsmanNonStriker: bNonStriker ? {
        id: bNonStriker.id,
        name: bNonStriker.name || bNonStriker.nickname || "Mehran Khan",
        runs: bNonStriker.runs ?? 22,
        balls: bNonStriker.balls ?? 28,
        fours: bNonStriker.fours ?? 2,
        sixes: bNonStriker.sixes ?? 0,
        strikeRate: bNonStriker.strkrate || bNonStriker.strikeRate || "78.6"
      } : null,
      bowlerStriker: bowStriker ? {
        id: bowStriker.id,
        name: bowStriker.name || "Junaid Siddique",
        overs: bowStriker.overs || "8.6",
        maidens: bowStriker.maidens ?? 1,
        runs: bowStriker.runs ?? 38,
        wickets: bowStriker.wickets ?? 3,
        economy: bowStriker.economy || "4.3"
      } : null,
      bowlerNonStriker: bowNonStriker ? {
        id: bowNonStriker.id,
        name: bowNonStriker.name || "Ali Naseer",
        overs: bowNonStriker.overs || "8.0",
        maidens: bowNonStriker.maidens ?? 0,
        runs: bowNonStriker.runs ?? 32,
        wickets: bowNonStriker.wickets ?? 2,
        economy: bowNonStriker.economy || "4.0"
      } : null,
      inningsscores: rawMiniscore.inningsscores
    };
  }

  // Extract live commentary from comwrapper
  const comwrapper = detail.comwrapper || 
                     detail.liveScorePayload?.comwrapper || 
                     overview.liveScorePayload?.comwrapper || 
                     [];

  // Custom status
  const status = rawMiniscore?.custstatus || 
                 rawMiniscore?.customstatus || 
                 detail.status || 
                 overview.status || 
                 `${team2.name} need ${Math.max(0, (miniscore?.target || 227) - (miniscore?.runs || 142))} runs`;

  // Check state
  const rawState = String(detail.state || overview.state || "live").toLowerCase();
  const isRecent = rawState === 'recent';

  return {
    matchId,
    seriesName: detail.seriesName || overview.seriesName || "ICC Cricket World Cup League Two 2023-27",
    matchDesc: detail.matchDesc || overview.matchDesc || "145th Match",
    matchFormat: overview.matchFormat || detail.matchFormat || "ODI",
    state: isRecent ? "recent" : "live",
    status,
    venue: detail.venue || overview.venue || "Al Amerat Cricket Ground",
    city: detail.city || overview.city || "Al Amerat",
    startTime: detail.startTime || overview.startTime || new Date().toISOString(),
    currentInnings: rawMiniscore?.inningsid || detail.currentInnings || overview.currentInnings || 2,
    currentBattingTeam: overview.currentBattingTeam || team2.name,
    lastSyncedAt: detail.lastSyncedAt || overview.lastSyncedAt || new Date().toISOString(),
    team1,
    team2,
    liveScorePayload: detail.liveScorePayload || detail,
    miniscore,
    comwrapper,
    isRecent
  };
}
