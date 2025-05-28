import { z } from "zod";

// Enums
export const UnitStatus = {
  ACTIVE: "ACTIVE",
  PENDING: "PENDING", 
  SOLD: "SOLD",
  RESERVED: "RESERVED",
  DRAFT: "DRAFT"
} as const;

export const TransactionType = {
  SALE: "SALE",
  RENT: "RENT"
} as const;

export const ServiceAmountType = {
  DAILY: "DAILY",
  WEEKLY: "WEEKLY", 
  MONTHLY: "MONTHLY"
} as const;

// Service type schema
export const serviceTypeSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  amount: z.enum(["DAILY", "WEEKLY", "MONTHLY"])
});

export type UnitStatusType = typeof UnitStatus[keyof typeof UnitStatus];

// Unit schema
export const unitSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Unit name must be at least 2 characters").max(100, "Unit name must be less than 100 characters"),
  description: z.string().optional(),
  surface: z.number().min(0, "Surface must be positive").optional(),
  status: z.enum(["ACTIVE", "PENDING", "SOLD", "RESERVED", "DRAFT"]),
  regularPrice: z.number().min(0, "Regular price must be positive"),
  exclusivePrice: z.number().min(0, "Exclusive price must be positive").optional(),
  exclusiveOfferStartDate: z.string().optional(),
  exclusiveOfferEndDate: z.string().optional(),
  roomType: z.string().optional(),
  roomAmount: z.number().min(0, "Room amount must be positive").optional(),
  unitTypeId: z.string().min(1, "Unit type is required"),
  services: z.array(serviceTypeSchema).optional().default([]), // Promenjen sa serviceType na services
  about: z.string().optional(),
  bathrooms: z.string().optional(),
  bedroom: z.string().optional(),
  floor: z.string().optional(),
  transactionType: z.enum(["SALE", "RENT"]),
  characteristics: z.array(z.string()).optional().default([]),
  residenceId: z.string().min(1, "Residence ID is required"),
  // Media fields
  galleryMediaIds: z.array(z.string()).optional().default([]),
  featureImageId: z.string().optional(),
}).refine((data) => {
  // If exclusive offer dates are provided, both must be present
  if (data.exclusiveOfferStartDate || data.exclusiveOfferEndDate) {
    return data.exclusiveOfferStartDate && data.exclusiveOfferEndDate;
  }
  return true;
}, {
  message: "Both start and end dates are required for exclusive offers",
  path: ["exclusiveOfferEndDate"]
}).refine((data) => {
  // If exclusive offer dates are provided, end date must be after start date
  if (data.exclusiveOfferStartDate && data.exclusiveOfferEndDate) {
    return new Date(data.exclusiveOfferEndDate) > new Date(data.exclusiveOfferStartDate);
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["exclusiveOfferEndDate"]
});

export type UnitFormValues = z.infer<typeof unitSchema>;

export const initialUnitValues: Partial<UnitFormValues> = {
  id: undefined,
  name: "",
  description: "",
  surface: undefined,
  status: "ACTIVE",
  regularPrice: 0,
  exclusivePrice: undefined,
  exclusiveOfferStartDate: "",
  exclusiveOfferEndDate: "",
  roomType: "",
  roomAmount: undefined,
  unitTypeId: "",
  services: [], 
  about: "",
  bathrooms: "",
  bedroom: "",
  floor: "",
  transactionType: "SALE",
  characteristics: [],
  residenceId: "",
  galleryMediaIds: [],
  featureImageId: "",
};