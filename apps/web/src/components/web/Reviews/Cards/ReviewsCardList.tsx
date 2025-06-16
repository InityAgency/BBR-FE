"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";
import { ReviewModal } from "../Modal/ReviewModal";

import { Review } from "@/types/review";

interface ReviewsCardListProps {
  reviews: Review[];
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

export function ReviewsCardList({ reviews }: ReviewsCardListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg">{review.residence.name}</h3>
              <p className="text-sm text-muted-foreground">{review.user.fullName}</p>
            </div>
            <Badge 
              variant="secondary"
              className={`${getStatusColor(review.status)} transition-colors`}
            >
              {review.status}
            </Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Created: {format(new Date(review.createdAt), "dd/MM/yyyy")}
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-muted-foreground">
              ID: {review.id}
            </div>
            <>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => setIsModalOpen(true)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      <ReviewModal
        review={review}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
          </div>
        </div>
      ))}
    </div>
  );
}