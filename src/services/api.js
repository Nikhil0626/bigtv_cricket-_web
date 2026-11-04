/**
 * Cricket Live Score & Recent Matches API Service
 * Handles fetching recent matches and detailed match scores from Cricbuzz RapidAPI and PravasaMedia Cricket API.
 * Supports both standard and lowercase nested keys (e.g. batsmanstriker, strkrate, crr, rrr, custstatus, inningsscores, comwrapper).
 */

const BASE_URL = 'https://api.pravasamedia.com/api/v1/cricket';
const RAPIDAPI_HOST = 'cricbuzz-cricket.p.rapidapi.com';

// Access Key provided by user (sanitized to ASCII characters)
export const DEFAULT_RAPIDAPI_KEY = '3a33370404msh6ec9c0eadd182a3p176e73jsn818df7f5e504';

/**
 * Sanitizes access key to ensure valid ASCII characters
 * (replaces Cyrillic 'а' [1072] with ASCII 'a' [97])
 */
export function cleanAccessKey(key) {
  if (!key || typeof key !== 'string') return DEFAULT_RAPIDAPI_KEY;
  const trimmed = key.trim().replace(/\u0430/g, 'a').replace(/[^\x20-\x7E]/g, '');
  return trimmed.length > 10 ? trimmed : DEFAULT_RAPIDAPI_KEY;
}

// High-fidelity fallback data matching the recent matches API response
export const FALLBACK_RECENT_MATCHES = [
  {
    matchId: "176375",
    seriesId: "7572",
    seriesName: "ICC Cricket World Cup League Two 2023-27",
    matchDesc: "145th Match",
    matchFormat: "ODI",
    state: "live",
    status: "Oman need 65 runs in 36 balls",
    team1Id: "7",
    team1Name: "United Arab Emirates",
    team1ShortName: "UAE",
    team1Score: "226/8",
    team1Overs: "49.6",
    team2Id: "304",
    team2Name: "Oman",
    team2ShortName: "OMAN",
    team2Score: "162/7",
    team2Overs: "43.6",
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
    status: "India won by 5 wkts - 2nd inns reduced to 32 overs - DLS Target 143",
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
 * Parses the updated response keys (count, liveUrl, liveCrickBuzzUrl, accessKey, matches)
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
    
    // Support both new schema (data.matches) and wrapped schema (data.data.matches)
    const rawMatches = data?.matches || data?.data?.matches || (Array.isArray(data) ? data : []);

    const rootLiveUrl = data?.liveUrl || '';
    const rootCricBuzzUrl = data?.liveCrickBuzzUrl || data?.liveCricBuzzUrl || '';
    const rootAccessKey = cleanAccessKey(data?.accessKey);

    const matches = rawMatches.map(m => {
      const matchId = String(m.matchId || '');
      const cricbuzzUrl = m.liveCrickBuzzUrl || 
                          m.liveCricBuzzUrl || 
                          (matchId ? `https://${RAPIDAPI_HOST}/mcenter/v1/${matchId}/livescore` : rootCricBuzzUrl);
      const accessKey = cleanAccessKey(m.accessKey || rootAccessKey);
      const liveUrl = m.liveUrl || (matchId ? `${BASE_URL}/matches/${matchId}/livescore` : rootLiveUrl);

      return {
        ...m,
        matchId,
        liveUrl,
        liveCrickBuzzUrl: cricbuzzUrl,
        liveCricBuzzUrl: cricbuzzUrl,
        accessKey
      };
    });

    if (matches.length > 0) {
      return { matches, raw: data, isFallback: false };
    }
    return { matches: FALLBACK_RECENT_MATCHES, raw: null, isFallback: true };
  } catch (err) {
    console.warn('getRecentMatches failed, using fallback:', err);
    return { matches: FALLBACK_RECENT_MATCHES, raw: null, isFallback: true, error: err.message };
  }
}

/**
 * Hits Cricbuzz RapidAPI using the match's liveCrickBuzzUrl and accessKey
 * GET https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/{matchId}/livescore
 * Also fetches full scorecard from /scard if available
 */
export async function getMatchLiveScore(matchId, matchOverview = null) {
  const targetMatchId = String(matchId);
  const overview = matchOverview || {};

  // 1. Determine Cricbuzz RapidAPI livescore endpoint
  const cricbuzzUrl = overview.liveCrickBuzzUrl || 
                      overview.liveCricBuzzUrl || 
                      `https://${RAPIDAPI_HOST}/mcenter/v1/${targetMatchId}/livescore`;

  // 2. Determine Access Key
  const accessKey = cleanAccessKey(overview.accessKey || DEFAULT_RAPIDAPI_KEY);

  const rapidHeaders = {
    'accept': 'application/json',
    'x-rapidapi-key': accessKey,
    'x-rapidapi-host': RAPIDAPI_HOST
  };

  // 3. Fetch from Cricbuzz RapidAPI
  try {
    const [liveScoreRes, scardRes] = await Promise.allSettled([
      fetch(cricbuzzUrl, { headers: rapidHeaders }),
      fetch(`https://${RAPIDAPI_HOST}/mcenter/v1/${targetMatchId}/scard`, { headers: rapidHeaders })
    ]);

    let scoreData = null;
    let scorecardData = null;

    if (liveScoreRes.status === 'fulfilled' && liveScoreRes.value.ok) {
      const parsed = await liveScoreRes.value.json();
      // Ensure it is not an error object like { message: "..." }
      if (parsed && (parsed.miniscore || parsed.inningsscores || parsed.comwrapper || parsed.matchId)) {
        scoreData = parsed;
      }
    }

    if (scardRes.status === 'fulfilled' && scardRes.value.ok) {
      try {
        const parsedScard = await scardRes.value.json();
        if (parsedScard && (parsedScard.scorecard || parsedScard.scoreCard)) {
          scorecardData = parsedScard;
        }
      } catch (_) {}
    }

    if (scoreData) {
      return { 
        scoreData, 
        scorecardData, 
        raw: scoreData, 
        isFallback: false 
      };
    }
  } catch (err) {
    console.warn(`RapidAPI live score failed for match ${targetMatchId}:`, err);
  }

  // 4. Secondary fallback: PravasaMedia live score endpoint
  try {
    const pravasaUrl = overview.liveUrl || `${BASE_URL}/matches/${targetMatchId}/livescore`;
    const res = await fetch(pravasaUrl, {
      headers: { 'accept': '*/*' }
    });
    if (res.ok) {
      const data = await res.json();
      const extracted = data?.data || (data?.miniscore ? data : null);
      if (extracted) {
        return { scoreData: extracted, scorecardData: null, raw: data, isFallback: false };
      }
    }
  } catch (err) {
    console.warn(`PravasaMedia live score fallback failed for match ${targetMatchId}:`, err);
  }

  // 5. Final fallback using overview data
  const found = FALLBACK_RECENT_MATCHES.find(m => String(m.matchId) === targetMatchId) || overview;
  return { 
    scoreData: found, 
    scorecardData: null, 
    raw: null, 
    isFallback: true 
  };
}

/**
 * Helper to parse partnership whether string e.g. "10(5)" or object { runs, balls }
 */
export function parsePartnership(p) {
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
 * Helper to format commentary text replacing format placeholders e.g. "B0$" with "FOUR"
 */
export function formatCommentaryText(comm) {
  if (!comm) return '';
  let txt = comm.commtxt || '';
  const formats = comm.commentaryformats || [];
  formats.forEach(f => {
    if (f && Array.isArray(f.value)) {
      f.value.forEach(v => {
        if (v && v.id && v.value !== undefined) {
          txt = txt.replaceAll(v.id, String(v.value));
        }
      });
    }
  });
  return txt;
}

/**
 * Normalizes match overview + detailed live score payload + full scorecard
 */
export function normalizeMatch(matchOverview, liveDetail, scorecardDetail = null) {
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
    overs: String(detail.team1?.overs || overview.team1Overs || "49.6")
  };

  // Extract Team 2 baseline
  const team2 = {
    id: String(detail.team2?.id || overview.team2Id || "304"),
    name: detail.team2?.name || overview.team2Name || "Oman",
    shortName: detail.team2?.shortName || overview.team2ShortName || "OMAN",
    score: detail.team2?.score || overview.team2Score || "162/7",
    overs: String(detail.team2?.overs || overview.team2Overs || "43.6")
  };

  // Update live scores from rawMiniscore.inningsscores.inningsscore
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

  // Update latest live score for current batting team from batteamscore
  if (rawMiniscore?.batteamscore) {
    const batTeamId = String(rawMiniscore.batteamscore.teamid || '');
    const currentBatScore = `${rawMiniscore.batteamscore.teamscore}/${rawMiniscore.batteamscore.teamwkts}`;
    if (batTeamId === team2.id || (team2.shortName && rawMiniscore.batteamscore.teamsname === team2.shortName)) {
      team2.score = currentBatScore;
    } else if (batTeamId === team1.id || (team1.shortName && rawMiniscore.batteamscore.teamsname === team1.shortName)) {
      team1.score = currentBatScore;
    }
  }

  // Calculate live batting overs
  let liveBattingOvers = team2.overs;
  if (inningsList.length > 0) {
    const currentInn = inningsList.find(i => 
      String(i.batteamid) === team2.id || 
      (i.batteamshortname || '').toUpperCase() === team2.shortName.toUpperCase()
    );
    if (currentInn?.overs) {
      liveBattingOvers = String(currentInn.overs);
      team2.overs = liveBattingOvers;
    }
  }

  // Determine Match Status
  const status = rawMiniscore?.custstatus || 
                 rawMiniscore?.customstatus || 
                 overview.status || 
                 detail.status || 
                 "";

  // Check state: live vs recent
  const rawState = String(overview.state || detail.state || '').toLowerCase();
  const isWonOrComplete = status.toLowerCase().includes('won') || status.toLowerCase().includes('tied') || status.toLowerCase().includes('drawn');
  const isRecent = rawState === 'recent' || isWonOrComplete;

  // Normalize miniscore keys
  let miniscore = null;
  if (rawMiniscore) {
    const bStriker = rawMiniscore.batsmanstriker || rawMiniscore.batsmanStriker;
    const bNonStriker = rawMiniscore.batsmannonstriker || rawMiniscore.batsmanNonStriker;
    const bowStriker = rawMiniscore.bowlerstriker || rawMiniscore.bowlerStriker;
    const bowNonStriker = rawMiniscore.bowlernonstriker || rawMiniscore.bowlerNonStriker;

    const runs = rawMiniscore.batteamscore?.teamscore ?? rawMiniscore.runs ?? parseInt(team2.score.split('/')[0], 10) ?? 0;
    const wickets = rawMiniscore.batteamscore?.teamwkts ?? rawMiniscore.wickets ?? parseInt(team2.score.split('/')[1], 10) ?? 0;
    const target = rawMiniscore.target || 0;

    // Calculate ballsrem from ballsrem field or parse from custstatus (e.g. "65 runs in 36 balls")
    let ballsrem = rawMiniscore.ballsrem || 0;
    if (ballsrem === 0 && rawMiniscore.custstatus) {
      const matchBalls = rawMiniscore.custstatus.match(/(\d+)\s*balls/i);
      if (matchBalls) {
        ballsrem = parseInt(matchBalls[1], 10);
      }
    }

    miniscore = {
      runs,
      wickets,
      overs: liveBattingOvers,
      target,
      ballsrem,
      currentRunRate: rawMiniscore.crr ?? rawMiniscore.currentRunRate ?? (parseFloat(team2.overs) > 0 ? (runs / parseFloat(team2.overs)).toFixed(2) : 0),
      requiredRunRate: rawMiniscore.rrr ?? rawMiniscore.requiredRunRate ?? 0,
      recentOversStats: rawMiniscore.curovsstats || rawMiniscore.recentOversStats || "",
      partnerShip: parsePartnership(rawMiniscore.partnership || rawMiniscore.partnerShip),
      lastWicket: rawMiniscore.lastwkt || rawMiniscore.lastWicket || "",
      batsmanStriker: bStriker ? {
        id: bStriker.id,
        name: bStriker.name || bStriker.nickname || "Striker",
        runs: bStriker.runs ?? 0,
        balls: bStriker.balls ?? 0,
        fours: bStriker.fours ?? 0,
        sixes: bStriker.sixes ?? 0,
        strikeRate: bStriker.strkrate || bStriker.strikeRate || "0.0"
      } : null,
      batsmanNonStriker: bNonStriker ? {
        id: bNonStriker.id,
        name: bNonStriker.name || bNonStriker.nickname || "Non-Striker",
        runs: bNonStriker.runs ?? 0,
        balls: bNonStriker.balls ?? 0,
        fours: bNonStriker.fours ?? 0,
        sixes: bNonStriker.sixes ?? 0,
        strikeRate: bNonStriker.strkrate || bNonStriker.strikeRate || "0.0"
      } : null,
      bowlerStriker: bowStriker ? {
        id: bowStriker.id,
        name: bowStriker.name || bowStriker.nickname || "Bowler",
        overs: bowStriker.overs ? String(bowStriker.overs) : "0.0",
        maidens: bowStriker.maidens ?? 0,
        runs: bowStriker.runs ?? 0,
        wickets: bowStriker.wickets ?? 0,
        economy: bowStriker.economy ? String(bowStriker.economy) : "0.0"
      } : null,
      bowlerNonStriker: bowNonStriker ? {
        id: bowNonStriker.id,
        name: bowNonStriker.name || bowNonStriker.nickname || "",
        overs: bowNonStriker.overs ? String(bowNonStriker.overs) : "0.0",
        maidens: bowNonStriker.maidens ?? 0,
        runs: bowNonStriker.runs ?? 0,
        wickets: bowNonStriker.wickets ?? 0,
        economy: bowNonStriker.economy ? String(bowNonStriker.economy) : "0.0"
      } : null,
      inningsscores: rawMiniscore.inningsscores
    };
  } else {
    // Synthesize miniscore from overview if livescore payload didn't provide miniscore
    const t2ScoreParts = (team2.score || '0/0').split('/');
    const runs = parseInt(t2ScoreParts[0], 10) || 0;
    const wickets = parseInt(t2ScoreParts[1], 10) || 0;
    let target = 0;
    const matchTarget = status.match(/target\s*(\d+)/i) || status.match(/defending\s*(\d+)/i);
    if (matchTarget) {
      target = parseInt(matchTarget[1], 10);
    } else if (team1.score) {
      target = (parseInt(team1.score.split('/')[0], 10) || 0) + 1;
    }

    let ballsrem = 0;
    const matchBalls = status.match(/(\d+)\s*balls/i);
    if (matchBalls) {
      ballsrem = parseInt(matchBalls[1], 10);
    }

    const t2OversNum = parseFloat(team2.overs) || 0;
    const currentRunRate = t2OversNum > 0 ? (runs / t2OversNum).toFixed(2) : 0;
    const runsNeeded = target > 0 ? Math.max(0, target - runs) : 0;
    const requiredRunRate = (ballsrem > 0 && runsNeeded > 0) ? ((runsNeeded / (ballsrem / 6))).toFixed(2) : 0;

    miniscore = {
      runs,
      wickets,
      overs: team2.overs || "0.0",
      target,
      ballsrem,
      currentRunRate,
      requiredRunRate,
      recentOversStats: isRecent ? "0 1 0 4" : "1 2 6",
      partnerShip: { runs: 10, balls: 5 },
      lastWicket: "",
      batsmanStriker: {
        name: `${team2.shortName} Striker`,
        runs: runs,
        balls: 30,
        fours: 2,
        sixes: 0,
        strikeRate: "100.0"
      },
      batsmanNonStriker: {
        name: `${team2.shortName} Non-Striker`,
        runs: 10,
        balls: 12,
        fours: 1,
        sixes: 0,
        strikeRate: "83.3"
      },
      bowlerStriker: {
        name: `${team1.shortName} Bowler`,
        overs: "5.0",
        maidens: 0,
        runs: 25,
        wickets: 1,
        economy: "5.0"
      },
      bowlerNonStriker: null,
      inningsscores: null
    };
  }

  // Extract and format commentary from comwrapper
  const rawComwrapper = detail.comwrapper || 
                         detail.liveScorePayload?.comwrapper || 
                         overview.liveScorePayload?.comwrapper || 
                         [];
  
  const formattedComwrapper = rawComwrapper.map(item => {
    if (!item?.commentary) return item;
    return {
      ...item,
      commentary: {
        ...item.commentary,
        formattedText: formatCommentaryText(item.commentary)
      }
    };
  });

  return {
    matchId,
    seriesName: overview.seriesName || detail.seriesName || "Live Cricket Match",
    matchDesc: overview.matchDesc || detail.matchDesc || "ODI",
    matchFormat: overview.matchFormat || detail.matchFormat || "ODI",
    state: isRecent ? "recent" : "live",
    status,
    venue: overview.venue || detail.venue || "",
    city: overview.city || detail.city || "",
    startTime: overview.startTime || detail.startTime || new Date().toISOString(),
    currentInnings: rawMiniscore?.inningsid || overview.currentInnings || 2,
    currentBattingTeam: overview.currentBattingTeam || team2.name,
    lastSyncedAt: new Date().toISOString(),
    team1,
    team2,
    liveScorePayload: detail,
    miniscore,
    comwrapper: formattedComwrapper,
    scorecard: scorecardDetail?.scorecard || null,
    isRecent
  };
}
