import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CBCBadge } from '@/components/common/CBCBadge';
import { useRole } from '@/utils/roleContext';
import { students, grades, getAssessmentsByStudentId, subjects } from '@/data/mockData';
import { TrendingUp, FileText, Calendar, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StudentDashboard = () => {
  const { currentUser } = useRole();
  const navigate = useNavigate();
  
  const student = students.find(s => s.name === currentUser?.name);
  const grade = student ? grades.find(g => g.id === student.gradeId) : null;
  const assessments = student ? getAssessmentsByStudentId(student.id) : [];

  const avgScore = assessments.length > 0
    ? (assessments.reduce((sum, a) => sum + (a.marks / a.totalMarks) * 100, 0) / assessments.length).toFixed(1)
    : 0;

  const recentAssessments = assessments.slice(0, 5);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {currentUser?.name}!</p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{student?.name}</h2>
            <p className="text-muted-foreground mt-1">{grade?.name}</p>
            <p className="text-sm text-muted-foreground">Admission: {student?.admissionNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-primary">{avgScore}%</p>
            <p className="text-sm text-muted-foreground">Overall Average</p>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Button onClick={() => navigate('/my-profile')} variant="default">
            View Full Profile
          </Button>
          <Button onClick={() => navigate('/my-assessments')} variant="outline">
            All Assessments
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Recent Assessments
          </h3>
          <div className="space-y-3">
            {recentAssessments.length > 0 ? (
              recentAssessments.map(assessment => {
                const subject = subjects.find(s => s.id === assessment.subjectId);
                const percentage = ((assessment.marks / assessment.totalMarks) * 100).toFixed(1);
                return (
                  <div key={assessment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{subject?.name}</p>
                      <p className="text-sm text-muted-foreground">{assessment.examName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{percentage}%</p>
                      <CBCBadge level={assessment.cbcLevel} />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground text-center py-4">No assessments yet</p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Quick Links
          </h3>
          <div className="space-y-3">
            <Button onClick={() => navigate('/my-timetable')} className="w-full justify-start" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              My Timetable
            </Button>
            <Button onClick={() => navigate('/library')} className="w-full justify-start" variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Library
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Download Report Card
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Performance by Subject</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {subjects.slice(0, 4).map(subject => {
            const subjectAssessments = assessments.filter(a => a.subjectId === subject.id);
            const subjectAvg = subjectAssessments.length > 0
              ? (subjectAssessments.reduce((sum, a) => sum + (a.marks / a.totalMarks) * 100, 0) / subjectAssessments.length).toFixed(1)
              : 0;

            return (
              <div key={subject.id} className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-primary">{subjectAvg}%</p>
                <p className="text-sm text-muted-foreground mt-1">{subject.name}</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
