import { api } from '../client/api.client';
import { API_ENDPOINTS } from '../endpoints';
import { User, PaginatedResponse, QueryParams } from './types';

export const usersService = {
  getUsers: async (params?: QueryParams): Promise<PaginatedResponse<User>> => {
    const response = await api.get<PaginatedResponse<User>>(
      API_ENDPOINTS.users.list,
      { query: params as Record<string, string | number | boolean> }
    );
    return response.data;
  },

  getUser: async (id: string): Promise<User> => {
    const response = await api.get<User>(
      API_ENDPOINTS.users.details,
      { id }
    );
    return response.data;
  },

  createUser: async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
    const response = await api.post<User>(API_ENDPOINTS.users.create, data);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.put<User>(
      API_ENDPOINTS.users.update,
      data,
      { id }
    );
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.users.delete, { id });
  },
}; 