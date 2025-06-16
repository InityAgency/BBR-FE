"use client";

import React, { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Review } from "@/types/review";
import { ReviewModal } from "../Modal/ReviewModal";

interface ReviewsActionsProps {
  row: Row<Review>;
}

export function ReviewsActions({ row }: ReviewsActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => setIsModalOpen(true)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      <ReviewModal
        review={row.original}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}