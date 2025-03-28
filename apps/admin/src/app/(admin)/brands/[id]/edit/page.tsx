"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AdminLayout from "../../../AdminLayout";
import BrandForm from "@/components/admin/Brands/Forms/BrandForm";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { Brand } from "@/app/types/models/Brand";
import { Skeleton } from "@/components/ui/skeleton";

interface PageParams {
  id: string;
}

export default function BrandEditPage({ 
  params 
}: { 
  params: Promise<PageParams>
}) {
  const router = useRouter();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = React.use(params);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/brands/${id}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch brand: ${response.status}`);
        }

        const data = await response.json();
        if (data.data) {
          setBrand(data.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching brand:", error);
        setError((error as Error).message || "Failed to load brand");
        toast.error("Failed to load brand details");
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
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

  if (error || !brand) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <h1 className="text-xl font-semibold mb-2">Brand not found</h1>
          <p className="text-muted-foreground mb-4">{error || "The requested brand could not be found."}</p>
          <button 
            className="text-primary hover:underline"
            onClick={() => router.push("/brands")}
          >
            Back to Brands
          </button>
        </div>
      </AdminLayout>
    );
  }

  // Transform API data to match the form format
  const transformedData = {
    id: brand.id,
    name: brand.name,
    description: brand.description || "",
    brandTypeId: brand.brandTypeId,
    brandType: brand.brandType,
    status: brand.status || "ACTIVE",
    logo: brand.logo,
    registeredAt: brand.registeredAt
  };

  return (
    <AdminLayout>
      <BrandForm initialData={transformedData} isEditing={true} />
    </AdminLayout>
  );
}