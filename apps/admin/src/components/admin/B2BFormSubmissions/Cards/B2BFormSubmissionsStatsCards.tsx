"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, CheckCircle, Users } from "lucide-react";
import { B2BFormSubmissionStatus } from "@/lib/api/services/b2b-form-submissions.service";

interface B2BFormSubmissionsStatsCardsProps {
  stats: {
    total: number;
    new: number;
    contacted: number;
    completed: number;
  };
}

export function B2BFormSubmissionsStatsCards({ stats }: B2BFormSubmissionsStatsCardsProps) {
  const cards = [
    {
      title: "Total Submissions",
      value: stats.total,
      icon: FileText,
      description: "All B2B form submissions",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "New",
      value: stats.new,
      icon: Clock,
      description: "Pending contact",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Contacted",
      value: stats.contacted,
      icon: Users,
      description: "Being contacted",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      description: "Successfully completed",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <IconComponent className={`h-4 w-4 ${card.color}`} />
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