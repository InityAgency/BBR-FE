"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { B2BFormSubmission } from "@/app/types/models/B2BFormSubmission";
import { formatDate } from "@/lib/formatters";
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Globe, 
  Home, 
  Calendar,
  ExternalLink,
  Copy,
  Trash2,
} from "lucide-react";
import { B2BFormSubmissionStatus, b2bFormSubmissionsService } from "@/lib/api/services/b2b-form-submissions.service";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface B2BFormSubmissionDetailsModalProps {
  submission: B2BFormSubmission | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: () => void;
}

export function B2BFormSubmissionDetailsModal({
  submission,
  isOpen,
  onClose,
  onStatusChange,
}: B2BFormSubmissionDetailsModalProps) {
  const [currentStatus, setCurrentStatus] = useState<B2BFormSubmissionStatus | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Inicijalizuj status kada se submission promeni
  useEffect(() => {
    if (submission) {
      setCurrentStatus(submission.status);
    }
  }, [submission]);

  if (!submission) return null;

  const allowedStatuses: B2BFormSubmissionStatus[] = [
    B2BFormSubmissionStatus.NEW,
    B2BFormSubmissionStatus.CONTACTED,
    B2BFormSubmissionStatus.COMPLETED,
  ];

  const getStatusColor = (status: B2BFormSubmissionStatus) => {
    switch (status) {
      case B2BFormSubmissionStatus.NEW:
        return "bg-blue-900/55 text-blue-300";
      case B2BFormSubmissionStatus.CONTACTED:
        return "bg-yellow-900/55 text-yellow-300";
      case B2BFormSubmissionStatus.COMPLETED:
        return "bg-green-900/55 text-green-300";
      default:
        return "bg-blue-900/55 text-blue-300";
    }
  };

  const handleStatusChange = async (newStatus: B2BFormSubmissionStatus) => {
    if (!submission || newStatus === currentStatus) return;

    try {
      setIsUpdatingStatus(true);

      // Optimistično ažuriranje
      setCurrentStatus(newStatus);

      await b2bFormSubmissionsService.updateB2BFormSubmissionStatus(submission.id, newStatus);

      toast.success("B2B form submission status updated successfully");
      onStatusChange?.();
    } catch (error) {
      console.error("Error updating B2B form submission status:", error);

      // Ako zahtev neuspešan, vrati stari status
      setCurrentStatus(submission.status);
      toast.error("Failed to update B2B form submission status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!submission) return;

    setIsDeleting(true);
    try {
      await b2bFormSubmissionsService.deleteB2BFormSubmission(submission.id);
      toast.success("B2B form submission deleted successfully");
      onStatusChange?.(); // Refresh the list
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error deleting B2B form submission:", error);
      toast.error("Failed to delete B2B form submission");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderStatusBadge = () => {
    return (
      <div className="flex items-center gap-2">
        <Select
          onValueChange={handleStatusChange}
          value={currentStatus || submission.status}
          disabled={isUpdatingStatus}
        >
          <SelectTrigger className="w-auto border-0 p-0 h-auto hover:bg-transparent focus:ring-0">
            <Badge
              variant="default"
              className={`${getStatusColor(currentStatus || submission.status)} px-4 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer hover:opacity-80`}
            >
              {currentStatus || submission.status}
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
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const openWebsite = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <User className="h-5 w-5" />
                B2B Form Submission
              </DialogTitle>
              <DialogDescription className="mt-1">
                Details for submission from{" "}
                <span className="font-semibold text-foreground">
                  {submission.name}
                </span>
              </DialogDescription>
            </div>
            <div className="mt-1 flex-shrink-0">{renderStatusBadge()}</div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Personal Information */}
          <div>
            <h3 className="mb-2 text-lg font-semibold">
              Personal Information
            </h3>
            <div className="space-y-3 rounded-md border p-4">
              <div className="flex items-start justify-between">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="text-sm font-medium text-right">
                  {submission.name}
                </span>
              </div>
              <Separator />
              <div className="flex items-start justify-between">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm font-medium text-right break-all">
                  {submission.email}
                </span>
              </div>
              <Separator />
              <div className="flex items-start justify-between">
                <span className="text-sm text-muted-foreground">
                  Phone Number
                </span>
                <span className="text-sm font-medium text-right">
                  {submission.phoneNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div>
            <h3 className="mb-2 text-lg font-semibold">
              Company Information
            </h3>
            <div className="space-y-3 rounded-md border p-4">
              <div className="flex items-start justify-between">
                <span className="text-sm text-muted-foreground">
                  Company Name
                </span>
                <span className="text-sm font-medium text-right">
                  {submission.companyName}
                </span>
              </div>
              <Separator />
              <div className="flex items-start justify-between gap-4">
                <span className="text-sm text-muted-foreground">
                  Company Website
                </span>
                <a
                  href={submission.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary hover:underline text-right break-all"
                >
                  {submission.companyWebsite}
                </a>
              </div>
              <Separator />
              <div className="flex items-start justify-between">
                <span className="text-sm text-muted-foreground">
                  Branded Residences
                </span>
                <span className="text-sm font-medium text-right">
                  {submission.brandedResidencesName}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="mb-2 text-lg font-semibold">
              Additional Information
            </h3>
            <div className="space-y-3 rounded-md border p-4">
              <div className="flex items-start justify-between gap-4">
                <span className="text-sm text-muted-foreground">
                  Page Origin
                </span>
                <a
                  href={submission.pageOrigin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary hover:underline text-right break-all"
                >
                  {submission.pageOrigin}
                </a>
              </div>
              <Separator />
              <div className="flex items-start justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm font-medium">
                  {formatDate(submission.createdAt)}
                </span>
              </div>
              <Separator />
              <div className="flex items-start justify-between">
                <span className="text-sm text-muted-foreground">
                  Last Updated
                </span>
                <span className="text-sm font-medium">
                  {formatDate(submission.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center gap-2 pt-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting} className="gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the B2B form submission.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 