"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import UnitForm from "@/components/web/Units/UnitForm";
import { initialUnitValues, UnitFormValues } from "@/app/schemas/unit";

// Helper funkcija za sigurno konvertovanje u string
function toStringSafe(val: any): string {
  if (val === undefined || val === null) return "";
  return typeof val === "string" ? val : String(val);
}

export default function EditUnitPage() {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const unitId = params?.unitId as string | undefined;

  const [initialData, setInitialData] = useState<Partial<UnitFormValues> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // ✅ DODANO: State za processed images
  const [initialImages, setInitialImages] = useState<any[]>([]);

  useEffect(() => {
    const fetchUnit = async () => {
      if (!unitId) return;
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/units/${unitId}`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch unit");
        const json = await response.json();
        const data = json.data;
        
        console.log("✅ EditUnitPage: Raw unit data:", data);

        // ✅ ISPRAVKA: Process images HERE like in Residence edit
        let processedImages: any[] = [];
        if (Array.isArray(data.gallery)) {
          processedImages = data.gallery.map((img: any, idx: number) => ({
            mediaId: img.id,
            preview: img.url || `${API_BASE_URL}/api/${API_VERSION}/media/${img.id}/content`,
            isFeatured: data.featureImage?.id === img.id,
            order: typeof img.order === 'number' ? img.order : idx,
          }));
          
          // Ako ima featuredImage koji nije u galeriji, dodaj ga na početak
          if (data.featureImage && !data.gallery.some((img: any) => img.id === data.featureImage.id)) {
            processedImages.unshift({
              mediaId: data.featureImage.id,
              preview: data.featureImage.url || `${API_BASE_URL}/api/${API_VERSION}/media/${data.featureImage.id}/content`,
              isFeatured: true,
              order: 0,
            });
          }
          
          // Sortiraj po order
          processedImages = processedImages.sort((a, b) => a.order - b.order);
        }

        console.log("✅ EditUnitPage: Processed images:", processedImages);
        setInitialImages(processedImages);

        // ✅ ISPRAVKA: Transform data properly like in Residence edit
        const transformedData = {
          id: data.id,
          name: toStringSafe(data.name),
          description: toStringSafe(data.description),
          surface: data.surface,
          status: data.status || "ACTIVE",
          regularPrice: data.regularPrice || 0,
          exclusivePrice: data.exclusivePrice,
          exclusiveOfferStartDate: data.exclusiveOfferStartDate || "",
          exclusiveOfferEndDate: data.exclusiveOfferEndDate || "",
          roomType: toStringSafe(data.roomType),
          roomAmount: data.roomAmount,
          unitTypeId: toStringSafe(data.unitType?.id), // ✅ KEY FIX: Map unitType.id to unitTypeId
          services: data.services || [],
          about: toStringSafe(data.about),
          bathrooms: toStringSafe(data.bathrooms),
          bedroom: toStringSafe(data.bedroom),
          floor: toStringSafe(data.floor),
          transactionType: data.transactionType || "SALE",
          characteristics: data.characteristics || [],
          residenceId: toStringSafe(data.residence?.id),
          galleryMediaIds: (data.gallery || []).map((img: any) => img.id) || [],
          featureImageId: toStringSafe(data.featureImage?.id),
        };

        console.log("✅ EditUnitPage: Transformed data:", transformedData);
        setInitialData(transformedData);
      } catch (e) {
        console.error("❌ EditUnitPage: Fetch error:", e);
        setError("Failed to load unit data");
        setInitialData(initialUnitValues);
      } finally {
        setLoading(false);
      }
    };
    fetchUnit();
  }, [unitId]);

  if (loading) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading unit data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center space-y-4">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <UnitForm
      initialData={initialData || initialUnitValues}
      isEditing={true}
      initialImages={initialImages}
    />
  );
}