// components/admin/Brands/Table/BrandsActions.tsx
"use client";

import React, { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Eye, Archive } from "lucide-react";
import { TableActions, TableAction } from "@/components/admin/Table/TableActions";
import { Brand } from "../../../../app/types/models/Brand";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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

interface BrandsActionsProps {
  row: Row<Brand>;
  onDelete: (page: number) => Promise<void>;
}

export function BrandsActions({ row, onDelete }: BrandsActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  const handleDelete = async (brand: Brand) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/brands/${brand.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete brand: ${response.status}`);
      }

      toast.success('Brand deleted successfully');
      await onDelete(1); // Ponovo učitaj prvu stranicu nakon brisanja
    } catch (error) {
      console.error('Error deleting brand:', error);
      toast.error('Failed to delete brand');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const actions: TableAction[] = [
    {
      label: "View details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (brand: Brand) => {
        window.location.href = `/brands/${brand.id}`;
      }
    },
    {
      label: "Delete",
      icon: <Archive className="h-4 w-4 text-red-400" />,
      className: "text-red-400 hover:text-red-400",
      onClick: (brand: Brand) => {
        setShowDeleteDialog(true);
      }
    }
  ];

  return (
    <>
      <TableActions 
        row={row} 
        actions={actions}
        editAction={{
          href: `/brands/${row.original.id}/edit`,
        }}
      />

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
              onClick={() => handleDelete(row.original)}
              className="bg-destructive text-white hover:bg-destructive/80"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}