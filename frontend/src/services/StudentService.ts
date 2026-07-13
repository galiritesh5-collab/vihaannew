import { MockDB } from './MockDB';
import { FirestoreStudentService } from './FirestoreStudentService';

export class StudentService {
  static getStudentByUid(uid: string) {
    const students = MockDB.getCollection('students');
    return students.find((s: any) => s.uid === uid);
  }

  static async saveStudentProfile(profileData: any) {
    const students = MockDB.getCollection('students');
    const existingIndex = students.findIndex((s: any) => s.uid === profileData.uid);

    const dataWithFlag = {
      ...profileData,
      profileCompleted: true,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      // Update existing in MockDB
      await MockDB.updateItem('students', students[existingIndex].id, dataWithFlag);
    } else {
      // Create new in MockDB
      const newStudent = {
        id: profileData.uid, // use uid as id for consistent lookup
        ...dataWithFlag,
        role: 'Student',
        status: 'Pending',
        loginMethod: 'Google',
        registrationDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      await MockDB.addItem('students', newStudent);
    }

    // ── Sync to Firestore ──────────────────────────────────────────────────
    // This is the source of truth – Firestore snapshot will propagate back
    // to MockDB automatically via the real-time listener.
    if (profileData.uid) {
      await FirestoreStudentService.upsertStudent(profileData.uid, dataWithFlag);
    }
  }
}
