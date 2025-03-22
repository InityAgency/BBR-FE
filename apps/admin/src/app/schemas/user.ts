import { z } from "zod";
import { UserStatus } from "../types/models/User";

// User roles (može biti prošireno prema potrebama aplikacije)
export const userRoles = [
  "superadmin",
  "admin",
  "developer",
  "buyer"
] as const;

// User statuses
export const userStatuses: UserStatus[] = [
  "Active",
  "Invited",
  "Suspended"
];

// Base schema for common user details
const baseUserSchema = {
  id: z.string().optional(),
  fullName: z.string().min(3, "Full name must be at least 3 characters").nonempty("Full name is required"),
  email: z.string().email("Invalid email address").nonempty("Email address is required"),
  roleId: z.string({
    required_error: "User role is required"
  }),
  role: z.string().optional(),
  profileImage: z.string().nullable().optional(),
  sendEmail: z.boolean().default(true),
  status: z.enum(userStatuses as unknown as [string, ...string[]]).default("Invited"),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
};

// Schema for creating a new user (password is required)
export const createUserSchema = z.object({
  ...baseUserSchema,
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .nonempty("Password is required"),
});

// Schema for updating a user (password is optional)
export const updateUserSchema = z.object({
  ...baseUserSchema,
  password: z.union([
    z.string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    z.string().max(0) // Dozvoljava prazan string
  ]).optional(),
});

// Combined schema for compatibility with existing code
export const userSchema = z.union([createUserSchema, updateUserSchema]);

// Return types for schemas
export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
export type UserFormValues = CreateUserFormValues | UpdateUserFormValues;

// Initial values for a new user
export const initialUserValues: Partial<UserFormValues> = {
  fullName: "",
  email: "",
  roleId: "",
  role: "",
  password: "",
  profileImage: null,
  sendEmail: true,
  status: "",
};