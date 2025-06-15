"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { ResidenceHeader } from "@/components/web/Residences/Headers/ResidenceHeader";
import { ResidenceDetails } from "@/components/web/Residences/Detials/ResidenceDetails";
import { ResidenceInventory } from "@/components/web/Residences/Detials/ResidenceInventory";
import { ResidenceRanking } from "@/components/web/Residences/Detials/ResidenceRanking";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export default function ResidencesSingle() {
  const router = useRouter();
  const params = useParams();
  const residenceSlug = params.slug as string;
  const [residence, setResidence] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResidence = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || "v1";
      const response = await fetch(`${baseUrl}/api/${apiVersion}/public/residences/slug/${residenceSlug}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch residence');
      }
      
      const data = await response.json();
      setResidence(data.data);
      
      if (!data.data) {
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
    if (residenceSlug) {
      fetchResidence();
    }
  }, [residenceSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!residence) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <ResidenceHeader residence={residence} />
        <Tabs defaultValue="overview">
          <TabsList className="h-auto bg-secondary border">
            <TabsTrigger value="overview" className="data-[state=active]:text-white dark:data-[state=active]:bg-black/5 cursor-pointer border-transparent py-2 px-4">Overview</TabsTrigger>
            <TabsTrigger value="inventory" className="data-[state=active]:text-white dark:data-[state=active]:bg-black/5 cursor-pointer border-transparent py-2 px-4">Inventory</TabsTrigger>
            <TabsTrigger value="leads" disabled className="data-[state=active]:text-white dark:data-[state=active]:bg-black/5 cursor-pointer border-transparent py-2 px-4">Leads</TabsTrigger>
            <TabsTrigger value="rankings" className="data-[state=active]:text-white dark:data-[state=active]:bg-black/5 cursor-pointer border-transparent py-2 px-4">Rankings</TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:text-white dark:data-[state=active]:bg-black/5 cursor-pointer border-transparent py-2 px-4">Reviews</TabsTrigger>
            <TabsTrigger value="billing" disabled className="data-[state=active]:text-white dark:data-[state=active]:bg-black/5 cursor-pointer border-transparent py-2 px-4">Billing</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-6">
            <ResidenceDetails residence={residence} />
          </TabsContent>
          <TabsContent value="inventory" className="mt-6">
            <ResidenceInventory residenceId={residence.id} />
          </TabsContent>
          <TabsContent value="leads" className="mt-6">
            <Card><CardContent className="py-8 text-center text-muted-foreground">Leads are currently locked.</CardContent></Card>
          </TabsContent>
          <TabsContent value="rankings" className="mt-6">
            {/* <Card><CardContent className="py-8 text-center text-muted-foreground">Rankings content coming soon...</CardContent></Card> */}
            <ResidenceRanking residenceId={residence.id} totalScores={residence.totalScores} />
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <Card className="bg-secondary"><CardContent className="py-8 text-center text-muted-foreground">Reviews content coming soon...</CardContent></Card>
          </TabsContent>
          <TabsContent value="billing" className="mt-6">
            <Card><CardContent className="py-8 text-center text-muted-foreground">Billing is currently locked.</CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}