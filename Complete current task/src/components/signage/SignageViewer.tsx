import { useState } from 'react';
import SignageOngoing from './SignageOngoing';
import SignageUpcoming from './SignageUpcoming';
import SignageCancelled from './SignageCancelled';
import SignageRescheduled from './SignageRescheduled';
import SignageNoSessions from './SignageNoSessions';
import SignageOffline from './SignageOffline';

type Props = { onBack: () => void };

type Screen = 'ongoing' | 'upcoming' | 'cancelled' | 'rescheduled' | 'nosessions' | 'offline';

const screens: { id: Screen; label: string; color: string }[] = [
  { id: 'ongoing', label: 'Ongoing Now', color: 'bg-green-600' },
  { id: 'upcoming', label: 'Upcoming', color: 'bg-amber-600' },
  { id: 'cancelled', label: 'Cancelled', color: 'bg-red-600' },
  { id: 'rescheduled', label: 'Rescheduled', color: 'bg-violet-600' },
  { id: 'nosessions', label: 'No Sessions', color: 'bg-slate-600' },
  { id: 'offline', label: 'Offline/Updating', color: 'bg-slate-700' },
];

export default function SignageViewer({ onBack }: Props) {
  const [active, setActive] = useState<Screen>('ongoing');

  const renderScreen = () => {
    switch (active) {
      case 'ongoing': return <SignageOngoing />;
      case 'upcoming': return <SignageUpcoming />;
      case 'cancelled': return <SignageCancelled />;
      case 'rescheduled': return <SignageRescheduled />;
      case 'nosessions': return <SignageNoSessions />;
      case 'offline': return <SignageOffline />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Control bar */}
      <div className="flex items-center gap-3 bg-black/95 px-4 py-3 border-b border-white/10 flex-wrap">
        <button onClick={onBack} className="flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10 hover:text-white transition-colors">
          <svg viewBox="0 0 12 12" className="size-3 fill-none stroke-current" strokeWidth="1.5"><path d="M8 10L4 6l4-4" strokeLinecap="round" /></svg>
          Back to Admin
        </button>
        <div className="h-4 w-px bg-white/20" />
        <span className="text-xs text-white/40 font-600 uppercase tracking-wider">Signage Preview</span>
        <div className="flex gap-1.5 flex-wrap">
          {screens.map(s => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`rounded px-3 py-1.5 text-xs font-600 transition-colors ${active === s.id ? `${s.color} text-white` : 'text-white/40 hover:text-white hover:bg-white/10'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Screen */}
      <div className="flex-1 overflow-y-auto">
        {renderScreen()}
      </div>
    </div>
  );
}
