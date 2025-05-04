import { City, CityApiResponse } from "@/types/city";
import { Country, CountryApiResponse } from "@/types/country";

type MenuItem = {
  label: string;
  href: string;
  description?: string
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

// Osnovni podaci navigacije bez gradova (biće dopunjeni dinamički)
export const navigationData: NavigationData = {
  bestResidences: {
    title: "Best Residences",
    href: "/best-residences",
    tabs: [
      "Exclusive Locations",
      "Property Features",
      "Lifestyle Options",
      "Investment Value",
      "Special Amenities",
      "Family Friendly",
    ],
    content: {
      "Exclusive Locations": [
        { label: "Best of Newest Branded Residences", href: "/best/newest" },
        { label: "Best of Investment Opportunities", href: "/best/investment" },
        { label: "Best of Pet-Friendly Residences", href: "/best/pet-friendly" },
        { label: "Best of Beachfront Living", href: "/best/beachfront" },
        { label: "Best of Golf Living", href: "/best/golf" },
        { label: "Best of Emerging Markets", href: "/best/emerging-markets" },
        { label: "Best of Best for Couples", href: "/best/couples" },
        { label: "Best of Cultural Hotspots", href: "/best/cultural-hotspots" },
        { label: "Best of Best for Families", href: "/best/families" },
        { label: "Best of Urban High-Rise", href: "/best/urban-high-rise" },
        { label: "Best for Working Professionals", href: "/best/working-professionals" },
        { label: "Best for Retirement Havens", href: "/best/retirement" },
      ],
      "Property Features": [
        { label: "Best Infinity Pools", href: "/best/infinity-pools" },
        { label: "Best Architectural Design", href: "/best/architecture" },
        { label: "Best Smart Home Technology", href: "/best/smart-home" },
        { label: "Best Private Gardens", href: "/best/gardens" },
      ],
      "Lifestyle Options": [
        { label: "Best for Yacht Club", href: "/best/yacht-club" },
        { label: "Best for Equestrian", href: "/best/equestrian" },
        { label: "Best of Ski Resort Living", href: "/best/ski-resort" },
        { label: "Best of Cultural Hotspots", href: "/best/cultural-hotspots" },
      ],
      "Investment Value": [
        { label: "Best ROI Properties", href: "/best/roi" },
        { label: "Best Rental Income Potential", href: "/best/rental-income" },
        { label: "Best Upcoming Areas", href: "/best/upcoming-areas" },
      ],
      "Special Amenities": [
        { label: "Best of Urban High-Rise", href: "/best/urban-high-rise" },
        { label: "Best for Working Professionals", href: "/best/working-professionals" },
        { label: "Best for Retirement Havens", href: "/best/retirement" },
      ],
      "Family Friendly": [
        { label: "Best for Schools", href: "/best/schools" },
        { label: "Best for Multigenerational Living", href: "/best/multigenerational" },
        { label: "Best Child-Friendly Communities", href: "/best/child-friendly" },
      ],
    },
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
      "Brands": [
        { label: "Luxury ($1M+)", href: "/residences/luxury" },
        { label: "Premium ($500K-$1M)", href: "/residences/premium" },
        { label: "Mid-Range ($250K-$500K)", href: "/residences/mid-range" },
        { label: "Affordable (Under $250K)", href: "/residences/affordable" },
      ],
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

// Funkcija za učitavanje jedne stranice gradova
async function fetchCitiesPage(page: number): Promise<CityApiResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/public/cities?page=${page}`;
  
  console.log(`Fetching cities page ${page} from: ${apiUrl}`);
  
  const response = await fetch(apiUrl);
  
  if (!response.ok) {
    throw new Error(`Error fetching cities page ${page}: ${response.status}`);
  }
  
  return response.json();
}

// Funkcija za učitavanje jedne stranice država
async function fetchCountriesPage(page: number): Promise<CountryApiResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/public/countries?page=${page}`;
  
  console.log(`Fetching countries page ${page} from: ${apiUrl}`);
  
  const response = await fetch(apiUrl);
  
  if (!response.ok) {
    throw new Error(`Error fetching countries page ${page}: ${response.status}`);
  }
  
  return response.json();
}

// Funkcija za dobijanje svih gradova
export async function getCities(): Promise<MenuItem[]> {
  try {
    // Provera keša
    const cachedCities = getCachedData('citiesCache');
    if (cachedCities) {
      console.log(`Returning ${cachedCities.length} cities from cache`);
      return cachedCities;
    }

    // Učitaj prvu stranicu da bismo saznali ukupan broj stranica
    const firstPageResponse = await fetchCitiesPage(1);
    const { totalPages } = firstPageResponse.pagination;
    
    console.log(`Total pages: ${totalPages}, first page has ${firstPageResponse.data.length} cities`);
    
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
        console.log(`Page ${index + 2} has ${response.data.length} cities`);
        allCities = [...allCities, ...response.data];
      });
    }
    
    console.log(`Total cities collected: ${allCities.length}`);
    
    // Transformacija u format za navigaciju i sortiranje po abecednom redu
    const cityMenuItems = allCities
      .map((city) => ({
        label: city.name,
        href: `/residences/city/${city.name.toLowerCase().replace(/\s+/g, '-')}`,
        description: city.country ? `${city.country.name}` : undefined
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    
    // Keširaj rezultate
    cacheData('citiesCache', cityMenuItems);
    
    return cityMenuItems;
  } catch (error) {
    console.error("Failed to fetch cities:", error);
    return []; // Vrati prazan niz u slučaju greške
  }
}

// Funkcija za dobijanje svih država
export async function getCountries(): Promise<MenuItem[]> {
  try {
    // Provera keša
    const cachedCountries = getCachedData('countriesCache');
    if (cachedCountries) {
      console.log(`Returning ${cachedCountries.length} countries from cache`);
      return cachedCountries;
    }

    // Učitaj prvu stranicu da bismo saznali ukupan broj stranica
    const firstPageResponse = await fetchCountriesPage(1);
    const { totalPages } = firstPageResponse.pagination;
    
    console.log(`Total pages: ${totalPages}, first page has ${firstPageResponse.data.length} countries`);
    
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
        console.log(`Page ${index + 2} has ${response.data.length} countries`);
        allCountries = [...allCountries, ...response.data];
      });
    }
    
    console.log(`Total countries collected: ${allCountries.length}`);
    
    // Transformacija u format za navigaciju i sortiranje po abecednom redu
    // Sada koristimo samo ime zemlje za URL bez dodatnih elemenata
    const countryMenuItems = allCountries
      .map((country) => ({
        label: country.name,
        href: `/residences/${country.name.toLowerCase().replace(/\s+/g, '-')}`,
        description: `${country.code}`
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    
    // Keširaj rezultate
    cacheData('countriesCache', countryMenuItems);
    
    return countryMenuItems;
  } catch (error) {
    console.error("Failed to fetch countries:", error);
    return []; // Vrati prazan niz u slučaju greške
  }
}

// Funkcije za keš - sada podržavaju više različitih keš tipova
function getCachedData(cacheKey: string): MenuItem[] | null {
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
    console.error(`Error reading from ${cacheKey}:`, error);
    return null;
  }
}

function cacheData(cacheKey: string, items: MenuItem[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    const cacheData = {
      items,
      timestamp: new Date().getTime(),
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    console.log(`Cached ${items.length} items in ${cacheKey}`);
  } catch (error) {
    console.error(`Error writing to ${cacheKey}:`, error);
  }
}

// Funkcija za dinamičko popunjavanje gradova i država u navigationData
export async function getNavigationDataWithCities(): Promise<NavigationData> {
  // Pravimo kopiju osnovnih podataka
  const data = JSON.parse(JSON.stringify(navigationData));
  
  // Dobavimo gradove i države
  const [cities, countries] = await Promise.all([
    getCities(),
    getCountries()
  ]);
  
  console.log(`Adding ${cities.length} cities and ${countries.length} countries to navigation data`);
  
  // Postavimo gradove i države u kopiju
  data.allResidences.content.City = cities;
  data.allResidences.content.Country = countries;

  return data;
}