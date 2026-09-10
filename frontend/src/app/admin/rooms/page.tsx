'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { Room, Side, RoomType } from '@/types';
import { DoorClosed, Plus, Edit2, CheckCircle2, XCircle, AlertCircle, Users } from 'lucide-react';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [sides, setSides] = useState<Side[]>([]);
  const [selectedSideId, setSelectedSideId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const [sideId, setSideId] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [capacity, setCapacity] = useState<number>(100);
  const [roomType, setRoomType] = useState<RoomType>('LECTURE_HALL');
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async (sId?: string) => {
    try {
      const url = sId ? `/rooms?sideId=${sId}` : '/rooms';
      const res = await apiFetch<Room[]>(url);
      setRooms(res);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSides = async () => {
    try {
      const res = await apiFetch<Side[]>('/sides');
      setSides(res);
      if (res.length > 0 && !sideId) {
        setSideId(res[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSides();
    fetchRooms();
  }, []);

  const handleFilterChange = (sId: string) => {
    setSelectedSideId(sId);
    fetchRooms(sId);
  };

  const openCreateModal = () => {
    setEditingRoom(null);
    setName('');
    setCode('');
    setCapacity(100);
    setRoomType('LECTURE_HALL');
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (room: Room) => {
    setEditingRoom(room);
    setSideId(room.sideId);
    setName(room.name);
    setCode(room.code);
    setCapacity(room.capacity || 100);
    setRoomType(room.roomType);
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingRoom) {
        await apiFetch(`/rooms/${editingRoom.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ sideId, name, code, capacity: Number(capacity), roomType }),
        });
      } else {
        await apiFetch('/rooms', {
          method: 'POST',
          body: JSON.stringify({ sideId, name, code, capacity: Number(capacity), roomType }),
        });
      }

      setModalOpen(false);
      fetchRooms(selectedSideId);
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await apiFetch(`/rooms/${id}/status`, { method: 'PATCH' });
      fetchRooms(selectedSideId);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <DoorClosed className="h-7 w-7 text-cyan-600" />
            <span>Rooms & Lecture Halls</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage lecture halls, auditoriums, classrooms, & labs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedSideId}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
            >
              <option value="">All Sides / Wings</option>
              {sides.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.floor?.building?.code} — {s.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-sm shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Room</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Room Code & Name</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Capacity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    Loading rooms...
                  </td>
                </tr>
              ) : rooms.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    No rooms found.
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      <div className="font-mono text-cyan-600 font-bold">{room.code}</div>
                      <div className="text-xs text-slate-500 font-normal">{room.name}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      {room.side?.floor?.building?.code} → {room.side?.floor?.name} → {room.side?.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-50 text-cyan-800 border border-cyan-200">
                        {room.roomType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-slate-700 font-medium text-xs">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        {room.capacity ?? '—'} Seats
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {room.isActive ? (
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
                        onClick={() => openEditModal(room)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(room.id)}
                        className="text-xs font-medium text-slate-500 hover:text-slate-800 underline"
                      >
                        {room.isActive ? 'Deactivate' : 'Activate'}
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
              {editingRoom ? 'Edit Room' : 'Add New Room'}
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
                  Wing / Side *
                </label>
                <select
                  required
                  value={sideId}
                  onChange={(e) => setSideId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {sides.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.floor?.building?.name} — {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Room Code * (Unique)
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  placeholder="LH-101"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Room Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Lecture Hall 101"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Room Type
                  </label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value as RoomType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="LECTURE_HALL">Lecture Hall</option>
                    <option value="LABORATORY">Laboratory</option>
                    <option value="CLASSROOM">Classroom</option>
                    <option value="AUDITORIUM">Auditorium</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Capacity (Seats)
                  </label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
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
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
