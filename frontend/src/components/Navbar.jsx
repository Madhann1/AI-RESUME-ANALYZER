import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Cpu } from 'lucide-react';

export const Navbar = ({ title }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 glass-panel sticky top-0 z-20 px-8 flex items-center justify-between border-b border-slate-800">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          <Cpu className="w-3.5 h-3.5 animate-pulse" />
          <span>Ollama Active</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>JWT Authenticated</span>
        </div>
      </div>
    </header>
  );
};
