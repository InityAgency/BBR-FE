"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2, Eye, Star, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Residence } from "@/app/types/models/Residence";
import { ConfirmationModal } from "@/components/admin/Modals/ConfirmationModal";
import { residencesService } from "@/lib/api/services/residences";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface ResidenceHeaderProps {
  residence: Residence;
}

const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-900/20 hover:bg-green-900/40 text-green-300 border-green-900/50";
    case "PENDING":
      return "bg-yellow-900/20 hover:bg-yellow-900/40 text-yellow-300 border-yellow-900/50";
    case "DRAFT":
      return "bg-gray-900/20 hover:bg-gray-900/40 text-gray-300 border-gray-900/50";
    case "DELETED":
      return "bg-red-900/20 hover:bg-red-900/40 text-red-300 border-red-900/50";
    default:
      return "";
  }
};

export function ResidenceHeader({ residence }: ResidenceHeaderProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Lokalno stanje za status - inicijalno postaviti na residence.status
  const [currentStatus, setCurrentStatus] = useState(residence.status);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsUpdatingStatus(true);
      
      // Optimistično ažuriranje - odmah postaviti novi status
      setCurrentStatus(newStatus);
      
      await residencesService.updateResidenceStatus(residence.id, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      
      // Opcionalno - refresh podatke u pozadini
      router.refresh();
    } catch (error) {
      console.error("Failed to update status:", error);
      
      // Ako zahtev neuspešan, vrati stari status
      setCurrentStatus(residence.status);
      toast.error("Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleApprove = async () => {
    await handleStatusChange("ACTIVE");
  };
  
  const handleReject = async () => {
    await handleStatusChange("DELETED");
    setShowRejectDialog(false);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await residencesService.deleteResidence(residence.id);
      toast.success("Residence deleted successfully");
      router.push("/residences");
    } catch (error) {
      toast.error("Failed to delete residence");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const allowedStatuses = ["DRAFT", "ACTIVE", "PENDING", "DELETED"];

  const renderStatusBadge = () => (
    <div className="flex items-center gap-2">
      <Select
        onValueChange={handleStatusChange}
        value={currentStatus} // Koristiti currentStatus umesto residence.status
        disabled={isUpdatingStatus} // Onemogući tokom ažuriranja
      >
        <SelectTrigger className="w-auto border-0 p-0 h-auto hover:bg-transparent focus:ring-0">
          <Badge
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
      {currentStatus === "PENDING" && !isUpdatingStatus && (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-green-900/20 hover:bg-green-900/40 text-green-300 border-green-900/50 transition-all duration-300"
            onClick={handleApprove}
            disabled={isUpdatingStatus}
          >
            <Check className="h-4 w-4 mr-2" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-red-900/20 hover:bg-red-900/40 text-red-300 border-red-900/50 transition-all duration-300"
            onClick={() => setShowRejectDialog(true)}
            disabled={isUpdatingStatus}
          >
            <X className="h-4 w-4 mr-2" />
            Reject
          </Button>
        </div>
      )}
    </div>
  );

  const renderActionButtons = () => {
    if (currentStatus === "DELETED") return null; // Koristiti currentStatus
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => router.push(`/residences/${residence.id}/edit`)}
          className="cursor-pointer transition-colors"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="secondary"
          onClick={() => router.push(`/residences/${residence.id}/scoring`)}
          className="cursor-pointer transition-colors"
        >
          <Star className="h-4 w-4" />
          Score residences
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push(`/residences/${residence.id}/preview`)}
          className="cursor-pointer transition-colors"
        >
          <Eye className="h-4 w-4" />
          Preview
        </Button>
        <Button
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
          className="cursor-pointer transition-colors"
          disabled={isUpdatingStatus}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">{residence.name}</h1>
          {renderStatusBadge()}
        </div>
        {renderActionButtons()}
      </div>

      <ConfirmationModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Residence"
        description="Are you sure you want to delete this residence? This action cannot be undone. All residence data will be permanently removed."
        actionLabel="Delete Residence"
        actionIcon={Trash2}
        actionVariant="destructive"
        onConfirm={handleDelete}
      />

      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to reject this residence?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The residence will be marked as deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              className="bg-destructive text-white hover:bg-destructive/80 transition-colors cursor-pointer"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}