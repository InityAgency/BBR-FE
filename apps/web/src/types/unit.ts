export interface Unit {
  id: string;
  name: string;
  description: string;
  slug: string;
  price: number;
  size: number;
  bedroom: number;
  bathrooms: number;
  status: string;
  type: string;
  floor: number;
  view: string;
  features: string[];
  exclusivePrice: number;
  surface: number;
  regularPrice: number;
  residence: {
    id: string;
    name: string;
    slug: string;
    brand: {
      id: string;
      name: string;
      logo: {
        id: string;
        originalFileName: string;
        mimeType: string;
        uploadStatus: string;
        size: number;
      };
    };
    address: string;
  };
  featureImage: {
    id: string;
    originalFileName: string;
    mimeType: string;
    uploadStatus: string;
    size: number;
  } | null;
  gallery?: Array<{
    id: string;
    originalFileName: string;
    mimeType: string;
    uploadStatus: string;
    size: number;
  }>;
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