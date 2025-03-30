import { Amenity } from "@/app/types/models/Amenities";
import { AmenityCard } from "./AmenitiesCard";

interface AmenitiesCardListProps {
  amenities: Amenity[];
  onDelete: (page: number) => Promise<void>;
  currentPage: number;
}

export function AmenitiesCardList({ amenities, onDelete, currentPage }: AmenitiesCardListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
      {amenities.map((amenity) => (
        <AmenityCard 
          key={amenity.id} 
          amenity={amenity} 
          onDelete={onDelete}
          currentPage={currentPage}
        />
      ))}
    </div>
  );
}
