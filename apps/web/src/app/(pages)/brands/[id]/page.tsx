"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Brand } from "@/types/brand";
import { BrandTitleSkeleton } from "@/components/brands/BrandTitleSkeleton";
import Image from "next/image";
import NewsletterBlock from "@/components/web/Newsletter/NewsletterBlock";
import { Residence } from "@/types/residence";
import { ResidenceCard } from "@/components/web/Residences/ResidenceCard";

export default function BrandPage() {
    const [brand, setBrand] = useState<Brand | null>(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const brandId = params.id as string;
    const [residences, setResidences] = useState<Residence[]>([]);

    useEffect(() => {
        const fetchBrand = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/public/brands/${brandId}`);
                const residences = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/public/residences?brandId=${brandId}`);
                const residencesData = await residences.json();
                const data = await response.json();
                setBrand(data.data);
                setResidences(residencesData.data);
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
            <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-3rem)] 2xl:max-w-[90svw] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-8 mb-12 ">
                <div className="page-header flex flex-col gap-6 w-full">
                    <div className="flex flex-row gap-4 items-center justify-center rounded-xl mx-auto bg-black/10 p-4 mb-6">
                        <Image src={`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/media/${brand.logo.id}/content`} alt={brand.name} width={150} height={150}  />
                    </div>
                    <h1 className="text-5xl font-bold text-center">{brand.name}</h1>
                    <p className="text-center text-xl max-w-2xl mx-auto">{brand.description}</p>
                </div>
            </div>
            <div className="flex flex-col items-center max-w-[calc(100svw-3rem)] 2xl:max-w-[90svw] mx-auto px-4 lg:px-12 py-12 gap-2 xl:gap-24 mb-12">
                <div className="flex flex-col gap-2 w-full">
                    <span className="text-md lg:text-lg text-left lg:text-center text-primary w-full uppercase">brand locations</span>
                    <h2 className="text-4xl font-bold w-[100%] lg:w-[60%] text-left lg:text-center mx-auto">{brand.name} Residence Collection</h2>
                </div>
                
                {/* Prvi red sa dve kartice */}
                <div className="flex flex-col gap-6 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        {residences.slice(0, 2).map((residence) => (
                            <div key={residence.id}>
                                <ResidenceCard residence={residence} />
                            </div>
                        ))}
                    </div>

                    {/* Ostale kartice po tri u redu */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {residences.slice(2).map((residence) => (
                            <div key={residence.id}>
                                <ResidenceCard residence={residence} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <NewsletterBlock />
        </>
    );
}