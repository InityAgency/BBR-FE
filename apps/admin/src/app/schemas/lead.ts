import { z } from "zod";

// Contact method enum - samo EMAIL, PHONE, WHATSAPP
export const ContactMethodEnum = z.enum([
  "EMAIL",
  "PHONE", 
  "WHATSAPP"
]);

// Lead status enum
export const LeadStatusEnum = z.enum([
  "NEW",
  "CONTACTED", 
  "QUALIFIED",
  "WON",
  "LOST",
  "INACTIVE"
]);

// Lead schema for form validation (bez status polja)
export const leadSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  
  email: z
    .string()
    .email("Please enter a valid email address"),
  
  phone: z
    .string()
    .min(5, "Phone number must be at least 5 characters")
    .max(20, "Phone number must be less than 20 characters")
    .optional()
    .or(z.literal("")),
  
  // Samo string array - ne ContactMethod enum
  preferredContactMethod: z
    .array(z.string())
    .min(1, "Please select at least one contact method"),
  
  status: LeadStatusEnum.optional(),
});

// Extended type that includes API fields (status samo za API, ne za formu)
export interface LeadFormData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  preferredContactMethod: string[] | null;
  status?: LeadStatus;
  createdAt?: string;
  updatedAt?: string;
}

// TypeScript types
export type LeadFormValues = z.infer<typeof leadSchema>;
export type ContactMethod = z.infer<typeof ContactMethodEnum>;
export type LeadStatus = z.infer<typeof LeadStatusEnum>;

// Initial values for form
export const initialLeadValues: LeadFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  preferredContactMethod: [],
  status: "NEW",
};