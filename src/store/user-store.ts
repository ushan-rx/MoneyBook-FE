'use client';
import { create } from 'zustand';

export interface User {
  userId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profilePicture?: string;
}

interface UserStore {
  user: User | null | undefined; // Use undefined to indicate loading state
  error: string | null;
  updateUser: (user: User | Partial<User> | null) => void;
  setError: (error: string | null) => void;
}

export const useUserStore = create<UserStore>()((set) => ({
  user: undefined, // Start with undefined to indicate loading state
  error: null,

  updateUser: (updatedUser) => {
    if (updatedUser === null) {
      set({ user: null });
      return;
    }
    set((state) => ({
      user: state.user
        ? { ...state.user, ...updatedUser }
        : (updatedUser as User),
    }));
  },

  setError: (error) => {
    set({ error });
  },
}));
