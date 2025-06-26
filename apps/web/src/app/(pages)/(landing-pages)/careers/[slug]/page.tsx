import { getJobPostitions, getFeaturedMediaById, getJobPostitionById } from "@/lib/wordpress/wordpress";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ChevronRight, MapPin, Banknote } from "lucide-react";
import Link from "next/link";
import NewsletterBlock from "@/components/web/Newsletter/NewsletterBlock";
import SectionLayout from "@/components/web/SectionLayout";
import { CareerFormWrapper } from "@/components/web/Careers/CareerFormWrapper";
import { formatDate } from "@/lib/utils";

import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

// Dodaj generateMetadata funkciju
export async function generateMetadata({ params }: CareerPostPageProps): Promise<Metadata> {
  try {
    const slug = params.slug;
    const career = await getJobPostitionBySlug(slug);
    
    if (!career) {
      return {
        title: 'Career Position Not Found | Best Branded Residences',
        description: 'The requested career position could not be found.',
      }
    }

    // Fetch full data for metadata
    const data = await getJobPostitionById(career.id);

    // Get featured image
    let mediaUrl = null;
    if (data._embedded && data._embedded['wp:featuredmedia'] && data._embedded['wp:featuredmedia'][0]) {
      mediaUrl = data._embedded['wp:featuredmedia'][0].source_url;
    } else if (data.featured_media && data.featured_media > 0) {
      const media = await getFeaturedMediaById(data.featured_media);
      if (media && media.source_url) {
        mediaUrl = media.source_url;
      }
    }
    const featuredImage = mediaUrl || '/og-default.jpg';

    // Clean HTML from title and get location
    const cleanTitle = data.title?.rendered?.replace(/<[^>]*>/g, '') || 'Career Opportunity';
    const location = data.acf?.location || 'Remote';
    const category = getCategoryFromClassList(data.class_list);

    // Create description
    const description = `Join our team as ${cleanTitle} in ${location}. ${category ? `Category: ${category}.` : ''} Explore this exciting opportunity at Best Branded Residences.`;

    return {
      title: `${cleanTitle} - Career Opportunity | Best Branded Residences`,
      description,
      openGraph: {
        title: `${cleanTitle} - ${location}`,
        description,
        type: 'article',
        publishedTime: new Date(data.date).toISOString(),
        modifiedTime: data.modified ? new Date(data.modified).toISOString() : undefined,
        section: category,
        images: [
          {
            url: featuredImage,
            width: 1200,
            height: 630,
            alt: cleanTitle,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${cleanTitle} - ${location}`,
        description,
        images: [featuredImage],
      },
      alternates: {
        canonical: `https://bestbrandedresidences.com/careers/${params.slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating career post metadata:', error)
    return {
      title: 'Career Opportunity | Best Branded Residences',
      description: 'Explore exciting career opportunities with our team.',
    }
  }
}

// Dinamička strana sa revalidacijom
export const dynamic = 'force-dynamic';
export const revalidate = 600;

interface CareerPostPageProps {
  params: {
    slug: string;
  };
}

// Helper funkcija za dohvatanje karijere po slugu
async function getJobPostitionBySlug(slug: string) {
  try {
    const careers = await getJobPostitions();
    const career = careers.find((career) => career.slug === slug);
    
    if (!career) {
      console.error(`Career with slug "${slug}" not found`);
      return null;
    }

    if (career._embedded && career._embedded['wp:featuredmedia']) {
      console.log('Embedded media found:', career._embedded['wp:featuredmedia'][0]?.source_url);
    }
    
    return career;
  } catch (error) {
    console.error(`Error fetching career by slug "${slug}":`, error);
    return null;
  }
}

// Helper funkcija za dohvatanje naziva kategorije iz class_list-a
function getCategoryFromClassList(classList?: string[]): string {
  if (!Array.isArray(classList)) return "Uncategorized";
  
  const categoryClass = classList.find(cls => cls.startsWith('career_category-'));
  if (!categoryClass) return "Uncategorized";
  
  return categoryClass
    .replace('career_category-', '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

export default async function CareerPostPage({ params }: CareerPostPageProps) {
  // VAŽNO: Sada koristimo await sa params.slug
  const slug = params.slug;
  const career = await getJobPostitionBySlug(slug);
  const id = career?.id;

  const data = await getJobPostitionById(id!); // ! je za sigurnost();
  console.log("Career data:", data);

  if (!career) {
    notFound();
  }

  // Pokušaj dohvatanja media iz _embedded ako postoji
  let mediaUrl = null;
  if (data._embedded && data._embedded['wp:featuredmedia'] && data._embedded['wp:featuredmedia'][0]) {
    mediaUrl = data._embedded['wp:featuredmedia'][0].source_url;
  } else if (data.featured_media && data.featured_media > 0) {
    // Samo ako je ID veci od 0
    try {
      const media = await getFeaturedMediaById(data.featured_media);
      if (media && media.source_url) {
        mediaUrl = media.source_url;
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  }
  
  const date = formatDate(data.date);

  // Dohvatanje kategorije iz class_list (pouzdanije od API poziva)
  const careerCategory = getCategoryFromClassList(data.class_list);
  
  // Dohvatanje ACF polja
  const location = data.acf?.location || "Remote";
  const salaryFrom = data.acf?.salary?.from || "Not specified";
  const salaryTo = data.acf?.salary?.to || "Not specified";
  const aboutTheRole = data.acf?.about_the_role || "";
  const keyResponsibilities = data.acf?.key_responsibilities || "";
  const qualifications = data.acf?.qualifications || "";

  // Dobijanje punog naslova za position
  const position = data.title?.rendered || "";

  return (
    <>
      {/* Hero Section */}
      <div className="single-career-hero">
        <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-6 lg:py-12 gap-4 xl:gap-8 mb-3 lg:mb-12">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-0 lg:px-4 py-0 lg:py-4">
            <Link href="/carees" className="hover:text-primary transition-colors flex items-center gap-1">
              Career Opportunities
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground line-clamp-1" dangerouslySetInnerHTML={{ __html: career.title?.rendered || "" }} />
          </div>
          <div className="w-full mx-auto lg:items-center flex flex-col gap-6 lg:px-12">
            <div className="uppercase text-primary w-full text-left lg:text-center">
              {careerCategory}
            </div>
            <h1 
              className="text-4xl font-medium lg:w-[70%] text-left lg:text-center"
              dangerouslySetInnerHTML={{ __html: career.title?.rendered || "" }}
            />
            <div className="flex flex-col md:flex-row lg:items-center lg:justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>Location: <span className="text-white">{location}</span></span>
              </div>
              <span className="hidden md:block">•</span>
              <div className="flex items-center gap-1">
                <Banknote className="w-4 h-4" />
                <span>Salary: <span className="text-white">{salaryFrom} - {salaryTo}</span></span>
              </div>
              <span className="hidden md:block">•</span>
              <span>Posted: {date}</span>
            </div>
          </div>
       
          <Link href={"#apply"} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-full text-center lg:max-w-[10svw]">Apply</Link>
          
          {mediaUrl ? (
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden mt-8 xl:max-w-[1600px] mx-auto">
              <Image
                src={mediaUrl}
                alt={career.title?.rendered || "Career thumbnail"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden mt-8 bg-secondary border border-white/10 flex items-center justify-center">
              <p className="text-muted-foreground">No image available</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center rounded-b-xl max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 gap-4 xl:gap-0 single-career-content m-0 -mt-12 mb-0">
        <div className="w-full flex gap-4 mx-auto space-y-8 relative">
    
          <SectionLayout>
            <div className="prose prose-lg prose-headings:font-medium prose-h1:text-4xl prose-h2:text-3xl 
                    prose-h3:text-2xl prose-h4:text-xl prose-headings:my-6 prose-headings:text-foreground 
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-lg prose-img:my-8 w-full lg:w-[50svw] mx-auto">
                {/* About the Role */}
               <div className="border-b pb-8">
                <h2>About the Role</h2>
                <div dangerouslySetInnerHTML={{ __html: aboutTheRole }} />
               </div>
                
                {/* Key Responsibilities */}
                <div className="border-b pb-8">
                {keyResponsibilities && (
                <>
                    <h2>Key Responsibilities</h2>
                    <div dangerouslySetInnerHTML={{ __html: keyResponsibilities }} />
                </>
                )}
                </div>
                
                {/* Qualifications */}
                <div>
                {qualifications && (
                <>
                    <h2>Qualifications</h2>
                    <div dangerouslySetInnerHTML={{ __html: qualifications }} />
                </>
                )}
                </div>
                
                {/* Application Form - Nova shadcn forma */}
            </div>
          </SectionLayout>
        </div>        
      </div>

      <div className="flex flex-col items-start lg:items-center rounded-b-xl max-w-[calc(100svw-1.5rem)] lg:max-w-[95svw] xl:max-w-[90svw] 2xl:max-w-[90svw] 3xl:max-w-[60svw] mx-auto px-2 lg:px-4 xl:px-12 pb-8 lg:pb-16 gap-4 xl:gap-8">
        <CareerFormWrapper
          position={position}
          slug={slug}
        />
      </div>

    </>
  );
}