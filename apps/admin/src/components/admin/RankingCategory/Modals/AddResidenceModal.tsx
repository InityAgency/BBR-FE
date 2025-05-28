"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { toast } from "sonner";
import { Loader2, Search, AlertTriangle } from "lucide-react";
import { RankingCategory } from "@/app/types/models/RankingCategory";
import { Checkbox } from "@/components/ui/checkbox";
import { useDebounce } from "@/hooks/useDebounce";
import { useInView } from "react-intersection-observer";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";

interface AddResidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: RankingCategory;
  onSuccess?: () => void;
  rankingCategoryId: string;
}

interface RankingCriteria {
  id: string;
  name: string;
  description: string;
  weight: number;
  isDefault: boolean;
}

interface RankingScore {
  id: string;
  residenceId: string;
  rankingCriteriaId: string;
  score: number;
  criteria: RankingCriteria;
}

interface Residence {
  country: any;
  city: any;
  id: string;
  name: string;
  description: string;
  status: string;
  rankingScores: RankingScore[];
}

interface DetailedRankingCategory extends RankingCategory {
  rankingCriteria: RankingCriteria[];
}

interface ScoreCreationItem {
  residenceId: string;
  scores: Array<{
    rankingCriteriaId: string;
    score: number;
  }>;
}

export function AddResidenceModal({ isOpen, onClose, category, onSuccess, rankingCategoryId }: AddResidenceModalProps) {
  // Stanja
  const [residences, setResidences] = useState<Residence[]>([]);
  const [detailedCategory, setDetailedCategory] = useState<DetailedRankingCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [creatingScores, setCreatingScores] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResidences, setSelectedResidences] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Reference
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  // Koristimo react-intersection-observer za glatko učitavanje
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  // Funkcija za dobijanje detaljnih informacija o ranking kategoriji
  const fetchRankingCategory = useCallback(async () => {
    try {
      setCategoryLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/ranking-categories/${rankingCategoryId}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch ranking category");
      }

      const data = await response.json();
      setDetailedCategory(data.data);
    } catch (error) {
      console.error("Error fetching ranking category:", error);
      toast.error("Failed to load ranking category details");
    } finally {
      setCategoryLoading(false);
    }
  }, [rankingCategoryId]);

  // Funkcija za proveru koji kriterijumi nedostaju za rezidencije
  const checkMissingCriteria = useCallback((residences: Residence[], criteria: RankingCriteria[]) => {
    console.log("=== CHECKING MISSING CRITERIA ===");

    residences.forEach(residence => {
      const missingCriteria: RankingCriteria[] = [];

      criteria.forEach(criterion => {
        const hasScore = residence.rankingScores.some(
          score => score.rankingCriteriaId === criterion.id
        );

        if (!hasScore) {
          missingCriteria.push(criterion);
        }
      });

      if (missingCriteria.length > 0) {
        console.log(`🏠 Residence: ${residence.name} (ID: ${residence.id})`);
        console.log(`📍 Location: ${residence.city?.name || 'N/A'} - ${residence.country?.name || 'N/A'}`);
        console.log("❌ Missing criteria:");
        missingCriteria.forEach(criterion => {
          console.log(`   - ${criterion.name} (ID: ${criterion.id}) - Weight: ${criterion.weight}%`);
        });
        console.log("---");
      }
    });

    // Sumarni izveštaj
    const totalResidences = residences.length;
    const residencesWithMissingCriteria = residences.filter(residence =>
      criteria.some(criterion =>
        !residence.rankingScores.some(score => score.rankingCriteriaId === criterion.id)
      )
    ).length;

    console.log("📊 SUMMARY REPORT:");
    console.log(`Total residences: ${totalResidences}`);
    console.log(`Residences with missing criteria: ${residencesWithMissingCriteria}`);
    console.log(`Residences with complete criteria: ${totalResidences - residencesWithMissingCriteria}`);
    console.log("===========================================");
  }, []);

  // Funkcija za kreiranje nedostajućih skorova
  const createMissingScores = useCallback(async (selectedResidenceIds: string[]): Promise<boolean> => {
    if (!detailedCategory?.rankingCriteria) {
      console.error("No ranking criteria available");
      return false;
    }

    try {
      setCreatingScores(true);

      // Filterujemo selektovane rezidencije
      const selectedResidencesData = residences.filter(r => selectedResidenceIds.includes(r.id));

      // Kreiramo listu stavki za kreiranje skorova
      const scoreCreationItems: ScoreCreationItem[] = [];

      selectedResidencesData.forEach(residence => {
        const missingCriteria = detailedCategory.rankingCriteria.filter(criterion =>
          !residence.rankingScores.some(score => score.rankingCriteriaId === criterion.id)
        );

        if (missingCriteria.length > 0) {
          // Defaultni skor je 75 (ili možete prilagoditi logiku)
          const scores = missingCriteria.map(criterion => ({
            rankingCriteriaId: criterion.id,
            score: 1 // Defaultni skor
          }));

          scoreCreationItems.push({
            residenceId: residence.id,
            scores: scores
          });

          console.log(`📝 Creating scores for ${residence.name}:`,
            missingCriteria.map(c => `${c.name}: 1`).join(', '));
        }
      });

      // Ako nema nedostajućih skorova, vraćamo true
      if (scoreCreationItems.length === 0) {
        console.log("✅ All selected residences already have complete scores");
        return true;
      }

      console.log(`🔄 Creating scores for ${scoreCreationItems.length} residences...`);

      // Pozivamo API za kreiranje skorova
      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/residence-scores/multiple`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: scoreCreationItems
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to create missing scores");
      }

      console.log("✅ Successfully created missing scores");
      toast.success(`Created missing scores for ${scoreCreationItems.length} residences`);
      return true;

    } catch (error) {
      console.error("Error creating missing scores:", error);
      toast.error("Failed to create missing scores");
      return false;
    } finally {
      setCreatingScores(false);
    }
  }, [detailedCategory, residences]);

  const fetchResidences = useCallback(async (pageNumber: number, isNewSearch: boolean = false) => {
    // Koristimo ref da sprečimo duplicirane zahteve
    if (isLoadingRef.current) return;
  
    try {
      isLoadingRef.current = true;
      setLoading(true);
  
      let queryParams = new URLSearchParams();
      const key = category.rankingCategoryType?.key;
      
      // Konstanta za Worldwide ID
      const WORLDWIDE_ID = "2470421f-16ed-4c88-9110-7f89dea9dd0e";
      
      // Proveravamo da li je Worldwide kategorija
      const isWorldwideCategory = (
        (key === "geographical-areas" || key === "continents") && 
        category.entityId === WORLDWIDE_ID
      );
  
      // Dodajemo filtere samo ako NIJE Worldwide kategorija
      if (!isWorldwideCategory) {
        if (key === "countries") {
          queryParams.append("countryId", category.entityId);
        } else if (key === "cities") {
          queryParams.append("cityId", category.entityId);
        } else if (key === "brands") {
          queryParams.append("brandId", category.entityId);
        } else if (key === "lifestyles") {
          queryParams.append("lifestyleId", category.entityId);
        } else if (key === "geographical-areas") {
          queryParams.append("geographicalAreaId", category.entityId);
        } else if (key === "continents") {
          queryParams.append("continentId", category.entityId);
        }
      }
  
      // Osnovni parametri (uvek se dodaju)
      queryParams.append("status", "ACTIVE");
      queryParams.append("page", pageNumber.toString());
      queryParams.append("limit", "20");
  
      if (debouncedSearchQuery) {
        queryParams.append("query", debouncedSearchQuery);
      }
  
      // Debug log za jasnoću
      if (isWorldwideCategory) {
        console.log("🌍 Worldwide category detected - loading all residences");
      } else {
        console.log(`📍 Standard category (${key}) - filtering by entityId: ${category.entityId}`);
      }
  
      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/residences?${queryParams.toString()}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch residences");
      }
  
      const data = await response.json();
  
      let newResidences: Residence[];
      if (isNewSearch) {
        newResidences = data.data;
        setResidences(data.data);
      } else {
        newResidences = data.data;
        setResidences(prev => [...prev, ...data.data]);
      }
  
      // Debug log za rezultate
      console.log(`📊 Loaded ${newResidences.length} residences (${isWorldwideCategory ? 'Worldwide' : key})`);
  
      // Proveravamo kriterijume samo ako imamo detaljnu kategoriju
      if (detailedCategory?.rankingCriteria && newResidences.length > 0) {
        checkMissingCriteria(newResidences, detailedCategory.rankingCriteria);
      }
  
      setHasMore(data.data.length === 20);
    } catch (error) {
      console.error("Error fetching residences:", error);
      toast.error("Failed to load residences");
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [category, debouncedSearchQuery, detailedCategory, checkMissingCriteria]);

  // Učitavanje ranking kategorije kada se modal otvori
  useEffect(() => {
    if (isOpen) {
      fetchRankingCategory();
    }
  }, [isOpen, fetchRankingCategory]);

  // Inicijalno učitavanje i pretraga
  useEffect(() => {
    if (isOpen && detailedCategory) {
      setPage(1);
      setResidences([]);
      fetchResidences(1, true);
    }
  }, [isOpen, debouncedSearchQuery, fetchResidences, detailedCategory]);

  // Učitavanje na scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.2 && !isLoadingRef.current && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchResidences(nextPage);
    }
  }, [fetchResidences, hasMore, page]);

  // Učitavanje kada je element vidljiv
  useEffect(() => {
    if (inView && hasMore && !isLoadingRef.current) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchResidences(nextPage);
    }
  }, [inView, hasMore, fetchResidences, page]);

  // Dugme za učitavanje više
  const handleLoadMore = useCallback(() => {
    if (!isLoadingRef.current && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchResidences(nextPage);
    }
  }, [fetchResidences, hasMore, page]);

  // Glavna funkcija za dodavanje rezidencija (sa kreiranjem skorova)
  const handleAddResidences = async () => {
    try {
      setLoading(true);

      const scoresCreated = await createMissingScores(selectedResidences);

      if (!scoresCreated) {
        return;
      }


      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/ranking-categories/${category.id}/residences`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            residenceIds: selectedResidences,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add residences to category");
      }

      toast.success("Residences added successfully with all required scores");
      onSuccess?.();
      onClose();

    } catch (error) {
      console.error("Error in add residences process:", error);
      toast.error("Failed to add residences");
    } finally {
      setLoading(false);
    }
  };

  const toggleResidenceSelection = (residenceId: string) => {
    setSelectedResidences((prev) =>
      prev.includes(residenceId)
        ? prev.filter((id) => id !== residenceId)
        : [...prev, residenceId]
    );
  };

  // Brza funkcija za selekciju svih prikazanih rezidencija
  const toggleAllResidences = (checked: boolean) => {
    if (checked) {
      // Izbegavamo duplikate
      const allIds = [...new Set([...selectedResidences, ...residences.map(r => r.id)])];
      setSelectedResidences(allIds);
    } else {
      // Uklanjamo samo trenutno prikazane
      const displayedIds = residences.map(r => r.id);
      setSelectedResidences(prev => prev.filter(id => !displayedIds.includes(id)));
    }
  };

  // Računamo da li su svi trenutni elementi selektovani
  const areAllCurrentSelected = residences.length > 0 &&
    residences.every(residence => selectedResidences.includes(residence.id));

  // Funkcija za proveru da li rezidencija ima sve kriterijume
  const getResidenceMissingCriteria = (residence: Residence): RankingCriteria[] => {
    if (!detailedCategory?.rankingCriteria) return [];

    return detailedCategory.rankingCriteria.filter(criterion =>
      !residence.rankingScores.some(score => score.rankingCriteriaId === criterion.id)
    );
  };

  // Računamo koliko selektovanih rezidencija ima nedostajuće skorove
  const getSelectedResidencesWithMissingScores = () => {
    const selectedResidencesData = residences.filter(r => selectedResidences.includes(r.id));
    return selectedResidencesData.filter(residence => getResidenceMissingCriteria(residence).length > 0);
  };

  const selectedWithMissingScores = getSelectedResidencesWithMissingScores();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full lg:min-w-[800px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Add Residences to {category.name}</DialogTitle>
        </DialogHeader>

        {categoryLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading ranking category details...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Prikaz kriterijuma */}
            {detailedCategory?.rankingCriteria && (
              <div className="bg-secondary/50 border p-3 rounded-md">
                <h4 className="text-sm font-medium mb-2">Ranking Criteria ({detailedCategory.rankingCriteria.length}):</h4>
                <div className="flex flex-wrap gap-2">
                  {detailedCategory.rankingCriteria.map(criterion => (
                    <span
                      key={criterion.id}
                      className="inline-flex items-center px-2 py-1 bg-white/5 border border-white/10 text-white text-xs rounded-md"
                    >
                      {criterion.name} <span className="text-xs text-bold ml-1 text-primary">({criterion.weight}%)</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Upozorenje za nedostajuće skorove */}
            {selectedWithMissingScores.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 p-3 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-orange-800">Missing Scores Detected</h4>
                    <p className="text-sm text-orange-700">
                      {selectedWithMissingScores.length} selected residence(s) are missing some ranking scores.
                      Default scores (1) will be automatically created for missing criteria before adding to category.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search residences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button
                onClick={handleAddResidences}
                disabled={selectedResidences.length === 0 || loading || creatingScores}
              >
                {loading || creatingScores ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {creatingScores ? 'Creating Scores...' : 'Adding...'}
                  </>
                ) : (
                  `Add Selected (${selectedResidences.length})`
                )}
              </Button>
            </div>

            <div
              className="border rounded-md max-h-[500px] overflow-auto"
              onScroll={handleScroll}
              ref={tableContainerRef}
            >
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={areAllCurrentSelected}
                        onCheckedChange={toggleAllResidences}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-[120px]">Criteria Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && page === 1 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : residences.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No residences found
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {residences.map((residence) => {
                        const missingCriteria = getResidenceMissingCriteria(residence);
                        const hasMissingCriteria = missingCriteria.length > 0;
                        const isSelected = selectedResidences.includes(residence.id);

                        return (
                          <TableRow key={residence.id} className={isSelected ? "bg-muted/50" : ""}>
                            <TableCell>
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleResidenceSelection(residence.id)}
                              />
                            </TableCell>
                            <TableCell className="">
                              <div className="flex flex-row justify-between items-center h-full">
                                <span>{residence.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {residence.city?.name} - {residence.country?.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <TooltipProvider>
                                {detailedCategory?.rankingCriteria ? (
                                  <div className="flex flex-col gap-1">
                                    {/* Badge */}
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span
                                          className={`text-xs px-2 py-1 rounded-md inline-block text-center cursor-pointer w-full flex flex-col ${hasMissingCriteria
                                              ? 'bg-orange-100 text-orange-800'
                                              : 'bg-green-100 text-green-800'
                                            }`}
                                        >
                                          {hasMissingCriteria
                                            ? `${missingCriteria.length} missing`
                                            : 'Complete'}
                                        </span>
                                      </TooltipTrigger>
                                      {hasMissingCriteria && (
                                        <TooltipContent>
                                          <ul className="list-disc pl-4">
                                            {missingCriteria.map(c => (
                                              <li key={c.id}>{c.name}</li>
                                            ))}
                                          </ul>
                                        </TooltipContent>
                                      )}
                                    </Tooltip>

                                    {/* "Will create" note */}
                                    {hasMissingCriteria && isSelected && (
                                      <span className="text-xs text-red-400">Will create missing scores</span>
                                    )}

                                    {/* Inline preview of first two criteria */}
                                    {hasMissingCriteria && (
                                      <Tooltip>
                                        <TooltipContent >
                                          <div className="flex flex-col gap-1">
                                            <span>{missingCriteria.map(c => c.name).join(', ')}</span>
                                            <span className="text-xs text-muted-foreground">Will create missing scores</span>
                                          </div>
                                        </TooltipContent>
                                      </Tooltip>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-xs text-muted-foreground">Loading...</span>
                                )}
                              </TooltipProvider>

                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </>
                  )}

                  {/* Referenca za IntersectionObserver */}
                  {hasMore && (
                    <TableRow ref={loadMoreRef}>
                      <TableCell colSpan={4} className="text-center py-2">
                        {loading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-xs text-muted-foreground">Loading more residences...</span>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLoadMore}
                            className="mx-auto flex items-center gap-1"
                          >
                            Load More
                            <span className="text-xs text-muted-foreground ml-1">
                              ({residences.length} loaded)
                            </span>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}