export type Role = 'super-admin' | 'admin' | 'teacher' | 'parent';

export type CBCLevel = 'BE' | 'ME' | 'EE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Grade {
  id: string;
  name: string;
  level: string; // Grade 1, Grade 2, etc.
}

export interface Subject {
  id: string;
  name: string;
  code: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  assignedGrades: string[];
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  admissionNumber: string;
  gradeId: string;
  dateOfBirth: string;
  parentId: string;
  gender: 'Male' | 'Female';
  avatar?: string;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  children: string[];
}

export interface Assessment {
  id: string;
  studentId: string;
  subjectId: string;
  term: number;
  examName: string;
  marks: number;
  totalMarks: number;
  cbcLevel: CBCLevel;
  date: string;
}

export interface Exam {
  id: string;
  name: string;
  subjectId: string;
  gradeId: string;
  term: number;
  totalMarks: number;
  date: string;
  teacherId: string;
  verified: boolean;
  status: 'draft' | 'submitted' | 'verified';
}

export interface TimetableSlot {
  id: string;
  day: string;
  time: string;
  subjectId: string;
  gradeId: string;
  teacherId: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  gradeId?: string;
  subjectId?: string;
  coverImage?: string;
  description: string;
  uploadDate: string;
}

export interface AcademicTerm {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

// Mock Data
export const grades: Grade[] = [
  { id: '1', name: 'Grade 1', level: 'Lower Primary' },
  { id: '2', name: 'Grade 2', level: 'Lower Primary' },
  { id: '3', name: 'Grade 3', level: 'Lower Primary' },
  { id: '4', name: 'Grade 4', level: 'Upper Primary' },
  { id: '5', name: 'Grade 5', level: 'Upper Primary' },
  { id: '6', name: 'Grade 6', level: 'Upper Primary' },
  { id: '7', name: 'Grade 7', level: 'Junior Secondary' },
  { id: '8', name: 'Grade 8', level: 'Junior Secondary' },
  { id: '9', name: 'Grade 9', level: 'Junior Secondary' },
];

export const subjects: Subject[] = [
  { id: 's1', name: 'Mathematics', code: 'MATH' },
  { id: 's2', name: 'English', code: 'ENG' },
  { id: 's3', name: 'Kiswahili', code: 'KIS' },
  { id: 's4', name: 'Science', code: 'SCI' },
  { id: 's5', name: 'Social Studies', code: 'SST' },
  { id: 's6', name: 'Creative Arts', code: 'CA' },
  { id: 's7', name: 'Physical Education', code: 'PE' },
  { id: 's8', name: 'Religious Education', code: 'RE' },
];

export const teachers: Teacher[] = [
  {
    id: 't1',
    name: 'John Kamau',
    email: 'j.kamau@getmore.edu',
    phone: '0712345678',
    subjects: ['s1', 's4'],
    assignedGrades: ['1', '2'],
  },
  {
    id: 't2',
    name: 'Mary Wanjiru',
    email: 'm.wanjiru@getmore.edu',
    phone: '0723456789',
    subjects: ['s2', 's3'],
    assignedGrades: ['1', '3'],
  },
  {
    id: 't3',
    name: 'David Omondi',
    email: 'd.omondi@getmore.edu',
    phone: '0734567890',
    subjects: ['s5', 's8'],
    assignedGrades: ['2', '3', '4'],
  },
  {
    id: 't4',
    name: 'Grace Akinyi',
    email: 'g.akinyi@getmore.edu',
    phone: '0745678901',
    subjects: ['s6', 's7'],
    assignedGrades: ['4', '5'],
  },
];

export const parents: Parent[] = [
  {
    id: 'p1',
    name: 'James Mwangi',
    email: 'james.mwangi@email.com',
    phone: '0711111111',
    children: ['st1'],
  },
  {
    id: 'p2',
    name: 'Sarah Njeri',
    email: 'sarah.njeri@email.com',
    phone: '0722222222',
    children: ['st2'],
  },
  {
    id: 'p3',
    name: 'Peter Otieno',
    email: 'peter.otieno@email.com',
    phone: '0733333333',
    children: ['st3', 'st4'],
  },
];

export const students: Student[] = [
  {
    id: 'st1',
    name: 'Brian Mwangi',
    admissionNumber: 'GEC001',
    gradeId: '1',
    dateOfBirth: '2015-06-15',
    parentId: 'p1',
    gender: 'Male',
  },
  {
    id: 'st2',
    name: 'Faith Njeri',
    admissionNumber: 'GEC002',
    gradeId: '1',
    dateOfBirth: '2015-08-22',
    parentId: 'p2',
    gender: 'Female',
  },
  {
    id: 'st3',
    name: 'Kevin Otieno',
    admissionNumber: 'GEC003',
    gradeId: '2',
    dateOfBirth: '2014-03-10',
    parentId: 'p3',
    gender: 'Male',
  },
  {
    id: 'st4',
    name: 'Linda Otieno',
    admissionNumber: 'GEC004',
    gradeId: '3',
    dateOfBirth: '2013-11-05',
    parentId: 'p3',
    gender: 'Female',
  },
  {
    id: 'st5',
    name: 'Daniel Kipchoge',
    admissionNumber: 'GEC005',
    gradeId: '1',
    dateOfBirth: '2015-09-18',
    parentId: 'p1',
    gender: 'Male',
  },
];

export const assessments: Assessment[] = [
  {
    id: 'a1',
    studentId: 'st1',
    subjectId: 's1',
    term: 1,
    examName: 'Mid-Term Exam',
    marks: 85,
    totalMarks: 100,
    cbcLevel: 'EE',
    date: '2024-05-15',
  },
  {
    id: 'a2',
    studentId: 'st1',
    subjectId: 's2',
    term: 1,
    examName: 'Mid-Term Exam',
    marks: 78,
    totalMarks: 100,
    cbcLevel: 'ME',
    date: '2024-05-16',
  },
  {
    id: 'a3',
    studentId: 'st1',
    subjectId: 's1',
    term: 1,
    examName: 'End Term Exam',
    marks: 90,
    totalMarks: 100,
    cbcLevel: 'EE',
    date: '2024-08-20',
  },
  {
    id: 'a4',
    studentId: 'st2',
    subjectId: 's1',
    term: 1,
    examName: 'Mid-Term Exam',
    marks: 65,
    totalMarks: 100,
    cbcLevel: 'ME',
    date: '2024-05-15',
  },
  {
    id: 'a5',
    studentId: 'st2',
    subjectId: 's2',
    term: 1,
    examName: 'Mid-Term Exam',
    marks: 72,
    totalMarks: 100,
    cbcLevel: 'ME',
    date: '2024-05-16',
  },
];

export const exams: Exam[] = [
  {
    id: 'e1',
    name: 'Mid-Term Mathematics',
    subjectId: 's1',
    gradeId: '1',
    term: 1,
    totalMarks: 100,
    date: '2024-05-15',
    teacherId: 't1',
    verified: true,
    status: 'verified',
  },
  {
    id: 'e2',
    name: 'End Term English',
    subjectId: 's2',
    gradeId: '1',
    term: 1,
    totalMarks: 100,
    date: '2024-08-20',
    teacherId: 't2',
    verified: false,
    status: 'submitted',
  },
  {
    id: 'e3',
    name: 'Mid-Term Science',
    subjectId: 's4',
    gradeId: '2',
    term: 2,
    totalMarks: 100,
    date: '2024-11-10',
    teacherId: 't1',
    verified: false,
    status: 'draft',
  },
];

export const timetable: TimetableSlot[] = [
  {
    id: 'tt1',
    day: 'Monday',
    time: '08:00 - 09:00',
    subjectId: 's1',
    gradeId: '1',
    teacherId: 't1',
  },
  {
    id: 'tt2',
    day: 'Monday',
    time: '09:00 - 10:00',
    subjectId: 's2',
    gradeId: '1',
    teacherId: 't2',
  },
  {
    id: 'tt3',
    day: 'Tuesday',
    time: '08:00 - 09:00',
    subjectId: 's4',
    gradeId: '1',
    teacherId: 't1',
  },
  {
    id: 'tt4',
    day: 'Monday',
    time: '08:00 - 09:00',
    subjectId: 's1',
    gradeId: '2',
    teacherId: 't1',
  },
];

export const books: Book[] = [
  {
    id: 'b1',
    title: 'Mathematics Grade 1 Textbook',
    author: 'Kenya Institute of Curriculum Development',
    gradeId: '1',
    subjectId: 's1',
    description: 'Comprehensive mathematics textbook for Grade 1 students following CBC curriculum.',
    uploadDate: '2024-01-15',
  },
  {
    id: 'b2',
    title: 'English Grammar Basics',
    author: 'Oxford University Press',
    gradeId: '1',
    subjectId: 's2',
    description: 'Introduction to English grammar for young learners.',
    uploadDate: '2024-01-20',
  },
  {
    id: 'b3',
    title: 'Kiswahili Kwa Watoto',
    author: 'Longhorn Publishers',
    gradeId: '2',
    subjectId: 's3',
    description: 'Fun and engaging Kiswahili learning book.',
    uploadDate: '2024-02-05',
  },
];

export const academicTerms: AcademicTerm[] = [
  {
    id: 'term1',
    name: 'Term 1 - 2024',
    startDate: '2024-01-15',
    endDate: '2024-04-12',
    current: false,
  },
  {
    id: 'term2',
    name: 'Term 2 - 2024',
    startDate: '2024-05-06',
    endDate: '2024-08-09',
    current: false,
  },
  {
    id: 'term3',
    name: 'Term 3 - 2024',
    startDate: '2024-09-02',
    endDate: '2024-11-22',
    current: true,
  },
];

// Utility functions
export const getGradeById = (id: string) => grades.find(g => g.id === id);
export const getSubjectById = (id: string) => subjects.find(s => s.id === id);
export const getTeacherById = (id: string) => teachers.find(t => t.id === id);
export const getStudentById = (id: string) => students.find(s => s.id === id);
export const getParentById = (id: string) => parents.find(p => p.id === id);
export const getAssessmentsByStudentId = (studentId: string) => 
  assessments.filter(a => a.studentId === studentId);
export const getExamsByTeacherId = (teacherId: string) => 
  exams.filter(e => e.teacherId === teacherId);
export const getTimetableByGradeId = (gradeId: string) => 
  timetable.filter(t => t.gradeId === gradeId);
export const getTimetableByTeacherId = (teacherId: string) => 
  timetable.filter(t => t.teacherId === teacherId);
export const getBooksByGradeId = (gradeId?: string) => 
  gradeId ? books.filter(b => b.gradeId === gradeId) : books;
export const getStudentsByGradeId = (gradeId: string) => 
  students.filter(s => s.gradeId === gradeId);
