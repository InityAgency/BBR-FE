"use client";

import React, { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Eye, Trash2 } from "lucide-react";
import { TableActions, TableAction } from "@/components/admin/Table/TableActions";
import { Review } from "../../../../app/types/models/Review";
import { reviewsService } from "@/lib/api/services/reviews.service";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ReviewsActionsProps {
  row: Row<Review>;
  onRefresh: (page: number) => Promise<void>;
  currentPage: number;
  onViewDetails: (review: Review) => void;
}

const getStatusBadgeStyle = (status: string) => {
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

export function ReviewsActions({ row, onRefresh, currentPage, onViewDetails }: ReviewsActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Review["status"]>(row.original.status);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Lokalno stanje za status - inicijalno postaviti na review.status
  const [currentStatus, setCurrentStatus] = useState<Review["status"]>(row.original.status);

  const handleStatusChange = async (newStatus: Review["status"]) => {
    try {
      setIsUpdatingStatus(true);
      
      // Optimistično ažuriranje - odmah postaviti novi status
      setCurrentStatus(newStatus);
      
      const response = await reviewsService.updateReviewStatus(row.original.id, newStatus);

      toast.success("Review status updated successfully");
      await onRefresh(currentPage);
    } catch (error) {
      console.error("Error updating review status:", error);
      
      // Ako zahtev neuspešan, vrati stari status
      setCurrentStatus(row.original.status);
      toast.error("Failed to update review status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      await reviewsService.deleteReview(row.original.id);

      toast.success("Review deleted successfully");
      await onRefresh(currentPage);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    } finally {
      setIsDeleting(false);
    }
  };

  const allowedStatuses: Review["status"][] = ["PENDING", "ACTIVE", "REJECTED", "FLAGGED", "ARCHIVED"];

  const renderStatusBadge = () => (
    <div className="flex items-center gap-2">
      <Select
        onValueChange={handleStatusChange}
        value={currentStatus}
        disabled={isUpdatingStatus}
      >
        <SelectTrigger className="w-auto border-0 p-0 h-auto hover:bg-transparent focus:ring-0">
          <Badge
            variant="outline"
            className={`${getStatusBadgeStyle(currentStatus)} px-4 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer hover:opacity-80 ${
              isUpdatingStatus ? 'opacity-50' : ''
            }`}
          >
            {isUpdatingStatus ? 'Updating...' : currentStatus}
          </Badge>
        </SelectTrigger>
        <SelectContent>
          {allowedStatuses.map((status) => (
            <SelectItem
              key={status}
              value={status}
              className="text-sm"
            >
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <>
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onViewDetails(row.original)}
          className="h-8 w-8"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsDeleteDialogOpen(true)}
          className="h-8 w-8 text-destructive hover:text-destructive"
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this review?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the review
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-white hover:bg-destructive/80 transition-colors cursor-pointer"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}