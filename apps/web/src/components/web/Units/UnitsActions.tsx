"use client";

import React, { useState, useEffect } from "react";
import { Row } from "@tanstack/react-table";
import { Eye, Archive } from "lucide-react";
import { TableActions, TableAction } from "@/components/web/Table/TableActions";
import { Unit } from "@/app/types/models/Unit";
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
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface UnitsActionsProps {
  row: Row<Unit>;
  onDelete: (page: number) => Promise<void>;
  currentPage: number;
  residenceId: string; // Dodajemo residenceId
  residenceSlug: string;
}

export function UnitsActions({ row, onDelete, currentPage, residenceId, residenceSlug }: UnitsActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  const handleDelete = async (unit: Unit) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/units/${unit.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete unit: ${response.status}`);
      }

      toast.success('Unit deleted successfully');
      await onDelete(currentPage);
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete unit');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const actions: TableAction[] = [
    {
      label: "View details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (unit: Unit) => {
        window.location.href = `/residences/${residenceId}/units/${unit.id}`;
      }
    },
    {
      label: "Delete",
      icon: <Archive className="h-4 w-4 text-red-400" />,
      className: "text-red-400 hover:text-red-400",
      onClick: (unit: Unit) => {
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
          href: `/developer/residences/${residenceSlug}/units/${row.original.id}/edit`,
        }}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this unit?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the unit
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
{/* 
        <Link href={`/developer/residences/${residenceSlug}/units/${row.original.id}/edit`}>
          <Button variant="outline" size="sm">Edit</Button>
        </Link> */}
    </>
  );
}