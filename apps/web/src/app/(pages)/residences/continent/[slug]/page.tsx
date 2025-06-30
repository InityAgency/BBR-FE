import type { Metadata } from 'next'
import SlugClient from "./SlugClient";
import { generatePageMetadata } from '@/lib/metadata'

interface Continent {
  id: string;
  name: string;
  slug: string;
}

interface ContinentResponse {
  data: Continent[];
  statusCode: number;
  message: string;
}

interface PageProps {
  params: { slug: string };
}

// Funkcija za generisanje meta podataka
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params;
  
  // Proveri da li je worldwide slug
  if (slug.toLowerCase() === "worldwide") {
    return generatePageMetadata({
      type: 'page',
      data: {
        title: "Luxury Branded Residences Worldwide",
        description: "Discover the finest luxury branded residences globally. Explore elite properties across all continents with exceptional design and unparalleled lifestyle.",
        slug: "residences/continent/worldwide",
        keywords: ['luxury residences', 'branded residences', 'worldwide properties', 'elite real estate', 'luxury apartments', 'premium housing'],
        image: "/og-worldwide-residences.jpg"
      }
    });
  }

  try {
    // Fetch kontinenata da pronađemo ime kontinenta
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || "v1";
    const url = `${baseUrl}/api/${apiVersion}/continents`;
    const response = await fetch(url, { cache: "no-store" });
    const data: ContinentResponse = await response.json();
    
    // Pronađi kontinent po formatiranom slugu
    const continent = data.data.find((c: Continent) =>
      c.name.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
    );

    if (!continent) {
      return generatePageMetadata({
        type: 'page',
        data: {
          title: "Continent Not Found",
          description: "The requested continent could not be found. Explore our worldwide collection of luxury branded residences.",
          slug: `residences/continent/${slug}`,
          keywords: ['luxury residences', 'branded residences', 'continent not found']
        }
      });
    }

    const continentName = continent.name;
    const formattedSlug = slug.toLowerCase().replace(/\s+/g, "-");

    return generatePageMetadata({
      type: 'page',
      data: {
        title: `Directory of Branded Residences in ${continentName}`,
        description: `Discover the finest luxury branded residences in ${continentName}. Explore elite properties with exceptional design and unparalleled lifestyle across ${continentName}.`,
        slug: `residences/continent/${formattedSlug}`,
        keywords: [
          'luxury residences',
          'branded residences', 
          `${continentName} real estate`,
          `luxury apartments ${continentName}`,
          `premium housing ${continentName}`,
          continentName
        ],
        image: `/og-${formattedSlug}-residences.jpg`
      }
    });

  } catch (error) {
    console.error("Error generating metadata:", error);
    
    // Fallback metadata
    const formattedSlug = slug.toLowerCase().replace(/\s+/g, "-");
    return generatePageMetadata({
      type: 'page',
      data: {
        title: `Directory of Branded Residences`,
        description: "Discover the finest luxury branded residences. Explore elite properties with exceptional design and unparalleled lifestyle.",
        slug: `residences/continent/${formattedSlug}`,
        keywords: ['luxury residences', 'branded residences', 'elite properties']
      }
    });
  }
}

// Funkcija za generisanje statičnih putanja
export async function generateStaticParams() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || "v1";
    const url = `${baseUrl}/api/${apiVersion}/continents`;
    const response = await fetch(url);
    const data: ContinentResponse = await response.json();
    
    // Generiši putanje za sve kontinente
    const continentPaths = data.data.map((continent) => ({
      slug: continent.name.toLowerCase().replace(/\s+/g, "-"),
    }));
    
    // Dodaj worldwide putanju
    return [
      { slug: "worldwide" },
      ...continentPaths,
    ];
  } catch (error) {
    console.error("Error generating static params:", error);
    // Fallback - vrati samo worldwide
    return [{ slug: "worldwide" }];
  }
}

export default function ContinentResidencesPage() {
  return <SlugClient />;
}