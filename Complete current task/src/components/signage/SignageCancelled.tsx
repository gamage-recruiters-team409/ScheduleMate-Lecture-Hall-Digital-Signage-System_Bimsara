import SignageHeader from './SignageHeader';
import { sessions } from '../../data/mockData';

const cancelled = sessions.filter(s => s.status === 'cancelled');

export default function SignageCancelled() {
  return (
    <div className="min-h-screen bg-[#0A1020] text-white flex flex-col font-sans">
      <SignageHeader building="Main Building" floor="8" side="A" />

      <main className="flex-1 px-10 py-8 flex flex-col">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2.5">
            <span className="size-3 rounded-full bg-red-400" />
            <h2 className="text-2xl font-800 text-white tracking-tight">Cancelled Lectures &amp; Labs</h2>
          </div>
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-sm text-red-400 font-600">{cancelled.length} cancellation{cancelled.length !== 1 ? 's' : ''} today</span>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {cancelled.map(s => (
            <div key={s.id} className="rounded-2xl border border-red-500/30 bg-red-950/30 p-7 flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500 rounded-l-2xl" />

              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full border border-red-500/50 bg-red-500/15 px-4 py-1.5 text-sm font-700 text-red-400">
                  <svg viewBox="0 0 12 12" className="size-3"><path d="M9 3L3 9M3 3l6 6" stroke="#F87171" fill="none" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  Cancelled
                </span>
                <span className="font-mono text-sm text-white/40">{s.type}</span>
              </div>

              <div>
                <p className="font-mono text-5xl font-800 text-red-300/60 leading-none tracking-tight line-through decoration-red-500/60">{s.room}</p>
                <p className="text-white/30 text-sm font-500 mt-1">Floor {s.floor} · {s.side} Side · {s.building}</p>
              </div>

              <div className="h-px bg-white/10" />

              <div>
                <p className="font-mono text-base font-700 text-red-400/70 line-through">{s.module}</p>
                <p className="text-lg font-700 text-white/60 leading-snug mt-0.5 line-through">{s.moduleName}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-white/40 text-xs font-600 uppercase tracking-wider mb-1">Lecturer</p>
                  <p className="text-white/60 font-600 text-sm">{s.lecturer}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs font-600 uppercase tracking-wider mb-1">Was Scheduled</p>
                  <p className="font-mono text-white/60 font-700 text-lg">{s.start}–{s.end}</p>
                </div>
              </div>

              {s.cancelReason && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5">
                  <p className="text-xs text-white/40 uppercase tracking-wider font-600 mb-0.5">Reason</p>
                  <p className="text-sm text-red-300">{s.cancelReason}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <footer className="px-10 py-4 border-t border-white/10 flex items-center justify-between">
        <p className="text-xs text-white/25">This slide appears only when cancellations are available.</p>
        <p className="text-xs text-white/25 font-mono">DSP-MB-08A · ScheduleMate v2.4.1</p>
      </footer>
    </div>
  );
}
