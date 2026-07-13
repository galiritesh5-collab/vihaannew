import { AdminUser } from '../types';
import { MOCK_ADMIN_USER } from '../mock/data';
import { STORAGE_KEYS } from '../../constants/storage';

export class AdminAuthService {
  static async login(email: string, password: string): Promise<AdminUser> {
    const response = await fetch('http://localhost:5000/api/auth/admin-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (data.success && data.user) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(data.user));
      localStorage.setItem('admin_token', data.token);
      return data.user;
    }
    
    throw new Error(data.message || 'Invalid credentials');
  }

  static async logout(): Promise<void> {
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
