import type { SessionStatus } from '../../data/mockData';

const configs: Record<string, { label: string; dot: string; bg: string; text: string; border: string }> = {
  ongoing: { label: 'Ongoing Now', dot: 'bg-green-500', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  available: { label: 'Available', dot: 'bg-teal-500', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  upcoming: { label: 'Upcoming Soon', dot: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  cancelled: { label: 'Cancelled', dot: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  rescheduled: { label: 'Rescheduled', dot: 'bg-violet-500', bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  completed: { label: 'Completed', dot: 'bg-slate-400', bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200' },
  scheduled: { label: 'Scheduled', dot: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
};

type Props = { status: SessionStatus | string; size?: 'sm' | 'md' };

export default function StatusBadge({ status, size = 'md' }: Props) {
  const cfg = configs[status] ?? configs.scheduled;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${cfg.bg} ${cfg.text} ${cfg.border} ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}`}
    >
      <span className={`size-1.5 rounded-full ${cfg.dot} shrink-0`} />
      {cfg.label}
    </span>
  );
}

export function RoomTypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    'Lecture Room': 'bg-blue-50 text-blue-700 border-blue-200',
    'Laboratory': 'bg-purple-50 text-purple-700 border-purple-200',
    'Large Lecture Hall': 'bg-orange-50 text-orange-700 border-orange-200',
  };
  return (
    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${map[type] ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}>
      {type}
    </span>
  );
}

export function FloorTypeBadge({ type }: { type: 'standard' | 'full-lab' | 'large-hall' }) {
  const map = {
    standard: 'bg-slate-50 text-slate-600 border-slate-200',
    'full-lab': 'bg-purple-50 text-purple-700 border-purple-200',
    'large-hall': 'bg-orange-50 text-orange-700 border-orange-200',
  };
  const labels = { standard: 'Standard', 'full-lab': 'Full Lab Floor', 'large-hall': 'Large Lecture Hall' };
  return (
    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${map[type]}`}>
      {labels[type]}
    </span>
  );
}
