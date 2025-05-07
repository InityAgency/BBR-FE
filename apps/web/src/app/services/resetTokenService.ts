const TOKEN_KEY = 'resetToken';
const TOKEN_EXPIRES_KEY = 'resetTokenExpiresAt';
const TOKEN_EXPIRY_DURATION = 60 * 60 * 1000; 
export const resetTokenService = {

  saveToken: (token: string): void => {
    const expiresAt = Date.now() + TOKEN_EXPIRY_DURATION;
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(TOKEN_EXPIRES_KEY, expiresAt.toString());
  },

  isTokenValid: (): boolean => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const expiresAt = sessionStorage.getItem(TOKEN_EXPIRES_KEY);
    
    if (!token || !expiresAt) return false;
    
    return Date.now() < Number(expiresAt);
  },

  getToken: (): string | null => {
    if (!resetTokenService.isTokenValid()) {
      resetTokenService.clearToken();
      return null;
    }
    
    return sessionStorage.getItem(TOKEN_KEY);
  },

  updateToken: (newToken: string): void => {
    resetTokenService.saveToken(newToken);
  },

  clearToken: (): void => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_EXPIRES_KEY);
  },
};

export default resetTokenService;