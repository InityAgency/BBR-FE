"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Archive } from "lucide-react";
import { Unit } from "@/app/types/models/Unit";
import { formatDate } from "@/lib/utils";

interface UnitsCardListProps {
  units: Unit[];
  residenceId: string; // Dodajemo residenceId
}

// Helper function for safe value display
const safeValue = (value: any): string => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return String(value);
};

// Helper function for rendering status badge
const renderStatusBadge = (status: string) => {
  if (!status) {
    return <Badge variant="secondary">Unknown</Badge>;
  }
  
  let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "default";
  let badgeClass = "";
  
  switch(status) {
    case "ACTIVE":
      badgeVariant = "default";
      badgeClass = "bg-green-900/55 text-green-300";
      break;
    case "INACTIVE":
      badgeVariant = "secondary";
      badgeClass = "bg-gray-900/55 text-gray-300";
      break;
    case "SOLD":
      badgeVariant = "destructive";
      badgeClass = "bg-red-900/55 text-red-300";
      break;
    case "RESERVED":
      badgeVariant = "outline";
      badgeClass = "bg-yellow-900/55 text-yellow-300";
      break;
    default:
      badgeVariant = "secondary";
      badgeClass = "bg-gray-900/55 text-gray-300";
  }
  
  return <Badge variant={badgeVariant} className={badgeClass}>{status}</Badge>;
};

export function UnitsCardList({ units, residenceId }: UnitsCardListProps) {
  if (!units || units.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No units found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {units.map((unit) => (
        <Card key={unit.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">
                  {safeValue(unit.name)}
                </h3>
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {unit.id}
                </p>
              </div>
              <div className="ml-2 flex-shrink-0">
                {renderStatusBadge(unit.status)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-muted-foreground">Price:</span>
                <div className="font-medium">
                  {unit.price ? `$${unit.price.toLocaleString()}` : "-"}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Last updated:</span>
                <div className="font-medium">
                  {unit.updatedAt ? formatDate(unit.updatedAt) : "-"}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => window.location.href = `/residences/${residenceId}/units/${unit.id}`}
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => window.location.href = `/residences/${residenceId}/units/${unit.id}/edit`}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}