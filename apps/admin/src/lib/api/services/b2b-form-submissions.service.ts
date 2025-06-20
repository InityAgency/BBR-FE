import { API_BASE_URL, API_VERSION } from "../../../app/constants/api";
import { B2BFormSubmission } from "../../../app/types/models/B2BFormSubmission";

export enum B2BFormSubmissionStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  COMPLETED = 'COMPLETED',
}

interface GetB2BFormSubmissionsParams {
  page?: number;
  limit?: number;
  statuses?: string;
  query?: string;
}

interface B2BFormSubmissionsResponse {
  data: B2BFormSubmission[];
  statusCode: number;
  message: string;
  pagination: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
  timestamp: string;
  path: string;
}

class B2BFormSubmissionsService {
  private baseUrl = `${API_BASE_URL}/api/${API_VERSION}`;

  async getB2BFormSubmissions(params: GetB2BFormSubmissionsParams = {}): Promise<B2BFormSubmissionsResponse> {
    const { page = 1, limit = 10, statuses, query } = params;
    
    const searchParams = new URLSearchParams();
    searchParams.set('page', page.toString());
    searchParams.set('limit', limit.toString());
    
    if (query) {
      searchParams.set('query', query);
    }
    
    if (statuses) {
      // Split comma-separated statuses and add each as separate parameter
      const statusArray = statuses.split(',');
      statusArray.forEach(status => {
        if (status.trim()) {
          searchParams.append('status', status.trim());
        }
      });
    }
    
    const response = await fetch(`${this.baseUrl}/b2b-form-submissions?${searchParams.toString()}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch B2B form submissions: ${response.status}`);
    }

    return response.json();
  }

  async getB2BFormSubmissionById(id: string): Promise<{ data: B2BFormSubmission }> {
    const response = await fetch(`${this.baseUrl}/b2b-form-submissions/${id}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch B2B form submission: ${response.status}`);
    }

    return response.json();
  }

  async updateB2BFormSubmissionStatus(id: string, status: B2BFormSubmissionStatus): Promise<{ data: B2BFormSubmission }> {
    const response = await fetch(`${this.baseUrl}/b2b-form-submissions/${id}/status`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update B2B form submission status: ${response.status}`);
    }

    return response.json();
  }

  async deleteB2BFormSubmission(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/b2b-form-submissions/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete B2B form submission: ${response.status}`);
    }
  }
}

export const b2bFormSubmissionsService = new B2BFormSubmissionsService(); 