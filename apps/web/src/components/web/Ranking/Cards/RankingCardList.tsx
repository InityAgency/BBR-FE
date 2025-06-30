"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Building2, Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";
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

interface RankingCardListProps {
  rankings: RankingRow[];
}

export function RankingCardList({ rankings }: RankingCardListProps) {
  if (rankings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No rankings found</p>
      </div>
    );
  }

  const getTrendIcon = (current: number, previous: number | null, isPosition: boolean = false) => {
    if (previous === null || (isPosition && previous === 0) || (!isPosition && previous === 0)) {
      return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
    
    if (isPosition) {
      return current < previous ? 
        <TrendingUp className="h-4 w-4 text-green-500" /> : 
        current > previous ? 
        <TrendingDown className="h-4 w-4 text-red-500" /> : 
        <Minus className="h-4 w-4 text-muted-foreground" />;
    } else {
      return current > previous ? 
        <TrendingUp className="h-4 w-4 text-green-500" /> : 
        current < previous ? 
        <TrendingDown className="h-4 w-4 text-red-500" /> : 
        <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (current: number, previous: number | null, isPosition: boolean = false) => {
    if (previous === null || (isPosition && previous === 0) || (!isPosition && previous === 0)) {
      return "";
    }
    
    if (isPosition) {
      return current < previous ? "text-green-500" : current > previous ? "text-red-500" : "";
    } else {
      return current > previous ? "text-green-500" : current < previous ? "text-red-500" : "";
    }
  };

  return (
    <div className="space-y-4">
      {rankings.map((ranking, index) => (
        <div key={`${ranking.residenceId}-${index}`} className="border rounded-md p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-lg truncate" title={ranking.residenceName}>
                {ranking.residenceName}
              </h3>
              <p className="text-sm text-muted-foreground truncate" title={ranking.rankingCategory}>
                {ranking.rankingCategory}
              </p>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              <div className="flex items-center gap-1 justify-end">
                <span className={`text-sm font-medium ${getTrendColor(ranking.position, ranking.previousPosition, true)}`}>
                  #{ranking.position}
                </span>
                {getTrendIcon(ranking.position, ranking.previousPosition, true)}
              </div>
              <div className="text-xs text-muted-foreground">
                {ranking.previousPosition ? `Prev: #${ranking.previousPosition}` : "Prev: -"}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className={`text-sm font-medium ${getTrendColor(ranking.score, ranking.previousScore)}`}>
                  {ranking.score.toFixed(1)} score
                </span>
                {getTrendIcon(ranking.score, ranking.previousScore)}
              </div>
              <div className="text-xs text-muted-foreground">
                {ranking.previousScore > 0 ? `Prev: ${ranking.previousScore.toFixed(1)}` : "Prev: -"}
              </div>
            </div>
            <div className="flex gap-2">
              <Link 
                href={`/residences/${ranking.residenceSlug}`} 
                target="_blank"
              >
                <Button variant="ghost" size="sm">
                  <Building2 className="h-4 w-4 mr-2" />
                  View
                </Button>
              </Link>
              <Link 
                href={`/best-residences/${ranking.rankingCategorySlug}`} 
                target="_blank"
              >
                <Button variant="ghost" size="sm">
                  <Trophy className="h-4 w-4 mr-2" />
                  Ranking
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}