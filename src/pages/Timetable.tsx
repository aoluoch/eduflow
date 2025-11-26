import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { timetable, grades, subjects, teachers, getTimetableByGradeId } from '@/data/mockData';
import { Calendar, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'sonner';

const Timetable = () => {
  const [selectedGrade, setSelectedGrade] = useState(grades[0].id);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00'];

  const gradeTimetable = getTimetableByGradeId(selectedGrade);

  const getSlot = (day: string, time: string) => {
    return gradeTimetable.find(t => t.day === day && t.time === time);
  };

  const handleGenerate = () => {
    toast.success('Timetable generated successfully!');
  };

  const handleDownload = () => {
    toast.success('Downloading timetable...');
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">School Timetable</h1>
            <p className="text-muted-foreground mt-1">View and manage class schedules</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={handleGenerate}>
              <Calendar className="h-4 w-4 mr-2" />
              Generate New
            </Button>
          </div>
        </div>

        <Card className="p-6">
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Select Grade</label>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-64">
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

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">Time</TableHead>
                  {days.map(day => (
                    <TableHead key={day}>{day}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeSlots.map(time => (
                  <TableRow key={time}>
                    <TableCell className="font-medium">{time}</TableCell>
                    {days.map(day => {
                      const slot = getSlot(day, time);
                      if (slot) {
                        const subject = subjects.find(s => s.id === slot.subjectId);
                        const teacher = teachers.find(t => t.id === slot.teacherId);
                        return (
                          <TableCell key={day}>
                            <div className="p-2 bg-primary/10 rounded border-l-2 border-primary">
                              <p className="font-medium text-sm">{subject?.name}</p>
                              <p className="text-xs text-muted-foreground">{teacher?.name}</p>
                            </div>
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell key={day}>
                          <div className="p-2 bg-muted/30 rounded text-center text-sm text-muted-foreground">
                            -
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Card className="p-6 bg-muted/30">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> This is a mock timetable display. In production, the system would 
            allow admins to generate complete timetables with conflict detection and optimization.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Timetable;
