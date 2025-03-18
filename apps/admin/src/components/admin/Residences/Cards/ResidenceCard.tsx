import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Residence } from "@/app/types/models/Residence";
import { ResidencesActions } from "../Table/ResidencesActions";
import { Button } from "@/components/ui/button";
import { Eye, Archive, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ResidenceCardProps {
  residence: Residence;
}

// Helper funkcije za renderovanje
const renderStatusBadge = (status: string) => {
  let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "default";
  let badgeClass = "";
  
  switch(status) {
    case "Active":
      badgeVariant = "default";
      badgeClass = "bg-green-900/55 text-green-300";
      break;
    case "Pending":
      badgeVariant = "secondary";
      badgeClass = "bg-yellow-900/55 text-yellow-300";
      break;
    case "Deleted":
      badgeVariant = "destructive";
      badgeClass = "bg-red-900/55 text-red-300";
      break;
    case "Draft":
      badgeVariant = "outline";
      badgeClass = "bg-gray-900/80 text-gray-300";
      break;
  }
  
  return <Badge variant={badgeVariant} className={badgeClass}>{status}</Badge>;
};

const renderDeveloperAvatar = (developer: string, developerCode?: string) => {
  if (developerCode) {
    return (
      <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-xs font-medium">
        {developerCode}
      </div>
    );
  }
  return (
    <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
      {developer.split(" ").map(word => word[0]).join("").substring(0, 2).toUpperCase()}
    </div>
  );
};


export const ResidenceCard: React.FC<ResidenceCardProps> = ({ residence }) => {
  const locationParts = residence.location.split(", ");
  const city = locationParts[0];
  const country = locationParts.length > 1 ? locationParts[1] : "";

  return (
    <Card className="overflow-hidden">
      <CardContent>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {renderStatusBadge(residence.status)}
          </div>
          <ResidencesActions row={{ original: residence } as any} />
        </div>

        <div className="mt-2 border-b border-border pb-2">
          <a href={`/residences/${residence.id}`} className="font-medium text-foreground hover:underline truncate block">
            {residence.name}
          </a>
          <div className="text-xs text-muted-foreground">
            # {residence.id}
          </div>
        </div>

        {/* Location */}
        <div className="mt-2 border-b border-border pb-2">
          <div className="text-sm font-medium">{city}</div>
          {country && (
            <div className="text-xs text-muted-foreground">
              {country}
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="mt-2 border-b border-border pb-2">
          <div className="font-medium truncate">{residence.contact}</div>
          {residence.contactEmail && (
            <a href={`mailto:${residence.contactEmail}`} className="text-xs text-primary block">
              {residence.contactEmail}
            </a>
          )}
          {residence.contactPhone && (
            <div className="text-xs text-muted-foreground">
              {residence.contactPhone}
            </div>
          )}
        </div>

        {/* Developer */}
        <div className="mt-2 flex items-center gap-2 border-b border-border pb-2">
          {renderDeveloperAvatar(residence.developer, residence.developerCode)}
          <div className="truncate font-medium text-sm">
            {residence.developer}
          </div>
        </div>

        {/* Dates */}
        <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div>
            <div className="text-xs">Created</div>
            <div className="text-white mt-1">{residence.createdAt}</div>
          </div>
          <div>
            <div className="text-xs">Updated</div>
            <div className="text-white mt-1">{residence.updatedAt}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};