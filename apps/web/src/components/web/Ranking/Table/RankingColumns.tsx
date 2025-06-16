"use client";

import { ColumnDef } from "@tanstack/react-table";
import { RankingActions } from "./RankingActions";

interface RankingRow {
  residenceName: string;
  rankingCategory: string;
  position: number;
  score: number;
  residenceId: string;
  residenceSlug: string;
}

export const columns: ColumnDef<RankingRow>[] = [
  {
    accessorKey: "residenceName",
    header: "Residence Name",
    cell: ({ row }) => {
      const value = row.getValue("residenceName") as string;
      return <div className="font-medium">{value}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "rankingCategory",
    header: "Ranking Category",
    cell: ({ row }) => {
      const value = row.getValue("rankingCategory") as string;
      return <div>{value}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "position",
    header: "Position",
    cell: ({ row }) => {
      const value = row.getValue("position") as number;
      return <div className="font-medium">#{value}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "score",
    header: "BBR Score",
    cell: ({ row }) => {
      const value = row.getValue("score") as number;
      return <div className="font-medium">{value.toFixed(1)}</div>;
    },
    enableSorting: false,
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