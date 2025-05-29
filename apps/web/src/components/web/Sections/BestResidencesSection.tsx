"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ResidenceCard } from "@/components/web/Residences/ResidenceCard";
import type { Residence } from "@/types/residence";

export default function BestResidencesSection() {
    const [residences, setResidences] = useState<Residence[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResidences = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/ranking-categories/23b6f553-c85d-471c-81c9-9f506fe325f5/residences?limit=5`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch residences');
                }

                const data = await response.json();
                setResidences(data.data || data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchResidences();
    }, []);

    return (
        <div className="w-full xl:max-w-[1600px] mx-auto flex flex-col items-end mb-8">
            <div className="w-full flex flex-col items-start lg:flex-row lg:items-end gap-4 lg:mb-8">
                <div className="flex flex-col items-start w-full gap-4 mb-8">
                    <span className="text-md lg:text-lg text-left text-primary w-full">BEST WORLDWIDE RESIDENCES</span>
                    <h2 className="text-4xl font-bold w-[100%] lg:w-[60%] text-left">Choose from the Best Branded Residences Wordwide</h2>
                </div>
                <Link href="/best-residences" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-full lg:w-fit mb-8">
                    View Ratings
                </Link>
            </div>

            <div className="w-full">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Failed to load residences. Please try again later.</p>
                    </div>
                ) : residences.length > 0 ? (
                    <div className="grid gap-6">
                        {/* First row - 2 residences */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {residences.slice(0, 2).map((residence) => (
                                <ResidenceCard 
                                    key={residence.id} 
                                    residence={residence} 
                                    score={typeof residence.totalScore === 'number' ? residence.totalScore : undefined} 
                                />
                            ))}
                        </div>

                        {/* Second row - 3 residences */}
                        {residences.length > 2 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {residences.slice(2, 5).map((residence) => (
                                    <ResidenceCard 
                                        key={residence.id} 
                                        residence={residence} 
                                        score={typeof residence.totalScore === 'number' ? residence.totalScore : undefined} 
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No residences found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}