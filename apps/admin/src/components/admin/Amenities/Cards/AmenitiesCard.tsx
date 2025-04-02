import { Amenity } from "@/app/types/models/Amenities";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { AmenitiesActions } from "../Table/AmenitiesActions";

interface AmenitiesCardProps {
  amenity: Amenity;
  onDelete: (page: number) => Promise<void>;
  currentPage: number;
}

export function AmenityCard({ amenity, onDelete, currentPage }: AmenitiesCardProps) {
  return (
    <Card className="w-full hover:bg-muted/50 transition-colors">
      <CardContent>
        <div className="flex items-start justify-between mb-2 border-b border-border pb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              <a href={`/residences/amenities/${amenity.id}/edit`} className="hover:underline">
                {amenity.name}
              </a>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5"># {amenity.id}</p>
            {amenity.description && (
              <p className="text-sm text-muted-foreground mt-1">{amenity.description}</p>
            )}
          </div>
          <AmenitiesActions row={{ original: amenity } as any} onDelete={onDelete} currentPage={currentPage} />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm mt-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Created: {new Date(amenity.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Updated: {new Date(amenity.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}