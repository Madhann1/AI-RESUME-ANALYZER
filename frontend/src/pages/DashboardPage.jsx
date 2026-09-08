import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { dashboardApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ScoreGauge } from '../components/ScoreGauge';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Award, 
  Briefcase, 
  HelpCircle, 
  UploadCloud, 
  ArrowRight, 
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardApi.getStats();
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <Layout title="Dashboard">
      {/* Welcome Banner */}
      <div className="relative glass-panel rounded-3xl p-8 mb-8 overflow-hidden border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-950">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ollama Local AI Powered</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.fullName || 'Engineer'} 👋
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Upload your PDF resume to extract insights, receive local LLM evaluation scores, match job descriptions, and practice interview questions.
            </p>
          </div>
          <Link
            to="/upload"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 flex items-center gap-2 self-start md:self-auto transition-all duration-200"
          >
            <UploadCloud className="w-5 h-5" />
            <span>Upload New Resume</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Resumes</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{stats?.totalResumes || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Score</p>
              <h3 className="text-3xl font-extrabold text-emerald-400 mt-1">
                {stats?.averageScore ? `${stats.averageScore}/100` : 'N/A'}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Job Matches</p>
              <h3 className="text-3xl font-extrabold text-purple-400 mt-1">{stats?.totalJobMatches || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Interview Qs</p>
              <h3 className="text-3xl font-extrabold text-amber-400 mt-1">{stats?.totalInterviewQuestions || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <HelpCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Analyses & Quick Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Analyses List (2 Cols) */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Recent Resume Analyses</h2>
              <p className="text-xs text-slate-400">Your latest uploaded PDF files and AI ratings</p>
            </div>
            <Link to="/history" className="text-xs text-indigo-400 font-semibold hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500 text-sm animate-pulse">Loading analyses...</div>
          ) : !stats?.recentAnalyses || stats.recentAnalyses.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-slate-800 rounded-2xl">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-300 font-semibold">No Resumes Analyzed Yet</p>
              <p className="text-slate-500 text-xs mt-1 mb-4">Upload your first PDF resume to get structured Ollama evaluation</p>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload PDF</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentAnalyses.map((item) => (
                <div key={item.id} className="glass-card rounded-2xl p-4 flex items-center justify-between hover:border-indigo-500/40 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 font-bold text-sm">
                      PDF
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">{item.candidateName || item.originalFileName}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                        <span>{item.candidateEmail}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block font-medium">Score</span>
                      <span className="text-base font-extrabold text-emerald-400">{item.overallScore}/100</span>
                    </div>
                    <Link
                      to={`/history`}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                    >
                      View Report
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Tools & Shortcuts (1 Col) */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800">
            <h3 className="text-base font-bold text-white mb-4">Quick AI Workflows</h3>
            
            <div className="space-y-3">
              <Link
                to="/upload"
                className="block p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 hover:border-indigo-500/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Resume Evaluation</h4>
                    <p className="text-xs text-slate-400">Extract skills, education & score profile</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/job-match"
                className="block p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20 hover:border-purple-500/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Job Description Match</h4>
                    <p className="text-xs text-slate-400">Find skill gaps & recommended learning</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/interview-questions"
                className="block p-4 rounded-2xl bg-amber-950/30 border border-amber-500/20 hover:border-amber-500/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Interview Generator</h4>
                    <p className="text-xs text-slate-400">Technical Q&amp;As for Java, Spring Boot &amp; HR</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
