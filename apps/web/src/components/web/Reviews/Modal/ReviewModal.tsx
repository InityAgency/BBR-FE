"use client";

import React from "react";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Review } from "@/types/review";
import { MapPin, Calendar, User, Home, Eye } from "lucide-react";

interface ReviewModalProps {
    review: Review | null;
    isOpen: boolean;
    onClose: () => void;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "PENDING":
            return "bg-yellow-900/55 text-yellow-300";
        case "ARCHIVED":
            return "bg-gray-900/55 text-gray-300";
        case "APPROVED":
            return "bg-green-900/55 text-green-300";
        case "REJECTED":
            return "bg-red-900/55 text-red-300";
        default:
            return "bg-blue-900/55 text-blue-300";
    }
};

const RatingBar = ({ label, value }: { label: string; value: number }) => (
    <div className="flex flex-col gap-1 w-full">
        <div className="flex flex-row items-center justify-between w-full">
            <span className="text-sm font-medium">{label}</span>
            <span className="text-muted-foreground text-sm">{value} / 10</span>
        </div>
        <div className="flex flex-row gap-1 mt-1 w-full mb-1">
            {Array.from({ length: 10 }).map((_, idx) => (
                <div
                    key={idx}
                    className={`h-2.5 w-full rounded-full transition-colors duration-100 ${idx < value ? 'bg-primary' : 'bg-muted-foreground/30'
                        }`}
                />
            ))}
        </div>
    </div>
);

export function ReviewModal({ review, isOpen, onClose }: ReviewModalProps) {
    if (!review) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="min-w-[70vw] w-full max-h-[80svh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-4 ">
                        <DialogTitle className="text-xl text-sans font-semibold">Review Details</DialogTitle>
                        <Badge
                            variant="secondary"
                            className={`${getStatusColor(review.status)} transition-colors px-2 py-1`}
                        >
                            {review.status}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* First Row - User Info and Review Info */}
                    <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <User className="h-4 w-4" />
                            <h3 className="font-semibold text-sans">User Information</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div><strong className="text-muted-foreground">Name: </strong> {review.user.fullName}</div>
                            <div><strong className="text-muted-foreground">Email: </strong> {review.user.email}</div>
                        </div>
                    </div>

                    <div className="border rounded-lg p-4">
                        <h3 className="font-bold mb-3 text-sans">Review Information</h3>
                        <div className="space-y-2 text-sm">
                            <div><strong className="text-muted-foreground">Created:</strong> {format(new Date(review.createdAt), "dd/MM/yyyy HH:mm")}</div>
                            <div><strong className="text-muted-foreground">Updated:</strong> {format(new Date(review.updatedAt), "dd/MM/yyyy HH:mm")}</div>
                            {review.deletedAt && (
                                <div><strong className="text-muted-foreground">Deleted:</strong> {format(new Date(review.deletedAt), "dd/MM/yyyy HH:mm")}</div>
                            )}
                        </div>
                    </div>

                    {/* Second Row - Purchase Details and Residence Info */}
                    <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar className="h-4 w-4" />
                            <h3 className="font-semibold text-sans">Purchase Details</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div><strong className="text-muted-foreground">Purchase Date:</strong> {format(new Date(review.dateOfPurchase), "dd/MM/yyyy")}</div>
                            <div><strong className="text-muted-foreground">Unit Type:</strong> {review.unitType.name}</div>
                            <div><strong className="text-muted-foreground">Primary Residence:</strong> {review.isPrimaryResidence ? "Yes" : "No"}</div>
                            <div><strong className="text-muted-foreground">Verified Owner/Tenant:</strong> {review.verifiedOwnerOrTenant ? "Yes" : "No"}</div>
                        </div>
                    </div>

                    <div className="border rounded-lg p-4">
                        <div className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2 mb-3">
                                <Home className="h-4 w-4" />
                                <h3 className="font-semibold text-sans">Residence</h3>
                            </div>
                            <Button variant="ghost" size="sm" onClick={onClose}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Review
                            </Button>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div><strong className="text-muted-foreground">Name:</strong> {review.residence.name}</div>
                            <div><strong className="text-muted-foreground">Status:</strong> {review.residence.status}</div>
                            <div><strong className="text-muted-foreground">Development Status:</strong> {review.residence.developmentStatus}</div>
                            <div className="flex items-start gap-1">
                                <MapPin className="h-3 w-3 mt-1 text-muted-foreground flex-shrink-0" />
                                <span>{review.residence.address}</span>
                            </div>
                        </div>
                    </div>

                    {/* Third Row - Ratings and Additional Feedback */}
                    <div className="border rounded-lg p-4">
                        <h3 className="font-bold mb-4 text-sans">Ratings</h3>
                        <div className="space-y-4">
                            <RatingBar label="Build Quality" value={review.buildQuality} />
                            <RatingBar label="Purchase Experience" value={review.purchaseExperienceRating} />
                            <RatingBar label="Amenities" value={review.amenities} />
                            <RatingBar label="Neighbourhood & Location" value={review.neighbourhoodLocation} />
                            <RatingBar label="Value for Money" value={review.valueForMoney} />
                            <RatingBar label="Service Quality" value={review.serviceQuality} />
                        </div>
                    </div>

                    {review.additionalFeedback && (
                        <div className="border rounded-lg p-4">
                            <h3 className="font-bold mb-3 text-sans">Additional Feedback</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {review.additionalFeedback}
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}