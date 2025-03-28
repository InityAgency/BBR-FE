import { api } from '../client/api.client';
import { API_ENDPOINTS } from '../endpoints';
import { Brand, PaginatedResponse, QueryParams } from './types';

export const brandsService = {
  getBrands: async (params?: QueryParams): Promise<PaginatedResponse<Brand>> => {
    const response = await api.get<PaginatedResponse<Brand>>(
      API_ENDPOINTS.brands.list,
      { query: params as Record<string, string | number | boolean> }
    );
    return response.data;
  },

  getBrand: async (id: string): Promise<Brand> => {
    const response = await api.get<Brand>(
      API_ENDPOINTS.brands.details,
      { id }
    );
    return response.data;
  },

  createBrand: async (data: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>): Promise<Brand> => {
    const response = await api.post<Brand>(API_ENDPOINTS.brands.create, data);
    return response.data;
  },

  updateBrand: async (id: string, data: Partial<Brand>): Promise<Brand> => {
    const response = await api.put<Brand>(
      API_ENDPOINTS.brands.update,
      data,
      { id }
    );
    return response.data;
  },

  deleteBrand: async (id: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.brands.delete, { id });
  },
}; 