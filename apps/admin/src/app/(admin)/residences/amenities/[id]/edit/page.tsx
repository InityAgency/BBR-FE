"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AdminLayout from "@/app/(admin)/AdminLayout";
import AmenityForm from "@/components/admin/Amenities/Forms/AmenityForm";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { Amenity } from "@/app/types/models/Amenity";
import { Skeleton } from "@/components/ui/skeleton";

interface PageParams {
  id: string;
}

export default function AmenityEditPage({ 
  params 
}: { 
  params: Promise<PageParams>
}) {
  const router = useRouter();
  const [amenity, setAmenity] = useState<Amenity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = React.use(params);

  useEffect(() => {
    const fetchAmenity = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/amenities/${id}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch amenity: ${response.status}`);
        }

        const data = await response.json();
        if (data.data) {
          setAmenity(data.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching amenity:", error);
        setError((error as Error).message || "Failed to load amenity");
        toast.error("Failed to load amenity details");
      } finally {
        setLoading(false);
      }
    };

    fetchAmenity();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="w-full space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-64 bg-muted/20" />
            <Skeleton className="h-10 w-32 bg-muted/20" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Skeleton className="h-8 w-32 bg-muted/20" />
              <Skeleton className="h-10 w-full bg-muted/20" />
              <Skeleton className="h-24 w-full bg-muted/20" />
              <Skeleton className="h-10 w-full bg-muted/20" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-8 w-32 bg-muted/20" />
              <Skeleton className="h-40 w-full bg-muted/20 " />
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !amenity) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <h1 className="text-xl font-semibold mb-2">Amenity not found</h1>
          <p className="text-muted-foreground mb-4">{error || "The requested amenity could not be found."}</p>
          <button 
            className="text-primary hover:underline"
            onClick={() => router.push("/residences/amenities")}
          >
            Back to Amenities
          </button>
        </div>
      </AdminLayout>
    );
  }

  // Transform API data to match the form format
  const transformedData = {
    id: amenity.id,
    name: amenity.name,
    description: amenity.description || "",
    icon: amenity.icon
  };

  return (
    <AdminLayout>
      <AmenityForm initialData={transformedData} isEditing={true} />
    </AdminLayout>
  );
}
