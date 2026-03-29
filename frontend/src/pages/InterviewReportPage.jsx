import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BarChart3, Clock3, TrendingUp } from 'lucide-react';
import { getInterviewReport, SIGNAL_CONFIG } from '../lib/interviewReports';
import BrandLogo from '../components/BrandLogo';

function formatTimestamp(value) {
  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function buildMetricPath(history, metricKey, width, height) {
  if (!history?.length) return '';
  if (history.length === 1) {
    const y = height - (history[0][metricKey] / 100) * height;
    return `M 0 ${y} L ${width} ${y}`;
  }

  return history
    .map((point, index) => {
      const x = (index / (history.length - 1)) * width;
      const y = height - (point[metricKey] / 100) * height;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
}

function getStarState(score) {
  return {
    left: score >= 55,
    right: score >= 72,
    center: score >= 88,
  };
}

export default function InterviewReportPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const report = getInterviewReport(reportId);

  if (!report) {
    return (
      <div className="brand-shell min-h-screen text-on-background flex items-center justify-center p-8">
        <div className="max-w-lg text-center">
          <h1 className="text-3xl font-bold mb-4 text-[var(--brand-ink)]">Report not found</h1>
          <p className="text-on-surface-variant mb-6">This interview summary may have been deleted or was never saved on this device.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="brand-button-primary px-5 py-3 rounded-full font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const stars = getStarState(report.summary.overallScore);

  return (
    <div className="brand-shell min-h-screen text-on-background px-6 py-8 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="mb-5">
              <BrandLogo size="sm" showTagline />
            </div>
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors mb-3">
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <p className="text-xs uppercase tracking-[0.25em] text-on-surface-variant">Interview Report</p>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mt-2 text-[var(--brand-ink)]">{report.summary.overallRating} Performance Summary</h1>
            <p className="text-on-surface-variant mt-3 text-sm md:text-base">
              {report.role} · {report.company} · {formatTimestamp(report.endedAt)} · {report.durationMins} min session
            </p>
          </div>
          <button
            onClick={() => navigate('/interview')}
            className="brand-button-primary px-5 py-3 rounded-full font-semibold shadow-lg"
          >
            Review Session
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.5fr,0.9fr] gap-6 mb-6">
          <section className="brand-card rounded-[2rem] p-8 shadow-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant mb-6">Overall Tier Rating</p>
            <div className="flex items-center gap-5 text-[#f6d776] mb-6 text-6xl">
              <span className={stars.left ? '' : 'opacity-20'}>★</span>
              <span className={`text-8xl ${stars.center ? '' : 'opacity-20'}`}>★</span>
              <span className={stars.right ? '' : 'opacity-20'}>★</span>
            </div>
            <h2 className="text-5xl font-bold tracking-tight mb-3 text-[var(--brand-ink)]">{report.summary.overallRating.toUpperCase()} GRADE</h2>
            <p className="text-on-surface max-w-2xl">{report.summary.snapshot}</p>
            <p className="text-on-surface-variant text-sm mt-3">{report.summary.coachingNote}</p>
          </section>

          <section className="rounded-[2rem] bg-[rgba(107,170,117,0.12)] border border-primary/20 p-8 shadow-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant mb-6">Preparation Level</p>
            <div className="text-7xl font-bold mb-6 text-[var(--brand-ink)]">{report.summary.overallScore}<span className="text-4xl">%</span></div>
            <div className="h-3 rounded-full bg-black/10 overflow-hidden mb-4">
              <div className="h-full rounded-full bg-primary" style={{ width: `${report.summary.overallScore}%` }} />
            </div>
            <p className="text-on-surface text-sm leading-6">
              Session ended via {report.endingReason === 'time_up' ? 'timer expiration' : 'manual completion'}.
              Signal averages and transcript were saved to your previous interviews history.
            </p>
          </section>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {SIGNAL_CONFIG.map((signal) => (
            <div key={signal.key} className="brand-card rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-3">{signal.label}</p>
              <div className="text-4xl font-bold mb-4">{report.averages[signal.key]}<span className="text-xl">%</span></div>
              <div className="h-2 rounded-full bg-black/10 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${report.averages[signal.key]}%`, backgroundColor: signal.color }} />
              </div>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-[1.35fr,0.95fr] gap-6">
          <section className="brand-card rounded-[2rem] p-6">
            <div className="flex items-center gap-3 mb-5">
              <TrendingUp size={18} className="text-primary" />
              <h3 className="text-xl font-semibold text-[var(--brand-ink)]">Graph Trends</h3>
            </div>

            <div className="flex flex-wrap gap-3 mb-5">
              {SIGNAL_CONFIG.map((signal) => (
                <div key={signal.key} className="inline-flex items-center gap-2 rounded-full bg-primary/8 px-3 py-1.5 text-sm text-on-surface">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: signal.color }} />
                  {signal.label}
                </div>
              ))}
            </div>

            <div className="relative pl-8 pr-2 py-2 rounded-2xl bg-white/70 border border-outline-variant/50">
              <div className="absolute left-3 top-3 bottom-3 flex flex-col justify-between text-xs text-on-surface-variant">
                <span>100</span>
                <span>50</span>
                <span>0</span>
              </div>
              <svg viewBox="0 0 700 260" className="w-full h-[260px]" preserveAspectRatio="none">
                <path d="M 0 0 L 700 0" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <path d="M 0 130 L 700 130" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <path d="M 0 260 L 700 260" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                {SIGNAL_CONFIG.map((signal) => (
                  <path
                    key={signal.key}
                    d={buildMetricPath(report.signalHistory, signal.key, 700, 260)}
                    fill="none"
                    stroke={signal.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
                {(report.questionMarkers || []).map((marker) => (
                  <g key={marker.id}>
                    <line
                      x1={marker.ratio * 700}
                      y1="0"
                      x2={marker.ratio * 700}
                      y2="260"
                      stroke="rgba(255,255,255,0.18)"
                      strokeDasharray="6 6"
                    />
                    <text
                      x={Math.min(Math.max(marker.ratio * 700 + 8, 8), 630)}
                      y="20"
                      fill="#cbd5e1"
                      fontSize="12"
                    >
                      {marker.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {(report.questionMarkers || []).length > 0 && (
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                {report.questionMarkers.map((marker) => (
                  <div key={marker.id} className="rounded-xl bg-primary/6 p-3 border border-primary/12">
                    <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-2">{marker.label}</p>
                    <p className="text-sm text-on-surface line-clamp-3">{marker.prompt}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="brand-card rounded-[2rem] p-6">
            <div className="flex items-center gap-3 mb-5">
              <BarChart3 size={18} className="text-primary" />
              <h3 className="text-xl font-semibold text-[var(--brand-ink)]">Interview Snapshot</h3>
            </div>
            <div className="space-y-4 text-sm">
              <div className="rounded-2xl bg-primary/6 p-4 border border-primary/12">
                <p className="text-on-surface-variant uppercase tracking-[0.2em] text-xs mb-2">Candidate Preview</p>
                <p className="text-on-surface leading-6">{report.transcriptPreview || 'Transcript preview unavailable.'}</p>
              </div>
              <div className="rounded-2xl bg-primary/6 p-4 border border-primary/12">
                <p className="text-on-surface-variant uppercase tracking-[0.2em] text-xs mb-2">Session Details</p>
                <div className="space-y-2 text-on-surface">
                  <p className="flex items-center gap-2"><Clock3 size={14} /> Started: {formatTimestamp(report.startedAt)}</p>
                  <p className="flex items-center gap-2"><Clock3 size={14} /> Ended: {formatTimestamp(report.endedAt)}</p>
                  <p>{report.chatHistory.filter((entry) => entry.role === 'candidate').length} candidate responses captured</p>
                  <p>{report.chatHistory.filter((entry) => entry.role === 'interviewer').length} interviewer prompts captured</p>
                </div>
              </div>
              <div className="rounded-2xl bg-primary/6 p-4 border border-primary/12">
                <p className="text-on-surface-variant uppercase tracking-[0.2em] text-xs mb-2">Coaching Advice</p>
                {report.summary.primaryGap && (
                  <div className="mb-3 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3">
                    <p className="text-[0.65rem] uppercase tracking-[0.2em] text-amber-200 mb-1">Priority Fix</p>
                    <p className="text-sm text-amber-50">{report.summary.primaryGap}</p>
                  </div>
                )}
                <div className="space-y-2 text-on-surface">
                  {(report.summary.advice || []).map((tip, index) => (
                    <p key={index}>• {tip}</p>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-primary/6 p-4 border border-primary/12">
                <p className="text-on-surface-variant uppercase tracking-[0.2em] text-xs mb-2">Chat Read</p>
                <div className="space-y-2 text-on-surface">
                  <p>Average answer length: {report.summary.chatInsights?.averageResponseLength || 0} words</p>
                  <p>Quantified impact cues: {(report.summary.chatInsights?.metricsMentions || 0) > 0 ? `${report.summary.chatInsights.metricsMentions} found` : 'Rare or missing'}</p>
                  <p>Ownership language: {(report.summary.chatInsights?.ownershipMentions || 0) > 0 ? 'Clear enough' : 'Too hidden in team language'}</p>
                  <p>Tradeoff reasoning: {(report.summary.chatInsights?.tradeoffMentions || 0) > 0 ? 'Present' : 'Needs more depth'}</p>
                  <p>Structured storytelling cues: {report.summary.chatInsights?.usesStarStructure ? 'Present' : 'Missing'}</p>
                  <p>Reflection or lessons learned: {(report.summary.chatInsights?.reflectionMentions || 0) > 0 ? 'Present' : 'Could be stronger'}</p>
                  <p>Tone safety: {report.summary.chatInsights?.mentionsCrudeHumor ? 'Needs cleanup' : 'Professional'}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
