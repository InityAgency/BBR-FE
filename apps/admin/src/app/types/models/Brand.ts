// app/types/models/Brand.ts

export type BrandStatus = "Active" | "Pending" | "Deleted" | "Draft";
export type BrandType = "Luxury Hotel Resort" | "Fashion and Lifestyle" | "Residential" | "Commercial";

export interface Brand {
  id: string;
  name: string;
  type: BrandType;
  numberOfResidences: number;
  updatedAt: string;
  status: BrandStatus;
}