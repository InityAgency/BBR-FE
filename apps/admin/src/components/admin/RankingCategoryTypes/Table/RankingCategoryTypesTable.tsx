"use client"

import React, { useState, useEffect } from "react";
import { useTable } from "@/hooks/useTable";
import { BaseTable } from "@/components/admin/Table/BaseTable";
import { RankingCategoryTypesFilters } from "./RankingCategoryTypesFilters";
import { columns } from "./RankingCategoryTypesColumns";
import { fuzzyFilter } from "@/lib/tableFilters";
import { CellContext } from "@tanstack/react-table";
import { RankingCategoryTypesActions } from "./RankingCategoryTypesActions";
import { RankingCategoryTypesCardList } from "../Cards/RankingCategoryTypesCardList";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RankingCategoryType } from "@/app/types/models/RankingCategoryType";
import { TablePagination } from "@/components/admin/Table/TablePagination";
import { useSearchParams } from "next/navigation";

const ITEMS_PER_PAGE = 10;

const enhancedColumns = (fetchRankingCategoryTypes: (page: number, query?: string) => Promise<void>, currentPage: number) => columns.map(column => {
    if (column.id === "actions") {
        return {
            ...column,
            cell: (props: CellContext<RankingCategoryType, unknown>) => <RankingCategoryTypesActions row={props.row} onDelete={fetchRankingCategoryTypes} currentPage={currentPage} />
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

interface RankingCategoryTypesTableProps {
    rankingCategoryTypes: RankingCategoryType[];
    loading: boolean;
    totalItems: number;
    totalPages: number;
    currentPage: number;
    goToNextPage: () => void;
    goToPreviousPage: () => void;
    goToPage: (page: number) => void;
    fetchRankingCategoryTypes: (page: number, query?: string) => Promise<void>;
}

export function RankingCategoryTypesTable({
    rankingCategoryTypes,
    loading,
    totalItems,
    totalPages,
    currentPage,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    fetchRankingCategoryTypes
}: RankingCategoryTypesTableProps) {
    const searchParams = useSearchParams();
    const queryParam = searchParams.get('query');
    const [search, setSearch] = useState(queryParam || "");
    const [calculatedTotalPages, setCalculatedTotalPages] = useState(totalPages);

    useEffect(() => {
        setCalculatedTotalPages(totalPages);
    }, [totalItems, totalPages]);

    const {
        table,
        setGlobalFilter: setTableGlobalFilter,
    } = useTable<RankingCategoryType>({
        data: rankingCategoryTypes,
        columns: enhancedColumns(fetchRankingCategoryTypes, currentPage),
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

    React.useEffect(() => {
        setTableGlobalFilter(search);
    }, [search, setTableGlobalFilter]);
    
    React.useEffect(() => {
        if (queryParam !== search) {
            setSearch(queryParam || "");
        }
    }, [queryParam]);

    const getRowClassName = (row: any) => {
        return "";
    };

    const effectiveTotalPages = Math.max(1, totalPages);

    return (
        <div className="w-full">
            <RankingCategoryTypesFilters
                globalFilter={search}
                setGlobalFilter={setSearch}
            />

            <div className="block lg:hidden">
                {loading ? (
                    <CardsSkeleton />
                ) : (
                    <RankingCategoryTypesCardList
                        rankingCategoryTypes={table.getRowModel().rows.map(row => row.original)}
                        onDelete={fetchRankingCategoryTypes}
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

export default RankingCategoryTypesTable;
