export interface UnitType {
  id: string;
  name: string;
}

export interface ResidenceInfo {
  id: string;
  name: string;
  city: string;
  country: string;
  status: "ACTIVE" | "DELETED" | "INACTIVE";
  developmentStatus: "PLANNED" | "COMPLETED" | "IN_PROGRESS";
  address: string;
}

export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
}

export interface Review {
  unitType: any;
  id: string;
  rating: number;
  content: string;
  title: string | undefined;
  residence: ResidenceInfo;
  unit?: UnitType;
  user: UserInfo;
  createdAt: string;
  updatedAt: string;
  status: "PENDING" | "REJECTED" | "FLAGGED" | "ARCHIVED" | "ACTIVE";
  dateOfPurchase: string;
  isPrimaryResidence: boolean;
  verifiedOwnerOrTenant: boolean;
  buildQuality: number;
  purchaseExperienceRating: number;
  amenities: number;
  neighbourhoodLocation: number;
  valueForMoney: number;
  serviceQuality: number;
  additionalFeedback: string;
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
export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED" | "ARCHIVED";
export type DevelopmentStatus = "PLANNED" | "COMPLETED" | "IN_PROGRESS";
export type ResidenceStatus = "ACTIVE" | "DELETED" | "INACTIVE"; 