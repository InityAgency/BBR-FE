import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Residence } from "@/app/types/models/Residence";
import { ResidencesActions } from "../Table/ResidencesActions";

interface ResidenceCardProps {
  residence: Residence;
}

// Helper funkcije za renderovanje
const renderStatusBadge = (status: string) => {
  let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "default";
  let badgeClass = "";
  
  switch(status) {
    case "ACTIVE":
      badgeVariant = "default";
      badgeClass = "bg-green-900/55 text-green-300";
      break;
    case "PENDING":
      badgeVariant = "secondary";
      badgeClass = "bg-yellow-900/55 text-yellow-300";
      break;
    case "DELETED":
      badgeVariant = "destructive";
      badgeClass = "bg-red-900/55 text-red-300";
      break;
    case "DRAFT":
      badgeVariant = "outline";
      badgeClass = "bg-gray-900/80 text-gray-300";
      break;
  }
  
  return <Badge variant={badgeVariant} className={badgeClass}>{status}</Badge>;
};

export const ResidenceCard: React.FC<ResidenceCardProps> = ({ residence }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {renderStatusBadge(residence.status)}
            </div>
            <ResidencesActions 
              row={{ original: residence } as any} 
              onDelete={async () => {}} // Dummy function since we don't need API call here
              currentPage={1}
            />
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
            <div className="text-sm font-medium">{residence.city?.name || '-'}</div>
            <div className="text-xs text-muted-foreground">
              {residence.country?.name || '-'}
            </div>
          </div>

          {/* Brand */}
          <div className="mt-2 border-b border-border pb-2">
            <div className="flex items-center gap-2">
              {residence.brand?.logo ? (
                <img 
                  src={`/api/media/${residence.brand.logo.id}`}
                  alt={residence.brand.name}
                  className="h-6 w-6 rounded object-cover"
                />
              ) : (
                <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                  {residence.brand?.name?.charAt(0).toUpperCase() || '-'}
                </div>
              )}
              <div className="font-medium truncate">{residence.brand?.name || '-'}</div>
            </div>
          </div>

          {/* Development Status */}
          <div className="mt-2">
            <div className="text-sm text-muted-foreground">Development Status</div>
            <div className="text-sm font-medium">{residence.developmentStatus || '-'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};