import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PenIcon } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { BrandType } from "@/app/types/models/BrandType";

interface BrandTypesActionsProps {
  row: Row<BrandType>;
}

export function BrandTypesActions({ row }: BrandTypesActionsProps) {
  const brandType = row.original;

  const editBrandType = () => {
    window.location.href = `/brands/types/${brandType.id}/edit`;
  };

  return (
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
            <PenIcon className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 