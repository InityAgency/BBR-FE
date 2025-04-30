import { z } from "zod";

export const amenitySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  icon: z.any().optional(),
  featuredImage: z.any().optional(), // Dodajemo polje za featuredImage u schemu
});

export type AmenityFormValues = z.infer<typeof amenitySchema>;

export const initialAmenityValues: AmenityFormValues = {
  name: "",
  description: "",
  icon: undefined,
  featuredImage: undefined, // Dodajemo inicijalne vrednosti
};