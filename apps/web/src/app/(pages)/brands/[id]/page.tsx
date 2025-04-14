"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Brand } from "@/types/brand";
import { BrandTitleSkeleton } from "@/components/brands/BrandTitleSkeleton";
import Image from "next/image";
import NewsletterBlock from "@/components/web/Newsletter/NewsletterBlock";
export default function BrandPage() {
    const [brand, setBrand] = useState<Brand | null>(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const brandId = params.id as string;

    useEffect(() => {
        const fetchBrand = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/public/brands/${brandId}`);
                const data = await response.json();
                setBrand(data.data);
            } catch (error) {
                console.error('Error fetching brand:', error);  
            } finally {
                setLoading(false);
            }
        };

        fetchBrand();
    }, [brandId]);

    if (loading) {
        return <BrandTitleSkeleton />;
    }

    if (!brand) {
        return <div>Brand not found</div>;
    }

    return (
        <>
            <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-3rem)] 2xl:max-w-[90svw] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-8 mb-12">
                <div className="page-header flex flex-col gap-6 w-full">
                    <div className="flex flex-row gap-4 items-center justify-center rounded-xl mx-auto bg-black/10 p-4 mb-6">
                        <Image src={`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/media/${brand.logo.id}/content`} alt={brand.name} width={150} height={150}  />
                    </div>
                    <h1 className="text-5xl font-bold text-center">{brand.name}</h1>
                    <p className="text-center text-xl max-w-2xl mx-auto">{brand.description}</p>
                </div>
            </div>
            <NewsletterBlock />
        </>
    );
}