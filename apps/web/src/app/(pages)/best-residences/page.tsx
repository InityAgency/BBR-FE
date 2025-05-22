'use client';
import SectionLayout from "@/components/web/SectionLayout";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface RankingCategory {
    slug: any;
    id: string;
    name: string;
    title: string;
    residenceLimitation: number;
    featuredImage: {
        id: string;
    };
}

export default function BestResidences() {
    const [rankingCategories, setRankingCategories] = useState<RankingCategory[]>([]);
    const [loading, setLoading] = useState(true);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;
    const url = `${baseUrl}/api/${apiVersion}/ranking-categories?limit=20&categoryTypeId=ef03dc8f-ccde-464c-9e36-1ff9d3c79645`;

    useEffect(() => {
        const fetchRankingCategories = async () => {
            try {
                const response = await fetch(url);
                const data = await response.json();
                setRankingCategories(data.data || []);
            } catch (error) {
                console.error('Error fetching ranking categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRankingCategories();
    }, []);

    return (
        <div>
            <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-12">
                <div className="page-header flex flex-col gap-6 w-full lg:w-1/2 mx-auto ms-0">
                    <p className="text-md uppercase text-left text-primary">ALL OUR RANKING</p>
                    <h1 className="text-4xl font-bold text-left">Find the best branded residences in top categories</h1>
                </div>
            </div>
            <SectionLayout className="w-full max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto">
                <h2 className="text-3xl font-bold w-full mb-8">Top Branded Residences by Geographical Area</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        rankingCategories.map((category) => (
                            <Link key={category.id} href={`/best-residences/${category.slug}`} className="border p-4 rounded-lg relative min-h-[300px]">
                                <div className="top-badge absolute top-0 left-1/2 -translate-x-1/2 bg-secondary rounded-b-lg px-8 py-2 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                        <path d="M2.16675 3.83331L4.66675 13.8333H16.3334L18.8334 3.83331L13.8334 9.66665L10.5001 3.83331L7.16675 9.66665L2.16675 3.83331ZM4.66675 17.1666H16.3334H4.66675Z" fill="url(#paint0_linear_472_2037)" />
                                        <path d="M4.66675 17.1666H16.3334M2.16675 3.83331L4.66675 13.8333H16.3334L18.8334 3.83331L13.8334 9.66665L10.5001 3.83331L7.16675 9.66665L2.16675 3.83331Z" stroke="url(#paint1_linear_472_2037)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <defs>
                                            <linearGradient id="paint0_linear_472_2037" x1="10.5001" y1="3.83331" x2="10.5001" y2="17.1666" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#F5F3F6" />
                                                <stop offset="1" stopColor="#BBA568" />
                                            </linearGradient>
                                            <linearGradient id="paint1_linear_472_2037" x1="10.5001" y1="3.83331" x2="10.5001" y2="17.1666" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#F5F3F6" />
                                                <stop offset="1" stopColor="#BBA568" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <p className="text-md">
                                        TOP {category.residenceLimitation} IN
                                    </p>
                                </div>
                                {category.featuredImage && (
                                    <div className="relative w-full h-full -z-5">
                                        <Image
                                            src={`${baseUrl}/api/${apiVersion}/media/${category.featuredImage.id}/content`}
                                            alt={category?.title || "Ranking category image"}
                                            fill
                                            className="object-cover rounded-lg"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                    </div>
                                )}
                                <div className="flex flex-col gap-2 absolute bottom-6 left-0 right-0 p-4">
                                    <p className="uppercase text-sm w-full text-center">BEST FOR</p>
                                    <h3 className="text-2xl font-bold w-full text-center">{category.title}</h3>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </SectionLayout>
        </div>
    );
}