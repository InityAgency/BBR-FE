// app/types/models/Brand.ts

export type BrandStatus = "ACTIVE" | "PENDING" | "DELETED" | "DRAFT";

interface BrandType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface Logo {
  id: string;
  originalFileName: string;
  mimeType: string;
  uploadStatus: string;
  size: number;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
  status: BrandStatus;
  registeredAt: string;
  brandTypeId: string;
  brandType: BrandType;
  logo?: Logo;
}