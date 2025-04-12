export interface Brand {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  brandType: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
  logo: {
    id: string;
    originalFileName: string;
    mimeType: string;
    uploadStatus: string;
    size: number;
  };
}

export interface BrandsResponse {
  data: Brand[];
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