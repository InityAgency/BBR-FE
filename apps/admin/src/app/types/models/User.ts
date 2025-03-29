export type UserRole = {
  id: string;
  name: string;
};

export type UserStatus = "ACTIVE" | "INACTIVE" | "INVITED" ;

export interface User {
  id: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  company: string | null;
  profileImage: string | null;
  role: UserRole;
  status?: UserStatus;
  createdAt: string;
  updatedAt: string;
}
