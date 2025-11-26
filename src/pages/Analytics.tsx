import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { 
  grades, 
  subjects, 
  students, 
  assessments, 
  getAssessmentsByStudentId,
  getStudentsByGradeId 
} from '@/data/mockData';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Award, 
  BarChart3,
  Download,
  Filter
} from 'lucide-react';
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
import { CBCBadge } from '@/components/common/CBCBadge';
import { toast } from 'sonner';

const Analytics = () => {
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedTerm, setSelectedTerm] = useState<string>('all');

  // Calculate analytics based on filters
  const getFilteredAssessments = () => {
    return assessments.filter(a => {
      if (selectedGrade !== 'all') {
        const student = students.find(s => s.id === a.studentId);
        if (student?.gradeId !== selectedGrade) return false;
      }
      if (selectedSubject !== 'all' && a.subjectId !== selectedSubject) return false;
      if (selectedTerm !== 'all' && a.term.toString() !== selectedTerm) return false;
      return true;
    });
  };

  const filteredAssessments = getFilteredAssessments();

  // Overall statistics
  const calculateOverallStats = () => {
    if (filteredAssessments.length === 0) return null;

    const totalPercentages = filteredAssessments.map(a => (a.marks / a.totalMarks) * 100);
    const average = totalPercentages.reduce((sum, p) => sum + p, 0) / totalPercentages.length;

    const eeCount = filteredAssessments.filter(a => a.cbcLevel === 'EE').length;
    const meCount = filteredAssessments.filter(a => a.cbcLevel === 'ME').length;
    const beCount = filteredAssessments.filter(a => a.cbcLevel === 'BE').length;

    return {
      average: average.toFixed(1),
      totalAssessments: filteredAssessments.length,
      eeCount,
      meCount,
      beCount,
      eePercentage: ((eeCount / filteredAssessments.length) * 100).toFixed(1),
      mePercentage: ((meCount / filteredAssessments.length) * 100).toFixed(1),
      bePercentage: ((beCount / filteredAssessments.length) * 100).toFixed(1),
    };
  };

  // Subject-wise performance
  const calculateSubjectPerformance = () => {
    const subjectStats = subjects.map(subject => {
      const subjectAssessments = filteredAssessments.filter(a => a.subjectId === subject.id);
      if (subjectAssessments.length === 0) return null;

      const totalPercentages = subjectAssessments.map(a => (a.marks / a.totalMarks) * 100);
      const average = totalPercentages.reduce((sum, p) => sum + p, 0) / totalPercentages.length;

      const eeCount = subjectAssessments.filter(a => a.cbcLevel === 'EE').length;
      const meCount = subjectAssessments.filter(a => a.cbcLevel === 'ME').length;
      const beCount = subjectAssessments.filter(a => a.cbcLevel === 'BE').length;

      return {
        subject,
        average: average.toFixed(1),
        count: subjectAssessments.length,
        eeCount,
        meCount,
        beCount,
      };
    }).filter(s => s !== null);

    return subjectStats.sort((a, b) => parseFloat(b!.average) - parseFloat(a!.average));
  };

  // Grade-level statistics
  const calculateGradeStats = () => {
    const gradeStats = grades.map(grade => {
      const studentsInGrade = getStudentsByGradeId(grade.id);
      const gradeAssessments = filteredAssessments.filter(a => {
        const student = students.find(s => s.id === a.studentId);
        return student?.gradeId === grade.id;
      });

      if (gradeAssessments.length === 0) return null;

      const totalPercentages = gradeAssessments.map(a => (a.marks / a.totalMarks) * 100);
      const average = totalPercentages.reduce((sum, p) => sum + p, 0) / totalPercentages.length;

      return {
        grade,
        studentCount: studentsInGrade.length,
        assessmentCount: gradeAssessments.length,
        average: average.toFixed(1),
      };
    }).filter(g => g !== null);

    return gradeStats.sort((a, b) => parseFloat(b!.average) - parseFloat(a!.average));
  };

  // Students needing intervention
  const identifyAtRiskStudents = () => {
    const studentPerformance = students.map(student => {
      const studentAssessments = getAssessmentsByStudentId(student.id);
      
      // Apply filters
      const filteredStudentAssessments = studentAssessments.filter(a => {
        if (selectedGrade !== 'all' && student.gradeId !== selectedGrade) return false;
        if (selectedSubject !== 'all' && a.subjectId !== selectedSubject) return false;
        if (selectedTerm !== 'all' && a.term.toString() !== selectedTerm) return false;
        return true;
      });

      if (filteredStudentAssessments.length === 0) return null;

      const totalPercentages = filteredStudentAssessments.map(a => (a.marks / a.totalMarks) * 100);
      const average = totalPercentages.reduce((sum, p) => sum + p, 0) / totalPercentages.length;

      const beCount = filteredStudentAssessments.filter(a => a.cbcLevel === 'BE').length;
      const bePercentage = (beCount / filteredStudentAssessments.length) * 100;

      const grade = grades.find(g => g.id === student.gradeId);

      return {
        student,
        grade,
        average: average.toFixed(1),
        beCount,
        bePercentage: bePercentage.toFixed(1),
        totalAssessments: filteredStudentAssessments.length,
        isAtRisk: average < 50 || bePercentage > 50,
      };
    }).filter(s => s !== null && s.isAtRisk);

    return studentPerformance.sort((a, b) => parseFloat(a!.average) - parseFloat(b!.average));
  };

  // Top performers
  const identifyTopPerformers = () => {
    const studentPerformance = students.map(student => {
      const studentAssessments = getAssessmentsByStudentId(student.id);
      
      const filteredStudentAssessments = studentAssessments.filter(a => {
        if (selectedGrade !== 'all' && student.gradeId !== selectedGrade) return false;
        if (selectedSubject !== 'all' && a.subjectId !== selectedSubject) return false;
        if (selectedTerm !== 'all' && a.term.toString() !== selectedTerm) return false;
        return true;
      });

      if (filteredStudentAssessments.length < 2) return null;

      const totalPercentages = filteredStudentAssessments.map(a => (a.marks / a.totalMarks) * 100);
      const average = totalPercentages.reduce((sum, p) => sum + p, 0) / totalPercentages.length;

      const eeCount = filteredStudentAssessments.filter(a => a.cbcLevel === 'EE').length;
      const eePercentage = (eeCount / filteredStudentAssessments.length) * 100;

      const grade = grades.find(g => g.id === student.gradeId);

      return {
        student,
        grade,
        average: average.toFixed(1),
        eeCount,
        eePercentage: eePercentage.toFixed(1),
        totalAssessments: filteredStudentAssessments.length,
      };
    }).filter(s => s !== null);

    return studentPerformance
      .sort((a, b) => parseFloat(b!.average) - parseFloat(a!.average))
      .slice(0, 10);
  };

  const overallStats = calculateOverallStats();
  const subjectPerformance = calculateSubjectPerformance();
  const gradeStats = calculateGradeStats();
  const atRiskStudents = identifyAtRiskStudents();
  const topPerformers = identifyTopPerformers();

  const handleExport = () => {
    toast.success('Analytics report exported successfully!');
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Assessment Analytics</h1>
            <p className="text-muted-foreground mt-1">Comprehensive performance analysis and insights</p>
          </div>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Grade</label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  <SelectItem value="all">All Grades</SelectItem>
                  {grades.map(grade => (
                    <SelectItem key={grade.id} value={grade.id}>{grade.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Term</label>
              <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  <SelectItem value="all">All Terms</SelectItem>
                  <SelectItem value="1">Term 1</SelectItem>
                  <SelectItem value="2">Term 2</SelectItem>
                  <SelectItem value="3">Term 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Overall Statistics */}
        {overallStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Average</p>
                  <p className="text-3xl font-bold text-primary">{overallStats.average}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Exceeds Expectations</p>
                  <p className="text-3xl font-bold text-success">{overallStats.eePercentage}%</p>
                  <p className="text-xs text-muted-foreground">{overallStats.eeCount} assessments</p>
                </div>
                <Award className="h-8 w-8 text-success" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Meets Expectations</p>
                  <p className="text-3xl font-bold text-warning">{overallStats.mePercentage}%</p>
                  <p className="text-xs text-muted-foreground">{overallStats.meCount} assessments</p>
                </div>
                <BarChart3 className="h-8 w-8 text-warning" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Below Expectations</p>
                  <p className="text-3xl font-bold text-destructive">{overallStats.bePercentage}%</p>
                  <p className="text-xs text-muted-foreground">{overallStats.beCount} assessments</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </Card>
          </div>
        )}

        {/* Performance Trend Chart (Mock) */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Performance Trend Over Time
          </h3>
          <div className="h-80 bg-muted/30 rounded-lg flex items-center justify-center relative overflow-hidden">
            {/* Mock line chart visualization */}
            <div className="absolute inset-0 flex items-end justify-around p-8 gap-4">
              <div className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-primary/60 rounded-t" style={{ height: '65%' }}></div>
                <span className="text-xs text-muted-foreground">Term 1</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-primary/70 rounded-t" style={{ height: '72%' }}></div>
                <span className="text-xs text-muted-foreground">Term 2</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-primary rounded-t" style={{ height: '68%' }}></div>
                <span className="text-xs text-muted-foreground">Term 3</span>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="text-center bg-background/80 backdrop-blur p-4 rounded-lg">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Performance trend visualization</p>
                <p className="text-xs text-muted-foreground">(Mock data display)</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Subject-wise Performance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Subject-wise Performance Comparison</h3>
          <div className="space-y-3">
            {subjectPerformance.map((item, index) => {
              const percentage = parseFloat(item!.average);
              const barColor = percentage >= 80 ? 'bg-success' : percentage >= 50 ? 'bg-warning' : 'bg-destructive';
              
              return (
                <div key={item!.subject.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground w-6">#{index + 1}</span>
                      <span className="font-medium">{item!.subject.name}</span>
                      <Badge variant="outline">{item!.count} assessments</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm">
                        <span className="text-success font-medium">{item!.eeCount} EE</span>
                        <span className="mx-2">•</span>
                        <span className="text-warning font-medium">{item!.meCount} ME</span>
                        <span className="mx-2">•</span>
                        <span className="text-destructive font-medium">{item!.beCount} BE</span>
                      </div>
                      <span className="font-bold text-lg w-16 text-right">{item!.average}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${barColor}`}
                      style={{ width: `${item!.average}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Grade-level Statistics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Grade-level Performance</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Grade</TableHead>
                  <TableHead className="text-right">Students</TableHead>
                  <TableHead className="text-right">Assessments</TableHead>
                  <TableHead className="text-right">Average</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gradeStats.map((stat) => (
                  <TableRow key={stat!.grade.id}>
                    <TableCell className="font-medium">{stat!.grade.name}</TableCell>
                    <TableCell className="text-right">{stat!.studentCount}</TableCell>
                    <TableCell className="text-right">{stat!.assessmentCount}</TableCell>
                    <TableCell className="text-right">
                      <span className={`font-bold ${
                        parseFloat(stat!.average) >= 80 ? 'text-success' :
                        parseFloat(stat!.average) >= 50 ? 'text-warning' :
                        'text-destructive'
                      }`}>
                        {stat!.average}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Top Performers */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-success" />
              Top Performers
            </h3>
            <div className="space-y-3">
              {topPerformers.slice(0, 5).map((performer, index) => (
                <div key={performer!.student.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-success text-white' :
                      index === 1 ? 'bg-warning text-white' :
                      index === 2 ? 'bg-accent text-white' :
                      'bg-muted'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{performer!.student.name}</p>
                      <p className="text-xs text-muted-foreground">{performer!.grade?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-success">{performer!.average}%</p>
                    <p className="text-xs text-muted-foreground">{performer!.eeCount} EE</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Students Needing Intervention */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Students Needing Academic Intervention
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {atRiskStudents.length} student(s) identified as requiring additional support
              </p>
            </div>
          </div>
          
          {atRiskStudents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admission No.</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead className="text-right">Average</TableHead>
                  <TableHead className="text-right">BE Count</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {atRiskStudents.map((student) => (
                  <TableRow key={student!.student.id}>
                    <TableCell className="font-medium">{student!.student.admissionNumber}</TableCell>
                    <TableCell>{student!.student.name}</TableCell>
                    <TableCell>{student!.grade?.name}</TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold text-destructive">{student!.average}%</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="destructive">{student!.beCount} / {student!.totalAssessments}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-destructive border-destructive">
                        Needs Support
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No students currently requiring intervention</p>
              <p className="text-sm">All students are performing satisfactorily</p>
            </div>
          )}
        </Card>

        {/* Recommendations */}
        <Card className="p-6 bg-primary/5 border-primary/20">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Key Insights & Recommendations
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              <span>Overall performance shows {overallStats ? `${overallStats.eePercentage}%` : '0%'} of students exceeding expectations</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
              <span>{atRiskStudents.length} student(s) require targeted intervention and additional support</span>
            </li>
            {subjectPerformance[0] && (
              <li className="flex items-start gap-2">
                <Award className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Highest performing subject: {subjectPerformance[0].subject.name} ({subjectPerformance[0].average}%)</span>
              </li>
            )}
            {subjectPerformance[subjectPerformance.length - 1] && parseFloat(subjectPerformance[subjectPerformance.length - 1]!.average) < 60 && (
              <li className="flex items-start gap-2">
                <TrendingDown className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <span>Consider additional resources for {subjectPerformance[subjectPerformance.length - 1]!.subject.name} (needs improvement)</span>
              </li>
            )}
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
