import { API_BASE_URL, API_VERSION } from "../../../app/constants/api";  
import { Residence } from "../../../app/types/models/Residence";

class ResidencesService {
  private baseUrl = `${API_BASE_URL}/api/${API_VERSION}/residences`;

  async getResidenceById(id: string): Promise<Residence | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch residence");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching residence:", error);
      throw error;
    }
  }

  async updateResidenceStatus(id: string, status: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update residence status");
      }
    } catch (error) {
      console.error("Error updating residence status:", error);
      throw error;
    }
  }

  async deleteResidence(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete residence");
      }
    } catch (error) {
      console.error("Error deleting residence:", error);
      throw error;
    }
  }
}

export const residencesService = new ResidencesService(); 