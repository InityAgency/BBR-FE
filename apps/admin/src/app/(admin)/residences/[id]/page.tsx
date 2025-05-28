"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import AdminLayout from "../../AdminLayout";
import { residencesService } from "@/lib/api/services/residences";
import { ResidenceHeader } from "@/components/admin/Residences/Headers/ResidenceHeader";
import { ResidenceDetails } from "@/components/admin/Residences/Details/ResidenceDetails";
import { ResidenceInventory } from "@/components/admin/Residences/Details/ResidenceInventory";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useBreadcrumb } from "@/components/admin/Breadcrumb";

export default function ResidencesSingle() {
  const router = useRouter();
  const params = useParams();
  const residenceId = params.id as string;
  const [residence, setResidence] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { setCustomBreadcrumb, resetCustomBreadcrumb } = useBreadcrumb();

  const updateBreadcrumb = (residenceData: any) => {
    if (residenceData?.id && residenceData.name) {
      setCustomBreadcrumb(residenceId, residenceData.name);
    } else {
      resetCustomBreadcrumb(residenceId);
    }
  };

  const fetchResidence = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await residencesService.getResidenceById(residenceId);
      setResidence(data);
      updateBreadcrumb(data);
      if (!data) {
        router.push("/404");
      }
    } catch (error) {
      setError("Failed to load residence data");
      toast.error("Failed to load residence data");
      router.push("/404");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (residenceId) {
      fetchResidence();
    }
    return () => {
      resetCustomBreadcrumb(residenceId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [residenceId]);

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

  if (!residence) {
    return null;
  }

  return (
    <AdminLayout>
      <ResidenceHeader residence={residence} />
      <Tabs defaultValue="overview">
        <TabsList className="bg-foreground/5">
          <TabsTrigger value="overview" className="data-[state=active]:text-white dark:data-[state=active]:bg-zinc-950 cursor-pointer border-transparent">Overview</TabsTrigger>
          <TabsTrigger value="inventory" className="data-[state=active]:text-white dark:data-[state=active]:bg-zinc-950 cursor-pointer border-transparent">Inventory</TabsTrigger>
          <TabsTrigger value="leads" disabled className="data-[state=active]:text-white dark:data-[state=active]:bg-zinc-950 cursor-pointer border-transparent">Leads</TabsTrigger>
          <TabsTrigger value="rankings" className="data-[state=active]:text-white dark:data-[state=active]:bg-zinc-950 cursor-pointer border-transparent">Rankings</TabsTrigger>
          <TabsTrigger value="reviews" className="data-[state=active]:text-white dark:data-[state=active]:bg-zinc-950 cursor-pointer border-transparent">Reviews</TabsTrigger>
          <TabsTrigger value="billing" disabled className="data-[state=active]:text-white dark:data-[state=active]:bg-zinc-950 cursor-pointer border-transparent">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <ResidenceDetails residence={residence} />
        </TabsContent>
        <TabsContent value="inventory" className="mt-6">
          <ResidenceInventory residenceId={residenceId} />
        </TabsContent>
        <TabsContent value="leads" className="mt-6">
          <Card><CardContent className="py-8 text-center text-muted-foreground">Leads are currently locked.</CardContent></Card>
        </TabsContent>
        <TabsContent value="rankings" className="mt-6">
          <Card><CardContent className="py-8 text-center text-muted-foreground">Rankings content coming soon...</CardContent></Card>
        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          <Card><CardContent className="py-8 text-center text-muted-foreground">Reviews content coming soon...</CardContent></Card>
        </TabsContent>
        <TabsContent value="billing" className="mt-6">
          <Card><CardContent className="py-8 text-center text-muted-foreground">Billing is currently locked.</CardContent></Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
