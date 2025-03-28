import { Brand } from "../types/models/Brand";
import { apiClient } from "../services/apiClient";

export const getBrandById = async (id: string): Promise<Brand> => {
  try {
    const response = await apiClient.get(`/brands/${id}`);
    return response.data.data;
  } catch (error) {
    if (error instanceof Error && error.message === 'Resource not found') {
      throw new Error('Brand not found');
    }
    throw error;
  }
};

export const updateBrandStatus = async (id: string, status: string): Promise<Brand> => {
  try {
    const response = await apiClient.patch(`/brands/${id}/status`, { status });
    return response.data.data;
  } catch (error) {
    if (error instanceof Error && error.message === 'Resource not found') {
      throw new Error('Brand not found');
    }
    throw error;
  }
};

export const deleteBrand = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/brands/${id}`);
  } catch (error) {
    if (error instanceof Error && error.message === 'Resource not found') {
      throw new Error('Brand not found');
    }
    throw error;
  }
}; 