// app/schemas/brand.ts
import { z } from "zod";
import { BrandStatus } from "../types/models/Brand";

// Brand statuses
export const brandStatuses: BrandStatus[] = [
  "ACTIVE",
  "PENDING",
  "DELETED",
  "DRAFT"
];

// Brand type schema
export const brandTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable()
});

// Base schema for brand details
export const brandSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Brand name must be at least 2 characters").nonempty("Brand name is required"),
  description: z.string().optional(),
  brandTypeId: z.string({
    required_error: "Brand type is required"
  }),
  status: z.enum(brandStatuses as unknown as [string, ...string[]], {
    required_error: "Brand status is required"
  }),
  // For images, we handle them as nullable when submitting
  logo: z.any({
    required_error: "Brand logo is required"
  }), // Will be File in the frontend, but required for API
  registeredAt: z.string().optional(),
  brandType: brandTypeSchema.optional(),
});

// Return type for the schema
export type BrandFormValues = z.infer<typeof brandSchema>;

// Initial values for a new brand
export const initialBrandValues: Partial<BrandFormValues> = {
  name: "",
  description: "",
  brandTypeId: "",
  status: "DRAFT",
};