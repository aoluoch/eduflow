import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AttendanceStatus } from '@/data/mockData';
import { Check, X, Clock, AlertCircle } from 'lucide-react';

interface AttendanceCalendarProps {
  year: number;
  month: number;
  attendanceData: Record<string, AttendanceStatus>;
  onDateClick?: (date: string) => void;
}

export const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  year,
  month,
  attendanceData,
  onDateClick,
}) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 dark:bg-green-950 border-green-500';
      case 'absent':
        return 'bg-red-100 dark:bg-red-950 border-red-500';
      case 'late':
        return 'bg-orange-100 dark:bg-orange-950 border-orange-500';
      case 'excused':
        return 'bg-blue-100 dark:bg-blue-950 border-blue-500';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return <Check className="w-3 h-3 text-green-600" />;
      case 'absent':
        return <X className="w-3 h-3 text-red-600" />;
      case 'late':
        return <Clock className="w-3 h-3 text-orange-600" />;
      case 'excused':
        return <AlertCircle className="w-3 h-3 text-blue-600" />;
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square p-1" />
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const status = attendanceData[dateStr];
      const isToday = new Date().toISOString().split('T')[0] === dateStr;
      const isFutureDate = new Date(dateStr) > new Date();

      days.push(
        <div
          key={day}
          onClick={() => !isFutureDate && status && onDateClick?.(dateStr)}
          className={`
            aspect-square p-1 cursor-pointer transition-all
            ${isFutureDate ? 'opacity-30' : ''}
          `}
        >
          <Card
            className={`
              h-full w-full flex flex-col items-center justify-center gap-1 p-1
              hover:shadow-md transition-shadow
              ${status ? getStatusColor(status) + ' border-2' : 'border'}
              ${isToday ? 'ring-2 ring-primary' : ''}
            `}
          >
            <span className={`text-xs font-medium ${isToday ? 'font-bold' : ''}`}>
              {day}
            </span>
            {status && (
              <div className="flex items-center justify-center">
                {getStatusIcon(status)}
              </div>
            )}
          </Card>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-center">
          {monthNames[month]} {year}
        </h3>
      </div>

      {/* Day names header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground p-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center text-xs">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-950 border-2 border-green-500" />
          <span>Present</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-950 border-2 border-red-500" />
          <span>Absent</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-orange-100 dark:bg-orange-950 border-2 border-orange-500" />
          <span>Late</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-950 border-2 border-blue-500" />
          <span>Excused</span>
        </div>
      </div>
    </div>
  );
};
