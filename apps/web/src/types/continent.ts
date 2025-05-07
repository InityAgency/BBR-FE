// types/continent.ts

export interface Continent {
    id: string;
    name: string;
    slug?: string;
    code?: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface ContinentApiResponse {
    data: Continent[];
    statusCode: number;
    message: string;
    pagination?: {
      total: number;
      totalPages: number;
      page: number;
      limit: number;
    };
    timestamp?: string;
    path?: string;
  }