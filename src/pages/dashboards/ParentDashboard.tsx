import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRole } from '@/utils/roleContext';
import { useToast } from '@/hooks/use-toast';
import { AttendanceCalendar } from '@/components/AttendanceCalendar';
import {
  students,
  attendanceRecords,
  getStudentById,
  getAttendanceByStudent,
  grades,
  AttendanceStatus,
  parents,
} from '@/data/mockData';
import {
  Users,
  TrendingUp,
  Calendar,
  Bell,
  BellOff,
  Check,
  X,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const ParentDashboard = () => {
  const { currentUser } = useRole();
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  // Get parent's children
  const parent = parents.find(p => p.email === currentUser?.email);
  const parentChildren = students.filter(s => parent?.children.includes(s.id));

  useEffect(() => {
    if (parentChildren.length > 0 && !selectedStudent) {
      setSelectedStudent(parentChildren[0].id);
    }
  }, [parentChildren]);

  // Simulate real-time notifications for recent absences/lates
  useEffect(() => {
    if (!notificationsEnabled) return;

    const today = new Date().toISOString().split('T')[0];
    const recentAlerts = attendanceRecords.filter(
      record =>
        parentChildren.some(child => child.id === record.studentId) &&
        (record.status === 'absent' || record.status === 'late') &&
        record.date === today
    );

    recentAlerts.forEach(alert => {
      const student = getStudentById(alert.studentId);
      setTimeout(() => {
        toast({
          title: `Attendance Alert`,
          description: `${student?.name} was marked ${alert.status} today.`,
          variant: alert.status === 'absent' ? 'destructive' : 'default',
        });
      }, 1000);
    });
  }, [notificationsEnabled]);

  const getAttendanceStats = (studentId: string) => {
    const records = getAttendanceByStudent(studentId);
    const total = records.length;
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const late = records.filter(r => r.status === 'late').length;
    const excused = records.filter(r => r.status === 'excused').length;
    const attendanceRate = total > 0 ? ((present / total) * 100).toFixed(1) : '0';

    return { total, present, absent, late, excused, attendanceRate };
  };

  const getMonthlyAttendanceData = (studentId: string) => {
    const records = getAttendanceByStudent(studentId);
    const data: Record<string, AttendanceStatus> = {};
    
    records.forEach(record => {
      data[record.date] = record.status;
    });

    return data;
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  const getRecentAlerts = () => {
    const alerts = attendanceRecords.filter(
      record =>
        parentChildren.some(child => child.id === record.studentId) &&
        (record.status === 'absent' || record.status === 'late')
    );

    return alerts.slice(-5).reverse();
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

  if (!selectedStudent) {
    return <div className="p-8">Loading...</div>;
  }

  const currentStudent = getStudentById(selectedStudent);
  const stats = getAttendanceStats(selectedStudent);
  const monthlyData = getMonthlyAttendanceData(selectedStudent);
  const recentAlerts = getRecentAlerts();

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Parent Dashboard</h1>
        <p className="text-muted-foreground mt-1">Monitor your children's attendance and progress</p>
      </div>

      {/* Notification Alert Banner */}
      {recentAlerts.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Recent Attendance Alerts</AlertTitle>
          <AlertDescription>
            {recentAlerts.length} attendance alert(s) in the past week. Check the notifications tab for details.
          </AlertDescription>
        </Alert>
      )}

      {/* Children Selector */}
      {parentChildren.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {parentChildren.map(child => (
            <Button
              key={child.id}
              variant={selectedStudent === child.id ? 'default' : 'outline'}
              onClick={() => setSelectedStudent(child.id)}
              className="gap-2"
            >
              <Users className="w-4 h-4" />
              {child.name}
            </Button>
          ))}
        </div>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="notifications">
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">Notifications</span>
              <span className="sm:hidden">Alerts</span>
              {recentAlerts.length > 0 && (
                <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {recentAlerts.length}
                </Badge>
              )}
            </div>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Student Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-base sm:text-lg font-semibold text-primary">
                    {currentStudent?.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="text-lg sm:text-xl">{currentStudent?.name}</div>
                  <div className="text-sm font-normal text-muted-foreground">
                    {grades.find(g => g.id === currentStudent?.gradeId)?.name} • {currentStudent?.admissionNumber}
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Attendance Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 mx-auto mb-2">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold">{stats.attendanceRate}%</div>
                  <p className="text-xs text-muted-foreground">Rate</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 dark:bg-green-950 mx-auto mb-2">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.present}</div>
                  <p className="text-xs text-muted-foreground">Present</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 dark:bg-red-950 mx-auto mb-2">
                    <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-red-600">{stats.absent}</div>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-100 dark:bg-orange-950 mx-auto mb-2">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-orange-600">{stats.late}</div>
                  <p className="text-xs text-muted-foreground">Late</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 dark:bg-blue-950 mx-auto mb-2">
                    <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">{stats.excused}</div>
                  <p className="text-xs text-muted-foreground">Excused</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance</CardTitle>
              <CardDescription>Last 7 days of attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getAttendanceByStudent(selectedStudent)
                  .slice(-7)
                  .reverse()
                  .map(record => (
                    <div key={record.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-sm sm:text-base">
                            {new Date(record.date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                          {record.notes && (
                            <p className="text-sm text-muted-foreground truncate">{record.notes}</p>
                          )}
                        </div>
                      </div>
                      {getStatusBadge(record.status)}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="text-lg sm:text-xl">Monthly Attendance Calendar</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => changeMonth('prev')}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedMonth(new Date().getMonth());
                      setSelectedYear(new Date().getFullYear());
                    }}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => changeMonth('next')}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                View {currentStudent?.name}'s attendance for the selected month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceCalendar
                year={selectedYear}
                month={selectedMonth}
                attendanceData={monthlyData}
                onDateClick={(date) => {
                  const record = attendanceRecords.find(
                    r => r.studentId === selectedStudent && r.date === date
                  );
                  if (record) {
                    toast({
                      title: new Date(date).toLocaleDateString(),
                      description: `Status: ${record.status}${record.notes ? ` - ${record.notes}` : ''}`,
                    });
                  }
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive attendance alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="push-notifications" className="text-sm sm:text-base">
                    Push Notifications
                  </Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Receive instant alerts when your child is absent or late
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={(checked) => {
                    setNotificationsEnabled(checked);
                    toast({
                      title: checked ? "Notifications Enabled" : "Notifications Disabled",
                      description: checked
                        ? "You will receive real-time attendance alerts"
                        : "You won't receive attendance notifications",
                    });
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="email-notifications" className="text-sm sm:text-base">
                    Email Notifications
                  </Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Receive daily attendance summaries via email
                  </p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="sms-notifications" className="text-sm sm:text-base">
                    SMS Notifications
                  </Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Receive text messages for urgent attendance alerts
                  </p>
                </div>
                <Switch id="sms-notifications" defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Recent Alerts
              </CardTitle>
              <CardDescription>Attendance notifications from the past week</CardDescription>
            </CardHeader>
            <CardContent>
              {recentAlerts.length > 0 ? (
                <div className="space-y-3">
                  {recentAlerts.map(alert => {
                    const student = getStudentById(alert.studentId);
                    return (
                      <Card key={alert.id} className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              {alert.status === 'absent' ? (
                                <X className="w-5 h-5 text-red-600 flex-shrink-0" />
                              ) : (
                                <Clock className="w-5 h-5 text-orange-600 flex-shrink-0" />
                              )}
                              <span className="font-medium">{student?.name}</span>
                              {getStatusBadge(alert.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(alert.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                            {alert.notes && (
                              <p className="text-sm text-muted-foreground mt-2">
                                Note: {alert.notes}
                              </p>
                            )}
                          </div>
                          {alert.alertSent && (
                            <Badge variant="outline" className="gap-1 flex-shrink-0">
                              <Bell className="w-3 h-3" />
                              Notified
                            </Badge>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <BellOff className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No attendance alerts</p>
                  <p className="text-sm">You'll see notifications here when your child is absent or late</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
