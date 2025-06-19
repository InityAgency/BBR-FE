"use client";

import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Calendar } from "lucide-react";
import { Review } from "../../../../app/types/models/Review";
import { ReviewsActions } from "../Table/ReviewsActions";

interface ReviewsCardListProps {
  reviews: Review[];
  onViewDetails: (review: Review) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-900/55 text-yellow-300";
    case "ACTIVE":
      return "bg-green-900/55 text-green-300";
    case "REJECTED":
      return "bg-red-900/55 text-red-300";
    case "FLAGGED":
      return "bg-orange-900/55 text-orange-300";
    case "ARCHIVED":
      return "bg-gray-900/80 text-gray-300";
    default:
      return "bg-blue-900/55 text-blue-300";
  }
};

export function ReviewsCardList({ reviews, onViewDetails }: ReviewsCardListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No reviews found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border rounded-md p-4 space-y-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <Badge 
              variant="outline"
              className={getStatusColor(review.status)}
            >
              {review.status}
            </Badge>
            <ReviewsActions 
              row={{ original: review } as any}
              onRefresh={async () => { } }
              onViewDetails={onViewDetails} currentPage={0}            />
          </div>
          <div className="flex items-start justify-between mb-2 border-b border-border pb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">
                <a href={`#`} className="hover:underline">
                  {review.residence.name}
                </a>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5"># {review.id}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm mt-3 mb-3 border-b border-border pb-2">
              <span className="text-muted-foreground">{review.user.fullName} - {review.user.email}</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{format(new Date(review.dateOfPurchase), "dd/MM/yyyy")}</span>
              </div>
              <div className="text-muted-foreground">
                {review.unitType.name} • Quality: {review.buildQuality}/10
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}