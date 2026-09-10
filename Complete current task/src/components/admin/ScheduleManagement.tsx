import { useState } from 'react';
import { sessions, type Session } from '../../data/mockData';
import StatusBadge from '../ui/StatusBadge';
import Modal, { ModalBody, ModalFooter } from '../ui/Modal';
import { FormTextarea, FormSelect, FormSection } from '../ui/FormField';

type Props = { onCreateSession: () => void };

export default function ScheduleManagement({ onCreateSession }: Props) {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [statusFilter, setStatusFilter] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('');
  const [cancelModal, setCancelModal] = useState<Session | null>(null);
  const [rescheduleModal, setRescheduleModal] = useState<Session | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const filtered = sessions.filter(s => {
    if (statusFilter && s.status !== statusFilter) return false;
    if (buildingFilter && s.buildingShort.toLowerCase() !== buildingFilter) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-700 text-slate-900">Schedule Management</h2>
          <p className="text-sm text-slate-500">Monday, 7 September 2026</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            <button onClick={() => setView('list')} className={`px-3 py-1.5 text-sm font-600 transition-colors ${view === 'list' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
              <svg viewBox="0 0 16 16" className="size-4 fill-current inline-block"><path d="M2 4h12v1.5H2V4zm0 3h12v1.5H2V7zm0 3h8v1.5H2V10z" /></svg>
            </button>
            <button onClick={() => setView('calendar')} className={`px-3 py-1.5 text-sm font-600 transition-colors ${view === 'calendar' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
              <svg viewBox="0 0 16 16" className="size-4 fill-none stroke-current inline-block" strokeWidth="1.3"><rect x="1" y="3" width="14" height="12" rx="1" /><path d="M5 1v3M11 1v3M1 7h14" strokeLinecap="round" /></svg>
            </button>
          </div>
          <button onClick={onCreateSession} className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-600 text-white hover:bg-blue-700 transition-colors">
            + Create Session
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select value={buildingFilter} onChange={e => setBuildingFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10">
          <option value="">All Buildings</option>
          <option value="main">Main Building</option>
          <option value="new">New Building</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10">
          <option value="">All Statuses</option>
          <option value="ongoing">Ongoing</option>
          <option value="upcoming">Upcoming</option>
          <option value="scheduled">Scheduled</option>
          <option value="cancelled">Cancelled</option>
          <option value="rescheduled">Rescheduled</option>
          <option value="completed">Completed</option>
        </select>
        <span className="ml-auto text-xs text-slate-400 self-center">{filtered.length} sessions</span>
      </div>

      {view === 'list' ? (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-5 py-3 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Module</th>
                <th className="px-4 py-3 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Lecturer</th>
                <th className="px-4 py-3 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Room</th>
                <th className="px-4 py-3 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Date & Time</th>
                <th className="px-4 py-3 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Type</th>
                <th className="px-4 py-3 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Status</th>
                <th className="px-4 py-3 text-right text-[10px] font-700 uppercase tracking-wider text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(s => (
                <tr key={s.id} className={`hover:bg-slate-50/60 transition-colors ${s.status === 'cancelled' ? 'opacity-60' : ''}`}>
                  <td className="px-5 py-3.5">
                    <p className="font-700 text-slate-900 font-mono text-xs mb-0.5">{s.module}</p>
                    <p className="text-xs text-slate-500 max-w-[180px] truncate">{s.moduleName}</p>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-700">{s.lecturer}</td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-xs font-700 bg-slate-100 px-2 py-1 rounded text-slate-700">{s.room}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-xs text-slate-700 font-600">{s.date}</p>
                    <p className="text-xs text-slate-400 font-mono">{s.start}–{s.end}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{s.type}</span>
                  </td>
                  <td className="px-4 py-3.5"><StatusBadge status={s.status} size="sm" /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1 justify-end">
                      {s.status !== 'cancelled' && s.status !== 'completed' && (
                        <>
                          <button className="rounded px-2 py-1 text-xs font-600 text-slate-500 hover:bg-slate-100 transition-colors">Edit</button>
                          <button onClick={() => setCancelModal(s)} className="rounded px-2 py-1 text-xs font-600 text-red-500 hover:bg-red-50 transition-colors">Cancel</button>
                          <button onClick={() => setRescheduleModal(s)} className="rounded px-2 py-1 text-xs font-600 text-violet-600 hover:bg-violet-50 transition-colors">Reschedule</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="text-center text-slate-400 py-12">
            <svg viewBox="0 0 16 16" className="size-8 mx-auto mb-3 fill-none stroke-current" strokeWidth="1"><rect x="1" y="3" width="14" height="12" rx="1.5" /><path d="M5 1v3M11 1v3M1 7h14" /></svg>
            <p className="text-sm">Calendar view coming soon</p>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      <Modal open={!!cancelModal} onClose={() => setCancelModal(null)} title="Cancel Session" subtitle="This action will remove the session from all displays." width="max-w-md">
        <ModalBody className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <svg viewBox="0 0 20 20" className="size-5 shrink-0 fill-red-500 mt-0.5"><path d="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2zm0 4a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0v-4A.75.75 0 0 1 10 6zm0 7.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z" /></svg>
            <div>
              <p className="text-sm font-600 text-red-800">Warning: This cannot be undone</p>
              <p className="text-xs text-red-600 mt-0.5">The session will be marked cancelled and removed from all ongoing and upcoming signage displays immediately.</p>
            </div>
          </div>
          {cancelModal && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Module</span><span className="font-600 text-slate-900">{cancelModal.module} – {cancelModal.moduleName}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Lecturer</span><span className="font-600 text-slate-900">{cancelModal.lecturer}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Room</span><span className="font-mono font-700 text-slate-900">{cancelModal.room}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Time</span><span className="font-600 text-slate-900">{cancelModal.start}–{cancelModal.end}</span></div>
            </div>
          )}
          <FormSection title="">
            <FormTextarea
              label="Cancellation Reason *"
              placeholder="e.g. Lecturer unwell – medical leave"
              rows={3}
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              hint="This reason will be logged in the audit trail."
            />
          </FormSection>
        </ModalBody>
        <ModalFooter>
          <button onClick={() => setCancelModal(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-600 text-slate-700 hover:bg-slate-50 transition-colors">Go Back</button>
          <button
            disabled={!cancelReason.trim()}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            Confirm Cancellation
          </button>
        </ModalFooter>
      </Modal>

      {/* Reschedule Modal */}
      <Modal open={!!rescheduleModal} onClose={() => setRescheduleModal(null)} title="Reschedule Session" subtitle={rescheduleModal ? `${rescheduleModal.module} – ${rescheduleModal.moduleName}` : ''} width="max-w-2xl">
        <ModalBody className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {/* Original */}
            <div>
              <h4 className="text-[10px] font-700 uppercase tracking-widest text-slate-400 mb-3">Original Session</h4>
              {rescheduleModal && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2 text-sm">
                  <div><span className="text-slate-400 text-xs">Date</span><p className="font-600 text-slate-800">{rescheduleModal.date}</p></div>
                  <div><span className="text-slate-400 text-xs">Time</span><p className="font-600 font-mono text-slate-800">{rescheduleModal.start}–{rescheduleModal.end}</p></div>
                  <div><span className="text-slate-400 text-xs">Room</span><p className="font-700 font-mono text-slate-800">{rescheduleModal.room}</p></div>
                </div>
              )}
            </div>
            {/* New */}
            <div>
              <h4 className="text-[10px] font-700 uppercase tracking-widest text-blue-600 mb-3">New Schedule</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-600 uppercase tracking-wide text-slate-600 mb-1.5">New Date</label>
                  <input type="date" defaultValue="2026-09-08" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/15" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-600 uppercase tracking-wide text-slate-600 mb-1.5">Start Time</label>
                    <input type="time" defaultValue="10:00" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/15" />
                  </div>
                  <div>
                    <label className="block text-xs font-600 uppercase tracking-wide text-slate-600 mb-1.5">End Time</label>
                    <input type="time" defaultValue="12:00" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/15" />
                  </div>
                </div>
                <FormSelect label="New Room">
                  <option>5A01 – Lecture Room (Floor 5, A Side)</option>
                  <option>5A02 – Lecture Room (Floor 5, A Side)</option>
                  <option>8A02 – Lecture Room (Floor 8, A Side)</option>
                  <option>7G02 – Lecture Room (Floor 7, G Side)</option>
                </FormSelect>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="rounded-lg border border-green-200 bg-green-50 flex items-center gap-3 px-4 py-3">
            <svg viewBox="0 0 16 16" className="size-4 fill-green-600 shrink-0"><path d="M13.5 4.5L6.5 11.5 2.5 7.5" stroke="#16A34A" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <p className="text-sm text-green-700 font-600">Room is available for the selected time slot</p>
          </div>

          <FormTextarea label="Reschedule Reason *" placeholder="e.g. Moved from previous date due to public holiday" rows={2} hint="Displayed on signage and recorded in audit log." />
        </ModalBody>
        <ModalFooter>
          <button onClick={() => setRescheduleModal(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-600 text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
          <button className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-600 text-white hover:bg-violet-700 transition-colors">Confirm Reschedule</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
