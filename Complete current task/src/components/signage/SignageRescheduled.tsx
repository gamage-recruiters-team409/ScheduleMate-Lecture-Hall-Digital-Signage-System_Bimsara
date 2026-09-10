import SignageHeader from './SignageHeader';
import { sessions } from '../../data/mockData';

const rescheduled = sessions.filter(s => s.status === 'rescheduled');

export default function SignageRescheduled() {
  return (
    <div className="min-h-screen bg-[#0A1020] text-white flex flex-col font-sans">
      <SignageHeader building="New Building" floor="7" side="G" />

      <main className="flex-1 px-10 py-8 flex flex-col">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2.5">
            <span className="size-3 rounded-full bg-violet-400" />
            <h2 className="text-2xl font-800 text-white tracking-tight">Rescheduled Lectures &amp; Labs</h2>
          </div>
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-sm text-violet-400 font-600">{rescheduled.length} rescheduled today</span>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {rescheduled.map(s => (
            <div key={s.id} className="rounded-2xl border border-violet-500/30 bg-violet-950/30 p-7 flex flex-col gap-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-violet-500 rounded-l-2xl" />

              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/50 bg-violet-500/15 px-4 py-1.5 text-sm font-700 text-violet-400">
                  <svg viewBox="0 0 12 12" className="size-3"><path d="M1 6a5 5 0 0 0 9 3M11 6a5 5 0 0 0-9-3" stroke="#A78BFA" fill="none" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  Rescheduled
                </span>
                <span className="font-mono text-sm text-white/40">{s.type}</span>
              </div>

              <div>
                <p className="font-mono text-5xl font-800 text-white leading-none tracking-tight">{s.room}</p>
                <p className="text-white/30 text-sm mt-1">{s.building} · Floor {s.floor} · {s.side} Side</p>
              </div>

              <div>
                <p className="font-mono text-base font-700 text-violet-400">{s.module}</p>
                <p className="text-xl font-700 text-white leading-snug mt-0.5">{s.moduleName}</p>
                <p className="text-white/50 text-sm mt-1">{s.lecturer}</p>
              </div>

              {/* Original → New */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-xs font-700 uppercase tracking-wider text-white/30 w-16 shrink-0 pt-0.5">Original</span>
                  <div>
                    <p className="font-mono text-white/40 text-sm line-through">{s.rescheduleFrom} · {s.start}–{s.end}</p>
                    <p className="text-white/30 text-xs">Room {s.room}</p>
                  </div>
                </div>
                <div className="h-px bg-white/10" />
                <div className="flex items-start gap-3">
                  <span className="text-xs font-700 uppercase tracking-wider text-violet-400 w-16 shrink-0 pt-0.5">New Time</span>
                  <div>
                    <p className="font-mono text-violet-300 text-lg font-800">{s.newDate} · {s.newStart}–{s.newEnd}</p>
                    {s.newRoom && s.newRoom !== s.room && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-xs text-violet-400 font-600 uppercase tracking-wider">New Room</span>
                        <span className="font-mono text-violet-300 font-700">{s.newRoom}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="px-10 py-4 border-t border-white/10 flex items-center justify-between">
        <p className="text-xs text-white/25">This slide appears only when rescheduled sessions are available.</p>
        <p className="text-xs text-white/25 font-mono">DSP-NB-07G · ScheduleMate v2.4.1</p>
      </footer>
    </div>
  );
}
