import { useState } from 'react';
import { lecturers, type Lecturer } from '../../data/mockData';
import Modal, { ModalBody, ModalFooter } from '../ui/Modal';
import { FormInput, FormSelect, FormSection } from '../ui/FormField';

export default function Lecturers() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Lecturer | null>(null);

  const filtered = lecturers.filter(l =>
    !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.dept.toLowerCase().includes(search.toLowerCase())
  );

  const initials = (name: string) => name.split(' ').filter(p => p.match(/[A-Z]/)).map(p => p[0]).join('').slice(0, 2);
  const colors = ['bg-blue-500', 'bg-violet-500', 'bg-teal-500', 'bg-orange-500', 'bg-rose-500', 'bg-emerald-500'];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-700 text-slate-900">Lecturer Management</h2>
          <p className="text-sm text-slate-500">{lecturers.filter(l => l.active).length} active lecturers</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true); }} className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-600 text-white hover:bg-blue-700 transition-colors">
          + Add Lecturer
        </button>
      </div>

      <div className="relative">
        <svg viewBox="0 0 16 16" className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 fill-none stroke-slate-400" strokeWidth={1.5}><circle cx="7" cy="7" r="4.5" /><path d="M11 11l2.5 2.5" strokeLinecap="round" /></svg>
        <input
          type="search"
          placeholder="Search by name or department…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 max-w-sm"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-5 py-3 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Lecturer</th>
              <th className="px-4 py-3 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Department</th>
              <th className="px-4 py-3 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Email</th>
              <th className="px-4 py-3 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Phone</th>
              <th className="px-4 py-3 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((l, idx) => (
              <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`flex size-8 items-center justify-center rounded-full text-white text-xs font-700 shrink-0 ${colors[idx % colors.length]}`}>
                      {initials(l.name)}
                    </div>
                    <div>
                      <p className="font-600 text-slate-900">{l.name}</p>
                      <p className="text-[11px] text-slate-400">{l.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-500">{l.dept}</span>
                </td>
                <td className="px-4 py-3.5 text-slate-600 text-xs">{l.email}</td>
                <td className="px-4 py-3.5 text-slate-600 text-xs font-mono">{l.phone}</td>
                <td className="px-4 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-600 ${l.active ? 'text-green-700' : 'text-slate-400'}`}>
                    <span className={`size-1.5 rounded-full ${l.active ? 'bg-green-500' : 'bg-slate-300'}`} />
                    {l.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => { setEditing(l); setShowModal(true); }} className="rounded px-2.5 py-1 text-xs font-600 text-blue-600 hover:bg-blue-50 transition-colors">Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? `Edit Lecturer` : 'Add New Lecturer'} subtitle={editing?.name} width="max-w-lg">
        <ModalBody className="space-y-5">
          <FormSection title="Personal Details">
            <div className="grid grid-cols-3 gap-4">
              <FormSelect label="Title" defaultValue={editing?.title}>
                <option>Dr.</option>
                <option>Prof.</option>
                <option>Mr.</option>
                <option>Ms.</option>
                <option>Mrs.</option>
              </FormSelect>
              <FormInput className="col-span-2" label="Full Name" placeholder="e.g. Amara Patel" defaultValue={editing?.name.replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.) /, '')} />
            </div>
            <FormSelect label="Department" defaultValue={editing?.dept}>
              <option>Software Engineering</option>
              <option>Information Technology</option>
              <option>Computer Science</option>
            </FormSelect>
          </FormSection>
          <FormSection title="Contact Information">
            <FormInput label="Email Address" type="email" placeholder="name@sparkline.ac" defaultValue={editing?.email} />
            <FormInput label="Phone Number" placeholder="+94 11 234 5000" defaultValue={editing?.phone} />
          </FormSection>
          <FormSection title="Account Status">
            <FormSelect label="Status" defaultValue={editing?.active ? 'active' : 'inactive'}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </FormSelect>
          </FormSection>
        </ModalBody>
        <ModalFooter>
          <button onClick={() => setShowModal(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-600 text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-600 text-white hover:bg-blue-700 transition-colors">{editing ? 'Save Changes' : 'Add Lecturer'}</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
