"use client";

import { useTable } from "@/hooks/useTable";
import { BaseTable } from "@/components/admin/Table/BaseTable";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RankingScore } from "@/types/models/RankingScore";
import { Badge } from "@/components/ui/badge";

// Empty state component
const EmptyState = () => (
  <Card>
    <CardContent className="py-12 text-center">
      <div className="flex flex-col items-center space-y-4">
        <Building2 className="h-10 w-10 text-muted-foreground" />
        <div className="space-y-2">
          <h3 className="text-lg font-medium">No rankings available</h3>
          <p className="text-muted-foreground">
            There are currently no rankings for this residence. Rankings will appear here once they are added.
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

interface ResidenceRankingProps {
  residenceId: string;
  totalScores?: RankingScore[];
}

export function ResidenceRanking({ residenceId, totalScores = [] }: ResidenceRankingProps) {
  const columns: ColumnDef<RankingScore>[] = [
    {
      accessorKey: "rankingCategory.name",
      header: "Category",
      cell: ({ row }) => (
        <div className="max-w-[250px]">
          <div className="font-medium truncate" title={row.original.rankingCategory.name}>
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
        </div>
      ),
      meta: {
        width: "w-[80px]"
      }
    }
  ];

  const { table } = useTable<RankingScore>({
    data: totalScores,
    columns,
  });

  if (!totalScores || totalScores.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <BaseTable table={table} />
    </div>
  );
} 