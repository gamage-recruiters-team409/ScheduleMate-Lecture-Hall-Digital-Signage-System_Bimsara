import { useState } from 'react';
import { displays, type Display } from '../../data/mockData';
import Modal, { ModalBody, ModalFooter } from '../ui/Modal';
import { FormInput, FormSelect, FormSection } from '../ui/FormField';

type Props = { onPreviewSignage: () => void };

export default function DisplayConfig({ onPreviewSignage }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Display | null>(null);

  const online = displays.filter(d => d.active).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-700 text-slate-900">Display Devices</h2>
          <p className="text-sm text-slate-500">{online} of {displays.length} devices online</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onPreviewSignage} className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-600 text-slate-700 hover:bg-slate-50 transition-colors">
            <svg viewBox="0 0 16 16" className="size-3.5 fill-none stroke-current" strokeWidth="1.3"><rect x="1" y="1.5" width="14" height="10" rx="1.5" /><path d="M5 13h6M8 11.5V13" strokeLinecap="round" /></svg>
            Preview Signage
          </button>
          <button onClick={() => { setEditing(null); setShowModal(true); }} className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-600 text-white hover:bg-blue-700 transition-colors">
            + Add Display
          </button>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Devices', value: displays.length, color: 'text-slate-900' },
          { label: 'Online', value: online, color: 'text-green-700' },
          { label: 'Offline', value: displays.length - online, color: 'text-red-600' },
          { label: 'Resolution', value: '1920×1080', color: 'text-slate-700' },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className={`text-2xl font-800 ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-5 py-3 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Display Name</th>
              <th className="px-4 py-3 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Device Code</th>
              <th className="px-4 py-3 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Location</th>
              <th className="px-4 py-3 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Resolution</th>
              <th className="px-4 py-3 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Last Seen</th>
              <th className="px-4 py-3 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Health</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {displays.map(d => {
              const isRecent = d.lastSeen.startsWith('2026-09-07');
              return (
                <tr key={d.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-600 text-slate-900">{d.name}</p>
                    <p className="text-[11px] text-slate-400">{d.ip}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded font-600 text-slate-700">{d.code}</span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-600">
                    {d.building} · Floor {d.floor} · {d.side} Side
                  </td>
                  <td className="px-4 py-3.5 text-xs font-mono text-slate-600">{d.resolution}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-500">{d.lastSeen}</td>
                  <td className="px-4 py-3.5">
                    <div className={`flex items-center gap-1.5 text-xs font-600 ${d.active && isRecent ? 'text-green-700' : d.active ? 'text-amber-600' : 'text-red-600'}`}>
                      <span className={`size-2 rounded-full ${d.active && isRecent ? 'bg-green-500 animate-pulse' : d.active ? 'bg-amber-400' : 'bg-red-400'}`} />
                      {d.active && isRecent ? 'Online' : d.active ? 'Delayed' : 'Offline'}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1 justify-end">
                      <button onClick={onPreviewSignage} className="rounded px-2.5 py-1 text-xs font-600 text-blue-600 hover:bg-blue-50 transition-colors">Preview</button>
                      <button onClick={() => { setEditing(d); setShowModal(true); }} className="rounded px-2.5 py-1 text-xs font-600 text-slate-500 hover:bg-slate-100 transition-colors">Configure</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? `Configure – ${editing.name}` : 'Add Display Device'} width="max-w-lg">
        <ModalBody className="space-y-5">
          <FormSection title="Device Identity">
            <FormInput label="Display Name" placeholder="e.g. Main Bldg Floor 5 – A Side" defaultValue={editing?.name} />
            <FormInput label="Device Code" placeholder="e.g. DSP-MB-05A" defaultValue={editing?.code} hint="Unique identifier for this display unit." />
            <FormInput label="IP Address" placeholder="192.168.1.101" defaultValue={editing?.ip} />
          </FormSection>
          <FormSection title="Location Assignment">
            <FormSelect label="Building" defaultValue={editing?.building}>
              <option>Main Building</option>
              <option>New Building</option>
            </FormSelect>
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Floor" type="number" defaultValue={editing?.floor} />
              <FormSelect label="Side" defaultValue={editing?.side}>
                <option value="A">A Side</option>
                <option value="B">B Side</option>
                <option value="G">G Side</option>
                <option value="F">F Side</option>
              </FormSelect>
            </div>
          </FormSection>
          <FormSection title="Display Settings">
            <FormSelect label="Resolution" defaultValue={editing?.resolution}>
              <option>1920×1080</option>
              <option>3840×2160</option>
              <option>1280×720</option>
            </FormSelect>
            <FormSelect label="Status" defaultValue={editing?.active ? 'active' : 'inactive'}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </FormSelect>
          </FormSection>
        </ModalBody>
        <ModalFooter>
          <button onClick={() => setShowModal(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-600 text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-600 text-white hover:bg-blue-700 transition-colors">{editing ? 'Save Configuration' : 'Add Device'}</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
