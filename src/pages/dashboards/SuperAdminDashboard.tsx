import { StatCard } from '@/components/common/StatCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, GraduationCap, BookOpen, FileText, TrendingUp, Calendar } from 'lucide-react';
import { students, teachers, grades, exams } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

export const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  const pendingExams = exams.filter(e => !e.verified).length;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Super Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your school overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={students.length}
          icon={Users}
          color="primary"
          trend={{ value: '+12% this month', positive: true }}
        />
        <StatCard
          title="Total Teachers"
          value={teachers.length}
          icon={GraduationCap}
          color="secondary"
        />
        <StatCard
          title="Active Classes"
          value={grades.length}
          icon={BookOpen}
          color="accent"
        />
        <StatCard
          title="Pending Exams"
          value={pendingExams}
          icon={FileText}
          color="primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Button onClick={() => navigate('/students')} className="w-full justify-start" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Admit New Student
            </Button>
            <Button onClick={() => navigate('/teachers')} className="w-full justify-start" variant="outline">
              <GraduationCap className="h-4 w-4 mr-2" />
              Assign Teachers
            </Button>
            <Button onClick={() => navigate('/exams')} className="w-full justify-start" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Verify Exams ({pendingExams} pending)
            </Button>
            <Button onClick={() => navigate('/timetable')} className="w-full justify-start" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Generate Timetable
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-3 border-b">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New student admitted</p>
                <p className="text-xs text-muted-foreground">Daniel Kipchoge - Grade 1</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-3 border-b">
              <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Exam verified</p>
                <p className="text-xs text-muted-foreground">Mid-Term Mathematics - Grade 1</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Teacher assigned</p>
                <p className="text-xs text-muted-foreground">Grace Akinyi - Grade 4 & 5</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Enrollment by Grade</h3>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-4">
          {grades.map(grade => {
            const count = students.filter(s => s.gradeId === grade.id).length;
            return (
              <div key={grade.id} className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-primary">{count}</p>
                <p className="text-xs text-muted-foreground mt-1">{grade.name}</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
