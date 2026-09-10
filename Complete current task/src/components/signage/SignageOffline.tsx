import SignageHeader from './SignageHeader';

export default function SignageOffline() {
  return (
    <div className="min-h-screen bg-[#0A1020] text-white flex flex-col font-sans">
      <SignageHeader building="New Building" floor="12" side="G" />

      <main className="flex-1 flex flex-col items-center justify-center px-10 text-center gap-8">
        {/* Spinner / icon */}
        <div className="relative flex size-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 rounded-full border-2 border-t-white/40 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          <svg viewBox="0 0 32 32" className="size-10 fill-none stroke-white/30" strokeWidth="1.5">
            <path d="M16 4a12 12 0 0 1 12 12M4 16a12 12 0 0 0 12 12" strokeLinecap="round" />
            <path d="M12 16h4v-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div>
          <h2 className="text-5xl font-800 text-white leading-tight">Updating Schedule Information</h2>
          <p className="text-xl text-white/40 mt-4">The latest schedule will appear shortly.</p>
        </div>

        {/* Status card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 px-10 py-6 w-full max-w-lg space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/40">Last successful update</span>
            <span className="font-mono text-white font-600">2026-09-06 17:23</span>
          </div>
          <div className="h-px bg-white/10" />
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/40">Display device</span>
            <span className="font-mono text-white/60">DSP-NB-12G</span>
          </div>
          <div className="h-px bg-white/10" />
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/40">Status</span>
            <span className="flex items-center gap-2 text-amber-400 font-600 text-sm">
              <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
              Reconnecting…
            </span>
          </div>
        </div>

        <p className="text-white/20 text-sm">Contact IT Support if this message persists for more than 5 minutes.</p>
      </main>

      <footer className="px-10 py-4 border-t border-white/10 flex items-center justify-between">
        <p className="text-xs text-white/25">ScheduleMate Digital Signage · Sparkline Academy</p>
        <p className="text-xs text-white/25 font-mono">DSP-NB-12G</p>
      </footer>
    </div>
  );
}
