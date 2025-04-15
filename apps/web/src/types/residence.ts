import { Brand } from "./brand";

export interface Residence {
    id: string;
    name: string;
    address: string;
    city: {
        id: string;
        name: string;
    };
    country: {
        id: string;
        name: string;
    };
    developmentStatus: string;
    description: string;
    status: string;
    brandId: string;
    brand: Brand;
    featuredImage: string;
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