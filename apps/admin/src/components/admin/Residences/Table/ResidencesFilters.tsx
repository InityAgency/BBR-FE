"use client";

import React, { useEffect, useState, useCallback } from "react";
import { MapPin, CircleDashed, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TableFilters } from "@/components/admin/Table/TableFilters";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";

// Konstante za keš 
const CITIES_CACHE_KEY = "residence-cities-cache";
const CITIES_CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 sata

interface City {
  id: string;
  name: string;
  country?: {
    id: string;
    name: string;
    code: string;
  };
}

interface ResidencesFiltersProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  selectedCityIds: string[];
  setSelectedCityIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCountryIds: string[];
  setSelectedCountryIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedStatuses: string[];
  setSelectedStatuses: React.Dispatch<React.SetStateAction<string[]>>;
  cities: City[];
  countries: any[];
  locationSearchValue: string;
  setLocationSearchValue: (value: string) => void;
  loading: boolean;
}

interface CitiesApiResponse {
  data: City[];
  pagination: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const PREDEFINED_STATUSES = ["ACTIVE", "DRAFT", "PENDING", "DELETED"];

// Funkcije za rad sa kešom
const getFromCache = <T,>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  
  try {
    const cacheItem = localStorage.getItem(key);
    if (!cacheItem) return null;
    
    const parsedCache: CacheItem<T> = JSON.parse(cacheItem);
    const now = Date.now();
    
    // Proveravamo da li je keš istekao
    if (now - parsedCache.timestamp > CITIES_CACHE_EXPIRY) {
      localStorage.removeItem(key);
      return null;
    }
    
    return parsedCache.data;
  } catch (error) {
    console.warn("Error reading from cache:", error);
    return null;
  }
};

const saveToCache = <T,>(key: string, data: T): void => {
  if (typeof window === "undefined") return;
  
  try {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cacheItem));
  } catch (error) {
    console.warn("Error saving to cache:", error);
  }
};

export function ResidencesFilters({
  globalFilter,
  setGlobalFilter,
  selectedCityIds,
  setSelectedCityIds,
  selectedCountryIds, // Zadržavamo za kompatibilnost
  setSelectedCountryIds, // Zadržavamo za kompatibilnost
  selectedStatuses,
  setSelectedStatuses,
  cities: initialCities = [], // Početne gradove koristimo samo za prikaz selektovanih
  countries = [], // Zadržavamo za kompatibilnost
  locationSearchValue,
  setLocationSearchValue,
  loading = false,
}: ResidencesFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [localSearch, setLocalSearch] = useState(globalFilter);
  const debouncedSearch = useDebounce(localSearch, 500);

  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const debouncedLocationSearch = useDebounce(locationSearchTerm, 500);
  
  const [cities, setCities] = useState<City[]>(initialCities);
  const [loadingCities, setLoadingCities] = useState(false);
  const [citiesPage, setCitiesPage] = useState(1);
  const [citiesHasMore, setCitiesHasMore] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Memoizovana funkcija za učitavanje gradova
  const fetchCities = useCallback(async (searchTerm: string, page: number = 1, limit: number = 100, useCache: boolean = true) => {
    // Ako ne tražimo ništa, probajmo da učitamo iz keša
    if (!searchTerm && page === 1 && useCache) {
      const cachedCities = getFromCache<City[]>(CITIES_CACHE_KEY);
      if (cachedCities && cachedCities.length > 0) {
        setCities(cachedCities);
        // Pretpostavljamo da ima više gradova
        setCitiesHasMore(true);
        return;
      }
    }

    // Ako tražimo nešto specifično, proverimo u nedavnim upitima
    if (searchTerm && useCache) {
      const cacheKey = `${CITIES_CACHE_KEY}-${searchTerm}`;
      const cachedResults = getFromCache<{cities: City[], hasMore: boolean}>(cacheKey);
      if (cachedResults) {
        setCities(prev => page === 1 ? cachedResults.cities : [...prev, ...cachedResults.cities]);
        setCitiesHasMore(cachedResults.hasMore);
        return;
      }
    }

    // Ako nema u kešu, učitavamo sa servera
    try {
      setLoadingCities(true);
      const url = new URL(`${API_BASE_URL}/api/${API_VERSION}/cities`);
      url.searchParams.set("limit", limit.toString());
      url.searchParams.set("page", page.toString());
      
      if (searchTerm) {
        url.searchParams.set("query", searchTerm);
      }

      const response = await fetch(url.toString(), {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching cities: ${response.status}`);
      }

      const data: CitiesApiResponse = await response.json();
      
      const newCities = data.data || [];
      const hasMore = page < data.pagination.totalPages;

      if (page === 1) {
        setCities(newCities);

        // Sačuvamo rezultate upita u keš
        if (searchTerm) {
          saveToCache(`${CITIES_CACHE_KEY}-${searchTerm}`, {cities: newCities, hasMore});
          // Sačuvamo upit u nedavne pretrage
          setRecentSearches(prev => {
            const updated = [searchTerm, ...prev.filter(s => s !== searchTerm)].slice(0, 5);
            return updated;
          });
        } else {
          // Ako nema upita, ovo je inicijalno učitavanje - sačuvamo u glavni keš
          saveToCache(CITIES_CACHE_KEY, newCities);
        }
      } else {
        setCities(prev => [...prev, ...newCities]);
      }
      
      // Proveriti da li ima više stranica
      setCitiesHasMore(hasMore);
      
    } catch (error) {
      console.error("Error fetching cities:", error);
      if (page === 1) setCities([]);
    } finally {
      setLoadingCities(false);
    }
  }, []);

  // Učitaj više gradova
  const loadMoreCities = useCallback(() => {
    if (citiesHasMore && !loadingCities) {
      const nextPage = citiesPage + 1;
      setCitiesPage(nextPage);
      fetchCities(debouncedLocationSearch, nextPage, 100, false); // Ne koristimo keš za dodatne stranice
    }
  }, [citiesHasMore, loadingCities, citiesPage, debouncedLocationSearch, fetchCities]);

  // Inicijalno učitavanje gradova pri prvom renderu
  useEffect(() => {
    fetchCities("", 1);
    
    // Učitaj nedavne pretrage iz lokalne memorije
    const savedSearches = getFromCache<string[]>('recent-city-searches');
    if (savedSearches) {
      setRecentSearches(savedSearches);
    }
  }, [fetchCities]);

  // Resetovanje paginacije kada se promeni upit
  useEffect(() => {
    setCitiesPage(1);
    fetchCities(debouncedLocationSearch, 1);
  }, [debouncedLocationSearch, fetchCities]);

  // Sačuvaj nedavne pretrage
  useEffect(() => {
    if (recentSearches.length > 0) {
      saveToCache('recent-city-searches', recentSearches);
    }
  }, [recentSearches]);

  // Učitavanje inicijalno selektovanih gradova ako nisu u listi
  useEffect(() => {
    if (selectedCityIds.length > 0 && initialCities.length > 0) {
      // Proverimo da li su svi selektovani gradovi već učitani
      const missingCityIds = selectedCityIds.filter(
        id => !cities.some(city => city.id === id)
      );
      
      if (missingCityIds.length > 0) {
        // Dodajemo inicijalne gradove koji su selektovani a nisu u rezultatima pretrage
        const selectedInitialCities = initialCities.filter(
          city => missingCityIds.includes(city.id)
        );
        
        if (selectedInitialCities.length > 0) {
          setCities(prev => {
            // Koristimo Set za deduplikaciju
            const uniqueCityIds = new Set(prev.map(c => c.id));
            return [...prev, ...selectedInitialCities.filter(c => !uniqueCityIds.has(c.id))];
          });
        }
      }
    }
  }, [selectedCityIds, initialCities, cities]);

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
  };

  useEffect(() => {
    const currentQuery = searchParams.get("query") || "";
    if (debouncedSearch !== currentQuery) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");

      if (debouncedSearch) {
        params.set("query", debouncedSearch);
      } else {
        params.delete("query");
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [debouncedSearch, router, pathname, searchParams]);

  useEffect(() => {
    const queryParam = searchParams.get("query");
    if (queryParam !== localSearch) {
      setLocalSearch(queryParam || "");
    }
  }, [searchParams]);

  const getCityWithCountry = (cityId: string): string => {
    const city = [...cities, ...initialCities].find((city) => city.id === cityId);
    if (city) {
      return city.country ? `${city.name}, ${city.country.name}` : city.name;
    }
    return cityId;
  };

  const clearAllFilters = () => {
    setSelectedCityIds([]);
    setSelectedStatuses([]);
    setGlobalFilter("");
    setLocalSearch("");

    const params = new URLSearchParams();
    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <TableFilters
        globalFilter={localSearch}
        setGlobalFilter={handleSearchChange}
        placeholder="Search residences..."
      >
        {/* Locations Filter (Combined Cities) */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10" disabled={loading}>
              <MapPin className="h-4 w-4 mr-2" />
              Locations
              {selectedCityIds.length > 0 && (
                <>
                  <div className="w-px h-4 bg-muted mx-2" />
                  <Badge
                    variant="secondary"
                    className="rounded-sm w-6 h-6 p-0 flex items-center justify-center text-xs"
                  >
                    {selectedCityIds.length}
                  </Badge>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Search cities or countries..."
                value={locationSearchTerm}
                onValueChange={setLocationSearchTerm}
              />
              <CommandList className="max-h-[300px]">
                <CommandEmpty>
                  {loadingCities ? "Loading locations..." : "No locations found."}
                </CommandEmpty>
                
                {/* Nedavne pretrage - prikazuju se kada nema unosa */}
                {!locationSearchTerm && recentSearches.length > 0 && (
                  <CommandGroup heading="Recent searches">
                    {recentSearches.map((search) => (
                      <CommandItem 
                        key={`recent-${search}`}
                        onSelect={() => setLocationSearchTerm(search)}
                        className="flex items-center text-sm text-muted-foreground"
                      >
                        <span>{search}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                
                {cities.length > 0 && (
                  <CommandGroup heading={locationSearchTerm ? "Search results" : "Locations"}>
                    {cities.map((city) => (
                      <CommandItem
                        key={city.id}
                        onSelect={() => {
                          setSelectedCityIds((prev) => {
                            if (prev.includes(city.id)) {
                              return prev.filter((id) => id !== city.id);
                            } else {
                              return [...prev, city.id];
                            }
                          });
                        }}
                        className="flex items-center"
                      >
                        <Checkbox
                          checked={selectedCityIds.includes(city.id)}
                          className="mr-2 h-4 w-4"
                        />
                        <div className="truncate">
                          {city.country ? `${city.name}, ${city.country.name}` : city.name}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                
                {citiesHasMore && (
                  <div className="p-2 text-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={loadMoreCities}
                      disabled={loadingCities}
                      className="w-full text-xs"
                    >
                      {loadingCities ? "Loading..." : "Load more locations"}
                    </Button>
                  </div>
                )}
              </CommandList>
              {selectedCityIds.length > 0 && (
                <div className="border-t border-border p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      params.delete("cityId");
                      params.set("page", "1");
                      router.replace(`${pathname}?${params.toString()}`, {
                        scroll: false,
                      });
                      setSelectedCityIds([]);
                    }}
                  >
                    Clear
                    <X className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </Command>
          </PopoverContent>
        </Popover>

        {/* Status Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10">
              <CircleDashed className="h-4 w-4 mr-2" />
              Status
              {selectedStatuses.length > 0 && (
                <>
                  <div className="w-px h-4 bg-muted mx-2" />
                  <Badge
                    variant="secondary"
                    className="rounded-sm w-6 h-6 p-0 flex items-center justify-center text-xs"
                  >
                    {selectedStatuses.length}
                  </Badge>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <Command>
              <CommandList>
                <CommandEmpty>No statuses found.</CommandEmpty>
                {PREDEFINED_STATUSES.map((status) => (
                  <CommandItem
                    key={status}
                    onSelect={() => {
                      setSelectedStatuses((prev) => {
                        if (prev.includes(status)) {
                          return prev.filter((item) => item !== status);
                        } else {
                          return [...prev, status];
                        }
                      });
                    }}
                  >
                    <Checkbox
                      checked={selectedStatuses.includes(status)}
                      className="mr-2 h-4 w-4"
                    />
                    <span className="capitalize">{status.toLowerCase()}</span>
                  </CommandItem>
                ))}
              </CommandList>
              {selectedStatuses.length > 0 && (
                <div className="border-t border-border p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      const params = new URLSearchParams(
                        searchParams.toString()
                      );
                      params.delete("status");
                      params.set("page", "1");
                      router.replace(`${pathname}?${params.toString()}`, {
                        scroll: false,
                      });
                      setSelectedStatuses([]);
                    }}
                  >
                    Clear
                    <X className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </Command>
          </PopoverContent>
        </Popover>
      </TableFilters>

      {/* Prikaz aktivnih filtera */}
      {(selectedCityIds.length > 0 || selectedStatuses.length > 0) && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {/* Oznake za lokacije */}
          {selectedCityIds.map((cityId) => (
            <Badge
              key={`city-${cityId}`}
              variant="secondary"
              className="px-2 py-1"
            >
              <span>{getCityWithCountry(cityId)}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  const remainingCityIds = selectedCityIds.filter(
                    (id) => id !== cityId
                  );
                  params.delete("cityId");
                  remainingCityIds.forEach((id) =>
                    params.append("cityId", id)
                  );
                  params.set("page", "1");
                  router.replace(`${pathname}?${params.toString()}`, {
                    scroll: false,
                  });
                  setSelectedCityIds(remainingCityIds);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}

          {/* Oznake za statuse */}
          {selectedStatuses.map((status) => (
            <Badge
              key={`status-${status}`}
              variant="secondary"
              className="px-2 py-1"
            >
              <span className="capitalize">{status.toLowerCase()}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  const remainingStatuses = selectedStatuses.filter(
                    (s) => s !== status
                  );
                  params.delete("status");
                  remainingStatuses.forEach((s) => params.append("status", s));
                  params.set("page", "1");
                  router.replace(`${pathname}?${params.toString()}`, {
                    scroll: false,
                  });
                  setSelectedStatuses(remainingStatuses);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}

          {/* Dugme za brisanje svih filtera */}
          {(selectedCityIds.length > 0 || selectedStatuses.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2"
              onClick={clearAllFilters}
            >
              Clear All
            </Button>
          )}
        </div>
      )}
    </>
  );
}