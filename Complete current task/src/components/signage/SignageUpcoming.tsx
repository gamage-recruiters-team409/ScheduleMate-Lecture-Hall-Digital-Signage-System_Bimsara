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

        <div className="grid grid-cols-2 gap-6 flex-1">
          {upcoming.map(s => (
            <div key={s.id} className="rounded-3xl border-2 border-amber-500/35 bg-gradient-to-b from-amber-950/40 to-[#1A1208]/70 p-8 lg:p-9 flex flex-col justify-between relative overflow-hidden shadow-2xl min-h-[420px]">
              <div className="absolute top-0 left-0 w-2 h-full bg-amber-400 rounded-l-3xl shadow-[0_0_15px_rgba(251,191,36,0.5)]" />

              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2.5 rounded-full border border-amber-500/50 bg-amber-500/25 px-4.5 py-1.5 text-base font-extrabold text-amber-300">
                  <span className="size-2.5 rounded-full bg-amber-400 animate-ping" />
                  Upcoming Soon
                </span>
                <span className="font-mono text-base font-semibold px-3 py-1 rounded-lg bg-white/5 text-white/60 border border-white/10">{s.type}</span>
              </div>

              <div className="my-1">
                <p className="font-mono text-6xl lg:text-7xl font-black text-white leading-none tracking-tight">{s.room}</p>
                <p className="text-white/40 text-sm font-semibold mt-1.5">Floor {s.floor} · {s.side} Side</p>
              </div>

              <div className="h-px bg-white/10" />

              <div className="space-y-1">
                <p className="font-mono text-lg lg:text-xl font-black text-amber-400">{s.module}</p>
                <p className="text-xl lg:text-2xl font-extrabold text-white leading-snug">{s.moduleName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 mt-auto">
                <div className="bg-white/5 rounded-2xl p-3.5 border border-white/5">
                  <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Lecturer</p>
                  <p className="text-white font-bold text-base">{s.lecturer}</p>
                </div>
                <div className="bg-amber-500/10 rounded-2xl p-3.5 border border-amber-500/20">
                  <p className="text-amber-300/70 text-xs font-bold uppercase tracking-wider mb-1">Starts At</p>
                  <p className="font-mono text-amber-300 font-black text-2xl lg:text-3xl">{s.start}</p>
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
