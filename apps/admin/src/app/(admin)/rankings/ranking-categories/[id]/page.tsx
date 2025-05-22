"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import AdminLayout from "@/app/(admin)/AdminLayout";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RankingCategory, RankingCategoryStatus, SingleRankingCategoryApiResponse } from "@/app/types/models/RankingCategory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { RankingCategoryHeader } from "@/components/admin/Headers/RankingCategoryHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ResidencesTab from "@/components/admin/RankingCategory/Table/ResidencesTab";

function formatCurrency(value: string | number | undefined): string {
  if (!value) return "-";
  
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  return numericValue.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function RankingCategoryPage({ params }: PageProps) {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rankingCategory, setRankingCategory] = useState<RankingCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dodajemo logiku za tab iz query parametra
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "overview");

  // Sync tab sa query parametrom
  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Funkcija za promenu taba i update URL-a
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`?${params.toString()}`);
  };

  const [residencesRefreshKey, setResidencesRefreshKey] = useState(0);

  const fetchRankingCategory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/ranking-categories/${id}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store"
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch ranking category");
      }

      const data = await response.json() as SingleRankingCategoryApiResponse;
      setRankingCategory(data.data);
    } catch (err: any) {
      console.error("Error fetching ranking category:", err);
      setError(err.message || "Failed to fetch ranking category");
      toast.error("Failed to load ranking category data");
    } finally {
      setLoading(false);
    }
  };

  // Koristimo useEffect sa id-em
  useEffect(() => {
    if (id) {
      fetchRankingCategory();
    }
  }, [id]);

  const handleStatusChange = async (newStatus: RankingCategoryStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/ranking-categories/${id}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`);
      }

      const data = await response.json();
      setRankingCategory(prev => prev ? { ...prev, status: newStatus } : null);
      toast.success(`Ranking category status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating ranking category status:", error);
      toast.error("Failed to update ranking category status");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/ranking-categories/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ranking category: ${response.status}`);
      }

      toast.success('Ranking category deleted successfully');
      router.push('/rankings/ranking-categories');
    } catch (error) {
      console.error("Error deleting ranking category:", error);
      toast.error("Failed to delete ranking category");
    }
  };

  // Funkcija koja se prosleđuje kao onEditSuccess u RankingCategoryHeader
  const handleAddResidenceSuccess = async () => {
    handleTabChange("residences");
    setResidencesRefreshKey(prev => prev + 1);
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
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </AdminLayout>
    );
  }

  if (!rankingCategory) {
    return null;
  }

  // Calculate total weight for validation display
  const totalWeight = rankingCategory.rankingCriteria?.reduce((sum: any, criteria: { weight: any; }) => sum + criteria.weight, 0) || 0;

  const renderOverviewTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <Card className="border-none bg-foreground/5 col-span-full md:col-span-4 h-full">
        <CardContent className="h-full flex flex-col">
          <h2 className="text-lg font-semibold mb-4">General Information</h2>
          <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Ranking Name</p>
              <p className="text-sm font-medium">{rankingCategory.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Category Type</p>
              <p className="text-sm font-medium">{rankingCategory.rankingCategoryType?.name || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Description</p>
              <p className="text-sm font-medium">{rankingCategory.description || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Residence Limitation</p>
              <p className="text-sm font-medium">{rankingCategory.residenceLimitation?.toLocaleString() || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Ranking Price</p>
              <p className="text-sm font-medium">{formatCurrency(rankingCategory.rankingPrice)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
              <p className="text-sm font-medium">
                {new Date(rankingCategory.updatedAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none bg-foreground/5 col-span-full md:col-span-5 h-full">
        <CardContent className="h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Ranking Criteria</h2>
            <div className="flex gap-2">
              <Badge 
                variant={totalWeight === 100 ? "info" : "destructive"}
                className="text-xs"
              >
                Total: {totalWeight}%
              </Badge>
            </div>
          </div>
          <div className="flex-grow">
            {rankingCategory.rankingCriteria && rankingCategory.rankingCriteria.length > 0 ?
              <Table className="text-white">
                <TableHeader>
                  <TableRow>
                    <TableHead>Criteria</TableHead>
                    <TableHead>Weight</TableHead>
                  </TableRow>
                </TableHeader>  
                <TableBody>
                  {rankingCategory.rankingCriteria.map((criteria: { id: React.Key | null | undefined; name: string | number | boolean | React.ReactElement<any> | React.ReactNode[] | null | undefined; weight: string | number | boolean | React.ReactElement<any> | React.ReactNode[] | null | undefined; }) => (
                    <TableRow key={criteria.id}>
                      <TableCell className="font-medium">{criteria.name}</TableCell>
                      <TableCell>{criteria.weight}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No ranking criteria defined</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="col-span-full md:col-span-3 grid grid-rows-3 gap-4 h-full">
        <Card className="border-none bg-foreground/5">
          <CardContent className="flex flex-col justify-center h-full">
            <h2 className="text-xl font-medium">-</h2>
            <p className="text-sm text-muted-foreground">Total views</p>
          </CardContent>
        </Card>

        <Card className="border-none bg-foreground/5">    
          <CardContent className="flex flex-col justify-center h-full">
            <h2 className="text-xl font-medium">-</h2>
            <p className="text-sm text-muted-foreground">Average time spent</p>
          </CardContent>
        </Card>

        <Card className="border-none bg-foreground/5">    
          <CardContent className="flex flex-col justify-center h-full">
            <h2 className="text-xl font-medium">-</h2>
            <p className="text-sm text-muted-foreground">Engagement score</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <RankingCategoryHeader 
        category={rankingCategory} 
        onStatusChange={handleStatusChange} 
        onDelete={handleDelete}
        onEditSuccess={handleAddResidenceSuccess}
      />
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="bg-foreground/5">
          <TabsTrigger value="overview" className="data-[state=active]:text-white dark:data-[state=active]:bg-zinc-950 cursor-pointer border-transparent">Overview</TabsTrigger>
          <TabsTrigger value="residences" className="data-[state=active]:text-white dark:data-[state=active]:bg-zinc-950 cursor-pointer border-transparent">Residences</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          {renderOverviewTab()}
        </TabsContent>
        <TabsContent value="residences" className="mt-6">
          <ResidencesTab categoryId={id as string} refreshKey={residencesRefreshKey} />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}