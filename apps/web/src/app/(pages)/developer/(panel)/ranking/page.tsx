"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { TablePagination } from "@/components/web/Table/TablePagination";
import { RankingTable } from "@/components/web/Ranking/Table/RankingTable";
import type { Residence } from "@/types/residence";

const ITEMS_PER_PAGE = 10;

interface RankingRow {
    residenceName: string;
    rankingCategory: string;
    position: number;
    score: number;
    residenceId: string;
    residenceSlug: string;
}

export default function DeveloperRanking() {
    const [residences, setResidences] = useState<Residence[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResidences, setTotalResidences] = useState(0);

    const fetchResidences = async (page: number) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/residences/me?limit=${ITEMS_PER_PAGE}&page=${page}`,
                {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch residences');
            }

            const data = await response.json();
            setResidences(data.data || []);
            setTotalPages(data.pagination ? Math.ceil(data.pagination.total / ITEMS_PER_PAGE) : 1);
            setTotalResidences(data.pagination?.total || 0);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setResidences([]);
            setTotalPages(1);
            setTotalResidences(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResidences(currentPage);
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

    // Transform residences data into ranking rows
    const rankingRows: RankingRow[] = residences.flatMap(residence => 
        residence.totalScores.map(score => ({
            residenceName: residence.name,
            rankingCategory: score.rankingCategory.title,
            position: score.position,
            score: score.totalScore,
            residenceId: residence.id,
            residenceSlug: residence.slug
        }))
    );

    return (
        <div className="flex flex-col gap-4 py-8">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold sm:text-2xl text-sans">Rankings</h1>
                        <Badge variant="outline" className="self-start sm:self-auto px-2 py-1 text-sm">
                            {totalResidences} {totalResidences === 1 ? 'residence' : 'residences'}
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
                totalItems={totalResidences}
                totalPages={totalPages}
                currentPage={currentPage}
                goToNextPage={goToNextPage}
                goToPreviousPage={goToPreviousPage}
                goToPage={goToPage}
            />
        </div>
    );
}