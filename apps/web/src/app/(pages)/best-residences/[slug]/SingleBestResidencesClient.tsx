'use client';
import { ReactNode, useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import SectionLayout from "@/components/web/SectionLayout";
import Link from "next/link";
import Image from "next/image";
import { Pagination } from "@/components/common/Pagination";
import React from "react";


// Skeleton component (ako ne postoji u shadcn/ui)
const Skeleton = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-secondary/10 rounded-md ${className}`} />
);

interface Category {
    featuredImage: any;
    residenceLimitation: number;
    id: string;
    title: string;
    name: string;
    rankingCategoryType: {
        id: string;
        name: string;
        key: string;
    };
}

interface SimilarCategory {
    id: string;
    name: string;
    slug: string;
    title: string;
}

interface RankingCriteriaScore {
    rankingCriteriaId: string;
    score: number;
    name: string;
    description: string;
    isDefault: boolean;
}

interface Residence {
    id: string;
    name: string;
    slug: string;
    subtitle: string;
    description: string;
    budgetStartRange: string;
    budgetEndRange: string;
    address: string;
    featuredImage: {
        id: string;
        originalFileName: string;
        externalId: string;
    };
    country: {
        name: string;
        code: string;
    };
    city: {
        name: string;
    };
    totalScore: number;
    position: number;
    rankingCriteriaScores: RankingCriteriaScore[];
}

interface PaginationData {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
}

interface ResidencesResponse {
    data: Residence[];
    pagination: PaginationData;
}

export default function SingleBestResidencesClient() {
    const [category, setCategory] = useState<Category | null>(null);
    const [similarCategories, setSimilarCategories] = useState<SimilarCategory[]>([]);
    const [residences, setResidences] = useState<Residence[]>([]);
    const [pagination, setPagination] = useState<PaginationData>({
        total: 0,
        totalPages: 0,
        page: 1,
        limit: 10
    });
    const [loading, setLoading] = useState(true);
    const [residencesLoading, setResidencesLoading] = useState(false);

    const params = useParams();
    const slug = params.slug as string;
    const router = useRouter();

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;

    // Memoized API URLs
    const categoryUrl = `${baseUrl}/api/${apiVersion}/ranking-categories/slug/${slug}`;
    const residencesUrl = `${baseUrl}/api/${apiVersion}/public/ranking-categories/${slug}/residences`;

    // Funkcija za sortiranje ranking kriterijuma
    const sortRankingCriteria = (criteria: RankingCriteriaScore[]): RankingCriteriaScore[] => {
        return [...criteria].sort((a, b) => {
            // Prvo sortiramo po isDefault (default kriterijumi prvi)
            if (a.isDefault !== b.isDefault) {
                return a.isDefault ? -1 : 1;
            }
            // Zatim alfabetski po nazivu
            return a.name.localeCompare(b.name);
        });
    };

    // Fetch category data and similar categories
    useEffect(() => {
        const fetchCategoryData = async () => {
            if (!slug) return;

            try {
                setLoading(true);
                const response = await fetch(categoryUrl);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const categoryData = data.data;

                setCategory(categoryData);

                // Set initial pagination limit based on residenceLimitation
                if (categoryData?.residenceLimitation) {
                    setPagination(prev => ({
                        ...prev,
                        limit: Number(categoryData.residenceLimitation)
                    }));
                }

                // Fetch similar categories
                if (categoryData?.rankingCategoryType?.id) {
                    const similarResponse = await fetch(
                        `${baseUrl}/api/${apiVersion}/public/ranking-categories?limit=10&categoryTypeId=${categoryData.rankingCategoryType.id}`
                    );

                    if (similarResponse.ok) {
                        const similarData = await similarResponse.json();
                        setSimilarCategories(
                            similarData.data.filter((cat: SimilarCategory) => cat.id !== categoryData.id)
                        );
                    }
                }
            } catch (error) {
                console.error('Error fetching category data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryData();
    }, [slug, categoryUrl, baseUrl, apiVersion]);

    // Fetch residences with proper limit
    const fetchResidences = useCallback(async (page: number, limit: number) => {
        if (!slug || !limit) return;

        try {
            setResidencesLoading(true);
            const response = await fetch(`${residencesUrl}?page=${page}&limit=${limit}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ResidencesResponse = await response.json();

            // Ensure we don't show more than the category limitation
            const limitedResidences = data.data.slice(0, limit);

            // Sortiramo ranking kriterijume za svaku rezidenciju
            const residencesWithSortedCriteria = limitedResidences.map(residence => ({
                ...residence,
                rankingCriteriaScores: sortRankingCriteria(residence.rankingCriteriaScores)
            }));

            setResidences(residencesWithSortedCriteria);
            setPagination({
                ...data.pagination,
                limit: limit,
                total: Math.min(data.pagination.total, limit),
                totalPages: Math.ceil(Math.min(data.pagination.total, limit) / limit)
            });
        } catch (error) {
            console.error('Error fetching residences:', error);
            setResidences([]);
        } finally {
            setResidencesLoading(false);
        }
    }, [slug, residencesUrl]);

    // Fetch residences when dependencies change
    useEffect(() => {
        if (category?.residenceLimitation) {
            fetchResidences(pagination.page, category.residenceLimitation);
        }
    }, [category?.residenceLimitation, pagination.page, fetchResidences]);

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    // Residence Skeleton Component
    const ResidenceSkeleton = () => (
        <div className="flex flex-col lg:flex-row gap-6 rounded-xl shadow-sm items-center min-h-[300px] p-4 lg:p-0 hover:bg-secondary transition-colors duration-200">
            {/* Image Skeleton */}
            <div className="w-full lg:w-1/3 h-[200px] lg:h-[300px] relative">
                <Skeleton className="w-full h-full rounded-lg bg-secondary/50" />
            </div>

            {/* Content Skeleton */}
            <div className="w-full lg:w-2/3 flex flex-col lg:flex-row gap-4 p-2 lg:p-0">
                {/* Info Section Skeleton */}
                <div className="flex flex-col gap-2 w-full justify-center">
                    <Skeleton className="h-8 w-3/4 bg-secondary/50" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full bg-secondary/50" />
                        <Skeleton className="h-4 w-5/6 bg-secondary/50" />
                        <Skeleton className="h-4 w-4/6 bg-secondary/50" />
                    </div>
                    <Skeleton className="h-9 w-24 mt-2 bg-secondary/50" />
                </div>

                {/* Score Section Skeleton */}
                <div className="rounded-lg p-4 lg:p-5 w-full flex flex-col gap-2">
                    <div className="flex flex-row gap-2 items-center">
                        <Skeleton className="h-12 w-12 rounded-lg" />
                        <div className="space-y-1">
                            <Skeleton className="h-3 w-8 bg-secondary/50" />
                            <Skeleton className="h-3 w-12 bg-secondary/50" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <Skeleton className="h-3 w-32 bg-secondary/50" />
                                <div className="flex items-center gap-2">
                                    <Skeleton className="w-full h-2 rounded bg-secondary/50" />
                                    <Skeleton className="h-3 w-8 bg-primary bg-secondary/50" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const handleResidenceClick = (e: React.MouseEvent, residenceSlug: string) => {
        e.preventDefault();
        router.push(`/residences/${residenceSlug}`);
    };

    // Loading state
    if (loading) {
        return (
            <div>
                {/* Header Skeleton */}
                <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12">
                    <div className="w-full xl:max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-12">
                        {/* Category Header Skeleton */}
                        <div className="w-full lg:w-1/2 relative overflow-hidden rounded-lg min-h-[200px]">
                            <Skeleton className="w-full h-full" />
                            <div className="absolute inset-0 bg-white/5" />
                            <div className="absolute inset-0 p-6 flex flex-col justify-center">
                                <Skeleton className="h-6 w-48 mb-4 bg-white/5" />
                                <Skeleton className="h-12 w-3/4 bg-white/5" />
                            </div>
                        </div>

                        {/* Similar Categories Skeleton */}
                        <div className="flex flex-col gap-4 w-full lg:w-1/2">
                            <Skeleton className="h-6 w-48 bg-white/5" />
                            <div className="grid grid-cols-2 gap-2">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                                    <Skeleton key={i} className="h-5 w-full bg-white/5" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Skeleton */}
                <SectionLayout>
                    <div className="w-full flex flex-col gap-6 xl:max-w-[1600px] mx-auto">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <ResidenceSkeleton key={i} />
                        ))}
                    </div>
                </SectionLayout>
            </div>
        );
    }

    // Category not found
    if (!category) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-white text-xl">Category not found</div>
            </div>
        );
    }

    return (
        <div>
            {/* Header Section */}
            <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12">
                <div className="w-full xl:max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-12">
                    {/* Category Header */}
                    <div className="page-header flex flex-col gap-6 w-full lg:w-1/2 mx-auto ms-0 relative overflow-hidden rounded-lg flex flex-col justify-center min-h-[200px]">
                        <div className="absolute inset-0">
                            <Image
                                src={`${baseUrl}/api/${apiVersion}/media/${category.featuredImage.id}/content`}
                                alt={category.title}
                                fill
                                className="object-cover object-center"
                                priority
                            />
                            <div className="absolute inset-0 bg-black/40" />
                        </div>
                        <div className="relative z-10 p-6">
                            <p className="text-md uppercase text-left text-white mb-4">
                                Top {category.residenceLimitation} in {category.title}
                            </p>
                            <h1 className="text-4xl font-bold text-left text-white">
                                Best Branded Residences in {category.title}
                            </h1>
                        </div>
                    </div>

                    {/* Similar Categories */}
                    <div className="flex flex-col gap-4 w-full lg:w-1/2 mx-auto ms-0">
                        <span className="text-md uppercase text-left text-primary">
                            EXPLORE MORE SIMILAR RATINGS
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                            {similarCategories.map((similarCategory) => (
                                <Link
                                    key={similarCategory.id}
                                    href={`/best-residences/${similarCategory.slug}`}
                                    className="text-white hover:text-primary transition-colors duration-200 text-md"
                                >
                                    {similarCategory.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Residences Section */}
            <SectionLayout>
                <div className="w-full flex flex-col gap-6 xl:max-w-[1600px] mx-auto">
                    {residencesLoading ? (
                        // Residences loading skeleton
                        [1, 2, 3, 4, 5].map((i) => (
                            <ResidenceSkeleton key={i} />
                        ))
                    ) : residences.length === 0 ? (
                        <div className="text-center text-white text-xl py-12">
                            No residences found for this category.
                        </div>
                    ) : (
                        residences.map((residence, index) => (
                            <React.Fragment key={residence.id}>
                                <Link
                                    href={`/residences/${residence.slug}`}
                                    className="flex flex-col lg:flex-row gap-6 rounded-xl shadow-sm items-center min-h-[300px] p-4 lg:p-0 hover:bg-secondary transition-colors duration-200"
                                    onClick={(e) => handleResidenceClick(e, residence.slug)}
                                >
                                    {/* Residence Image */}
                                    <div className="w-full lg:w-1/3 h-[200px] lg:h-[300px] relative">
                                        <Image
                                            src={`${baseUrl}/api/${apiVersion}/media/${residence.featuredImage?.id}/content`}
                                            alt={residence.name}
                                            fill
                                            className="object-cover object-center rounded-lg"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                    </div>

                                    {/* Residence Content */}
                                    <div className="w-full lg:w-2/3 flex flex-col lg:flex-row gap-4 p-2 lg:p-0">
                                        {/* Residence Info */}
                                        <div className="flex flex-col gap-6 w-full justify-center">
                                            <h2 className="text-2xl lg:text-3xl font-bold">{residence.name}</h2>
                                            <p className="text-white text-sm lg:text-base">
                                                {residence.description.length > 150 
                                                    ? `${residence.description.slice(0, 250)}...`
                                                    : residence.description}
                                            </p>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/residences/${residence.slug}`);
                                                }}
                                                className="w-fit inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border shadow-xs hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 bg-secondary/50/5 hover:bg-secondary/50/10 text-white border-[#b3804c]"
                                            >
                                                View more
                                            </button>
                                        </div>

                                        {/* Scoring Section */}
                                        <div className="bg-secondary rounded-lg p-4 lg:p-5 w-full flex flex-col gap-2">
                                            <div className="flex flex-row gap-2 items-center">
                                                <p className="text-white bg-primary rounded-lg p-2 w-fit font-bold text-base lg:text-lg">
                                                    {residence.totalScore.toFixed(1)}
                                                </p>
                                                <p className="text-white uppercase font-bold text-sm lg:text-base">
                                                    BBR <br /> Score
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                                                {residence.rankingCriteriaScores
                                                    .filter((criteria) => criteria)
                                                    .map((criteria) => (
                                                        <div key={criteria.rankingCriteriaId} className="flex flex-col">
                                                            <span className="text-white text-xs lg:text-sm mb-1">
                                                                {criteria.name}
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-full h-2 bg-gray-700 rounded">
                                                                    <div
                                                                        className="h-2 bg-primary rounded"
                                                                        style={{ width: `${criteria.score}%` }}
                                                                    />
                                                                </div>
                                                                <span className="text-white text-xs lg:text-sm min-w-fit">
                                                                    {criteria.score} %
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                {/* Custom Section Placeholder */}
                                {index === 4 && (
                                    <div className="w-full col-span-2 bg-secondary rounded-lg p-8 my-4 flex items-center justify-center border">
                                        <div className="flex flex-col lg:flex-row gap-4 items-center">
                                            <div className="w-full lg:w-1/2 flex flex-col gap-3">
                                                <span className="text-md uppercase text-left text-primary">GET IN TOUCH</span>
                                                <h3 className="text-3xl font-bold">Connect with Our Experts</h3>
                                                <p className="text-muted-foreground">
                                                    Have questions or need personalized assistance? Our dedicated consultants provide tailored guidance, ensuring you make the right investment choices with confidence.
                                                    <br /> <br />
                                                    Whether you are looking for a luxury home, a profitable investment, or an exclusive lifestyle experience, our consultants are here to help.
                                                </p>
                                                <div className="flex flex-row gap-2 mt-4">
                                                    <Link href="/request-consultation" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-fit">
                                                        Schedule a consultation
                                                    </Link>
                                                    <Link href="/contact" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border shadow-xs hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 bg-white/5 hover:bg-white/10 text-white border-[#b3804c]">
                                                        Contact us
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="w-full lg:w-1/2 rounded-lg overflow-hidden">
                                                <Image src="/get-in-touch.webp" alt="Get in touch" width={500} height={500} className="rounded-lg w-full h-full object-cover" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        ))
                    )}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && residences.length > 0 && !residencesLoading && (
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </SectionLayout>
        </div>
    );
}