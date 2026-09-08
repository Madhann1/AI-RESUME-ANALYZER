import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ScoreGauge, ProgressBar } from '../components/ScoreGauge';
import { resumeApi } from '../services/api';
import { 
  User, 
  Mail, 
  Phone, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  Briefcase, 
  GraduationCap, 
  Code, 
  FileText, 
  ArrowLeft,
  HelpCircle
} from 'lucide-react';

export const AnalysisResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [report, setReport] = useState(location.state?.report || null);
  const [loading, setLoading] = useState(!location.state?.report);

  useEffect(() => {
    if (!report && location.state?.reportId) {
      const fetchReport = async () => {
        try {
          const res = await resumeApi.getResumeById(location.state.reportId);
          setReport(res.data);
        } catch (err) {
          console.error("Error fetching report:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchReport();
    } else {
      setLoading(false);
    }
  }, [location.state, report]);

  if (loading) {
    return (
      <Layout title="Resume Analysis">
        <div className="py-20 text-center text-slate-500 font-semibold animate-pulse">Loading report details...</div>
      </Layout>
    );
  }

  if (!report) {
    return (
      <Layout title="Resume Analysis">
        <div className="max-w-xl mx-auto py-16 text-center glass-panel rounded-3xl p-8 border border-slate-800">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white">No Report Selected</h3>
          <p className="text-sm text-slate-400 mt-1 mb-6">Please upload a resume or select one from your report history.</p>
          <Link to="/upload" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm">
            Upload Resume
          </Link>
        </div>
      </Layout>
    );
  }

  const { scoreBreakdown } = report;

  return (
    <Layout title="Analysis Results">
      <div className="space-y-8 pb-12">
        {/* Back navigation & Actions Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-3">
            <Link
              to="/job-match"
              state={{ resumeReportId: report.id }}
              className="px-4 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Briefcase className="w-4 h-4" />
              <span>Match Job Description</span>
            </Link>

            <Link
              to="/interview-questions"
              state={{ resumeReportId: report.id }}
              className="px-4 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Generate Interview Qs</span>
            </Link>
          </div>
        </div>

        {/* Top Header Card: Candidate & Overall Score */}
        <div className="glass-panel rounded-3xl p-8 border border-indigo-500/20 bg-gradient-to-r from-indigo-950/30 via-slate-900 to-slate-950">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                <FileText className="w-3.5 h-3.5" />
                <span>{report.originalFileName}</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">{report.candidateName || 'Candidate Profile'}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                {report.candidateEmail && (
                  <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-indigo-400" /> {report.candidateEmail}</span>
                )}
                {report.candidatePhone && (
                  <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-indigo-400" /> {report.candidatePhone}</span>
                )}
              </div>
            </div>

            {/* Score Gauge Widget */}
            <div className="flex items-center gap-6 glass-card p-6 rounded-2xl border border-slate-800">
              <ScoreGauge score={report.overallScore} size={110} strokeWidth={9} />
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Resume Rating</span>
                <p className="text-lg font-bold text-white mt-1">
                  {report.overallScore >= 80 ? 'Excellent' : report.overallScore >= 65 ? 'Good' : 'Needs Work'}
                </p>
                <span className="text-xs text-slate-400 mt-0.5 block">Evaluated via Gemma 3 / Local LLM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Score Breakdown & Skills Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category Scores (1 Col) */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Award className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white text-base">Category Score Breakdown</h3>
            </div>

            <div className="space-y-4">
              <ProgressBar label="Technical Skills" value={scoreBreakdown?.skills || 80} color="bg-indigo-500" />
              <ProgressBar label="Project Quality" value={scoreBreakdown?.projects || 80} color="bg-purple-500" />
              <ProgressBar label="Work Experience" value={scoreBreakdown?.experience || 75} color="bg-blue-500" />
              <ProgressBar label="Resume Formatting" value={scoreBreakdown?.formatting || 85} color="bg-emerald-500" />
              <ProgressBar label="Technical Depth" value={scoreBreakdown?.technicalDepth || 80} color="bg-amber-500" />
            </div>
          </div>

          {/* Extracted Skills Badges (2 Cols) */}
          <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Code className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white text-base">Extracted Technical Skills</h3>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-2">
              {report.skills && report.skills.length > 0 ? (
                report.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 text-xs font-semibold hover:border-indigo-500/50 hover:text-indigo-300 transition-colors"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-500">No specific skills extracted</p>
              )}
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Strengths */}
          <div className="glass-panel rounded-3xl p-6 border border-emerald-500/20 bg-emerald-950/10 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="font-bold text-white text-base">Candidate Strengths</h3>
            </div>
            <ul className="space-y-2.5">
              {report.strengths?.map((str, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="glass-panel rounded-3xl p-6 border border-amber-500/20 bg-amber-950/10 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-amber-500/20 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-white text-base">Areas for Improvement</h3>
            </div>
            <ul className="space-y-2.5">
              {report.weaknesses?.map((wk, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>{wk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actionable Improvement Suggestions */}
        <div className="glass-panel rounded-3xl p-6 border border-indigo-500/20 bg-indigo-950/20 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-indigo-500/20 text-indigo-400">
            <Lightbulb className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">AI Recommendation Plan</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {report.improvementSuggestions?.map((sug, i) => (
              <div key={i} className="glass-card rounded-2xl p-4 border border-indigo-500/10 space-y-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Step {i + 1}</span>
                <p className="text-xs text-slate-200 leading-relaxed">{sug}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Projects & Education Detail Cards */}
        {report.projects && report.projects.length > 0 && (
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Code className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white text-base">Extracted Projects</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.projects.map((proj, i) => (
                <div key={i} className="glass-card rounded-2xl p-4 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-white text-sm">{proj.title}</h4>
                  <p className="text-xs text-slate-400">{proj.description}</p>
                  {proj.technologies && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.technologies.map((t, j) => (
                        <span key={j} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/20">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
