"use client"

import React, { useState, useEffect } from "react";

import { useTable } from "@/hooks/useTable";
import { BaseTable } from "@/components/admin/Table/BaseTable";
import { LifestyleFilters } from "./LifestyleFilters";
import { columns } from "./LifestyleColumns";
import { fuzzyFilter } from "@/lib/tableFilters";
import { CellContext } from "@tanstack/react-table";
import { LifestylesActions } from "./LifestyleActions";
import { LifestyleCardList } from "../Cards/LifestyleCardList";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Lifestyle } from "@/app/types/models/Lifestyles";
import { TablePagination } from "@/components/admin/Table/TablePagination";
import { useSearchParams } from "next/navigation";

const ITEMS_PER_PAGE = 10;

const enhancedColumns = (fetchLifestyles: (page: number, query?: string) => Promise<void>, currentPage: number) => columns.map(column => {
    if (column.id === "actions") {
        return {
            ...column,
            cell: (props: CellContext<Lifestyle, unknown>) => <LifestylesActions row={props.row} onDelete={fetchLifestyles} currentPage={currentPage} />
        }
    }
    return column;
});

const TableSkeleton = () => {
    return (
        <div className="w-full border rounded-md">
            <div className="border-b px-4 py-3 flex">
                <Skeleton className="h-6 w-8 rounded-md mr-2 bg-muted/20" />
                <Skeleton className="h-6 w-1/4 rounded-md ml-2 mr-2 bg-muted/20" />
                <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
                <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
                <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
                <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
                <Skeleton className="h-6 w-40 rounded-md ml-2 bg-muted/20" />
            </div>

            {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
                <div key={index} className="border-b px-4 py-3 flex items-center">
                    <Skeleton className="h-6 w-8 rounded-md mr-2 bg-muted/20" />
                    <Skeleton className="h-6 w-1/4 rounded-md ml-2 mr-2 bg-muted/20" />
                    <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
                    <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
                    <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
                    <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
                    <Skeleton className="h-6 w-40 rounded-md ml-2 bg-muted/20" />
                </div>
            ))}
        </div>
    );
}

const CardsSkeleton = () => {
    return (
        <div className="space-y-4">
            {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
                <div key={index} className="border rounded-md p-4 space-y-3">
                    <div className="flex justify-between mt-3">
                        <Skeleton className="h-8 w-32 rounded-md bg-muted/20" />            
                        <Skeleton className="h-8 w-20 rounded-md bg-muted/20" />
                    </div>
                    <div className="flex justify-between mt-3 mb-3">
                        <Skeleton className="h-8 w-80 rounded-md bg-muted/20" />
                        <Skeleton className="h-8 w-20 rounded-md bg-muted/20" />
                    </div>
                    <Skeleton className="h-8 w-60 rounded-md bg-muted/20" />
                </div>
            ))}
        </div>
    )
}

interface LifestylesTableProps {
    lifestyles: Lifestyle[];
    loading: boolean;
    totalItems: number;
    totalPages: number;
    currentPage: number;
    goToNextPage: () => void;
    goToPreviousPage: () => void;
    goToPage: (page: number) => void;
    initialStatusFilter?: string | null;
    fetchLifestyles: (page: number, query?: string) => Promise<void>;
}

export function LifestylesTable({
    lifestyles,
    loading,
    totalItems,
    totalPages,
    currentPage,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    initialStatusFilter,
    fetchLifestyles
}: LifestylesTableProps) {
    const searchParams = useSearchParams();
    const queryParam = searchParams.get('query');
    const [search, setSearch] = useState(queryParam || "");
    const [calculatedTotalPages, setCalculatedTotalPages] = useState(totalPages);

    // Update calculatedTotalPages when totalItems or totalPages changes
    useEffect(() => {
        setCalculatedTotalPages(totalPages);
    }, [totalItems, totalPages]);

    const {
        table,
        setGlobalFilter: setTableGlobalFilter,
    } = useTable<Lifestyle>({
        data: lifestyles,
        columns: enhancedColumns(fetchLifestyles, currentPage),
        initialSorting: [{ id: "createdAt", desc: true }],
        globalFilterFn: (row, columnId, value, addMeta) => {
            const result = fuzzyFilter(row, columnId, value, addMeta);
            const id = row.original.id || "";
            const searchValue = String(value).toLowerCase();
            return result || id.toLowerCase().includes(searchValue);
        },
        initialPageSize: ITEMS_PER_PAGE,
        manualPagination: true,
        pageCount: totalPages,
    });

    // Ažuriramo lokalni filter u tabeli kada se promeni search stanje
    React.useEffect(() => {
        setTableGlobalFilter(search);
    }, [search, setTableGlobalFilter]);
    
    // Sinhronizujemo stanje search-a sa URL parametrom
    React.useEffect(() => {
        if (queryParam !== search) {
            setSearch(queryParam || "");
        }
    }, [queryParam]);

    const getRowClassName = (row: any) => {
        return "";
    };

    // Generate page numbers for pagination
    const renderPageNumbers = () => {
        const effectiveTotalPages = Math.max(1, totalPages);
        
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

        // For more than 5 pages, show first, last, and pages around current
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

    const effectiveTotalPages = Math.max(1, totalPages);

    return (
        <div className="w-full">
            <LifestyleFilters
                globalFilter={search}
                setGlobalFilter={setSearch}
            />

            <div className="block lg:hidden">
                {loading ? (
                    <CardsSkeleton />
                ) : (
                    <LifestyleCardList
                        lifestyles={table.getRowModel().rows.map(row => row.original)}
                        onDelete={fetchLifestyles}
                        currentPage={currentPage}
                    />
                )}
            </div>

            <div className="hidden lg:block">
                {loading ? (
                    <TableSkeleton />
                ) : (
                    <BaseTable
                        table={table}
                        getRowClassName={getRowClassName}
                    />
                )}
            </div>

            <TablePagination
                currentPage={currentPage}
                totalPages={effectiveTotalPages}
                totalItems={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                goToNextPage={goToNextPage}
                goToPreviousPage={goToPreviousPage}
                goToPage={goToPage}
                loading={loading}
            />
        </div>
    );
}

export default LifestylesTable;