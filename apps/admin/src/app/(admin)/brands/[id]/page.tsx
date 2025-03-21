"use client";

import { useState } from "react";
import { Building2, Calendar, Star, Trophy } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import AdminLayout from "../../AdminLayout";
import { BrandHeader } from "@/components/admin/Headers/BrandHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Brand, BrandStatus, BrandType } from "@/app/types/models/Brand";
import { brandsData } from "@/app/data/brands";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResidencesTable from "@/components/admin/Residences/Table/ResidencesTable";

export default function BrandsSingle() {
  const router = useRouter();
  const params = useParams();
  const brandId = params.id as string;
  
  // Pronalazimo brend iz brandsData
  const initialBrand = brandsData.find(b => b.id === brandId);
  const [brand, setBrand] = useState<Brand>(initialBrand || {
    id: "",
    name: "",
    type: "Luxury Hotel Resort" as BrandType,
    description: "", 
    status: "Draft" as BrandStatus,
    numberOfResidences: 0,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString() // Dodato createdAt polje
  });

  // Ako brend nije pronađen, preusmeravamo na 404
  if (!initialBrand) {
    router.push("/404");
    return null;
  }

  const handleStatusChange = (newStatus: string) => {
    console.log("Changing status to:", newStatus);
    setBrand(prev => ({ ...prev, status: newStatus as BrandStatus }));
  };

  const handleDelete = async () => {
    try {
      // Ovde bi išla logika za brisanje
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Brand deleted successfully!");
      router.push("/brands");
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast.error("An error occurred while deleting the brand.");
    }
  };

  const renderOverviewTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
      {/* Left card taking 40% width (4/10 columns) */}
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
              <p className="text-sm font-medium text-white">{brand.type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Description</p>
              <p className="text-sm font-medium text-white">{brand.description}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Created at</p>
              <p className="text-sm font-medium text-white">{brand.createdAt}</p>
            </div>
          </div>
        </CardContent>
      </Card>
  
      {/* Right card taking 60% width (6/10 columns) */}
      <Card className="border-none p-0 col-span-full md:col-span-6">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 bg-foreground/5 rounded-lg p-4">
              <div className="icon-container bg-foreground/5 rounded-lg p-4">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xl font-medium">{brand.numberOfResidences}</p>
                <p className="text-sm text-muted-foreground">Number of Residences</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-foreground/5 rounded-lg p-4">
              <div className="icon-container bg-foreground/5 rounded-lg p-4">
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xl font-medium">20</p>
                <p className="text-sm text-muted-foreground">Locations</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-foreground/5 rounded-lg p-4">
              <div className="icon-container bg-foreground/5 rounded-lg p-4">
                <Trophy className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xl font-medium">8.81</p>
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
          <TabsTrigger value="residences" className="data-[state=active]:text-white dark:data-[state=active]:bg-zinc-950 cursor-pointer border-transparent">Residences</TabsTrigger>
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
