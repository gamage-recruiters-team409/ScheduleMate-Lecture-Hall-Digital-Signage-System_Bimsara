import { useState } from 'react';
import { rooms, sessions, type SessionStatus } from '../../data/mockData';
import StatusBadge from '../ui/StatusBadge';
import { RoomTypeBadge } from '../ui/StatusBadge';

export default function LiveStatus() {
  const [buildingFilter, setBuildingFilter] = useState('main');
  const [floorFilter, setFloorFilter] = useState('5');
  const [sideFilter, setSideFilter] = useState('A');

  const sides = buildingFilter === 'main' ? ['A', 'B'] : ['G', 'F'];
  const maxFloor = buildingFilter === 'main' ? 10 : 14;

  const roomData = rooms
    .filter(r => r.building === buildingFilter && r.floor === parseInt(floorFilter) && r.side === sideFilter)
    .map(r => {
      const ongoing = sessions.find(s => s.room === r.id && s.status === 'ongoing');
      const upcoming = sessions.find(s => s.room === r.id && (s.status === 'upcoming' || s.status === 'scheduled'));
      const cancelled = sessions.find(s => s.room === r.id && s.status === 'cancelled');
      const rescheduled = sessions.find(s => s.room === r.id && s.status === 'rescheduled');
      let status: SessionStatus = 'available';
      if (ongoing) status = 'ongoing';
      else if (rescheduled) status = 'rescheduled';
      else if (cancelled) status = 'cancelled';
      else if (upcoming) status = 'upcoming';
      return { room: r, status, ongoing, upcoming, cancelled, rescheduled };
    });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-700 text-slate-900">Live Room Status</h2>
          <p className="text-sm text-slate-500">Real-time session status · Auto-refreshes every 30s</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
          <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
          Live
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select value={buildingFilter} onChange={e => { setBuildingFilter(e.target.value); setSideFilter(e.target.value === 'main' ? 'A' : 'G'); }} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10">
          <option value="main">Main Building</option>
          <option value="new">New Building</option>
        </select>
        <select value={floorFilter} onChange={e => setFloorFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10">
          {Array.from({ length: maxFloor }, (_, i) => i + 1).map(f => (
            <option key={f} value={f}>Floor {f}</option>
          ))}
        </select>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden">
          {sides.map(s => (
            <button key={s} onClick={() => setSideFilter(s)} className={`px-4 py-2 text-sm font-600 transition-colors ${sideFilter === s ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
              {s} Side
            </button>
          ))}
        </div>
      </div>

      {/* Location indicator */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-700 text-slate-900">{buildingFilter === 'main' ? 'Main Building' : 'New Building'}</span>
        <span className="text-slate-400">·</span>
        <span className="text-slate-600">Floor {floorFilter}</span>
        <span className="text-slate-400">·</span>
        <span className="text-slate-600">{sideFilter} Side</span>
        <span className="ml-2 text-xs text-slate-400">{roomData.length} rooms</span>
      </div>

      {roomData.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-slate-400 text-sm">No rooms configured for this location.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {roomData.map(({ room, status, ongoing, upcoming, cancelled, rescheduled }) => (
            <div
              key={room.id}
              className={`rounded-xl border-2 bg-white p-5 transition-all ${
                status === 'ongoing' ? 'border-green-200 bg-green-50/30' :
                status === 'cancelled' ? 'border-red-200 bg-red-50/20' :
                status === 'rescheduled' ? 'border-violet-200 bg-violet-50/20' :
                status === 'upcoming' ? 'border-amber-200 bg-amber-50/20' :
                'border-slate-200'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-mono text-xl font-800 text-slate-900">{room.id}</p>
                  <RoomTypeBadge type={room.type} />
                </div>
                <StatusBadge status={status} />
              </div>

              {/* Current session */}
              {ongoing ? (
                <div className="mt-3 space-y-1">
                  <p className="text-[10px] font-700 uppercase tracking-widest text-slate-400">Current Session</p>
                  <p className="text-sm font-700 text-slate-900">{ongoing.module}</p>
                  <p className="text-xs text-slate-500 truncate">{ongoing.moduleName}</p>
                  <p className="text-xs text-slate-600">{ongoing.lecturer}</p>
                  <p className="text-xs font-mono text-slate-500">{ongoing.start} – {ongoing.end}</p>
                </div>
              ) : cancelled ? (
                <div className="mt-3">
                  <p className="text-[10px] font-700 uppercase tracking-widest text-red-400">Cancelled</p>
                  <p className="text-sm font-700 text-slate-700 line-through">{cancelled.module}</p>
                  <p className="text-xs text-red-500 mt-1 truncate">{cancelled.cancelReason}</p>
                </div>
              ) : rescheduled ? (
                <div className="mt-3">
                  <p className="text-[10px] font-700 uppercase tracking-widest text-violet-500">Rescheduled</p>
                  <p className="text-sm font-700 text-slate-700">{rescheduled.module}</p>
                  <p className="text-xs text-violet-600 font-600">→ Now: {rescheduled.newStart}–{rescheduled.newEnd} in {rescheduled.newRoom}</p>
                </div>
              ) : (
                <div className="mt-3">
                  <p className="text-xs text-teal-600 font-600">Available</p>
                </div>
              )}

              {/* Next session */}
              {upcoming && status !== 'upcoming' && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-[10px] font-700 uppercase tracking-widest text-slate-300 mb-1">Next</p>
                  <p className="text-xs text-slate-600">{upcoming.module} · {upcoming.start}</p>
                </div>
              )}
              {upcoming && status === 'upcoming' && (
                <div className="mt-3">
                  <p className="text-[10px] font-700 uppercase tracking-widest text-amber-500 mb-1">Upcoming</p>
                  <p className="text-sm font-700 text-slate-900">{upcoming.module}</p>
                  <p className="text-xs text-slate-600">{upcoming.lecturer}</p>
                  <p className="text-xs font-mono text-amber-600">{upcoming.start} – {upcoming.end}</p>
                </div>
              )}

              {/* Capacity */}
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-[11px] text-slate-400">Capacity: <span className="font-600 text-slate-600">{room.capacity}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
