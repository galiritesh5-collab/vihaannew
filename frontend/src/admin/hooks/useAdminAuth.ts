import { useState, useEffect } from 'react';
import { AdminUser } from '../types';
import { AdminAuthService } from '../services/AdminAuthService';
import { useNavigate } from 'react-router-dom';

export function useAdminAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = AdminAuthService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    const u = await AdminAuthService.login(email, pass);
    setUser(u);
    navigate('/admin/dashboard');
  };

  const logout = async () => {
    await AdminAuthService.logout();
    setUser(null);
    navigate('/admin-login');
  };

  return { user, loading, login, logout };
}
