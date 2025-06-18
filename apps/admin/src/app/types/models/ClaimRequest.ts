import { ReactNode } from "react";

// Ispravljeni tip statusa na osnovu API odgovora
export type ClaimRequestStatus = "NEW" | "ACCEPTED" | "REJECTED";

// Dodano za phoneCode strukturu
export interface PhoneCode {
  id: string;
  code: string;
  country: {
    id: string;
    name: string;
    flag: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Dodano za CV strukturu
export interface CV {
  id: string;
  originalFileName: string;
  mimeType: string;
  uploadStatus: string;
  size: number;
}

// Dodano za residence strukturu
export interface Residence {
  id: string;
  name: string;
  slug: string;
  status: string;
  developmentStatus: string;
  subtitle: string;
  description: string;
  budgetStartRange: string;
  budgetEndRange: string;
  address: string;
  longitude: number;
  latitude: number;
  featuredImage: string | null;
}

// Dodano za createdBy strukturu
export interface CreatedBy {
  id: string;
  fullName: string;
  email: string;
}

// Ispravljeni ClaimRequest tip na osnovu API odgovora
export interface ClaimRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string; // Promenjeno sa 'phone' na 'phoneNumber'
  phoneCode: PhoneCode; // Dodano
  websiteUrl: string; // Dodano
  cv: CV; // Dodano
  status: ClaimRequestStatus;
  residence: Residence | null; // Može biti null
  createdBy: CreatedBy | null; // Može biti null
  createdAt: string;
  updatedAt: string;
}

export interface ClaimRequestsApiResponse {
  data: ClaimRequest[];
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