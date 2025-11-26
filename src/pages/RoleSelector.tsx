import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRole } from '@/utils/roleContext';
import { useNavigate } from 'react-router-dom';
import { Role, User } from '@/data/mockData';
import { ShieldCheck, Users, GraduationCap, UserCircle, Baby } from 'lucide-react';

const roles: Array<{ role: Role; label: string; description: string; icon: typeof ShieldCheck }> = [
  {
    role: 'super-admin',
    label: 'Super Admin',
    description: 'Full system access and control',
    icon: ShieldCheck,
  },
  {
    role: 'admin',
    label: 'Admin',
    description: 'Administrative access',
    icon: Users,
  },
  {
    role: 'teacher',
    label: 'Teacher',
    description: 'Manage classes and assessments',
    icon: GraduationCap,
  },
  {
    role: 'parent',
    label: 'Parent',
    description: 'View child progress',
    icon: UserCircle,
  },
  {
    role: 'student',
    label: 'Student',
    description: 'View personal records',
    icon: Baby,
  },
];

const RoleSelector = () => {
  const { setRole } = useRole();
  const navigate = useNavigate();

  const handleRoleSelect = (role: Role) => {
    const mockUser: User = {
      id: `user-${role}`,
      name: role === 'super-admin' ? 'Admin User' : 
            role === 'teacher' ? 'John Kamau' :
            role === 'parent' ? 'James Mwangi' :
            role === 'student' ? 'Brian Mwangi' : 'Admin User',
      email: `${role}@getmore.edu`,
      role: role,
    };
    
    setRole(role, mockUser);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-5xl w-full space-y-6 sm:space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Getmore Educational Community Centre</h1>
          <p className="text-lg sm:text-xl text-muted-foreground">CBC School Management System</p>
          <p className="text-sm text-muted-foreground">Select a role to continue (Mock Authentication)</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {roles.map(({ role, label, description, icon: Icon }) => (
            <Card
              key={role}
              className="p-6 hover:shadow-xl transition-all hover:scale-105 cursor-pointer group"
              onClick={() => handleRoleSelect(role)}
            >
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{description}</p>
                </div>
                <Button className="w-full" variant="outline">
                  Login as {label}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>This is a frontend prototype with mock data only.</p>
          <p>No real authentication or backend connection.</p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
