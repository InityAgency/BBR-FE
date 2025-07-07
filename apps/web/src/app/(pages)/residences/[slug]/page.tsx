import SingleResidenceClient from "./SingleResidenceClient";
import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || "v1";
  const res = await fetch(`${baseUrl}/api/${apiVersion}/public/residences/slug/${params.slug}`, { cache: "no-store" });
  const data = await res.json();
  const residence = data.data;

  const title = residence?.name || 'Luxury Residence';
  const description = residence?.description?.slice(0, 160) || 'Discover this luxury branded residence.';
  // Helper funkcija za kreiranje media URL-a (ista kao u SingleResidenceClient)
  const getMediaUrl = (mediaId: string): string => {
    return `${baseUrl}/api/${apiVersion}/media/${mediaId}/content`;
  };

  const featuredImage = residence?.featuredImage?.id
    ? getMediaUrl(residence.featuredImage.id)
    : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://bestbrandedresidences.com'}/bbr-cover.png`;

  // Dodaj lokaciju u naslov za bolji SEO i sharing
  const fullTitle = residence ? `${residence.name} - ${residence.city?.name}, ${residence.country?.name}` : title;
  
  // Poboljšaj opis sa ključnim informacijama
  const enhancedDescription = residence 
    ? `${residence.description?.slice(0, 120) || 'Discover this luxury branded residence.'} Located in ${residence.city?.name}, ${residence.country?.name}. ${residence.brand ? `By ${residence.brand.name}.` : ''}`
    : description;

  const currentUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://bestbrandedresidences.com'}/residences/${params.slug}`;

  return {
    title: fullTitle,
    description: enhancedDescription,
    keywords: [
      'residence', 
      'luxury residences', 
      'branded residences', 
      residence?.name || 'luxury property',
      residence?.city?.name || '',
      residence?.country?.name || '',
      residence?.brand?.name || ''
    ].filter(Boolean),
    openGraph: {
      title: fullTitle,
      description: enhancedDescription,
      url: currentUrl,
      siteName: 'Best Branded Residences',
      images: [
        {
          url: featuredImage,
          width: 1200,
          height: 630,
          alt: `${residence?.name || 'Luxury Residence'} - Featured Image`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: enhancedDescription,
      images: [featuredImage],
      creator: '@bbr_residences',
    },
    alternates: {
      canonical: currentUrl,
    },
    other: {
      // Property specifični tagovi (schema.org)
      'property:price:amount': residence?.avgPricePerUnit ? residence.avgPricePerUnit.toString() : '',
      'property:price:currency': 'USD',
      'property:location:country': residence?.country?.name || '',
      'property:location:city': residence?.city?.name || '',
      'property:type': 'residence',
      'property:bedrooms': residence?.units?.[0]?.bedrooms?.toString() || '',
      'property:bathrooms': residence?.units?.[0]?.bathrooms?.toString() || '',
    }
  };
}

export default function ResidencePage() {
  return <SingleResidenceClient />
}