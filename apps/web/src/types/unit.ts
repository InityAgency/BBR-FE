export interface Unit {
  id: string;
  name: string;
  slug: string;
  description: string;
  surface: number;
  status: string;
  regularPrice: number;
  exclusivePrice: number;
  exclusiveOfferStartDate: string;
  exclusiveOfferEndDate: string;
  roomType: string;
  roomAmount: number;
  unitType: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  services: any[];
  gallery: {
    id: string;
    originalFileName: string;
    mimeType: string;
    uploadStatus: string;
    size: number;
    url: string;
  }[];
  featureImage: {
    id: string;
    originalFileName: string;
    mimeType: string;
    uploadStatus: string;
    size: number;
    url: string;
  };
  residence: {
    id: string;
    name: string;
    status: string;
    developmentStatus: string;
    subtitle: string;
    description: string;
    budgetStartRange: string;
    budgetEndRange: string;
    address: string;
    longitude: number;
    latitude: number;
    brand: {
      id: string;
      name: string;
      logo: {
        id: string;
      };
    };
  };
  about: string;
  bathrooms: string;
  bedroom: string;
  floor: string;
  transactionType: string;
  characteristics: any[];
  createdAt: string;
  updatedAt: string;
}

export interface UnitsResponse {
  data: Unit[];
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

export interface UnitType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface UnitTypesResponse {
  data: UnitType[];
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