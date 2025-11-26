import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { exams, grades, subjects, teachers } from '@/data/mockData';
import { FileText, Check, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'sonner';

const Exams = () => {
  const handleVerify = (examId: string) => {
    toast.success('Exam verified successfully!');
  };

  const handleReject = (examId: string) => {
    toast.error('Exam rejected');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-success">Verified</Badge>;
      case 'submitted':
        return <Badge className="bg-warning">Pending Verification</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Exams Management</h1>
          <p className="text-muted-foreground mt-1">Review and verify examinations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Exams</p>
                <p className="text-3xl font-bold text-foreground">{exams.length}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Verification</p>
                <p className="text-3xl font-bold text-warning">
                  {exams.filter(e => e.status === 'submitted').length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-warning" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-3xl font-bold text-success">
                  {exams.filter(e => e.verified).length}
                </p>
              </div>
              <Check className="h-8 w-8 text-success" />
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">All Examinations</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map((exam) => {
                const subject = subjects.find(s => s.id === exam.subjectId);
                const grade = grades.find(g => g.id === exam.gradeId);
                const teacher = teachers.find(t => t.id === exam.teacherId);

                return (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.name}</TableCell>
                    <TableCell>{subject?.name}</TableCell>
                    <TableCell>{grade?.name}</TableCell>
                    <TableCell>{teacher?.name}</TableCell>
                    <TableCell>Term {exam.term}</TableCell>
                    <TableCell>{new Date(exam.date).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(exam.status)}</TableCell>
                    <TableCell className="text-right">
                      {exam.status === 'submitted' && (
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleVerify(exam.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Verify
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(exam.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                      {exam.status === 'verified' && (
                        <Button size="sm" variant="ghost">
                          View Results
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Exams;
