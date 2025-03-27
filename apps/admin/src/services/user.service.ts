// src/services/user.service.ts
import apiClient from '@/lib/api.client';
import { User } from "@/app/types/models/User";
import { API_ENDPOINTS } from '@/config/api.config';

interface UsersResponse {
  data: User[];
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  total?: number;
  page?: number;
  limit?: number;
}

const UserService = {
  /**
   * Fetch users with pagination, sorting and filtering
   */
  async getUsers(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    search?: string;
    status?: string[];
    role?: string[];
  }): Promise<UsersResponse> {
    try {
      console.log('Fetching users from endpoint:', API_ENDPOINTS.USER.USERS);
      console.log('With params:', params);
      console.log('Current cookies:', document.cookie);
      
      const response = await apiClient.get(API_ENDPOINTS.USER.USERS, { 
        params,
        withCredentials: true 
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error fetching users:', error);
      console.error('Request details:', {
        baseURL: apiClient.defaults.baseURL,
        endpoint: API_ENDPOINTS.USER.USERS,
        params: params
      });
      
      throw error;
    }
  },

  /**
   * Get a specific user by ID
   */
  async getUserById(id: string): Promise<User> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.USER.USERS}/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update user status
   */
  async updateUserStatus(userId: string, status: string): Promise<User> {
    try {
      const response = await apiClient.patch(
        API_ENDPOINTS.USER.USER_STATUS(userId),
        { status },
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating user status for ID ${userId}:`, error);
      throw error;
    }
  }
};

export default UserService;