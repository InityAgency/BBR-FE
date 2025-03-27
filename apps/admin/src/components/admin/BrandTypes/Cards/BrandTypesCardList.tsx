import { BrandType } from "@/app/types/models/BrandType";
import { BrandTypeCard } from "./BrandTypeCard";

interface BrandTypesCardListProps {
  brandTypes: BrandType[];
}

export function BrandTypesCardList({ brandTypes }: BrandTypesCardListProps) {
  return (
    <div className="space-y-4 block lg:hidden">
      {brandTypes.map((brandType) => (
        <BrandTypeCard key={brandType.id} brandType={brandType} />
      ))}
      {brandTypes.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          No brand types found
        </div>
      )}
    </div>
  );
} 