export interface Amenity {
  featuredImage?: {
    id: string;
    originalFileName: string;
    mimeType: string;
    uploadStatus: string;
    size: number;
  } | null;
  id: string;
  name: string;
  description?: string;
  icon?: {
    id: string;
    originalFileName: string;
    mimeType: string;
    uploadStatus: string;
    size: number;
  } | null;
  createdAt: string;
  updatedAt: string;
} 