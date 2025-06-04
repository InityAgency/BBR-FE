"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/common/Pagination";
import { Eye, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import type { Residence } from "@/types/residence";

interface RankingRow {
    residenceName: string;
    rankingCategory: string;
    position: number;
    score: number;
    residenceId: string;
    residenceSlug: string;
}

type SortField = 'position' | 'score' | 'residenceName' | 'rankingCategory';
type SortOrder = 'asc' | 'desc';

export default function DeveloperRanking() {
    const [residences, setResidences] = useState<Residence[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResidences, setTotalResidences] = useState(0);
    const [sortField, setSortField] = useState<SortField>('position');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const itemsPerPage = 10;

    const fetchResidences = async (page: number) => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/residences/me?limit=${itemsPerPage}&page=${page}`,
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
            setTotalPages(data.pagination ? Math.ceil(data.pagination.total / itemsPerPage) : 1);
            setTotalResidences(data.pagination?.total || 0);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResidences(currentPage);
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSort = (field: SortField) => {
        if (field === sortField) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
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
    ).sort((a, b) => {
        const multiplier = sortOrder === 'asc' ? 1 : -1;
        switch (sortField) {
            case 'position':
                return (a.position - b.position) * multiplier;
            case 'score':
                return (a.score - b.score) * multiplier;
            case 'residenceName':
                return a.residenceName.localeCompare(b.residenceName) * multiplier;
            case 'rankingCategory':
                return a.rankingCategory.localeCompare(b.rankingCategory) * multiplier;
            default:
                return 0;
        }
    });

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col gap-8">
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

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Failed to load rankings. Please try again later.</p>
                    </div>
                ) : rankingRows.length > 0 ? (
                    <>
                        <div className="rounded-md border">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-secondary/30">
                                        <th 
                                            className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer hover:bg-secondary/50"
                                            onClick={() => handleSort('residenceName')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Residence Name
                                                <ArrowUpDown className="w-4 h-4" />
                                            </div>
                                        </th>
                                        <th 
                                            className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer hover:bg-secondary/50"
                                            onClick={() => handleSort('rankingCategory')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Ranking Category
                                                <ArrowUpDown className="w-4 h-4" />
                                            </div>
                                        </th>
                                        <th 
                                            className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer hover:bg-secondary/50"
                                            onClick={() => handleSort('position')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Position
                                                <ArrowUpDown className="w-4 h-4" />
                                            </div>
                                        </th>
                                        <th 
                                            className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer hover:bg-secondary/50"
                                            onClick={() => handleSort('score')}
                                        >
                                            <div className="flex items-center gap-2">
                                                BBR Score
                                                <ArrowUpDown className="w-4 h-4" />
                                            </div>
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rankingRows.map((row, index) => (
                                        <tr key={`${row.residenceId}-${index}`} className="border-b transition-colors hover:bg-secondary/30">
                                            <td className="p-4 align-middle">{row.residenceName}</td>
                                            <td className="p-4 align-middle">{row.rankingCategory}</td>
                                            <td className="p-4 align-middle">{row.position}</td>
                                            <td className="p-4 align-middle">{row.score.toFixed(1)}</td>
                                            <td className="p-4 align-middle">
                                                <Link 
                                                    href={`/residences/${row.residenceSlug}`} 
                                                    className="text-xs font-medium border flex items-center justify-center px-2 py-2 rounded-md bg-secondary hover:bg-white/5 transition-all inline-flex"
                                                    target="_blank"
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No rankings found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}   