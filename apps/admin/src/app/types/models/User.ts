export type UserRole = {
  id: string;
  name: string;
};

export type UserStatus = "ACTIVE" | "INACTIVE" | "INVITED" ;

export type Company = {
  id: string;
  name: string;
  address: string;
  image?: any;
  phoneNumber?: string;
  phoneNumberCountryCode?: string | null;
  website?: string;
  contactPersonAvatar?: any;
  contactPersonFullName?: string;
  contactPersonJobTitle?: string;
  contactPersonEmail?: string;
  contactPersonPhoneNumber?: string;
  contactPersonPhoneNumberCountryCode?: string | null;
};

export interface User {
  id: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  company: string | Company | null;
  profileImage: string | null;
  role: UserRole;
  status?: UserStatus;
  createdAt: string;
  updatedAt: string;
}
