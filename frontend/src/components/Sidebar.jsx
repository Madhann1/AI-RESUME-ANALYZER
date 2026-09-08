import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UploadCloud, 
  Briefcase, 
  HelpCircle, 
  FileText, 
  User as UserIcon,
  LogOut,
  Sparkles,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Upload Resume', path: '/upload', icon: UploadCloud },
    { label: 'Job Description Match', path: '/job-match', icon: Briefcase },
    { label: 'Interview Prep', path: '/interview-questions', icon: HelpCircle },
    { label: 'Report History', path: '/history', icon: FileText },
    { label: 'Profile', path: '/profile', icon: UserIcon },
  ];

  return (
    <aside className="w-64 h-screen glass-panel sticky top-0 flex flex-col z-30 border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/80">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white leading-tight tracking-tight">AI Resume</h1>
          <span className="text-xs text-indigo-400 font-medium">Assistant &amp; Evaluator</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Local AI Badge */}
      <div className="p-4 mx-3 mb-3 glass-card rounded-2xl border border-indigo-500/20 bg-indigo-950/20">
        <div className="flex items-center gap-2 mb-1.5">
          <Award className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-300">Local Ollama Engine</span>
        </div>
        <p className="text-[11px] text-slate-400">100% Private &amp; Free AI processing via local LLM.</p>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 font-bold text-sm shrink-0">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="truncate">
            <p className="text-sm font-semibold text-slate-200 truncate">{user?.fullName || 'User'}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          title="Sign Out"
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
