export interface UnitType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResidenceInfo {
  id: string;
  name: string;
  status: "ACTIVE" | "DELETED" | "INACTIVE";
  developmentStatus: "PLANNED" | "COMPLETED" | "IN_PROGRESS";
  subtitle: string;
  description: string;
  budgetStartRange: string;
  budgetEndRange: string;
  address: string;
  longitude: number;
  latitude: number;
}

export interface UserInfo {
  id: string;
  fullName: string;
  email: string;
}

export interface Review {
  id: string;
  residence: ResidenceInfo;
  user: UserInfo;
  dateOfPurchase: string;
  unitType: UnitType;
  isPrimaryResidence: boolean;
  verifiedOwnerOrTenant: boolean;
  buildQuality: number; // 1-10 rating
  purchaseExperienceRating: number; // 1-10 rating
  amenities: number; // 1-10 rating
  neighbourhoodLocation: number; // 1-10 rating
  valueForMoney: number; // 1-10 rating
  serviceQuality: number; // 1-10 rating
  additionalFeedback: string;
  status: "PENDING" | "ACTIVE" | "REJECTED" | "FLAGGED" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ReviewsResponse {
  data: Review[];
  statusCode: number;
  message: string;
  pagination: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
  timestamp: string;
  path: string;
}

// Additional types for filtering and sorting
export type ReviewStatus = "PENDING" | "ACTIVE" | "REJECTED" | "FLAGGED" | "ARCHIVED";
export type DevelopmentStatus = "PLANNED" | "COMPLETED" | "IN_PROGRESS";
export type ResidenceStatus = "ACTIVE" | "DELETED" | "INACTIVE";