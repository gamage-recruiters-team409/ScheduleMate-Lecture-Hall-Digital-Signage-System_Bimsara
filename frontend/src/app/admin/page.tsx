'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { ScheduledSession, Building, Room, DisplayConfiguration } from '@/types';
import {
  Calendar,
  Building2,
  DoorClosed,
  Monitor,
  Plus,
  Clock,
  UserCheck,
  BookOpen,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [sessions, setSessions] = useState<ScheduledSession[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [displays, setDisplays] = useState<DisplayConfiguration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [sessionsRes, buildingsRes, roomsRes, displaysRes] = await Promise.all([
          apiFetch<ScheduledSession[]>('/sessions'),
          apiFetch<Building[]>('/buildings'),
          apiFetch<Room[]>('/rooms'),
          apiFetch<DisplayConfiguration[]>('/display-configurations'),
        ]);

        setSessions(sessionsRes);
        setBuildings(buildingsRes);
        setRooms(roomsRes);
        setDisplays(displaysRes);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const scheduledCount = sessions.filter((s) => s.status === 'SCHEDULED').length;
  const activeBuildingsCount = buildings.filter((b) => b.isActive).length;
  const activeRoomsCount = rooms.filter((r) => r.isActive).length;
  const activeDisplaysCount = displays.filter((d) => d.isActive).length;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            System Overview Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Centralized lecture hall scheduling & digital display management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/sessions/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-sm shadow-md shadow-cyan-500/20 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Schedule Session</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{scheduledCount}</div>
            <div className="text-xs font-medium text-slate-500">Scheduled Sessions</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{activeBuildingsCount}</div>
            <div className="text-xs font-medium text-slate-500">Active Buildings</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
            <DoorClosed className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{activeRoomsCount}</div>
            <div className="text-xs font-medium text-slate-500">Lecture Rooms</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Monitor className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{activeDisplaysCount}</div>
            <div className="text-xs font-medium text-slate-500">Digital Signage Displays</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Scheduled Sessions + Digital Displays */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sessions Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-cyan-600" />
                <h2 className="font-bold text-slate-900">Upcoming & Today&apos;s Sessions</h2>
              </div>
              <Link
                href="/admin/sessions"
                className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
              >
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="p-8 text-center text-sm text-slate-500">Loading sessions...</div>
              ) : sessions.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  No sessions scheduled yet. Click &quot;Schedule Session&quot; to create one.
                </div>
              ) : (
                sessions.slice(0, 5).map((session) => (
                  <div key={session.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">
                          {session.title}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 font-medium text-slate-600">
                          {session.module?.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Room: <strong className="text-slate-700">{session.room?.code}</strong></span>
                        <span>Lecturer: <strong className="text-slate-700">{session.lecturer?.fullName}</strong></span>
                      </div>
                    </div>

                    <div className="text-right text-xs">
                      <div className="font-bold text-slate-800">
                        {new Date(session.startDateTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {' - '}
                        {new Date(session.endDateTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="text-slate-500 mt-0.5">
                        {new Date(session.startDateTime).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Digital Signage Displays Column */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-cyan-400" />
                <h2 className="font-bold text-white">Live Digital Displays</h2>
              </div>
              <span className="text-xs text-cyan-400 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                30s Auto-Poll
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Click any display preview below to launch the unauthenticated public digital signage screen outside lecture halls:
            </p>

            <div className="space-y-3 pt-2">
              {displays.length === 0 ? (
                <div className="text-xs text-slate-500">No display screens configured yet.</div>
              ) : (
                displays.map((disp) => (
                  <Link
                    key={disp.id}
                    href={`/display/${disp.displayKey}`}
                    target="_blank"
                    className="block p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-slate-200 group-hover:text-cyan-400 transition-colors">
                        {disp.name}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span>Key: <code className="text-cyan-300 font-mono">{disp.displayKey}</code></span>
                      <span>Target: <strong className="text-slate-300">{disp.room?.code || 'Building Scope'}</strong></span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
