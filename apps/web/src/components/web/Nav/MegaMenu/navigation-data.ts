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

// Osnovni podaci navigacije bez gradova (biće dopunjeni dinamički)
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
      "Geographical Area": [
        { label: "Beach", href: "/residences/beach" },
        { label: "Mountain", href: "/residences/mountain" },
        { label: "Urban", href: "/residences/urban" },
        { label: "Countryside", href: "/residences/countryside" },
        { label: "Island", href: "/residences/island" },
        { label: "Lake", href: "/residences/lake" },
      ],
      "Brands": [], // Biće popunjeno dinamički sa pravim brendovima
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

// Funkcija za učitavanje kontinenata
async function fetchContinents(): Promise<ContinentApiResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
  const apiUrl = `${baseUrl}/api/${apiVersion}/continents`;
  
  const response = await fetch(apiUrl, {
    cache: 'no-store', // Osigurava svež podatak
  });
  
  if (!response.ok) {
    throw new Error(`Error fetching continents: ${response.status}`);
  }
  
  return response.json();
}

// Funkcija za dobijanje kontinenata
export async function getContinents(): Promise<MenuItem[]> {
  try {
    // Provera keša
    const cachedContinents = getCachedData<MenuItem[]>('continentsCache');
    if (cachedContinents) {
      return cachedContinents;
    }

    // Učitaj kontinente
    const continentsResponse = await fetchContinents();
    const continents: Continent[] = continentsResponse.data;
    
    // Transformacija u format za navigaciju
    const continentMenuItems = continents
      .map((continent) => ({
        label: continent.name,
        href: `/residences/continent/${continent.slug || continent.name.toLowerCase().replace(/\s+/g, '-')}`
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    
    // Keširaj rezultate - pošto se kontinenti retko menjaju, možemo ih trajno keširati
    cacheData('continentsCache', continentMenuItems);
    
    return continentMenuItems;
  } catch (error) {
    return []; // Vrati prazan niz u slučaju greške
  }
}

// Funkcija za učitavanje jedne stranice gradova
async function fetchCitiesPage(page: number): Promise<CityApiResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
  const apiUrl = `${baseUrl}/api/${apiVersion}/public/cities?page=${page}`;
  
  const response = await fetch(apiUrl);
  
  if (!response.ok) {
    throw new Error(`Error fetching cities page ${page}: ${response.status}`);
  }
  
  return response.json();
}

// Funkcija za učitavanje jedne stranice država
async function fetchCountriesPage(page: number): Promise<CountryApiResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
  const apiUrl = `${baseUrl}/api/${apiVersion}/public/countries?page=${page}`;
  
  const response = await fetch(apiUrl);
  
  if (!response.ok) {
    throw new Error(`Error fetching countries page ${page}: ${response.status}`);
  }
  
  return response.json();
}

// Funkcija za učitavanje brendova
async function fetchBrandsPage(page: number): Promise<BrandsResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
  const apiUrl = `${baseUrl}/api/${apiVersion}/public/brands?sortBy=name&sortOrder=asc&withResidences=true&page=${page}`;
  
  const response = await fetch(apiUrl, {
    cache: 'no-store', // Osigurava svež podatak
  });
  
  if (!response.ok) {
    throw new Error(`Error fetching brands page ${page}: ${response.status}`);
  }
  
  return response.json();
}

// Funkcija za učitavanje tipova ranking kategorija
async function fetchRankingCategoryTypes(): Promise<RankingCategoryTypeResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
  const apiUrl = `${baseUrl}/api/${apiVersion}/ranking-category-types`;
  
  const response = await fetch(apiUrl, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error(`Error fetching ranking category types: ${response.status}`);
  }
  
  return response.json();
}

// Funkcija za učitavanje ranking kategorija za određeni tip (sa paginacijom)
async function fetchRankingCategoriesForType(categoryTypeId: string): Promise<RankingCategory[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
  let page = 1;
  let allCategories: RankingCategory[] = [];
  let totalPages = 1;

  do {
    const apiUrl = `${baseUrl}/api/${apiVersion}/ranking-categories?limit=50&categoryTypeId=${categoryTypeId}&page=${page}`;
    const response = await fetch(apiUrl, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error(`Error fetching ranking categories for type ${categoryTypeId}: ${response.status}`);
    }
    
    const data: RankingCategoryResponse = await response.json();
    
    if (data.data) {
      allCategories = [...allCategories, ...data.data];
    }
    
    totalPages = data.pagination?.totalPages || 1;
    page++;
  } while (page <= totalPages);

  return allCategories;
}

// Funkcija za dobijanje svih gradova
export async function getCities(): Promise<MenuItem[]> {
  try {
    // Provera keša
    const cachedCities = getCachedData<MenuItem[]>('citiesCache');
    if (cachedCities) {
      return cachedCities;
    }

    // Učitaj prvu stranicu da bismo saznali ukupan broj stranica
    const firstPageResponse = await fetchCitiesPage(1);
    const { totalPages } = firstPageResponse.pagination;
    
    let allCities: City[] = [...firstPageResponse.data];
    
    // Učitaj preostale stranice ako ih ima
    if (totalPages > 1) {
      const remainingPagesPromises = [];
      for (let page = 2; page <= totalPages; page++) {
        remainingPagesPromises.push(fetchCitiesPage(page));
      }
      
      const remainingPagesResponses = await Promise.all(remainingPagesPromises);
      
      // Dodaj gradove iz ostalih stranica
      remainingPagesResponses.forEach((response, index) => {
        allCities = [...allCities, ...response.data];
      });
    }
    
    // Transformacija u format za navigaciju i sortiranje po abecednom redu
    const cityMenuItems = allCities
      .map((city) => ({
        label: city.name,
        href: `/residences/city/${city.name.toLowerCase().replace(/\s+/g, '-')}`
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    
    // Keširaj rezultate
    cacheData('citiesCache', cityMenuItems);
    
    return cityMenuItems;
  } catch (error) {
    return []; // Vrati prazan niz u slučaju greške
  }
}

// Funkcija za dobijanje svih država
export async function getCountries(): Promise<MenuItem[]> {
  try {
    // Provera keša
    const cachedCountries = getCachedData<MenuItem[]>('countriesCache');
    if (cachedCountries) {
      return cachedCountries;
    }

    // Učitaj prvu stranicu da bismo saznali ukupan broj stranica
    const firstPageResponse = await fetchCountriesPage(1);
    const { totalPages } = firstPageResponse.pagination;
    
    let allCountries: Country[] = [...firstPageResponse.data];
    
    // Učitaj preostale stranice ako ih ima
    if (totalPages > 1) {
      const remainingPagesPromises = [];
      for (let page = 2; page <= totalPages; page++) {
        remainingPagesPromises.push(fetchCountriesPage(page));
      }
      
      const remainingPagesResponses = await Promise.all(remainingPagesPromises);
      
      // Dodaj države iz ostalih stranica
      remainingPagesResponses.forEach((response, index) => {
        allCountries = [...allCountries, ...response.data];
      });
    }
    
    // Transformacija u format za navigaciju i sortiranje po abecednom redu
    const countryMenuItems = allCountries
      .map((country) => ({
        label: country.name,
        href: `/residences/country/${country.name.toLowerCase().replace(/\s+/g, '-')}`
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    
    // Keširaj rezultate
    cacheData('countriesCache', countryMenuItems);
    
    return countryMenuItems;
  } catch (error) {
    return []; // Vrati prazan niz u slučaju greške
  }
}

// Funkcija za dobijanje brendova
export async function getBrands(): Promise<MenuItem[]> {
  try {
    // Provera keša
    const cachedBrands = getCachedData<MenuItem[]>('brandsCache');
    if (cachedBrands) {
      return cachedBrands;
    }

    // Učitaj prvu stranicu da bismo saznali ukupan broj stranica
    const firstPageResponse = await fetchBrandsPage(1);
    const { totalPages } = firstPageResponse.pagination;
    
    let allBrands: Brand[] = [...firstPageResponse.data];
    
    // Učitaj preostale stranice ako ih ima
    if (totalPages > 1) {
      const remainingPagesPromises = [];
      for (let page = 2; page <= totalPages; page++) {
        remainingPagesPromises.push(fetchBrandsPage(page));
      }
      
      const remainingPagesResponses = await Promise.all(remainingPagesPromises);
      
      // Dodaj brendove iz ostalih stranica
      remainingPagesResponses.forEach((response, index) => {
        allBrands = [...allBrands, ...response.data];
      });
    }
    
    // Transformacija svih brendova u format za navigaciju
    const brandMenuItems = allBrands
      .map((brand) => ({
        label: brand.name,
        href: `/residences/brand/${brand.slug || brand.name.toLowerCase().replace(/\s+/g, '-')}`
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    
    // Keširaj rezultate
    cacheData('brandsCache', brandMenuItems);
    
    return brandMenuItems;
  } catch (error) {
    return []; // Vrati prazan niz u slučaju greške
  }
}

// Funkcija za dobijanje ranking kategorija organizovanih po tipovima
export async function getRankingCategories(): Promise<{ [key: string]: MenuItem[] }> {
  try {
    // Keširamo samo tipove kategorija, ne i same kategorije
    let categoryTypes: RankingCategoryType[];
    
    const cachedCategoryTypes = getCachedData<RankingCategoryType[]>('rankingCategoryTypesCache');
    if (cachedCategoryTypes) {
      categoryTypes = cachedCategoryTypes;
    } else {
      // Učitaj tipove ranking kategorija i keširaj ih
      const categoryTypesResponse = await fetchRankingCategoryTypes();
      categoryTypes = categoryTypesResponse.data;
      cacheData('rankingCategoryTypesCache', categoryTypes);
    }

    const categoriesByType: { [key: string]: MenuItem[] } = {};
    
    // Za svaki tip kategorije, uvek učitaj sveže kategorije (bez keša)
    for (const type of categoryTypes) {
      const categories = await fetchRankingCategoriesForType(type.id);
      
      categoriesByType[type.name] = categories.map(category => ({
        label: category.name,
        href: `/best-residences/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`
      })).sort((a, b) => a.label.localeCompare(b.label));
    }
    
    return categoriesByType;
  } catch (error) {
    console.error('Error loading ranking categories:', error);
    return {}; // Vrati prazan objekat u slučaju greške
  }
}

// Funkcije za keš
function getCachedData<T>(cacheKey: string): T | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cachedData = localStorage.getItem(cacheKey);
    
    if (!cachedData) return null;
    
    const { items, timestamp } = JSON.parse(cachedData);
    const now = new Date().getTime();
    
    // Proveri da li je keš istekao (24h = 86400000ms)
    if (now - timestamp > 86400000) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return items;
  } catch (error) {
    return null;
  }
}

function cacheData<T>(cacheKey: string, items: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    const cacheData = {
      items,
      timestamp: new Date().getTime(),
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error caching data:', error);
  }
}

// Modifikovana funkcija za dinamičko popunjavanje podataka
export async function getNavigationDataWithCities(): Promise<NavigationData> {
  // Pravimo kopiju osnovnih podataka
  const data = JSON.parse(JSON.stringify(navigationData));
  
  // Dobavimo sve potrebne podatke
  const [cities, countries, brands, continents, rankingCategories] = await Promise.all([
    getCities(),
    getCountries(),
    getBrands(),
    getContinents(),
    getRankingCategories()
  ]);
  
  // Postavimo gradove, države, brendove i kontinente u kopiju
  data.allResidences.content.City = cities;
  data.allResidences.content.Country = countries;
  data.allResidences.content.Brands = brands;
  data.allResidences.content["Geographical Area"] = continents;

  // Ažuriramo Best Residences sekciju sa ranking kategorijama
  if (data.bestResidences) {
    // Postavimo tabove na osnovu tipova kategorija (alfabetski sortiran)
    data.bestResidences.tabs = Object.keys(rankingCategories).sort();
    // Postavimo sadržaj za svaki tab
    data.bestResidences.content = rankingCategories;
  }

  return data;
}