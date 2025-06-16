"use client";

import { useState, useEffect } from "react";
import { Lead } from "@/types/lead";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";

interface UseResidenceLeadsProps {
  residenceId: string;
  page?: number;
  limit?: number;
}

interface LeadsResponse {
  data: Lead[];
  pagination: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

export function useResidenceLeads({ residenceId, page = 1, limit = 10 }: UseResidenceLeadsProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(page);

  const fetchLeads = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `${API_BASE_URL}/api/${API_VERSION}/leads?entityId=${residenceId}&page=${page}&limit=${limit}`;
      
      const response = await fetch(url, {
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: LeadsResponse = await response.json();

      setLeads(data.data || []);
      setTotalItems(data.pagination?.total || 0);
      setTotalPages(data.pagination?.totalPages || 1);
      setCurrentPage(data.pagination?.page || 1);
    } catch (error) {
      console.error('Fetch error:', error);
      setError("An error occurred while loading leads.");
      setLeads([]);
      setTotalItems(0);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(currentPage);
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
    leads,
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