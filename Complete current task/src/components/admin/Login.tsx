import { useState } from 'react';

type Props = { onLogin: () => void };

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    setTimeout(() => {
      if (email === 'admin@sparkline.ac' && password === 'admin') {
        onLogin();
      } else {
        setError(true);
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-full flex bg-[#F8F9FC] font-sans">
      {/* Left panel */}
      <div className="hidden lg:flex w-[480px] flex-col bg-[#0F1729] text-white p-12 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-blue-800/10 blur-3xl translate-x-1/2 translate-y-1/2" />
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3 mb-16">
          <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500">
            <svg viewBox="0 0 20 20" className="size-5 fill-white">
              <rect x="2" y="2" width="7" height="7" rx="1.5" />
              <rect x="11" y="2" width="7" height="7" rx="1.5" />
              <rect x="2" y="11" width="7" height="7" rx="1.5" />
              <rect x="11" y="11" width="3" height="7" rx="1" />
              <rect x="15" y="11" width="3" height="3" rx="0.75" />
              <rect x="15" y="15" width="3" height="3" rx="0.75" />
            </svg>
          </div>
          <span className="text-lg font-700 tracking-tight">ScheduleMate</span>
        </div>

        <div className="relative mt-auto">
          <h2 className="text-2xl font-700 leading-snug mb-4">Lecture Hall Digital Signage Management</h2>
          <p className="text-white/50 text-sm leading-relaxed mb-10">
            Centralised scheduling, live status monitoring, and digital display management for Sparkline Academy.
          </p>

          {/* Feature list */}
          <ul className="space-y-3">
            {[
              'Real-time session status across all buildings',
              'Automated digital signage for every floor',
              'Instant cancellation and reschedule propagation',
            ].map(f => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-white/60">
                <svg viewBox="0 0 16 16" className="mt-0.5 size-4 shrink-0 fill-blue-400"><path d="M13.5 4.5L6.5 11.5 2.5 7.5" stroke="#60A5FA" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative mt-12 text-[11px] text-white/25">© 2026 Sparkline Academy · v2.4.1</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2.5 mb-10">
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600">
              <svg viewBox="0 0 16 16" className="size-4 fill-white"><rect x="1" y="1" width="6" height="6" rx="1" /><rect x="9" y="1" width="6" height="6" rx="1" /><rect x="1" y="9" width="6" height="6" rx="1" /><rect x="9" y="9" width="2.5" height="6" rx="0.75" /><rect x="12.5" y="9" width="2.5" height="2.5" rx="0.5" /><rect x="12.5" y="12.5" width="2.5" height="2.5" rx="0.5" /></svg>
            </div>
            <span className="text-base font-700 text-slate-900">ScheduleMate</span>
          </div>

          <h1 className="text-2xl font-700 text-slate-900 mb-1">Administrator Sign In</h1>
          <p className="text-sm text-slate-500 mb-8">Access the ScheduleMate management console.</p>

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <svg viewBox="0 0 16 16" className="mt-0.5 size-4 shrink-0 fill-red-500"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 5zm0 6.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z" /></svg>
              <div>
                <p className="text-sm font-600 text-red-700">Invalid credentials</p>
                <p className="text-xs text-red-600 mt-0.5">The email or password you entered is incorrect. Please try again.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-600 uppercase tracking-wide text-slate-600 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(false); }}
                placeholder="admin@sparkline.ac"
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'}`}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-600 uppercase tracking-wide text-slate-600 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(false); }}
                  placeholder="••••••••"
                  className={`w-full rounded-lg border px-3.5 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPw
                    ? <svg viewBox="0 0 16 16" className="size-4 fill-none stroke-current" strokeWidth="1.3"><path d="M1 8S3.5 3 8 3s7 5 7 5-2.5 5-7 5-7-5-7-5z" /><circle cx="8" cy="8" r="2" /></svg>
                    : <svg viewBox="0 0 16 16" className="size-4 fill-none stroke-current" strokeWidth="1.3"><path d="M2 2l12 12M6.9 6.1A2 2 0 0 0 10 9.2M4.3 4.5C2.5 5.7 1 8 1 8s2.5 5 7 5c1.5 0 2.9-.5 4-1.3" /><path d="M13 11.5C14.5 10.2 15 8 15 8S12.5 3 8 3c-.7 0-1.4.1-2 .3" /></svg>
                  }
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-600 text-white hover:bg-blue-700 active:scale-[0.99] transition-all disabled:opacity-70"
            >
              {loading ? (
                <>
                  <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="3" /><path className="opacity-75" d="M4 12a8 8 0 0 1 8-8" stroke="white" strokeWidth="3" strokeLinecap="round" /></svg>
                  Signing in…
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] text-slate-400">
            Demo: admin@sparkline.ac / admin
          </p>
        </div>
      </div>
    </div>
  );
}
