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

function countPatternMatches(text, pattern) {
  return (text.match(pattern) || []).length;
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
  const metricsMentions = countPatternMatches(
    responseText,
    /\b\d+(?:\.\d+)?%|\b\d+(?:\.\d+)?x\b|\b\d+(?:,\d{3})+\b|\b\d+\s*(users|customers|clients|ms|seconds|minutes|hours|days|weeks|months|years)\b/gi,
  );
  const ownershipMentions = countPatternMatches(
    responseText,
    /\b(i led|i built|i owned|i designed|i drove|i shipped|i implemented|i migrated|i launched|i improved|i reduced)\b/gi,
  );
  const tradeoffMentions = countPatternMatches(
    responseText,
    /\b(tradeoff|constraint|latency|scalability|reliability|consistency|rollback|incident|debug|debugging|root cause|bottleneck|optimization)\b/gi,
  );
  const reflectionMentions = countPatternMatches(
    responseText,
    /\b(i learned|learned that|would do differently|in hindsight|next time|mistake|hardest part|challenge)\b/gi,
  );
  const fillerMentions = countPatternMatches(
    responseText,
    /\b(um|uh|like|you know|kind of|sort of|basically|literally)\b/gi,
  );
  const vagueClaimMentions = countPatternMatches(
    responseText,
    /\b(hardworking|passionate|team player|quick learner|detail oriented|good communicator|self starter|works well under pressure)\b/gi,
  );

  return {
    averageResponseLength,
    mentionsCrudeHumor: RISKY_LANGUAGE_PATTERN.test(responseText),
    usesStarStructure: starPattern.test(responseText),
    usesConcreteWins: concretePattern.test(responseText),
    responseCount: candidateResponses.length,
    metricsMentions,
    ownershipMentions,
    tradeoffMentions,
    reflectionMentions,
    fillerMentions,
    vagueClaimMentions,
  };
}

function buildSummary(averages, chatHistory = [], mockConfig = {}) {
  const chatInsights = analyzeChat(chatHistory);
  const roleLabel = mockConfig?.role || 'this role';
  const composureBase = Math.round(
    (averages.confidence + averages.engagement + averages.positivity + averages.happiness + (100 - averages.stress)) / 5
  );
  const contentBoost = Math.min(
    15,
    (chatInsights.usesConcreteWins ? 4 : 0) +
      (chatInsights.usesStarStructure ? 3 : 0) +
      (chatInsights.metricsMentions > 0 ? 3 : 0) +
      (chatInsights.ownershipMentions > 0 ? 2 : 0) +
      (chatInsights.tradeoffMentions > 0 ? 2 : 0) +
      (chatInsights.reflectionMentions > 0 ? 1 : 0),
  );
  const composure = Math.min(
    100,
    composureBase +
      8 +
      contentBoost -
      (chatInsights.mentionsCrudeHumor ? 4 : 0)
  );

  let rating = 'Needs Work';
  if (composure >= 78) rating = 'Elite';
  else if (composure >= 64) rating = 'Strong';
  else if (composure >= 50) rating = 'Promising';

  const strengths = [];
  if (averages.confidence >= 70) strengths.push('steady confidence');
  if (averages.engagement >= 70) strengths.push('good engagement');
  if (averages.positivity >= 70) strengths.push('positive tone');
  if (averages.happiness >= 70) strengths.push('warm expression');
  if (chatInsights.usesConcreteWins) strengths.push('concrete examples');
  if (chatInsights.usesStarStructure) strengths.push('structured storytelling');
  if (chatInsights.metricsMentions > 0) strengths.push('quantified impact');
  if (chatInsights.ownershipMentions > 0) strengths.push('clear ownership');
  if (chatInsights.tradeoffMentions > 0) strengths.push('technical tradeoff depth');
  if (chatInsights.reflectionMentions > 0) strengths.push('self-awareness');

  const risks = [];
  if (averages.stress >= 55) risks.push('visible stress');
  if (averages.engagement < 50) risks.push('low engagement');
  if (averages.confidence < 55) risks.push('shaky confidence');
  if (chatInsights.mentionsCrudeHumor) risks.push('over-casual phrasing');
  if (chatInsights.averageResponseLength > 0 && chatInsights.averageResponseLength < 18) risks.push('answers that end too early');
  if (chatInsights.metricsMentions === 0) risks.push('thin evidence of impact');
  if (chatInsights.ownershipMentions === 0) risks.push('unclear ownership');
  if (chatInsights.tradeoffMentions === 0) risks.push('missing decision tradeoffs');

  const advice = [];
  if (averages.confidence < 60) advice.push('Slow down the first sentence of each answer and commit to a stronger opening claim.');
  if (averages.engagement < 60) advice.push('Maintain eye contact with the camera between phrases so your energy does not drop off.');
  if (averages.positivity < 60) advice.push(`Add one positive outcome or business result when describing your work so your answers for ${roleLabel} sound more compelling.`);
  if (averages.happiness < 55) advice.push('Relax your face between questions and reset with a small smile before answering.');
  if (averages.stress > 55) advice.push('Pause for one breath before speaking so nervous tension does not show up in your delivery.');
  if (chatInsights.mentionsCrudeHumor) advice.push('Swap casual or edgy humor for polished language so your tone stays interview-safe.');
  if (!chatInsights.usesConcreteWins) advice.push('Anchor more answers with shipped work, measurable outcomes, or ownership moments from your background.');
  if (chatInsights.metricsMentions === 0) advice.push(`Several answers described responsibility without proving impact. For ${roleLabel}, add a metric, scope, or before-and-after result whenever you can.`);
  if (chatInsights.ownershipMentions === 0) advice.push('Your answers lean a little too collective. Add one sentence that clearly states what you personally owned, decided, or delivered.');
  if (chatInsights.tradeoffMentions === 0) advice.push('Your technical answers will sound stronger if you name the tradeoff you faced and why you chose that path over another option.');
  if (chatInsights.reflectionMentions === 0 && chatInsights.responseCount > 1) advice.push('Include one lesson learned or one thing you would do differently so your answers show judgment, not just activity.');
  if (!chatInsights.usesStarStructure) advice.push('Use a clearer Situation -> Action -> Result rhythm so your answers land more cleanly.');
  if (chatInsights.averageResponseLength > 0 && chatInsights.averageResponseLength < 18) advice.push('Stretch short answers by adding context, your action, and the measurable result before you stop.');
  if (chatInsights.fillerMentions >= 3) advice.push('Trim filler words in the first 10 seconds of each answer so your opening sounds more intentional.');
  if (chatInsights.vagueClaimMentions >= 2) advice.push('Replace generic traits like "hardworking" or "team player" with proof from a project, a metric, or a difficult decision you handled.');

  if (!advice.length) {
    advice.push(`Your fundamentals are strong. The next step for ${roleLabel} is to keep the same calm delivery while pushing into harder follow-up questions and sharper tradeoff discussion.`);
    advice.push('You are ready for more adversarial or time-pressured rounds instead of basic practice prompts.');
  }

  const primaryGap = advice[0] || 'Keep sharpening your strongest examples.';

  return {
    overallScore: composure,
    overallRating: rating,
    snapshot: strengths.length
      ? `Best moments combined ${strengths.slice(0, 2).join(' and ')}.`
      : 'Signal profile was mixed across the session.',
    coachingNote: risks.length
      ? `Your next scoring jump comes from fixing ${risks.slice(0, 2).join(' and ')}.`
      : `Body language stayed balanced, so most improvement now comes from sharper content and tougher examples.`,
    advice: advice.slice(0, 6),
    primaryGap,
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

  const summary = buildSummary(averages, chatHistory, mockConfig);
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
