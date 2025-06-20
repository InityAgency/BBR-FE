import { apiClient } from "../app/services/apiClient";
import { REVIEWS } from "@/app/constants/api";
import { Review } from "@/types/models/Review";

export const updateReviewStatus = async (reviewId: string, status: Review['status']) => {
    try {
        const response = await apiClient.patch(REVIEWS.UPDATE_STATUS(reviewId), { status });
        return response.data;
    } catch (error) {
        // It's better to let the caller handle the error message for the user
        console.error("Failed to update review status:", error);
        throw error;
    }
}; 