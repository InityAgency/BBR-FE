export type ResidenceStatus = "DRAFT" | "ACTIVE" | "DELETED" | "PENDING";

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
  deletedAt: string | null;
  countryId: string;
}

export interface Brand {
  id: string;
  name: string;
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
  status: ResidenceStatus;
  developmentStatus: string;
  subtitle: string;
  description: string;
  budgetStartRange: number;
  budgetEndRange: number;
  address: string;
  latitude: string;
  longitude: string;
  country: Country;
  city: City;
  createdAt: string;
  updatedAt: string;
  rentalPotential: number | null;
  websiteUrl: string;
  yearBuilt: number | null;
  floorSqft: number | null;
  staffRatio: number | null;
  avgPricePerUnit: number | null;
  avgPricePerSqft: number | null;
  petFriendly: boolean;
  disabledFriendly: boolean;
  videoTourUrl: string | null;
  videoTour: string | null;
  featuredImage: string | null;
  keyFeatures: string[];
  brand: Brand;
  units: any[];
  amenities: any[];
  company: any | null;
  mainGallery: any[];
}
