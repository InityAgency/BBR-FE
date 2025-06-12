import { z } from "zod";

// Enums
export const ResidenceStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
} as const;

export const DevelopmentStatus = {
  PLANNED: "PLANNED",
  UNDER_CONSTRUCTION: "UNDER_CONSTRUCTION",
  COMPLETED: "COMPLETED",
} as const;

export const RentalPotential = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;

// Country Schema
export const countrySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  code: z.string(),
  tld: z.string(),
  currencyCode: z.string(),
  currencyName: z.string(),
  currencySymbol: z.string(),
  capital: z.string(),
  subregion: z.string(),
  flag: z.string().url(),
});

// City Schema
export const citySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  asciiName: z.string(),
  population: z.number(),
  timezone: z.string(),
  xCoordinate: z.string(),
  yCoordinate: z.string(),
});

// Key Feature Schema
export const keyFeatureSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
});

// Brand Logo Schema
export const logoSchema = z.object({
  id: z.string().uuid().optional(),
  originalFileName: z.string(),
  mimeType: z.string(),
  uploadStatus: z.string(),
  size: z.number(),
});

// Brand Schema
export const brandSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string(),
  status: z.string(),
  logo: logoSchema.optional(),
});

// Amenity Schema
export const amenitySchema = z.object({
  id: z.string(),
  name: z.string(),
  // ... any other fields
});

// Highlighted Amenity Schema
export const highlightedAmenitySchema = z.object({
  id: z.string(),
  order: z.number()
});

// Main Residence Schema
export const residenceSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  status: z.enum(["DRAFT", "ACTIVE", "DELETED", "PENDING"]).default("ACTIVE"),
  developmentStatus: z.enum(Object.keys(DevelopmentStatus) as [string, ...string[]]),
  subtitle: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  budgetStartRange: z.coerce.number().min(0, "Enter a valid starting budget"),
  budgetEndRange: z.coerce.number().min(0, "Enter a valid ending budget"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  latitude: z.string(),
  longitude: z.string(),
  countryId: z.string().min(1, "Country is required"),
  cityId: z.string().min(1, "City is required"),
  country: countrySchema,
  city: citySchema,
  brandId: z.string().min(1, "Brand is required"),
  brand: brandSchema.optional(),
  rentalPotential: z.enum(Object.keys(RentalPotential) as [string, ...string[]]).optional(),
  websiteUrl: z.string().url("Enter a valid URL").or(z.string().length(0)),
  yearBuilt: z.string().optional(),
  floorSqft: z.string().optional(),
  staffRatio: z.number().optional(),
  avgPricePerUnit: z.string().optional(),
  avgPricePerSqft: z.string().optional(),
  petFriendly: z.boolean().optional(),
  disabledFriendly: z.boolean().optional(),
  videoTourUrl: z.string().url().optional().nullable(),
  // videoTour: z.any().optional().nullable(),
  featuredImageId: z.any().optional().nullable(),
  keyFeatures: z.array(keyFeatureSchema).optional(),
  amenities: z.array(amenitySchema).optional(),
  highlightedAmenities: z.array(highlightedAmenitySchema)
    .max(3, "You can select up to 3 highlighted amenities")
    .optional(),
  // units: z.array(z.any()).optional(),
  // company: z.any().optional().nullable(),
  mainGallery: z.array(z.any()).optional(),
});

export type ResidenceFormValues = z.infer<typeof residenceSchema>;

export const initialResidenceValues: ResidenceFormValues = {
  name: "",
  status: "ACTIVE",
  developmentStatus: "PLANNED",
  subtitle: "",
  description: "",
  budgetStartRange: 0,
  budgetEndRange: 0,
  address: "",
  latitude: "0",
  longitude: "0",
  countryId: "",
  cityId: "",
  brandId: "",
  country: {
    name: "",
    code: "",
    tld: "",
    currencyCode: "",
    currencyName: "",
    currencySymbol: "",
    capital: "",
    subregion: "",
    flag: "",
  },
  city: {
    name: "",
    asciiName: "",
    population: 0,
    timezone: "",
    xCoordinate: "",
    yCoordinate: "",
  },
  rentalPotential: "MEDIUM",
  websiteUrl: "",
  yearBuilt: "",
  floorSqft: "0.00",
  staffRatio: 0,
  avgPricePerUnit: "0.00",
  avgPricePerSqft: "0.00",
  petFriendly: false,
  disabledFriendly: false,
  videoTourUrl: null,
  // videoTour: null,
  featuredImageId: null,
  keyFeatures: [],
  amenities: [],
  highlightedAmenities: [],
  brand: undefined,
  // units: [],
  // company: null,
  mainGallery: [],
};

const residence = {
  residenceSchema,
  initialResidenceValues,
  ResidenceStatus,
  DevelopmentStatus,
  RentalPotential,
};

export default residence;
