'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { ScheduledSession, Room, SessionStatus } from '@/types';
import { Calendar, Plus, Ban, CheckCircle2, AlertCircle, Search, Filter, Clock } from 'lucide-react';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<ScheduledSession[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedRoomId) params.set('roomId', selectedRoomId);
      if (selectedStatus) params.set('status', selectedStatus);
      if (search) params.set('search', search);

      const queryString = params.toString();
      const url = queryString ? `/sessions?${queryString}` : '/sessions';
      const res = await apiFetch<ScheduledSession[]>(url);
      setSessions(res);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await apiFetch<Room[]>('/rooms');
      setRooms(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchSessions();
  }, [selectedRoomId, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSessions();
  };

  const handleCancelSession = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to CANCEL the session "${title}"?\nCancelled sessions will no longer occupy the room.`)) {
      return;
    }

    try {
      await apiFetch(`/sessions/${id}/cancel`, { method: 'PATCH' });
      fetchSessions();
    } catch (err: any) {
      setError(err.message || 'Failed to cancel session');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="h-7 w-7 text-cyan-600" />
            <span>Scheduled Lecture Sessions</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage room schedules, conflict-checked bookings, & cancellations
          </p>
        </div>
        <Link
          href="/admin/sessions/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-sm shadow-md shadow-cyan-500/20 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule New Session</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2 border border-red-200">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2 w-full">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, module, lecturer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">All Lecture Rooms</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.code} ({r.name})
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-36">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">All Statuses</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Session Title & Module</th>
                <th className="px-6 py-4">Room</th>
                <th className="px-6 py-4">Lecturer</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    Loading sessions...
                  </td>
                </tr>
              ) : sessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    No sessions match the selected criteria.
                  </td>
                </tr>
              ) : (
                sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      <div>{session.title}</div>
                      <div className="text-xs text-cyan-700 font-mono font-medium mt-0.5">
                        {session.module?.code} — {session.module?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-800">
                      {session.room?.code}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {session.lecturer?.fullName}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="font-bold text-slate-900">
                        {new Date(session.startDateTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        -{' '}
                        {new Date(session.endDateTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="text-slate-500 mt-0.5">
                        {new Date(session.startDateTime).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {session.status === 'SCHEDULED' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Scheduled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                          <Ban className="h-3.5 w-3.5" />
                          Cancelled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {session.status === 'SCHEDULED' && (
                        <button
                          onClick={() => handleCancelSession(session.id, session.title)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          <Ban className="h-3.5 w-3.5" />
                          Cancel Session
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
