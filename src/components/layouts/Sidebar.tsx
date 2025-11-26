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

  const getNavItems = () => {
    switch (currentRole) {
      case 'super-admin':
      case 'admin':
        return [
          { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/students', icon: Users, label: 'Students' },
          { to: '/teachers', icon: GraduationCap, label: 'Teachers' },
          { to: '/classes', icon: BookOpen, label: 'Classes & Subjects' },
          { to: '/exams', icon: FileText, label: 'Exams' },
          { to: '/timetable', icon: Calendar, label: 'Timetable' },
          { to: '/library', icon: Library, label: 'Library' },
          { to: '/settings', icon: Settings, label: 'Settings' },
        ];
      case 'teacher':
        return [
          { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/my-classes', icon: BookOpen, label: 'My Classes' },
          { to: '/my-exams', icon: FileText, label: 'My Exams' },
          { to: '/my-timetable', icon: Calendar, label: 'My Timetable' },
          { to: '/library', icon: Library, label: 'Library' },
        ];
      case 'parent':
        return [
          { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/my-children', icon: Users, label: 'My Children' },
          { to: '/library', icon: Library, label: 'Library' },
        ];
      case 'student':
        return [
          { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/my-profile', icon: UserCircle, label: 'My Profile' },
          { to: '/my-assessments', icon: ClipboardList, label: 'Assessments' },
          { to: '/my-timetable', icon: Calendar, label: 'Timetable' },
          { to: '/library', icon: Library, label: 'Library' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
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
  );
};
