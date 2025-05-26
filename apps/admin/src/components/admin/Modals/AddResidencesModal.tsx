"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";

interface Residence {
  id: string;
  name: string;
  city: {
    name: string;
  };
  country: {
    name: string;
  };
  status: string;
}

interface Country {
  id: string;
  name: string;
  flag: string;
}

interface Brand {
  id: string;
  name: string;
}

interface Lifestyle {
  id: string;
  name: string;
}

interface AddResidencesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rankingCategoryId: string;
  onSuccess: () => void;
}

export function AddResidencesModal({
  open,
  onOpenChange,
  rankingCategoryId,
  onSuccess,
}: AddResidencesModalProps) {
  const [residences, setResidences] = useState<Residence[]>([]);
  const [selectedResidences, setSelectedResidences] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [lifestyleFilter, setLifestyleFilter] = useState("");

  // State for pagination and infinite scroll
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreResidences, setHasMoreResidences] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  // Filter options
  const [countries, setCountries] = useState<Country[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [lifestyles, setLifestyles] = useState<Lifestyle[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(false);

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch filter options
  const fetchFilterOptions = useCallback(async () => {
    try {
      setLoadingFilters(true);
      
      // Fetch all filter options in parallel
      const [countriesRes, brandsRes, lifestylesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/${API_VERSION}/countries?limit=100`, { credentials: "include" }),
        fetch(`${API_BASE_URL}/api/${API_VERSION}/brands?limit=100`, { credentials: "include" }),
        fetch(`${API_BASE_URL}/api/${API_VERSION}/lifestyles?limit=100`, { credentials: "include" })
      ]);

      const [countriesData, brandsData, lifestylesData] = await Promise.all([
        countriesRes.ok ? countriesRes.json() : { data: [] },
        brandsRes.ok ? brandsRes.json() : { data: [] },
        lifestylesRes.ok ? lifestylesRes.json() : { data: [] }
      ]);

      setCountries(countriesData.data || []);
      setBrands(brandsData.data || []);
      setLifestyles(lifestylesData.data || []);
    } catch (error) {
      console.error("Error fetching filter options:", error);
      toast.error("Failed to load filter options");
    } finally {
      setLoadingFilters(false);
    }
  }, []);

  const fetchResidences = useCallback(async (page = 1, append = false) => {
    try {
      // Set loading state based on whether this is initial load or infinite scroll
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const queryParams = new URLSearchParams({
        limit: "20", // Reduced limit for better pagination
        page: page.toString(),
        ...(debouncedSearchQuery && { query: debouncedSearchQuery }),
        ...(countryFilter && countryFilter !== "all" && { countryId: countryFilter }),
        ...(brandFilter && brandFilter !== "all" && { brandId: brandFilter }),
        ...(lifestyleFilter && lifestyleFilter !== "all" && { lifestyleId: lifestyleFilter }),
      });

      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/residences?${queryParams}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          if (append) {
            setHasMoreResidences(false);
          } else {
            setResidences([]);
            setHasMoreResidences(false);
          }
          return;
        }
        throw new Error("Failed to fetch residences");
      }

      const data = await response.json();
      const newResidences = data.data || [];
      const pagination = data.pagination;

      if (append) {
        setResidences(prev => [...prev, ...newResidences]);
      } else {
        setResidences(newResidences);
      }

      // Update pagination state
      setCurrentPage(page);
      setHasMoreResidences(pagination ? page < pagination.totalPages : newResidences.length === 20);
      
    } catch (error) {
      console.error("Error fetching residences:", error);
      if (!append) {
        setResidences([]);
      }
      toast.error("Failed to load residences. Please try again.");
    } finally {
      if (append) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  }, [debouncedSearchQuery, countryFilter, brandFilter, lifestyleFilter]);

  // Load filter options when modal opens
  useEffect(() => {
    if (open) {
      fetchFilterOptions();
    }
  }, [open, fetchFilterOptions]);

  // Fetch residences when filters change (reset to first page)
  useEffect(() => {
    if (open) {
      setCurrentPage(1);
      setHasMoreResidences(true);
      fetchResidences(1, false);
    }
  }, [open, fetchResidences]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreResidences && !loading && !loadingMore && open) {
          fetchResidences(currentPage + 1, true);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMoreResidences, loading, loadingMore, currentPage, open, fetchResidences]);

  const handleSubmit = async () => {
    if (selectedResidences.length === 0) {
      toast.error("Please select at least one residence");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/ranking-categories/${rankingCategoryId}/residences`,
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to add residences");
      }

      toast.success("Residences added successfully");
      onSuccess();
      onOpenChange(false);
      // Clear selection after successful submit
      setSelectedResidences([]);
    } catch (error: any) {
      console.error("Error adding residences:", error);
      toast.error(error.message || "Failed to add residences. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedResidences.length === residences.length) {
      // Deselect all
      setSelectedResidences([]);
    } else {
      // Select all
      setSelectedResidences(residences.map(residence => residence.id));
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCountryFilter("all");
    setBrandFilter("all");
    setLifestyleFilter("all");
    setCurrentPage(1);
    setHasMoreResidences(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90svh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Residences to Ranking</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4 flex-shrink-0">
          {/* Search */}
          <div className="relative">
            <Input
              placeholder="Search residences by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-4"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={countryFilter} onValueChange={(value) => setCountryFilter(value === "all" ? "" : value)} disabled={loadingFilters}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country.id} value={country.id}>
                    <div className="flex items-center gap-2">
                      <img src={country.flag} alt={country.name} className="w-4 h-3 object-cover" />
                      {country.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={brandFilter || "all"} onValueChange={(value) => setBrandFilter(value === "all" ? "" : value)} disabled={loadingFilters}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All brands</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={lifestyleFilter || "all"} onValueChange={(value) => setLifestyleFilter(value === "all" ? "" : value)} disabled={loadingFilters}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by lifestyle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All lifestyles</SelectItem>
                {lifestyles.map((lifestyle) => (
                  <SelectItem key={lifestyle.id} value={lifestyle.id}>
                    {lifestyle.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filter actions */}
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFilters}
              disabled={!searchQuery && countryFilter === "all" && brandFilter === "all" && lifestyleFilter === "all"}
            >
              Clear filters
            </Button>
            
            <div className="text-sm text-muted-foreground">
              {residences.length} residence{residences.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 min-h-0">
          <div className="border rounded-md overflow-hidden h-full flex flex-col">
            {/* Header with select all */}
            {residences.length > 0 && (
              <div className="p-3 border-b bg-muted/20">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedResidences.length === residences.length}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all residences"
                  />
                  <label className="text-sm font-medium">
                    Select all ({selectedResidences.length}/{residences.length} selected)
                  </label>
                </div>
              </div>
            )}

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto p-4 max-h-[300px]">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : residences.length > 0 ? (
                <div className="space-y-3">
                  {residences.map((residence) => (
                    <div
                      key={residence.id}
                      className="flex items-center space-x-3 p-3 hover:bg-accent rounded-md transition-colors"
                    >
                      <Checkbox
                        id={residence.id}
                        checked={selectedResidences.includes(residence.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedResidences([...selectedResidences, residence.id]);
                          } else {
                            setSelectedResidences(
                              selectedResidences.filter((id) => id !== residence.id)
                            );
                          }
                        }}
                      />
                      <label
                        htmlFor={residence.id}
                        className="flex-1 text-sm font-medium leading-none cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span>{residence.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {residence.city?.name}, {residence.country?.name}
                          </span>
                        </div>
                      </label>
                    </div>
                  ))}
                  
                  {/* Loading more indicator */}
                  {loadingMore && (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2 text-sm text-muted-foreground">Loading more...</span>
                    </div>
                  )}
                  
                  {/* Intersection observer target */}
                  {hasMoreResidences && !loadingMore && (
                    <div ref={observerRef} className="h-4" />
                  )}
                  
                  {/* End of results indicator */}
                  {!hasMoreResidences && residences.length > 20 && (
                    <div className="text-center py-4">
                      <span className="text-sm text-muted-foreground">No more residences to load</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <div className="space-y-2">
                    <p className="text-lg">No residences found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setSelectedResidences([]);
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || selectedResidences.length === 0}
            className="min-w-[140px]"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding...
              </>
            ) : (
              `Add ${selectedResidences.length} Residence${selectedResidences.length !== 1 ? 's' : ''}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}