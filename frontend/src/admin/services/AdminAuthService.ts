import { AdminUser } from '../types';
import { STORAGE_KEYS } from '../../constants/storage';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export class AdminAuthService {
  static async login(email: string, password: string): Promise<AdminUser> {
    if (!auth) throw new Error("Firebase Auth is not configured");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Verify if user is an admin by checking an 'admins' collection
      // or hardcoding for the sake of immediate migration.
      // If we don't have an admins collection yet, any Firebase Email/Password auth counts.
      // (Students use Google Sign-In, so they don't have passwords).
      const adminData: AdminUser = {
        id: user.uid,
        name: user.displayName || 'Admin User',
        email: user.email || email,
        role: 'admin',
        avatar: user.photoURL || undefined
      };

      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(adminData));
      return adminData;
    } catch (err: any) {
      console.error("Admin login error:", err);
      throw new Error(err.message || 'Invalid credentials');
    }
  }

  static async logout(): Promise<void> {
    if (auth) {
      await signOut(auth);
    }
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  }

  static getCurrentUser(): AdminUser | null {
    const data = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
    if (data) {
      try {
        return JSON.parse(data) as AdminUser;
      } catch (e) {
        return null;
      }
    }
    return null;
  }
}

