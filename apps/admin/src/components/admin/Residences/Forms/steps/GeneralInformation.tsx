import { Form, FormItem, FormLabel, FormField, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import LocationSelector from "@/components/admin/LocationSelector";
import { useEffect, useState, useRef, useCallback, RefObject, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import Image from "next/image";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";

// Form schema za validaciju
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  websiteUrl: z.string().url("Enter a valid URL").or(z.string().length(0)),
  description: z.string().min(10, "Description must be at least 10 characters"),
  brandId: z.string().min(1, "Select a brand"),
  subtitle: z.string().min(5, "Subtitle must be at least 5 characters"),
  budgetStartRange: z.coerce.number().min(0, "Enter a valid starting budget"),
  budgetEndRange: z.coerce.number().min(0, "Enter a valid ending budget"),
  countryId: z.string().min(1, "Select a country"),
  cityId: z.string().min(1, "Select a city"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  latitude: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= -90 && num <= 90;
  }, "Latitude must be between -90 and 90"),
  longitude: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= -180 && num <= 180;
  }, "Longitude must be between -180 and 180"),
}).refine(data => data.budgetEndRange > data.budgetStartRange, {
  message: "End budget must be greater than start budget",
  path: ["budgetEndRange"]
});

// Tipovi podataka
interface EntityType {
  id: string;
  name: string;
}

interface EntityState<T extends EntityType> {
  items: T[];
  selected: T | null;
  searchValue: string;
  isLoading: boolean;
  currentPage: number;
  hasMore: boolean;
  searchInputRef: React.RefObject<HTMLInputElement>;
  requestInProgress: boolean; // Pratimo da li je zahtev u toku
  requestKey: string | null; // Ključ za praćenje aktivnog zahteva
}

interface BrandType extends EntityType {
  description?: string;
  status: string;
  brandType?: {
    id: string;
    name: string;
  };
  logo?: {
    id: string;
    originalFileName: string;
  };
}

interface CountryType extends EntityType {
  code: string;
}

interface CityType extends EntityType {
  countryId: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

interface GeneralInformationProps {
  formData?: any;
  updateFormData?: (data: any) => void;
  residenceData?: {
    country?: CountryType;
    city?: CityType;
    brand?: BrandType;
  };
}

// Konfiguracija keširanja
const CACHE_CONFIG = {
  BRANDS: 'brands-cache',
  COUNTRIES: 'countries-cache',
  CITIES: 'cities-cache',
  EXPIRY: 24 * 60 * 60 * 1000, // 24 sata
};

// Globalni keš za trenutnu sesiju (ne perzistira se)
const inMemoryCache: Record<string, { data: any; timestamp: number }> = {};

// Pomoćne funkcije za rad sa kešom
const getCacheKey = (prefix: string, search: string, queryParams: Record<string, string> = {}, page: number = 1) => {
  const queryString = new URLSearchParams(queryParams).toString();
  return `${prefix}-${search}-${queryString}-${page}`;
};

export default function GeneralInformation({ formData, updateFormData, residenceData }: GeneralInformationProps) {
  // Inicijalizacija forme
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: formData?.name || "",
      websiteUrl: formData?.websiteUrl || "",
      description: formData?.description || "",
      brandId: formData?.brandId || "",
      subtitle: formData?.subtitle || "",
      budgetStartRange: formData?.budgetStartRange || 0,
      budgetEndRange: formData?.budgetEndRange || 0,
      countryId: formData?.countryId || "",
      cityId: formData?.cityId || "",
      address: formData?.address || "",
      latitude: formData?.latitude?.toString() || "0",
      longitude: formData?.longitude?.toString() || "0",
    },
  });

  // Referenca za praćenje inicijalizacije
  const isInitialized = useRef(false);
  const pendingRequests = useRef<Record<string, Promise<any>>>({});

  // Inicijalizacija stanja za brendove
  const [brandState, setBrandState] = useState<EntityState<BrandType>>({
    items: [],
    selected: null,
    searchValue: "",
    isLoading: false,
    currentPage: 1,
    hasMore: true,
    searchInputRef: useRef<HTMLInputElement>(null) as RefObject<HTMLInputElement>,
    requestInProgress: false,
    requestKey: null
  });

  // Inicijalizacija stanja za države
  const [countryState, setCountryState] = useState<EntityState<CountryType>>({
    items: [],
    selected: null,
    searchValue: "",
    isLoading: false,
    currentPage: 1,
    hasMore: true,
    searchInputRef: useRef<HTMLInputElement>(null) as RefObject<HTMLInputElement>,
    requestInProgress: false,
    requestKey: null
  });

  // Inicijalizacija stanja za gradove
  const [cityState, setCityState] = useState<EntityState<CityType>>({
    items: [],
    selected: null,
    searchValue: "",
    isLoading: false,
    currentPage: 1,
    hasMore: true,
    searchInputRef: useRef<HTMLInputElement>(null) as RefObject<HTMLInputElement>,
    requestInProgress: false,
    requestKey: null
  });

  // Debounced pretraga
  const debouncedBrandSearch = useDebounce(brandState.searchValue, 500);
  const debouncedCountrySearch = useDebounce(countryState.searchValue, 500);
  const debouncedCitySearch = useDebounce(cityState.searchValue, 500);

  // ID odabrane države iz forme
  const selectedCountryId = form.watch("countryId");

  // ===== Funkcije za keširanje =====
  const getCachedData = (key: string) => {
    // Prvo proveravamo in-memory keš
    if (inMemoryCache[key] && inMemoryCache[key].timestamp + CACHE_CONFIG.EXPIRY > Date.now()) {
      return inMemoryCache[key].data;
    }
    
    // Ako nema u in-memory kešu, proveravamo localStorage
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_CONFIG.EXPIRY) {
          // Sačuvaj i u in-memory kešu za brži pristup kasnije
          inMemoryCache[key] = { data, timestamp };
          return data;
        }
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error("Error retrieving from cache:", error);
      localStorage.removeItem(key);
    }
    return null;
  };

  const setCachedData = (key: string, data: any) => {
    // Sačuvaj u in-memory kešu
    inMemoryCache[key] = { data, timestamp: Date.now() };
    
    // Sačuvaj i u localStorage
    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error("Error setting cache:", error);
    }
  };

  // ===== Generička funkcija za dohvatanje entiteta (može se koristiti za brendove, države i gradove) =====
  const fetchEntities = useCallback(async <T extends EntityType>({
    entityType,
    page = 1,
    search = "",
    reset = false,
    endpoint,
    queryParams = {},
    selectedEntity,
    setState,
    cacheKeyPrefix,
  }: {
    entityType: string,
    page?: number,
    search?: string,
    reset?: boolean,
    endpoint: string,
    queryParams?: Record<string, string>,
    selectedEntity: T | null,
    setState: React.Dispatch<React.SetStateAction<EntityState<T>>>,
    cacheKeyPrefix: string,
  }) => {
    // Generišemo ključ za zahtev
    const queryString = new URLSearchParams(queryParams).toString();
    const cacheKey = `${cacheKeyPrefix}-${search}-${queryString}-${page}`;

    // Provera da li se zahtev već izvršava
    setState(prev => {
      if (prev.requestInProgress && prev.requestKey === cacheKey) {
        // Već postoji isti zahtev koji se izvršava
        return prev;
      }
      return { ...prev, requestInProgress: true, requestKey: cacheKey };
    });

    // Provera da li imamo zahtev u toku
    if (await pendingRequests.current[cacheKey]) {
      try {
        // Čekamo da se zahtev završi i koristimo njegove rezultate
        await pendingRequests.current[cacheKey];
        
        // Nakon što se zahtev završi, resetujemo stanje
        setState(prev => ({ ...prev, requestInProgress: false, requestKey: null }));
        return;
      } catch (error) {
        console.error(`Error waiting for pending ${entityType} request:`, error);
      }
    }

    // Pokušaj dohvatiti iz keša ako nije zatražen reset
    if (!reset) {
      const cachedEntities = getCachedData(cacheKey);

      if (cachedEntities) {
        setState(prevState => ({
          ...prevState,
          items: reset || page === 1 ? cachedEntities : [...prevState.items, ...cachedEntities],
          currentPage: page,
          requestInProgress: false,
          requestKey: null,
          isLoading: false
        }));
        return;
      }
    }

    // Napravimo novi zahtev
    setState(prevState => ({ ...prevState, isLoading: true }));

    // Kreiramo promise za ovaj zahtev i čuvamo ga
    const requestPromise = (async () => {
      try {
        // Pripremi URL sa svim parametrima
        let url = `${API_BASE_URL}${endpoint}?page=${page}&limit=20`;

        // Dodaj search ako postoji
        if (search && search.trim() !== "") {
          url += `&query=${encodeURIComponent(search)}`;
        }

        // Dodaj dodatne parametre za query
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value) url += `&${key}=${value}`;
        });

        // Dohvati podatke
        const response = await fetch(url, {
          credentials: "include",
          // Dodajemo kontrolu keša da izbegnemo dupliranje zahteva
          cache: "no-store" 
        });

        if (!response.ok) throw new Error(`Error fetching ${entityType}: ${response.status}`);

        const data: PaginatedResponse<T> = await response.json();

        // Pripremi nove entitete i ažuriraj stanje
        setState(prevState => {
          // Pripremi nove entitete
          const newEntities = data.data;
          let finalEntities: T[];

          if (reset || page === 1) {
            // Ako je odabrani entitet i nije u novim entitetima, dodaj ga na početak
            if (selectedEntity && !newEntities.some(e => e.id === selectedEntity.id)) {
              finalEntities = [selectedEntity, ...newEntities];
            } else {
              finalEntities = newEntities;
            }
          } else {
            // Dodaj nove entitete postojećim, izbegavajući duplikate
            const existingIds = new Set(prevState.items.map(e => e.id));
            const uniqueNewEntities = newEntities.filter(e => !existingIds.has(e.id));
            finalEntities = [...prevState.items, ...uniqueNewEntities];
          }

          // Keširaj rezultate
          setCachedData(cacheKey, finalEntities);

          // Vrati ažurirano stanje
          return {
            ...prevState,
            items: finalEntities,
            isLoading: false,
            requestInProgress: false,
            requestKey: null,
            currentPage: page,
            hasMore: data.pagination.page < data.pagination.totalPages,
          };
        });

        return data;
      } catch (error) {
        console.error(`Error fetching ${entityType}:`, error);

        // U slučaju greške, postavi već odabrani entitet ako postoji
        setState(prevState => ({
          ...prevState,
          items: selectedEntity ? [selectedEntity] : [],
          isLoading: false,
          requestInProgress: false,
          requestKey: null
        }));

        throw error;
      } finally {
        // Obriši iz aktivnih zahteva nakon završetka
        delete pendingRequests.current[cacheKey];
      }
    })();

    // Sačuvaj promise u listu aktivnih zahteva
    pendingRequests.current[cacheKey] = requestPromise;

    await requestPromise;
  }, []);

  // ===== Specijalizovane funkcije za dohvatanje specifičnih entiteta =====
  // Dohvati brendove
  const fetchBrands = useCallback((page = 1, search = "", reset = false) => {
    // Ako imamo isti zahtev u toku, ne radimo ništa
    if (brandState.requestInProgress && 
        brandState.requestKey === getCacheKey(CACHE_CONFIG.BRANDS, search, {}, page)) {
      return Promise.resolve();
    }

    return fetchEntities<BrandType>({
      entityType: 'brands',
      page,
      search,
      reset,
      endpoint: `/api/${API_VERSION}/brands`,
      queryParams: {},
      selectedEntity: brandState.selected,
      setState: setBrandState,
      cacheKeyPrefix: CACHE_CONFIG.BRANDS,
    });
  }, [brandState.selected, brandState.requestInProgress, brandState.requestKey, fetchEntities]);

  // Dohvati države
  const fetchCountries = useCallback((page = 1, search = "", reset = false) => {
    // Ako imamo isti zahtev u toku, ne radimo ništa
    if (countryState.requestInProgress && 
        countryState.requestKey === getCacheKey(CACHE_CONFIG.COUNTRIES, search, {}, page)) {
      return Promise.resolve();
    }

    return fetchEntities<CountryType>({
      entityType: 'countries',
      page,
      search,
      reset,
      endpoint: `/api/v1/countries`,
      queryParams: {},
      selectedEntity: countryState.selected,
      setState: setCountryState,
      cacheKeyPrefix: CACHE_CONFIG.COUNTRIES,
    });
  }, [countryState.selected, countryState.requestInProgress, countryState.requestKey, fetchEntities]);

  // Dohvati gradove za odabranu državu
  const fetchCities = useCallback((page = 1, search = "", reset = false) => {
    if (!selectedCountryId) {
      setCityState(prev => ({ ...prev, items: [], isLoading: false }));
      return Promise.resolve();
    }
  
    // Ako imamo isti zahtev u toku, ne radimo ništa
    if (cityState.requestInProgress && 
        cityState.requestKey === getCacheKey(CACHE_CONFIG.CITIES, search, { countryId: selectedCountryId }, page)) {
      return Promise.resolve();
    }
  
    return fetchEntities<CityType>({
      entityType: 'cities',
      page,
      search,
      reset,
      endpoint: `/api/v1/cities`,
      queryParams: { countryId: selectedCountryId },
      selectedEntity: cityState.selected && cityState.selected.countryId === selectedCountryId
        ? cityState.selected
        : null,
      setState: setCityState,
      cacheKeyPrefix: CACHE_CONFIG.CITIES,
    });
  }, [selectedCountryId, cityState.selected, cityState.requestInProgress, cityState.requestKey, fetchEntities]);
  
  // ===== Dohvati pojedinačni brend =====
  const fetchSingleBrand = useCallback(async (brandId: string) => {
    if (!brandId) return;

    const cacheKey = `${CACHE_CONFIG.BRANDS}-single-${brandId}`;
    
    // Provera da li je zahtev već u toku
    if (await pendingRequests.current[cacheKey]) {
      try {
        await pendingRequests.current[cacheKey];
        return;
      } catch (error) {
        console.error("Error waiting for pending brand request:", error);
      }
    }

    const cachedBrand = getCachedData(cacheKey);
    if (cachedBrand) {
      setBrandState(prev => ({
        ...prev,
        selected: cachedBrand,
        items: prev.items.some(b => b.id === cachedBrand.id)
          ? prev.items
          : [cachedBrand, ...prev.items]
      }));
      form.setValue("brandId", cachedBrand.id);
      return;
    }

    // Kreiraj promise za ovaj zahtev
    const requestPromise = (async () => {
      try {
        setBrandState(prev => ({ ...prev, isLoading: true }));

        const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/brands/${brandId}`, {
          credentials: "include",
          cache: "no-store"
        });

        if (!response.ok) throw new Error(`Error fetching brand: ${response.status}`);

        const data = await response.json();
        const brand = data.data;

        setBrandState(prev => ({
          ...prev,
          selected: brand,
          items: prev.items.some(b => b.id === brand.id)
            ? prev.items
            : [brand, ...prev.items],
          isLoading: false
        }));

        setCachedData(cacheKey, brand);
        form.setValue("brandId", brand.id);
        return data;
      } catch (error) {
        console.error("Error fetching single brand:", error);
        setBrandState(prev => ({ ...prev, isLoading: false }));
        throw error;
      } finally {
        delete pendingRequests.current[cacheKey];
      }
    })();

    pendingRequests.current[cacheKey] = requestPromise;
    await requestPromise;
  }, [form]);

  // ===== Inicijalizacija podataka forme =====
// 1. Prvo poboljšajmo inicijalizaciju podataka za grad u useEffect-u

// Zameni postojeći kod u useEffect-u za inicijalizaciju forme
  useEffect(() => {
    const initializeFormData = async () => {
      if (isInitialized.current) return;
      isInitialized.current = true;

      // Paralelno dohvatamo brendove i države
      await Promise.all([
        fetchBrands(1, "", true),
        fetchCountries(1, "", true)
      ]);

      // Ako imamo podatke o rezidenciji
      if (residenceData) {
        // Postavi brend
        if (residenceData.brand) {
          const brand = residenceData.brand as BrandType;
          setBrandState(prev => ({
            ...prev,
            selected: brand,
            items: prev.items.some(b => b.id === brand.id)
              ? prev.items
              : [brand, ...prev.items]
          }));
          form.setValue("brandId", brand.id);
        }

        // Postavi državu
        if (residenceData.country) {
          const country = residenceData.country as CountryType;
          setCountryState(prev => ({
            ...prev,
            selected: country,
            items: prev.items.some(c => c.id === country.id)
              ? prev.items
              : [country, ...prev.items]
          }));
          form.setValue("countryId", country.id);

          // Obeležićemo da smo već učitali državu kako bi se izbeglo duplo učitavanje gradova
          previousCountryId.current = country.id;

          // Ako imamo grad, dodajemo ga odmah u listu i postavljamo ga kao odabrani
          if (residenceData.city) {
            const city = residenceData.city as CityType;
            setCityState(prev => ({
              ...prev,
              selected: city,
              items: [city], // Dodajemo samo grad koji je već odabran
              searchValue: "",
              hasMore: true,
              currentPage: 1
            }));
            form.setValue("cityId", city.id);
            
            // Odmah nakon toga dohvatimo sve gradove za ovu državu
            // sa malim odlaganjem da se UI izrenderuje
            setTimeout(() => {
              fetchCities(1, "", true);
            }, 100);
          }
        }
      }
    };

    initializeFormData();
  }, [fetchBrands, fetchCountries, fetchCities, form, residenceData]);

  // ===== Obrada promjene države =====
  const previousCountryId = useRef<string | null>(null);
  
  useEffect(() => {
    // Preskačemo ako je isti ID kao ranije (da izbegnemo duplo izvršavanje)
    if (previousCountryId.current === selectedCountryId) return;
    previousCountryId.current = selectedCountryId;
    
    const handleCountryChange = async () => {
      // Resetiraj grad ako je promijenjena država
      if (selectedCountryId) {
        // Ako odabrani grad ne pripada novoj državi, resetiraj ga
        if (cityState.selected && cityState.selected.countryId !== selectedCountryId) {
          setCityState(prev => ({
            ...prev,
            selected: null,
            searchValue: "",
            currentPage: 1
          }));
          form.setValue("cityId", "");
        }

        // Dohvati gradove za odabranu državu
        await fetchCities(1, "", true);
      } else {
        // Izbriši gradove ako nije odabrana država
        setCityState(prev => ({
          ...prev,
          items: [],
          selected: null,
          searchValue: "",
          currentPage: 1
        }));
        form.setValue("cityId", "");
      }
    };

    handleCountryChange();
  }, [selectedCountryId, cityState.selected, fetchCities, form]);

  // ===== Obrada promjene pretrage sa deduplikacijom =====
  // Country search
  const previousCountrySearch = useRef(debouncedCountrySearch);
  useEffect(() => {
    if (debouncedCountrySearch === previousCountrySearch.current) return;
    previousCountrySearch.current = debouncedCountrySearch;
    
    setCountryState(prev => ({ ...prev, currentPage: 1 }));
    fetchCountries(1, debouncedCountrySearch, true);
  }, [debouncedCountrySearch, fetchCountries]);

  // Brand search
  const previousBrandSearch = useRef(debouncedBrandSearch);
  useEffect(() => {
    if (debouncedBrandSearch === previousBrandSearch.current) return;
    previousBrandSearch.current = debouncedBrandSearch;
    
    setBrandState(prev => ({ ...prev, currentPage: 1 }));
    fetchBrands(1, debouncedBrandSearch, true);
  }, [debouncedBrandSearch, fetchBrands]);

  // City search
  const previousCitySearch = useRef(debouncedCitySearch);
  useEffect(() => {
    if (debouncedCitySearch === previousCitySearch.current || !selectedCountryId) return;
    previousCitySearch.current = debouncedCitySearch;
    
    setCityState(prev => ({ ...prev, currentPage: 1 }));
    fetchCities(1, debouncedCitySearch, true);
  }, [debouncedCitySearch, selectedCountryId, fetchCities]);

  // ===== Generičke handler funkcije =====
  // Handler za scroll (infinite loading) sa zaključavanjem
  const handleScroll = <T extends EntityType>(
    e: React.UIEvent<HTMLDivElement>,
    state: EntityState<T>,
    setState: React.Dispatch<React.SetStateAction<EntityState<T>>>,
    fetchFunction: (page: number, search: string, reset?: boolean) => Promise<void>,
    search: string
  ) => {
    const target = e.currentTarget;
    if (
      target.scrollHeight - target.scrollTop <= target.clientHeight + 20 &&
      !state.isLoading &&
      !state.requestInProgress &&
      state.hasMore
    ) {
      const nextPage = state.currentPage + 1;
      setState(prev => ({ ...prev, currentPage: nextPage }));
      fetchFunction(nextPage, search);
    }
  };

  // Handler za promjenu vrijednosti pretrage
  const handleSearchChange = <T extends EntityType>(
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<EntityState<T>>>
  ) => {
    setState(prev => ({
      ...prev,
      searchValue: e.target.value,
    }));
  };

  // Handler za otvaranje/zatvaranje odabira
  const handleSelectOpen = <T extends EntityType>(
    open: boolean,
    state: EntityState<T>
  ) => {
    if (open && state.searchInputRef.current) {
      setTimeout(() => {
        state.searchInputRef.current?.focus();
      }, 100);
    }
  };

  // ===== Handler funkcije za specifične entitete =====
  // Brendovi
  const handleBrandScroll = (e: React.UIEvent<HTMLDivElement>) =>
    handleScroll(e, brandState, setBrandState, fetchBrands, debouncedBrandSearch);

  const handleBrandSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleSearchChange(e, setBrandState);

  const handleBrandSelectOpen = (open: boolean) =>
    handleSelectOpen(open, brandState);

  // Države
  const handleCountryScroll = (e: React.UIEvent<HTMLDivElement>) =>
    handleScroll(e, countryState, setCountryState, fetchCountries, debouncedCountrySearch);

  const handleCountrySearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleSearchChange(e, setCountryState);

  const handleCountrySelectOpen = (open: boolean) =>
    handleSelectOpen(open, countryState);

  // Gradovi
  const handleCityScroll = (e: React.UIEvent<HTMLDivElement>) =>
    handleScroll(e, cityState, setCityState, fetchCities, debouncedCitySearch);

  const handleCitySearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleSearchChange(e, setCityState);

  const handleCitySelectOpen = (open: boolean) =>
    handleSelectOpen(open, cityState);

  // Handler za odabir grada
  const handleCitySelect = (value: string) => {
    const city = cityState.items.find(c => c.id === value);
    if (city) {
      setCityState(prev => ({ 
        ...prev, 
        selected: city,
        // Osiguravamo da je grad u items listi
        items: prev.items.some(c => c.id === city.id) 
          ? prev.items 
          : [city, ...prev.items]
      }));
      form.setValue("cityId", city.id);
    }
  };

  // ===== Ažuriranje roditeljske komponente s promjenama forme =====
  useEffect(() => {
    if (updateFormData) {
      const subscription = form.watch((value) => updateFormData(value));
      return () => subscription.unsubscribe();
    }
  }, [form, updateFormData]);

  // Broj učitanih gradova
  const cityCount = useMemo(() => cityState.items.length, [cityState.items]);
  
  // Broj učitanih država
  const countryCount = useMemo(() => countryState.items.length, [countryState.items]);
  
  // Broj učitanih brendova
  const brandCount = useMemo(() => brandState.items.length, [brandState.items]);

  return (
    <div>
      <Form {...form}>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h1 className="text-xl font-semibold mb-4">General Information</h1>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>
                      Residence name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brandId"
                render={({ field }) => (
                  <FormItem className="mb-4 w-full">
                    <FormLabel>
                      Associated brand <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      onOpenChange={handleBrandSelectOpen}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a brand" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <div className="px-2 py-1 sticky top-0 bg-background z-10">
                          <Input
                            ref={brandState.searchInputRef}
                            placeholder="Search brands..."
                            value={brandState.searchValue}
                            onChange={handleBrandSearchChange}
                            className="h-8"
                            onKeyDown={(e) => e.stopPropagation()}
                          />
                        </div>
                        {brandState.isLoading && brandState.items.length === 0 ? (
                          <div className="px-2 py-1 text-sm text-muted-foreground">
                            Loading brands...
                          </div>
                        ) : brandState.items.length === 0 ? (
                          <div className="px-2 py-1 text-sm text-muted-foreground">
                            No results found.
                          </div>
                        ) : (
                          <div
                            className="max-h-[300px] overflow-y-auto"
                            onScroll={handleBrandScroll}
                          >
                            {brandState.items.map((brand) => (
                              <SelectItem key={brand.id} value={brand.id}>
                                <div className="flex items-center gap-2">
                                  {brand.logo && (
                                    <Image
                                      src={`${API_BASE_URL}/api/${API_VERSION}/media/${brand.logo.id}/content`}
                                      alt={brand.name}
                                      className="w-6 h-6 object-contain"
                                      width={24}
                                      height={24}
                                    />
                                  )}
                                  <div className="w-full flex flex-row justify-between items-center gap-2">
                                    <div className="font-medium">{brand.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {brand.brandType?.name}
                                    </div>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                            {brandState.isLoading && brandState.items.length > 0 && (
                              <div className="px-2 py-1 text-sm text-muted-foreground text-center">
                                Loading more brands...
                              </div>
                            )}
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h1 className="text-xl font-semibold mb-4 mt-8">Brief Overview</h1>
              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>
                      Brief subtitle <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>
                      Brief overview <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h1 className="text-xl font-semibold mb-4 mt-8">Budget Limitations</h1>
              <div className="flex flex-row gap-4">
                <FormField
                  control={form.control}
                  name="budgetStartRange"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>
                        Budget start range <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input {...field} type="number" min="0" className="pl-6" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <p className="text-xl font-semibold mb-4 mt-8">-</p>

                <FormField
                  control={form.control}
                  name="budgetEndRange"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>
                        Budget end range <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input {...field} type="number" min="0" className="pl-6" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <h1 className="text-xl font-semibold mb-4">Location Details</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="countryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Country <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const country = countryState.items.find(c => c.id === value);
                          if (country) {
                            setCountryState(prev => ({ ...prev, selected: country }));
                          }
                          field.onChange(value);
                          form.setValue("cityId", "");
                        }}
                        value={field.value}
                        onOpenChange={handleCountrySelectOpen}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue>
                              {countryState.selected ? (
                                <div className="flex items-center justify-between w-full gap-2">
                                  <span>{countryState.selected.name}</span>
                                  <span className="text-xs text-muted-foreground">{countryState.selected.code}</span>
                                </div>
                              ) : (
                                "Select a country"
                              )}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <div className="px-2 py-1 sticky top-0 bg-background z-10">
                            <Input
                              ref={countryState.searchInputRef}
                              placeholder="Search countries..."
                              value={countryState.searchValue}
                              onChange={handleCountrySearchChange}
                              onKeyDown={(e) => e.stopPropagation()}
                            />
                          </div>
                          {countryState.isLoading && countryState.items.length === 0 ? (
                            <div className="px-2 py-1 text-sm text-muted-foreground">
                              Loading countries...
                            </div>
                          ) : countryState.items.length === 0 ? (
                            <div className="px-2 py-1 text-sm text-muted-foreground">
                              No results found.
                            </div>
                          ) : (
                            <div
                              className="max-h-[300px] overflow-y-auto"
                              onScroll={handleCountryScroll}
                            >
                              {countryState.items.map((country) => (
                                <SelectItem
                                  key={country.id}
                                  value={country.id}
                                  className={`flex items-center justify-between w-full ${field.value === country.id ? "bg-accent" : ""}`}
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <span className="font-medium">{country.name}</span>
                                    <span className="text-xs text-muted-foreground">{country.code}</span>
                                  </div>
                                </SelectItem>
                              ))}
                              {countryState.isLoading && countryState.items.length > 0 && (
                                <div className="px-2 py-1 text-sm text-muted-foreground text-center">
                                  Loading more countries...
                                </div>
                              )}
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        City <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={handleCitySelect}
                        value={field.value}
                        disabled={!selectedCountryId}
                        onOpenChange={handleCitySelectOpen}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue>
                              {cityState.selected ? 
                                <span className="font-medium">{cityState.selected.name}</span> : 
                                "Select a city"
                              }
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                          <SelectContent>
                          <div className="px-2 py-1 sticky top-0 bg-background z-10">
                            <Input
                              ref={cityState.searchInputRef}
                              placeholder="Search cities..."
                              value={cityState.searchValue}
                              onChange={handleCitySearchChange}
                              className="h-8"
                              onKeyDown={(e) => e.stopPropagation()}
                            />
                          </div>
                          {cityState.isLoading && cityState.items.length === 0 ? (
                            <div className="px-2 py-1 text-sm text-muted-foreground">
                              Loading cities...
                            </div>
                          ) : cityState.items.length === 0 ? (
                            <div className="px-2 py-1 text-sm text-muted-foreground">
                              {selectedCountryId ? "No cities found for this country." : "Please select a country first."}
                            </div>
                          ) : (
                            <div
                              className="max-h-[300px] overflow-y-auto"
                              onScroll={handleCityScroll}
                            >
                              {cityState.items.map((city) => (
                                <SelectItem
                                  key={city.id}
                                  value={city.id}
                                  className={`flex items-center justify-between w-full ${field.value === city.id ? "bg-accent" : ""}`}
                                >
                                  <span className="font-medium">{city.name}</span>
                                </SelectItem>
                              ))}
                              {cityState.isLoading && cityState.items.length > 0 && (
                                <div className="px-2 py-1 text-sm text-muted-foreground text-center">
                                  Loading more cities...
                                </div>
                              )}
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Address <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <LocationSelector
                        value={{
                          address: field.value,
                          latitude: form.watch("latitude"),
                          longitude: form.watch("longitude"),
                        }}
                        onChange={(location) => {
                          field.onChange(location.address);
                          form.setValue("latitude", location.latitude);
                          form.setValue("longitude", location.longitude);
                        }}
                        error={form.formState.errors.address?.message}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="hidden">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} type="text" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} type="text" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}