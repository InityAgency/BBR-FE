'use client';
import { ReactNode, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SectionLayout from "@/components/web/SectionLayout";
import Link from "next/link";
import Image from "next/image";
import { Pagination } from "@/components/common/Pagination";

interface Category {
    featuredImage: any;
    residenceLimitation: ReactNode;
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

interface Pagination {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
}

interface ResidencesResponse {
    data: Residence[];
    pagination: Pagination;
}

export default function CategoryPage() {
    const [category, setCategory] = useState<Category | null>(null);
    const [similarCategories, setSimilarCategories] = useState<SimilarCategory[]>([]);
    const [residences, setResidences] = useState<Residence[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        totalPages: 0,
        page: 1,
        limit: 10
    });
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const slug = params.slug;
    const router = useRouter();

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;
    const categoryUrl = `${baseUrl}/api/${apiVersion}/ranking-categories/slug/${slug}`;
    const residencesUrl = `${baseUrl}/api/${apiVersion}/public/ranking-categories/${slug}/residences`;

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await fetch(categoryUrl);
                const data = await response.json();
                setCategory(data.data);
                
                // Fetch similar categories after getting the main category
                if (data.data?.rankingCategoryType?.id) {
                    const similarResponse = await fetch(
                        `${baseUrl}/api/${apiVersion}/ranking-categories?limit=10&categoryTypeId=${data.data.rankingCategoryType.id}`
                    );
                    const similarData = await similarResponse.json();
                    setSimilarCategories(similarData.data.filter((cat: SimilarCategory) => cat.id !== data.data.id));
                }
            } catch (error) {
                console.error('Error fetching category:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [slug]);

    useEffect(() => {
        const fetchResidences = async () => {
            try {
                const response = await fetch(`${residencesUrl}?page=${pagination.page}&limit=${pagination.limit}`);
                const data: ResidencesResponse = await response.json();
                setResidences(data.data);
                setPagination(data.pagination);
            } catch (error) {
                console.error('Error fetching residences:', error);
            }
        };

        if (slug) {
            fetchResidences();
        }
    }, [slug, pagination.page]);

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!category) {
        return <div>Category not found</div>;
    }

    return (
        <div>
            <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12">
                <div className="w-full xl:max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-12">
                    <div className="page-header flex flex-col gap-6 w-full lg:w-1/2 mx-auto ms-0 relative overflow-hidden rounded-lg flex flex-col justify-center min-h-[200px]">
                        <div className="absolute inset-0">
                            <Image 
                                src={`${baseUrl}/api/${apiVersion}/media/${category.featuredImage.id}/content`} 
                                alt={category.title} 
                                fill 
                                className="object-cover object-center" 
                            />
                            <div className="absolute inset-0 bg-black/40" />
                        </div>
                        <div className="relative z-10 p-6"> 
                            <p className="text-md uppercase text-left text-white mb-4">Top {category.residenceLimitation} in {category.title}</p>
                            <h1 className="text-4xl font-bold text-left text-white">Best Branded Residences in {category.title}</h1>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 w-full lg:w-1/2 mx-auto ms-0">
                        <span className="text-md uppercase text-left text-primary">EXPLORE MORE SIMILAR RATINGS</span>
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
            <SectionLayout>
                <div className="w-full flex flex-col gap-6 w-full xl:max-w-[1600px] mx-auto">
                    {residences.length === 0 ? (
                        <div className="text-center text-white text-xl py-12">
                            No residences found for this category.
                        </div>
                    ) : (
                        residences.map((residence) => (
                            <Link href={`/residences/${residence.slug}`} key={residence.id} className="flex flex-col lg:flex-row gap-6 rounded-xl shadow-sm items-center min-h-[300px] p-4 lg:p-0">
                                <div className="w-full lg:w-1/3 h-[200px] lg:h-[300px] relative">
                                    <Image
                                        src={`${baseUrl}/api/${apiVersion}/media/${residence.featuredImage.id}/content`}
                                        alt={residence.name}
                                        fill
                                        className="object-cover object-center rounded-lg"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                </div>
                                <div className="w-full lg:w-2/3 flex flex-col lg:flex-row gap-4 p-2 lg:p-0">
                                    <div className="flex flex-col gap-2 w-full justify-center">
                                        <h2 className="text-2xl lg:text-3xl font-bold">{residence.name}</h2>
                                        <p className="text-white text-sm lg:text-base line-clamp-3 lg:line-clamp-none">{residence.description}</p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/residences/${residence.slug}`);
                                            }}
                                            className="w-fit inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border shadow-xs hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 bg-white/5 hover:bg-white/10 text-white border-[#b3804c]"
                                        >
                                            View more
                                        </button>
                                    </div>
                                    <div className="bg-secondary rounded-lg p-4 lg:p-5 w-full flex flex-col gap-2">
                                        <div className="flex flex-row gap-2 items-center">
                                            <p className="text-white bg-primary rounded-lg p-2 w-fit font-bold text-base lg:text-lg">
                                                {residence.totalScore.toFixed(1)}
                                            </p>
                                            <p className="text-white uppercase font-bold text-sm lg:text-base">BBR <br /> Score</p>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                                            {residence.rankingCriteriaScores
                                                .filter((criteria) => criteria.isDefault)
                                                .map((criteria) => (
                                                    <div key={criteria.rankingCriteriaId} className="flex flex-col">
                                                        <span className="text-white text-xs lg:text-sm mb-1">{criteria.name}</span>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-full h-2 bg-gray-700 rounded">
                                                                <div
                                                                    className="h-2 bg-primary rounded"
                                                                    style={{ width: `${criteria.score}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-white text-xs lg:text-sm min-w-fit">{criteria.score} %</span>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}

                    {pagination.totalPages > 1 && residences.length > 0 && (
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