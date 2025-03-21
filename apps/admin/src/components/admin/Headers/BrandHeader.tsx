"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Brand } from "@/app/types/models/Brand";
import { ConfirmationModal } from "@/components/admin/Modals/ConfirmationModal";
import FormHeader from "./FormHeader";

interface BrandHeaderProps {
  brand: Brand;
  onStatusChange?: (newStatus: string) => void;
  onDelete: () => void;
}

const getStatusBadgeStyle = (status: string) => {
  switch(status) {
    case "Active":
      return "bg-green-900/20 hover:bg-green-900/40 text-green-300 border-green-900/50";
    case "Pending":
      return "bg-yellow-900/20 hover:bg-yellow-900/40 text-yellow-300 border-yellow-900/50";
    case "Deleted":
      return "bg-red-900/20 hover:bg-red-900/40 text-red-300 border-red-900/50";
    case "Draft":
      return "bg-gray-900/20 hover:bg-gray-900/40 text-gray-300 border-gray-900/50";
    default:
      return "";
  }
};

export function BrandHeader({ brand, onStatusChange, onDelete }: BrandHeaderProps) {
  console.log("BrandHeader brand:", brand);
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);


  const handleDelete = async () => {
    try {
      // Ovde bi išla logika za brisanje
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Brand deleted successfully!");
      router.push("/brands");
      onDelete();
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast.error("An error occurred while deleting the brand.");
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const handleReject = () => {
    onStatusChange?.("Deleted");
    toast.success("Brand rejected successfully!");
    setShowRejectDialog(false);
  };

  const renderStatusBadge = () => {
    const allowedStatuses = ["Active", "Draft"];


    return (
      <Select 
        onValueChange={(value) => {
          onStatusChange?.(value);
          toast.success(`Brand status updated to ${value}`);
        }} 
        value={brand.status}
      >
        <SelectTrigger className="w-auto border-0 p-0 h-auto hover:bg-transparent focus:ring-0">
          <Badge 
            className={`${getStatusBadgeStyle(brand.status)} px-4 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer hover:opacity-80`}
          >
            {brand.status}
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
    );
  };

  const renderApproveRejectButtons = () => {
    
    if (brand.status !== "Pending") {
      return null;
    }

    return (
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="bg-green-900/20 hover:bg-green-900/40 text-green-300 border-green-900/50 transition-all duration-300"
          onClick={() => {
            onStatusChange?.("Active");
            toast.success("Brand approved successfully!");
          }}
        >
          <Check className="h-4 w-4 mr-2" />
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="bg-red-900/20 hover:bg-red-900/40 text-red-300 border-red-900/50 transition-all duration-300"
          onClick={() => setShowRejectDialog(true)}
        >
          <X className="h-4 w-4 mr-2" />
          Reject
        </Button>
      </div>
    );
  };

  const renderEditDeleteButtons = () => {
    if (brand.status === "Deleted") return null;

    return (
      <>
        <Button
          variant="outline"
          onClick={() => router.push(`/brands/${brand.id}/edit`)}
          className="cursor-pointer transition-colors"
        >
          <Pencil className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
          className="cursor-pointer transition-colors"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </>
    );
  };

  return (
    <>
      <FormHeader
        title={brand.name}
        titleContent={renderStatusBadge()}
        titleActions={renderApproveRejectButtons()}
        hideDefaultButtons={true}
        customButtons={renderEditDeleteButtons()}
      />

      {/* Modalni dijalozi */}
      <ConfirmationModal
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Are you sure you want to delete this brand?"
        description="This action cannot be undone. This will permanently delete the brand and all associated data."
        actionLabel="Delete"
        actionIcon={Trash2}
        actionVariant="destructive"
        onConfirm={handleDelete}
      />

      <ConfirmationModal
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        title="Are you sure you want to reject this brand?"
        description="This action cannot be undone. The brand will be marked as deleted."
        actionLabel="Reject"
        actionIcon={X}
        actionVariant="destructive"
        onConfirm={handleReject}
      />
    </>
  );
} 