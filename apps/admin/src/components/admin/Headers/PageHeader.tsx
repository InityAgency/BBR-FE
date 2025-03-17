import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  count?: number;
  buttonText?: string;
  buttonUrl?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, count, buttonText, buttonUrl }) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
        <h1 className="text-xl font-semibold sm:text-2xl">{title}</h1>
        {count !== undefined && (
          <Badge 
            variant="outline" 
            className="self-start sm:self-auto px-2 py-1 text-sm"
          >
            {count} total
          </Badge>
        )}
      </div>
      {buttonText && buttonUrl && (
        <Button asChild className="self-start sm:self-auto gap-2">
          <a href={buttonUrl}>
            <Plus className="h-4 w-4" />
            <span className="hidden xs:inline">{buttonText}</span>
            <span className="xs:hidden">{buttonText}</span>
          </a>
        </Button>
      )}
    </div>
  );
};

export default PageHeader;
