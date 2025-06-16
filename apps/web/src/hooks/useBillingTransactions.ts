import { useState, useEffect } from "react";
import { BillingTransaction } from "@/types/billing";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";

const ITEMS_PER_PAGE = 10;

interface BillingTransactionsResponse {
  data?: BillingTransaction[];
  statusCode?: number;
  message?: string;
  pagination?: {
    total?: number;
    totalPages?: number;
    page?: number;
    limit?: number;
  };
  timestamp?: string;
  path?: string;
}

export function useBillingTransactions() {
  const [transactions, setTransactions] = useState<BillingTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      let url = `${API_BASE_URL}/api/${API_VERSION}/billing/transactions?page=${page}&limit=${ITEMS_PER_PAGE}`;
      const response = await fetch(url, {
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: BillingTransactionsResponse = await response.json();
      setTransactions(data.data || []);
      setTotalItems(data.pagination?.total || 0);
      setTotalPages(data.pagination?.totalPages || 1);
      setCurrentPage(data.pagination?.page || 1);
    } catch (error) {
      setError("Došlo je do greške prilikom učitavanja transakcija.");
      setTransactions([]);
      setTotalItems(0);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

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
    transactions,
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