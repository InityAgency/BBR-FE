import { City, CityApiResponse } from "@/types/city";
import { Country, CountryApiResponse } from "@/types/country";
import { Brand, BrandsResponse } from "@/types/brand";
import { Continent, ContinentApiResponse } from "@/types/continent";

export interface MenuItem {
  label: string;
  href: string;
}

type MenuContent = {
  [key: string]: MenuItem[]
}

type NavigationItem = {
  title: string
  href: string
  tabs: string[]
  content: MenuContent
}

type NavigationData = {
  [key: string]: NavigationItem
}

// Tipovi za ranking kategorije
interface RankingCategoryType {
  id: string;
  name: string;
  slug: string;
}

interface RankingCategory {
  id: string;
  name: string;
  title: string;
  slug: string;
  categoryTypeId: string;
}

interface RankingCategoryTypeResponse {
  data: RankingCategoryType[];
}

interface RankingCategoryResponse {
  data: RankingCategory[];
  pagination: {
    totalPages: number;
    currentPage: number;
    totalItems: number;
  };
}

// Cache configuration
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Cache keys
const CACHE_KEYS = {
  continents: 'continentsCache',
  cities: 'citiesCache',
  countries: 'countriesCache',
  brands: 'brandsCache',
  rankingCategoryTypes: 'rankingCategoryTypesCache'
} as const;

// Osnovni podaci navigacije bez dinamičkih podataka
export const navigationData: NavigationData = {
  bestResidences: {
    title: "Best Residences",
    href: "/best-residences",
    tabs: [], // Biće popunjeno dinamički
    content: {} // Biće popunjeno dinamički
  },
  allResidences: {
    title: "All Residences",
    href: "/residences",
    tabs: ["Country", "City", "Geographical Area", "Brands"],
    content: {
      Country: [], // Biće popunjeno dinamički
      City: [], // Biće popunjeno dinamički
      "Geographical Area": [], // Biće popunjeno dinamički sa kontinentima
      "Brands": [], // Biće popunjeno dinamički
    },
  },
  allBrands: {
    title: "All Brands",
    href: "/brands",
    tabs: ["Fashion and Lifestyle Brands", "Automotive Brands", "Luxury Hotel and Resort Brands"],
    content: {
      "Fashion and Lifestyle Brands": [
        { label: "Accor", href: "/brands/accor" },
        { label: "Armani", href: "/brands/armani" },
        { label: "Baccarat", href: "/brands/baccarat" },
        { label: "Bvlgari", href: "/brands/bvlgari" },
        { label: "Cavalli", href: "/brands/cavalli" },
        { label: "Diesel Living", href: "/brands/diesel-living" },
        { label: "Elie Saab", href: "/brands/elie-saab" },
        { label: "Fendi", href: "/brands/fendi" },
        { label: "Giorgio Armani", href: "/brands/giorgio-armani" },
        { label: "Hermès", href: "/brands/hermes" },
        { label: "Karl Lagerfeld", href: "/brands/karl-lagerfeld" },
        { label: "Kenzo", href: "/brands/kenzo" },
        { label: "LVMH", href: "/brands/lvmh" },
        { label: "Missoni", href: "/brands/missoni" },
        { label: "Paramount", href: "/brands/paramount" },
        { label: "Ralph Lauren", href: "/brands/ralph-lauren" },
        { label: "Roberto Cavalli", href: "/brands/roberto-cavalli" },
        { label: "SLS", href: "/brands/sls" },
        { label: "Tommy Hilfiger", href: "/brands/tommy-hilfiger" },
        { label: "Trump", href: "/brands/trump" },
        { label: "Versace", href: "/brands/versace" },
        { label: "Yoo by Philippe Starck", href: "/brands/yoo-by-philippe-starck" },
        { label: "Yoo", href: "/brands/yoo" },
      ],
      "Automotive Brands": [
        { label: "Aston Martin", href: "/brands/aston-martin" },
        { label: "Bentley", href: "/brands/bentley" },
        { label: "Bugatti", href: "/brands/bugatti" },
        { label: "Ferrari", href: "/brands/ferrari" },
        { label: "Lamborghini", href: "/brands/lamborghini" },
        { label: "Mercedes-Benz", href: "/brands/mercedes-benz" },
        { label: "Porsche Design Tower", href: "/brands/porsche-design-tower" },
      ],
      "Luxury Hotel and Resort Brands": [
        { label: "Alila", href: "/brands/alila" },
        { label: "Aman", href: "/brands/aman" },
        { label: "Anantara", href: "/brands/anantara" },
        { label: "Ascott", href: "/brands/ascott" },
        { label: "Banyan Tree", href: "/brands/banyan-tree" },
        { label: "Belmond", href: "/brands/belmond" },
        { label: "Capella", href: "/brands/capella" },
        { label: "Cheval Blanc", href: "/brands/cheval-blanc" },
        { label: "Cheval", href: "/brands/cheval" },
        { label: "Club Quarters", href: "/brands/club-quarters" },
        { label: "Como", href: "/brands/como" },
        { label: "Conrad", href: "/brands/conrad" },
        { label: "Montage", href: "/brands/montage" },
        { label: "DAMAC", href: "/brands/damac" },
        { label: "Discovery Land Company", href: "/brands/discovery-land-company" },
        { label: "Dorchester", href: "/brands/dorchester" },
        { label: "Edition", href: "/brands/edition" },
        { label: "Emaar", href: "/brands/emara" },
        { label: "Equinox", href: "/brands/equinox" },
        { label: "Fairmont", href: "/brands/fairmont" },
        { label: "Four Points", href: "/brands/four-points" },
        { label: "Four Seasons", href: "/brands/four-seasons" },
        { label: "Grand Hyatt", href: "/brands/grand-hyatt" },
        { label: "Hard Rock", href: "/brands/hard-rock" },
        { label: "Hilton", href: "/brands/hilton" },
        { label: "Hyatt Centric", href: "/brands/hyatt-centric" },
        { label: "InterContinental", href: "/brands/intercontinental" },
        { label: "Jumeirah Living", href: "/brands/jumeirah-living" },
        { label: "JW Marriott", href: "/brands/jw-marriott" },
        { label: "Kempinski", href: "/brands/kempinski" },
        { label: "Kerzner International", href: "/brands/kerzner-international" },
        { label: "Mandarin Oriental", href: "/brands/mandarin-oriental" },
        { label: "Marriott", href: "/brands/marriott" },
        { label: "MGM Resorts", href: "/brands/mgm-resorts" },
        { label: "Mövenpick", href: "/brands/movenpick" },
        { label: "ME by Meliá", href: "/brands/me-by-melia" },
        { label: "Montage", href: "/brands/montage" },
        { label: "Morgans Hotel", href: "/brands/morgans-hotel" },
        { label: "Mövenpick", href: "/brands/movenpick" },
        { label: "Oetker Collection", href: "/brands/oetker-collection" },
        { label: "Nobu", href: "/brands/nobu" },
        { label: "Oberoi", href: "/brands/oberoi" },
        { label: "One&Only Private Homes", href: "/brands/one-and-only-private-homes" },
        { label: "One&Only", href: "/brands/one-and-only" },
        { label: "Park Hyatt", href: "/brands/park-hyatt" },
        { label: "Six Senses", href: "/brands/six-senses" },
      ],
    },
  },
}

// Utility functions for cache management
function getCachedData<T>(cacheKey: string): T | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cachedData = localStorage.getItem(cacheKey);
    
    if (!cachedData) return null;
    
    const { items, timestamp } = JSON.parse(cachedData);
    const now = Date.now();
    
    // Check if cache has expired
    if (now - timestamp > CACHE_DURATION) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return items;
  } catch (error) {
    console.error(`Error reading cache for ${cacheKey}:`, error);
    return null;
  }
}

function cacheData<T>(cacheKey: string, items: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    const cacheData = {
      items,
      timestamp: Date.now(),
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.error(`Error caching data for ${cacheKey}:`, error);
  }
}

// Generic API fetch function with error handling
async function fetchFromAPI<T>(url: string, errorMessage: string): Promise<T> {
  try {
    const response = await fetch(url, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`${errorMessage}: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(errorMessage, error);
    throw error;
  }
}

// API URL builder
function buildApiUrl(endpoint: string, params?: Record<string, string | number>): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
  const url = new URL(`${baseUrl}/api/${apiVersion}/${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }
  
  return url.toString();
}

// Fetch functions for different data types
async function fetchContinents(): Promise<ContinentApiResponse> {
  const url = buildApiUrl('public/continents');
  return fetchFromAPI<ContinentApiResponse>(url, 'Error fetching continents');
}

async function fetchCitiesPage(page: number): Promise<CityApiResponse> {
  const url = buildApiUrl('public/cities', { page });
  return fetchFromAPI<CityApiResponse>(url, `Error fetching cities page ${page}`);
}

async function fetchCountriesPage(page: number): Promise<CountryApiResponse> {
  const url = buildApiUrl('public/countries', { page });
  return fetchFromAPI<CountryApiResponse>(url, `Error fetching countries page ${page}`);
}

async function fetchBrandsPage(page: number): Promise<BrandsResponse> {
  const url = buildApiUrl('public/brands', { 
    sortBy: 'name', 
    sortOrder: 'asc', 
    withResidences: 'true', 
    page 
  });
  return fetchFromAPI<BrandsResponse>(url, `Error fetching brands page ${page}`);
}

async function fetchRankingCategoryTypes(): Promise<RankingCategoryTypeResponse> {
  const url = buildApiUrl('ranking-category-types');
  return fetchFromAPI<RankingCategoryTypeResponse>(url, 'Error fetching ranking category types');
}

async function fetchRankingCategoriesForType(categoryTypeId: string): Promise<RankingCategory[]> {
  let page = 1;
  let allCategories: RankingCategory[] = [];
  let totalPages = 1;

  do {
    const url = buildApiUrl('public/ranking-categories', {
      limit: 50,
      categoryTypeId,
      page
    });
    
    const data = await fetchFromAPI<RankingCategoryResponse>(
      url, 
      `Error fetching ranking categories for type ${categoryTypeId}`
    );
    
    if (data.data) {
      allCategories = [...allCategories, ...data.data];
    }
    
    totalPages = data.pagination?.totalPages || 1;
    page++;
  } while (page <= totalPages);

  return allCategories;
}

// Generic function to fetch all pages of data
async function fetchAllPages<T, R>(
  fetchPageFunction: (page: number) => Promise<{ data: T[]; pagination: { totalPages: number } }>,
  transform: (item: T) => R
): Promise<R[]> {
  try {
    // Fetch first page to get total pages
    const firstPageResponse = await fetchPageFunction(1);
    const { totalPages } = firstPageResponse.pagination;
    
    let allItems: T[] = [...firstPageResponse.data];
    
    // Fetch remaining pages if any
    if (totalPages > 1) {
      const remainingPagesPromises = [];
      for (let page = 2; page <= totalPages; page++) {
        remainingPagesPromises.push(fetchPageFunction(page));
      }
      
      const remainingPagesResponses = await Promise.all(remainingPagesPromises);
      
      // Add items from other pages
      remainingPagesResponses.forEach((response) => {
        allItems = [...allItems, ...response.data];
      });
    }
    
    // Transform and sort items
    return allItems
      .map(transform)
      .sort((a: any, b: any) => a.label.localeCompare(b.label));
      
  } catch (error) {
    console.error('Error fetching paginated data:', error);
    return [];
  }
}

// Main data fetching functions
export async function getContinents(): Promise<MenuItem[]> {
  // Check cache first
  const cachedContinents = getCachedData<MenuItem[]>(CACHE_KEYS.continents);
  if (cachedContinents) {
    return cachedContinents;
  }

  try {
    const continentsResponse = await fetchContinents();
    const continents: Continent[] = continentsResponse.data;
    
    // Transform continents to menu items
    const continentMenuItems = continents.map((continent) => ({
      label: continent.name,
      href: `/residences/continent/${continent.slug || continent.name.toLowerCase().replace(/\s+/g, '-')}`
    }));
    
    // Check if "Worldwide" already exists in the API results
    const hasWorldwide = continentMenuItems.some(item => 
      item.label.toLowerCase() === "worldwide" || 
      item.label.toLowerCase() === "wordwide"
    );
    
    // Add "Worldwide" only if it doesn't exist
    if (!hasWorldwide) {
      continentMenuItems.unshift({ label: "Worldwide", href: "/residences/continent/wordwide" });
    }
    
    // Sort with "Worldwide" at the top
    const sortedItems = continentMenuItems.sort((a, b) => {
      // Keep "Worldwide" at the top, sort others alphabetically
      if (a.label === "Worldwide") return -1;
      if (b.label === "Worldwide") return 1;
      return a.label.localeCompare(b.label);
    });
    
    // Cache results
    cacheData(CACHE_KEYS.continents, sortedItems);
    
    return sortedItems;
  } catch (error) {
    console.error('Error loading continents:', error);
    return [{ label: "Worldwide", href: "/residences/continent/wordwide" }]; // Return at least Worldwide option
  }
}

export async function getCities(): Promise<MenuItem[]> {
  // Check cache first
  const cachedCities = getCachedData<MenuItem[]>(CACHE_KEYS.cities);
  if (cachedCities) {
    return cachedCities;
  }

  const cityMenuItems = await fetchAllPages(
    fetchCitiesPage,
    (city: City) => ({
      label: city.name,
      href: `/residences/city/${city.name.toLowerCase().replace(/\s+/g, '-')}`
    })
  );
  
  // Cache results
  cacheData(CACHE_KEYS.cities, cityMenuItems);
  
  return cityMenuItems;
}

export async function getCountries(): Promise<MenuItem[]> {
  // Check cache first
  const cachedCountries = getCachedData<MenuItem[]>(CACHE_KEYS.countries);
  if (cachedCountries) {
    return cachedCountries;
  }

  const countryMenuItems = await fetchAllPages(
    fetchCountriesPage,
    (country: Country) => ({
      label: country.name,
      href: `/residences/country/${country.name.toLowerCase().replace(/\s+/g, '-')}`
    })
  );
  
  // Cache results
  cacheData(CACHE_KEYS.countries, countryMenuItems);
  
  return countryMenuItems;
}

export async function getBrands(): Promise<MenuItem[]> {
  // Check cache first
  const cachedBrands = getCachedData<MenuItem[]>(CACHE_KEYS.brands);
  if (cachedBrands) {
    return cachedBrands;
  }

  const brandMenuItems = await fetchAllPages(
    fetchBrandsPage,
    (brand: Brand) => ({
      label: brand.name,
      href: `/residences/brand/${brand.slug || brand.name.toLowerCase().replace(/\s+/g, '-')}`
    })
  );
  
  // Cache results
  cacheData(CACHE_KEYS.brands, brandMenuItems);
  
  return brandMenuItems;
}

export async function getRankingCategories(): Promise<{ [key: string]: MenuItem[] }> {
  try {
    // Check cache for category types
    let categoryTypes: RankingCategoryType[];
    
    const cachedCategoryTypes = getCachedData<RankingCategoryType[]>(CACHE_KEYS.rankingCategoryTypes);
    if (cachedCategoryTypes) {
      categoryTypes = cachedCategoryTypes;
    } else {
      const categoryTypesResponse = await fetchRankingCategoryTypes();
      categoryTypes = categoryTypesResponse.data;
      cacheData(CACHE_KEYS.rankingCategoryTypes, categoryTypes);
    }

    const categoriesByType: { [key: string]: MenuItem[] } = {};
    
    // For each category type, always fetch fresh categories (no cache)
    for (const type of categoryTypes) {
      const categories = await fetchRankingCategoriesForType(type.id);
      
      categoriesByType[type.name] = categories.map(category => ({
        label: category.title,
        href: `/best-residences/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`
      })).sort((a, b) => a.label.localeCompare(b.label));
    }
    
    return categoriesByType;
  } catch (error) {
    console.error('Error loading ranking categories:', error);
    return {};
  }
}

// Main function to get navigation data with all dynamic content
export async function getNavigationDataWithCities(): Promise<NavigationData> {
  // Create a deep copy of base navigation data
  const data = JSON.parse(JSON.stringify(navigationData));
  
  try {
    // Fetch all required data in parallel
    const [cities, countries, brands, continents, rankingCategories] = await Promise.all([
      getCities(),
      getCountries(),
      getBrands(),
      getContinents(), // This now includes continents + "Worldwide"
      getRankingCategories()
    ]);
    
    // Populate All Residences section
    data.allResidences.content.City = cities;
    data.allResidences.content.Country = countries;
    data.allResidences.content.Brands = brands;
    data.allResidences.content["Geographical Area"] = continents; // Now uses continents from API
    
    // Populate Best Residences section
    if (data.bestResidences) {
      data.bestResidences.tabs = Object.keys(rankingCategories).sort();
      data.bestResidences.content = rankingCategories;
    }
    
    return data;
  } catch (error) {
    console.error('Error loading navigation data:', error);
    // Return base data if there's an error
    return data;
  }
}