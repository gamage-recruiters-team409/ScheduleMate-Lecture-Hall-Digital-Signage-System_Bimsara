import SignageHeader from './SignageHeader';
import { sessions } from '../../data/mockData';

const ongoing = sessions.filter(s => s.status === 'ongoing' && s.floor === 5 && s.side === 'A' && s.buildingShort === 'Main');

export default function SignageOngoing() {
  return (
    <div className="min-h-screen bg-[#0A1020] text-white flex flex-col font-sans">
      <SignageHeader building="Main Building" floor="5" side="A" />

      <main className="flex-1 px-10 py-8 flex flex-col">
        {/* Section title */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2.5">
            <span className="size-3 rounded-full bg-green-400 animate-pulse" />
            <h2 className="text-2xl font-800 text-white tracking-tight">Ongoing Lectures &amp; Labs</h2>
          </div>
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-sm text-white/40 font-600">{ongoing.length} session{ongoing.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Cards - Enlarged for High-Visibility Digital Signage */}
        <div className={`grid gap-7 flex-1 ${ongoing.length === 1 ? 'grid-cols-1 max-w-2xl' : ongoing.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {ongoing.map(s => (
            <div key={s.id} className="rounded-3xl border-2 border-green-500/40 bg-gradient-to-b from-green-950/60 to-[#0A1A14]/80 p-9 lg:p-10 flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-green-950/50 min-h-[480px]">
              {/* Green glow accent */}
              <div className="absolute top-0 left-0 w-2 h-full bg-green-400 rounded-l-3xl shadow-[0_0_20px_rgba(74,222,128,0.6)]" />

              {/* Status & Type */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2.5 rounded-full border border-green-400/50 bg-green-500/25 px-5 py-2 text-base font-extrabold text-green-300 tracking-wide shadow-sm">
                  <span className="size-3 rounded-full bg-green-400 animate-ping" />
                  Ongoing Now
                </span>
                <span className="font-mono text-base font-semibold px-3.5 py-1 rounded-lg bg-white/5 text-white/60 border border-white/10">{s.type}</span>
              </div>

              {/* Room code – Very prominent */}
              <div className="my-2">
                <p className="font-mono text-7xl lg:text-8xl font-black text-white leading-none tracking-tight drop-shadow-md">{s.room}</p>
                <p className="text-white/40 text-base font-semibold mt-2">Floor {s.floor} · {s.side} Side · {s.building === 'Main Building' ? 'Main Building' : 'New Building'}</p>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/15 my-1" />

              {/* Module */}
              <div className="space-y-1.5">
                <p className="font-mono text-xl lg:text-2xl font-black text-green-400 tracking-wide">{s.module}</p>
                <p className="text-2xl lg:text-3xl font-extrabold text-white leading-snug">{s.moduleName}</p>
              </div>

              {/* Details (Lecturer & Time) */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 mt-auto">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1.5">Lecturer</p>
                  <p className="text-white font-bold text-base lg:text-lg leading-tight">{s.lecturer}</p>
                </div>
                <div className="bg-green-500/10 rounded-2xl p-4 border border-green-500/20">
                  <p className="text-green-300/70 text-xs font-bold uppercase tracking-wider mb-1.5">Scheduled Time</p>
                  <p className="font-mono text-white font-extrabold text-xl lg:text-2xl">{s.start}<span className="text-green-400 mx-1">–</span>{s.end}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-10 py-4 border-t border-white/10 flex items-center justify-between">
        <p className="text-xs text-white/25">Automatically updates every 30 seconds</p>
        <p className="text-xs text-white/25 font-mono">DSP-MB-05A · ScheduleMate v2.4.1</p>
      </footer>
    </div>
  );
}
