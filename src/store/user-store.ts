'use client';
import { create } from 'zustand';
import api from '@/lib/api';

interface User {
  userId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface UserStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  isLoading: false,
  error: null,

  fetchUser: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.get('/auth/me');

      // Extract user data from response 
      const userData = response.data?.data;

      if (userData) {
        set({ user: userData, isLoading: false });
      } else {
        set({ error: 'User data not found in response', isLoading: false });
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      set({ error: 'Failed to fetch user data', isLoading: false });
    }
  },

  updateUser: (updatedUser) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedUser } : null,
    }));
  },
}));
