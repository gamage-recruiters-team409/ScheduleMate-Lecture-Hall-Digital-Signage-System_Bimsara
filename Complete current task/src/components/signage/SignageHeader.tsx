import SignageClock from './SignageClock';

type Props = { building: string; floor: string; side: string };

export default function SignageHeader({ building, floor, side }: Props) {
  return (
    <header className="flex items-start justify-between px-10 pt-8 pb-6 border-b border-white/10">
      <div className="flex items-center gap-5">
        {/* Logo */}
        <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500 shrink-0">
          <svg viewBox="0 0 20 20" className="size-7 fill-white">
            <rect x="2" y="2" width="7" height="7" rx="1.5" />
            <rect x="11" y="2" width="7" height="7" rx="1.5" />
            <rect x="2" y="11" width="7" height="7" rx="1.5" />
            <rect x="11" y="11" width="3" height="7" rx="1" />
            <rect x="15" y="11" width="3" height="3" rx="0.75" />
            <rect x="15" y="15" width="3" height="3" rx="0.75" />
          </svg>
        </div>
        <div>
          <p className="text-white/40 text-xs font-600 uppercase tracking-widest mb-0.5">ScheduleMate</p>
          <h1 className="text-2xl font-800 text-white leading-tight">{building} · Floor {floor} · {side} Side</h1>
          <p className="text-white/40 text-sm font-500 mt-0.5">Sparkline Academy</p>
        </div>
      </div>
      <SignageClock />
    </header>
  );
}
