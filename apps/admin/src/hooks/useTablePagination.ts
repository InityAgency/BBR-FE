"use client";

import { useState, useEffect } from "react";
import { Table } from "@tanstack/react-table";

interface UseTablePaginationProps {
  table: Table<any>;
  initialPageSize?: number;
  initialPageIndex?: number;
}

export function useTablePagination({
  table,
  initialPageSize = 12,
  initialPageIndex = 0,
}: UseTablePaginationProps) {
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [pageIndex, setPageIndex] = useState(initialPageIndex);

  // Sinhronizujemo stanje sa tabelom
  useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  useEffect(() => {
    table.setPageIndex(pageIndex);
  }, [pageIndex, table]);

  // Podaci za paginaciju
  const totalRows = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return {
    pageSize,
    pageIndex,
    totalRows,
    pageCount,
    startRow,
    endRow,
    setPageSize,
    setPageIndex,
    canPreviousPage: table.getCanPreviousPage(),
    canNextPage: table.getCanNextPage(),
    previousPage: () => {
      if (table.getCanPreviousPage()) {
        setPageIndex(prev => prev - 1);
      }
    },
    nextPage: () => {
      if (table.getCanNextPage()) {
        setPageIndex(prev => prev + 1);
      }
    },
    goToPage: (page: number) => {
      setPageIndex(page);
    }
  };
}