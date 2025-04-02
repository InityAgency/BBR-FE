// src/components/admin/Table/TablePagination.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
  loading?: boolean;
  className?: string;
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  goToNextPage,
  goToPreviousPage,
  goToPage,
  loading = false,
  className = ""
}: TablePaginationProps) {
  const startRow = (currentPage - 1) * itemsPerPage + 1;
  const endRow = Math.min(currentPage * itemsPerPage, totalItems);
  const effectiveTotalPages = Math.max(1, totalPages);

  // Generate page numbers for pagination
  const renderPageNumbers = () => {
    if (effectiveTotalPages <= 5) {
      return Array.from({ length: effectiveTotalPages }, (_, i) => (
        <Button
          key={i}
          variant={currentPage === i + 1 ? "default" : "outline"}
          size="sm"
          className="w-8 h-8"
          onClick={() => goToPage(i + 1)}
          disabled={loading}
        >
          {i + 1}
        </Button>
      ));
    }

    const pageNumbers = [];

    // Always show first page
    pageNumbers.push(
      <Button
        key={1}
        variant={currentPage === 1 ? "default" : "outline"}
        size="sm"
        className="w-8 h-8"
        onClick={() => goToPage(1)}
        disabled={loading}
      >
        1
      </Button>
    );

    // Show ellipsis if current page is not near the beginning
    if (currentPage > 3) {
      pageNumbers.push(
        <span key="startEllipsis" className="px-1">...</span>
      );
    }

    // Show pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(effectiveTotalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== effectiveTotalPages) {
        pageNumbers.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            size="sm"
            className="w-8 h-8"
            onClick={() => goToPage(i)}
            disabled={loading}
          >
            {i}
          </Button>
        );
      }
    }

    // Show ellipsis if current page is not near the end
    if (currentPage < effectiveTotalPages - 2) {
      pageNumbers.push(
        <span key="endEllipsis" className="px-1">...</span>
      );
    }

    // Always show last page if there are multiple pages
    if (effectiveTotalPages > 1) {
      pageNumbers.push(
        <Button
          key={effectiveTotalPages}
          variant={currentPage === effectiveTotalPages ? "default" : "outline"}
          size="sm"
          className="w-8 h-8"
          onClick={() => goToPage(effectiveTotalPages)}
          disabled={loading}
        >
          {effectiveTotalPages}
        </Button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className={`flex flex-col md:flex-row items-center justify-between py-4 gap-4 ${className}`}>
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {effectiveTotalPages} | Total items: {totalItems}
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          onClick={goToPreviousPage} 
          disabled={currentPage <= 1 || loading}
        >
          Previous
        </Button>
        
        <div className="flex items-center space-x-1">
          {renderPageNumbers()}
        </div>

        <Button 
          variant="outline" 
          onClick={goToNextPage} 
          disabled={currentPage >= effectiveTotalPages || loading}
        >
          Next
        </Button>
      </div>
    </div>
  );
}