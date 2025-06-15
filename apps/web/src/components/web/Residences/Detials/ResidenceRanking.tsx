import { useTable } from "@/hooks/useTable";
import { BaseTable } from "@/components/web/Table/BaseTable";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge, Building2, CornerRightUp, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as React from "react";

// Tooltip import
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TotalScore {
  totalScore: number;
  position: number;
  rankingCategory: {
    id: string;
    name: string;
    slug: string;
    title: string;
    description: string;
    featuredImage: any;
  };
}

interface ResidenceRankingProps {
  residenceId: string;
  totalScores?: TotalScore[];
}

// Skeleton loader for table
const TableSkeleton = () => {
  return (
    <div className="w-full border rounded-md">
      {/* Header skeleton */}
      <div className="border-b px-4 py-3 flex">
        <Skeleton className="h-6 w-1/3 rounded-md mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-16 rounded-md ml-2 bg-muted/20" />
      </div>
      
      {/* Rows skeleton */}
      {[...Array(3)].map((_, index) => (
        <div key={index} className="border-b px-4 py-3 flex items-center">
          <Skeleton className="h-6 w-1/3 rounded-md mr-2 bg-muted/20" />
          <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
          <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
          <Skeleton className="h-6 w-16 rounded-md ml-2 bg-muted/20" />
        </div>
      ))}
    </div>
  );
};

// Empty state component
const EmptyState = () => (
  <Card className="text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-none bg-secondary">
    <CardContent className="py-12 text-center">
      <div className="flex flex-col items-center space-y-4">
        <Building2 className="h-10 w-10 text-muted-foreground" />
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-sans">No rankings available</h3>
          <p className="text-muted-foreground">
            There are currently no rankings for this residence. Rankings will appear here once they are added.
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export function ResidenceRanking({ residenceId, totalScores = [] }: ResidenceRankingProps) {
  const columns: ColumnDef<TotalScore>[] = [
    {
      accessorKey: "rankingCategory.name",
      header: "Category",
      cell: ({ row }) => (
        <div className="max-w-[250px]">
          <div className="font-medium text-foreground truncate" title={row.original.rankingCategory.name}>
            {row.original.rankingCategory.name}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {row.original.rankingCategory.description}
          </div>
        </div>
      ),
      meta: {
        width: "w-[250px]"
      }
    },
    {
      accessorKey: "position",
      header: "Position",
      cell: ({ row }) => (
        <div className="text-left">
          {row.original.position}
        </div>
      ),
      meta: {
        width: "w-[150px]"
      }
    },
    {
      accessorKey: "totalScore",
      header: "Total Score",
      cell: ({ row }) => (
        <div className="text-left">
          {row.original.totalScore}
        </div>
      ),
      meta: {
        width: "w-[100px]"
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => window.open(`/best-residences/${row.original.rankingCategory.slug}`, '_blank')}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          {/* <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 opacity-60 cursor-not-allowed"
                  disabled
                >
                  <CornerRightUp  className="h-4 w-4" />
                  Increase position
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                Coming soon
              </TooltipContent>
            </Tooltip>
          </TooltipProvider> */}
        </div>
      ),
      meta: {
        width: "w-[80px]"
      }
    }
  ];

  const { table } = useTable<TotalScore>({
    data: totalScores,
    columns,
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between w-full mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-sans">Rankings</h1>
        </div>
      </div>
      <div className="hidden lg:block">
        <TooltipProvider>
          {totalScores.length === 0 ? (
            <EmptyState />
          ) : (
            <BaseTable table={table} />
          )}
        </TooltipProvider>
      </div>
    </div>
  );
}