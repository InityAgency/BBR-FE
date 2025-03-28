import { Brand } from "@/app/types/models/Brand";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BrandsActions } from "../Table/BrandsActions";
import { Building2, Calendar } from "lucide-react";

interface BrandCardProps {
  brand: Brand;
}

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

export function BrandCard({ brand }: BrandCardProps) {
  return (
    <Card className="w-full hover:bg-muted/50 transition-colors">
      <CardContent>
        <div className="flex items-center justify-between gap-2 mb-2">
            {renderStatusBadge(brand.status)}
            <BrandsActions row={{ original: brand } as any} />
        </div>
        <div className="flex items-start justify-between mb-2 border-b border-border pb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              <a href={`/brands/${brand.id}`} className="hover:underline">
                {brand.name}
              </a>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5"># {brand.id}</p>
            {brand.description && (
              <p className="text-sm text-muted-foreground mt-1">{brand.description}</p>
            )}
          </div>
        </div>

        <div className="space-y-2 ">
          <div className="text-sm mt-3 mb-3 border-b border-border pb-2">
            <span className="text-muted-foreground">{brand.brandType.name}</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">-</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{new Date(brand.registeredAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 