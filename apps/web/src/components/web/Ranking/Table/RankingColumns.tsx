"use client";

import { ColumnDef } from "@tanstack/react-table";
import { RankingActions } from "./RankingActions";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface RankingRow {
  residenceName: string;
  rankingCategory: string;
  position: number;
  score: number;
  residenceId: string;
  residenceSlug: string;
  rankingCategorySlug: string;
  previousPosition: number | null;
  previousScore: number;
}

export const columns: ColumnDef<RankingRow>[] = [
  {
    accessorKey: "residenceName",
    header: "Residence Name",
    cell: ({ row }) => {
      const value = row.getValue("residenceName") as string;
      return (
        <div className="font-medium truncate max-w-[200px]" title={value}>
          {value}
        </div>
      );
    },
    enableSorting: false,
    meta: { width: "w-[220px]" },
  },
  {
    accessorKey: "rankingCategory",
    header: "Ranking Category",
    cell: ({ row }) => {
      const value = row.getValue("rankingCategory") as string;
      return <div className="truncate max-w-[200px]" title={value}>{value}</div>;
    },
    enableSorting: false,
    meta: { width: "w-[200px]" },
  },
  {
    accessorKey: "previousPosition",
    header: "Previous Position",
    cell: ({ row }) => {
      const value = row.getValue("previousPosition") as number | null;
      return (
        <div className="text-muted-foreground text-center">
          {value ? `#${value}` : "-"}
        </div>
      );
    },
    enableSorting: false,
    meta: { width: "w-[90px]" },
  },
  {
    accessorKey: "position",
    header: "Current Position",
    cell: ({ row }) => {
      const currentPosition = row.getValue("position") as number;
      const previousPosition = row.original.previousPosition;
      
      let trendIcon = null;
      let trendColor = "";
      
      if (previousPosition === null) {
        trendIcon = <Minus className="h-4 w-4 text-muted-foreground" />;
      } else if (currentPosition < previousPosition) {
        trendIcon = <TrendingUp className="h-4 w-4 text-green-500" />;
        trendColor = "text-green-500";
      } else if (currentPosition > previousPosition) {
        trendIcon = <TrendingDown className="h-4 w-4 text-red-500" />;
        trendColor = "text-red-500";
      } else {
        trendIcon = <Minus className="h-4 w-4 text-muted-foreground" />;
      }
      
      return (
        <div className="flex items-center gap-2 justify-center">
          <span className={`font-medium ${trendColor}`}>#{currentPosition}</span>
          {trendIcon}
        </div>
      );
    },
    enableSorting: false,
    meta: { width: "w-[110px]" },
  },
  {
    accessorKey: "previousScore",
    header: "Previous Score",
    cell: ({ row }) => {
      const value = row.getValue("previousScore") as number;
      return (
        <div className="text-muted-foreground text-center">
          {value > 0 ? value.toFixed(1) : "-"}
        </div>
      );
    },
    enableSorting: false,
    meta: { width: "w-[90px]" },
  },
  {
    accessorKey: "score",
    header: "Current Score",
    cell: ({ row }) => {
      const currentScore = row.getValue("score") as number;
      const previousScore = row.original.previousScore;
      
      let trendIcon = null;
      let trendColor = "";
      
      if (previousScore === 0) {
        trendIcon = <Minus className="h-4 w-4 text-muted-foreground" />;
      } else if (currentScore > previousScore) {
        trendIcon = <TrendingUp className="h-4 w-4 text-green-500" />;
        trendColor = "text-green-500";
      } else if (currentScore < previousScore) {
        trendIcon = <TrendingDown className="h-4 w-4 text-red-500" />;
        trendColor = "text-red-500";
      } else {
        trendIcon = <Minus className="h-4 w-4 text-muted-foreground" />;
      }
      
      return (
        <div className="flex items-center gap-2 justify-center">
          <span className={`font-medium ${trendColor}`}>{currentScore.toFixed(1)}</span>
          {trendIcon}
        </div>
      );
    },
    enableSorting: false,
    meta: { width: "w-[110px]" },
  },
  {
    id: "actions",
    header: "Actions",
    accessorFn: (row) => row.residenceId,
    cell: ({ row }) => <RankingActions row={row} />,
    enableHiding: false,
    enableSorting: false,
    meta: {
      width: "w-[120px]"
    }
  },
];