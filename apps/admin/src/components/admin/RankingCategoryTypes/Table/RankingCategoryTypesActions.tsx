import { Row } from "@tanstack/react-table";
import { RankingCategoryType } from "@/app/types/models/RankingCategoryType";
import { useState } from "react";
import { Eye, Archive, Edit } from "lucide-react";
import { TableActions, TableAction } from "@/components/admin/Table/TableActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
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

interface RankingCategoryTypesActionsProps {
    row: Row<RankingCategoryType>;
    onDelete: (page: number) => Promise<void>;
    currentPage: number;
}

export function RankingCategoryTypesActions({ row, onDelete, currentPage }: RankingCategoryTypesActionsProps) {
    const rankingCategoryType = row.original;
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/ranking-category-types/${rankingCategoryType.id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to delete ranking category type');
            }

            toast.success('Ranking category type deleted successfully');
            await onDelete(currentPage);
            router.refresh();
        } catch (error) {
            toast.error('Failed to delete ranking category type');
        } finally {
            setShowDeleteDialog(false);
        }
    };

    const actions: TableAction[] = [
        {
            label: "View details",
            icon: <Eye className="h-4 w-4" />,
            onClick: (rankingCategoryType: RankingCategoryType) => {
                window.location.href = `/rankings/ranking-category-types/${rankingCategoryType.id}`;
            }
        },
        {
            label: "Edit",
            icon: <Edit className="h-4 w-4" />,
            onClick: (rankingCategoryType: RankingCategoryType) => {
                window.location.href = `/rankings/ranking-category-types/${rankingCategoryType.id}/edit`;
            }
        },
        {
            label: "Delete",
            icon: <Archive className="h-4 w-4 text-red-400" />,
            className: "text-red-400 hover:text-red-400",
            onClick: () => {
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
                    href: `/rankings/ranking-category-types/${row.original.id}/edit`,
                }}
            />
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this ranking category type?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. <strong className="text-red-400">This will permanently delete the ranking category type
                            and all rankings associated with this type.</strong> All related data will be lost.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDelete}
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