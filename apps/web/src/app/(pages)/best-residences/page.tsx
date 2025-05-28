'use client';
import SectionLayout from "@/components/web/SectionLayout";
import RankingCard from "@/components/web/Ranking/RankingCard";
import { BrandCard } from "@/components/brands/BrandCard";
import { useEffect, useState, useCallback } from "react";
import AiMatchmakingToolSection from "@/components/web/Sections/AiMatchmakingToolSection";
import RankingDirectory from "@/components/web/Sections/RankingDirectory";

interface RankingCategory {
    slug: any;
    id: string;
    name: string;
    title: string;
    residenceLimitation: number;
    featuredImage: {
        id: string;
    };
    categoryTypeId: string;
}

interface Brand {
    id: string;
    name: string;
    slug: string;
    logo: {
        id: string;
    };
    description: string;
}

interface CategorizedData {
    continents: RankingCategory[];
    countries: RankingCategory[];
    cities: RankingCategory[];
    lifestyle: RankingCategory[];
}

export default function BestResidences() {
    const [data, setData] = useState<CategorizedData>({
        continents: [],
        countries: [],
        cities: [],
        lifestyle: []
    });
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;

    // Category type IDs
    const categoryTypes = {
        continents: '6e83bbd6-7363-4ec8-82b1-73e288ec17f6',
        countries: 'ef03dc8f-ccde-464c-9e36-1ff9d3c79645',
        cities: '9f24a349-c942-43b4-8488-88d57aee65be',
        lifestyle: '13680189-a51c-4751-be48-5c283241588a'
    };

    const fetchAllCategories = useCallback(async () => {
        if (!baseUrl || !apiVersion) return;

        try {
            setLoading(true);
            setError(null);

            // Kreiraj promises za sve kategorije odjednom
            const promises = Object.entries(categoryTypes).map(async ([key, typeId]) => {
                const url = `${baseUrl}/api/${apiVersion}/public/ranking-categories?limit=20&categoryTypeId=${typeId}`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Failed to fetch ${key}: ${response.status}`);
                }

                const result = await response.json();
                return { key, data: result.data || [] };
            });

            // Izvršava sve zahteve paralelno
            const results = await Promise.all(promises);

            // Grupiši rezultate po kategorijama
            const categorizedData: CategorizedData = {
                continents: [],
                countries: [],
                cities: [],
                lifestyle: []
            };

            results.forEach(({ key, data }) => {
                categorizedData[key as keyof CategorizedData] = data;
            });

            setData(categorizedData);
        } catch (err) {
            console.error('Error fetching ranking categories:', err);
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
            setLoading(false);
        }
    }, [baseUrl, apiVersion]);

    const fetchBrands = useCallback(async () => {
        if (!baseUrl || !apiVersion) return;

        try {
            const url = `${baseUrl}/api/${apiVersion}/public/brands?limit=12&sortBy=updatedAt&sortOrder=desc`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch brands: ${response.status}`);
            }

            const result = await response.json();
            setBrands(result.data || []);
        } catch (err) {
            console.error('Error fetching brands:', err);
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
        }
    }, [baseUrl, apiVersion]);

    useEffect(() => {
        Promise.all([fetchAllCategories(), fetchBrands()]);
    }, [fetchAllCategories, fetchBrands]);

    if (loading) {
        return (
            <div>
                <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-12">
                    <div className="page-header flex flex-col gap-6 w-full lg:w-1/2 mx-auto ms-0">
                        <p className="text-md uppercase text-left text-primary">ALL OUR RANKING</p>
                        <h1 className="text-4xl font-bold text-left">Find the best branded residences in top categories</h1>
                    </div>
                </div>
                <SectionLayout>
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="text-xl">Loading...</div>
                    </div>
                </SectionLayout>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-12">
                    <div className="page-header flex flex-col gap-6 w-full lg:w-1/2 mx-auto ms-0">
                        <p className="text-md uppercase text-left text-primary">ALL OUR RANKING</p>
                        <h1 className="text-4xl font-bold text-left">Find the best branded residences in top categories</h1>
                    </div>
                </div>
                <SectionLayout>
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="text-xl text-red-500">Error: {error}</div>
                    </div>
                </SectionLayout>
            </div>
        );
    }

    return (
        <div>
            {/* Header Section - iznad SectionLayout */}
            <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 ">
                <div className="w-full xl:max-w-[1600px] mx-auto">
                    <div className="page-header flex flex-col gap-6 w-full lg:w-1/2 mx-auto ms-0 ">
                        <p className="text-md uppercase text-left text-primary">ALL OUR RANKING</p>
                        <h1 className="text-4xl font-bold text-left">Find the best branded residences in top categories</h1>
                    </div>
                </div>
            </div>

            {/* Continents Section */}
            <div className="w-full">
                <SectionLayout>
                    <div className="w-full xl:max-w-[1600px] mx-auto">
                        <h2 className="text-3xl font-bold w-full mb-12">Top Branded Residences by Geographical Area</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
                            {data.continents.map((category) => (
                                <RankingCard
                                    key={category.id}
                                    category={category}
                                    baseUrl={baseUrl!}
                                    apiVersion={apiVersion!}
                                />
                            ))}
                        </div>
                    </div>
                </SectionLayout>
            </div>

            {/* Countries Section */}
            <div className="w-full bg-secondary py-6">
                <SectionLayout>
                    <div className="w-full xl:max-w-[1600px] mx-auto">
                        <span className="text-md uppercase text-left text-primary inline-block mb-4">BEST WORLDWIDE RESIDENCES</span>
                        <h2 className="text-3xl font-bold w-full mb-16">Top Branded Residences by Country</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
                            {data.countries.map((category) => (
                                <RankingCard
                                    key={category.id}
                                    category={category}
                                    baseUrl={baseUrl!}
                                    apiVersion={apiVersion!}
                                />
                            ))}
                        </div>
                    </div>
                </SectionLayout>
            </div>

            {/* Cities Section */}
            <div className="w-full">
                <SectionLayout>
                    <div className="w-full xl:max-w-[1600px] mx-auto">
                        <h2 className="text-3xl font-bold w-full mb-12">Top Branded Residences by City</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full">
                            {data.cities.map((category) => (
                                <RankingCard
                                    key={category.id}
                                    category={category}
                                    baseUrl={baseUrl!}
                                    apiVersion={apiVersion!}
                                />
                            ))}
                        </div>
                    </div>
                </SectionLayout>
            </div>

            <AiMatchmakingToolSection />

            {/* Lifestyle Section */}
            <div className="w-full bg-secondary py-6">
                <SectionLayout>
                    <div className="w-full xl:max-w-[1600px] mx-auto">
                        <h2 className="text-3xl font-bold w-full mb-16">Top Branded Residences by Lifestyle</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
                            {data.lifestyle.map((category) => (
                                <RankingCard
                                    key={category.id}
                                    category={category}
                                    baseUrl={baseUrl!}
                                    apiVersion={apiVersion!}
                                />
                            ))}
                        </div>
                    </div>
                </SectionLayout>
            </div>

            <div className="w-full py-6">
                <SectionLayout>
                    <div className="w-full xl:max-w-[1600px] mx-auto">
                        <h2 className="text-3xl font-bold w-full mb-16 text-left lg:text-center">Top Branded Residences by Brands</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                            {brands.map((brand) => (
                                <BrandCard
                                    key={brand.id}
                                    brand={brand}
                                />
                            ))}
                        </div>
                    </div>
                </SectionLayout>
            </div>

            <div className="w-full bg-secondary">
                <SectionLayout>
                    <div className="w-full xl:max-w-[1600px] mx-auto">
                        <h2 className="text-3xl font-bold w-full mb-12 text-left lg:text-center">Ranking Directory</h2>

                        <RankingDirectory />
                    </div>
                </SectionLayout>
            </div>
        </div>
    );
}