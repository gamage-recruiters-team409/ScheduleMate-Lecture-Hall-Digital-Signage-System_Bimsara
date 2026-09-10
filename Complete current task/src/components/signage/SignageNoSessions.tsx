import SignageHeader from './SignageHeader';
import { rooms } from '../../data/mockData';

const available = rooms.filter(r => r.building === 'main' && r.floor === 5).length;

export default function SignageNoSessions() {
  return (
    <div className="min-h-screen bg-[#0A1020] text-white flex flex-col font-sans">
      <SignageHeader building="Main Building" floor="5" side="B" />

      <main className="flex-1 flex flex-col items-center justify-center px-10 text-center gap-10">
        {/* Icon */}
        <div className="flex size-24 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
          <svg viewBox="0 0 48 48" className="size-12 fill-none stroke-white/30" strokeWidth="2">
            <rect x="6" y="10" width="36" height="30" rx="3" />
            <path d="M16 6v8M32 6v8M6 20h36" strokeLinecap="round" />
          </svg>
        </div>

        {/* Message */}
        <div>
          <h2 className="text-5xl font-800 text-white leading-tight">No Ongoing Sessions Right Now</h2>
          <p className="text-xl text-white/40 mt-4 font-400">All rooms on this floor are currently available.</p>
        </div>

        {/* Availability summary */}
        <div className="grid grid-cols-3 gap-5 w-full max-w-2xl">
          {[
            { label: 'Rooms Available', value: available, color: 'text-teal-400', border: 'border-teal-500/30 bg-teal-950/30' },
            { label: 'Next Session At', value: '10:30', color: 'text-amber-400', border: 'border-amber-500/30 bg-amber-950/30' },
            { label: 'Sessions Today', value: 6, color: 'text-blue-400', border: 'border-blue-500/30 bg-blue-950/30' },
          ].map(c => (
            <div key={c.label} className={`rounded-2xl border ${c.border} p-6 text-center`}>
              <p className={`text-5xl font-800 ${c.color} leading-none`}>{c.value}</p>
              <p className="text-sm text-white/40 mt-2 font-500">{c.label}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="px-10 py-4 border-t border-white/10 flex items-center justify-between">
        <p className="text-xs text-white/25">Automatically updates every 30 seconds</p>
        <p className="text-xs text-white/25 font-mono">DSP-MB-05B · ScheduleMate v2.4.1</p>
      </footer>
    </div>
  );
}
