import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { interviewApi, resumeApi } from '../services/api';
import { 
  HelpCircle, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Copy, 
  Cpu, 
  Code2, 
  Filter
} from 'lucide-react';

export const InterviewQuestionsPage = () => {
  const location = useLocation();
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(location.state?.resumeReportId || '');
  const [questions, setQuestions] = useState([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const categoriesList = ['HR', 'Java', 'OOP', 'DBMS', 'SQL', 'Spring Boot', 'Project', 'Behavioral'];
  const [selectedCategories, setSelectedCategories] = useState(['Java', 'Spring Boot', 'OOP', 'DBMS']);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const resResumes = await resumeApi.getUserResumes();
        setResumes(resResumes.data);
        if (!selectedResumeId && resResumes.data.length > 0) {
          setSelectedResumeId(resResumes.data[0].id);
        }
        // Fetch existing questions
        const resQs = await interviewApi.getQuestions({
          resumeReportId: selectedResumeId || undefined,
        });
        setQuestions(resQs.data);
      } catch (err) {
        console.error("Error loading interview data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [selectedResumeId]);

  const handleCategoryToggle = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await interviewApi.generateQuestions({
        resumeReportId: selectedResumeId ? parseInt(selectedResumeId) : null,
        categories: selectedCategories.length > 0 ? selectedCategories : categoriesList,
      });
      setQuestions(res.data.questions);
    } catch (err) {
      console.error("Generate error:", err);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredQuestions = activeCategory === 'ALL'
    ? questions
    : questions.filter(q => q.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <Layout title="Interview Assistant">
      <div className="space-y-8 pb-12">
        {/* Banner */}
        <div className="glass-panel rounded-3xl p-8 border border-amber-500/20 bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-950">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Targeted Q&amp;A + Sample Answers</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Interview Question Generator</h1>
          <p className="text-sm text-slate-400 mt-2 max-w-xl">
            Generate custom technical, HR, OOP, DBMS, SQL, Spring Boot, and project-based interview questions backed by detailed sample answers.
          </p>
        </div>

        {/* Generator Controls */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-base">Question Generator Settings</h3>
              <p className="text-xs text-slate-400">Select candidate resume context and topics</p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none"
              >
                <option value="">-- General Profile (No Resume) --</option>
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.candidateName || r.originalFileName}
                  </option>
                ))}
              </select>

              <button
                onClick={handleGenerate}
                disabled={generating}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin" />
                    <span>Generating via Ollama...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate New Questions</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Category Selector checkboxes */}
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Target Categories</span>
            <div className="flex flex-wrap gap-2">
              {categoriesList.map((cat) => {
                const selected = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryToggle(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selected
                        ? 'bg-amber-950/80 border-amber-500/40 text-amber-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {selected ? '✓ ' : '+ '}{cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-2">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeCategory === 'ALL'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            All Questions ({questions.length})
          </button>
          {categoriesList.map((cat) => {
            const count = questions.filter(q => q.category?.toLowerCase() === cat.toLowerCase()).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Questions Accordion List */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-12 text-center text-slate-500 text-sm animate-pulse">Loading interview bank...</div>
          ) : filteredQuestions.length === 0 ? (
            <div className="py-12 text-center glass-panel rounded-3xl p-8 border border-slate-800">
              <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h4 className="text-base font-bold text-white">No Questions Available</h4>
              <p className="text-xs text-slate-400 mt-1 mb-4">Click "Generate New Questions" above to produce category questions via local Ollama LLM.</p>
            </div>
          ) : (
            filteredQuestions.map((q, idx) => {
              const isExpanded = expandedId === q.id || expandedId === idx;
              return (
                <div
                  key={q.id || idx}
                  className="glass-panel rounded-2xl border border-slate-800 overflow-hidden transition-all duration-200"
                >
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : (q.id || idx))}
                    className="p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-900/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        Q{idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-500/20">
                            {q.category}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            q.difficulty === 'Hard' ? 'bg-red-950 text-red-400' : 'bg-emerald-950 text-emerald-400'
                          }`}>
                            {q.difficulty || 'Medium'}
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-sm md:text-base leading-snug">{q.question}</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(`Q: ${q.question}\n\nA: ${q.sampleAnswer}`, q.id || idx);
                        }}
                        title="Copy Question & Answer"
                        className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        {copiedId === (q.id || idx) ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </div>
                  </div>

                  {/* Sample Answer Expandable Panel */}
                  {isExpanded && (
                    <div className="p-5 bg-slate-900/90 border-t border-slate-800/80 space-y-2">
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">Sample Answer &amp; Technical Explanation</span>
                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{q.sampleAnswer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
};
