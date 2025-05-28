"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RankingCategory } from "../../../../app/types/models/RankingCategory";
import { format } from "date-fns";

interface RankingCategoryCardProps {
  category: RankingCategory;
}

const formatCurrency = (price: string | number | undefined): string => {
  if (!price) return "-";
  
  let numericPrice: number;
  if (typeof price === 'string') {
    numericPrice = parseFloat(price);
  } else {
    numericPrice = price;
  }
  
  return numericPrice.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

const getStatusBadgeStyle = (status: string): string => {
  switch(status) {
    case "ACTIVE":
      return "bg-green-900/20 text-green-300 border-green-900/50";
    case "DELETED":
      return "bg-red-900/20 text-red-300 border-red-900/50";
    case "DRAFT":
      return "bg-gray-900/20 text-gray-300 border-gray-900/50";
    case "INACTIVE":
      return "bg-yellow-900/20 text-yellow-300 border-yellow-900/50";
    default:
      return "";
  }
};

export const RankingCategoryCard: React.FC<RankingCategoryCardProps> = ({ category }) => {
  return (
    <div className="border rounded-md p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-lg truncate">{category.name}</h3>
        <Badge className={`${getStatusBadgeStyle(category.status)}`}>{category.status}</Badge>
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Category Type:</span>
          <span>{category.rankingCategoryType?.name || '-'}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Residence Limitation:</span>
          <span>{category.residenceLimitation || '-'}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Ranking Price:</span>
          <span>{formatCurrency(category.rankingPrice)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Last Updated:</span>
          <span>{category.updatedAt ? format(new Date(category.updatedAt), "dd.MM.yyyy") : "-"}</span>
        </div>
      </div>
      
      <div className="flex gap-2 pt-2">
        <Button size="sm" variant="outline" className="w-full" onClick={() => window.location.href = `/ranking-categories/${category.id}`}>
          View Details
        </Button>
        <Button size="sm" variant="outline" className="w-full" onClick={() => window.location.href = `/rankings/ranking-categories/${category.id}/edit`}>
          Edit
        </Button>
      </div>
    </div>
  );
};

export default RankingCategoryCard;