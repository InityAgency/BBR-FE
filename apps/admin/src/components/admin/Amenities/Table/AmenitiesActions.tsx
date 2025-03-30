"use client";

import React, { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Eye, Archive } from "lucide-react";
import { TableActions, TableAction } from "@/components/admin/Table/TableActions";
import { Amenity } from "../../../../app/types/models/Amenities";
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

interface AmenitiesActionsProps {
    row: Row<Amenity>;
    onDelete: (page: number) => Promise<void>;
    currentPage: number;
}

export function AmenitiesActions({ row, onDelete, currentPage }: AmenitiesActionsProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const router = useRouter();

    const handleDelete = async (amenity: Amenity) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/amenities/${amenity.id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Failed to delete amenity: ${response.status}`);
            }

            toast.success('Amenity deleted successfully');
            await onDelete(currentPage);
            router.refresh();
        } catch (error) {
            toast.error('Failed to delete amenity');
        } finally {
            setShowDeleteDialog(false);
        }
    };
    
    const actions: TableAction[] = [
        {
            label: "View details",
            icon: <Eye className="h-4 w-4" />,
            onClick: (amenity: Amenity) => {
                window.location.href = `/amenities/${amenity.id}`;
            }
        },
        {
            label: "Delete",
            icon: <Archive className="h-4 w-4 text-red-400" />,
            className: "text-red-400 hover:text-red-400",
            onClick: (amenity: Amenity) => {
                setShowDeleteDialog(true);
            }
        }
    ];

    return (
        <>
            <TableActions 
                actions={actions} 
                row={row}
                editAction={{
                    href: `/residences/amenities/${row.original.id}/edit`,
                }}
            />
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete amenity</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this amenity? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(row.original)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}