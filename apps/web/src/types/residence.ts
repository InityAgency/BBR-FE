// types/residence.ts
export interface RankingCategory {
  id: string;
  name: string;
  slug: string;
  title: string;
  description: string;
  featuredImage: {
    id: string;
    originalFileName: string;
    mimeType: string;
    uploadStatus: string;
    size: number;
  } | null;
}

export interface TotalScore {
  totalScore: number;
  position: number;
  rankingCategory: RankingCategory;
}

export interface Residence {
  id: string;
  name: string;
  subtitle: string;
  slug: string;
  description: string;
  status: string;
  developmentStatus: string;
  address: string;
  yearBuilt: string | number; // Može doći kao string ili broj
  rentalPotential: string;
  score: number;
  
  // Budžetski raspon
  budgetStartRange?: string;
  budgetEndRange?: string;
  
  // Cena
  avgPricePerSqft?: string;
  avgPricePerUnit?: string;
  floorSqft?: string;
  
  // Lokacija
  latitude?: number;
  longitude?: number;
  
  // Posebne karakteristike
  petFriendly?: boolean;
  disabledFriendly?: boolean;
  staffRatio?: number;
  
  // Odnosi
  country: {
    id: string;
    name: string;
    code?: string;
    tld?: string;
    currencyCode?: string;
  };
  
  city: {
    id: string;
    name: string;
    asciiName: string;
    population?: number;
    timezone?: string;
  };
  
  company: any; // Može biti null
  
  // Brend
  brand: {
    id: string;
    name: string;
    slug: string;
    description: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    logo: {
      id: string;
      originalFileName: string;
      mimeType: string;
      uploadStatus: string;
      size: number;
    };
  };
  
  // Medijski sadržaj
  featuredImage: {
    id: string;
    originalFileName: string;
    mimeType: string;
    uploadStatus: string;
    size: number;
  } | null;
  
  mainGallery?: Array<{
    id: string;
    originalFileName?: string;
    mimeType?: string;
    uploadStatus?: string;
    size?: number;
  }>;
  
  secondaryGallery?: Array<{
    id: string;
    originalFileName?: string;
    mimeType?: string;
    uploadStatus?: string;
    size?: number;
  }>;
  
  videoTour?: any; // Može biti null
  videoTourUrl?: string | null;
  websiteUrl?: string;
  
  // Karakteristike i pogodnosti
  amenities?: Array<{
    id: string;
    name: string;
    description: string;
    icon: {
      id: string;
      originalFileName: string;
      mimeType: string;
      uploadStatus: string;
      size: number;
    } | null;
    featuredImage: any | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: null | string;
  }>;
  
  highlightedAmenities?: Array<{
    amenity: {
      id: string;
      name: string;
      description: string;
      icon: any | null;
      featuredImage: any | null;
      createdAt: string;
      updatedAt: string;
      deletedAt: null | string;
    };
    order: number;
  }>;
  
  keyFeatures?: Array<{
    id: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
  }>;
  
  // Rangiranje i ocene
  rankingCategories?: any[];
  totalScore?: number;
  totalScores: TotalScore[];
  
  // Jedinice (stanovi/vile)
  units?: any[];
  
  // Vremenski podaci
  createdAt: string;
  updatedAt: string;
}

export interface ResidencesResponse {
  data: Residence[];
  statusCode: number;
  message: string;
  pagination: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
  timestamp: string;
  path: string;
}