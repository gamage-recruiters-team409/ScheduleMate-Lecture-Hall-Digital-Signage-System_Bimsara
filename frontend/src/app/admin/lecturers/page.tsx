'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { Lecturer } from '@/types';
import { UserCheck, Plus, Edit2, CheckCircle2, XCircle, AlertCircle, Search, Mail, Phone } from 'lucide-react';

export default function LecturersPage() {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLecturer, setEditingLecturer] = useState<Lecturer | null>(null);

  const [fullName, setFullName] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchLecturers = async (q?: string) => {
    try {
      const url = q ? `/lecturers?search=${encodeURIComponent(q)}` : '/lecturers';
      const res = await apiFetch<Lecturer[]>(url);
      setLecturers(res);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLecturers();
  }, []);

  const handleSearchChange = (q: string) => {
    setSearch(q);
    fetchLecturers(q);
  };

  const openCreateModal = () => {
    setEditingLecturer(null);
    setFullName('');
    setEmployeeCode('');
    setEmail('');
    setPhone('');
    setDepartment('');
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (lec: Lecturer) => {
    setEditingLecturer(lec);
    setFullName(lec.fullName);
    setEmployeeCode(lec.employeeCode || '');
    setEmail(lec.email || '');
    setPhone(lec.phone || '');
    setDepartment(lec.department || '');
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingLecturer) {
        await apiFetch(`/lecturers/${editingLecturer.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ fullName, employeeCode, email, phone, department }),
        });
      } else {
        await apiFetch('/lecturers', {
          method: 'POST',
          body: JSON.stringify({ fullName, employeeCode, email, phone, department }),
        });
      }

      setModalOpen(false);
      fetchLecturers(search);
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await apiFetch(`/lecturers/${id}/status`, { method: 'PATCH' });
      fetchLecturers(search);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="h-7 w-7 text-cyan-600" />
            <span>Academic Lecturers & Faculty</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage teaching staff, employee codes, & department assignments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search lecturers..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-sm shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Lecturer</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Lecturer Name</th>
                <th className="px-6 py-4">Employee Code</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    Loading lecturers...
                  </td>
                </tr>
              ) : lecturers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    No lecturers found.
                  </td>
                </tr>
              ) : (
                lecturers.map((lec) => (
                  <tr key={lec.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{lec.fullName}</td>
                    <td className="px-6 py-4 font-mono font-bold text-cyan-600">
                      {lec.employeeCode || '—'}
                    </td>
                    <td className="px-6 py-4 text-xs space-y-0.5">
                      {lec.email && (
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          <span>{lec.email}</span>
                        </div>
                      )}
                      {lec.phone && (
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          <span>{lec.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {lec.department || '—'}
                    </td>
                    <td className="px-6 py-4">
                      {lec.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                          <XCircle className="h-3.5 w-3.5" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(lec)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(lec.id)}
                        className="text-xs font-medium text-slate-500 hover:text-slate-800 underline"
                      >
                        {lec.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-slate-900">
              {editingLecturer ? 'Edit Lecturer' : 'Add New Lecturer'}
            </h2>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Dr. Aruni Perera"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Employee Code
                  </label>
                  <input
                    type="text"
                    value={employeeCode}
                    onChange={(e) => setEmployeeCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                    placeholder="LEC-001"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Software Engineering"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="aruni.p@sparkline.ac"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="+94771234567"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-500 shadow-md shadow-cyan-600/20"
                >
                  Save Lecturer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
