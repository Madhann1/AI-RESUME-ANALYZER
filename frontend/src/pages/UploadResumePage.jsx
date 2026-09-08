import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { resumeApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Sparkles, Cpu, ShieldCheck } from 'lucide-react';

export const UploadResumePage = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0); // 0: Idle, 1: Reading PDF, 2: Running Ollama LLM, 3: Saving
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError('');
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Invalid file format. Please upload a PDF document.');
      setFile(null);
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB maximum limit.');
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setError('');
    setLoading(true);
    setStep(1);

    const formData = new FormData();
    formData.append('file', file);

    try {
      setTimeout(() => setStep(2), 1200);
      const res = await resumeApi.uploadResume(formData);
      setStep(3);
      setTimeout(() => {
        navigate('/analysis-result', { state: { report: res.data } });
      }, 800);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || 'Failed to analyze resume PDF. Ensure local Ollama is running.');
      setLoading(false);
      setStep(0);
    }
  };

  return (
    <Layout title="Upload Resume">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Banner */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Apache PDFBox + Ollama LLM</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Resume Evaluation</h1>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Upload your resume PDF to extract detailed skills, education, project breakdown, category scores (0-100), and personalized improvement suggestions.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-950/50 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Upload Card / Processing State */}
        <div className="glass-panel rounded-3xl p-8 border border-slate-800 relative">
          {loading ? (
            <div className="py-12 text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 animate-pulse">
                <Cpu className="w-10 h-10 animate-spin" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Analyzing Resume via Local AI</h3>
                <p className="text-sm text-slate-400 mt-1">Please wait while the Ollama LLM processes your document...</p>
              </div>

              {/* Progress Steps */}
              <div className="max-w-md mx-auto space-y-3 pt-4 text-left">
                <div className={`p-3 rounded-xl flex items-center gap-3 border ${step >= 1 ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                  <CheckCircle2 className={`w-5 h-5 ${step >= 1 ? 'text-indigo-400' : 'text-slate-600'}`} />
                  <span className="text-xs font-semibold">1. Extracting PDF text with Apache PDFBox</span>
                </div>
                <div className={`p-3 rounded-xl flex items-center gap-3 border ${step >= 2 ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                  <CheckCircle2 className={`w-5 h-5 ${step >= 2 ? 'text-indigo-400' : 'text-slate-600'}`} />
                  <span className="text-xs font-semibold">2. Evaluating candidate profile using Ollama LLM</span>
                </div>
                <div className={`p-3 rounded-xl flex items-center gap-3 border ${step >= 3 ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                  <CheckCircle2 className={`w-5 h-5 ${step >= 3 ? 'text-indigo-400' : 'text-slate-600'}`} />
                  <span className="text-xs font-semibold">3. Calculating scores &amp; storing MySQL report</span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dropzone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-200 cursor-pointer ${
                  dragActive
                    ? 'border-indigo-500 bg-indigo-950/20 scale-[1.01]'
                    : file
                    ? 'border-emerald-500/50 bg-emerald-950/10'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
                }`}
                onClick={() => document.getElementById('resume-file-input').click()}
              >
                <input
                  id="resume-file-input"
                  type="file"
                  accept=".pdf"
                  onChange={handleChange}
                  className="hidden"
                />

                {file ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">{file.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{(file.size / (1024 * 1024)).toFixed(2)} MB • PDF Document</p>
                    </div>
                    <span className="inline-block text-xs text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full">
                      Ready to Analyze
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                      <UploadCloud className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">Drag &amp; drop your PDF resume here</h4>
                      <p className="text-xs text-slate-400 mt-1">or click to browse your file system (PDF only, max 10MB)</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={!file || loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-5 h-5" />
                <span>Start AI Analysis</span>
              </button>
            </form>
          )}
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-300">100% Local LLM Privacy</span>
          </div>
          <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-300">Apache PDFBox Parser</span>
          </div>
          <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-300">Category Score Breakdown</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};
