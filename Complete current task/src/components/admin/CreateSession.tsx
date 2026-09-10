import { useState } from 'react';
import { modules, lecturers, rooms } from '../../data/mockData';
import { FormInput, FormSelect, FormTextarea, FormSection } from '../ui/FormField';

type Props = { onBack: () => void };

export default function CreateSession({ onBack }: Props) {
  const [roomAvail, setRoomAvail] = useState<'available' | 'conflict' | null>(null);
  const [building, setBuilding] = useState('main');

  const sideOptions = building === 'main' ? ['A', 'B'] : ['G', 'F'];

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors">
          <svg viewBox="0 0 16 16" className="size-4 fill-none stroke-current" strokeWidth="2"><path d="M10 12L6 8l4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div>
          <h2 className="text-lg font-700 text-slate-900">Create Session</h2>
          <p className="text-sm text-slate-500">Schedule a new lecture, lab, or tutorial session</p>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-5">
        {/* Form */}
        <div className="space-y-5">
          {/* Academic Details */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
            <FormSection title="Academic Details">
              <FormSelect label="Module">
                <option value="">Select module…</option>
                {modules.map(m => <option key={m.code} value={m.code}>{m.code} – {m.name}</option>)}
              </FormSelect>
              <FormSelect label="Lecturer">
                <option value="">Select lecturer…</option>
                {lecturers.filter(l => l.active).map(l => <option key={l.id} value={l.id}>{l.name} – {l.dept}</option>)}
              </FormSelect>
              <FormSelect label="Session Type">
                <option>Lecture</option>
                <option>Lab</option>
                <option>Tutorial</option>
                <option>Exam</option>
              </FormSelect>
            </FormSection>
          </div>

          {/* Time Details */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
            <FormSection title="Time Details">
              <FormInput label="Date" type="date" defaultValue="2026-09-07" />
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Start Time" type="time" defaultValue="09:00" />
                <FormInput label="End Time" type="time" defaultValue="11:00" />
              </div>
            </FormSection>
          </div>

          {/* Location Details */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
            <FormSection title="Location Details">
              <FormSelect label="Building" value={building} onChange={e => setBuilding(e.target.value)}>
                <option value="main">Main Building</option>
                <option value="new">New Building</option>
              </FormSelect>
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Floor" type="number" min="1" max={building === 'main' ? 10 : 14} placeholder="5" />
                <FormSelect label="Side">
                  {sideOptions.map(s => <option key={s}>{s} Side</option>)}
                </FormSelect>
              </div>
              <div>
                <FormSelect label="Room" onChange={() => setRoomAvail(Math.random() > 0.3 ? 'available' : 'conflict')}>
                  <option value="">Select room…</option>
                  {rooms.filter(r => r.building === building).map(r => (
                    <option key={r.id} value={r.id}>{r.id} – {r.type} (Cap. {r.capacity})</option>
                  ))}
                </FormSelect>
                {roomAvail === 'available' && (
                  <div className="mt-2 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2">
                    <svg viewBox="0 0 16 16" className="size-4 fill-green-500 shrink-0"><path d="M13 4.5L6.5 11 3 7.5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
                    <span className="text-xs text-green-700 font-600">Room is available for this time slot</span>
                  </div>
                )}
                {roomAvail === 'conflict' && (
                  <div className="mt-2 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                    <svg viewBox="0 0 16 16" className="size-4 fill-red-500 shrink-0"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 5zm0 6.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z" /></svg>
                    <span className="text-xs text-red-700 font-600">Conflict – this room is already booked SE2040 (10:30–12:30)</span>
                  </div>
                )}
              </div>
            </FormSection>
          </div>

          {/* Session Details */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <FormSection title="Session Details">
              <FormTextarea label="Notes (Optional)" placeholder="Any additional information about this session…" rows={3} />
            </FormSection>
          </div>
        </div>

        {/* Availability sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 sticky top-0">
            <h3 className="text-xs font-700 uppercase tracking-widest text-slate-400 mb-3">Room Availability</h3>
            <p className="text-xs text-slate-500 mb-4">Select a room and time to check availability.</p>

            <div className="space-y-2">
              {[
                { room: '5A01', sessions: ['SE1010 08:00–10:00', 'SE2040 10:30–12:30'], status: 'busy' },
                { room: '5A02', sessions: ['CS3050 08:30–10:30'], status: 'partial' },
                { room: '5A03', sessions: [], status: 'free' },
                { room: '5A04', sessions: ['IT1130 09:00–11:00'], status: 'partial' },
                { room: '5B01', sessions: [], status: 'free' },
              ].map(r => (
                <div key={r.room} className="flex items-start gap-2 rounded-lg p-2.5 bg-slate-50">
                  <span className="font-mono text-xs font-700 text-slate-700 w-10 shrink-0 mt-0.5">{r.room}</span>
                  <div className="flex-1">
                    {r.sessions.length === 0
                      ? <p className="text-xs text-teal-600 font-600">Available all day</p>
                      : r.sessions.map(s => <p key={s} className="text-[11px] text-slate-500">{s}</p>)
                    }
                  </div>
                  <span className={`size-2 rounded-full mt-1 shrink-0 ${r.status === 'free' ? 'bg-teal-500' : r.status === 'partial' ? 'bg-amber-400' : 'bg-red-400'}`} />
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-teal-500 inline-block" /> Free</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-amber-400 inline-block" /> Partial</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-red-400 inline-block" /> Busy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button onClick={onBack} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-600 text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
        <button className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-700 text-white hover:bg-blue-700 transition-colors">Save Session</button>
      </div>
    </div>
  );
}
