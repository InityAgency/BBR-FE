"use client";

import { useState } from "react";
import { Check, Trash2, X, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Brand } from "@/app/types/models/Brand";
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
import { useRouter } from "next/navigation";

interface BrandHeaderProps {
  brand: Brand;
  onStatusChange: (newStatus: string) => void;
  onDelete: () => void;
}

const getStatusBadgeStyle = (status: string) => {
  switch(status) {
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

export function BrandHeader({ brand, onStatusChange, onDelete }: BrandHeaderProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const handleReject = () => {
    onStatusChange("DELETED");
    setShowRejectDialog(false);
  };

  const renderStatusBadge = () => {
    const allowedStatuses = ["DRAFT", "ACTIVE", "PENDING", "DELETED"];

    return (
      <div className="flex items-center gap-2">
        <Select 
          onValueChange={onStatusChange}
          value={brand.status}
          disabled={false}
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

        {brand.status === "PENDING" && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-green-900/20 hover:bg-green-900/40 text-green-300 border-green-900/50 transition-all duration-300"
              onClick={() => onStatusChange("ACTIVE")}
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
        )}
      </div>
    );
  };

  const renderActionButtons = () => {
    if (brand.status === "DELETED") return null;

    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => router.push(`/brands/${brand.id}/edit`)}
          className="cursor-pointer transition-colors"
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
          className="cursor-pointer transition-colors"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold">{brand.name}</h1>
        {renderStatusBadge()}
      </div>
      {renderActionButtons()}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this brand?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the brand
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                onDelete();
                setShowDeleteDialog(false);
              }} 
              className="bg-destructive text-white hover:bg-destructive/80 transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to reject this brand?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The brand will be marked as deleted.
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
    </div>
  );
} 