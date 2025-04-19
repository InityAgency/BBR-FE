"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Brand } from "@/types/brand";
import { BrandTitleSkeleton } from "@/components/brands/BrandTitleSkeleton";
import Image from "next/image";
import NewsletterBlock from "@/components/web/Newsletter/NewsletterBlock";
import { Residence } from "@/types/residence";
import { ResidenceCard } from "@/components/web/Residences/ResidenceCard";
import SectionLayout from "@/components/web/SectionLayout";

export default function BrandPage() {
    const [brand, setBrand] = useState<Brand | null>(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const brandSlug = params.slug as string;
    const brandId = brand?.id;
    const [residences, setResidences] = useState<Residence[]>([]);

    useEffect(() => {
        const fetchBrand = async () => {
            try {
                // Prvo dobavljamo podatke o brendu
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/public/brands/slug/${brandSlug}`);
                const data = await response.json();
                setBrand(data.data);
                
                const fetchedBrandId = data.data?.id;
                if (fetchedBrandId) {
                    const residencesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/public/residences?brandId=${fetchedBrandId}`);
                    const residencesData = await residencesResponse.json();
                    setResidences(residencesData.data);
                }
            } catch (error) {
                console.error('Error fetching brand:', error);  
            } finally {
                setLoading(false);
            }
        };

        fetchBrand();
    }, [brandSlug]);

    if (loading) {
        return <BrandTitleSkeleton />;
    }

    if (!brand) {
        return <div>Brand not found</div>;
    }

    return (
        <>
            <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-6 lg:py-12 gap-4 xl:gap-8 mb-3 lg:mb-12 ">
                <div className="page-header flex flex-col gap-6 w-full">
                    <div className="flex flex-row gap-4 items-center justify-center rounded-xl mx-auto bg-black/10 p-4 mb-6">
                        <Image src={`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/media/${brand.logo.id}/content`} alt={brand.name} width={150} height={150}  />
                    </div>
                    <h1 className="text-5xl font-bold text-center">{brand.name}</h1>
                    <p className="text-center text-xl max-w-2xl mx-auto">{brand.description}</p>
                </div>
            </div>
            <SectionLayout>
                <div className="flex flex-col gap-2 w-full mb-12">
                    <span className="text-md lg:text-lg text-left lg:text-center text-primary w-full uppercase">brand locations</span>
                    <h2 className="text-4xl font-bold w-[100%] lg:w-[60%] text-left lg:text-center mx-auto">{brand.name} Residence Collection</h2>
                </div>
                
                {residences.length > 0 ? (
                    /* Prikazujemo rezidencije ako postoje */
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
                ) : (
                    /* Prikazujemo poruku ako nema rezidencija */
                    <div className="w-full py-12 text-center">
                        <div className="bg-secondary rounded-xl w-full border py-12 px-4 mx-auto">
                            <h3 className="text-2xl font-medium mb-2">No residences available</h3>
                            <p className="text-gray-300">New residences for {brand.name} will be added soon.</p>
                        </div>
                    </div>
                )}
            </SectionLayout>
            <NewsletterBlock />
        </>
    );
}