import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Users, Star, Building2, TrendingUp } from "lucide-react";

interface Activity {
  id: string;
  type: "view" | "lead" | "rating" | "residence" | "trend";
  title: string;
  description: string;
  timestamp: string;
  value?: number;
}

interface RecentActivityProps {
  activities: Activity[];
}

const GOLD = "#B3804C";

const getActivityIcon = (type: Activity["type"]) => {
  switch (type) {
    case "view":
      return Eye;
    case "lead":
      return Users;
    case "rating":
      return Star;
    case "residence":
      return Building2;
    case "trend":
      return TrendingUp;
    default:
      return Eye;
  }
};

const getActivityColor = (type: Activity["type"]) => {
  switch (type) {
    case "view":
      return "bg-primary/10 text-primary";
    case "lead":
      return "bg-primary/10 text-primary";
    case "rating":
      return "bg-primary/10 text-primary";
    case "residence":
      return "bg-primary/10 text-primary";
    case "trend":
      return "bg-primary/10 text-primary";
    default:
      return "bg-primary/10 text-primary";
  }
};

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const IconComponent = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="p-2 rounded-lg" style={{background: "#fff3e0"}}>
                  <IconComponent className="h-4 w-4" color={GOLD} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{activity.title}</p>
                    {activity.value && (
                      <Badge variant="secondary" className="text-xs">
                        {activity.value}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 