"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { TablePagination } from "@/components/web/Table/TablePagination";
import { RankingTable } from "@/components/web/Ranking/Table/RankingTable";

const ITEMS_PER_PAGE = 10;

interface RankingRow {
    residenceName: string;
    rankingCategory: string;
    position: number;
    score: number;
    residenceId: string;
    residenceSlug: string;
    rankingCategorySlug: string;
    previousPosition: number | null;
    previousScore: number;
}

interface RankingCategoryResponse {
    id: string;
    name: string;
    rankingType: string | null;
    status: string;
    hasRequest: boolean;
    previousPosition: number | null;
    previousTotalScore: number;
    residence: {
        id: string;
        name: string;
        slug: string;
        position: number;
        totalScore: number;
    };
    slug: string;
}

interface ApiResponse {
    data: RankingCategoryResponse[];
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

export default function DeveloperRanking() {
    const [rankingRows, setRankingRows] = useState<RankingRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const fetchRankingCategories = async (page: number) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/ranking-categories/me?limit=${ITEMS_PER_PAGE}&page=${page}`,
                {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch ranking categories');
            }

            const data: ApiResponse = await response.json();
            console.log(data);
            
            // Transform data to RankingRow format
            const transformedData: RankingRow[] = data.data.map(item => ({
                residenceName: item.residence.name,
                rankingCategory: item.name,
                position: item.residence.position,
                score: item.residence.totalScore,
                residenceId: item.residence.id,
                residenceSlug: item.residence.slug,
                rankingCategorySlug: item.slug,
                previousPosition: item.previousPosition,
                previousScore: item.previousTotalScore
            }));

            setRankingRows(transformedData);
            setTotalPages(data.pagination.totalPages);
            setTotalItems(data.pagination.total);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setRankingRows([]);
            setTotalPages(1);
            setTotalItems(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRankingCategories(currentPage);
    }, [currentPage]);

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="flex flex-col gap-4 py-8">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold sm:text-2xl text-sans">Rankings</h1>
                        <Badge variant="outline" className="self-start sm:self-auto px-2 py-1 text-sm">
                            {totalItems} {totalItems === 1 ? 'ranking' : 'rankings'}
                        </Badge>
                    </div>
                </div>
            </div>

            {error && (
                <div className="text-red-500 font-semibold border border-red-200 bg-red-50 p-4 rounded-md">
                    {error}
                </div>
            )}

            <RankingTable
                rankings={rankingRows}
                loading={loading}
                totalItems={totalItems}
                totalPages={totalPages}
                currentPage={currentPage}
                goToNextPage={goToNextPage}
                goToPreviousPage={goToPreviousPage}
                goToPage={goToPage}
            />
        </div>
    );
}