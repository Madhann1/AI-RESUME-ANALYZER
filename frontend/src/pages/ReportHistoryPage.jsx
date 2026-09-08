import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { resumeApi } from '../services/api';
import { FileText, Trash2, Eye, Calendar, Award, Sparkles } from 'lucide-react';

export const ReportHistoryPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await resumeApi.getUserResumes();
      setReports(res.data);
    } catch (err) {
      console.error("Error fetching report history:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume report? This action cannot be undone.")) {
      return;
    }
    setDeletingId(id);
    try {
      await resumeApi.deleteResume(id);
      setReports(reports.filter(r => r.id !== id));
    } catch (err) {
      console.error("Error deleting report:", err);
      alert(err.response?.data?.message || "Failed to delete report.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Layout title="Report History">
      <div className="space-y-8 pb-12">
        {/* Banner */}
        <div className="glass-panel rounded-3xl p-8 border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Stored in MySQL Database</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Resume Report History</h1>
          <p className="text-sm text-slate-400 mt-2 max-w-xl">
            Access, view, or manage all your past PDF resume analyses and local LLM evaluation reports.
          </p>
        </div>

        {/* Reports Table Card */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-slate-500 text-sm animate-pulse">Loading report history...</div>
          ) : reports.length === 0 ? (
            <div className="py-16 text-center">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No Reports Found</h3>
              <p className="text-xs text-slate-400 mt-1">Upload a PDF resume to generate your first analysis report.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-4">Candidate / File</th>
                    <th className="py-4 px-4">Email</th>
                    <th className="py-4 px-4 text-center">Score</th>
                    <th className="py-4 px-4">Date Uploaded</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-950 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                            PDF
                          </div>
                          <div>
                            <span className="font-bold text-white text-sm block">{report.candidateName || report.originalFileName}</span>
                            <span className="text-xs text-slate-400">{report.originalFileName}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-xs text-slate-300">
                        {report.candidateEmail || 'N/A'}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold ${
                          report.overallScore >= 80 ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                        }`}>
                          {report.overallScore}/100
                        </span>
                      </td>

                      <td className="py-4 px-4 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate('/analysis-result', { state: { reportId: report.id } })}
                            title="View Detailed Analysis"
                            className="p-2 rounded-xl bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-300 hover:text-white transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(report.id)}
                            disabled={deletingId === report.id}
                            title="Delete Report"
                            className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-400 hover:text-red-200 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
