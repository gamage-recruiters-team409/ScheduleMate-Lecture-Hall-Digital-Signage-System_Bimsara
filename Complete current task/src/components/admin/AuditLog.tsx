import { auditLog } from '../../data/mockData';

export default function AuditLog() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-700 text-slate-900">Audit Log</h2>
        <p className="text-sm text-slate-500">Complete record of system changes and administrative actions</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-600 text-slate-500">{auditLog.length} recent entries</span>
          <button className="text-xs text-blue-600 hover:text-blue-700 font-600">Export CSV</button>
        </div>
        <div className="divide-y divide-slate-50">
          {auditLog.map(entry => (
            <div key={entry.id} className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors">
              <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-100">
                {entry.action.includes('Cancel') ? (
                  <svg viewBox="0 0 12 12" className="size-3.5 fill-red-500"><path d="M9 3L3 9M3 3l6 6" stroke="#DC2626" fill="none" strokeWidth="1.5" strokeLinecap="round" /></svg>
                ) : entry.action.includes('Reschedule') ? (
                  <svg viewBox="0 0 12 12" className="size-3.5"><path d="M1 6a5 5 0 0 0 9 3M11 6a5 5 0 0 0-9-3" stroke="#7C3AED" fill="none" strokeWidth="1.5" strokeLinecap="round" /></svg>
                ) : entry.action.includes('Create') ? (
                  <svg viewBox="0 0 12 12" className="size-3.5"><path d="M6 2v8M2 6h8" stroke="#2563EB" fill="none" strokeWidth="1.5" strokeLinecap="round" /></svg>
                ) : (
                  <svg viewBox="0 0 12 12" className="size-3.5"><circle cx="6" cy="6" r="4" stroke="#94A3B8" fill="none" strokeWidth="1.5" /></svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-600 text-slate-900">{entry.action}</p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{entry.detail}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-600 text-slate-600">{entry.user}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{entry.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
