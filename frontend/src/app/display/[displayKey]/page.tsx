'use client';

import { use, useState, useEffect } from 'react';
import { useSignagePolling } from '@/hooks/useSignagePolling';
import {
  Clock,
  Calendar,
  User,
  BookOpen,
  MapPin,
  AlertTriangle,
  WifiOff,
  CheckCircle2,
  Sparkles,
  Info,
} from 'lucide-react';

export default function SignageDisplayPage({
  params: paramsPromise,
}: {
  params: Promise<{ displayKey: string }>;
}) {
  const { displayKey } = use(paramsPromise);
  const { data, loading, error, isStale, lastRefreshed } = useSignagePolling(displayKey);

  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      );
      setDateStr(
        now.toLocaleDateString(undefined, {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
      );
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center space-y-4">
        <div className="h-16 w-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center animate-pulse">
          <Sparkles className="h-8 w-8 text-cyan-400" />
        </div>
        <div className="text-xl font-medium text-slate-300">
          Connecting to Digital Signage Display System...
        </div>
        <div className="text-xs text-slate-500 font-mono">Display Key: {displayKey}</div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="h-20 w-20 rounded-3xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
          <AlertTriangle className="h-10 w-10 text-rose-400" />
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Display Configuration Not Found
          </h1>
          <p className="text-slate-400 text-sm">{error}</p>
        </div>
        <div className="text-xs text-slate-600 font-mono">
          Please verify display key <code className="text-rose-400">{displayKey}</code> in Admin Settings.
        </div>
      </div>
    );
  }

  // Room Scope single display vs Building multi-room display
  const isSingleRoom = data?.display.scopeType === 'ROOM';
  const room = data?.room;
  const currentSession = data?.currentSession;
  const nextSession = data?.nextSession;
  const occupancyStatus = data?.occupancyStatus || 'AVAILABLE';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 md:p-10 select-none overflow-hidden relative font-sans">
      {/* Background Glow Effects */}
      <div
        className={`absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-all duration-1000 ${
          occupancyStatus === 'OCCUPIED'
            ? 'bg-rose-600/15'
            : occupancyStatus === 'UPCOMING_SOON'
            ? 'bg-amber-500/15'
            : 'bg-emerald-500/15'
        }`}
      />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="flex items-center justify-between z-10 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>Sparkline Academy</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-cyan-400 border border-slate-700">
                Digital Signage
              </span>
            </h1>
            <div className="flex items-center gap-3 text-sm text-slate-400 mt-0.5">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <MapPin className="h-4 w-4 text-cyan-400" />
                {isSingleRoom ? room?.name || room?.code : data?.display.name}
              </span>
              {isSingleRoom && room?.side?.floor && (
                <span className="text-slate-500">
                  • {room.side.floor.building?.code} {room.side.floor.name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Live Clock & Connection Indicator */}
        <div className="flex items-center gap-6 text-right">
          {isStale && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold animate-pulse">
              <WifiOff className="h-4 w-4" />
              <span>Offline / Stale Data</span>
            </div>
          )}

          <div>
            <div className="text-3xl md:text-4xl font-extrabold tracking-tight font-mono text-white">
              {timeStr}
            </div>
            <div className="text-xs text-slate-400 font-medium">{dateStr}</div>
          </div>
        </div>
      </header>

      {/* Main Display Area */}
      <main className="my-auto py-8 z-10">
        {isSingleRoom ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Occupancy Status Banner & Current Session (2 Cols) */}
            <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
              {/* Status Header Badge */}
              <div
                className={`p-7 lg:p-8 rounded-3xl border backdrop-blur-xl transition-all ${
                  occupancyStatus === 'OCCUPIED'
                    ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                    : occupancyStatus === 'UPCOMING_SOON'
                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                    : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`h-5 w-5 rounded-full animate-ping ${
                        occupancyStatus === 'OCCUPIED'
                          ? 'bg-rose-500'
                          : occupancyStatus === 'UPCOMING_SOON'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                    <span className="text-2xl md:text-3xl font-black uppercase tracking-wider">
                      {occupancyStatus === 'OCCUPIED'
                        ? 'Lecture In Session'
                        : occupancyStatus === 'UPCOMING_SOON'
                        ? 'Next Lecture Starting Soon'
                        : 'Hall Available'}
                    </span>
                  </div>
                  <span className="text-sm font-mono px-4 py-1.5 rounded-full bg-slate-900/70 border border-slate-700 text-slate-200">
                    Room Capacity: <strong className="text-white">{room?.capacity ?? '—'} Seats</strong>
                  </span>
                </div>
              </div>

              {/* Current Session Card */}
              {currentSession ? (
                <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-10 lg:p-12 space-y-8 shadow-2xl backdrop-blur-xl flex-1 flex flex-col justify-between min-h-[420px]">
                  <div>
                    <div className="flex items-center gap-3 text-cyan-400 font-mono font-bold text-base">
                      <BookOpen className="h-6 w-6" />
                      <span>{currentSession.module?.code} — {currentSession.module?.name}</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mt-4 leading-tight">
                      {currentSession.title}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-slate-800 flex items-center justify-center text-cyan-400">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Lecturer</div>
                        <div className="text-lg md:text-xl font-extrabold text-slate-100">
                          {currentSession.lecturer?.fullName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-slate-800 flex items-center justify-center text-cyan-400">
                        <Clock className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Scheduled Time</div>
                        <div className="text-lg md:text-xl font-black text-white font-mono">
                          {new Date(currentSession.startDateTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {' - '}
                          {new Date(currentSession.endDateTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {currentSession.notes && (
                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-sm text-slate-300 flex items-start gap-2.5">
                      <Info className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{currentSession.notes}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-14 text-center space-y-4 flex-1 flex flex-col justify-center items-center min-h-[420px]">
                  <div className="h-20 w-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-extrabold text-white">No Lecture Currently Running</h3>
                    <p className="text-slate-400 text-base mt-2 max-w-lg">
                      This lecture hall is open for quiet study or upcoming session preparation.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Next Session Column (1 Col) */}
            <div className="space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 lg:p-10 space-y-6 flex flex-col justify-between h-full min-h-[480px]">
                <div>
                  <h3 className="text-base font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2.5">
                    <Calendar className="h-5 w-5 text-cyan-400" />
                    <span>Up Next Today</span>
                  </h3>

                  {nextSession ? (
                    <div className="mt-6 p-6 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-5">
                      <div className="text-sm font-mono text-cyan-400 font-bold">
                        {nextSession.module?.code}
                      </div>
                      <h4 className="text-2xl font-black text-white leading-snug">
                        {nextSession.title}
                      </h4>

                      <div className="space-y-3 text-sm text-slate-400 pt-3 border-t border-slate-800">
                        <div className="flex items-center justify-between">
                          <span>Lecturer:</span>
                          <strong className="text-slate-100 font-bold">{nextSession.lecturer?.fullName}</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Time:</span>
                          <strong className="text-white font-mono font-bold text-base">
                            {new Date(nextSession.startDateTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </strong>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 p-8 rounded-2xl bg-slate-950/40 border border-slate-800/60 text-center text-sm text-slate-500">
                      No further lectures scheduled for today.
                    </div>
                  )}
                </div>

                <div className="text-center text-xs text-slate-500 border-t border-slate-800/80 pt-4">
                  Refreshed every {data?.display.refreshIntervalSeconds || 30} seconds
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Multi-room Area Display */
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Area Rooms Occupancy Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data?.rooms?.map((rmStatus) => (
                <div
                  key={rmStatus.room.id}
                  className="bg-slate-900/95 border border-slate-800 rounded-3xl p-8 space-y-5 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-white font-mono">
                      {rmStatus.room.code}
                    </span>
                    <span
                      className={`text-sm font-bold px-3.5 py-1 rounded-full ${
                        rmStatus.occupancyStatus === 'OCCUPIED'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {rmStatus.occupancyStatus}
                    </span>
                  </div>

                  {rmStatus.currentSession ? (
                    <div className="space-y-2">
                      <div className="text-lg font-extrabold text-slate-100 leading-snug">
                        {rmStatus.currentSession.title}
                      </div>
                      <div className="text-sm text-slate-400 font-medium">
                        {rmStatus.currentSession.lecturer?.fullName}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500 italic py-2">No active session</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer Bar */}
      <footer className="flex items-center justify-between z-10 pt-4 border-t border-slate-800/80 text-xs text-slate-500">
        <div>ScheduleMate Digital Signage • Sparkline Academy</div>
        <div>Server Time Sync: {data?.serverTime ? new Date(data.serverTime).toLocaleTimeString() : 'Syncing...'}</div>
      </footer>
    </div>
  );
}
