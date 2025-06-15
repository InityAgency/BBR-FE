"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/useDebounce";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { toast } from "sonner";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PhoneCode {
  id: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

interface Continent {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

interface Country {
  id: string;
  name: string;
  code: string;
  tld: string;
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
  capital: string;
  phoneCodes: PhoneCode[];
  subregion: string;
  flag: string;
  continent: Continent;
  createdAt: string;
  updatedAt: string;
}

interface City {
  id: string;
  name: string;
  countryId: string;
}

interface CountriesResponse {
  data: Country[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

interface CitiesResponse {
  data: City[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

interface ContinentsResponse {
  data: Continent[];
  statusCode: number;
  message: string;
  pagination?: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
  timestamp?: string;
  path?: string;
}

interface CountryAndCityProps {
  defaultCountryId?: string;
  defaultCityId?: string;
  onCountrySelect?: (countryId: string) => void;
  onCitySelect?: (cityId: string) => void;
}

interface AddCountryFormData {
  name: string;
  code: string;
  tld: string;
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
  capital: string;
  phoneCodes: string[];
  subregion: string;
  flag: string;
  continentId: string;
}

interface AddCityFormData {
  name: string;
  asciiName: string;
  population: string;
  timezone: string;
  xCoordinate: string;
  yCoordinate: string;
  countryId: string;
}

const countrySchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  tld: z.string().min(1, "TLD is required").max(10, "TLD must be shorter than or equal to 10 characters"),
  currencyCode: z.string().min(1, "Currency code is required").max(3, "Currency code must be shorter than or equal to 3 characters"),
  currencyName: z.string().min(1, "Currency name is required").max(50, "Currency name must be shorter than or equal to 50 characters"),
  currencySymbol: z.string().min(1, "Currency symbol is required").max(5, "Currency symbol must be shorter than or equal to 5 characters"),
  capital: z.string().min(1, "Capital is required").max(100, "Capital must be shorter than or equal to 100 characters"),
  phoneCodes: z.array(z.string().max(16, "Phone code must be shorter than or equal to 16 characters")).min(1, "At least one phone code is required"),
  subregion: z.string().min(1, "Subregion is required").max(50, "Subregion must be shorter than or equal to 50 characters"),
  flag: z.string().min(1, "Flag URL is required").max(255, "Flag URL must be shorter than or equal to 255 characters"),
  continentId: z.string().uuid("Continent ID must be a valid UUID"),
});

const citySchema = z.object({
  name: z.string().min(1, "Name is required"),
  asciiName: z.string().min(1, "ASCII name is required"),
  population: z.preprocess((val) => val === '' ? undefined : Number(val), z.number().int().min(1, "Population must be a positive number")),
  timezone: z.string().min(1, "Timezone is required"),
  xCoordinate: z.string().min(1, "X coordinate is required"),
  yCoordinate: z.string().min(1, "Y coordinate is required"),
  countryId: z.string().uuid("Country ID must be a valid UUID"),
});

export function CountryAndCity({ 
  defaultCountryId, 
  defaultCityId,
  onCountrySelect, 
  onCitySelect 
}: CountryAndCityProps) {
  const [countryOpen, setCountryOpen] = React.useState(false);
  const [cityOpen, setCityOpen] = React.useState(false);
  const [countryValue, setCountryValue] = React.useState<string>("");
  const [cityValue, setCityValue] = React.useState<string>("");
  const [selectedCountry, setSelectedCountry] = React.useState<Country | null>(null);
  const [selectedCity, setSelectedCity] = React.useState<City | null>(null);
  const [countries, setCountries] = React.useState<Country[]>([]);
  const [cities, setCities] = React.useState<City[]>([]);
  const [countrySearchQuery, setCountrySearchQuery] = React.useState("");
  const [citySearchQuery, setCitySearchQuery] = React.useState("");
  const [isCountryLoading, setIsCountryLoading] = React.useState(false);
  const [isCityLoading, setIsCityLoading] = React.useState(false);
  const [countryCurrentPage, setCountryCurrentPage] = React.useState(1);
  const [cityCurrentPage, setCityCurrentPage] = React.useState(1);
  const [hasMoreCountries, setHasMoreCountries] = React.useState(true);
  const [hasMoreCities, setHasMoreCities] = React.useState(true);
  const debouncedCountrySearch = useDebounce(countrySearchQuery, 300);
  const debouncedCitySearch = useDebounce(citySearchQuery, 300);
  const countryObserverRef = React.useRef<HTMLDivElement>(null);
  const cityObserverRef = React.useRef<HTMLDivElement>(null);
  const [isAddingCountry, setIsAddingCountry] = React.useState(false);
  const [isAddingCity, setIsAddingCity] = React.useState(false);
  const [newCountry, setNewCountry] = React.useState<AddCountryFormData>({
    name: "",
    code: "",
    tld: "",
    currencyCode: "",
    currencyName: "",
    currencySymbol: "",
    capital: "",
    phoneCodes: [""],
    subregion: "",
    flag: "",
    continentId: "",
  });
  const [newCity, setNewCity] = React.useState<AddCityFormData>({
    name: "",
    asciiName: "",
    population: '',
    timezone: "",
    xCoordinate: "",
    yCoordinate: "",
    countryId: "",
  });
  const [countryErrors, setCountryErrors] = React.useState<Partial<Record<keyof AddCountryFormData, string>>>({});
  const [cityErrors, setCityErrors] = React.useState<Partial<Record<keyof AddCityFormData, string>>>({});
  const [continents, setContinents] = React.useState<Continent[]>([]);
  const [isContinentsLoading, setIsContinentsLoading] = React.useState(false);
  
  // Tracking whether we've loaded initial data
  const [countriesLoaded, setCountriesLoaded] = React.useState(false);
  const [defaultsHandled, setDefaultsHandled] = React.useState(false);

  const fetchCountries = React.useCallback(async (query = "", page = 1, append = false) => {
    setIsCountryLoading(true);
    try {
      const url = new URL(`${API_BASE_URL}/api/${API_VERSION}/countries`);
      url.searchParams.set("limit", "20");
      url.searchParams.set("page", page.toString());
      if (query) url.searchParams.set("query", query);

      const res = await fetch(url.toString(), { credentials: "include" });
      const data: CountriesResponse = await res.json();

      if (append) {
        setCountries((prev) => [...prev, ...data.data]);
      } else {
        setCountries(data.data);
      }
      setHasMoreCountries(page < data.pagination.totalPages);
      setCountryCurrentPage(page);
      
      if (!countriesLoaded) {
        setCountriesLoaded(true);
      }
    } catch (err) {
      console.error(err);
      if (!append) setCountries([]);
    } finally {
      setIsCountryLoading(false);
    }
  }, [countriesLoaded]);

  const fetchCities = React.useCallback(async (countryId: string, query = "", page = 1, append = false) => {
    if (!countryId) return;
    
    setIsCityLoading(true);
    try {
      const url = new URL(`${API_BASE_URL}/api/${API_VERSION}/cities`);
      url.searchParams.set("countryId", countryId);
      url.searchParams.set("limit", "20");
      url.searchParams.set("page", page.toString());
      if (query) url.searchParams.set("query", query);

      const res = await fetch(url.toString(), { credentials: "include" });
      const data: CitiesResponse = await res.json();

      if (append) {
        setCities((prev) => [...prev, ...data.data]);
      } else {
        setCities(data.data);
      }
      setHasMoreCities(page < data.pagination.totalPages);
      setCityCurrentPage(page);
    } catch (err) {
      console.error(err);
      if (!append) setCities([]);
    } finally {
      setIsCityLoading(false);
    }
  }, []);

  // Load countries when popover opens or search changes
  React.useEffect(() => {
    if (countryOpen && !isCountryLoading) {
      fetchCountries(debouncedCountrySearch, 1, false);
    }
  }, [debouncedCountrySearch, countryOpen, fetchCountries]);

  // Load cities when popover opens or search changes
  React.useEffect(() => {
    if (cityOpen && countryValue && !isCityLoading) {
      fetchCities(countryValue, debouncedCitySearch, 1, false);
    }
  }, [debouncedCitySearch, cityOpen, countryValue, fetchCities]);

  // Clear search when popovers close
  React.useEffect(() => {
    if (!countryOpen) {
      setCountrySearchQuery("");
    }
  }, [countryOpen]);

  React.useEffect(() => {
    if (!cityOpen) {
      setCitySearchQuery("");
    }
  }, [cityOpen]);

  // Load initial countries when component mounts
  React.useEffect(() => {
    if (!countriesLoaded && !isCountryLoading) {
      fetchCountries("", 1, false);
    }
  }, [countriesLoaded, isCountryLoading, fetchCountries]);

  // Handle default values ONLY after countries are loaded
  React.useEffect(() => {
    const handleDefaults = async () => {
      if (!countriesLoaded || defaultsHandled) return;

      // Handle default country
      if (defaultCountryId && defaultCountryId !== countryValue) {
        console.log(`Setting default country: ${defaultCountryId}`);
        setCountryValue(defaultCountryId);
        
        // Check if country exists in loaded list
        const existingCountry = countries.find(c => c.id === defaultCountryId);
        if (existingCountry) {
          setSelectedCountry(existingCountry);
        } else {
          // Fetch country details if not in list
          try {
            const res = await fetch(`${API_BASE_URL}/api/${API_VERSION}/countries/${defaultCountryId}`, { 
              credentials: "include" 
            });
            
            if (res.ok) {
              const response = await res.json();
              const countryData = response.data || response;
              
              if (countryData && countryData.id) {
                setSelectedCountry(countryData);
                setCountries(prev => {
                  if (prev.some(c => c.id === countryData.id)) return prev;
                  return [countryData, ...prev];
                });
              }
            }
          } catch (error) {
            console.error("Error fetching default country:", error);
          }
        }
      }
      
      // Handle default city ONLY if we have a country
      if (defaultCityId && defaultCountryId) {
        console.log(`Setting default city: ${defaultCityId}`);
        setCityValue(defaultCityId);
        
        try {
          const res = await fetch(`${API_BASE_URL}/api/${API_VERSION}/cities/${defaultCityId}`, { 
            credentials: "include" 
          });
          
          if (res.ok) {
            const response = await res.json();
            const cityData = response.data || response;
            
            if (cityData && cityData.id) {
              setSelectedCity(cityData);
              setCities(prev => {
                if (prev.some(c => c.id === cityData.id)) return prev;
                return [cityData, ...prev];
              });
            }
          }
        } catch (error) {
          console.error("Error fetching default city:", error);
        }
      }
      
      setDefaultsHandled(true);
    };

    handleDefaults();
  }, [countriesLoaded, defaultsHandled, defaultCountryId, defaultCityId, countryValue, countries]);

  // Infinite scrolling for countries
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreCountries && !isCountryLoading && countryOpen) {
          fetchCountries(debouncedCountrySearch, countryCurrentPage + 1, true);
        }
      },
      { threshold: 1.0 }
    );

    if (countryObserverRef.current) observer.observe(countryObserverRef.current);
    return () => observer.disconnect();
  }, [debouncedCountrySearch, countryCurrentPage, hasMoreCountries, isCountryLoading, countryOpen, fetchCountries]);

  // Infinite scrolling for cities
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreCities && !isCityLoading && cityOpen && countryValue) {
          fetchCities(countryValue, debouncedCitySearch, cityCurrentPage + 1, true);
        }
      },
      { threshold: 1.0 }
    );

    if (cityObserverRef.current) observer.observe(cityObserverRef.current);
    return () => observer.disconnect();
  }, [debouncedCitySearch, cityCurrentPage, hasMoreCities, isCityLoading, cityOpen, countryValue, fetchCities]);

  // Load continents
  React.useEffect(() => {
    const fetchContinents = async () => {
      setIsContinentsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/${API_VERSION}/continents`, { credentials: "include" });
        const data: ContinentsResponse = await res.json();
        setContinents(data.data);
      } catch (err) {
        setContinents([]);
      } finally {
        setIsContinentsLoading(false);
      }
    };
    fetchContinents();
  }, []);

  const selectedCountryLabel = selectedCountry?.name || countries.find((c) => c.id === countryValue)?.name || "Select a country...";
  const selectedCityLabel = selectedCity?.name || cities.find((c) => c.id === cityValue)?.name || "Select a city...";

  const handleAddCountry = async () => {
    try {
      const validationResult = countrySchema.safeParse(newCountry);
      
      if (!validationResult.success) {
        const errors: Partial<Record<keyof AddCountryFormData, string>> = {};
        validationResult.error.errors.forEach((err) => {
          const path = err.path[0] as keyof AddCountryFormData;
          errors[path] = err.message;
        });
        setCountryErrors(errors);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/${API_VERSION}/countries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newCountry),
      });

      if (!res.ok) throw new Error("Failed to add country");

      const data = await res.json();
      setCountries(prev => [data, ...prev]);
      setNewCountry({
        name: "",
        code: "",
        tld: "",
        currencyCode: "",
        currencyName: "",
        currencySymbol: "",
        capital: "",
        phoneCodes: [""],
        subregion: "",
        flag: "",
        continentId: "",
      });
      setCountryErrors({});
      setIsAddingCountry(false);
      toast.success("Country added successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add country");
    }
  };

  const addPhoneCode = () => {
    setNewCountry(prev => ({
      ...prev,
      phoneCodes: [...prev.phoneCodes, ""]
    }));
  };

  const removePhoneCode = (index: number) => {
    setNewCountry(prev => ({
      ...prev,
      phoneCodes: prev.phoneCodes.filter((_, i) => i !== index)
    }));
  };

  const updatePhoneCode = (index: number, value: string) => {
    setNewCountry(prev => ({
      ...prev,
      phoneCodes: prev.phoneCodes.map((code, i) => i === index ? value : code)
    }));
  };

  const handleAddCity = async () => {
    try {
      const validationResult = citySchema.safeParse({ ...newCity, countryId: countryValue });
      if (!validationResult.success) {
        const errors: Partial<Record<keyof AddCityFormData, string>> = {};
        validationResult.error.errors.forEach((err) => {
          const path = err.path[0] as keyof AddCityFormData;
          errors[path] = err.message;
        });
        setCityErrors(errors);
        return;
      }
      const res = await fetch(`${API_BASE_URL}/api/${API_VERSION}/cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ ...newCity, countryId: countryValue, population: Number(newCity.population) }),
      });
      if (!res.ok) throw new Error("Failed to add city");
      const data = await res.json();
      setCities(prev => [data, ...prev]);
      setNewCity({
        name: "",
        asciiName: "",
        population: '',
        timezone: "",
        xCoordinate: "",
        yCoordinate: "",
        countryId: countryValue,
      });
      setCityErrors({});
      setIsAddingCity(false);
      toast.success("City added successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add city");
    }
  };

  const handleCountrySelect = (currentValue: string) => {
    const country = countries.find(c => c.id === currentValue);
    setCountryValue(currentValue);
    setSelectedCountry(country || null);
    setCityValue("");
    setSelectedCity(null);
    setCities([]);
    setCountryOpen(false);
    onCountrySelect?.(currentValue);
  };

  const handleCitySelect = (currentValue: string) => {
    const city = cities.find(c => c.id === currentValue);
    setCityValue(currentValue);
    setSelectedCity(city || null);
    setCityOpen(false);
    onCitySelect?.(currentValue);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex gap-2 w-full">
        <Popover open={countryOpen} onOpenChange={setCountryOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={countryOpen} className="w-full justify-between">
              {selectedCountryLabel}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command shouldFilter={false}>
              <CommandInput placeholder="Search country..." value={countrySearchQuery} onValueChange={setCountrySearchQuery} />
              <CommandList>
                <CommandEmpty>No countries found.</CommandEmpty>
                <CommandGroup>
                  {countries.map((country) => (
                    <CommandItem
                      key={country.id}
                      value={country.id}
                      onSelect={handleCountrySelect}
                    >
                      <div className="flex items-center gap-2">
                        <img src={country.flag} alt={country.name} className="w-4 h-3 object-cover" />
                        {country.name}
                      </div>
                      <Check className={cn("ml-auto h-4 w-4", countryValue === country.id ? "opacity-100" : "opacity-0")} />
                    </CommandItem>
                  ))}
                  {hasMoreCountries && (
                    <div ref={countryObserverRef} className="py-2 text-center text-sm text-muted-foreground">
                      {isCountryLoading && "Loading more..."}
                    </div>
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex gap-2 w-full">
        <Popover open={cityOpen} onOpenChange={setCityOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              role="combobox" 
              aria-expanded={cityOpen} 
              className="w-full justify-between"
              disabled={!countryValue}
              aria-disabled={!countryValue}
              title={!countryValue ? "Select a country first" : "Add new city"}
            >
              {selectedCityLabel}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command shouldFilter={false}>
              <CommandInput placeholder="Search city..." value={citySearchQuery} onValueChange={setCitySearchQuery} />
              <CommandList>
                <CommandEmpty>No cities found.</CommandEmpty>
                <CommandGroup>
                  {cities.map((city, index) => (
                    <CommandItem
                      key={city.id || `${city.name}-${index}`}
                      value={city.id}
                      onSelect={handleCitySelect}
                    >
                      {city.name}
                      <Check className={cn("ml-auto h-4 w-4", cityValue === city.id ? "opacity-100" : "opacity-0")} />
                    </CommandItem>
                  ))}
                  {hasMoreCities && (
                    <div ref={cityObserverRef} className="py-2 text-center text-sm text-muted-foreground">
                      {isCityLoading && "Loading more..."}
                    </div>
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}