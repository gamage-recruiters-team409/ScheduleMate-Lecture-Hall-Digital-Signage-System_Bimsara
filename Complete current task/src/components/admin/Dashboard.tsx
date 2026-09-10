import { sessions, rooms, displays, auditLog } from '../../data/mockData';
import StatusBadge from '../ui/StatusBadge';

type Props = { onNavigate: (page: string) => void };

const ongoing = sessions.filter(s => s.status === 'ongoing').length;
const cancelled = sessions.filter(s => s.status === 'cancelled').length;
const available = rooms.length - sessions.filter(s => s.status === 'ongoing').length;
const activeDisplays = displays.filter(d => d.active).length;

const kpis = [
  { label: 'Total Rooms', value: rooms.length, icon: '🏛', color: 'bg-slate-50 border-slate-200' },
  { label: "Today's Sessions", value: sessions.filter(s => s.date === '2026-09-07').length, icon: '📋', color: 'bg-blue-50 border-blue-200' },
  { label: 'Ongoing Now', value: ongoing, icon: '▶', color: 'bg-green-50 border-green-200', text: 'text-green-700' },
  { label: 'Available Rooms', value: available, icon: '✓', color: 'bg-teal-50 border-teal-200', text: 'text-teal-700' },
  { label: 'Cancelled Today', value: cancelled, icon: '✕', color: 'bg-red-50 border-red-200', text: 'text-red-700' },
  { label: 'Active Displays', value: activeDisplays, icon: '🖥', color: 'bg-purple-50 border-purple-200' },
];

export default function Dashboard({ onNavigate }: Props) {
  const todaySessions = sessions.filter(s => s.date === '2026-09-07').slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-700 text-slate-900">Good morning, Admin</h2>
          <p className="text-sm text-slate-500 mt-0.5">Monday, 7 September 2026 · Sparkline Academy</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onNavigate('schedules')} className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-600 text-slate-700 hover:bg-slate-50 transition-colors">
            <svg viewBox="0 0 16 16" className="size-3.5 fill-none stroke-current" strokeWidth="1.5"><circle cx="8" cy="8" r="6.5" /><path d="M8 5v3l2 2" strokeLinecap="round" /></svg>
            Create Session
          </button>
          <button onClick={() => onNavigate('rooms')} className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-600 text-white hover:bg-blue-700 transition-colors">
            <svg viewBox="0 0 16 16" className="size-3.5 fill-white" strokeWidth="1.5"><path d="M8 3v10M3 8h10" stroke="white" fill="none" strokeWidth="2" strokeLinecap="round" /></svg>
            Add Room
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-4">
        {kpis.map(kpi => (
          <div key={kpi.label} className={`rounded-xl border bg-white p-5 flex items-center gap-4`}>
            <div className={`flex size-11 items-center justify-center rounded-xl border ${kpi.color} text-xl`}>
              {kpi.icon}
            </div>
            <div>
              <p className={`text-2xl font-800 leading-none ${kpi.text ?? 'text-slate-900'}`}>{kpi.value}</p>
              <p className="text-xs text-slate-500 mt-1 font-500">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-[1fr_320px] gap-4">
        {/* Today's Schedule */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-700 text-slate-900">Today's Schedule</h3>
            <button onClick={() => onNavigate('schedules')} className="text-xs text-blue-600 hover:text-blue-700 font-600">View All →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-5 py-2.5 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Module</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Lecturer</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Room</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Time</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {todaySessions.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-600 text-slate-900">{s.module}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[180px]">{s.moduleName}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{s.lecturer}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded font-600 text-slate-700">{s.room}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 font-mono">{s.start}–{s.end}</td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side panels */}
        <div className="space-y-4">
          {/* Live Room Status */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h3 className="text-sm font-700 text-slate-900">Live Status</h3>
              <button onClick={() => onNavigate('livestatus')} className="text-xs text-blue-600 hover:text-blue-700 font-600">View All →</button>
            </div>
            <div className="p-3 space-y-2">
              {[
                { room: '5A01', status: 'ongoing' as const, session: 'SE1010' },
                { room: '5A02', status: 'ongoing' as const, session: 'CS3050' },
                { room: '5A04', status: 'ongoing' as const, session: 'IT1130' },
                { room: '5B01', status: 'available' as const, session: null },
                { room: '8A01', status: 'cancelled' as const, session: 'IT2020' },
                { room: '7G01', status: 'rescheduled' as const, session: 'SE3010' },
              ].map(r => (
                <div key={r.room} className="flex items-center justify-between rounded-lg px-3 py-2 bg-slate-50">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-600 text-slate-700 w-10">{r.room}</span>
                    {r.session && <span className="text-xs text-slate-500">{r.session}</span>}
                  </div>
                  <StatusBadge status={r.status} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Changes */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h3 className="text-sm font-700 text-slate-900">Recent Changes</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {auditLog.slice(0, 3).map(a => (
                <div key={a.id} className="px-4 py-3">
                  <p className="text-xs font-600 text-slate-800">{a.action}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">{a.detail}</p>
                  <p className="text-[11px] text-slate-300 mt-0.5">{a.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
