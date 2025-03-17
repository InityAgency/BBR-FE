import Cookies from 'js-cookie';

// Constants
const USER_TOKEN_KEY = 'userToken';
const USER_LOGGED_IN_KEY = 'userLoggedIn';
const USER_DATA_KEY = 'userData';

// Default cookie options
const defaultOptions = {
  path: '/',
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
};

/**
 * Cookie management utility functions
 */
const CookieUtils = {
  /**
   * Set the user token cookie
   */
  setUserToken(token: string): void {
    Cookies.set(USER_TOKEN_KEY, token, defaultOptions);
    
    // For compatibility with middleware, also set in localStorage if available
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_TOKEN_KEY, token);
    }
  },

  /**
   * Get the user token from cookies
   */
  getUserToken(): string | undefined {
    return Cookies.get(USER_TOKEN_KEY);
  },

  /**
   * Set user logged in state
   */
  setUserLoggedIn(value: boolean = true): void {
    Cookies.set(USER_LOGGED_IN_KEY, String(value), defaultOptions);
    
    // For compatibility with middleware, also set in localStorage if available
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_LOGGED_IN_KEY, String(value));
    }
  },

  /**
   * Check if user is logged in
   */
  isUserLoggedIn(): boolean {
    return Cookies.get(USER_LOGGED_IN_KEY) === 'true';
  },

  /**
   * Set user data
   */
  setUserData(userData: any): void {
    Cookies.set(USER_DATA_KEY, JSON.stringify(userData), defaultOptions);
    
    // For compatibility, also set in localStorage if available
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    }
  },

  /**
   * Get user data
   */
  getUserData(): any | null {
    const userDataCookie = Cookies.get(USER_DATA_KEY);
    if (!userDataCookie) return null;
    
    try {
      return JSON.parse(userDataCookie);
    } catch (error) {
      console.error('Error parsing user data cookie:', error);
      return null;
    }
  },

  /**
   * Clear all auth cookies and localStorage
   */
  clearAll(): void {
    // Clear cookies
    Cookies.remove(USER_TOKEN_KEY, { path: '/' });
    Cookies.remove(USER_LOGGED_IN_KEY, { path: '/' });
    Cookies.remove(USER_DATA_KEY, { path: '/' });
    
    // Clear localStorage if available
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_TOKEN_KEY);
      localStorage.removeItem(USER_LOGGED_IN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
      localStorage.removeItem('user'); // For backward compatibility
    }
  },
};

export default CookieUtils;