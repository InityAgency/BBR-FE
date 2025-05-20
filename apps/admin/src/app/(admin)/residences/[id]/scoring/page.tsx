"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import AdminLayout from "../../../AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

interface RankingCategory {
  id: string;
  name: string;
  weight: number;
}

interface RankingCriteria {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  score?: number;
  rankingCategories?: RankingCategory[];
}

export default function ResidenceScoring() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rankingCriteria, setRankingCriteria] = useState<RankingCriteria[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!params?.id) {
          throw new Error("Residence ID is missing");
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || "v1";
        const residenceId = params.id;

        // Fetch scores directly from this endpoint
        try {
          const scoresResponse = await fetch(
            `${baseUrl}/api/${apiVersion}/residences/${residenceId}/scores`,
            {
              credentials: "include",
            }
          );

          if (!scoresResponse.ok) {
            throw new Error(`Failed to fetch scoring data: ${scoresResponse.status}`);
          }

          const scoresData = await scoresResponse.json();
          
          if (Array.isArray(scoresData.data)) {
            // Process the data
            const processedData = scoresData.data.map((criteria: { rankingCategories: any; }) => ({
              ...criteria,
              rankingCategories: criteria.rankingCategories || [],
            }));
            
            setRankingCriteria(processedData);
          } else {
            console.error("Unexpected response format:", scoresData);
            throw new Error("Invalid response format from API");
          }
        } catch (err) {
          console.error("Failed to fetch scores:", err);
          throw err;
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params]);

  const handleScoreChange = (criteriaId: string, newScore: string) => {
    try {
      const scoreValue = newScore === "" ? 0 : parseInt(newScore, 10);
      
      if (isNaN(scoreValue)) {
        toast.error("Please enter a valid number");
        return;
      }
      
      setRankingCriteria((prev) =>
        prev.map((criteria) =>
          criteria.id === criteriaId
            ? { ...criteria, score: scoreValue }
            : criteria
        )
      );
      setHasChanges(true);
    } catch (err) {
      console.error("Error updating score:", err);
      toast.error("Failed to update score");
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      if (!params?.id) {
        throw new Error("Residence ID is missing");
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || "v1";
      const residenceId = params.id;

      const scores = rankingCriteria
        .filter((criteria) => criteria.score !== undefined && criteria.score > 0)
        .map((criteria) => ({
          rankingCriteriaId: criteria.id,
          score: criteria.score,
        }));

      const response = await fetch(
        `${baseUrl}/api/${apiVersion}/residences/${residenceId}/scores`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ scores }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update scores: ${response.status}`);
      }

      toast.success("Scores updated successfully");
      setHasChanges(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update scores";
      console.error(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Filter criteria based on isDefault property
  const defaultCriteria = rankingCriteria.filter((criteria) => criteria.isDefault);
  
  // Filter non-default criteria that have a score greater than 0
  const scoredNonDefaultCriteria = rankingCriteria.filter(
    (criteria) => !criteria.isDefault && criteria.score && criteria.score > 0
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-4 max-w-2xl">
          <Skeleton className="h-8 w-48 bg-secondary/50" />
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="border rounded-md p-4 space-y-3">
                <Skeleton className="h-6 w-64 bg-secondary/50" />
                <Skeleton className="h-4 w-full bg-secondary/50" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-40 bg-secondary/50" />
                  <Skeleton className="h-6 w-24 bg-secondary/50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Residence Scoring</h1>
          <Button
            onClick={handleSaveChanges}
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="main-criteria" className="w-full">
          <TabsList className="bg-foreground/5 mb-4">
            <TabsTrigger value="main-criteria" className="data-[state=active]:text-white dark:data-[state=active]:bg-zinc-950 cursor-pointer border-transparent">Main Criteria</TabsTrigger>
            <TabsTrigger value="sub-criteria" className="data-[state=active]:text-white dark:data-[state=active]:bg-zinc-950 cursor-pointer border-transparent">
              Sub-Criteria
              {scoredNonDefaultCriteria.length > 0 && (
                <span className="border w-5 h-5 rounded-full bg-blue-500/20 border-blue-500/40 flex items-center justify-center text-xs ml-1.5">
                  {scoredNonDefaultCriteria.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="main-criteria" className="space-y-4 max-w-2xl">
            {defaultCriteria.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No main criteria available
              </div>
            ) : (
              defaultCriteria.map((criteria) => (
                <div key={criteria.id} className="border rounded-md p-4 space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium">{criteria.name || "Untitled"}</h3>
                      <span className="text-sm outline border rounded-md px-2 py-1">
                        Default Criteria
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {criteria.description || "No description available"}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={criteria.score ?? ""}
                        onChange={(e) => handleScoreChange(criteria.id, e.target.value)}
                        className="min-w-[150px]"
                        placeholder="Enter score"
                      />
                      <span className="text-sm text-muted-foreground min-w-[50px]">/ 100</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="sub-criteria" className="space-y-4 max-w-2xl">
            {scoredNonDefaultCriteria.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No scored sub-criteria available
              </div>
            ) : (
              scoredNonDefaultCriteria.map((criteria) => (
                <div key={criteria.id} className="border rounded-md p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium">{criteria.name || "Untitled"}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {criteria.description || "No description available"}
                      </p>
                    </div>
                    
                    {/* Display categories for this criterion */}
                    {Array.isArray(criteria.rankingCategories) && 
                     criteria.rankingCategories.filter(category => category.weight > 0).length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Categories:</h4>
                        <div className="flex flex-wrap gap-2">
                          {criteria.rankingCategories
                            .filter(category => category.weight > 0)
                            .map((category) => (
                              <Link 
                                key={category.id} 
                                href={`/rankings/ranking-categories/${category.id}`}
                                className="cursor-pointer text-sm outline border rounded-md px-2 py-1 hover:bg-secondary/50"
                              >
                                {category.name} ({category.weight}%)
                              </Link>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={criteria.score ?? ""}
                        onChange={(e) => handleScoreChange(criteria.id, e.target.value)}
                        className="min-w-[150px]"
                        placeholder="Enter score"
                      />
                      <span className="text-sm text-muted-foreground min-w-[50px]">/ 100</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}