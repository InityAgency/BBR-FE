export interface Country {
    id: string;
    name: string;
    code: string;
  }
  
  export interface City {
    id: string;
    name: string;
    asciiName?: string;
    country?: Country;
    population?: number;
    timezone?: string;
    xCoordinate?: string;
    yCoordinate?: string;
    createdAt?: string;
    updatedAt?: string;
  }