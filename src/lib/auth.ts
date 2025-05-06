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
    const res = await api.post('/logout');
    if (res.status === 200) {
      // Handle successful logout
      console.log('Logout successful');
      //redirect the user or perform other actions
      window.location.href = '/'; // Redirect to login page
    } else {
      // Handle unsuccessful logout
      console.error('Logout failed:', res.statusText);
      return false;
    }
  } catch (error) {
    console.error('Error logging out:', error);
  }
}
