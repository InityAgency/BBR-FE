export interface Country {
    id: string;
    name: string;
    code: string;
}

export interface City {
    id: string;
    name: string;
    asciiName: string;
    country: Country;
    population: number;
    timezone: string;
    xCoordinate: string;
    yCoordinate: string;
}

export interface CityPagination {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
}

export interface CityApiResponse {
    data: City[];
    statusCode: number;
    message: string;
    pagination: CityPagination;
    timestamp: string;
    path: string;
}