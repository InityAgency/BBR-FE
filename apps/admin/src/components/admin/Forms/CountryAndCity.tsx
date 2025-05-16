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
    } catch (err) {
      console.error(err);
      if (!append) setCountries([]);
    } finally {
      setIsCountryLoading(false);
    }
  }, []);

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

  React.useEffect(() => {
    if (countryOpen) {
      fetchCountries(debouncedCountrySearch, 1, false);
    }
  }, [debouncedCountrySearch, countryOpen, fetchCountries]);

  React.useEffect(() => {
    if (cityOpen && countryValue) {
      fetchCities(countryValue, debouncedCitySearch, 1, false);
    }
  }, [debouncedCitySearch, cityOpen, countryValue, fetchCities]);

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

  React.useEffect(() => {
    const initializeWithDefaults = async () => {
      // Inicijalizacija države
      if (defaultCountryId && defaultCountryId !== countryValue) {
        setCountryValue(defaultCountryId);
        
        // Pronađi državu u listi ili je dohvati sa API-ja
        const existingCountry = countries.find(c => c.id === defaultCountryId);
        if (existingCountry) {
          setSelectedCountry(existingCountry);
        } else {
          try {
            console.log(`Fetching country with ID: ${defaultCountryId}`);
            const res = await fetch(`${API_BASE_URL}/api/${API_VERSION}/countries/${defaultCountryId}`, { 
              credentials: "include" 
            });
            
            if (!res.ok) throw new Error("Failed to fetch country");
            
            const response = await res.json();
            const countryData = response.data || response;
            
            if (countryData && countryData.id) {
              console.log("Found country data:", countryData);
              setSelectedCountry(countryData);
              setCountries(prev => {
                if (prev.some(c => c.id === countryData.id)) return prev;
                return [...prev, countryData];
              });
            }
          } catch (error) {
            console.error("Error fetching country:", error);
          }
        }
      }
      
      // Inicijalizacija grada (samo ako imamo državu)
      if (defaultCityId && defaultCountryId) {
        setCityValue(defaultCityId);
        
        // Pronađi grad u listi ili ga dohvati sa API-ja
        const existingCity = cities.find(c => c.id === defaultCityId);
        if (existingCity) {
          setSelectedCity(existingCity);
        } else {
          try {
            console.log(`Fetching city with ID: ${defaultCityId}`);
            const res = await fetch(`${API_BASE_URL}/api/${API_VERSION}/cities/${defaultCityId}`, { 
              credentials: "include" 
            });
            
            if (!res.ok) throw new Error("Failed to fetch city");
            
            const response = await res.json();
            const cityData = response.data || response;
            
            if (cityData && cityData.id) {
              console.log("Found city data:", cityData);
              setSelectedCity(cityData);
              setCities(prev => {
                if (prev.some(c => c.id === cityData.id)) return prev;
                return [...prev, cityData];
              });
            }
          } catch (error) {
            console.error("Error fetching city:", error);
          }
        }
        
        // Također učitaj i sve gradove za ovu državu
        if (cities.length === 0 || !cities.some(c => c.countryId === defaultCountryId)) {
          fetchCities(defaultCountryId, "", 1, false);
        }
      }
    };
    
    initializeWithDefaults();
  }, [defaultCountryId, defaultCityId, countryValue, cityValue, countries, cities, fetchCities]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreCountries && !isCountryLoading) {
          fetchCountries(debouncedCountrySearch, countryCurrentPage + 1, true);
        }
      },
      { threshold: 1.0 }
    );

    if (countryObserverRef.current) observer.observe(countryObserverRef.current);
    return () => observer.disconnect();
  }, [debouncedCountrySearch, countryCurrentPage, hasMoreCountries, isCountryLoading, fetchCountries]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreCities && !isCityLoading && countryValue) {
          fetchCities(countryValue, debouncedCitySearch, cityCurrentPage + 1, true);
        }
      },
      { threshold: 1.0 }
    );

    if (cityObserverRef.current) observer.observe(cityObserverRef.current);
    return () => observer.disconnect();
  }, [debouncedCitySearch, cityCurrentPage, hasMoreCities, isCityLoading, countryValue, fetchCities]);

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
      setCountries(prev => [...prev, data]);
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
      setCities(prev => [...prev, data]);
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

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <div className="flex gap-2">
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
                      onSelect={(currentValue) => {
                        setCountryValue(currentValue);
                        setSelectedCountry(country);
                        setCityValue("");
                        setSelectedCity(null);
                        setCities([]);
                        setCountryOpen(false);
                        onCountrySelect?.(currentValue);
                      }}
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

        <Dialog open={isAddingCountry} onOpenChange={setIsAddingCountry}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Country</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="countryName">Country Name</Label>
                  <Input
                    id="countryName"
                    value={newCountry.name}
                    onChange={(e) => setNewCountry(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter country name"
                  />
                  {countryErrors.name && <p className="text-sm text-red-500">{countryErrors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="countryCode">Country Code</Label>
                  <Input
                    id="countryCode"
                    value={newCountry.code}
                    onChange={(e) => setNewCountry(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="Enter country code (e.g. US)"
                  />
                  {countryErrors.code && <p className="text-sm text-red-500">{countryErrors.code}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tld">TLD</Label>
                  <Input
                    id="tld"
                    value={newCountry.tld}
                    onChange={(e) => setNewCountry(prev => ({ ...prev, tld: e.target.value }))}
                    placeholder="Enter TLD (e.g. .us)"
                  />
                  {countryErrors.tld && <p className="text-sm text-red-500">{countryErrors.tld}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currencyCode">Currency Code</Label>
                  <Input
                    id="currencyCode"
                    value={newCountry.currencyCode}
                    onChange={(e) => setNewCountry(prev => ({ ...prev, currencyCode: e.target.value }))}
                    placeholder="Enter currency code (e.g. USD)"
                  />
                  {countryErrors.currencyCode && <p className="text-sm text-red-500">{countryErrors.currencyCode}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currencyName">Currency Name</Label>
                  <Input
                    id="currencyName"
                    value={newCountry.currencyName}
                    onChange={(e) => setNewCountry(prev => ({ ...prev, currencyName: e.target.value }))}
                    placeholder="Enter currency name"
                  />
                  {countryErrors.currencyName && <p className="text-sm text-red-500">{countryErrors.currencyName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currencySymbol">Currency Symbol</Label>
                  <Input
                    id="currencySymbol"
                    value={newCountry.currencySymbol}
                    onChange={(e) => setNewCountry(prev => ({ ...prev, currencySymbol: e.target.value }))}
                    placeholder="Enter currency symbol"
                  />
                  {countryErrors.currencySymbol && <p className="text-sm text-red-500">{countryErrors.currencySymbol}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capital">Capital</Label>
                  <Input
                    id="capital"
                    value={newCountry.capital}
                    onChange={(e) => setNewCountry(prev => ({ ...prev, capital: e.target.value }))}
                    placeholder="Enter capital city"
                  />
                  {countryErrors.capital && <p className="text-sm text-red-500">{countryErrors.capital}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subregion">Subregion</Label>
                  <Input
                    id="subregion"
                    value={newCountry.subregion}
                    onChange={(e) => setNewCountry(prev => ({ ...prev, subregion: e.target.value }))}
                    placeholder="Enter subregion"
                  />
                  {countryErrors.subregion && <p className="text-sm text-red-500">{countryErrors.subregion}</p>}
                </div>

                <div className="space-y-2 w-full col-span-2">
                  <Label htmlFor="flag">Flag URL</Label>
                  <Input
                    id="flag"
                    className="w-full"
                    value={newCountry.flag}
                    onChange={(e) => setNewCountry(prev => ({ ...prev, flag: e.target.value }))}
                    placeholder="Enter flag URL"
                  />
                  <p className="text-xs text-muted-foreground">Example: <span className="text-white">https://flagcdn.com/w320/no.png</span> or find a flag on <a href='https://flagcdn.com' target='_blank' rel='noopener noreferrer' className='underline text-white'>flagcdn.com</a></p>
                  {countryErrors.flag && <p className="text-sm text-red-500">{countryErrors.flag}</p>}
                </div>

                <div className="space-y-2 w-full col-span-2">
                  <Label htmlFor="continentId">Continent</Label>
                  <Select
                    value={newCountry.continentId}
                    onValueChange={value => setNewCountry(prev => ({ ...prev, continentId: value }))}
                    disabled={isContinentsLoading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select continent" />
                    </SelectTrigger>
                    <SelectContent>
                      {continents.map(cont => (
                        <SelectItem key={cont.id} value={cont.id}>{cont.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {countryErrors.continentId && <p className="text-sm text-red-500">{countryErrors.continentId}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Phone Codes</Label>
                {newCountry.phoneCodes.map((code, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={code}
                      onChange={(e) => updatePhoneCode(index, e.target.value)}
                      placeholder="Enter phone code (e.g. +1)"
                    />
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removePhoneCode(index)}
                      >
                        <span className="sr-only">Remove phone code</span>
                        ×
                      </Button>
                    )}
                  </div>
                ))}
                {countryErrors.phoneCodes && <p className="text-sm text-red-500">{countryErrors.phoneCodes}</p>}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPhoneCode}
                  className="w-full"
                >
                  Add Phone Code
                </Button>
              </div>

              <Button onClick={handleAddCountry} className="w-full">
                Add Country
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2">
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
                      onSelect={(currentValue) => {
                        setCityValue(currentValue);
                        setSelectedCity(city);
                        setCityOpen(false);
                        onCitySelect?.(currentValue);
                      }}
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

        <Dialog open={isAddingCity} onOpenChange={setIsAddingCity}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              disabled={!countryValue}
              aria-disabled={!countryValue}
              title={!countryValue ? "Select a country first" : "Add new city"}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New City</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cityName">City Name</Label>
                  <Input
                    id="cityName"
                    value={newCity.name}
                    onChange={(e) => setNewCity(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter city name"
                  />
                  {cityErrors.name && <p className="text-sm text-red-500">{cityErrors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="asciiName">ASCII Name</Label>
                  <Input
                    id="asciiName"
                    value={newCity.asciiName}
                    onChange={(e) => setNewCity(prev => ({ ...prev, asciiName: e.target.value }))}
                    placeholder="Enter ASCII name"
                  />
                  {cityErrors.asciiName && <p className="text-sm text-red-500">{cityErrors.asciiName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="population">Population</Label>
                  <Input
                    id="population"
                    type="number"
                    value={newCity.population}
                    onChange={(e) => setNewCity(prev => ({ ...prev, population: e.target.value }))}
                    placeholder="Enter population"
                  />
                  {cityErrors.population && <p className="text-sm text-red-500">{cityErrors.population}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={newCity.timezone}
                    onChange={(e) => setNewCity(prev => ({ ...prev, timezone: e.target.value }))}
                    placeholder="Enter timezone (e.g. America/New_York)"
                  />
                  {cityErrors.timezone && <p className="text-sm text-red-500">{cityErrors.timezone}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="xCoordinate">X Coordinate (latitude)</Label>
                  <Input
                    id="xCoordinate"
                    value={newCity.xCoordinate}
                    onChange={(e) => setNewCity(prev => ({ ...prev, xCoordinate: e.target.value }))}
                    placeholder="Enter latitude (e.g. 40.7128)"
                  />
                  {cityErrors.xCoordinate && <p className="text-sm text-red-500">{cityErrors.xCoordinate}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yCoordinate">Y Coordinate (longitude)</Label>
                  <Input
                    id="yCoordinate"
                    value={newCity.yCoordinate}
                    onChange={(e) => setNewCity(prev => ({ ...prev, yCoordinate: e.target.value }))}
                    placeholder="Enter longitude (e.g. -74.0060)"
                  />
                  {cityErrors.yCoordinate && <p className="text-sm text-red-500">{cityErrors.yCoordinate}</p>}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">You can find city info on <a href='https://www.geonames.org/' target='_blank' rel='noopener noreferrer' className='underline text-white'>GeoNames</a>, <a href='https://en.wikipedia.org/wiki/List_of_cities_proper_by_population' target='_blank' rel='noopener noreferrer' className='underline text-white'>Wikipedia</a> or <a href='https://www.google.com/maps' target='_blank' rel='noopener noreferrer' className='underline text-white'>Google Maps</a>.</p>
              <Button 
                onClick={handleAddCity} 
                className="w-full"
                disabled={!newCity.name}
              >
                Add City
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}