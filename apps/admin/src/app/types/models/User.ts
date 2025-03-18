export type UserRole = {
  id: string;
  name: string;
};

export type UserStatus = "Active" | "Pending" | "Blocked" | "Deleted";

export interface User {
  id: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  company: string | null;
  role: UserRole;
  status?: UserStatus;
  createdAt: string;
  updatedAt: string;
}
