import { z } from "zod";

export const lifestyleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  image: z.string().optional(),
});

export type LifestyleFormValues = z.infer<typeof lifestyleSchema>;

export const initialLifestyleValues: LifestyleFormValues = {
  name: "",
  image: undefined,
};
