export type RankingCategoryStatus = "ACTIVE" | "DELETED" | "DRAFT";

export interface RankingCategoryType {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RankingCategoryImage {
  id: string;
  originalFileName: string;
  mimeType: string;
  uploadStatus: string;
  size: number;
}

export interface RankingCategory {
  id: string;
  name: string;
  description?: string;
  status: RankingCategoryStatus;
  rankingCategoryType: RankingCategoryType;
  residenceLimitation: number;
  rankingPrice: string; // Promenjeno u string jer API vraća "1000.00" format
  featuredImage?: RankingCategoryImage | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface RankingCategoryFormData {
  id?: string;
  name: string;
  description?: string;
  status: RankingCategoryStatus;
  rankingCategoryTypeId: string;
  residenceLimitation: number;
  rankingPrice: number; // Ovde ostaje number jer u formi koristimo numerički input
  featuredImageId?: string | File;
}

// Interface za API response
export interface RankingCategoryApiResponse {
  data: RankingCategory[];
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

// Interface za pojedinačan API response
export interface SingleRankingCategoryApiResponse {
  data: RankingCategory;
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}