"use client"

import React, { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Eye, Archive } from "lucide-react";
import { TableActions, TableAction } from "@/components/admin/Table/TableActions";
import { Lifestyle } from "@/app/types/models/Lifestyles";
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

interface LifestylesActionsProps {
    row: Row<Lifestyle>;
    onDelete: (page: number) => Promise<void>;
    currentPage: number;
}

export function LifestylesActions({ row, onDelete, currentPage }: LifestylesActionsProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const router = useRouter();

    const handleDelete = async (lifestyle: Lifestyle) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/lifestyles/${lifestyle.id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Failed to delete lifestyle: ${response.status}`);
            }

            toast.success('Lifestyle deleted successfully');
            await onDelete(currentPage);
            router.refresh();
        } catch (error) {
            toast.error('Failed to delete lifestyle');
        } finally {
            setShowDeleteDialog(false);
        }
    };

    const actions: TableAction[] = [
        {
            label: "View details",
            icon: <Eye className="h-4 w-4" />,
            onClick: (lifestyle: Lifestyle) => {
                window.location.href = `/lifestyles/${lifestyle.id}`;
            }
        },
        {
            label: "Delete",
            icon: <Archive className="h-4 w-4 text-red-400" />,
            className: "text-red-400 hover:text-red-400",
            onClick: (lifestyle: Lifestyle) => {
                setShowDeleteDialog(true);
            }
        }   
    ];

    return (
        <>
            <TableActions 
                actions={actions} 
                row={row}
            />
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>   
                        <AlertDialogAction onClick={() => handleDelete(row.original)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}