"use client";

import React, { useState } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { ClaimRequest, ClaimRequestStatus } from "@/app/types/models/ClaimRequest";

interface ClaimRequestHeaderProps {
  request: ClaimRequest;
  onStatusChange: (status: string) => Promise<void>;
  onDelete: () => Promise<void>;
  isProcessing: boolean;
}

const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case "NEW":
      return "bg-blue-900/20 hover:bg-blue-900/40 text-blue-300 border-blue-900/50";
    case "ACCEPTED":
      return "bg-green-900/20 hover:bg-green-900/40 text-green-300 border-green-900/50";
    case "REJECTED":
      return "bg-red-900/20 hover:bg-red-900/40 text-red-300 border-red-900/50";
    default:
      return "bg-gray-900/20 hover:bg-gray-900/40 text-gray-300 border-gray-900/50";
  }
};

export function ClaimRequestHeader({ 
  request, 
  onStatusChange, 
  onDelete, 
  isProcessing 
}: ClaimRequestHeaderProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Lokalno stanje za status - inicijalno postaviti na request.status
  const [currentStatus, setCurrentStatus] = useState<ClaimRequestStatus>(request.status);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsUpdatingStatus(true);
      
      // Optimistično ažuriranje - odmah postaviti novi status
      setCurrentStatus(newStatus as ClaimRequestStatus);
      
      await onStatusChange(newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
      
      // Ako zahtev neuspešan, vrati stari status
      setCurrentStatus(request.status);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const allowedStatuses: ClaimRequestStatus[] = ["NEW", "ACCEPTED", "REJECTED"];

  const renderStatusBadge = () => (
    <div className="flex items-center gap-2">
      <Select
        onValueChange={handleStatusChange}
        value={currentStatus}
        disabled={isUpdatingStatus || isProcessing}
      >
        <SelectTrigger className="w-auto border-0 p-0 h-auto hover:bg-transparent focus:ring-0">
          <Badge
            className={`${getStatusBadgeStyle(currentStatus)} px-4 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer hover:opacity-80 ${
              isUpdatingStatus || isProcessing ? 'opacity-50' : ''
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
      <div className="flex flex-col gap-6 mb-8">
  
        {/* Header with title, status selector, and delete */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">
              Claim Request Details
            </h1>
            
            {renderStatusBadge()}
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isProcessing}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Claim Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this claim request? This action cannot be undone and will permanently remove the request from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}