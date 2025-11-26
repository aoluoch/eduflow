import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { grades, students, getStudentsByGradeId, academicTerms, getAssessmentsByStudentId } from '@/data/mockData';
import { ArrowRight, AlertTriangle, CheckCircle2, Users, TrendingUp } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'sonner';

const StudentPromotion = () => {
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const currentTerm = academicTerms.find(t => t.current);
  const isTermThree = currentTerm?.name.includes('Term 3');

  const studentsInGrade = selectedGrade ? getStudentsByGradeId(selectedGrade) : [];
  const selectedGradeData = grades.find(g => g.id === selectedGrade);
  const currentGradeIndex = grades.findIndex(g => g.id === selectedGrade);
  const nextGrade = currentGradeIndex >= 0 && currentGradeIndex < grades.length - 1 
    ? grades[currentGradeIndex + 1] 
    : null;

  const isLastGrade = currentGradeIndex === grades.length - 1;

  // Validation: Check if students have completed assessments
  const getStudentStatus = (studentId: string) => {
    const assessments = getAssessmentsByStudentId(studentId);
    const term3Assessments = assessments.filter(a => a.term === 3);
    
    if (term3Assessments.length === 0) {
      return { ready: false, reason: 'No Term 3 assessments' };
    }
    
    if (term3Assessments.length < 3) {
      return { ready: false, reason: 'Incomplete assessments' };
    }
    
    return { ready: true, reason: 'Ready for promotion' };
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
    } else {
      // Only select students who are ready for promotion
      const eligibleStudents = studentsInGrade
        .filter(s => getStudentStatus(s.id).ready)
        .map(s => s.id);
      setSelectedStudents(eligibleStudents);
    }
    setSelectAll(!selectAll);
  };

  const toggleStudent = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handlePromote = () => {
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student to promote');
      return;
    }

    if (!isTermThree) {
      toast.error('Student promotion is only allowed in Term 3');
      return;
    }

    if (isLastGrade) {
      toast.error('Cannot promote students from the final grade');
      return;
    }

    setConfirmDialogOpen(true);
  };

  const confirmPromotion = () => {
    toast.success(`Successfully promoted ${selectedStudents.length} student(s) to ${nextGrade?.name}!`);
    setSelectedStudents([]);
    setSelectAll(false);
    setConfirmDialogOpen(false);
  };

  const readyCount = studentsInGrade.filter(s => getStudentStatus(s.id).ready).length;
  const notReadyCount = studentsInGrade.length - readyCount;

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Student Promotion</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Promote students to the next grade level</p>
        </div>

        {/* Validation Warning */}
        {!isTermThree && (
          <Card className="p-4 bg-warning/10 border-warning">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
              <div>
                <p className="font-semibold text-warning">Promotion Period Restriction</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Student promotions can only be processed during Term 3. Current term: {currentTerm?.name}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Current Term Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Term</p>
                <p className="text-2xl font-bold text-foreground">{currentTerm?.name}</p>
              </div>
              {isTermThree ? (
                <CheckCircle2 className="h-8 w-8 text-success" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-warning" />
              )}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Selected Students</p>
                <p className="text-2xl font-bold text-primary">{selectedStudents.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Promotion Status</p>
                <p className="text-2xl font-bold text-foreground">
                  {isTermThree ? 'Active' : 'Inactive'}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-secondary" />
            </div>
          </Card>
        </div>

        {/* Grade Selection */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Select Source Grade</h3>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder="Choose a grade to promote from" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  {grades.slice(0, -1).map(grade => (
                    <SelectItem key={grade.id} value={grade.id}>
                      {grade.name} ({getStudentsByGradeId(grade.id).length} students)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedGrade && (
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">From</p>
                  <p className="font-semibold text-lg">{selectedGradeData?.name}</p>
                </div>
                <ArrowRight className="h-6 w-6 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">To</p>
                  <p className="font-semibold text-lg">
                    {isLastGrade ? 'Graduation' : nextGrade?.name}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Student List */}
        {selectedGrade && studentsInGrade.length > 0 && (
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Students in {selectedGradeData?.name}</h3>
                  <div className="flex gap-4 mt-2">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-success">{readyCount} ready</span> for promotion
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-warning">{notReadyCount} not ready</span>
                    </p>
                  </div>
                </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-2">
                    <Button
                    variant="outline"
                    onClick={handleSelectAll}
                    disabled={!isTermThree}
                  >
                    {selectAll ? 'Deselect All' : 'Select All Eligible'}
                  </Button>
                  <Button
                    onClick={handlePromote}
                    disabled={selectedStudents.length === 0 || !isTermThree || isLastGrade}
                  >
                    Promote {selectedStudents.length > 0 && `(${selectedStudents.length})`}
                  </Button>
                </div>
              </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectAll}
                          onCheckedChange={handleSelectAll}
                          disabled={!isTermThree}
                        />
                      </TableHead>
                      <TableHead>Admission No.</TableHead>
                      <TableHead className="hidden sm:table-cell">Name</TableHead>
                      <TableHead className="sm:hidden">Student</TableHead>
                      <TableHead className="hidden md:table-cell">Gender</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Term 3 Assessments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentsInGrade.map((student) => {
                      const status = getStudentStatus(student.id);
                      const assessments = getAssessmentsByStudentId(student.id);
                      const term3Count = assessments.filter(a => a.term === 3).length;

                      return (
                        <TableRow key={student.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedStudents.includes(student.id)}
                              onCheckedChange={() => toggleStudent(student.id)}
                              disabled={!status.ready || !isTermThree}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{student.admissionNumber}</TableCell>
                          <TableCell className="hidden sm:table-cell">{student.name}</TableCell>
                          <TableCell className="sm:hidden">
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-xs text-muted-foreground">{student.gender}</p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{student.gender}</TableCell>
                          <TableCell>
                            {status.ready ? (
                              <Badge className="bg-success">Ready</Badge>
                            ) : (
                              <Badge variant="outline" className="text-warning border-warning">
                                Not Ready
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex flex-col">
                              <span className={term3Count >= 3 ? 'text-success' : 'text-warning'}>
                                {term3Count} completed
                              </span>
                              {!status.ready && (
                                <span className="text-xs text-muted-foreground">
                                  {status.reason}
                                </span>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
              </Table>
            </div>
          </Card>
        )}

        {selectedGrade && studentsInGrade.length === 0 && (
          <Card className="p-8">
            <div className="text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No students found in this grade</p>
            </div>
          </Card>
        )}

        {/* Promotion Guidelines */}
        <Card className="p-6 bg-muted/30">
          <h4 className="font-semibold mb-3">Promotion Guidelines</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              <span>Students must complete at least 3 assessments in Term 3</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              <span>Promotions can only be processed during Term 3 academic period</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              <span>Bulk promotion allows selecting multiple students at once</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
              <span>Students in the final grade cannot be promoted (graduation required)</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
              <span>A confirmation dialog will appear before finalizing promotions</span>
            </li>
          </ul>
        </Card>

        {/* Confirmation Dialog */}
        <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Student Promotion</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to promote {selectedStudents.length} student(s) from{' '}
                <strong>{selectedGradeData?.name}</strong> to{' '}
                <strong>{nextGrade?.name}</strong>.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="my-4 p-4 bg-muted rounded-lg space-y-2">
              <p className="font-semibold text-sm">Promotion Summary:</p>
              <div className="text-sm space-y-1">
                <p>• Number of students: {selectedStudents.length}</p>
                <p>• Source grade: {selectedGradeData?.name}</p>
                <p>• Target grade: {nextGrade?.name}</p>
                <p>• Academic term: {currentTerm?.name}</p>
              </div>
            </div>

            <div className="p-3 bg-warning/10 border border-warning/20 rounded">
              <p className="text-sm text-warning font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                This action cannot be undone
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Students will be moved to the next grade level and their grade assignments will be updated.
              </p>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmPromotion}
                className="bg-primary hover:bg-primary/90"
              >
                Confirm Promotion
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default StudentPromotion;
