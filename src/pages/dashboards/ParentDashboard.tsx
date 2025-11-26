import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRole } from '@/utils/roleContext';
import { parents, students, grades, getAssessmentsByStudentId } from '@/data/mockData';
import { Users, TrendingUp, FileText, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ParentDashboard = () => {
  const { currentUser } = useRole();
  const navigate = useNavigate();
  
  const parent = parents.find(p => p.email === currentUser?.email);
  const children = students.filter(s => parent?.children.includes(s.id));

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Parent Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {currentUser?.name}!</p>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          My Children
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {children.map(child => {
            const grade = grades.find(g => g.id === child.gradeId);
            const assessments = getAssessmentsByStudentId(child.id);
            const avgScore = assessments.length > 0
              ? (assessments.reduce((sum, a) => sum + (a.marks / a.totalMarks) * 100, 0) / assessments.length).toFixed(1)
              : 0;

            return (
              <Card key={child.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/student/${child.id}`)}>
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">{child.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{child.name}</p>
                      <p className="text-sm text-muted-foreground">{grade?.name}</p>
                      <p className="text-sm text-muted-foreground">Adm: {child.admissionNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{avgScore}%</p>
                    <p className="text-xs text-muted-foreground">Avg Score</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Profile
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Report Card
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Recent Notices
          </h3>
          <div className="space-y-4">
            <div className="pb-3 border-b">
              <p className="font-medium">Term 3 Exams Schedule</p>
              <p className="text-sm text-muted-foreground mt-1">
                End of term exams will commence on November 15th, 2024.
              </p>
              <p className="text-xs text-muted-foreground mt-2">Posted 2 days ago</p>
            </div>
            <div className="pb-3 border-b">
              <p className="font-medium">Parent-Teacher Meeting</p>
              <p className="text-sm text-muted-foreground mt-1">
                Scheduled for November 20th, 2024 at 10:00 AM.
              </p>
              <p className="text-xs text-muted-foreground mt-2">Posted 5 days ago</p>
            </div>
            <div>
              <p className="font-medium">Library Books Update</p>
              <p className="text-sm text-muted-foreground mt-1">
                New digital books have been added to the library system.
              </p>
              <p className="text-xs text-muted-foreground mt-2">Posted 1 week ago</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Fee Status
          </h3>
          {children.map(child => {
            const grade = grades.find(g => g.id === child.gradeId);
            return (
              <div key={child.id} className="mb-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium">{child.name}</p>
                    <p className="text-sm text-muted-foreground">{grade?.name}</p>
                  </div>
                  <span className="px-3 py-1 bg-success/10 text-success rounded-full text-sm">
                    Paid
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Term 3 Fees:</span>
                    <span className="font-medium">KES 15,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount Paid:</span>
                    <span className="text-success font-medium">KES 15,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Balance:</span>
                    <span className="font-medium">KES 0</span>
                  </div>
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
};
