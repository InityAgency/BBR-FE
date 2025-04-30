"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Residence } from "@/types/residence";
import SectionLayout from "@/components/web/SectionLayout";
import GalleryModal from "@/components/web/GalleryModal";
import { StickyScrollTabs } from "@/components/web/Residences/StickyScrollTabs";
import Image from "next/image";
import { ArrowRight, Lock } from "lucide-react";
import { ResidenceCard } from "@/components/web/Residences/ResidenceCard";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MediaImage {
    id: string;
    originalFileName?: string;
    mimeType?: string;
    uploadStatus?: string;
    size?: number;
}
const sections = [
    { id: "overview", name: "Residence Information" },
    { id: "development", name: "Development" },
    { id: "amenities", name: "Amenities" },
    { id: "video", name: "VIDEO TOUR" },
    { 
      id: "ai-reviews", 
      name: "AI Reviews Summary", 
      disabled: true,
      tooltip: "Coming soon"
    }
];

export default function ResidencePage() {
    const [residence, setResidence] = useState<Residence | null>(null);
    const [loading, setLoading] = useState(true);
    const [showGallery, setShowGallery] = useState(false);
    const [initialSlide, setInitialSlide] = useState(0);
    const [galleryImages, setGalleryImages] = useState<MediaImage[]>([]);
    const [similarResidences, setSimilarResidences] = useState<Residence[]>([]);
    const [loadingSimilar, setLoadingSimilar] = useState(false);
    
    const params = useParams();
    const residenceSlug = params.slug as string;
    
    useEffect(() => {
        const fetchResidence = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/public/residences/slug/${residenceSlug}`);
                const data = await response.json();
                setResidence(data.data);
                
                // Pripremamo slike za galeriju kada dobijemo podatke
                const images: MediaImage[] = [];
                
                if (data.data.featuredImage) {
                    images.push(data.data.featuredImage);
                }
                
                if (data.data.mainGallery && Array.isArray(data.data.mainGallery)) {
                    // Dodajemo slike iz galerije, izbegavajući duplikate
                    data.data.mainGallery.forEach((img: MediaImage) => {
                        if (img && img.id && !images.some(existingImg => existingImg.id === img.id)) {
                            images.push(img);
                        }
                    });
                }
                
                setGalleryImages(images);
                
                // Nakon učitavanja rezidencije, dohvatamo slične rezidencije po brandu
                if (data.data?.brand?.id) {
                    fetchSimilarResidences(data.data.brand.id, data.data.id);
                }
            } catch (error) {
                console.error('Error fetching residence:', error);  
            } finally {
                setLoading(false);
            }
        };

        fetchResidence();
        // Uklonjen dependency array da se fetch poziva samo pri inicijalnom učitavanju
    }, [residenceSlug]);
    
    // Funkcija za dohvatanje sličnih rezidencija po brandu
    const fetchSimilarResidences = async (brandId: string, currentResidenceId: string) => {
        try {
            setLoadingSimilar(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/public/residences?brandId=${brandId}&limit=3`);
            const data = await response.json();
            
            // Filtriramo trenutnu rezidenciju iz rezultata
            const filteredResidences = data.data.filter((res: Residence) => res.id !== currentResidenceId);
            
            // Ograničavamo na 3 slične rezidencije
            setSimilarResidences(filteredResidences.slice(0, 3));
        } catch (error) {
            console.error('Error fetching similar residences:', error);  
        } finally {
            setLoadingSimilar(false);
        }
    };

    
    // Helper funkcija za dobijanje URL-a slike
    const getMediaUrl = (mediaId: string): string => {
        return `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/media/${mediaId}/content`;
    };

    // Otvaranje galerije sa određenim početnim slajdom
    const openGallery = (index: number): void => {
        setInitialSlide(index);
        setShowGallery(true);
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-[50vh]">Loading...</div>;
    }

    if (!residence) {
        return <div className="flex justify-center items-center min-h-[50vh]">Residence not found</div>;
    }

    // Sortiramo highlightedAmenities po orderu ako postoje
    const sortedHighlightedAmenities = residence.highlightedAmenities 
        ? [...residence.highlightedAmenities].sort((a, b) => a.order - b.order) 
        : [];

    const getYouTubeEmbedUrl = (url: string): string => {
        // Ako je već embed URL, vraćamo ga
        if (url.includes('youtube.com/embed/')) {
            return url;
        }
        
        // Pronalazimo ID videa iz standardnog YouTube URL-a
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        
        // Ako imamo poklapanje, vraćamo embed URL
        if (match && match[2].length === 11) {
            return `https://www.youtube.com/embed/${match[2]}`;
        }
        
        // Ako ne možemo da parsiramo URL, vraćamo originalni
        return url;
    };
    return(
        <>
            <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-0">
                <div className="w-full flex flex-col lg:flex-row gap-4 items-end">
                    <div className="w-full">
                        <p className="text-primary">{residence.city.name}, {residence.country.name}</p>
                        <h1 className="text-4xl font-bold mt-2">{residence.name}</h1>
                        <div className="rankings mt-4">
                            <div className="bg-white/5 py-2 px-3 rounded-full w-fit flex gap-2 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 22 18" fill="none">
                                    <path d="M1 1L4 13H18L21 1L15 8L11 1L7 8L1 1ZM4 17H18H4Z" fill="url(#paint0_linear_2228_101)"/>
                                    <path d="M4 17H18M1 1L4 13H18L21 1L15 8L11 1L7 8L1 1Z" stroke="url(#paint1_linear_2228_101)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <defs>
                                        <linearGradient id="paint0_linear_2228_101" x1="11" y1="1" x2="11" y2="17" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#F5F3F6"/>
                                        <stop offset="1" stopColor="#BBA568"/>
                                        </linearGradient>
                                        <linearGradient id="paint1_linear_2228_101" x1="11" y1="1" x2="11" y2="17" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#F5F3F6"/>
                                        <stop offset="1" stopColor="#BBA568"/>
                                        </linearGradient>
                                    </defs>
                                </svg>
                                #1 Top Rated Worldwide
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-fit flex gap-2 mb-4 lg:mb-0">
                        <Link href="#" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-fit"> 
                            Request Information 
                        </Link>
                        {/* <Link href="#" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-[#1a1e21] hover:bg-[#252F37] border border-[#29343D] text-primary-foreground shadow-xs h-9 px-1 py-1 has-[>svg]:px-1 w-[36px] w-fit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M19.25 2.625C18.6953 2.62481 18.1473 2.74636 17.6446 2.98105C17.1419 3.21575 16.6969 3.55789 16.3409 3.98332C15.9849 4.40876 15.7266 4.90713 15.5842 5.44328C15.4417 5.97944 15.4187 6.54031 15.5167 7.08633L9.99836 10.9503C9.97076 10.9694 9.94427 10.9901 9.91902 11.0122C9.35918 10.5745 8.68763 10.303 7.98093 10.2286C7.27424 10.1542 6.56086 10.2798 5.92214 10.5913C5.28342 10.9027 4.74506 11.3873 4.36846 11.9899C3.99186 12.5925 3.79218 13.2888 3.79218 13.9994C3.79218 14.71 3.99186 15.4063 4.36846 16.0089C4.74506 16.6115 5.28342 17.0961 5.92214 17.4076C6.56086 17.719 7.27424 17.8447 7.98093 17.7702C8.68763 17.6958 9.35918 17.4243 9.91902 16.9867C9.94424 17.0092 9.97073 17.0302 9.99836 17.0497L15.5167 20.9137C15.3529 21.8269 15.5296 22.7685 16.0133 23.5602C16.4971 24.3518 17.2543 24.9387 18.1417 25.2096C19.029 25.4805 19.9849 25.4167 20.8284 25.0301C21.6718 24.6436 22.3443 23.9613 22.7184 23.1123C23.0926 22.2633 23.1425 21.3066 22.8587 20.4233C22.5749 19.54 21.977 18.7914 21.1784 18.3192C20.3797 17.847 19.4356 17.6841 18.5249 17.8612C17.6142 18.0384 16.8 18.5433 16.2365 19.2803L11.011 15.6228C11.2444 15.1305 11.375 14.581 11.375 14C11.375 13.419 11.2444 12.8683 11.011 12.3772L16.2377 8.7185C16.6292 9.23098 17.145 9.63513 17.7362 9.89273C18.3274 10.1503 18.9746 10.2529 19.6165 10.1906C20.2584 10.1284 20.8739 9.9035 21.4046 9.53715C21.9354 9.17079 22.3639 8.67511 22.6497 8.09698C22.9355 7.51884 23.0691 6.87737 23.0379 6.2332C23.0067 5.58904 22.8117 4.96348 22.4714 4.41568C22.131 3.86788 21.6566 3.41594 21.0929 3.1026C20.5292 2.78927 19.8949 2.62488 19.25 2.625ZM17.2084 6.41667C17.2084 5.87518 17.4235 5.35588 17.8063 4.97299C18.1892 4.5901 18.7085 4.375 19.25 4.375C19.7915 4.375 20.3108 4.5901 20.6937 4.97299C21.0766 5.35588 21.2917 5.87518 21.2917 6.41667C21.2917 6.95815 21.0766 7.47746 20.6937 7.86034C20.3108 8.24323 19.7915 8.45833 19.25 8.45833C18.7085 8.45833 18.1892 8.24323 17.8063 7.86034C17.4235 7.47746 17.2084 6.95815 17.2084 6.41667ZM7.58336 11.9583C7.04187 11.9583 6.52257 12.1734 6.13968 12.5563C5.75679 12.9392 5.54169 13.4585 5.54169 14C5.54169 14.5415 5.75679 15.0608 6.13968 15.4437C6.52257 15.8266 7.04187 16.0417 7.58336 16.0417C8.12484 16.0417 8.64415 15.8266 9.02703 15.4437C9.40992 15.0608 9.62502 14.5415 9.62502 14C9.62502 13.4585 9.40992 12.9392 9.02703 12.5563C8.64415 12.1734 8.12484 11.9583 7.58336 11.9583ZM19.25 19.5417C18.7085 19.5417 18.1892 19.7568 17.8063 20.1397C17.4235 20.5225 17.2084 21.0418 17.2084 21.5833C17.2084 22.1248 17.4235 22.6441 17.8063 23.027C18.1892 23.4099 19.7915 23.625 19.25 23.625C19.7915 23.625 20.3108 23.4099 20.6937 23.027C21.0766 22.6441 21.2917 22.1248 21.2917 21.5833C21.2917 21.0418 21.0766 20.5225 20.6937 20.1397C20.3108 19.7568 19.7915 19.5417 19.25 19.5417Z" fill="white"/>
                            </svg>
                        </Link> */}
                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="gallery-grid w-full">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[550px]">
                        {/* Glavna slika (featured) - zauzima 2 kolone i punu visinu */}
                        {galleryImages.length > 0 && (
                            <div 
                                className="md:col-span-2 row-span-2 rounded-lg overflow-hidden cursor-pointer relative group h-full"
                                onClick={() => openGallery(0)}
                            >
                                <img 
                                    src={getMediaUrl(galleryImages[0].id)}
                                    alt={`${residence.name} featured image`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/70 bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <span className="text-white text-sm px-3 py-1 rounded-full">
                                        View larger
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Slike od 1-4 */}
                        {galleryImages.slice(1, 5).map((image, index) => {
                            // Da li je ovo poslednja slika u gridu i ima li više slika?
                            const isLastImageInGrid = index === 3 && galleryImages.length > 5;
                            
                            return (
                                <div 
                                    key={image.id} 
                                    className="rounded-lg overflow-hidden cursor-pointer relative group h-full"
                                    onClick={() => openGallery(index + 1)}
                                >
                                    <img 
                                        src={getMediaUrl(image.id)}
                                        alt={`${residence.name} gallery image ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    
                                    {/* Hover overlay za obične slike - suptilniji efekat */}
                                    {!isLastImageInGrid && (
                                        <div className="absolute inset-0 bg-black/70 bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <span className="text-white text-sm px-3 py-1 rounded-full">
                                                View larger
                                            </span>
                                        </div>
                                    )}
                                    
                                    {/* "View gallery" overlay za poslednju sliku - suptilniji da se vidi slika ispod */}
                                    {isLastImageInGrid && (
                                        <div className="absolute inset-0 bg-black/70 bg-opacity-30 flex flex-col items-center justify-center">
                                            <span className="text-white text-lg font-medium drop-shadow-md">
                                                View gallery
                                            </span>
                                            <span className="text-white text-sm drop-shadow-md">
                                                ({galleryImages.length - 5} more)
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {galleryImages.length > 0 && (
                <GalleryModal 
                    isOpen={showGallery}
                    onClose={() => setShowGallery(false)}
                    images={galleryImages}
                    initialSlide={initialSlide}
                    getMediaUrl={getMediaUrl}
                    title={residence.name}
                />
            )}
            
            <SectionLayout>
                <StickyScrollTabs sections={sections} offset={80} />


                <div id="overview" className="flex flex-col lg:flex-row gap-4 py-8 lg:py-16 lg:pt-8 px-4 lg:px-0 justify-between">
                    <div className="about-residence w-full">
                        <span className="text-md lg:text-lg text-left lg:text-left text-primary w-full uppercase">
                            RESIDENCE INFORMATION
                        </span>
                        <h2 className="text-4xl font-medium text-left lg:text-left mx-auto mt-4 mb-4">
                            {residence.subtitle}
                        </h2>
                        <p className="text-md text-muted-foreground">
                            {residence.description}
                        </p>
                    </div>
                    <div className="badges bg-secondary rounded-lg min-w-full lg:min-w-[40svw] opacity-0">
                        {/* Badges */}
                    </div>
                </div>

                <div id="development" className="flex flex-col gap-4 py-8 lg:py-16 px-4 lg:px-0 w-full">
                    <div className="w-full flex flex-col gap-2 ites-center">
                        <span className="text-md lg:text-lg text-left lg:text-center text-primary w-full uppercase w-full">
                            DEVELOPMENT INFORMATION
                        </span>
                        <h2 className="text-4xl font-medium text-left lg:text-left mx-auto mt-4 mb-4">Residence Development Highlights</h2>
                    </div>
                    <div className="grid grid-rows-1 lg:grid-rows-2 grid-cols-1 lg:grid-cols-4 w-full gap-4 mt-8">
                        <div className="custom-card p-4 rounded-lg border flex flex-col gap-3">
                            <span className="text-2xl text-serif">
                                {residence.yearBuilt || "-"}
                            </span>
                            <span className="uppercase text-md text-muted-foreground">YEAR BUILT</span>
                        </div>
                        <div className="custom-card p-4 rounded-lg border flex flex-col gap-3">
                            <span className="text-2xl text-serif">
                                {residence.floorSqft ? `${residence.floorSqft} sq ft` : "-"}
                            </span>
                            <span className="uppercase text-md text-muted-foreground">RESIDENCE AREA</span>
                        </div>
                        <div className="custom-card p-4 rounded-lg border flex flex-col gap-3">
                            <span className="text-2xl text-serif">
                                {residence.units?.length || "-"}
                            </span>
                            <span className="uppercase text-md text-muted-foreground">NUMBER OF UNITS</span>
                        </div>
                        <div className="custom-card p-4 rounded-lg border flex flex-col gap-3">
                            <span className="text-2xl text-serif">
                                {residence.developmentStatus || "-"}
                            </span>
                            <span className="uppercase text-md text-muted-foreground">DEVELOPMENT STATUS</span>
                        </div>
                        <div className="custom-card p-4 rounded-lg border flex flex-col gap-3">
                            <span className="text-2xl text-serif">
                                {residence.amenities?.length || "-"}
                            </span>
                            <span className="uppercase text-md text-muted-foreground">NUMBER OF AMENITIES</span>
                        </div>
                        <div className="custom-card p-4 rounded-lg border flex flex-col gap-3">
                            <span className="text-2xl text-serif">
                                {residence.avgPricePerUnit ? `${residence.avgPricePerUnit} $` : "-"}
                            </span>
                            <span className="uppercase text-md text-muted-foreground">AVG. PRICE PER UNIT</span>
                        </div>
                        <div className="custom-card p-4 rounded-lg border flex flex-col gap-2">
                            <span className="text-2xl text-serif">
                                {residence.avgPricePerSqft ? `${residence.avgPricePerSqft} $` : "-"}
                            </span>
                            <span className="uppercase text-md text-muted-foreground">AVG. PRICE PER SQ FT.</span>
                        </div>
                        <div className="custom-card p-4 rounded-lg border flex flex-col gap-2">
                            <span className="text-2xl text-serif">
                                {residence.rentalPotential || "-"}
                            </span>
                            <span className="uppercase text-md text-muted-foreground">RENTAL POTENTIAL</span>
                        </div>
                    </div>
                </div>

                {residence.amenities && residence.amenities.length > 0 ? (
                    <div id="amenities" className="flex flex-col gap-3 py-8 lg:py-16 px-4 lg:px-0 w-full">
                        <div className="w-full flex flex-col gap-2 ites-center">
                            <span className="text-md lg:text-lg text-left lg:text-center text-primary w-full uppercase w-full">
                                LIST OF AMENITIES
                            </span>
                            <h2 className="text-4xl font-medium text-left lg:text-left mx-auto mt-4 mb-4">Amenities included with this residence</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                            {/* Prikazujemo sortiraneHighlightedAmenities prvo */}
                            {sortedHighlightedAmenities.map((highlightedAmenity) => (
                                <div key={highlightedAmenity.amenity.id} className="amenity-card rounded-lg flex flex-col gap-4 transition-all">
                                    {highlightedAmenity.amenity.featuredImage ? (
                                        <Image 
                                            src={`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/media/${highlightedAmenity.amenity.featuredImage}/content`}
                                            alt={highlightedAmenity.amenity.name}
                                            className="w-6 h-6"
                                        />
                                    ) : (
                                        <div className="placeholder-icon w-12 h-12 bg-zinc-800/10 rounded-md border flex items-center justify-center">
                                            <span className="text-lg text-zinc-200">{highlightedAmenity.amenity.name.charAt(0)}</span>
                                        </div>
                                    )}
                                    <div className="content">
                                        <h3 className="text-2xl font-medium">{highlightedAmenity.amenity.name}</h3>
                                        <p className="text-md text-muted-foreground mt-2">{highlightedAmenity.amenity.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Prikaz ostalih amenity-ja samo ako postoje */}
                        {residence.amenities
                            .filter(amenity => !sortedHighlightedAmenities.some(highlighted => highlighted.amenity.id === amenity.id))
                            .length > 0 && (
                            <div className="w-full grid-cols-1 bg-secondary rounded-lg px-2 py-4 lg:px-6 lg:py-6 mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {residence.amenities
                                    .filter(amenity => !sortedHighlightedAmenities.some(highlighted => highlighted.amenity.id === amenity.id))
                                    .map((amenity) => (
                                        <div key={amenity.id} className="amenity-card px-0 py-2 rounded-md flex flex-row items-center gap-2 transition-all">
                                            {amenity.icon && (
                                                <div className="icon-container w-12 h-12 flex items-center justify-center rounded-full bg-secondary/30">
                                                    <img 
                                                        src={`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/media/${amenity.icon.id}/content`}
                                                        alt={amenity.name}
                                                        className="w-6 h-6 object-contain"
                                                    />
                                                </div>
                                            )}
                                            <h3 className="text-md text-sans font-medium">{amenity.name}</h3>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                ) : null}


                {residence.videoTourUrl ? (
                    <div id="video" className="flex flex-col gap-3 py-8 lg:py-16 px-4 lg:px-0 w-full">
                        <div className="w-full flex flex-col gap-2 ites-center">
                            <span className="text-md lg:text-lg text-left lg:text-center text-primary w-full uppercase w-full">
                                VIDEO TOUR
                            </span>
                            <h2 className="text-4xl font-medium text-left lg:text-left mx-auto mt-4 mb-4">Watch Residence Video Tour</h2>
                        </div>
                        <div className="w-full">
                            <div className="aspect-video w-full rounded-lg overflow-hidden mt-6">
                                <iframe 
                                    src={getYouTubeEmbedUrl(residence.videoTourUrl)} 
                                    className="w-full h-full" 
                                    allowFullScreen
                                    title={`${residence.name} Video Tour`}
                                ></iframe>
                            </div>
                        </div>
                    </div>
                ) : null}
            </SectionLayout>

            <div className="bg-secondary px-2 py-6 lg:px-0 lg:py-0">
                <SectionLayout>
                    <div className="cta-review w-full rounded-xl border px-4 lg:px-8 py-6 lg:py-8 flex flex-col lg:flex-row gap-4 items-start lg:items-center bg-[#faf3ee12] bg-opacity-10 relative overflow-hidden">
                        <Image 
                            src="/pattern.png"
                            width={100}
                            height={100}
                            alt="pattern"
                            className="object-cover w-full h-full absolute -z-0"
                        />
                        <div className="w-full z-4">
                            <span className="text-md lg:text-lg text-left lg:text-center text-primary w-full uppercase w-full">
                                SUBMIT A REVIEW
                            </span>
                            <h2 className="text-4xl font-medium text-left lg:text-left mx-auto mt-4">
                                Would you like to express your experience?
                            </h2>
                            <h2 className="text-4xl font-reguralr text-left lg:text-left mt-2"> 
                                Send us a review
                            </h2>
                        </div>
                        <Link href="#" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-fit z-4">
                            Submit a review
                            <ArrowRight />
                        </Link>
                    </div>
                </SectionLayout>
            </div>

            <div className="bg-[#1A1E21] py-8 lg:py-16 px-4 lg:px-0">
                <SectionLayout>
                    <div className="w-full flex flex-col items-start lg:items-center gap-4 mb-8">
                        <span className="text-md lg:text-lg text-left lg:text-center text-primary w-full uppercase">
                            SIMILAR RESIDENCES
                        </span>
                        <h2 className="text-4xl font-medium lg:w-[60%] lg:text-center">
                            Discover Exclusive Opportunities in Luxury Real Estate
                        </h2>
                    </div>
                    
                    {/* Prikaz sličnih rezidencija */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                        {loadingSimilar ? (
                            <div className="col-span-3 flex justify-center items-center py-12">
                                <p className="text-lg text-muted-foreground">Loading similar residences...</p>
                            </div>
                        ) : similarResidences.length > 0 ? (
                            similarResidences.map((similarResidence) => (
                                <ResidenceCard 
                                    key={similarResidence.id}
                                    residence={similarResidence}
                                />
                            ))
                        ) : (
                            <div className="col-span-3 flex justify-center items-center py-12">
                                <p className="text-lg text-muted-foreground">No similar residences found</p>
                            </div>
                        )}
                    </div>
                </SectionLayout>
            </div>
        </>
    );
}