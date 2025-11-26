import React, { useState } from 'react';
import { useRole } from '@/utils/roleContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  grades, 
  students, 
  attendanceRecords, 
  getStudentsByGradeId, 
  getAttendanceByDateAndGrade,
  AttendanceStatus,
  Attendance as AttendanceType,
  parents,
  getParentById
} from '@/data/mockData';
import { Calendar, Download, Send, Check, X, Clock, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const Attendance = () => {
  const { currentUser } = useRole();
  const { toast } = useToast();
  const today = new Date().toISOString().split('T')[0];

  const [selectedGrade, setSelectedGrade] = useState(grades[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState(today);
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceStatus>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [reportStartDate, setReportStartDate] = useState('2024-11-01');
  const [reportEndDate, setReportEndDate] = useState(today);
  const [reportGrade, setReportGrade] = useState(grades[0]?.id || '');

  const gradeStudents = getStudentsByGradeId(selectedGrade);
  const existingAttendance = getAttendanceByDateAndGrade(selectedDate, selectedGrade);

  // Initialize attendance data from existing records
  React.useEffect(() => {
    const initialData: Record<string, AttendanceStatus> = {};
    const initialNotes: Record<string, string> = {};
    existingAttendance.forEach(att => {
      initialData[att.studentId] = att.status;
      if (att.notes) initialNotes[att.studentId] = att.notes;
    });
    setAttendanceData(initialData);
    setNotes(initialNotes);
  }, [selectedDate, selectedGrade]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const handleNotesChange = (studentId: string, note: string) => {
    setNotes(prev => ({ ...prev, [studentId]: note }));
  };

  const handleSaveAttendance = () => {
    const unmarkedStudents = gradeStudents.filter(s => !attendanceData[s.id]);
    
    if (unmarkedStudents.length > 0) {
      toast({
        title: "Incomplete Attendance",
        description: `Please mark attendance for all ${gradeStudents.length} students.`,
        variant: "destructive",
      });
      return;
    }

    // Simulate sending alerts to parents of absent students
    const absentStudents = gradeStudents.filter(s => 
      attendanceData[s.id] === 'absent' || attendanceData[s.id] === 'late'
    );

    toast({
      title: "Attendance Saved",
      description: `Attendance for ${gradeStudents.length} students has been recorded. ${absentStudents.length > 0 ? `Alerts sent to ${absentStudents.length} parent(s).` : ''}`,
    });
  };

  const handleSendAlert = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    const parent = student ? getParentById(student.parentId) : null;
    
    toast({
      title: "Alert Sent",
      description: `SMS/Email alert sent to ${parent?.name} (${parent?.email}) regarding ${student?.name}'s absence.`,
    });
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    const variants: Record<AttendanceStatus, { label: string; variant: "default" | "destructive" | "outline" | "secondary" }> = {
      present: { label: 'Present', variant: 'default' },
      absent: { label: 'Absent', variant: 'destructive' },
      late: { label: 'Late', variant: 'secondary' },
      excused: { label: 'Excused', variant: 'outline' },
    };
    
    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'absent':
        return <X className="w-5 h-5 text-red-600" />;
      case 'late':
        return <Clock className="w-5 h-5 text-orange-600" />;
      case 'excused':
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  const calculateAttendanceStats = () => {
    const records = attendanceRecords.filter(
      a => a.gradeId === reportGrade && 
      a.date >= reportStartDate && 
      a.date <= reportEndDate
    );

    const stats = {
      total: records.length,
      present: records.filter(r => r.status === 'present').length,
      absent: records.filter(r => r.status === 'absent').length,
      late: records.filter(r => r.status === 'late').length,
      excused: records.filter(r => r.status === 'excused').length,
    };

    const attendanceRate = stats.total > 0 
      ? ((stats.present / stats.total) * 100).toFixed(1)
      : '0';

    return { ...stats, attendanceRate };
  };

  const stats = calculateAttendanceStats();

  const generateReport = () => {
    toast({
      title: "Report Generated",
      description: "Attendance report has been generated and is ready for download.",
    });
  };

  const handleQuickMarkAll = (status: AttendanceStatus) => {
    const newData: Record<string, AttendanceStatus> = {};
    gradeStudents.forEach(student => {
      newData[student.id] = status;
    });
    setAttendanceData(newData);
    toast({
      title: "Bulk Update",
      description: `All students marked as ${status}`,
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Attendance Tracking</h1>
        <p className="text-muted-foreground mt-1">Mark student attendance and manage records</p>
      </div>

      <Tabs defaultValue="mark" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 mb-6">
          <TabsTrigger value="mark">Mark Attendance</TabsTrigger>
          <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
          <TabsTrigger value="alerts">Alert History</TabsTrigger>
        </TabsList>

        {/* Mark Attendance Tab */}
        <TabsContent value="mark">
          <Card>
            <CardHeader>
              <CardTitle>Mark Daily Attendance</CardTitle>
              <CardDescription>Record student attendance for the selected date and grade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    max={today}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger id="grade">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map(grade => (
                        <SelectItem key={grade.id} value={grade.id}>
                          {grade.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quick Actions</Label>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleQuickMarkAll('present')}
                    >
                      All Present
                    </Button>
                  </div>
                </div>
              </div>

              {/* Student List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Students ({gradeStudents.length})
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    Marked: {Object.keys(attendanceData).length} / {gradeStudents.length}
                  </div>
                </div>

                <div className="space-y-3">
                  {gradeStudents.map(student => {
                    const parent = getParentById(student.parentId);
                    const status = attendanceData[student.id];
                    
                    return (
                      <Card key={student.id} className="p-4">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="font-semibold text-primary">
                                  {student.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">{student.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {student.admissionNumber} • Parent: {parent?.name}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <Button
                              size="sm"
                              variant={status === 'present' ? 'default' : 'outline'}
                              onClick={() => handleStatusChange(student.id, 'present')}
                              className="gap-2"
                            >
                              <Check className="w-4 h-4" />
                              Present
                            </Button>
                            <Button
                              size="sm"
                              variant={status === 'absent' ? 'destructive' : 'outline'}
                              onClick={() => handleStatusChange(student.id, 'absent')}
                              className="gap-2"
                            >
                              <X className="w-4 h-4" />
                              Absent
                            </Button>
                            <Button
                              size="sm"
                              variant={status === 'late' ? 'secondary' : 'outline'}
                              onClick={() => handleStatusChange(student.id, 'late')}
                              className="gap-2"
                            >
                              <Clock className="w-4 h-4" />
                              Late
                            </Button>
                            <Button
                              size="sm"
                              variant={status === 'excused' ? 'default' : 'outline'}
                              onClick={() => handleStatusChange(student.id, 'excused')}
                              className="gap-2"
                            >
                              <AlertCircle className="w-4 h-4" />
                              Excused
                            </Button>

                            {(status === 'absent' || status === 'late') && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="ghost" className="gap-2">
                                    <Send className="w-4 h-4" />
                                    Alert
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Send Alert to Parent</DialogTitle>
                                    <DialogDescription>
                                      Send notification about {student.name}'s {status}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor={`notes-${student.id}`}>Notes (Optional)</Label>
                                      <Textarea
                                        id={`notes-${student.id}`}
                                        placeholder="Add any additional notes..."
                                        value={notes[student.id] || ''}
                                        onChange={(e) => handleNotesChange(student.id, e.target.value)}
                                      />
                                    </div>
                                    <div className="bg-muted p-3 rounded-md text-sm">
                                      <p className="font-medium">Alert will be sent to:</p>
                                      <p className="text-muted-foreground">{parent?.name}</p>
                                      <p className="text-muted-foreground">{parent?.email}</p>
                                      <p className="text-muted-foreground">{parent?.phone}</p>
                                    </div>
                                    <Button 
                                      onClick={() => handleSendAlert(student.id)}
                                      className="w-full"
                                    >
                                      Send Alert
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        </div>

                        {notes[student.id] && (
                          <div className="mt-3 p-2 bg-muted rounded-md text-sm">
                            <span className="font-medium">Notes: </span>
                            {notes[student.id]}
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveAttendance} size="lg">
                  Save Attendance
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Reports</CardTitle>
                <CardDescription>Generate and view attendance statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reportStartDate">Start Date</Label>
                    <Input
                      id="reportStartDate"
                      type="date"
                      value={reportStartDate}
                      onChange={(e) => setReportStartDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reportEndDate">End Date</Label>
                    <Input
                      id="reportEndDate"
                      type="date"
                      value={reportEndDate}
                      onChange={(e) => setReportEndDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reportGrade">Grade</Label>
                    <Select value={reportGrade} onValueChange={setReportGrade}>
                      <SelectTrigger id="reportGrade">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {grades.map(grade => (
                          <SelectItem key={grade.id} value={grade.id}>
                            {grade.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Total Records</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                  </Card>
                  <Card className="p-4 bg-green-50 dark:bg-green-950">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Present</p>
                      <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                    </div>
                  </Card>
                  <Card className="p-4 bg-red-50 dark:bg-red-950">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Absent</p>
                      <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                    </div>
                  </Card>
                  <Card className="p-4 bg-orange-50 dark:bg-orange-950">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Late</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.late}</p>
                    </div>
                  </Card>
                  <Card className="p-4 bg-blue-50 dark:bg-blue-950">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Attendance Rate</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.attendanceRate}%</p>
                    </div>
                  </Card>
                </div>

                <div className="flex gap-3">
                  <Button onClick={generateReport} className="gap-2">
                    <Download className="w-4 h-4" />
                    Download Report (PDF)
                  </Button>
                  <Button onClick={generateReport} variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export to Excel
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Student Attendance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Student</th>
                        <th className="text-left p-3">Admission No.</th>
                        <th className="text-center p-3">Present</th>
                        <th className="text-center p-3">Absent</th>
                        <th className="text-center p-3">Late</th>
                        <th className="text-center p-3">Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getStudentsByGradeId(reportGrade).map(student => {
                        const studentRecords = attendanceRecords.filter(
                          a => a.studentId === student.id && 
                          a.date >= reportStartDate && 
                          a.date <= reportEndDate
                        );
                        const present = studentRecords.filter(r => r.status === 'present').length;
                        const absent = studentRecords.filter(r => r.status === 'absent').length;
                        const late = studentRecords.filter(r => r.status === 'late').length;
                        const total = studentRecords.length;
                        const rate = total > 0 ? ((present / total) * 100).toFixed(1) : '0';

                        return (
                          <tr key={student.id} className="border-b hover:bg-muted/50">
                            <td className="p-3">{student.name}</td>
                            <td className="p-3">{student.admissionNumber}</td>
                            <td className="p-3 text-center">{present}</td>
                            <td className="p-3 text-center">{absent}</td>
                            <td className="p-3 text-center">{late}</td>
                            <td className="p-3 text-center font-semibold">{rate}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Alert History</CardTitle>
              <CardDescription>View all sent attendance alerts to parents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {attendanceRecords
                  .filter(a => a.alertSent && (a.status === 'absent' || a.status === 'late'))
                  .map(record => {
                    const student = students.find(s => s.id === record.studentId);
                    const parent = student ? getParentById(student.parentId) : null;
                    
                    return (
                      <Card key={record.id} className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(record.status)}
                              <div>
                                <p className="font-medium">{student?.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {getStatusBadge(record.status)} on {new Date(record.date).toLocaleDateString()}
                                </p>
                                {record.notes && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Notes: {record.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p>Alert sent to: {parent?.name}</p>
                            <p>{parent?.email}</p>
                            <p>{parent?.phone}</p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}

                {attendanceRecords.filter(a => a.alertSent).length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Send className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No alerts have been sent yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Attendance;
