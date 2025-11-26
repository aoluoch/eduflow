/**
 * Appwrite Database Schema for Eduflow
 * 
 * Database ID: eduflow
 * 
 * Run this file once to create all collections and attributes.
 * Usage: npx ts-node src/lib/appwrite-schema.ts
 * Or import and call setupDatabase() from your app initialization.
 */

import { Client, Databases, ID, Permission, Role } from 'appwrite';

// Initialize client with server-side credentials for setup
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const databases = new Databases(client);

// Database and Collection IDs
export const DATABASE_ID = 'eduflow';

export const COLLECTIONS = {
  USERS: 'users',
  GRADES: 'grades',
  SUBJECTS: 'subjects',
  TEACHERS: 'teachers',
  STUDENTS: 'students',
  PARENTS: 'parents',
  ASSESSMENTS: 'assessments',
  EXAMS: 'exams',
  TIMETABLE_SLOTS: 'timetable_slots',
  BOOKS: 'books',
  ACADEMIC_TERMS: 'academic_terms',
  ATTENDANCE: 'attendance',
} as const;

// Schema definitions
const collections = [
  {
    id: COLLECTIONS.GRADES,
    name: 'Grades',
    attributes: [
      { type: 'string', key: 'name', size: 50, required: true },
      { type: 'string', key: 'level', size: 50, required: true }, // Lower Primary, Upper Primary, Junior Secondary
    ],
  },
  {
    id: COLLECTIONS.SUBJECTS,
    name: 'Subjects',
    attributes: [
      { type: 'string', key: 'name', size: 100, required: true },
      { type: 'string', key: 'code', size: 10, required: true },
    ],
  },
  {
    id: COLLECTIONS.TEACHERS,
    name: 'Teachers',
    attributes: [
      { type: 'string', key: 'userId', size: 36, required: true }, // Links to Appwrite Auth user
      { type: 'string', key: 'name', size: 100, required: true },
      { type: 'string', key: 'email', size: 255, required: true },
      { type: 'string', key: 'phone', size: 20, required: false },
      { type: 'string[]', key: 'subjectIds', size: 36, required: false }, // Array of subject IDs
      { type: 'string[]', key: 'assignedGradeIds', size: 36, required: false }, // Array of grade IDs
      { type: 'string', key: 'avatar', size: 500, required: false },
    ],
  },
  {
    id: COLLECTIONS.PARENTS,
    name: 'Parents',
    attributes: [
      { type: 'string', key: 'userId', size: 36, required: true }, // Links to Appwrite Auth user
      { type: 'string', key: 'name', size: 100, required: true },
      { type: 'string', key: 'email', size: 255, required: true },
      { type: 'string', key: 'phone', size: 20, required: false },
    ],
  },
  {
    id: COLLECTIONS.STUDENTS,
    name: 'Students',
    attributes: [
      { type: 'string', key: 'name', size: 100, required: true },
      { type: 'string', key: 'admissionNumber', size: 20, required: true },
      { type: 'string', key: 'gradeId', size: 36, required: true },
      { type: 'string', key: 'dateOfBirth', size: 10, required: true }, // YYYY-MM-DD
      { type: 'string', key: 'parentId', size: 36, required: true },
      { type: 'enum', key: 'gender', elements: ['Male', 'Female'], required: true },
      { type: 'string', key: 'avatar', size: 500, required: false },
    ],
  },
  {
    id: COLLECTIONS.ASSESSMENTS,
    name: 'Assessments',
    attributes: [
      { type: 'string', key: 'studentId', size: 36, required: true },
      { type: 'string', key: 'subjectId', size: 36, required: true },
      { type: 'string', key: 'examId', size: 36, required: false },
      { type: 'integer', key: 'term', min: 1, max: 3, required: true },
      { type: 'string', key: 'examName', size: 100, required: true },
      { type: 'float', key: 'marks', min: 0, max: 100, required: true },
      { type: 'float', key: 'totalMarks', min: 0, max: 100, required: true },
      { type: 'enum', key: 'cbcLevel', elements: ['BE', 'ME', 'EE'], required: true }, // Below Expectation, Meets Expectation, Exceeds Expectation
      { type: 'string', key: 'date', size: 10, required: true },
    ],
  },
  {
    id: COLLECTIONS.EXAMS,
    name: 'Exams',
    attributes: [
      { type: 'string', key: 'name', size: 100, required: true },
      { type: 'string', key: 'subjectId', size: 36, required: true },
      { type: 'string', key: 'gradeId', size: 36, required: true },
      { type: 'integer', key: 'term', min: 1, max: 3, required: true },
      { type: 'float', key: 'totalMarks', min: 0, max: 100, required: true },
      { type: 'string', key: 'date', size: 10, required: true },
      { type: 'string', key: 'teacherId', size: 36, required: true },
      { type: 'boolean', key: 'verified', required: true, default: false },
      { type: 'enum', key: 'status', elements: ['draft', 'submitted', 'verified'], required: true },
    ],
  },
  {
    id: COLLECTIONS.TIMETABLE_SLOTS,
    name: 'Timetable Slots',
    attributes: [
      { type: 'enum', key: 'day', elements: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], required: true },
      { type: 'string', key: 'startTime', size: 5, required: true }, // HH:MM
      { type: 'string', key: 'endTime', size: 5, required: true },
      { type: 'string', key: 'subjectId', size: 36, required: true },
      { type: 'string', key: 'gradeId', size: 36, required: true },
      { type: 'string', key: 'teacherId', size: 36, required: true },
    ],
  },
  {
    id: COLLECTIONS.BOOKS,
    name: 'Books',
    attributes: [
      { type: 'string', key: 'title', size: 200, required: true },
      { type: 'string', key: 'author', size: 100, required: true },
      { type: 'string', key: 'gradeId', size: 36, required: false },
      { type: 'string', key: 'subjectId', size: 36, required: false },
      { type: 'string', key: 'coverImage', size: 500, required: false },
      { type: 'string', key: 'fileId', size: 36, required: false }, // Appwrite Storage file ID
      { type: 'string', key: 'description', size: 1000, required: false },
      { type: 'datetime', key: 'uploadDate', required: true },
    ],
  },
  {
    id: COLLECTIONS.ACADEMIC_TERMS,
    name: 'Academic Terms',
    attributes: [
      { type: 'string', key: 'name', size: 50, required: true },
      { type: 'datetime', key: 'startDate', required: true },
      { type: 'datetime', key: 'endDate', required: true },
      { type: 'boolean', key: 'current', required: true, default: false },
    ],
  },
  {
    id: COLLECTIONS.ATTENDANCE,
    name: 'Attendance',
    attributes: [
      { type: 'string', key: 'studentId', size: 36, required: true },
      { type: 'string', key: 'gradeId', size: 36, required: true },
      { type: 'string', key: 'date', size: 10, required: true }, // YYYY-MM-DD
      { type: 'enum', key: 'status', elements: ['present', 'absent', 'late', 'excused'], required: true },
      { type: 'string', key: 'markedBy', size: 36, required: true }, // Teacher ID
      { type: 'string', key: 'notes', size: 500, required: false },
      { type: 'boolean', key: 'alertSent', required: false, default: false },
    ],
  },
];

// Note: This is a reference schema. To actually create collections,
// you need to use the Appwrite Server SDK with an API key, or create them
// manually in the Appwrite Console.

export { collections };
