/**
 * Fix missing attributes from initial setup
 * Run: npx tsx scripts/fix-attributes.ts
 */

import { Client, Databases } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT!)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const DATABASE_ID = 'eduflow';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fixExamsCollection() {
  console.log('\n🔧 Fixing exams collection...');
  
  try {
    // verified: boolean, not required, default false
    await databases.createBooleanAttribute(DATABASE_ID, 'exams', 'verified', false, false);
    console.log('  ✅ Attribute: verified');
  } catch (error: any) {
    if (error.code === 409) {
      console.log('  ℹ️  Attribute exists: verified');
    } else {
      console.log('  ❌ Error:', error.message);
    }
  }

  try {
    // status: enum, not required, default 'draft'
    await databases.createEnumAttribute(DATABASE_ID, 'exams', 'status', ['draft', 'submitted', 'verified'], false, 'draft');
    console.log('  ✅ Attribute: status');
  } catch (error: any) {
    if (error.code === 409) {
      console.log('  ℹ️  Attribute exists: status');
    } else {
      console.log('  ❌ Error:', error.message);
    }
  }

  // Wait for attributes to be ready before creating index
  await wait(3000);

  try {
    await databases.createIndex(DATABASE_ID, 'exams', 'idx_status', 'key', ['status']);
    console.log('  ✅ Index: idx_status');
  } catch (error: any) {
    if (error.code === 409) {
      console.log('  ℹ️  Index exists: idx_status');
    } else {
      console.log('  ❌ Error:', error.message);
    }
  }
}

async function fixAcademicTermsCollection() {
  console.log('\n🔧 Fixing academic_terms collection...');
  
  try {
    // current: boolean, not required, default false
    await databases.createBooleanAttribute(DATABASE_ID, 'academic_terms', 'current', false, false);
    console.log('  ✅ Attribute: current');
  } catch (error: any) {
    if (error.code === 409) {
      console.log('  ℹ️  Attribute exists: current');
    } else {
      console.log('  ❌ Error:', error.message);
    }
  }
}

async function main() {
  console.log('🔧 Fixing missing attributes...');

  await fixExamsCollection();
  await fixAcademicTermsCollection();

  console.log('\n✅ Fix complete!');
}

main();
