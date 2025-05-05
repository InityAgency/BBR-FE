"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { ResidenceCard } from "@/components/web/Residences/ResidenceCard";
import { ResidenceCardSkeleton } from "@/components/web/Residences/ResidenceCardSkeleton";
import type { Residence, ResidencesResponse } from "@/types/residence";
import { Pagination } from "@/components/common/Pagination";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { Search, Filter, X, SlidersHorizontal, Trash } from "lucide-react";
import NewsletterBlock from "@/components/web/Newsletter/NewsletterBlock";
import SectionLayout from "@/components/web/SectionLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface Country {
  id: string;
  name: string;
  slug: string;
}

interface CountryResponse {
  data: Country;
  statusCode: number;
  message: string;
}

export default function CountryResidencesPage() {
  const [residences, setResidences] = useState<Residence[]>([]);
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);
  const [countryLoading, setCountryLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [developmentStatus, setDevelopmentStatus] = useState<string>("");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const countrySlug = params.slug as string;

  // Fetch country data
  useEffect(() => {
    if (countrySlug) {
      fetchCountry(countrySlug);
    }
  }, [countrySlug]);

  // Handle URL params and fetch residences
  useEffect(() => {
    const page = searchParams.get("page") || "1";
    const query = searchParams.get("query") || "";
    const status = searchParams.get("developmentStatus") || "";

    setCurrentPage(Number.parseInt(page));
    setSearch(query);
    setDevelopmentStatus(status);

    if (country) {
      fetchResidences(Number.parseInt(page), query, status);
    }
  }, [searchParams, country]);

  // Handle search changes
  useEffect(() => {
    updateUrlWithFilters(1);
  }, [debouncedSearch]);

  // Manage filter animation
  const hasActiveFilters = search || developmentStatus;

  useEffect(() => {
    if (hasActiveFilters) {
      setFiltersVisible(true);
    } else {
      const timer = setTimeout(() => {
        setFiltersVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [hasActiveFilters]);

  const fetchCountry = async (slug: string) => {
    try {
      setCountryLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || "v1";
      const url = `${baseUrl}/api/${apiVersion}/countries/${slug}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch country: ${response.status}`);
      }

      const data: CountryResponse = await response.json();
      if (!data.data?.id) {
        throw new Error("Country ID not found");
      }
      setCountry(data.data);
    } catch (error) {
      console.error("Error fetching country:", error);
      setCountry(null); // Reset country on error
    } finally {
      setCountryLoading(false);
    }
  };

  const fetchResidences = async (page: number, query = "", status = "") => {
    if (!country?.id) {
      console.warn("Cannot fetch residences: country ID is missing");
      setResidences([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || "v1";
      const url = new URL(`${baseUrl}/api/${apiVersion}/public/residences`);

      // Add query parameters
      url.searchParams.set("page", page.toString());
      url.searchParams.set("limit", "12");
      url.searchParams.set("countryId", country.id); // Use country ID

      if (query) {
        url.searchParams.set("query", query);
      }
      if (status) {
        url.searchParams.set("developmentStatus", status);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Failed to fetch residences: ${response.status}`);
      }

      const data: ResidencesResponse = await response.json();
      setResidences(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching residences:", error);
      setResidences([]);
    } finally {
      setLoading(false);
    }
  };

  const updateUrlWithFilters = (page: number = currentPage) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (debouncedSearch) {
      params.set("query", debouncedSearch);
    }
    if (developmentStatus) {
      params.set("developmentStatus", developmentStatus);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    updateUrlWithFilters(page);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleDevelopmentStatusChange = (value: string) => {
    const selectedValue = value === "ALL" ? "" : value;
    setDevelopmentStatus(selectedValue);
    const params = new URLSearchParams();
    params.set("page", "1");
    if (debouncedSearch) {
      params.set("query", debouncedSearch);
    }
    if (value !== "ALL") {
      params.set("developmentStatus", value);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    setSearch("");
    setDevelopmentStatus("");
    const params = new URLSearchParams();
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const clearSearchFilter = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSearch("");
    const params = new URLSearchParams();
    params.set("page", "1");
    if (developmentStatus) {
      params.set("developmentStatus", developmentStatus);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const clearDevelopmentStatusFilter = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDevelopmentStatus("");
    const params = new URLSearchParams();
    params.set("page", "1");
    if (debouncedSearch) {
      params.set("query", debouncedSearch);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const getCountryName = () => {
    if (countryLoading) return "Loading...";
    if (!country) return countrySlug.replace(/-/g, " ");
    return country.name;
  };

  const formatCountryName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const activeFiltersCount = [search, developmentStatus].filter(Boolean).length;
  const displayCountryName = country?.name || formatCountryName(countrySlug);

  return (
    <>
      <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-6 lg:py-12 gap-4 xl:gap-8 mb-3 lg:mb-12">
        <div className="page-header flex flex-col gap-6 w-full">
          <p className="text-md uppercase text-left lg:text-center text-primary">PROPERTIES IN {displayCountryName.toUpperCase()}</p>
          <h1 className="text-4xl font-bold text-left lg:text-center xl:max-w-[50svw] xl:m-auto">
            Meet the Elite Residence Properties in {displayCountryName}
          </h1>
          <p className="text-lg text-left lg:text-center text-muted-foreground max-w-3xl mx-auto">
            Discover the finest luxury branded residences across {displayCountryName} — where exceptional design meets unparalleled lifestyle.
          </p>
        </div>
      </div>
      <SectionLayout>
        <div className="w-full">
          <div className="flex flex-col gap-1 lg:gap-4 w-full">
            <div>
              {/* Desktop filters */}
              <div className="flex gap-4 residence-filters">
                <div className="w-full mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 w-5 h-5" />
                    <Input
                      placeholder={`Search residences in ${displayCountryName}...`}
                      value={search}
                      onChange={handleSearch}
                      className="pl-10 w-full"
                    />
                  </div>
                </div>
                <div className="hidden lg:flex lg:flex-row gap-4 lg:gap-6 items-start lg:items-center justify-between mb-4">
                  <Select value={developmentStatus} onValueChange={handleDevelopmentStatusChange}>
                    <SelectTrigger className="w-full lg:w-[180px]">
                      <SelectValue placeholder="Development status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All statuses</SelectItem>
                      <SelectItem value="PLANNED">Planned</SelectItem>
                      <SelectItem value="UNDER_CONSTRUCTION">Under Construction</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Mobile filter button */}
              <div className="lg:hidden w-full mb-4 residence-filters">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => setIsFilterDrawerOpen(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Drawer for mobile filters */}
              <Drawer open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen}>
                <DrawerContent>
                  <DrawerHeader className="flex flex-row items-center justify-between">
                    <DrawerTitle className="text-2xl">Filters</DrawerTitle>
                    <Button onClick={clearFilters} variant="link" className="w-fit">
                      <Trash className="w-4 h-4" />
                      Clear Filters
                    </Button>
                  </DrawerHeader>
                  <div className="px-4 py-2 space-y-4 residence-filters">
                    {/* Development status filter */}
                    <div className="space-y-2 flex flex-col">
                      <label className="text-sm font-medium">Development Status</label>
                      <Select value={developmentStatus} onValueChange={handleDevelopmentStatusChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">All statuses</SelectItem>
                          <SelectItem value="PLANNED">Planned</SelectItem>
                          <SelectItem value="UNDER_CONSTRUCTION">Under Construction</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Active filters in drawer */}
                    {hasActiveFilters && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Active Filters</label>
                        <div className="flex flex-wrap gap-2">
                          {developmentStatus && (
                            <Badge variant="secondary" className="flex items-center gap-1 py-2 px-3 text-sm">
                              Status: {developmentStatus.replace("_", " ")}
                              <button
                                onClick={clearDevelopmentStatusFilter}
                                className="h-4 w-4 ml-1 flex items-center justify-center"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button className="w-full">Apply Filters</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>

              {/* Active filters display for desktop */}
              <div
                className={`
                  hidden lg:block mt-6 overflow-hidden transition-all duration-300 ease-in-out
                  ${hasActiveFilters ? "max-h-40 md:max-h-24 opacity-100 transform scale-y-100 origin-top" : "max-h-0 opacity-0 transform scale-y-95 origin-top"}
                `}
              >
                {filtersVisible && (
                  <div className="flex flex-wrap gap-2 animate-fade-in">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <span className="text-md text-muted-foreground">Active filters:</span>
                    </div>
                    {search && (
                      <Badge variant="secondary" className="flex items-center gap-1 py-2 px-3 text-sm transition-all hover:shadow-sm">
                        Search: {search}
                        <button
                          onClick={clearSearchFilter}
                          className="h-4 w-4 ml-1 flex items-center justify-center"
                          aria-label="Clear search filter"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </Badge>
                    )}
                    {developmentStatus && (
                      <Badge variant="secondary" className="flex items-center gap-1 py-2 px-3 text-sm transition-all hover:shadow-sm">
                        Status: {developmentStatus.replace("_", " ")}
                        <button
                          onClick={clearDevelopmentStatusFilter}
                          className="h-4 w-4 ml-1 flex items-center justify-center"
                          aria-label="Clear status filter"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>

            {countryLoading ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-xl text-muted-foreground">Loading country information...</p>
              </div>
            ) : !country ? (
              <div className="min-h-24 w-full border rounded-lg bg-secondary flex items-center justify-center flex-col py-12 mt-8">
                <p className="text-xl font-medium mb-2">Country not found</p>
                <p className="text-muted-foreground mb-6">The requested country does not exist.</p>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-8 w-full">
                {[...Array(12)].map((_, i) => (
                  <ResidenceCardSkeleton key={i} />
                ))}
              </div>
            ) : residences.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-4">
                  {residences.map((residence) => (
                    <ResidenceCard key={residence.id} residence={residence} />
                  ))}
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              </>
            ) : (
              <div className="min-h-24 w-full border rounded-lg bg-secondary flex items-center justify-center flex-col py-12 mt-8">
                <p className="text-xl font-medium mb-2">No residences found in {displayCountryName}</p>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or search criteria</p>
                <Button onClick={clearFilters}>Clear all filters</Button>
              </div>
            )}
          </div>
        </div>
      </SectionLayout>
      <NewsletterBlock />
    </>
  );
}