import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useRole } from '@/utils/roleContext';
import { SuperAdminDashboard } from './dashboards/SuperAdminDashboard';
import { TeacherDashboard } from './dashboards/TeacherDashboard';
import { ParentDashboard } from './dashboards/ParentDashboard';

const Dashboard = () => {
  const { currentRole } = useRole();

  const renderDashboard = () => {
    switch (currentRole) {
      case 'super-admin':
      case 'admin':
        return <SuperAdminDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'parent':
        return <ParentDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
};

export default Dashboard;
