"use client";

import React, { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Eye, Archive } from "lucide-react";
import { TableActions, TableAction } from "@/components/admin/Table/TableActions";
import { RankingCategory } from "../../../../app/types/models/RankingCategory";
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

interface RankingCategoryActionsProps {
  row: Row<RankingCategory>;
  onDelete: (page: number) => Promise<void>;
  currentPage: number;
}

export function RankingCategoryActions({ row, onDelete, currentPage }: RankingCategoryActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  const handleDelete = async (category: RankingCategory) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/ranking-categories/${category.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ranking category: ${response.status}`);
      }

      toast.success('Ranking category deleted successfully');
      await onDelete(currentPage);
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete ranking category');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const actions: TableAction[] = [
    {
      label: "View details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (category: RankingCategory) => {
        window.location.href = `/rankings/ranking-categories/${category.id}`;
      }
    },
    {
      label: "Delete",
      icon: <Archive className="h-4 w-4 text-red-400" />,
      className: "text-red-400 hover:text-red-400",
      onClick: (category: RankingCategory) => {
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
          href: `/rankings/ranking-categories/${row.original.id}/edit`,
        }}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this ranking category?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the ranking category
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
