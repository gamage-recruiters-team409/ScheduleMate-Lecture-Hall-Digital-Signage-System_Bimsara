'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { DisplayConfiguration, Room, Building } from '@/types';
import { Monitor, Plus, Edit2, CheckCircle2, XCircle, AlertCircle, ExternalLink } from 'lucide-react';

export default function DisplayConfigsPage() {
  const [displays, setDisplays] = useState<DisplayConfiguration[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDisplay, setEditingDisplay] = useState<DisplayConfiguration | null>(null);

  const [name, setName] = useState('');
  const [displayKey, setDisplayKey] = useState('');
  const [roomId, setRoomId] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [refreshIntervalSeconds, setRefreshIntervalSeconds] = useState<number>(30);
  const [error, setError] = useState<string | null>(null);

  const fetchDisplays = async () => {
    try {
      const [dispRes, roomRes, bldRes] = await Promise.all([
        apiFetch<DisplayConfiguration[]>('/display-configurations'),
        apiFetch<Room[]>('/rooms'),
        apiFetch<Building[]>('/buildings'),
      ]);
      setDisplays(dispRes);
      setRooms(roomRes);
      setBuildings(bldRes);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisplays();
  }, []);

  const openCreateModal = () => {
    setEditingDisplay(null);
    setName('');
    setDisplayKey('');
    setRoomId('');
    setBuildingId('');
    setRefreshIntervalSeconds(30);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (disp: DisplayConfiguration) => {
    setEditingDisplay(disp);
    setName(disp.name);
    setDisplayKey(disp.displayKey);
    setRoomId(disp.roomId || '');
    setBuildingId(disp.buildingId || '');
    setRefreshIntervalSeconds(disp.refreshIntervalSeconds || 30);
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload: any = {
      name,
      displayKey,
      refreshIntervalSeconds: Number(refreshIntervalSeconds),
      roomId: roomId || undefined,
      buildingId: buildingId || undefined,
    };

    try {
      if (editingDisplay) {
        await apiFetch(`/display-configurations/${editingDisplay.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch('/display-configurations', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      setModalOpen(false);
      fetchDisplays();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await apiFetch(`/display-configurations/${id}/status`, { method: 'PATCH' });
      fetchDisplays();
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Monitor className="h-7 w-7 text-cyan-600" />
            <span>Digital Signage Display Screen Configs</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure screen displays, target rooms/buildings, & 30-second refresh intervals
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-sm shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Display Config</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Display Name</th>
                <th className="px-6 py-4">Display Key (URL)</th>
                <th className="px-6 py-4">Target Scope</th>
                <th className="px-6 py-4">Refresh Interval</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    Loading digital signage configurations...
                  </td>
                </tr>
              ) : displays.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    No display configurations added yet.
                  </td>
                </tr>
              ) : (
                displays.map((disp) => (
                  <tr key={disp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{disp.name}</td>
                    <td className="px-6 py-4 font-mono font-bold text-cyan-600">
                      {disp.displayKey}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-700">
                      {disp.room
                        ? `Room: ${disp.room.code}`
                        : disp.building
                        ? `Building: ${disp.building.code}`
                        : 'Global / Area Scope'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-100 text-slate-700">
                        {disp.refreshIntervalSeconds}s
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {disp.isActive ? (
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
                      <Link
                        href={`/display/${disp.displayKey}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 hover:text-cyan-700 underline"
                      >
                        Preview <ExternalLink className="h-3 w-3" />
                      </Link>
                      <button
                        onClick={() => openEditModal(disp)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(disp.id)}
                        className="text-xs font-medium text-slate-500 hover:text-slate-800 underline"
                      >
                        {disp.isActive ? 'Deactivate' : 'Activate'}
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
              {editingDisplay ? 'Edit Display Config' : 'Add New Display Config'}
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
                  Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="LH 101 Entrance Screen"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Display Key * (Unique URL Identifier)
                </label>
                <input
                  type="text"
                  required
                  value={displayKey}
                  onChange={(e) => setDisplayKey(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  placeholder="LH-101-MAIN"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Scope: Specific Room (Optional)
                </label>
                <select
                  value={roomId}
                  onChange={(e) => {
                    setRoomId(e.target.value);
                    if (e.target.value) setBuildingId('');
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">None (Select Building Scope below)</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      Room: {r.code} ({r.name})
                    </option>
                  ))}
                </select>
              </div>

              {!roomId && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Scope: Building Overview (Optional)
                  </label>
                  <select
                    value={buildingId}
                    onChange={(e) => setBuildingId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">None</option>
                    {buildings.map((b) => (
                      <option key={b.id} value={b.id}>
                        Building: {b.name} ({b.code})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Refresh Interval (Seconds)
                </label>
                <input
                  type="number"
                  min={5}
                  value={refreshIntervalSeconds}
                  onChange={(e) => setRefreshIntervalSeconds(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
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
                  Save Display Config
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
