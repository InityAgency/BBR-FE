export interface Unit {
    id: string;
    name: string;
    price: number;
    status: "ACTIVE" | "INACTIVE";
    updatedAt: string;
    createdAt: string;
    regularPrice: number;
    exclusivePrice: number;
} 