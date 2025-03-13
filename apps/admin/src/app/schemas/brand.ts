// app/schemas/brand.ts
import { z } from "zod";

// Brand types from the existing brand model
export const brandTypes = [
  "Luxury Hotel Resort",
  "Fashion and Lifestyle",
  "Residential",
  "Commercial"
] as const;

// Base schema for brand details
export const brandSchema = z.object({
  name: z.string().min(2, "Brand name must be at least 2 characters").nonempty("Brand name is required"),
  description: z.string().optional(),
  type: z.enum(brandTypes as unknown as [string, ...string[]], {
    required_error: "Brand type is required"
  }),
  // For images, we handle them as nullable when submitting
  logo: z.any({
    required_error: "Brand logo is required"
  }), // Will be File in the frontend, but required for API
  featuredImage: z.any().optional(), // Will be File in the frontend, but optional for API
});

// Return type for the schema
export type BrandFormValues = z.infer<typeof brandSchema>;

// Initial values for a new brand
export const initialBrandValues: Partial<BrandFormValues> = {
  name: "",
  description: "",
  type: undefined,
};