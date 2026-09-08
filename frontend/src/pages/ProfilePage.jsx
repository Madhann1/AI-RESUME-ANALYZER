import React from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { User, Mail, ShieldCheck, Calendar, Key, Cpu, Sparkles } from 'lucide-react';

export const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <Layout title="User Profile">
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        {/* Banner */}
        <div className="glass-panel rounded-3xl p-8 border border-slate-800 bg-gradient-to-r from-indigo-950/30 via-slate-900 to-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-xl shadow-indigo-600/30">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">{user?.fullName || 'User Profile'}</h1>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" /> {user?.email}
              </p>
            </div>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            {user?.role || 'ROLE_USER'}
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" />
              <span>Account Credentials</span>
            </h3>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider block">Full Name</span>
                <p className="text-sm font-semibold text-slate-200 mt-0.5">{user?.fullName}</p>
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider block">Email Address</span>
                <p className="text-sm font-semibold text-slate-200 mt-0.5">{user?.email}</p>
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider block">Member Since</span>
                <p className="text-sm font-semibold text-slate-200 mt-0.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Member'}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Security &amp; Local AI Architecture</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <Key className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white">BCrypt Hashed Password</span>
                  <p className="text-[11px] text-slate-400">Passwords stored securely in MySQL with 10 salt rounds</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <Cpu className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white">Ollama Local Execution</span>
                  <p className="text-[11px] text-slate-400">All prompts processed locally via http://localhost:11434</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <Sparkles className="w-5 h-5 text-purple-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white">Stateless JWT Bearer Token</span>
                  <p className="text-[11px] text-slate-400">24-hour expiration token stored in authorization headers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
