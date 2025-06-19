import { ColumnDef } from "@tanstack/react-table";
import { Unit } from "@/app/types/models/Unit";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Helper function for safe value display
const safeValue = (value: any): string => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return String(value);
};

// Helper function for rendering name cell
const renderNameCell = (name: string, id: string) => (
  <div className="max-w-[250px]">
    <div className="font-medium text-foreground truncate" title={name}>
      {safeValue(name)}
    </div>
    <div className="text-xs text-muted-foreground truncate">
      {id}
    </div>
  </div>
);

// Helper function for rendering price cell
const renderPriceCell = (regularPrice: number | null | undefined, exclusivePrice?: number, exclusiveOfferStartDate?: string, exclusiveOfferEndDate?: string) => {
  let showExclusive = false;
  if (exclusivePrice && exclusiveOfferStartDate && exclusiveOfferEndDate) {
    const now = new Date();
    const start = new Date(exclusiveOfferStartDate);
    const end = new Date(exclusiveOfferEndDate);
    showExclusive = now >= start && now <= end;
  }
  if (regularPrice === null && exclusivePrice === null) {
    return <div className="text-left">-</div>;
  }
  return (
    <div className="text-left">
      {exclusivePrice && showExclusive ? (
        <div>
          {regularPrice && (
            <div className="line-through text-muted-foreground text-sm">
              ${regularPrice.toLocaleString()}
            </div>
          )}
          <div className="text-foreground font-medium">
            ${exclusivePrice.toLocaleString()}
          </div>
        </div>
      ) : (
        <div className="text-foreground">
          ${regularPrice?.toLocaleString()}
        </div>
      )}
    </div>
  );
};

// Helper function for rendering date cell
const renderDateCell = (date: string) => (
  <div className="w-[180px]">
    {date ? formatDate(date) : "-"}
  </div>
);

// Helper function for rendering status cell
const renderStatusCell = (status: string) => {
  if (!status) {
    return <Badge variant="secondary">Unknown</Badge>;
  }

  let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "default";
  let badgeClass = "";

  switch (status) {
    case "ACTIVE":
      badgeVariant = "default";
      badgeClass = "bg-green-900/55 text-green-300";
      break;
    case "INACTIVE":
      badgeVariant = "secondary";
      badgeClass = "bg-gray-900/55 text-gray-300";
      break;
    case "SOLD":
      badgeVariant = "destructive";
      badgeClass = "bg-red-900/55 text-red-300";
      break;
    case "RESERVED":
      badgeVariant = "outline";
      badgeClass = "bg-yellow-900/55 text-yellow-300";
      break;

    case "PENDING":
      badgeVariant = "outline";
      badgeClass = "bg-yellow-900/55 text-yellow-300";
      break;
    default:
      badgeVariant = "secondary";
      badgeClass = "bg-gray-900/55 text-gray-300";
  }

  return <Badge variant={badgeVariant} className={badgeClass}>{status}</Badge>;
};

export const columns: ColumnDef<Unit>[] = [
  {
    accessorKey: "name",
    header: "Unit name",
    cell: ({ row }) => renderNameCell(row.getValue("name"), row.original.id),
    meta: {
      width: "w-[250px]"
    }
  },
  {
    accessorKey: "regularPrice",
    header: "Price (USD)",
    cell: ({ row }) => renderPriceCell(
      row.getValue("regularPrice"),
      row.original.exclusivePrice,
      row.original.exclusiveOfferStartDate,
      row.original.exclusiveOfferEndDate
    ),
    meta: {
      width: "w-[150px]"
    }
  },
  {
    accessorKey: "updatedAt",
    header: "Last updated",
    cell: ({ row }) => renderDateCell(row.getValue("updatedAt")),
    meta: {
      width: "w-[180px]"
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => renderStatusCell(row.getValue("status")),
    meta: {
      width: "w-[120px]"
    }
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    meta: {
      width: "w-[60px]"
    }
  },
];