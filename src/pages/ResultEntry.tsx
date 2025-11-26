import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CBCBadge } from '@/components/common/CBCBadge';
import { useState, useEffect } from 'react';
import { useRole } from '@/utils/roleContext';
import { 
  exams, 
  grades, 
  subjects, 
  teachers, 
  getStudentsByGradeId, 
  CBCLevel 
} from '@/data/mockData';
import { Save, CheckCircle2, AlertCircle, Calculator } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { toast } from 'sonner';

interface StudentResult {
  studentId: string;
  marks: string;
  percentage: number;
  cbcLevel: CBCLevel | null;
}

const calculateCBCLevel = (percentage: number): CBCLevel => {
  if (percentage >= 80) return 'EE'; // Exceeds Expectations
  if (percentage >= 50) return 'ME'; // Meets Expectations
  return 'BE'; // Below Expectations
};

const ResultEntry = () => {
  const { currentUser } = useRole();
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [results, setResults] = useState<Map<string, StudentResult>>(new Map());
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const teacher = teachers.find(t => t.email === currentUser?.email);
  const verifiedExams = exams.filter(e => e.verified && e.teacherId === teacher?.id);
  
  const selectedExamData = exams.find(e => e.id === selectedExam);
  const examGrade = selectedExamData ? grades.find(g => g.id === selectedExamData.gradeId) : null;
  const examSubject = selectedExamData ? subjects.find(s => s.id === selectedExamData.subjectId) : null;
  const studentsInGrade = selectedExamData ? getStudentsByGradeId(selectedExamData.gradeId) : [];

  // Initialize results when exam changes
  useEffect(() => {
    if (selectedExam) {
      const newResults = new Map<string, StudentResult>();
      studentsInGrade.forEach(student => {
        newResults.set(student.id, {
          studentId: student.id,
          marks: '',
          percentage: 0,
          cbcLevel: null,
        });
      });
      setResults(newResults);
      setUnsavedChanges(false);
    }
  }, [selectedExam]);

  const handleMarksChange = (studentId: string, value: string) => {
    // Only allow numbers
    if (value && !/^\d*\.?\d*$/.test(value)) return;

    const marks = parseFloat(value) || 0;
    const totalMarks = selectedExamData?.totalMarks || 100;

    // Prevent marks exceeding total
    if (marks > totalMarks) {
      toast.error(`Marks cannot exceed ${totalMarks}`);
      return;
    }

    const percentage = (marks / totalMarks) * 100;
    const cbcLevel = marks > 0 ? calculateCBCLevel(percentage) : null;

    const newResults = new Map(results);
    newResults.set(studentId, {
      studentId,
      marks: value,
      percentage,
      cbcLevel,
    });
    setResults(newResults);
    setUnsavedChanges(true);
  };

  const handleSaveResults = () => {
    // Check if all students have marks entered
    const allEntered = Array.from(results.values()).every(r => r.marks !== '');
    
    if (!allEntered) {
      toast.error('Please enter marks for all students before saving');
      return;
    }

    setSaveDialogOpen(true);
  };

  const confirmSave = () => {
    toast.success(`Results saved successfully for ${studentsInGrade.length} students!`);
    setUnsavedChanges(false);
    setSaveDialogOpen(false);
  };

  const calculateClassStats = () => {
    const validResults = Array.from(results.values()).filter(r => r.marks !== '');
    if (validResults.length === 0) return null;

    const totalMarks = validResults.reduce((sum, r) => sum + parseFloat(r.marks), 0);
    const average = totalMarks / validResults.length;
    const averagePercentage = (average / (selectedExamData?.totalMarks || 100)) * 100;

    const eeCount = validResults.filter(r => r.cbcLevel === 'EE').length;
    const meCount = validResults.filter(r => r.cbcLevel === 'ME').length;
    const beCount = validResults.filter(r => r.cbcLevel === 'BE').length;

    return {
      average: average.toFixed(1),
      averagePercentage: averagePercentage.toFixed(1),
      eeCount,
      meCount,
      beCount,
      totalEntered: validResults.length,
    };
  };

  const stats = calculateClassStats();

  const getCBCColor = (level: CBCLevel | null) => {
    if (!level) return '';
    switch (level) {
      case 'EE': return 'text-success font-semibold';
      case 'ME': return 'text-warning font-semibold';
      case 'BE': return 'text-destructive font-semibold';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Result Entry</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Enter examination marks and view CBC grading</p>
        </div>

        {/* Exam Selection */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Verified Exam</label>
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger className="w-full max-w-2xl">
                  <SelectValue placeholder="Choose an exam to enter results" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  {verifiedExams.length > 0 ? (
                    verifiedExams.map(exam => {
                      const grade = grades.find(g => g.id === exam.gradeId);
                      const subject = subjects.find(s => s.id === exam.subjectId);
                      return (
                        <SelectItem key={exam.id} value={exam.id}>
                          {exam.name} - {grade?.name} - {subject?.name} (Term {exam.term})
                        </SelectItem>
                      );
                    })
                  ) : (
                    <SelectItem value="none" disabled>
                      No verified exams available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {selectedExamData && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Exam</p>
                  <p className="font-semibold">{selectedExamData.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Grade</p>
                  <p className="font-semibold">{examGrade?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Subject</p>
                  <p className="font-semibold">{examSubject?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Marks</p>
                  <p className="font-semibold">{selectedExamData.totalMarks}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Class Statistics */}
        {selectedExam && stats && stats.totalEntered > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Class Average</p>
                  <p className="text-2xl font-bold text-primary">{stats.averagePercentage}%</p>
                  <p className="text-xs text-muted-foreground">{stats.average} marks</p>
                </div>
                <Calculator className="h-8 w-8 text-primary" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Exceeds Expectations</p>
                  <p className="text-2xl font-bold text-success">{stats.eeCount}</p>
                  <p className="text-xs text-muted-foreground">80% and above</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Meets Expectations</p>
                  <p className="text-2xl font-bold text-warning">{stats.meCount}</p>
                  <p className="text-xs text-muted-foreground">50% - 79%</p>
                </div>
                <AlertCircle className="h-8 w-8 text-warning" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Below Expectations</p>
                  <p className="text-2xl font-bold text-destructive">{stats.beCount}</p>
                  <p className="text-xs text-muted-foreground">Below 50%</p>
                </div>
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
            </Card>
          </div>
        )}

        {/* Student Results Table */}
        {selectedExam && studentsInGrade.length > 0 && (
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Student Results</h3>
                  <p className="text-sm text-muted-foreground">
                    {stats?.totalEntered || 0} of {studentsInGrade.length} students entered
                  </p>
                </div>
                <Button
                  onClick={handleSaveResults}
                  disabled={!unsavedChanges}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save All Results
                </Button>
              </div>

              {unsavedChanges && (
                <div className="p-3 bg-warning/10 border border-warning/20 rounded flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-warning" />
                  <p className="text-sm text-warning">You have unsaved changes</p>
                </div>
              )}

              <div className="border rounded-lg overflow-x-auto -mx-4 sm:mx-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">#</TableHead>
                      <TableHead>Admission No.</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead className="w-40">Marks (/{selectedExamData?.totalMarks})</TableHead>
                      <TableHead className="w-24">Percentage</TableHead>
                      <TableHead>CBC Level</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentsInGrade.map((student, index) => {
                      const result = results.get(student.id);
                      
                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>{student.admissionNumber}</TableCell>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.gender}</TableCell>
                          <TableCell>
                            <Input
                              type="text"
                              inputMode="decimal"
                              value={result?.marks || ''}
                              onChange={(e) => handleMarksChange(student.id, e.target.value)}
                              placeholder="0"
                              className="w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <span className={getCBCColor(result?.cbcLevel || null)}>
                              {result?.marks ? `${result.percentage.toFixed(1)}%` : '-'}
                            </span>
                          </TableCell>
                          <TableCell>
                            {result?.cbcLevel ? (
                              <CBCBadge level={result.cbcLevel} />
                            ) : (
                              <Badge variant="outline">Not Entered</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        )}

        {selectedExam && studentsInGrade.length === 0 && (
          <Card className="p-8">
            <div className="text-center text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No students found in this grade</p>
            </div>
          </Card>
        )}

        {!selectedExam && verifiedExams.length > 0 && (
          <Card className="p-8">
            <div className="text-center text-muted-foreground">
              <Calculator className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Select an exam to begin entering results</p>
            </div>
          </Card>
        )}

        {verifiedExams.length === 0 && (
          <Card className="p-8">
            <div className="text-center text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium mb-2">No verified exams available</p>
              <p className="text-sm">Create an exam and wait for admin verification to enter results</p>
            </div>
          </Card>
        )}

        {/* CBC Grading Reference */}
        <Card className="p-4 sm:p-6 bg-muted/30">
          <h4 className="font-semibold mb-3 text-sm sm:text-base">CBC Grading Reference</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <div className="p-3 bg-background rounded border-l-4 border-success">
              <p className="font-semibold text-success">EE - Exceeds Expectations</p>
              <p className="text-sm text-muted-foreground">80% - 100%</p>
              <p className="text-xs text-muted-foreground mt-1">
                Learner demonstrates outstanding performance
              </p>
            </div>
            <div className="p-3 bg-background rounded border-l-4 border-warning">
              <p className="font-semibold text-warning">ME - Meets Expectations</p>
              <p className="text-sm text-muted-foreground">50% - 79%</p>
              <p className="text-xs text-muted-foreground mt-1">
                Learner demonstrates satisfactory performance
              </p>
            </div>
            <div className="p-3 bg-background rounded border-l-4 border-destructive">
              <p className="font-semibold text-destructive">BE - Below Expectations</p>
              <p className="text-sm text-muted-foreground">0% - 49%</p>
              <p className="text-xs text-muted-foreground mt-1">
                Learner needs additional support
              </p>
            </div>
          </div>
        </Card>

        {/* Save Confirmation Dialog */}
        <AlertDialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Save Exam Results</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to save results for {studentsInGrade.length} students.
              </AlertDialogDescription>
            </AlertDialogHeader>

            {stats && (
              <div className="my-4 p-4 bg-muted rounded-lg space-y-2">
                <p className="font-semibold text-sm">Results Summary:</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p>• Class Average: {stats.averagePercentage}%</p>
                  <p>• EE: {stats.eeCount} students</p>
                  <p>• ME: {stats.meCount} students</p>
                  <p>• BE: {stats.beCount} students</p>
                </div>
              </div>
            )}

            <div className="p-3 bg-primary/10 border border-primary/20 rounded">
              <p className="text-sm text-primary font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Results will be visible to students and parents
              </p>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmSave}
                className="bg-primary hover:bg-primary/90"
              >
                Confirm & Save
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default ResultEntry;
