import apiClient, { api } from '../client/api.client';
import { API_ENDPOINTS } from '../endpoints';
import { User, PaginatedResponse, QueryParams } from './types';

type CreateUserData = Omit<User, 'id' | 'createdAt' | 'updatedAt'> & {
  password?: string; 
};

export const usersService = {

  getUsers: async (params: { limit: number; page: number }): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get("/users", { params });
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  },

  getUser: async (id: string): Promise<User> => {
    const response = await api.get<User>(
      API_ENDPOINTS.users.details,
      { id }
    );
    return response.data;
  },

  createUser: async (data: CreateUserData): Promise<User> => {
    console.log("Creating user with data:", data);
    
    const userData = {
      fullName: data.fullName,
      email: data.email,
      roleId: data.roleId,
      signupMethod: data.signupMethod || "email",
      emailNotifications: data.emailNotifications || false,
      password: data.password // Sada je ovo validno svojstvo
    };
    
    try {
      const response = await api.post<User>(API_ENDPOINTS.users.create, userData);
      return response.data;
    } catch (error) {
      console.error("Error in createUser service:", error);
      if ((error as any).response) {
        console.error("Server response:", (error as any).response.data);
      }
      throw error;
    }
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.put<User>(
      API_ENDPOINTS.users.update,
      data,
      { id }
    );
    return response.data;
  },

  updateUserStatus: async (id: string, status: User['status']): Promise<User> => {
    const response = await api.patch<User>(
      API_ENDPOINTS.users.status,
      { status },
      { id }
    );
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.users.delete, { id });
  },
};