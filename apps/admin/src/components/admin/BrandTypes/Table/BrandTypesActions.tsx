import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PenIcon, Trash2 } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { BrandType } from "@/app/types/models/BrandType";
import { useState } from "react";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";

interface BrandTypesActionsProps {
  row: Row<BrandType>;
  refetchData?: () => void; // Added refetchData prop
}

export function BrandTypesActions({ row, refetchData }: BrandTypesActionsProps) {
  const brandType = row.original;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  const editBrandType = () => {
    window.location.href = `/brands/types/${brandType.id}/edit`;
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/brand-types/${brandType.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete brand type');
      }

      toast.success('Brand type deleted successfully');
      
      // Refresh data using provided refetchData function if available
      if (refetchData) {
        // Call refetchData to reload the data
        refetchData();
      }
      
      // Always refresh the router to ensure UI updates
      router.refresh();
      
      // Add a small delay to ensure data is refreshed properly
      setTimeout(() => {
        if (window.location.pathname.includes('/brands/types')) {
          // Force a reload of the current page if on brands/types page
          window.location.reload();
        }
      }, 300);
    } catch (error) {
      toast.error('Failed to delete brand type');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={editBrandType} className="flex cursor-pointer items-center">
              <PenIcon className="h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setShowDeleteDialog(true)} 
              className="flex cursor-pointer items-center text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 text-red-400" />
              <span className="text-red-400">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this brand type?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. <strong className="text-red-400">This will permanently delete the brand type
              and all brands associated with this type.</strong> All related data will be lost.
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