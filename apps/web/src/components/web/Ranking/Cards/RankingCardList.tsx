"use client";

import React from "react";
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

  return (
    <div className="space-y-4">
      {rankings.map((ranking, index) => (
        <div key={`${ranking.residenceId}-${index}`} className="border rounded-md p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg">{ranking.residenceName}</h3>
              <p className="text-sm text-muted-foreground">{ranking.rankingCategory}</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">#{ranking.position}</div>
              <div className="text-xs text-muted-foreground">{ranking.score.toFixed(1)} score</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-muted-foreground">
              ID: {ranking.residenceId}
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
                href={`/best-residences/${ranking.rankingCategory.toLowerCase()}`} 
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