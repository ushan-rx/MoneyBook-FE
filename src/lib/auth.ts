import { User } from '@/store/user-store';
import api from './api';

export async function fetchUser(): Promise<User> {
  const res = await api.get('/auth/me');
  const userData = res.data?.data;
  if (!userData) {
    throw new Error('User data not found in response');
  }
  return userData;
}

export async function logoutUser() {
  try {
    await api.post('/logout');
    window.location.href = '/';
  } catch (error) {
    console.error('Error logging out:', error);
  }
}
