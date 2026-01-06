import { create } from 'zustand';
import http from '../api/http';

export const useAuth = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await http.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token, loading: false });
      return true;
    } catch (e) {
      set({ error: e.response?.data?.message || 'Login failed', loading: false });
      return false;
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  }
}));