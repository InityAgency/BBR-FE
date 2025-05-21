"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { toast } from "sonner";
import { Loader2, Search } from "lucide-react";
import { RankingCategory } from "@/app/types/models/RankingCategory";
import { Checkbox } from "@/components/ui/checkbox";
import { useDebounce } from "@/hooks/useDebounce";

interface AddResidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: RankingCategory;
  onSuccess?: () => void;
}

interface Residence {
  id: string;
  name: string;
  description: string;
  status: string;
  // Dodajte ostala polja koja su vam potrebna
}

export function AddResidenceModal({ isOpen, onClose, category, onSuccess }: AddResidenceModalProps) {
  const [residences, setResidences] = useState<Residence[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResidences, setSelectedResidences] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const fetchResidences = async (pageNumber: number, isNewSearch: boolean = false) => {
    try {
      setLoading(true);
      
      let queryParams = new URLSearchParams();
      const key = category.rankingCategoryType?.key;
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
      queryParams.append("status", "ACTIVE");
      queryParams.append("page", pageNumber.toString());
      queryParams.append("limit", "10");

      if (debouncedSearchQuery) {
        queryParams.append("query", debouncedSearchQuery);
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
      
      if (isNewSearch) {
        setResidences(data.data);
      } else {
        setResidences(prev => [...prev, ...data.data]);
      }
      
      setHasMore(data.data.length === 10);
    } catch (error) {
      console.error("Error fetching residences:", error);
      toast.error("Failed to load residences");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setPage(1);
      setResidences([]);
      fetchResidences(1, true);
    }
  }, [isOpen, debouncedSearchQuery]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loading && hasMore) {
      setPage(prev => prev + 1);
      fetchResidences(page + 1);
    }
  }, [loading, hasMore, page]);

  const handleAddResidences = async () => {
    try {
      setLoading(true);
      
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
        throw new Error("Failed to add residences");
      }

      toast.success("Residences added successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error adding residences:", error);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl min-w-[800px]">
        <DialogHeader>
          <DialogTitle>Add Residences to {category.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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
              disabled={selectedResidences.length === 0 || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                `Add Selected (${selectedResidences.length})`
              )}
            </Button>
          </div>

          <div className="border rounded-md max-h-[500px] overflow-auto" onScroll={handleScroll}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedResidences.length === residences.length && residences.length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedResidences(residences.map((r) => r.id));
                        } else {
                          setSelectedResidences([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
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
                  residences.map((residence) => (
                    <TableRow key={residence.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedResidences.includes(residence.id)}
                          onCheckedChange={() => toggleResidenceSelection(residence.id)}
                        />
                      </TableCell>
                      <TableCell>{residence.name}</TableCell>
                    </TableRow>
                  ))
                )}
                {loading && page > 1 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 