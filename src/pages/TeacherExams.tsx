import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRole } from '@/utils/roleContext';
import { teachers, getExamsByTeacherId, grades, subjects } from '@/data/mockData';
import { Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from 'react';
import { toast } from 'sonner';

const TeacherExams = () => {
  const { currentUser } = useRole();
  const [dialogOpen, setDialogOpen] = useState(false);

  const teacher = teachers.find(t => t.email === currentUser?.email);
  const myExams = teacher ? getExamsByTeacherId(teacher.id) : [];
  const myGrades = teacher?.assignedGrades || [];
  const mySubjects = teacher?.subjects || [];

  const handleCreateExam = () => {
    toast.success('Exam created and submitted for verification!');
    setDialogOpen(false);
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Exams</h1>
            <p className="text-muted-foreground mt-1">Create and manage your examinations</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Exam
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Exam</DialogTitle>
                <DialogDescription>
                  Enter exam details for your assigned classes
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="exam-name">Exam Name</Label>
                  <Input id="exam-name" placeholder="Mid-Term Mathematics" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Select Grade</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {myGrades.map(gradeId => {
                        const grade = grades.find(g => g.id === gradeId);
                        return (
                          <SelectItem key={gradeId} value={gradeId}>
                            {grade?.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Select Subject</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {mySubjects.map(subjectId => {
                        const subject = subjects.find(s => s.id === subjectId);
                        return (
                          <SelectItem key={subjectId} value={subjectId}>
                            {subject?.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="term">Term</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Term 1</SelectItem>
                      <SelectItem value="2">Term 2</SelectItem>
                      <SelectItem value="3">Term 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total-marks">Total Marks</Label>
                  <Input id="total-marks" type="number" placeholder="100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Exam Date</Label>
                  <Input id="date" type="date" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Save as Draft
                </Button>
                <Button onClick={handleCreateExam}>
                  Submit for Verification
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">My Examinations</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myExams.length > 0 ? (
                myExams.map((exam) => {
                  const subject = subjects.find(s => s.id === exam.subjectId);
                  const grade = grades.find(g => g.id === exam.gradeId);

                  return (
                    <TableRow key={exam.id}>
                      <TableCell className="font-medium">{exam.name}</TableCell>
                      <TableCell>{subject?.name}</TableCell>
                      <TableCell>{grade?.name}</TableCell>
                      <TableCell>Term {exam.term}</TableCell>
                      <TableCell>{new Date(exam.date).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(exam.status)}</TableCell>
                      <TableCell className="text-right">
                        {exam.verified ? (
                          <Button size="sm" variant="default">
                            Enter Results
                          </Button>
                        ) : (
                          <Button size="sm" variant="ghost">
                            Edit
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No exams created yet. Click "Create Exam" to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TeacherExams;
