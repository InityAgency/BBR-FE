"use client";

import { useState, useEffect } from "react";
import { DeveloperResidenceCard } from "@/components/web/Residences/DeveloperResidenceCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Pagination } from "@/components/common/Pagination";
import { useRouter } from "next/navigation";
import type { Residence } from "@/types/residence";

export default function DeveloperResidences() {
    const router = useRouter();
    const [residences, setResidences] = useState<Residence[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResidences, setTotalResidences] = useState(0);
    const itemsPerPage = 12;

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

    const handleAddResidence = () => {
        router.push('/developer/residences/create');
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="mx-auto py-8">
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold sm:text-2xl text-sans">My Residences</h1>
                            <Badge variant="outline" className="self-start sm:self-auto px-2 py-1 text-sm">
                                {totalResidences} {totalResidences === 1 ? 'residence' : 'residences'}
                            </Badge>
                        </div>
                        <Button onClick={handleAddResidence}>
                            <Plus className="w-4 h-4" />
                            Add Residence
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Failed to load residences. Please try again later.</p>
                    </div>
                ) : residences.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                            {residences.map((residence) => (
                                <DeveloperResidenceCard
                                    key={residence.id}
                                    residence={residence}
                                />
                            ))}
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No residences found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}