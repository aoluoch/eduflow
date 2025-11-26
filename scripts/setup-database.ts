/**
 * Appwrite Database Setup Script for Eduflow
 * 
 * Prerequisites:
 * 1. Go to Appwrite Console → Your Project → Settings → API Keys
 * 2. Create an API key with these scopes:
 *    - databases.read, databases.write
 *    - collections.read, collections.write
 *    - attributes.read, attributes.write
 *    - indexes.read, indexes.write
 * 3. Add the API key to your .env file as APPWRITE_API_KEY
 * 
 * Run: npx tsx scripts/setup-database.ts
 */

import { Client, Databases, ID } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT!)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);

const DATABASE_ID = 'eduflow';

// Helper to wait for attribute to be available
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function createDatabase() {
  try {
    await databases.create(DATABASE_ID, 'Eduflow Database');
    console.log('✅ Database created: eduflow');
  } catch (error: any) {
    if (error.code === 409) {
      console.log('ℹ️  Database already exists: eduflow');
    } else {
      throw error;
    }
  }
}

async function createCollection(id: string, name: string) {
  try {
    await databases.createCollection(DATABASE_ID, id, name);
    console.log(`✅ Collection created: ${name}`);
    return true;
  } catch (error: any) {
    if (error.code === 409) {
      console.log(`ℹ️  Collection already exists: ${name}`);
      return false;
    }
    throw error;
  }
}

async function createStringAttribute(collectionId: string, key: string, size: number, required: boolean, defaultValue?: string) {
  try {
    await databases.createStringAttribute(DATABASE_ID, collectionId, key, size, required, defaultValue);
    console.log(`  ✅ Attribute: ${key}`);
  } catch (error: any) {
    if (error.code === 409) {
      console.log(`  ℹ️  Attribute exists: ${key}`);
    } else {
      console.log(`  ❌ Error creating ${key}:`, error.message);
    }
  }
}

async function createIntegerAttribute(collectionId: string, key: string, required: boolean, min?: number, max?: number, defaultValue?: number) {
  try {
    await databases.createIntegerAttribute(DATABASE_ID, collectionId, key, required, min, max, defaultValue);
    console.log(`  ✅ Attribute: ${key}`);
  } catch (error: any) {
    if (error.code === 409) {
      console.log(`  ℹ️  Attribute exists: ${key}`);
    } else {
      console.log(`  ❌ Error creating ${key}:`, error.message);
    }
  }
}

async function createFloatAttribute(collectionId: string, key: string, required: boolean, min?: number, max?: number, defaultValue?: number) {
  try {
    await databases.createFloatAttribute(DATABASE_ID, collectionId, key, required, min, max, defaultValue);
    console.log(`  ✅ Attribute: ${key}`);
  } catch (error: any) {
    if (error.code === 409) {
      console.log(`  ℹ️  Attribute exists: ${key}`);
    } else {
      console.log(`  ❌ Error creating ${key}:`, error.message);
    }
  }
}

async function createBooleanAttribute(collectionId: string, key: string, required: boolean, defaultValue?: boolean) {
  try {
    await databases.createBooleanAttribute(DATABASE_ID, collectionId, key, required, defaultValue);
    console.log(`  ✅ Attribute: ${key}`);
  } catch (error: any) {
    if (error.code === 409) {
      console.log(`  ℹ️  Attribute exists: ${key}`);
    } else {
      console.log(`  ❌ Error creating ${key}:`, error.message);
    }
  }
}

async function createEnumAttribute(collectionId: string, key: string, elements: string[], required: boolean, defaultValue?: string) {
  try {
    await databases.createEnumAttribute(DATABASE_ID, collectionId, key, elements, required, defaultValue);
    console.log(`  ✅ Attribute: ${key}`);
  } catch (error: any) {
    if (error.code === 409) {
      console.log(`  ℹ️  Attribute exists: ${key}`);
    } else {
      console.log(`  ❌ Error creating ${key}:`, error.message);
    }
  }
}

async function createDatetimeAttribute(collectionId: string, key: string, required: boolean) {
  try {
    await databases.createDatetimeAttribute(DATABASE_ID, collectionId, key, required);
    console.log(`  ✅ Attribute: ${key}`);
  } catch (error: any) {
    if (error.code === 409) {
      console.log(`  ℹ️  Attribute exists: ${key}`);
    } else {
      console.log(`  ❌ Error creating ${key}:`, error.message);
    }
  }
}

async function createIndex(collectionId: string, key: string, type: 'key' | 'fulltext' | 'unique', attributes: string[]) {
  try {
    await databases.createIndex(DATABASE_ID, collectionId, key, type, attributes);
    console.log(`  ✅ Index: ${key}`);
  } catch (error: any) {
    if (error.code === 409) {
      console.log(`  ℹ️  Index exists: ${key}`);
    } else {
      console.log(`  ❌ Error creating index ${key}:`, error.message);
    }
  }
}

async function setupGrades() {
  console.log('\n📁 Setting up grades collection...');
  await createCollection('grades', 'Grades');
  await wait(1000);
  await createStringAttribute('grades', 'name', 50, true);
  await createStringAttribute('grades', 'level', 50, true);
}

async function setupSubjects() {
  console.log('\n📁 Setting up subjects collection...');
  await createCollection('subjects', 'Subjects');
  await wait(1000);
  await createStringAttribute('subjects', 'name', 100, true);
  await createStringAttribute('subjects', 'code', 10, true);
}

async function setupTeachers() {
  console.log('\n📁 Setting up teachers collection...');
  await createCollection('teachers', 'Teachers');
  await wait(1000);
  await createStringAttribute('teachers', 'userId', 36, true);
  await createStringAttribute('teachers', 'name', 100, true);
  await createStringAttribute('teachers', 'email', 255, true);
  await createStringAttribute('teachers', 'phone', 20, false);
  await createStringAttribute('teachers', 'avatar', 500, false);
  // Note: For arrays, we'll use a JSON string or create a separate relationship
  await createStringAttribute('teachers', 'subjectIds', 1000, false); // Comma-separated or JSON
  await createStringAttribute('teachers', 'assignedGradeIds', 1000, false);
  await wait(2000);
  await createIndex('teachers', 'idx_userId', 'unique', ['userId']);
  await createIndex('teachers', 'idx_email', 'unique', ['email']);
}

async function setupParents() {
  console.log('\n📁 Setting up parents collection...');
  await createCollection('parents', 'Parents');
  await wait(1000);
  await createStringAttribute('parents', 'userId', 36, true);
  await createStringAttribute('parents', 'name', 100, true);
  await createStringAttribute('parents', 'email', 255, true);
  await createStringAttribute('parents', 'phone', 20, false);
  await wait(2000);
  await createIndex('parents', 'idx_userId', 'unique', ['userId']);
  await createIndex('parents', 'idx_email', 'unique', ['email']);
}

async function setupStudents() {
  console.log('\n📁 Setting up students collection...');
  await createCollection('students', 'Students');
  await wait(1000);
  await createStringAttribute('students', 'name', 100, true);
  await createStringAttribute('students', 'admissionNumber', 20, true);
  await createStringAttribute('students', 'gradeId', 36, true);
  await createStringAttribute('students', 'dateOfBirth', 10, true);
  await createStringAttribute('students', 'parentId', 36, true);
  await createEnumAttribute('students', 'gender', ['Male', 'Female'], true);
  await createStringAttribute('students', 'avatar', 500, false);
  await wait(2000);
  await createIndex('students', 'idx_admissionNumber', 'unique', ['admissionNumber']);
  await createIndex('students', 'idx_gradeId', 'key', ['gradeId']);
  await createIndex('students', 'idx_parentId', 'key', ['parentId']);
}

async function setupAssessments() {
  console.log('\n📁 Setting up assessments collection...');
  await createCollection('assessments', 'Assessments');
  await wait(1000);
  await createStringAttribute('assessments', 'studentId', 36, true);
  await createStringAttribute('assessments', 'subjectId', 36, true);
  await createStringAttribute('assessments', 'examId', 36, false);
  await createIntegerAttribute('assessments', 'term', true, 1, 3);
  await createStringAttribute('assessments', 'examName', 100, true);
  await createFloatAttribute('assessments', 'marks', true, 0, 100);
  await createFloatAttribute('assessments', 'totalMarks', true, 0, 100);
  await createEnumAttribute('assessments', 'cbcLevel', ['BE', 'ME', 'EE'], true);
  await createStringAttribute('assessments', 'date', 10, true);
  await wait(2000);
  await createIndex('assessments', 'idx_studentId', 'key', ['studentId']);
  await createIndex('assessments', 'idx_subjectId', 'key', ['subjectId']);
  await createIndex('assessments', 'idx_term', 'key', ['term']);
}

async function setupExams() {
  console.log('\n📁 Setting up exams collection...');
  await createCollection('exams', 'Exams');
  await wait(1000);
  await createStringAttribute('exams', 'name', 100, true);
  await createStringAttribute('exams', 'subjectId', 36, true);
  await createStringAttribute('exams', 'gradeId', 36, true);
  await createIntegerAttribute('exams', 'term', true, 1, 3);
  await createFloatAttribute('exams', 'totalMarks', true, 0, 100);
  await createStringAttribute('exams', 'date', 10, true);
  await createStringAttribute('exams', 'teacherId', 36, true);
  await createBooleanAttribute('exams', 'verified', true, false);
  await createEnumAttribute('exams', 'status', ['draft', 'submitted', 'verified'], true, 'draft');
  await wait(2000);
  await createIndex('exams', 'idx_gradeId', 'key', ['gradeId']);
  await createIndex('exams', 'idx_teacherId', 'key', ['teacherId']);
  await createIndex('exams', 'idx_status', 'key', ['status']);
}

async function setupTimetableSlots() {
  console.log('\n📁 Setting up timetable_slots collection...');
  await createCollection('timetable_slots', 'Timetable Slots');
  await wait(1000);
  await createEnumAttribute('timetable_slots', 'day', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], true);
  await createStringAttribute('timetable_slots', 'startTime', 5, true);
  await createStringAttribute('timetable_slots', 'endTime', 5, true);
  await createStringAttribute('timetable_slots', 'subjectId', 36, true);
  await createStringAttribute('timetable_slots', 'gradeId', 36, true);
  await createStringAttribute('timetable_slots', 'teacherId', 36, true);
  await wait(2000);
  await createIndex('timetable_slots', 'idx_gradeId', 'key', ['gradeId']);
  await createIndex('timetable_slots', 'idx_teacherId', 'key', ['teacherId']);
}

async function setupBooks() {
  console.log('\n📁 Setting up books collection...');
  await createCollection('books', 'Books');
  await wait(1000);
  await createStringAttribute('books', 'title', 200, true);
  await createStringAttribute('books', 'author', 100, true);
  await createStringAttribute('books', 'gradeId', 36, false);
  await createStringAttribute('books', 'subjectId', 36, false);
  await createStringAttribute('books', 'coverImage', 500, false);
  await createStringAttribute('books', 'fileId', 36, false);
  await createStringAttribute('books', 'description', 1000, false);
  await createDatetimeAttribute('books', 'uploadDate', true);
  await wait(2000);
  await createIndex('books', 'idx_gradeId', 'key', ['gradeId']);
  await createIndex('books', 'idx_subjectId', 'key', ['subjectId']);
}

async function setupAcademicTerms() {
  console.log('\n📁 Setting up academic_terms collection...');
  await createCollection('academic_terms', 'Academic Terms');
  await wait(1000);
  await createStringAttribute('academic_terms', 'name', 50, true);
  await createDatetimeAttribute('academic_terms', 'startDate', true);
  await createDatetimeAttribute('academic_terms', 'endDate', true);
  await createBooleanAttribute('academic_terms', 'current', true, false);
}

async function setupAttendance() {
  console.log('\n📁 Setting up attendance collection...');
  await createCollection('attendance', 'Attendance');
  await wait(1000);
  await createStringAttribute('attendance', 'studentId', 36, true);
  await createStringAttribute('attendance', 'gradeId', 36, true);
  await createStringAttribute('attendance', 'date', 10, true);
  await createEnumAttribute('attendance', 'status', ['present', 'absent', 'late', 'excused'], true);
  await createStringAttribute('attendance', 'markedBy', 36, true);
  await createStringAttribute('attendance', 'notes', 500, false);
  await createBooleanAttribute('attendance', 'alertSent', false, false);
  await wait(2000);
  await createIndex('attendance', 'idx_studentId', 'key', ['studentId']);
  await createIndex('attendance', 'idx_gradeId', 'key', ['gradeId']);
  await createIndex('attendance', 'idx_date', 'key', ['date']);
}

async function main() {
  console.log('🚀 Starting Eduflow Database Setup...\n');
  
  // Validate environment variables
  if (!process.env.VITE_APPWRITE_ENDPOINT) {
    console.error('❌ Missing VITE_APPWRITE_ENDPOINT in .env');
    process.exit(1);
  }
  if (!process.env.VITE_APPWRITE_PROJECT_ID) {
    console.error('❌ Missing VITE_APPWRITE_PROJECT_ID in .env');
    process.exit(1);
  }
  if (!process.env.APPWRITE_API_KEY) {
    console.error('❌ Missing APPWRITE_API_KEY in .env');
    console.error('   Create an API key in Appwrite Console → Settings → API Keys');
    process.exit(1);
  }

  try {
    // Create database
    await createDatabase();

    // Create all collections with their attributes
    await setupGrades();
    await wait(1500);
    
    await setupSubjects();
    await wait(1500);
    
    await setupTeachers();
    await wait(1500);
    
    await setupParents();
    await wait(1500);
    
    await setupStudents();
    await wait(1500);
    
    await setupAssessments();
    await wait(1500);
    
    await setupExams();
    await wait(1500);
    
    await setupTimetableSlots();
    await wait(1500);
    
    await setupBooks();
    await wait(1500);
    
    await setupAcademicTerms();
    await wait(1500);
    
    await setupAttendance();

    console.log('\n✅ Database setup complete!');
    console.log('\n📋 Next steps:');
    console.log('   1. Go to Appwrite Console → Databases → eduflow');
    console.log('   2. Set permissions on each collection based on your needs');
    console.log('   3. Create Storage buckets: avatars, books, documents');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

main();
