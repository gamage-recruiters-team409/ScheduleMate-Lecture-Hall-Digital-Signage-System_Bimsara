import { useState } from 'react';
import Login from './components/admin/Login';
import AdminShell from './components/admin/AdminShell';
import Dashboard from './components/admin/Dashboard';
import BuildingManagement from './components/admin/BuildingManagement';
import RoomsLabs from './components/admin/RoomsLabs';
import Modules from './components/admin/Modules';
import Lecturers from './components/admin/Lecturers';
import ScheduleManagement from './components/admin/ScheduleManagement';
import CreateSession from './components/admin/CreateSession';
import LiveStatus from './components/admin/LiveStatus';
import DisplayConfig from './components/admin/DisplayConfig';
import AuditLog from './components/admin/AuditLog';
import SignageViewer from './components/signage/SignageViewer';

type Page =
  | 'login'
  | 'dashboard'
  | 'buildings'
  | 'rooms'
  | 'modules'
  | 'lecturers'
  | 'schedules'
  | 'create-session'
  | 'livestatus'
  | 'displays'
  | 'auditlog'
  | 'signage';

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  buildings: 'Locations',
  rooms: 'Rooms & Laboratories',
  modules: 'Module Management',
  lecturers: 'Lecturer Management',
  schedules: 'Schedule Management',
  'create-session': 'Create Session',
  livestatus: 'Live Room Status',
  displays: 'Display Devices',
  auditlog: 'Audit Log',
};

export default function App() {
  const [page, setPage] = useState<Page>('login');
  const [prevPage, setPrevPage] = useState<Page>('dashboard');

  const navigate = (to: Page) => {
    setPrevPage(page);
    setPage(to);
  };

  if (page === 'login') {
    return <Login onLogin={() => navigate('dashboard')} />;
  }

  if (page === 'signage') {
    return <SignageViewer onBack={() => navigate(prevPage === 'signage' ? 'displays' : prevPage)} />;
  }

  const renderContent = () => {
    switch (page) {
      case 'dashboard': return <Dashboard onNavigate={p => navigate(p as Page)} />;
      case 'buildings': return <BuildingManagement />;
      case 'rooms': return <RoomsLabs />;
      case 'modules': return <Modules />;
      case 'lecturers': return <Lecturers />;
      case 'schedules': return <ScheduleManagement onCreateSession={() => navigate('create-session')} />;
      case 'create-session': return <CreateSession onBack={() => navigate('schedules')} />;
      case 'livestatus': return <LiveStatus />;
      case 'displays': return <DisplayConfig onPreviewSignage={() => navigate('signage')} />;
      case 'auditlog': return <AuditLog />;
      default: return <Dashboard onNavigate={p => navigate(p as Page)} />;
    }
  };

  return (
    <AdminShell
      active={page === 'create-session' ? 'schedules' : page}
      onNavigate={p => navigate(p as Page)}
      title={pageTitles[page] ?? 'ScheduleMate'}
      onSignagePreview={() => navigate('signage')}
    >
      {renderContent()}
    </AdminShell>
  );
}
