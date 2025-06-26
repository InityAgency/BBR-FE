import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, TrendingUp, Users, Home, Star, Trophy, MessageSquare } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalResidences: number;
    totalUnits: number;
    totalLeads: number;
    totalReviews: number;
    averageRating: number;
    totalRankings: number;
    averageRankingScore: number;
    conversionRate: number;
  };
}

const GOLD = "#B3804C";

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Residences",
      value: stats.totalResidences,
      icon: Building2,
      description: "Number of residences",
    },
    {
      title: "Total Units",
      value: stats.totalUnits,
      icon: Home,
      description: "Number of available units",
    },
    {
      title: "Total Leads",
      value: stats.totalLeads,
      icon: Users,
      description: "Number of leads",
    },
    {
      title: "Total Reviews",
      value: stats.totalReviews,
      icon: MessageSquare,
      description: "Number of reviews",
    },
    {
      title: "Average Rating",
      value: stats.averageRating.toFixed(1),
      icon: Star,
      description: "Average review rating",
    },
    {
      title: "Total Rankings",
      value: stats.totalRankings,
      icon: Trophy,
      description: "Number of ranking positions",
    },
    {
      title: "Average Ranking Score",
      value: (stats.averageRankingScore / 10).toFixed(1),
      icon: TrendingUp,
      description: "Average BBR ranking score",
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      icon: TrendingUp,
      description: "Lead to unit conversion rate",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <Card key={card.title} className="hover:shadow-md transition-shadow bg-secondary border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className="p-2 rounded-md bg-primary/10">
                <IconComponent className="h-4 w-4" color={GOLD} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 