import { useState } from 'react';
import { rooms, type Room, type RoomType } from '../../data/mockData';
import { RoomTypeBadge } from '../ui/StatusBadge';
import Modal, { ModalBody, ModalFooter } from '../ui/Modal';
import { FormInput, FormSelect, FormSection } from '../ui/FormField';

export default function RoomsLabs() {
  const [filter, setFilter] = useState({ building: '', type: '', search: '' });
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);

  const filtered = rooms.filter(r => {
    if (filter.building && r.building !== filter.building) return false;
    if (filter.type && r.type !== filter.type) return false;
    if (filter.search && !r.id.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  const openAdd = () => { setEditing(null); setShowModal(true); };
  const openEdit = (r: Room) => { setEditing(r); setShowModal(true); };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-700 text-slate-900">Rooms & Laboratories</h2>
          <p className="text-sm text-slate-500">{rooms.length} rooms across both buildings</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-600 text-white hover:bg-blue-700 transition-colors">
          + Add Room
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <svg viewBox="0 0 16 16" className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 fill-none stroke-slate-400" strokeWidth={1.5}><circle cx="7" cy="7" r="4.5" /><path d="M11 11l2.5 2.5" strokeLinecap="round" /></svg>
          <input
            type="search"
            placeholder="Search room code…"
            value={filter.search}
            onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
          />
        </div>
        <select value={filter.building} onChange={e => setFilter(f => ({ ...f, building: e.target.value }))} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10">
          <option value="">All Buildings</option>
          <option value="main">Main Building</option>
          <option value="new">New Building</option>
        </select>
        <select value={filter.type} onChange={e => setFilter(f => ({ ...f, type: e.target.value }))} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10">
          <option value="">All Types</option>
          <option value="Lecture Room">Lecture Room</option>
          <option value="Laboratory">Laboratory</option>
          <option value="Large Lecture Hall">Large Lecture Hall</option>
        </select>
        <span className="text-xs text-slate-400 ml-auto">{filtered.length} results</span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-5 py-3 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Room Code</th>
              <th className="px-4 py-3 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Type</th>
              <th className="px-4 py-3 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Building</th>
              <th className="px-4 py-3 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Floor</th>
              <th className="px-4 py-3 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Side</th>
              <th className="px-4 py-3 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Capacity</th>
              <th className="px-4 py-3 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(r => (
              <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3.5">
                  <span className="font-mono font-700 text-slate-900">{r.id}</span>
                </td>
                <td className="px-4 py-3.5"><RoomTypeBadge type={r.type} /></td>
                <td className="px-4 py-3.5 text-slate-700">{r.building === 'main' ? 'Main Building' : 'New Building'}</td>
                <td className="px-4 py-3.5 text-slate-700">Floor {r.floor}</td>
                <td className="px-4 py-3.5 text-slate-700">{r.side} Side</td>
                <td className="px-4 py-3.5 text-slate-700">{r.capacity}</td>
                <td className="px-4 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-600 ${r.active ? 'text-green-700' : 'text-slate-400'}`}>
                    <span className={`size-1.5 rounded-full ${r.active ? 'bg-green-500' : 'bg-slate-300'}`} />
                    {r.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => openEdit(r)} className="rounded px-2.5 py-1 text-xs font-600 text-blue-600 hover:bg-blue-50 transition-colors">Edit</button>
                    <button className="rounded px-2.5 py-1 text-xs font-600 text-red-500 hover:bg-red-50 transition-colors">Remove</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? `Edit Room – ${editing.id}` : 'Add New Room'}
        subtitle={editing ? `${editing.building === 'main' ? 'Main Building' : 'New Building'} · Floor ${editing.floor} · ${editing.side} Side` : 'Register a new room or laboratory'}
        width="max-w-lg"
      >
        <ModalBody className="space-y-5">
          <FormSection title="Room Identity">
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Room Code" placeholder="e.g. 5A01" defaultValue={editing?.id} />
              <FormSelect label="Room Type" defaultValue={editing?.type}>
                <option>Lecture Room</option>
                <option>Laboratory</option>
                <option>Large Lecture Hall</option>
              </FormSelect>
            </div>
          </FormSection>
          <FormSection title="Location">
            <div className="grid grid-cols-3 gap-4">
              <FormSelect label="Building" defaultValue={editing?.building}>
                <option value="main">Main Building</option>
                <option value="new">New Building</option>
              </FormSelect>
              <FormInput label="Floor" type="number" min="1" max="14" defaultValue={editing?.floor} />
              <FormSelect label="Side" defaultValue={editing?.side}>
                <option value="A">A Side</option>
                <option value="B">B Side</option>
                <option value="G">G Side</option>
                <option value="F">F Side</option>
              </FormSelect>
            </div>
          </FormSection>
          <FormSection title="Details">
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Capacity" type="number" defaultValue={editing?.capacity} placeholder="40" />
              <FormSelect label="Status" defaultValue={editing?.active ? 'active' : 'inactive'}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </FormSelect>
            </div>
          </FormSection>
        </ModalBody>
        <ModalFooter>
          <button onClick={() => setShowModal(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-600 text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-600 text-white hover:bg-blue-700 transition-colors">{editing ? 'Save Changes' : 'Add Room'}</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
