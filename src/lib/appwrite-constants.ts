/**
 * Appwrite Database Constants
 * Use these IDs when querying collections
 */

export const DATABASE_ID = 'eduflow';

export const COLLECTIONS = {
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

// Storage bucket IDs
export const BUCKETS = {
  AVATARS: 'avatars',
  BOOKS: 'books',
  DOCUMENTS: 'documents',
} as const;

// User roles (stored in Appwrite Auth user preferences)
export const ROLES = {
  SUPER_ADMIN: 'super-admin',
  ADMIN: 'admin',
  TEACHER: 'teacher',
  PARENT: 'parent',
} as const;

// CBC Levels
export const CBC_LEVELS = {
  BE: 'BE', // Below Expectation
  ME: 'ME', // Meets Expectation
  EE: 'EE', // Exceeds Expectation
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
export type CBCLevel = typeof CBC_LEVELS[keyof typeof CBC_LEVELS];
