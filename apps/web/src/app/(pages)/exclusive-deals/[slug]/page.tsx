"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Unit } from "@/types/unit";
import SectionLayout from "@/components/web/SectionLayout";
import GalleryModal from "@/components/web/GalleryModal";
import { StickyScrollTabs } from "@/components/web/Residences/StickyScrollTabs";
import Image from "next/image";
import { ArrowRight, Bath, Bed, Building2, CircleSmall, DollarSign, Lock, MapPin, Ruler, Square } from "lucide-react";
import { ResidenceCard } from "@/components/web/Residences/ResidenceCard";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RequestInformationModal } from "@/components/web/Modals/RequestInformationModal";
import { useAuth } from "@/contexts/AuthContext";
import { ClaimRequestModal } from "@/components/web/Modals/ClaimRequestModal";
import { UnitCard } from "@/components/web/Units/UnitCard";
import NewsletterBlock from "@/components/web/Newsletter/NewsletterBlock";
import Map from "@/components/web/Map";
import FaqBlock from "@/components/web/Faq/FaqBlock";
import FaqUnit from "@/components/web/Faq/FaqUnit";

interface MediaImage {
    id: string;
    originalFileName?: string;
    mimeType?: string;
    uploadStatus?: string;
    size?: number;
    url?: string;
}

const sections = [
    { id: "overview", name: "Unit Information" },
    { id: "development", name: "Development" },
    { id: "amenities", name: "Amenities" },
    {
        id: "ai-reviews",
        name: "AI Reviews Summary",
        disabled: true,
        tooltip: "Coming soon"
    }
];

export default function SingleUnit() {
    const [unit, setUnit] = useState<Unit | null>(null);
    const [loading, setLoading] = useState(true);
    const [showGallery, setShowGallery] = useState(false);
    const [initialSlide, setInitialSlide] = useState(0);
    const [galleryImages, setGalleryImages] = useState<MediaImage[]>([]);
    const [similarUnits, setSimilarUnits] = useState<Unit[]>([]);
    const [loadingSimilar, setLoadingSimilar] = useState(false);
    const [isRequestInfoModalOpen, setIsRequestInfoModalOpen] = useState(false);
    const [isClaimProfileModalOpen, setIsClaimProfileModalOpen] = useState(false);

    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const unitSlug = params.slug as string;

    useEffect(() => {
        const fetchUnit = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/public/units/slug/${unitSlug}`);
                const data = await response.json();
                setUnit(data.data);

                const images: MediaImage[] = [];

                if (data.data.featureImage) {
                    images.push(data.data.featureImage);
                }

                if (data.data.gallery && Array.isArray(data.data.gallery)) {
                    data.data.gallery.forEach((img: MediaImage) => {
                        if (img && img.id && !images.some(existingImg => existingImg.id === img.id)) {
                            images.push(img);
                        }
                    });
                }

                setGalleryImages(images);

                if (data.data?.residence?.id) {
                    fetchSimilarUnits(data.data.residence.id, data.data.id);
                }
            } catch (error) {
                console.error('Error fetching unit:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUnit();
    }, [unitSlug]);

    const fetchSimilarUnits = async (residenceId: string, currentUnitId: string) => {
        try {
            setLoadingSimilar(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/public/units?residenceId=${residenceId}&limit=3`);
            const data = await response.json();

            const filteredUnits = data.data.filter((unit: Unit) => unit.id !== currentUnitId);

            setSimilarUnits(filteredUnits.slice(0, 3));
        } catch (error) {
            console.error('Error fetching similar units:', error);
        } finally {
            setLoadingSimilar(false);
        }
    };

    const handleClaimProfile = () => {
        if (!user) {
            const returnUrl = `/exclusive-deals/${unitSlug}?fromClaim=true`;
            router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
        } else if (user.role.name === "developer") {
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

    if (!unit) {
        return <div className="flex justify-center items-center min-h-[50vh]">Unit not found</div>;
    }

    return (
        <>
            <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-0">
                <div className="w-full xl:max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-4 items-end">
                    <div className="w-full">
                        <p className="text-primary">{unit.residence.address}</p>
                        <h1 className="text-4xl font-bold mt-2">{unit.name}</h1>
                        <div className="flex flex-row gap-2 items-center text-md font-medium mt-4">
                            <p>Part of</p>
                            <span className="text-primary">{unit.residence.name}</span>
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
                                    src={galleryImages[0].url || getMediaUrl(galleryImages[0].id)}
                                    alt={`${unit.name} featured image`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/70 bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <span className="text-white text-sm px-3 py-1 rounded-full">
                                        View larger
                                    </span>
                                </div>
                            </div>
                        )}

                        {galleryImages.slice(1, 5).map((image, index) => {
                            const isLastImageInGrid = index === 3 && galleryImages.length > 5;

                            return (
                                <div
                                    key={image.id}
                                    className="rounded-lg overflow-hidden cursor-pointer relative group h-full"
                                    onClick={() => openGallery(index + 1)}
                                >
                                    <img
                                        src={image.url || getMediaUrl(image.id)}
                                        alt={`${unit.name} gallery image ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />

                                    {!isLastImageInGrid && (
                                        <div className="absolute inset-0 bg-black/70 bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <span className="text-white text-sm px-3 py-1 rounded-full">
                                                View larger
                                            </span>
                                        </div>
                                    )}

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
                    title={unit.name}
                />
            )}

            <RequestInformationModal
                isOpen={isRequestInfoModalOpen}
                onClose={() => setIsRequestInfoModalOpen(false)}
                entityId={unit.id}
                type="MORE_INFORMATION"
                buttonText="Request More Information"
                customTitle={`Would you like to know more about ${unit.name}?`}
            />

            <ClaimRequestModal isOpen={isClaimProfileModalOpen} onClose={() => setIsClaimProfileModalOpen(false)} />

            <SectionLayout>
                <div id="overview" className="w-full xl:max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-4 py-8 lg:py-16 lg:pt-8 px-4 lg:px-0 justify-between">
                    <div className="about-unit w-full">
                        <span className="text-md lg:text-lg text-left lg:text-left text-primary w-full uppercase">
                            About
                        </span>
                        <h2 className="text-4xl font-medium text-left lg:text-left mx-auto mt-4 mb-4">
                            {unit.residence.description}
                        </h2>
                        <p className="text-md text-muted-foreground">
                            {unit.about}
                        </p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="badges bg-secondary rounded-lg min-w-full lg:min-w-[40svw] p-6">
                            <div className="w-full mb-6">
                                <h3 className="text-2xl font-medium">Details</h3>
                            </div>
                            <div className="grid gap-cols-1 lg:grid-cols-2 gap-2 gap-x-12">
                                <div className="flex items-center gap-2 w-full justify-between">
                                    <div className="flex items-center gap-2">
                                        <Bed className="w-4 h-4" color="#9FA1A3" />
                                        <p>Bedroom</p>
                                    </div>
                                    <p>{unit.bedroom}</p>
                                </div>
                                <div className="flex items-center gap-2 w-full justify-between">
                                    <div className="flex items-center gap-2">
                                        <Bath className="w-4 h-4" color="#9FA1A3" />
                                        <p>Bathroom</p>
                                    </div>
                                    <p>{unit.bathrooms}</p>
                                </div>

                                <div className="flex items-center gap-2 w-full justify-between">
                                    <div className="flex items-center gap-2">
                                        <Ruler className="w-4 h-4" color="#9FA1A3" />
                                        <p>Unit size</p>
                                    </div>
                                    <p>{unit.surface} m²</p>
                                </div>

                                <div className="flex items-center gap-2 w-full justify-between">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="w-4 h-4" color="#9FA1A3" />
                                        <p>Floor</p>
                                    </div>
                                    <p>{unit.floor}</p>
                                </div>
                                <div className="flex items-center gap-2 w-full justify-between">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" color="#9FA1A3" />
                                        <p>Price</p>
                                    </div>
                                    <p>{unit.regularPrice.toLocaleString('de-DE')} €</p>
                                </div>
                                <div className="flex items-center gap-2 w-full justify-between">
                                    <div className="flex items-center gap-2">
                                        <CircleSmall className="w-4 h-4" color="#9FA1A3" />
                                        <p>Type of transaction</p>
                                    </div>
                                    <p>{unit.transactionType}</p>
                                </div>
                                <div className="flex items-center gap-2 w-full justify-between">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" color="#9FA1A3" />
                                        <p>Location</p>
                                    </div>
                                    <p>{unit.residence.address}</p>
                                </div>
                            </div>
                        </div>

                        <div className="badges bg-secondary rounded-lg min-w-full lg:min-w-[40svw] p-6">
                            <div className="w-full mb-6">
                                <h3 className="text-2xl font-medium">Characteristics</h3>
                            </div>
                            <div className="flex flex-row gap-2 flex-wrap">
                                {unit.characteristics.map((characteristic) => (
                                    <div key={characteristic} className="flex items-center gap-2 bg-white/5 rounded-md px-4 py-2 text-sm">
                                        <p>{characteristic}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-secondary rounded-lg min-w-full lg:min-w-[40svw] p-6">
                            <div className="w-full mb-6">
                                <h3 className="text-2xl font-medium">Services included</h3>
                            </div>
                            <div className="flex flex-row gap-2 flex-wrap">
                                {unit.services.map((service) => (
                                    <div key={service.name} className="flex items-center gap-2 items-center justify-between w-full">
                                        <p>{service.name}</p>
                                        <p>{service.amount}</p>
                                    </div>
                                ))}
                            </div>
                        </div>


                        <Map
                            latitude={unit.residence.latitude}
                            longitude={unit.residence.longitude}
                            address={unit.residence.address}
                        />

                    </div>

                </div>
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
                                REQUEST MORE INFORMATION
                            </span>
                            <h2 className="text-4xl font-medium text-left lg:text-left mx-auto mt-4">
                                Request more information for the property
                            </h2>
                            <h2 className="text-4xl font-reguralr text-left lg:text-left mt-2">
                                Send us a request
                            </h2>
                        </div>
                        <button
                            onClick={() => setIsRequestInfoModalOpen(true)}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-fit z-4">
                            Send a request
                            <ArrowRight />
                        </button>
                    </div>
                </SectionLayout>
            </div>

            <div className="bg-[#1A1E21] py-8 lg:py-16 px-4 lg:px-0 ">
                <SectionLayout>
                    <div className="w-full xl:max-w-[1600px] mx-auto flex flex-col items-start lg:items-center gap-4 mb-8">
                        <span className="text-md lg:text-lg text-left lg:text-center text-primary w-full uppercase">
                            RESIDENCE INVENTORY
                        </span>
                        <h2 className="text-4xl font-medium lg:w-[60%] lg:text-center">
                            Various options from this community
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 w-full xl:max-w-[1600px] mx-auto">
                        {loadingSimilar ? (
                            <div className="col-span-3 flex justify-center items-center py-12">
                                <p className="text-lg text-muted-foreground">Loading similar units...</p>
                            </div>
                        ) : similarUnits.length > 0 ? (
                            similarUnits.map((similarUnit) => (
                                <UnitCard
                                    key={similarUnit.id}
                                    unit={similarUnit}
                                />
                            ))
                        ) : (
                            <div className="col-span-3 flex justify-center items-center py-12">
                                <p className="text-lg text-muted-foreground">No similar units found</p>
                            </div>
                        )}
                    </div>
                </SectionLayout>
            </div>

            <div className="px-2 py-6 lg:px-0 lg:py-0">
                <SectionLayout>
                    <FaqUnit />   
                </SectionLayout>
            </div>

            <NewsletterBlock />
        </>
    );
}