export type AmenityStatus = "ACTIVE" | "PENDING" | "DELETED" | "DRAFT";

interface AmenityType {
  id: string;
  name: string;
  createdAt: string;
}

interface Icon {
  id: string;
  originalFileName: string;
  mimeType: string;
  uploadStatus: string;
  size: number;
}

export interface Amenity {
  status(status: any): import("react").ReactNode;
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}