import { Brand } from "@/app/types/models/Brand";
import { BrandCard } from "./BrandCard";

interface BrandsCardListProps {
  brands: Brand[];
}

export function BrandsCardList({ brands }: BrandsCardListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
      {brands.map((brand) => (
        <BrandCard key={brand.id} brand={brand} />
      ))}
    </div>
  );
} 