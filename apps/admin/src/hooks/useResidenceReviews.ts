"use client";

import { useState, useEffect } from "react";
import { Review, ReviewsResponse } from "@/types/models/Review";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";

interface UseResidenceReviewsProps {
  residenceId: string;
  page?: number;
  limit?: number;
}

export function useResidenceReviews({ residenceId, page = 1, limit = 10 }: UseResidenceReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(page);

  const fetchReviews = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `${API_BASE_URL}/api/${API_VERSION}/reviews?residenceId=${residenceId}&page=${page}&limit=${limit}`;
      
      const response = await fetch(url, {
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ReviewsResponse = await response.json();

      setReviews(data.data || []);
      setTotalItems(data.pagination?.total || 0);
      setTotalPages(data.pagination?.totalPages || 1);
      setCurrentPage(data.pagination?.page || 1);
    } catch (error) {
      console.error('Fetch error:', error);
      setError("An error occurred while loading reviews.");
      setReviews([]);
      setTotalItems(0);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(currentPage);
  }, [currentPage, residenceId]);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    reviews,
    loading,
    error,
    totalItems,
    totalPages,
    currentPage,
    goToNextPage,
    goToPreviousPage,
    goToPage,
  };
} 