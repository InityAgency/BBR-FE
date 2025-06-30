"use client";

import React from "react";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Building2, Trophy } from "lucide-react";
import Link from "next/link";

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

interface RankingActionsProps {
  row: Row<RankingRow>;
}

export function RankingActions({ row }: RankingActionsProps) {
  const ranking = row.original;
  
  return (
    <div className="flex items-center gap-2">
      <Link 
        href={`/residences/${ranking.residenceSlug}`} 
        target="_blank"
      >
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Building2 className="h-4 w-4" />
        </Button>
      </Link>
      <Link 
        href={`/best-residences/${ranking.rankingCategorySlug}`} 
        target="_blank"
      >
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Trophy className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}