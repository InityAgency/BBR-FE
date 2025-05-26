export type ResidenceStatus = "DRAFT" | "ACTIVE" | "DELETED" | "PENDING";

export interface KeyFeature {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Amenity {
  id: string;
  name: string;
  description: string;
  icon?: {
    id: string;
    originalFileName: string;
    mimeType: string;
    uploadStatus: string;
    size: number;
  };
  featuredImage?: {
    id: string;
    originalFileName: string;
    mimeType: string;
    uploadStatus: string;
    size: number;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  tld: string;
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
  capital: string;
  subregion: string;
  flag: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  continentId: string;
}

export interface City {
  id: string;
  name: string;
  asciiName: string;
  population: number;
  timezone: string;
  xCoordinate: string;
  yCoordinate: string;
  createdAt: string;
  updatedAt: string;
  countryId: string;
  deletedAt: string | null;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  logo?: {
    id: string;
    originalFileName: string;
    mimeType: string;
    uploadStatus: string;
    size: number;
  };
}

export interface Residence {
  id: string;
  name: string;
  slug: string;
  status: string;
  developmentStatus: string;
  subtitle: string;
  description: string;
  budgetStartRange: string;
  budgetEndRange: string;
  address: string;
  latitude: number;
  longitude: number;
  country: Country;
  city: City;
  createdAt: string;
  updatedAt: string;
  rentalPotential: string;
  websiteUrl: string;
  yearBuilt: string;
  floorSqft: string;
  staffRatio: number;
  avgPricePerUnit: string;
  avgPricePerSqft: string;
  petFriendly: boolean;
  disabledFriendly: boolean;
  videoTourUrl: string | null;
  videoTour: string | null;
  featuredImage?: {
    id: string;
    originalFileName: string;
    mimeType: string;
    uploadStatus: string;
    size: number;
  };
  keyFeatures: KeyFeature[];
  brand: Brand | null;
  units: any[];
  amenities: Amenity[];
  company: any | null;
  mainGallery: {
    id: string;
    originalFileName: string;
    mimeType: string;
    uploadStatus: string;
    size: number;
  }[];
  secondaryGallery: any[];
  highlightedAmenities: {
    amenity: Amenity;
    order: number;
  }[];
  totalScores: any[];
}
