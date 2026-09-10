import { useState } from 'react';
import { modules, type Module } from '../../data/mockData';
import Modal, { ModalBody, ModalFooter } from '../ui/Modal';
import { FormInput, FormSelect, FormSection } from '../ui/FormField';

export default function Modules() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Module | null>(null);

  const depts = [...new Set(modules.map(m => m.dept))];
  const filtered = modules.filter(m => {
    if (deptFilter && m.dept !== deptFilter) return false;
    if (search && !m.code.toLowerCase().includes(search.toLowerCase()) && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-700 text-slate-900">Module Management</h2>
          <p className="text-sm text-slate-500">{modules.length} modules registered</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true); }} className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-600 text-white hover:bg-blue-700 transition-colors">
          + Add Module
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <svg viewBox="0 0 16 16" className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 fill-none stroke-slate-400" strokeWidth={1.5}><circle cx="7" cy="7" r="4.5" /><path d="M11 11l2.5 2.5" strokeLinecap="round" /></svg>
          <input
            type="search"
            placeholder="Search by module code or name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
          />
        </div>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10">
          <option value="">All Departments</option>
          {depts.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-5 py-3 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Code</th>
              <th className="px-4 py-3 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Module Name</th>
              <th className="px-4 py-3 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Department</th>
              <th className="px-4 py-3 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Level</th>
              <th className="px-4 py-3 text-left text-[10px] font-700 uppercase tracking-wider text-slate-400">Credits</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(m => (
              <tr key={m.code} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3.5">
                  <span className="font-mono font-700 text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs">{m.code}</span>
                </td>
                <td className="px-4 py-3.5 font-600 text-slate-900">{m.name}</td>
                <td className="px-4 py-3.5 text-slate-600">{m.dept}</td>
                <td className="px-4 py-3.5">
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-600">Level {m.level}</span>
                </td>
                <td className="px-4 py-3.5 text-slate-600">{m.credits} cr</td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => { setEditing(m); setShowModal(true); }} className="rounded px-2.5 py-1 text-xs font-600 text-blue-600 hover:bg-blue-50 transition-colors">Edit</button>
                    <button className="rounded px-2.5 py-1 text-xs font-600 text-red-500 hover:bg-red-50 transition-colors">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? `Edit Module – ${editing.code}` : 'Add New Module'} width="max-w-lg">
        <ModalBody className="space-y-5">
          <FormSection title="Module Details">
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Module Code" placeholder="e.g. SE1010" defaultValue={editing?.code} />
              <FormSelect label="Level" defaultValue={editing?.level?.toString()}>
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
                <option value="4">Level 4</option>
              </FormSelect>
            </div>
            <FormInput label="Module Name" placeholder="e.g. Introduction to Programming" defaultValue={editing?.name} />
            <div className="grid grid-cols-2 gap-4">
              <FormSelect label="Department" defaultValue={editing?.dept}>
                <option>Software Engineering</option>
                <option>Information Technology</option>
                <option>Computer Science</option>
              </FormSelect>
              <FormInput label="Credits" type="number" min="1" max="6" defaultValue={editing?.credits} />
            </div>
          </FormSection>
        </ModalBody>
        <ModalFooter>
          <button onClick={() => setShowModal(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-600 text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-600 text-white hover:bg-blue-700 transition-colors">{editing ? 'Save Changes' : 'Add Module'}</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
