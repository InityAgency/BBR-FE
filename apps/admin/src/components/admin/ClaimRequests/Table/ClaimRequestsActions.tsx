"use client";

import React, { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Eye, Check, X } from "lucide-react";
import { TableActions, TableAction } from "@/components/admin/Table/TableActions";
import { ClaimRequest } from "../../../../app/types/models/ClaimRequest";
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
import { Button } from "@/components/ui/button";

interface ClaimRequestsActionsProps {
    row: Row<ClaimRequest>;
    onUpdate: (page: number) => Promise<void>;
    currentPage: number;
}

export function ClaimRequestsActions({ row, onUpdate, currentPage }: ClaimRequestsActionsProps) {
    const [showAcceptDialog, setShowAcceptDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();

    const handleStatusUpdate = async (status: "ACCEPTED" | "REJECTED") => {
        try {
            setIsProcessing(true);
            const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/claim-profile-contact-forms/${row.original.id}/status`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            if (!response.ok) {
                throw new Error(`Failed to update status: ${response.status}`);
            }

            const successMessage = status === "ACCEPTED" 
                ? 'Claim request accepted successfully' 
                : 'Claim request rejected successfully';
            
            toast.success(successMessage);
            await onUpdate(currentPage);
            router.refresh();
        } catch (error) {
            const errorMessage = status === "ACCEPTED" 
                ? 'Failed to accept claim request' 
                : 'Failed to reject claim request';
            toast.error(errorMessage);
        } finally {
            setIsProcessing(false);
            setShowAcceptDialog(false);
            setShowRejectDialog(false);
        }
    };
    
    const actions: TableAction[] = [
        {
            label: "View details",
            icon: <Eye className="h-4 w-4" />,
            onClick: (request: ClaimRequest) => {
                window.location.href = `/residences/claim-requests/${request.id}`;
            }
        }
    ];

    // Dodajemo akcije za prihvatanje/odbijanje samo ako je status NEW
    if (row.original.status === "NEW") {
        actions.push(
            {
                label: "Accept",
                icon: <Check className="h-4 w-4 text-green-600" />,
                className: "text-green-600 hover:text-green-600",
                onClick: () => setShowAcceptDialog(true)
            },
            {
                label: "Reject",
                icon: <X className="h-4 w-4 text-red-600" />,
                className: "text-red-600 hover:text-red-600",
                onClick: () => setShowRejectDialog(true)
            }
        );
    }

    // Kreiranje opisa za dialog - proveravamo da li residence postoji
    const getResidenceDescription = () => {
        if (row.original.residence) {
            return `residence "${row.original.residence.name}"`;
        }
        return "this residence request";
    };

    return (
        <>
            {/* <TableActions 
                actions={actions} 
                row={row}
            /> */}
            <div className="flex items-center gap-2">
                {actions.map((action) => (
                    <Button 
                        key={action.label} 
                        variant="outline" 
                        size="icon"
                        onClick={() => {
                            if (action.onClick) {
                                action.onClick(row.original);
                            }
                        }}
                    >
                        {action.icon}
                    </Button>
                ))}
            </div>
            
            {/* Accept Dialog */}
            <AlertDialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Accept claim request</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to accept this claim request? This will approve the developer's request to claim {getResidenceDescription()}.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={() => handleStatusUpdate("ACCEPTED")}
                            disabled={isProcessing}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isProcessing ? "Accepting..." : "Accept"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Reject Dialog */}
            <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reject claim request</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to reject this claim request? This will deny the developer's request to claim {getResidenceDescription()}.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={() => handleStatusUpdate("REJECTED")}
                            disabled={isProcessing}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isProcessing ? "Rejecting..." : "Reject"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}