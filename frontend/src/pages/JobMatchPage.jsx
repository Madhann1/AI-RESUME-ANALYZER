import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { jobMatchApi, resumeApi } from '../services/api';
import { ScoreGauge } from '../components/ScoreGauge';
import { 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Sparkles, 
  Award, 
  ArrowRight,
  Cpu,
  FileText
} from 'lucide-react';

export const JobMatchPage = () => {
  const location = useLocation();
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(location.state?.resumeReportId || '');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await resumeApi.getUserResumes();
        setResumes(res.data);
        if (!selectedResumeId && res.data.length > 0) {
          setSelectedResumeId(res.data[0].id);
        }
      } catch (err) {
        console.error("Error fetching resumes:", err);
      }
    };
    fetchResumes();
  }, [selectedResumeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedResumeId || !jobDescription.trim()) {
      setError('Please select a resume and paste the job description text.');
      return;
    }

    setError('');
    setLoading(true);
    setMatchResult(null);

    try {
      const res = await jobMatchApi.analyzeMatch({
        resumeReportId: parseInt(selectedResumeId),
        jobTitle: jobTitle.trim() || 'Target Position',
        jobDescription: jobDescription.trim(),
      });
      setMatchResult(res.data);
    } catch (err) {
      console.error("Job match error:", err);
      setError(err.response?.data?.message || 'Job description analysis failed. Ensure local Ollama is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Job Description Matcher">
      <div className="space-y-8 pb-12">
        {/* Banner */}
        <div className="glass-panel rounded-3xl p-8 border border-purple-500/20 bg-gradient-to-r from-purple-950/30 via-slate-900 to-slate-950">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-3">
            <Sparkles className="w-4 h-4" />
            <span>AI Skill Gap Analysis &amp; Learning Paths</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Job Description Matcher</h1>
          <p className="text-sm text-slate-400 mt-2 max-w-xl">
            Compare your resume against any job description to uncover missing skills, matching technologies, custom learning paths, and hiring manager recommendations.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-950/50 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Input Form */}
        <div className="glass-panel rounded-3xl p-8 border border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Select Resume Report
                </label>
                <div className="relative">
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
                  >
                    <option value="">-- Choose a Resume --</option>
                    {resumes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.candidateName || r.originalFileName} (Score: {r.overallScore})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Target Job Title (Optional)
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Java Full Stack Engineer"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Paste Job Description
              </label>
              <textarea
                rows={6}
                required
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description requirements, responsibilities, and required technical skills here..."
                className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-purple-600/25 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Cpu className="w-5 h-5 animate-spin" />
                  <span>Evaluating Skill Gaps via Ollama...</span>
                </>
              ) : (
                <>
                  <Briefcase className="w-5 h-5" />
                  <span>Analyze Job Match</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results View */}
        {matchResult && (
          <div className="space-y-8 animate-fadeIn">
            {/* Score & Hiring Recommendation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-panel rounded-3xl p-6 border border-purple-500/20 flex flex-col items-center justify-center text-center">
                <ScoreGauge score={matchResult.matchPercentage} size={130} strokeWidth={10} />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-4">Job Match Rating</span>
              </div>

              <div className="md:col-span-2 glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-center space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400">
                  <Award className="w-4 h-4" />
                  <span>Hiring Manager Assessment</span>
                </div>
                <h3 className="text-lg font-bold text-white leading-snug">{matchResult.hiringRecommendation}</h3>
                <p className="text-xs text-slate-400">Target Role: <span className="text-slate-200 font-semibold">{matchResult.jobTitle}</span></p>
              </div>
            </div>

            {/* Skills Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Matching Skills */}
              <div className="glass-panel rounded-3xl p-6 border border-emerald-500/20 bg-emerald-950/10 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <h3 className="font-bold text-white text-base">Matching Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {matchResult.matchingSkills?.map((skill, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="glass-panel rounded-3xl p-6 border border-red-500/20 bg-red-950/10 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-red-500/20 text-red-400">
                  <XCircle className="w-5 h-5" />
                  <h3 className="font-bold text-white text-base">Missing / Required Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {matchResult.missingSkills?.map((skill, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-red-950/80 border border-red-500/30 text-red-300 text-xs font-semibold">
                      ✕ {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended Learning Paths */}
            {matchResult.learningPath && matchResult.learningPath.length > 0 && (
              <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-purple-400">
                  <BookOpen className="w-5 h-5" />
                  <h3 className="font-bold text-white text-base">Recommended Learning Path</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchResult.learningPath.map((item, i) => (
                    <div key={i} className="glass-card rounded-2xl p-5 border border-purple-500/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-sm">{item.topic}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                          Priority {i + 1}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{item.rationale}</p>
                      {item.keySubtopics && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.keySubtopics.map((sub, j) => (
                            <span key={j} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              • {sub}
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
        )}
      </div>
    </Layout>
  );
};
