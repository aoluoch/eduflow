import * as React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  FileText, 
  Calendar, 
  Library, 
  Settings,
  UserCircle,
  ClipboardList,
  TrendingUp,
  LogOut
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useRole } from '@/utils/roleContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export const Sidebar = () => {
  const { currentRole, currentUser, logout } = useRole();
  const [isOpen, setIsOpen] = React.useState(false);

  const getNavItems = () => {
    switch (currentRole) {
      case 'super-admin':
      case 'admin':
        return [
          { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/students', icon: Users, label: 'Students' },
          { to: '/teachers', icon: GraduationCap, label: 'Teachers' },
          { to: '/classes', icon: BookOpen, label: 'Classes & Subjects' },
          { to: '/promotion', icon: TrendingUp, label: 'Student Promotion' },
          { to: '/exams', icon: FileText, label: 'Exams' },
          { to: '/analytics', icon: TrendingUp, label: 'Analytics' },
          { to: '/timetable', icon: Calendar, label: 'Timetable' },
          { to: '/library', icon: Library, label: 'Library' },
          { to: '/settings', icon: Settings, label: 'Settings' },
        ];
      case 'teacher':
        return [
          { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/my-classes', icon: BookOpen, label: 'My Classes' },
          { to: '/my-exams', icon: FileText, label: 'My Exams' },
          { to: '/result-entry', icon: ClipboardList, label: 'Result Entry' },
          { to: '/my-timetable', icon: Calendar, label: 'My Timetable' },
          { to: '/library', icon: Library, label: 'Library' },
          { to: '/settings', icon: Settings, label: 'Settings' },
        ];
      case 'parent':
        return [
          { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/my-children', icon: Users, label: 'My Children' },
          { to: '/library', icon: Library, label: 'Library' },
          { to: '/settings', icon: Settings, label: 'Settings' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-sidebar rounded-md shadow-lg"
      >
        <svg
          className="w-6 h-6 text-sidebar-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <h1 className="text-xl font-bold text-sidebar-foreground">Getmore ECC</h1>
          <p className="text-xs text-sidebar-foreground/80 mt-1">School Management System</p>
        </div>

        <Separator className="bg-sidebar-border" />

        {currentUser && (
          <div className="p-4 bg-sidebar-accent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center">
                <span className="text-sidebar-primary-foreground font-semibold">
                  {currentUser.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{currentUser.name}</p>
                <p className="text-xs text-sidebar-foreground/70 capitalize">{currentRole?.replace('-', ' ')}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
              activeClassName="bg-sidebar-accent text-sidebar-foreground font-medium"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Button
            onClick={logout}
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
};
