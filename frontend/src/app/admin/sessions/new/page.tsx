'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { Room, AcademicModule, Lecturer, SessionType } from '@/types';
import { Calendar, ArrowLeft, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export default function NewSessionPage() {
  const router = useRouter();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [modules, setModules] = useState<AcademicModule[]>([]);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [roomId, setRoomId] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [lecturerId, setLecturerId] = useState('');
  const [title, setTitle] = useState('');
  const [sessionType, setSessionType] = useState<SessionType>('LECTURE');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOptions() {
      try {
        const [rRes, mRes, lRes] = await Promise.all([
          apiFetch<Room[]>('/rooms'),
          apiFetch<AcademicModule[]>('/modules'),
          apiFetch<Lecturer[]>('/lecturers'),
        ]);

        const activeRooms = rRes.filter((r) => r.isActive);
        const activeModules = mRes.filter((m) => m.isActive);
        const activeLecturers = lRes.filter((l) => l.isActive);

        setRooms(activeRooms);
        setModules(activeModules);
        setLecturers(activeLecturers);

        if (activeRooms.length > 0) setRoomId(activeRooms[0].id);
        if (activeModules.length > 0) setModuleId(activeModules[0].id);
        if (activeLecturers.length > 0) setLecturerId(activeLecturers[0].id);
      } catch (err) {
        console.error('Failed to load options:', err);
      } finally {
        setLoadingOptions(false);
      }
    }

    loadOptions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError(null);
    setLoading(true);

    try {
      const startDateTime = new Date(`${date}T${startTime}:00`).toISOString();
      const endDateTime = new Date(`${date}T${endTime}:00`).toISOString();

      await apiFetch('/sessions', {
        method: 'POST',
        body: JSON.stringify({
          roomId,
          moduleId,
          lecturerId,
          title,
          sessionType,
          startDateTime,
          endDateTime,
          notes: notes || undefined,
        }),
      });

      router.push('/admin/sessions');
    } catch (err: any) {
      setConflictError(err.message || 'Schedule conflict or validation error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/sessions"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="h-7 w-7 text-cyan-600" />
            <span>Schedule New Lecture Session</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Backend automatically validates lecture hall schedule conflicts
          </p>
        </div>
      </div>

      {conflictError && (
        <div className="p-5 bg-rose-50 border-2 border-rose-300 text-rose-800 rounded-2xl flex items-start gap-3 shadow-md">
          <AlertCircle className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-base text-rose-900">Schedule Conflict Detected</h3>
            <p className="text-sm leading-relaxed">{conflictError}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Session Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g. Software Architecture Principles & Patterns"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lecture Room *
              </label>
              <select
                required
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.code} ({r.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Module *
              </label>
              <select
                required
                value={moduleId}
                onChange={(e) => setModuleId(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.code} — {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lecturer *
              </label>
              <select
                required
                value={lecturerId}
                onChange={(e) => setLecturerId(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {lecturers.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Session Type
              </label>
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value as SessionType)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="LECTURE">Lecture</option>
                <option value="TUTORIAL">Tutorial</option>
                <option value="PRACTICAL">Practical</option>
                <option value="LABORATORY">Laboratory</option>
                <option value="EXAM">Exam</option>
                <option value="MEETING">Meeting</option>
                <option value="EVENT">Event</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Start Time *
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                End Time *
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Session Notes / Instructions
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              rows={3}
              placeholder="e.g. Bring laptops for hands-on lab exercises..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              href="/admin/sessions"
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || loadingOptions}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-md shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? 'Validating Schedule...' : 'Schedule Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
