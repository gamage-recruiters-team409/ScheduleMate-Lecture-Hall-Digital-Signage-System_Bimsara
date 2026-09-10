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

        {/* Cards */}
        <div className={`grid gap-5 flex-1 ${ongoing.length === 1 ? 'grid-cols-1 max-w-xl' : ongoing.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {ongoing.map(s => (
            <div key={s.id} className="rounded-2xl border border-green-500/30 bg-green-950/40 p-7 flex flex-col gap-4 relative overflow-hidden">
              {/* Green glow */}
              <div className="absolute top-0 left-0 w-1 h-full bg-green-500 rounded-l-2xl" />

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full border border-green-500/40 bg-green-500/20 px-4 py-1.5 text-sm font-700 text-green-400">
                  <span className="size-2 rounded-full bg-green-400 animate-pulse" />
                  Ongoing Now
                </span>
                <span className="font-mono text-sm text-white/40">{s.type}</span>
              </div>

              {/* Room code – prominent */}
              <div>
                <p className="font-mono text-6xl font-800 text-white leading-none tracking-tight">{s.room}</p>
                <p className="text-white/30 text-sm font-500 mt-1">Floor {s.floor} · {s.side} Side · {s.building === 'Main Building' ? 'Main Building' : 'New Building'}</p>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/10" />

              {/* Module */}
              <div>
                <p className="font-mono text-lg font-700 text-green-400">{s.module}</p>
                <p className="text-xl font-700 text-white leading-snug mt-0.5">{s.moduleName}</p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3 mt-auto">
                <div>
                  <p className="text-white/40 text-xs font-600 uppercase tracking-wider mb-1">Lecturer</p>
                  <p className="text-white font-600 text-sm">{s.lecturer}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs font-600 uppercase tracking-wider mb-1">Time</p>
                  <p className="font-mono text-white font-700 text-lg">{s.start}<span className="text-white/50">–</span>{s.end}</p>
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
