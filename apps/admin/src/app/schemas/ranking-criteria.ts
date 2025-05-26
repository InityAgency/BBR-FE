import { z } from "zod";

// Ranking Criteria schema
export const rankingCriteriaSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  
  isDefault: z.boolean(),
});

// API interface
export interface RankingCriteriaData {
  id: string;
  name: string;
  description?: string | null;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Form values type
export type RankingCriteriaFormValues = z.infer<typeof rankingCriteriaSchema>;

// Initial values for form
export const initialRankingCriteriaValues: RankingCriteriaFormValues = {
  name: "",
  description: "",
  isDefault: false,
};