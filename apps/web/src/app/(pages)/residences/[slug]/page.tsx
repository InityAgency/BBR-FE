"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Residence } from "@/types/residence";
import SectionLayout from "@/components/web/SectionLayout";
import GalleryModal from "@/components/web/GalleryModal";
import { StickyScrollTabs } from "@/components/web/Residences/StickyScrollTabs";
import Image from "next/image";
import { ArrowRight, Lock } from "lucide-react";
import { ResidenceCard } from "@/components/web/Residences/ResidenceCard";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RequestInformationModal } from "@/components/web/Modals/RequestInformationModal";
import { useAuth } from "@/contexts/AuthContext";
import { ClaimRequestModal } from "@/components/web/Modals/ClaimRequestModal";

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
    const [isRequestInfoModalOpen, setIsRequestInfoModalOpen] = useState(false);
    const [isClaimProfileModalOpen, setIsClaimProfileModalOpen] = useState(false);
    
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const residenceSlug = params.slug as string;
    
    useEffect(() => {
        // Ako je korisnik preusmeren sa login stranice i postoji "fromClaim" parametar
        const fromClaim = searchParams.get('fromClaim');
        if (user && fromClaim === 'true' && user.role.name === "developer") {
            setIsClaimProfileModalOpen(true);
            
            // Očisti URL parametar bez osvježavanja stranice - replace history
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('fromClaim');
            window.history.replaceState({}, '', newUrl.toString());
        }
    }, [user, searchParams]);

    useEffect(() => {
        const fetchResidence = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/public/residences/slug/${residenceSlug}`);
                const data = await response.json();
                setResidence(data.data);
                
                const images: MediaImage[] = [];
                
                if (data.data.featuredImage) {
                    images.push(data.data.featuredImage);
                }
                
                if (data.data.mainGallery && Array.isArray(data.data.mainGallery)) {
                    data.data.mainGallery.forEach((img: MediaImage) => {
                        if (img && img.id && !images.some(existingImg => existingImg.id === img.id)) {
                            images.push(img);
                        }
                    });
                }
                
                setGalleryImages(images);
                
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
    }, [residenceSlug]);
    
    const fetchSimilarResidences = async (brandId: string, currentResidenceId: string) => {
        try {
            setLoadingSimilar(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/public/residences?brandId=${brandId}&limit=3`);
            const data = await response.json();
            
            const filteredResidences = data.data.filter((res: Residence) => res.id !== currentResidenceId);
            
            setSimilarResidences(filteredResidences.slice(0, 3));
        } catch (error) {
            console.error('Error fetching similar residences:', error);  
        } finally {
            setLoadingSimilar(false);
        }
    };

    const handleClaimProfile = () => {
        if (!user) {
            // Ako nije prijavljen, preusmeriti na login stranicu sa parametrom za povratak
            const returnUrl = `/residences/${residenceSlug}?fromClaim=true`;
            router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
        } else if (user.role.name === "developer") {
            // Ako je developer, otvoriti modal
            setIsClaimProfileModalOpen(true);
        }
    };
    
    const getMediaUrl = (mediaId: string): string => {
        return `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/media/${mediaId}/content`;
    };

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

    const sortedHighlightedAmenities = residence.highlightedAmenities 
        ? [...residence.highlightedAmenities].sort((a, b) => a.order - b.order) 
        : [];

    const getYouTubeEmbedUrl = (url: string): string => {
        if (url.includes('youtube.com/embed/')) {
            return url;
        }
        
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        
        if (match && match[2].length === 11) {
            return `https://www.youtube.com/embed/${match[2]}`;
        }
        
        return url;
    };
    return(
        <>
            <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-0">
                <div className="w-full xl:max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-4 items-end">
                    <div className="w-full">
                        <p className="text-primary">{residence.city.name}, {residence.country.name}</p>
                        <h1 className="text-4xl font-bold mt-2">{residence.name}</h1>
                        {residence.company ? (
                            <div id="company-info" className="flex flex-row gap-2 items-center text-md font-medium mt-4">
                                <p>Managed by</p>
                                <span className="text-primary">{residence.company.name}</span>
                            </div>
                        ) : (
                            (!user || user?.role?.name === "developer") && (
                                <div id="claim-profile" className="flex flex-row gap-2 items-center text-md font-medium mt-4">
                                    <p>Own the residence?</p>
                                    <button onClick={handleClaimProfile} className="text-primary">Claim your profile</button>
                                </div>
                            )
                        )}
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
                        <button 
                            onClick={() => setIsRequestInfoModalOpen(true)}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-fit"
                        >
                            Request Information 
                        </button>
                    </div>
                </div>

                <div className="gallery-grid w-full xl:max-w-[1600px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[550px]">
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
            
            <RequestInformationModal 
                isOpen={isRequestInfoModalOpen}
                onClose={() => setIsRequestInfoModalOpen(false)}
                entityId={residence.id} 
                type="MORE_INFORMATION" 
                buttonText="Request More Information"
                customTitle={`Would you like to know more about ${residence.name}?`}
            />
            
            {/* Modal za Claim Profile */}
            <ClaimRequestModal isOpen={isClaimProfileModalOpen} onClose={() => setIsClaimProfileModalOpen(false)} />
                        
            <SectionLayout>
                <div className="w-full xl:max-w-[1600px] mx-auto">
                    <StickyScrollTabs sections={sections} offset={80} />
                </div>


                <div id="overview" className="w-full xl:max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-4 py-8 lg:py-16 lg:pt-8 px-4 lg:px-0 justify-between">
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

                <div id="development" className="flex flex-col gap-4 py-8 lg:py-16 px-4 lg:px-0 w-full xl:max-w-[1600px] mx-auto">
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
                    <div id="amenities" className="flex flex-col gap-3 py-8 lg:py-16 px-4 lg:px-0 w-full xl:max-w-[1600px] mx-auto">
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
                                        <div className="w-full h-[300px] rounded-md overflow-hidden">
                                            <Image 
                                                src={`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/media/${highlightedAmenity.amenity.featuredImage?.id}/content`}
                                                alt={highlightedAmenity.amenity.name}
                                                className="w-full h-full object-cover"
                                                width={1000}
                                                height={500}
                                            />
                                        </div>
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
                    <div id="video" className="flex flex-col gap-3 py-8 lg:py-16 px-4 lg:px-0 w-full xl:max-w-[1600px] mx-auto">
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
                    <div className="cta-review w-full xl:max-w-[1600px] mx-auto rounded-xl border px-4 lg:px-8 py-6 lg:py-8 flex flex-col lg:flex-row gap-4 items-start lg:items-center bg-[#faf3ee12] bg-opacity-10 relative overflow-hidden">
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
                        <Link 
                            href={`/leave-a-review?residenceId=${residence.id}`}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-fit z-4">
                            Submit a review
                            <ArrowRight />
                        </Link>
                    </div>
                </SectionLayout>
            </div>

            <div className="bg-[#1A1E21] py-8 lg:py-16 px-4 lg:px-0 ">
                <SectionLayout>
                    <div className="w-full xl:max-w-[1600px] mx-auto flex flex-col items-start lg:items-center gap-4 mb-8">
                        <span className="text-md lg:text-lg text-left lg:text-center text-primary w-full uppercase">
                            SIMILAR RESIDENCES
                        </span>
                        <h2 className="text-4xl font-medium lg:w-[60%] lg:text-center">
                            Discover Exclusive Opportunities in Luxury Real Estate
                        </h2>
                    </div>
                    
                    {/* Prikaz sličnih rezidencija */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 w-full xl:max-w-[1600px] mx-auto">
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