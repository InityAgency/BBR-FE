"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BrandCard } from "@/components/brands/BrandCard";
import { BrandCardSkeleton } from "../../../components/brands/BrandCardSkeleton";
import { Brand, BrandsResponse } from "@/types/brand";
import { Pagination } from "@/components/common/Pagination";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { Search } from "lucide-react";
import NewsletterBlock from "@/components/web/Newsletter/NewsletterBlock";
import SectionLayout from "@/components/web/SectionLayout";
// TODO: Add a search bar to the brands page
export default function BrandsClient() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);
    const searchParams = useSearchParams();
    const router = useRouter();
    const brandsSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const page = searchParams.get('page') || '1';
        const query = searchParams.get('query') || '';
        setCurrentPage(parseInt(page));
        setSearch(query);
        fetchBrands(parseInt(page), query);
    }, [searchParams]);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', '1'); // Reset to first page on search
        if (debouncedSearch) {
            params.set('query', debouncedSearch);
        } else {
            params.delete('query');
        }
        router.push(`?${params.toString()}`, { scroll: false });
    }, [debouncedSearch]);

    const fetchBrands = async (page: number, query: string = '') => {
        try {
            setLoading(true);
            const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/public/brands`);
            url.searchParams.set('page', page.toString());
            url.searchParams.set('limit', '12');
            if (query) {
                url.searchParams.set('query', query);
            }
            
            const response = await fetch(url.toString());
            const data: BrandsResponse = await response.json();
            setBrands(data.data);
            setTotalPages(data.pagination.totalPages);
        } catch (error) {
            console.error('Error fetching brands:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        if (search) {
            params.set('query', search);
        }
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    return (
        <>
            <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-6 lg:py-12 gap-4 xl:gap-8 mb-3 lg:mb-12">
                <div className="page-header flex flex-col gap-6 w-full">
                    <p className="text-md uppercase text-left lg:text-center text-primary">luxurious residences by exclusive brands</p>
                    <h1 className="text-4xl font-bold text-left lg:text-center">Meet the Elite Residence Brands</h1>
                    <div className="flex flex-col lg:flex-row gap-4 w-full mt-8">
                        <Image src="/brends-left.webp" alt="Brand 1" width={1000} height={100} className="w-full lg:w-1/2 rounded-lg" />
                        <Image src="/brends-right.webp" alt="Brand 2" width={1000} height={100} className="w-full lg:w-1/2 rounded-lg" />
                    </div>
                </div>
            </div>
            <SectionLayout>
                <div ref={brandsSectionRef} className="w-full xl:max-w-[1600px] mx-auto">
                    <div className="flex flex-col gap-1 lg:gap-8 w-full">
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center justify-between w-full">
                            <h2 className="text-4xl font-bold text-left">Top Branded Residences by Brands</h2>
                            <div className="lg:max-w-lg w-full lg:w-auto relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4 lg:w-6 lg:h-6 " />
                                <Input
                                    placeholder="Search by brand name"
                                    value={search}
                                    onChange={handleSearch}
                                    className="lg:h-12 bg-secondary text-md lg:text-lg pl-8 lg:pl-12 w-full"
                                />
                            </div>
                        </div>
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4 lg:mt-16">
                                {[...Array(12)].map((_, i) => (
                                    <BrandCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4 lg:mt-16">
                                    {brands.map((brand) => (
                                        <BrandCard key={brand.id} brand={brand} />
                                    ))}
                                </div>
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </>
                        )}
                    </div>
                </div>
            </SectionLayout>
            <NewsletterBlock />
        </>
    );
}