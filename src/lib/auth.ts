import api from './api';

export async function fetchUser() {
  try {
    const res = await api.get('/auth/me');

    // Extract user data from the response based on your API structure
    if (res.data && res.data.data) {
      return res.data.data;
    }
    console.log(res.data);
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function refreshAccessToken() {
  try {
    const res = await api.post('/auth/refresh');
    return res.status === 200;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
}

export async function logoutUser() {
  try {
    await api.post('/logout');
    window.location.href = '/';
  } catch (error) {
    console.error('Error logging out:', error);
  }
}
