import SignageHeader from './SignageHeader';
import { sessions } from '../../data/mockData';

const upcoming = sessions.filter(s => (s.status === 'upcoming' || s.status === 'scheduled') && s.buildingShort === 'Main').slice(0, 4);

export default function SignageUpcoming() {
  return (
    <div className="min-h-screen bg-[#0A1020] text-white flex flex-col font-sans">
      <SignageHeader building="Main Building" floor="5" side="A" />

      <main className="flex-1 px-10 py-8 flex flex-col">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2.5">
            <span className="size-3 rounded-full bg-amber-400" />
            <h2 className="text-2xl font-800 text-white tracking-tight">Upcoming Lectures &amp; Labs</h2>
          </div>
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-sm text-white/40 font-600">{upcoming.length} upcoming</span>
        </div>

        <div className="grid grid-cols-2 gap-5 flex-1">
          {upcoming.map(s => (
            <div key={s.id} className="rounded-2xl border border-amber-500/25 bg-amber-950/30 p-7 flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-400 rounded-l-2xl" />

              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/15 px-4 py-1.5 text-sm font-700 text-amber-400">
                  <span className="size-2 rounded-full bg-amber-400" />
                  Upcoming Soon
                </span>
                <span className="font-mono text-sm text-white/40">{s.type}</span>
              </div>

              <div>
                <p className="font-mono text-5xl font-800 text-white leading-none tracking-tight">{s.room}</p>
                <p className="text-white/30 text-sm font-500 mt-1">Floor {s.floor} · {s.side} Side</p>
              </div>

              <div className="h-px bg-white/10" />

              <div>
                <p className="font-mono text-base font-700 text-amber-400">{s.module}</p>
                <p className="text-lg font-700 text-white leading-snug mt-0.5">{s.moduleName}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-auto">
                <div>
                  <p className="text-white/40 text-xs font-600 uppercase tracking-wider mb-1">Lecturer</p>
                  <p className="text-white font-600 text-sm">{s.lecturer}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs font-600 uppercase tracking-wider mb-1">Starts At</p>
                  <p className="font-mono text-amber-300 font-800 text-2xl">{s.start}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="px-10 py-4 border-t border-white/10 flex items-center justify-between">
        <p className="text-xs text-white/25">Automatically updates every 30 seconds</p>
        <p className="text-xs text-white/25 font-mono">DSP-MB-05A · ScheduleMate v2.4.1</p>
      </footer>
    </div>
  );
}
