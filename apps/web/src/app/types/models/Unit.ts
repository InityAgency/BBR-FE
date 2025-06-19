export interface Unit {
    id: string;
    name: string;
    regularPrice: number;
    exclusivePrice?: number;
    exclusiveOfferStartDate?: string;
    exclusiveOfferEndDate?: string;
    status: "ACTIVE" | "INACTIVE" | "SOLD" | "RESERVED" | "DRAFT" | "PENDING";
    updatedAt: string;
    createdAt: string;
} 