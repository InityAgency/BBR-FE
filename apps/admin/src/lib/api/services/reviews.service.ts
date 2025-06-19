import { API_BASE_URL, API_VERSION } from "../../../app/constants/api";  
import { Review, ReviewsResponse, ReviewStatus } from "../../../app/types/models/Review";

interface GetReviewsParams {
  page?: number;
  limit?: number;
  statuses?: string;
}

class ReviewsService {
  private baseUrl = `${API_BASE_URL}/api/${API_VERSION}`;

  async getReviews(params: GetReviewsParams = {}): Promise<ReviewsResponse> {
    const { page = 1, limit = 10, statuses } = params;
    
    const searchParams = new URLSearchParams();
    searchParams.set('page', page.toString());
    searchParams.set('limit', limit.toString());
    
    if (statuses) {
      // Split comma-separated statuses and add each as separate parameter
      const statusArray = statuses.split(',');
      statusArray.forEach(status => {
        if (status.trim()) {
          searchParams.append('status', status.trim());
        }
      });
    }
    
    const response = await fetch(`${this.baseUrl}/reviews?${searchParams.toString()}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch reviews: ${response.status}`);
    }

    return response.json();
  }

  async getReviewById(id: string): Promise<{ data: Review }> {
    const response = await fetch(`${this.baseUrl}/reviews/${id}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch review: ${response.status}`);
    }

    return response.json();
  }

  async updateReviewStatus(id: string, status: ReviewStatus): Promise<{ data: Review }> {
    const response = await fetch(`${this.baseUrl}/reviews/${id}/status`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update review status: ${response.status}`);
    }

    return response.json();
  }

  async deleteReview(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/reviews/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete review: ${response.status}`);
    }
  }
}

export const reviewsService = new ReviewsService();