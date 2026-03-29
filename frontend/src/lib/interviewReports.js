const REPORTS_STORAGE_KEY = 'silent-coach-interview-reports';
const LAST_REPORT_STORAGE_KEY = 'silent-coach-last-report';
const LAST_REPORT_ID_STORAGE_KEY = 'silent-coach-last-report-id';
const RISKY_LANGUAGE_PATTERN = /\b(lmao|lol|rofl|wtf|damn|hell yeah|bro|crap|stupid|sucks|idiot|dumb|freaking|frickin|pissed|sexy|badass)\b/i;

export const SIGNAL_CONFIG = [
  { key: 'confidence', label: 'Confidence', color: '#22d3ee' },
  { key: 'engagement', label: 'Engagement', color: '#a3e635' },
  { key: 'positivity', label: 'Positivity', color: '#f59e0b' },
  { key: 'happiness', label: 'Happiness', color: '#fb7185' },
  { key: 'stress', label: 'Stress', color: '#c084fc' },
];

function safeReadReports() {
  try {
    const raw = localStorage.getItem(REPORTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeReports(reports) {
  try {
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
  } catch (error) {
    console.error('Failed to write interview reports to localStorage', error);
  }

  try {
    sessionStorage.setItem(LAST_REPORT_STORAGE_KEY, JSON.stringify(reports[0] || null));
    sessionStorage.setItem(LAST_REPORT_ID_STORAGE_KEY, reports[0]?.id || '');
  } catch (error) {
    console.error('Failed to write latest interview report to sessionStorage', error);
  }

  window.dispatchEvent(new CustomEvent('interview-reports-updated'));
}

function averageMetric(signalHistory, key) {
  if (!signalHistory?.length) return 0;
  return Math.round(signalHistory.reduce((sum, point) => sum + (point[key] || 0), 0) / signalHistory.length);
}

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function buildQuestionMarkers(chatHistory = [], startedAt, endedAt) {
  const interviewerPrompts = chatHistory.filter((entry) => entry.role === 'interviewer');
  if (!interviewerPrompts.length) return [];

  const startMs = new Date(startedAt || endedAt || Date.now()).getTime();
  const endMs = new Date(endedAt || Date.now()).getTime();
  const duration = Math.max(endMs - startMs, 1000);

  return interviewerPrompts.map((entry, index) => {
    const ts = new Date(entry.timestamp || endedAt || Date.now()).getTime();
    const ratio = clamp((ts - startMs) / duration);
    return {
      id: `q_${index + 1}`,
      label: `Q${index + 1}`,
      prompt: entry.text,
      ratio,
    };
  });
}

function analyzeChat(chatHistory = []) {
  const candidateResponses = chatHistory.filter((entry) => entry.role === 'candidate');
  const responseText = candidateResponses.map((entry) => entry.text || '').join(' ').toLowerCase();
  const responseLengths = candidateResponses.map((entry) => (entry.text || '').trim().split(/\s+/).filter(Boolean).length);
  const averageResponseLength = responseLengths.length
    ? Math.round(responseLengths.reduce((sum, count) => sum + count, 0) / responseLengths.length)
    : 0;

  const starPattern = /\b(situation|task|action|result)\b/i;
  const concretePattern = /\b(shipped|built|improved|increased|reduced|launched|designed|led|delivered)\b/i;

  return {
    averageResponseLength,
    mentionsCrudeHumor: RISKY_LANGUAGE_PATTERN.test(responseText),
    usesStarStructure: starPattern.test(responseText),
    usesConcreteWins: concretePattern.test(responseText),
    responseCount: candidateResponses.length,
  };
}

function buildSummary(averages, chatHistory = []) {
  const chatInsights = analyzeChat(chatHistory);
  const composureBase = Math.round(
    (averages.confidence + averages.engagement + averages.positivity + averages.happiness + (100 - averages.stress)) / 5
  );
  const composure = Math.min(
    100,
    composureBase +
      6 +
      (chatInsights.usesConcreteWins ? 4 : 0) +
      (chatInsights.usesStarStructure ? 3 : 0)
  );

  let rating = 'Needs Work';
  if (composure >= 80) rating = 'Elite';
  else if (composure >= 68) rating = 'Strong';
  else if (composure >= 54) rating = 'Promising';

  const strengths = [];
  if (averages.confidence >= 70) strengths.push('steady confidence');
  if (averages.engagement >= 70) strengths.push('good engagement');
  if (averages.positivity >= 70) strengths.push('positive tone');
  if (averages.happiness >= 70) strengths.push('warm expression');
  if (chatInsights.usesConcreteWins) strengths.push('concrete examples');
  if (chatInsights.usesStarStructure) strengths.push('structured storytelling');

  const risks = [];
  if (averages.stress >= 55) risks.push('visible stress');
  if (averages.engagement < 50) risks.push('low engagement');
  if (averages.confidence < 55) risks.push('shaky confidence');
  if (chatInsights.mentionsCrudeHumor) risks.push('over-casual phrasing');
  if (chatInsights.averageResponseLength > 0 && chatInsights.averageResponseLength < 18) risks.push('answers that end too early');

  const advice = [];
  if (averages.confidence < 60) advice.push('Slow down the first sentence of each answer and commit to a stronger opening claim.');
  if (averages.engagement < 60) advice.push('Maintain eye contact with the camera between phrases so your energy does not drop off.');
  if (averages.positivity < 60) advice.push('Add one concrete win or positive outcome when describing your experience.');
  if (averages.happiness < 55) advice.push('Relax your face between questions and reset with a small smile before answering.');
  if (averages.stress > 55) advice.push('Pause for one breath before speaking so nervous tension does not show up in your delivery.');
  if (chatInsights.mentionsCrudeHumor) advice.push('Swap casual or edgy humor for polished language so your tone stays interview-safe.');
  if (!chatInsights.usesConcreteWins) advice.push('Anchor more answers with shipped work, measurable outcomes, or ownership moments from your background.');
  if (!chatInsights.usesStarStructure) advice.push('Use a clearer Situation → Action → Result rhythm so your answers land more cleanly.');
  if (chatInsights.averageResponseLength > 0 && chatInsights.averageResponseLength < 18) advice.push('Stretch short answers by adding one constraint, one action, and one result before you stop.');

  if (!advice.length) {
    advice.push('Keep your current delivery style, and focus on sharpening answer structure rather than body language.');
    advice.push('You are ready to push into harder follow-up questions and timed practice rounds.');
  }

  return {
    overallScore: composure,
    overallRating: rating,
    snapshot: strengths.length
      ? `Strongest signals: ${strengths.slice(0, 2).join(', ')}.`
      : 'Signal profile was mixed across the session.',
    coachingNote: risks.length
      ? `Watch for ${risks.slice(0, 2).join(' and ')} in your next round.`
      : 'Body language stayed balanced and interview-ready throughout the session.',
    advice,
    chatInsights,
  };
}

export function getInterviewReports() {
  return safeReadReports().sort((a, b) => new Date(b.endedAt) - new Date(a.endedAt));
}

export function getInterviewReport(reportId) {
  const stored = safeReadReports().find((report) => report.id === reportId);
  if (stored) return stored;

  try {
    const fallback = sessionStorage.getItem(LAST_REPORT_STORAGE_KEY);
    if (!fallback) return null;
    const parsed = JSON.parse(fallback);
    return parsed?.id === reportId ? parsed : null;
  } catch {
    return null;
  }
}

export function saveInterviewReport({
  chatHistory = [],
  mockConfig = {},
  signalHistory = [],
  startedAt,
  endedAt,
  endingReason = 'manual_end',
}) {
  const createdAt = endedAt || new Date().toISOString();
  const averages = SIGNAL_CONFIG.reduce((acc, signal) => {
    acc[signal.key] = averageMetric(signalHistory, signal.key);
    return acc;
  }, {});

  const summary = buildSummary(averages, chatHistory);
  const questionMarkers = buildQuestionMarkers(chatHistory, startedAt || createdAt, createdAt);
  const transcriptPreview = chatHistory
    .filter((entry) => entry.role === 'candidate')
    .map((entry) => entry.text)
    .join(' ')
    .trim();

  const report = {
    id: `report_${Date.now()}`,
    createdAt,
    startedAt: startedAt || createdAt,
    endedAt: createdAt,
    endingReason,
    company: mockConfig?.company || 'Mock Interview',
    role: mockConfig?.role || 'Interview Practice',
    durationMins: mockConfig?.duration || 45,
    difficulty: mockConfig?.difficulty || 'Mid-Level',
    persona: mockConfig?.selectedPersona || 'ali',
    chatHistory,
    signalHistory,
    averages,
    summary,
    questionMarkers,
    transcriptPreview: transcriptPreview.slice(0, 180),
  };

  const existing = safeReadReports();
  writeReports([report, ...existing]);
  return report;
}
