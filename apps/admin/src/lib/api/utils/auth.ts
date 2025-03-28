import Cookies from 'js-cookie';

export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

export const clearAuthData = () => {
  if (typeof window !== 'undefined') {
    Cookies.remove('userLoggedIn', { path: '/' });
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
  }
};

export const generateRequestId = () => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}; 