import React from "react";
import NewsletterBlock from "@/components/web/Newsletter/NewsletterBlock";
import SectionLayout from "@/components/web/SectionLayout";
import Image from "next/image";

import { Post } from "@/lib/wordpress/wordpress.d";
import { getJobPostitions } from "@/lib/wordpress/wordpress";
import { CareerCard } from "@/components/web/Careers/CareerCard";

import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

// Dodaj generateMetadata funkciju (zameni postojeći metadata ako ga ima)
export async function generateMetadata({ searchParams }: {
  searchParams: {
    category?: string;
    page?: string;
    search?: string;
  };
}): Promise<Metadata> {
  const baseMetadata = {
    title: 'Careers: Join the Best Brand Residences Team',
    description: 'Careers: Join the Best Brand Residences Team. Explore exciting job opportunities and contribute to redefining the luxury real estate experience.',
  };

  // Ako imamo filtere, koristimo dinamički metadata
  if (searchParams.category || searchParams.search) {
  return generatePageMetadata({
    type: 'career',
    data: {
      search: searchParams.search,
      category: searchParams.category,
      page: searchParams.page ? parseInt(searchParams.page) : undefined
    }
    });
  }

  // Za glavnu careers stranicu koristimo base metadata
  return {
    ...baseMetadata,
    openGraph: {
      title: baseMetadata.title,
      description: baseMetadata.description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: baseMetadata.title,
      description: baseMetadata.description,
    }
  };
}

export default async function CareerPage() {
    // Defaultno prazan niz
    let jobPositions: Post[] = [];
    // Pratimo status dohvata
    let isError = false;
    let errorMessage = "";
    
    try {
        // Postavljamo timeout da bi izbegli beskonačno čekanje
        const positionsPromise = getJobPostitions();
        const timeoutPromise = new Promise<Post[]>((_, reject) => 
            setTimeout(() => reject(new Error("Request timeout")), 10000)
        );
        
        // Koristimo Promise.race da bismo limitirali vreme čekanja
        jobPositions = await Promise.race([
            positionsPromise,
            timeoutPromise
        ]);
        
        console.log("Server fetched job positions:", jobPositions?.length || 0);
    } catch (error) {
        console.error("Error fetching job positions:", error);
        isError = true;
        errorMessage = error instanceof Error ? error.message : "Nepoznata greška";
        // Ne dopuštamo da greška sruši build, samo nastavljamo s praznim nizom
    }
    
    return (

        <div>
            <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-12">
                <div className="page-header flex flex-col gap-6 w-full xl:max-w-[1600px] mx-auto rounded-xl bg-black/50 p-4 lg:p-8 py-12 lg:py-32 relative overflow-hidden">
                    <Image src="/career.webp" alt="career" fill  className="w-full h-full object-cover" />
                    <p className="text-md uppercase text-left lg:text-center text-primary z-10">career openings</p>
                    <h1 className="text-4xl font-bold text-left lg:text-center w-full lg:w-[48%] mx-auto z-10">Explore Exciting Career Opportunities and Join Our Team Today</h1>
                </div>    
            </div>
            <SectionLayout>
                <div className="w-full flex items-center justify-between xl:max-w-[1600px] mx-auto">
                    <h2 className="text-4xl font-bold text-white mb-8 w-full">Job Positions</h2>
                </div>

                {isError ? (
                    <div className="w-full py-12 text-center">
                        <div className="bg-gray-100 rounded-xl p-8 max-w-2xl mx-auto">
                            <h3 className="text-2xl font-medium mb-2">Unable to load positions</h3>
                            <p className="text-gray-600">We're experiencing technical difficulties. Please try again later.</p>
                        </div>
                    </div>
                ) : jobPositions && jobPositions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full xl:max-w-[1600px] mx-auto">
                        {jobPositions.map((position) => (
                            <CareerCard key={position.id} career={position} />  
                        ))}
                    </div>
                ) : (
                    <div className="w-full py-12 text-center">
                        <div className="bg-gray-100 rounded-xl p-8 max-w-2xl mx-auto">
                            <h3 className="text-2xl font-medium mb-2">No job positions available</h3>
                            <p className="text-gray-600">New opportunities will be added soon. Check back later!</p>
                        </div>
                    </div>
                )}
                
            </SectionLayout>
            <NewsletterBlock />
        </div>
    )
}