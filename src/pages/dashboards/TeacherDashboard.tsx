import { StatCard } from '@/components/common/StatCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Users, Calendar } from 'lucide-react';
import { useRole } from '@/utils/roleContext';
import { teachers, students, exams, grades, subjects, getExamsByTeacherId } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

export const TeacherDashboard = () => {
  const { currentUser } = useRole();
  const navigate = useNavigate();
  
  const teacher = teachers.find(t => t.email === currentUser?.email);
  const myExams = teacher ? getExamsByTeacherId(teacher.id) : [];
  const myGrades = teacher?.assignedGrades || [];
  const myStudents = students.filter(s => myGrades.includes(s.gradeId));

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Teacher Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {currentUser?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="My Classes"
          value={myGrades.length}
          icon={BookOpen}
          color="primary"
        />
        <StatCard
          title="Total Students"
          value={myStudents.length}
          icon={Users}
          color="secondary"
        />
        <StatCard
          title="My Exams"
          value={myExams.length}
          icon={FileText}
          color="accent"
        />
        <StatCard
          title="Pending Verification"
          value={myExams.filter(e => !e.verified).length}
          icon={Calendar}
          color="primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">My Assigned Classes</h3>
          <div className="space-y-3">
            {myGrades.map(gradeId => {
              const grade = grades.find(g => g.id === gradeId);
              const studentCount = students.filter(s => s.gradeId === gradeId).length;
              return (
                <div
                  key={gradeId}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => navigate('/my-classes')}
                >
                  <div>
                    <p className="font-medium">{grade?.name}</p>
                    <p className="text-sm text-muted-foreground">{studentCount} students</p>
                  </div>
                  <Button size="sm" variant="ghost">View →</Button>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button onClick={() => navigate('/my-exams')} className="w-full justify-start" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Create New Exam
            </Button>
            <Button onClick={() => navigate('/my-exams')} className="w-full justify-start" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Enter Exam Results
            </Button>
            <Button onClick={() => navigate('/my-timetable')} className="w-full justify-start" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              View My Timetable
            </Button>
            <Button onClick={() => navigate('/library')} className="w-full justify-start" variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Browse Library
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">My Teaching Subjects</h3>
        <div className="flex flex-wrap gap-3">
          {teacher?.subjects.map(subjectId => {
            const subject = subjects.find(s => s.id === subjectId);
            return (
              <div key={subjectId} className="px-4 py-2 bg-primary/10 text-primary rounded-full">
                {subject?.name}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
