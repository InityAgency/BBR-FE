import { api } from '../client/api.client';
import { API_ENDPOINTS } from '../endpoints';
import { Amenity, PaginatedResponse, QueryParams } from './types';

export const amenitiesService = {
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<Amenity>> => {
    const response = await api.get<PaginatedResponse<Amenity>>(
      API_ENDPOINTS.amenities.list,
      { query: params as Record<string, string | number | boolean> }
    );

    return response.data;
  },

  getAmenity: async (id: string): Promise<Amenity> => {
    const response = await api.get<Amenity>(API_ENDPOINTS.amenities.details, { id });
    return response.data;
  },

  createAmenity: async (data: Omit<Amenity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'iconId'>): Promise<Amenity> => {
    const response = await api.post<Amenity>(API_ENDPOINTS.amenities.create, data);
    return response.data;
  },

  updateAmenity: async (id: string, data: Partial<Amenity>): Promise<Amenity> => {
    const response = await api.put<Amenity>(API_ENDPOINTS.amenities.update, data, { id });
    return response.data;
  },

  deleteAmenity: async (id: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.amenities.delete, { id });
  },

  uploadIcon: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'AMENITY');

    const response = await api.post<{ url: string }>(API_ENDPOINTS.amenities.uploadIcon, formData);
    return response.data.url;
  },
};
    