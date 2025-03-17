/**
 * Simple token management utility functions
 * Uses localStorage for now - in a production app, consider using cookies
 */
const TokenUtils = {
    /**
     * Set user logged in flag
     */
    setUserLoggedIn(value: boolean = true): void {
      localStorage.setItem('userLoggedIn', String(value));
    },
  
    /**
     * Check if user is logged in
     */
    isUserLoggedIn(): boolean {
      return localStorage.getItem('userLoggedIn') === 'true';
    },
  
    /**
     * Remove user logged in flag
     */
    removeUserLoggedIn(): void {
      localStorage.removeItem('userLoggedIn');
    },
  
    /**
     * Clear all auth data
     */
    clearAll(): void {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userLoggedIn');
      localStorage.removeItem('user');
    },
  };
  
  export default TokenUtils;