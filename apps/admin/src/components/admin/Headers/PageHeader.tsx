import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"


interface PageHeaderProps{
    title: string;
    count?: number;
    buttonText?: string;
    buttonUrl?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, count, buttonText, buttonUrl }) => {
  return (
    <div className="flex items-center justify-between pb-4">
      <div className="flex items-end gap-2">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {count !== undefined && (
            <Badge variant="outline" className="p-1 px-2">{count} total</Badge>
        )}
      </div>
      {buttonText && buttonUrl && (
        <Button asChild>
          <a href={buttonUrl}>{buttonText}</a>
        </Button>
      )}
    </div>
  );
};

export default PageHeader;
