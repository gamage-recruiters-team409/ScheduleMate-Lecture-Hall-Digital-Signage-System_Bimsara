'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { Side, Floor } from '@/types';
import { Columns, Plus, Edit2, CheckCircle2, XCircle, AlertCircle, Layers } from 'lucide-react';

export default function SidesPage() {
  const [sides, setSides] = useState<Side[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [selectedFloorId, setSelectedFloorId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSide, setEditingSide] = useState<Side | null>(null);

  const [floorId, setFloorId] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchSides = async (fId?: string) => {
    try {
      const url = fId ? `/sides?floorId=${fId}` : '/sides';
      const res = await apiFetch<Side[]>(url);
      setSides(res);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFloors = async () => {
    try {
      const res = await apiFetch<Floor[]>('/floors');
      setFloors(res);
      if (res.length > 0 && !floorId) {
        setFloorId(res[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFloors();
    fetchSides();
  }, []);

  const handleFilterChange = (fId: string) => {
    setSelectedFloorId(fId);
    fetchSides(fId);
  };

  const openCreateModal = () => {
    setEditingSide(null);
    setName('');
    setCode('');
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (side: Side) => {
    setEditingSide(side);
    setFloorId(side.floorId);
    setName(side.name);
    setCode(side.code || '');
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingSide) {
        await apiFetch(`/sides/${editingSide.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ floorId, name, code }),
        });
      } else {
        await apiFetch('/sides', {
          method: 'POST',
          body: JSON.stringify({ floorId, name, code }),
        });
      }

      setModalOpen(false);
      fetchSides(selectedFloorId);
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await apiFetch(`/sides/${id}/status`, { method: 'PATCH' });
      fetchSides(selectedFloorId);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Columns className="h-7 w-7 text-cyan-600" />
            <span>Building Wings & Sides</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage floor wings & directional sections
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedFloorId}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
            >
              <option value="">All Floors</option>
              {floors.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.building?.name} — {f.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-sm shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Side / Wing</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Building & Floor</th>
                <th className="px-6 py-4">Side Name</th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Rooms</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    Loading sides...
                  </td>
                </tr>
              ) : sides.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    No sides found.
                  </td>
                </tr>
              ) : (
                sides.map((side) => (
                  <tr key={side.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-2">
                      <Layers className="h-4 w-4 text-slate-400" />
                      <span>
                        {side.floor?.building?.code} — {side.floor?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">{side.name}</td>
                    <td className="px-6 py-4 font-mono font-bold text-cyan-600">
                      {side.code || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {side._count?.rooms ?? 0} Rooms
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {side.isActive ? (
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
                        onClick={() => openEditModal(side)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(side.id)}
                        className="text-xs font-medium text-slate-500 hover:text-slate-800 underline"
                      >
                        {side.isActive ? 'Deactivate' : 'Activate'}
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
              {editingSide ? 'Edit Side / Wing' : 'Add New Side / Wing'}
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
                  Floor *
                </label>
                <select
                  required
                  value={floorId}
                  onChange={(e) => setFloorId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {floors.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.building?.name} — {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Side Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="East Wing / West Wing"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Side Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  placeholder="EW / WW"
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
                  Save Side
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
