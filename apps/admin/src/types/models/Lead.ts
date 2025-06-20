export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  phone: string | null;
  preferredContactMethod: string[] | null;
  createdAt: string;
  updatedAt: string;
  requests: any[];
} 