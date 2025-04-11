"use client";

import React, { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Eye, Archive } from "lucide-react";
import { TableActions, TableAction } from "@/components/admin/Table/TableActions";
import { Residence } from "../../../../app/types/models/Residence";
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

interface ResidencesActionsProps {
  row: Row<Residence>;
  onDelete: (page: number, query?: string, statuses?: string[], cityIds?: string[], countryIds?: string[]) => Promise<void>;
  currentPage: number;
}

export function ResidencesActions({ row, onDelete, currentPage }: ResidencesActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  const handleDelete = async (residence: Residence) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/residences/${residence.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete residence: ${response.status}`);
      }

      toast.success('Residence deleted successfully');
      await onDelete(currentPage); // Osvežavamo trenutnu stranicu nakon brisanja
      router.refresh(); // Dodatno osvežavanje stranice
    } catch (error) {
      toast.error('Failed to delete residence');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const actions: TableAction[] = [
    {
      label: "View details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (residence: Residence) => {
        window.location.href = `/residences/${residence.id}`;
      }
    },
    {
      label: "Delete",
      icon: <Archive className="h-4 w-4 text-red-400" />,
      className: "text-red-400 hover:text-red-400",
      onClick: (residence: Residence) => {
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
          href: `/residences/${row.original.id}/edit`,
        }}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this residence?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the residence
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