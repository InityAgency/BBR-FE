"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Residence } from "@/types/residence";
import SectionLayout from "@/components/web/SectionLayout";
import GalleryModal from "@/components/web/GalleryModal";

// Definišemo tip za slike
interface MediaImage {
  id: string;
  originalFileName?: string;
  mimeType?: string;
  uploadStatus?: string;
  size?: number;
}

export default function ResidencePage() {
    const [residence, setResidence] = useState<Residence | null>(null);
    const [loading, setLoading] = useState(true);
    const [showGallery, setShowGallery] = useState(false);
    const [initialSlide, setInitialSlide] = useState(0);
    const [galleryImages, setGalleryImages] = useState<MediaImage[]>([]);
    
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
            } catch (error) {
                console.error('Error fetching residence:', error);  
            } finally {
                setLoading(false);
            }
        };

        fetchResidence();
    }, [residenceSlug]);

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

    return(
        <>
            <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-12">
                <div className="w-full flex gap-4 items-end">
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
                    <div className="w-fit flex gap-2">
                        <Link href="#" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-fit"> 
                            Request Information 
                        </Link>
                        <Link href="#" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-[#1a1e21] hover:bg-[#252F37] border border-[#29343D] text-primary-foreground shadow-xs h-9 px-1 py-1 has-[>svg]:px-1 w-[36px] w-fit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M19.25 2.625C18.6953 2.62481 18.1473 2.74636 17.6446 2.98105C17.1419 3.21575 16.6969 3.55789 16.3409 3.98332C15.9849 4.40876 15.7266 4.90713 15.5842 5.44328C15.4417 5.97944 15.4187 6.54031 15.5167 7.08633L9.99836 10.9503C9.97076 10.9694 9.94427 10.9901 9.91902 11.0122C9.35918 10.5745 8.68763 10.303 7.98093 10.2286C7.27424 10.1542 6.56086 10.2798 5.92214 10.5913C5.28342 10.9027 4.74506 11.3873 4.36846 11.9899C3.99186 12.5925 3.79218 13.2888 3.79218 13.9994C3.79218 14.71 3.99186 15.4063 4.36846 16.0089C4.74506 16.6115 5.28342 17.0961 5.92214 17.4076C6.56086 17.719 7.27424 17.8447 7.98093 17.7702C8.68763 17.6958 9.35918 17.4243 9.91902 16.9867C9.94424 17.0092 9.97073 17.0302 9.99836 17.0497L15.5167 20.9137C15.3529 21.8269 15.5296 22.7685 16.0133 23.5602C16.4971 24.3518 17.2543 24.9387 18.1417 25.2096C19.029 25.4805 19.9849 25.4167 20.8284 25.0301C21.6718 24.6436 22.3443 23.9613 22.7184 23.1123C23.0926 22.2633 23.1425 21.3066 22.8587 20.4233C22.5749 19.54 21.977 18.7914 21.1784 18.3192C20.3797 17.847 19.4356 17.6841 18.5249 17.8612C17.6142 18.0384 16.8 18.5433 16.2365 19.2803L11.011 15.6228C11.2444 15.1305 11.375 14.581 11.375 14C11.375 13.419 11.2444 12.8683 11.011 12.3772L16.2377 8.7185C16.6292 9.23098 17.145 9.63513 17.7362 9.89273C18.3274 10.1503 18.9746 10.2529 19.6165 10.1906C20.2584 10.1284 20.8739 9.9035 21.4046 9.53715C21.9354 9.17079 22.3639 8.67511 22.6497 8.09698C22.9355 7.51884 23.0691 6.87737 23.0379 6.2332C23.0067 5.58904 22.8117 4.96348 22.4714 4.41568C22.131 3.86788 21.6566 3.41594 21.0929 3.1026C20.5292 2.78927 19.8949 2.62488 19.25 2.625ZM17.2084 6.41667C17.2084 5.87518 17.4235 5.35588 17.8063 4.97299C18.1892 4.5901 18.7085 4.375 19.25 4.375C19.7915 4.375 20.3108 4.5901 20.6937 4.97299C21.0766 5.35588 21.2917 5.87518 21.2917 6.41667C21.2917 6.95815 21.0766 7.47746 20.6937 7.86034C20.3108 8.24323 19.7915 8.45833 19.25 8.45833C18.7085 8.45833 18.1892 8.24323 17.8063 7.86034C17.4235 7.47746 17.2084 6.95815 17.2084 6.41667ZM7.58336 11.9583C7.04187 11.9583 6.52257 12.1734 6.13968 12.5563C5.75679 12.9392 5.54169 13.4585 5.54169 14C5.54169 14.5415 5.75679 15.0608 6.13968 15.4437C6.52257 15.8266 7.04187 16.0417 7.58336 16.0417C8.12484 16.0417 8.64415 15.8266 9.02703 15.4437C9.40992 15.0608 9.62502 14.5415 9.62502 14C9.62502 13.4585 9.40992 12.9392 9.02703 12.5563C8.64415 12.1734 8.12484 11.9583 7.58336 11.9583ZM19.25 19.5417C18.7085 19.5417 18.1892 19.7568 17.8063 20.1397C17.4235 20.5225 17.2084 21.0418 17.2084 21.5833C17.2084 22.1248 17.4235 22.6441 17.8063 23.027C18.1892 23.4099 19.7915 23.625 19.25 23.625C19.7915 23.625 20.3108 23.4099 20.6937 23.027C21.0766 22.6441 21.2917 22.1248 21.2917 21.5833C21.2917 21.0418 21.0766 20.5225 20.6937 20.1397C20.3108 19.7568 19.7915 19.5417 19.25 19.5417Z" fill="white"/>
                            </svg>
                        </Link>
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

            {/* Modal za prikaz galerije */}
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
        </>
    );
}