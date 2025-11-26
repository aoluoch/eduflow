import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Navigate } from 'react-router-dom';
import { useRole } from '@/utils/roleContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { currentRole } = useRole();

  if (!currentRole) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
