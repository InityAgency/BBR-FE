"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MultiStepResidenceForm from "./MultiStepResidenceForm";

function toStringSafe(val: any) {
  if (val === undefined || val === null) return "";
  return typeof val === "string" ? val : String(val);
}

export default function MultiStepResidenceFormEdit() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [residence, setResidence] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [residenceId, setResidenceId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (!slug) return;
    const fetchResidence = async () => {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || "v1";
        const res = await fetch(`${baseUrl}/api/${apiVersion}/public/residences/slug/${slug}`);
        if (!res.ok) throw new Error("Failed to fetch residence");
        const data = await res.json();
        setResidence(data.data);
        setResidenceId(data.data.id);
      } catch (e) {
        setError("Error loading residence data.");
      } finally {
        setLoading(false);
      }
    };
    fetchResidence();
  }, [slug]);

  if (loading) return <div className="py-12 text-center">Loading...</div>;
  if (error) return <div className="py-12 text-center text-destructive">{error}</div>;
  if (!residence) return <div className="py-12 text-center text-destructive">Residence not found.</div>;

  // Prepare initialImages for edit mode
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || "v1";
  let initialImages: any[] = [];
  if (Array.isArray(residence.mainGallery)) {
    initialImages = residence.mainGallery.map((img: any, idx: number) => ({
      mediaId: img.id,
      preview: `${baseUrl}/api/${apiVersion}/media/${img.id}/content`,
      isFeatured: residence.featuredImage?.id === img.id,
      order: typeof img.order === 'number' ? img.order : idx,
    }));
    // Ako ima featuredImage koji nije u mainGallery, dodaj ga na početak
    if (residence.featuredImage && !residence.mainGallery.some((img: any) => img.id === residence.featuredImage.id)) {
      initialImages.unshift({
        mediaId: residence.featuredImage.id,
        preview: `${baseUrl}/api/${apiVersion}/media/${residence.featuredImage.id}/content`,
        isFeatured: true,
        order: 0,
      });
    }
    // Sortiraj po order
    initialImages = initialImages.sort((a, b) => a.order - b.order);
  }

  // Transform data for edit form (latitude/longitude as string, always)
  const transformed = {
    ...residence,
    brandId: residence.brand?.id || "",
    countryId: residence.country?.id || "",
    cityId: residence.city?.id || "",
    latitude: toStringSafe(residence.latitude),
    longitude: toStringSafe(residence.longitude),
  };

  // TODO: Napraviti posebnu logiku za edit mod (inicijalizacija forme, submit kao PUT, itd)
  const handleNext = async (values: any) => {
    if (currentStep === 1 && !residenceId && values?.id) {
      setResidenceId(values.id);
      await updateResidence();
      setCurrentStep(currentStep + 1);
      return;
    }
    // Handle next step logic
  };
  return (
    <MultiStepResidenceForm 
      initialValues={transformed} 
      isEdit 
      initialImages={initialImages} 
    />
  );
} 

async function updateResidence() {
  // TODO: Implement residence update logic
  return Promise.resolve();
}
