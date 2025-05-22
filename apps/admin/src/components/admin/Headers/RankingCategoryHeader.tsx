"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { RankingCategory, RankingCategoryStatus } from "@/app/types/models/RankingCategory";
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
import { AddResidenceModal } from "../RankingCategory/Modals/AddResidenceModal";

interface RankingCategoryHeaderProps {
  category: RankingCategory;
  onStatusChange: (newStatus: RankingCategoryStatus) => Promise<void>;
  onDelete: () => Promise<void>;
  onEditSuccess?: () => Promise<void>;
}

const getStatusBadgeStyle = (status: RankingCategoryStatus) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-900/20 hover:bg-green-900/40 text-green-300 border-green-900/50";
    case "DRAFT":
      return "bg-gray-900/20 hover:bg-gray-900/40 text-gray-300 border-gray-900/50";
    case "DELETED":
      return "bg-red-900/20 hover:bg-red-900/40 text-red-300 border-red-900/50";
    default:
      return "";
  }
};

export function RankingCategoryHeader({
  category,
  onStatusChange,
  onDelete,
  onEditSuccess,
}: RankingCategoryHeaderProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddResidenceModal, setShowAddResidenceModal] = useState(false);

  const handleStatusChange = async (value: string) => {
    // value će biti "ACTIVE", "DRAFT" ili "DELETED".
    await onStatusChange(value as RankingCategoryStatus);
  };

  const allowedStatuses: RankingCategoryStatus[] = ["ACTIVE", "DRAFT", "DELETED"];

  const renderStatusDropdown = () => {
    return (
      <Select onValueChange={handleStatusChange} value={category.status}>
        <SelectTrigger className="w-auto border-0 p-0 h-auto hover:bg-transparent focus:ring-0">
          <Badge className={`${getStatusBadgeStyle(category.status)} px-4 py-1.5 text-sm font-medium cursor-pointer`}>
            {category.status}
          </Badge>
        </SelectTrigger>
        <SelectContent>
          {allowedStatuses.map((status) => (
            <SelectItem key={status} value={status} className="text-sm">
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  const renderActionButtons = () => {
    if (category.status === "DELETED") {
      // Kad je DELETED, uglavnom ne prikazujemo dalje akcije
      return null;
    }

    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => router.push(`/rankings/ranking-categories/${category.id}/edit`)}
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
        <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
        <Button 
          variant="default" 
          onClick={() => setShowAddResidenceModal(true)}
        >
          <Plus className="h-4 w-4" />
          Add residence to ranking
        </Button>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">{category.name}</h1>
          {renderStatusDropdown()}
        </div>
        {renderActionButtons()}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this ranking category?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete the category
              and remove any of its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await onDelete();
                setShowDeleteDialog(false);
              }}
              className="bg-destructive text-white hover:bg-destructive/80"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AddResidenceModal
        isOpen={showAddResidenceModal}
        onClose={() => setShowAddResidenceModal(false)}
        category={category}
        onSuccess={onEditSuccess}
        rankingCategoryId={category.id}
      />
    </>
  );
}
