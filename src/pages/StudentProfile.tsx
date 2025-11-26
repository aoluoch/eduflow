import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CBCBadge } from '@/components/common/CBCBadge';
import { useParams } from 'react-router-dom';
import { students, grades, subjects, getAssessmentsByStudentId } from '@/data/mockData';
import { Download, Printer, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const StudentProfile = () => {
  const { id } = useParams();
  const student = students.find(s => s.id === id);
  const grade = student ? grades.find(g => g.id === student.gradeId) : null;
  const assessments = student ? getAssessmentsByStudentId(student.id) : [];

  const assessmentsByTerm = {
    1: assessments.filter(a => a.term === 1),
    2: assessments.filter(a => a.term === 2),
    3: assessments.filter(a => a.term === 3),
  };

  const handlePrintReport = () => {
    toast.success('Generating report card...');
  };

  const handleDownloadReport = () => {
    toast.success('Downloading report card...');
  };

  if (!student) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <p>Student not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const avgScore = assessments.length > 0
    ? (assessments.reduce((sum, a) => sum + (a.marks / a.totalMarks) * 100, 0) / assessments.length).toFixed(1)
    : 0;

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{student.name}</h1>
            <p className="text-muted-foreground mt-1">Admission No: {student.admissionNumber}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrintReport}>
              <Printer className="h-4 w-4 mr-2" />
              Print Report
            </Button>
            <Button onClick={handleDownloadReport}>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Student Details</h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Grade</p>
                <p className="font-medium">{grade?.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Gender</p>
                <p className="font-medium">{student.gender}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{new Date(student.dateOfBirth).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Overall Performance</h3>
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <p className="text-5xl font-bold text-primary">{avgScore}%</p>
                <p className="text-sm text-muted-foreground mt-2">Average Score</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Assessments</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Term 1:</span>
                <span className="font-medium">{assessmentsByTerm[1].length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Term 2:</span>
                <span className="font-medium">{assessmentsByTerm[2].length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Term 3:</span>
                <span className="font-medium">{assessmentsByTerm[3].length}</span>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Assessment History</h3>
          </div>

          {[1, 2, 3].map(term => (
            <div key={term} className="mb-6 last:mb-0">
              <h4 className="font-semibold text-primary mb-3">Term {term}</h4>
              {assessmentsByTerm[term as keyof typeof assessmentsByTerm].length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Exam Name</TableHead>
                      <TableHead>Marks</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>CBC Level</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assessmentsByTerm[term as keyof typeof assessmentsByTerm].map(assessment => {
                      const subject = subjects.find(s => s.id === assessment.subjectId);
                      const percentage = ((assessment.marks / assessment.totalMarks) * 100).toFixed(1);
                      return (
                        <TableRow key={assessment.id}>
                          <TableCell className="font-medium">{subject?.name}</TableCell>
                          <TableCell>{assessment.examName}</TableCell>
                          <TableCell>{assessment.marks}/{assessment.totalMarks}</TableCell>
                          <TableCell>{percentage}%</TableCell>
                          <TableCell>
                            <CBCBadge level={assessment.cbcLevel} />
                          </TableCell>
                          <TableCell>{new Date(assessment.date).toLocaleDateString()}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-sm py-4">No assessments for this term</p>
              )}
            </div>
          ))}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Trend (Mock Chart)</h3>
          <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-2" />
              <p>Performance trend chart would appear here</p>
              <p className="text-sm">(Mock visualization)</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
