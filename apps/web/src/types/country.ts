export interface Country {
    id: string;
    name: string;
    code: string;
}

export interface CountryPagination {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
}

export interface CountryApiResponse {
    data: Country[];
    statusCode: number;
    message: string;
    pagination: CountryPagination;
    timestamp: string;
    path: string;
}