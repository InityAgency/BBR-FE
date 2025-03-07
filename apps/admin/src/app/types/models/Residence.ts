export type ResidenceStatus = "Pending" | "Active" | "Deleted" | "Draft";

export interface Residence {
  id: string;
  name: string;
  location: string;
  contact: string;
  contactEmail?: string;
  contactPhone?: string;
  developer: string;
  developerCode?: string;
  createdAt: string;
  updatedAt: string;
  status: ResidenceStatus;
}