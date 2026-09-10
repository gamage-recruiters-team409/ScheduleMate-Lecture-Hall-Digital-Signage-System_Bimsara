import type { ReactNode } from 'react';

type NavItem = { id: string; label: string; icon: ReactNode };

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <GridIcon /> },
  { id: 'buildings', label: 'Locations', icon: <BuildingIcon /> },
  { id: 'rooms', label: 'Rooms & Labs', icon: <DoorIcon /> },
  { id: 'modules', label: 'Modules', icon: <BookIcon /> },
  { id: 'lecturers', label: 'Lecturers', icon: <UserGroupIcon /> },
  { id: 'schedules', label: 'Schedules', icon: <CalendarIcon /> },
  { id: 'livestatus', label: 'Live Status', icon: <SignalIcon /> },
  { id: 'displays', label: 'Displays', icon: <MonitorIcon /> },
  { id: 'auditlog', label: 'Audit Log', icon: <ClockIcon /> },
];

type Props = { active: string; onNavigate: (id: string) => void; title: string; children: ReactNode; onSignagePreview?: () => void };

export default function AdminShell({ active, onNavigate, title, children, onSignagePreview }: Props) {
  return (
    <div className="flex h-full bg-[#F8F9FC] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 flex flex-col bg-[#0F1729] text-white overflow-y-auto">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-md bg-blue-500">
              <svg viewBox="0 0 16 16" className="size-4 fill-white" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="5" height="5" rx="1" />
                <rect x="9" y="2" width="5" height="5" rx="1" />
                <rect x="2" y="9" width="5" height="5" rx="1" />
                <rect x="9" y="9" width="2" height="5" rx="1" />
                <rect x="12" y="9" width="2" height="2" rx="0.5" />
                <rect x="12" y="12" width="2" height="2" rx="0.5" />
              </svg>
            </div>
            <span className="text-sm font-700 tracking-tight">ScheduleMate</span>
          </div>
          <p className="text-[10px] text-white/40 mt-1.5 font-500">Sparkline Academy</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-all ${
                active === item.id
                  ? 'bg-blue-600 text-white font-600'
                  : 'text-white/60 hover:bg-white/8 hover:text-white'
              }`}
            >
              <span className="shrink-0 opacity-80">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/10">
          {onSignagePreview && (
            <button
              onClick={onSignagePreview}
              className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/50 hover:bg-white/8 hover:text-white transition-colors"
            >
              <svg viewBox="0 0 16 16" className="size-3.5 fill-current shrink-0"><rect x="1" y="2" width="14" height="10" rx="1.5" /><path d="M5 13h6M8 12v1.5" stroke="white" strokeWidth="1.2" fill="none" /></svg>
              Preview Signage
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 shrink-0 flex items-center justify-between px-6 bg-white border-b border-slate-200">
          <h1 className="text-[15px] font-700 text-slate-900">{title}</h1>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <svg viewBox="0 0 16 16" className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 fill-none stroke-slate-400" strokeWidth={1.5}>
                <circle cx="7" cy="7" r="4.5" /><path d="M11 11l2.5 2.5" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                placeholder="Search…"
                className="w-52 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
              />
            </div>
            {/* Bell */}
            <button className="relative flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
              <svg viewBox="0 0 16 16" className="size-4 fill-none stroke-current" strokeWidth={1.5}>
                <path d="M8 2a5 5 0 0 1 5 5v2l1 2H2l1-2V7a5 5 0 0 1 5-5z" /><path d="M6.5 13a1.5 1.5 0 0 0 3 0" strokeLinecap="round" />
              </svg>
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-red-500" />
            </button>
            {/* Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="size-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-700">A</div>
              <div className="hidden md:block">
                <p className="text-xs font-600 text-slate-800 leading-none">Admin</p>
                <p className="text-[10px] text-slate-400 leading-none mt-0.5">admin@sparkline.ac</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

function GridIcon() {
  return <svg viewBox="0 0 16 16" className="size-4 fill-current"><rect x="1" y="1" width="6" height="6" rx="1" /><rect x="9" y="1" width="6" height="6" rx="1" /><rect x="1" y="9" width="6" height="6" rx="1" /><rect x="9" y="9" width="6" height="6" rx="1" /></svg>;
}
function BuildingIcon() {
  return <svg viewBox="0 0 16 16" className="size-4 fill-current"><path d="M2 14V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v10M8 14V7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7M1 14h14" fillRule="evenodd" /></svg>;
}
function DoorIcon() {
  return <svg viewBox="0 0 16 16" className="size-4 fill-current"><rect x="3" y="1" width="10" height="14" rx="1" /><circle cx="11" cy="8" r="1" fill="white" /></svg>;
}
function BookIcon() {
  return <svg viewBox="0 0 16 16" className="size-4 fill-current"><path d="M3 1h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zm0 1v12h8a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H3zm2 3h4v1H5V5zm0 2.5h4v1H5v-1zm0 2.5h2.5v1H5V10z" /></svg>;
}
function UserGroupIcon() {
  return <svg viewBox="0 0 16 16" className="size-4 fill-current"><path d="M5.5 7a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM1 14c0-2.5 2-4 4.5-4S10 11.5 10 14H1zm9-7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm.5 1a3.5 3.5 0 0 1 3.5 3.5V14h-3c0-1.2-.4-2.3-1.1-3.1A4.5 4.5 0 0 1 10.5 8z" /></svg>;
}
function CalendarIcon() {
  return <svg viewBox="0 0 16 16" className="size-4 fill-current"><rect x="1" y="3" width="14" height="12" rx="1.5" /><path d="M5 1v3M11 1v3M1 7h14" stroke="white" strokeWidth="1.2" fill="none" /></svg>;
}
function SignalIcon() {
  return <svg viewBox="0 0 16 16" className="size-4 fill-current"><path d="M8 3a9 9 0 0 1 6.36 2.64 1 1 0 1 1-1.42 1.42A7 7 0 0 0 8 5a7 7 0 0 0-4.94 2.06 1 1 0 0 1-1.42-1.42A9 9 0 0 1 8 3zm0 4a5 5 0 0 1 3.54 1.46 1 1 0 1 1-1.42 1.42 3 3 0 0 0-4.24 0 1 1 0 0 1-1.42-1.42A5 5 0 0 1 8 7zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" /></svg>;
}
function MonitorIcon() {
  return <svg viewBox="0 0 16 16" className="size-4 fill-none stroke-current" strokeWidth="1.4"><rect x="1" y="1.5" width="14" height="10" rx="1.5" /><path d="M5 13h6M8 11.5V13" strokeLinecap="round" /></svg>;
}
function ClockIcon() {
  return <svg viewBox="0 0 16 16" className="size-4 fill-none stroke-current" strokeWidth="1.4"><circle cx="8" cy="8" r="6.5" /><path d="M8 4.5V8l2.5 2" strokeLinecap="round" /></svg>;
}
