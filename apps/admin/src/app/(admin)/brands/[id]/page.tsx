"use client";

import { useState, useEffect } from "react";
import { Building2, Calendar, Trophy } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import AdminLayout from "../../AdminLayout";
import { BrandHeader } from "@/components/admin/Headers/BrandHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Brand, BrandStatus } from "@/app/types/models/Brand";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResidencesTable from "@/components/admin/Residences/Table/ResidencesTable";
import { getBrandById, updateBrandStatus, deleteBrand } from "@/app/services/brands";

export default function BrandsSingle() {
  const router = useRouter();
  const params = useParams();
  const brandId = params.id as string;
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrand = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBrandById(brandId);
      setBrand(data);
    } catch (error) {
      console.error("Error fetching brand:", error);
      if (error instanceof Error && error.message === 'Brand not found') {
        setError('Brand not found');
        router.push("/404");
      } else {
        setError('Failed to load brand data');
        toast.error("Failed to load brand data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (brandId) {
      fetchBrand();
    }
  }, [brandId, router]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const updatedBrand = await updateBrandStatus(brandId, newStatus);
      setBrand(updatedBrand);
      toast.success(`Brand status updated to ${newStatus}`);
      // Refresh podataka nakon promene statusa
      await fetchBrand();
    } catch (error) {
      console.error("Error updating brand status:", error);
      if (error instanceof Error && error.message === 'Brand not found') {
        router.push("/404");
      } else {
        toast.error("Failed to update brand status");
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBrand(brandId);
      toast.success("Brand deleted successfully!");
      router.push("/brands");
    } catch (error) {
      console.error("Error deleting brand:", error);
      if (error instanceof Error && error.message === 'Brand not found') {
        router.push("/404");
      } else {
        toast.error("Failed to delete brand");
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!brand) {
    return null;
  }

  const renderOverviewTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
      <Card className="border-none bg-foreground/5 col-span-full md:col-span-4">
        <CardContent>
          <h2 className="text-lg font-semibold mb-4">General Information</h2>
          <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Brand Name</p>
              <p className="text-sm font-medium text-white">{brand.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Brand Type</p>
              <p className="text-sm font-medium text-white">{brand.brandType.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Description</p>
              <p className="text-sm font-medium text-white">{brand.description}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Registered at</p>
              <p className="text-sm font-medium text-white">{new Date(brand.registeredAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
  
      <Card className="border-none p-0 col-span-full md:col-span-6">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 bg-foreground/5 rounded-lg p-4">
              <div className="icon-container bg-foreground/5 rounded-lg p-4">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xl font-medium">0</p>
                <p className="text-sm text-muted-foreground">Number of Residences</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-foreground/5 rounded-lg p-4">
              <div className="icon-container bg-foreground/5 rounded-lg p-4">
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xl font-medium">0</p>
                <p className="text-sm text-muted-foreground">Locations</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-foreground/5 rounded-lg p-4">
              <div className="icon-container bg-foreground/5 rounded-lg p-4">
                <Trophy className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xl font-medium">0</p>
                <p className="text-sm text-muted-foreground">Average score</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  const renderResidencesTab = () => (
    <ResidencesTable />
  );

  return (
    <AdminLayout>
      <BrandHeader 
        brand={brand} 
        onStatusChange={handleStatusChange} 
        onDelete={handleDelete} 
      />
      
      <Tabs defaultValue="overview">
        <TabsList className="bg-foreground/5">
          <TabsTrigger value="overview" className="data-[state=active]:text-white dark:data-[state=active]:bg-zinc-950 cursor-pointer border-transparent">Overview</TabsTrigger>
          <TabsTrigger value="residences" disabled className="data-[state=active]:text-white dark:data-[state=active]:bg-zinc-950 cursor-pointer border-transparent">Residences</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          {renderOverviewTab()}
        </TabsContent>
        <TabsContent value="residences" className="mt-6">
          {renderResidencesTab()}
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
