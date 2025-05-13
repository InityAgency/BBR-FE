import Image from "next/image"
import Link from "next/link"
import type { Unit } from "@/types/unit"
import { Card, CardContent } from "@/components/ui/card"

interface UnitCardProps {
  unit: Unit
}

export function UnitCard({ unit }: UnitCardProps) {
  return (
    <Link href={`/exclusive-deals/${unit.slug}`} className="border p-4 bg-secondary/30 rounded-lg group flex justify-between flex-col not-prose gap-4 hover:bg-secondary/50 transition-all h-full hover:-translate-y-2">
      <div className="h-72 w-full overflow-hidden relative rounded-md border flex items-center justify-center">
        {unit.featuredImage ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/media/${unit.featuredImage.id}/content`}
            alt={unit.name}
            width={1000}
            height={1000}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/media/${unit.residence.brand.logo.id}/content`}
              alt={unit.residence.brand.name}
              width={100}
              height={100}
              className="object-cover w-[30%] h-auto"
            />
          </div>
        )}
      </div>
      <div className="mt-2 flex items-center gap-2 w-full justify-between">
        {unit.residence.city && unit.residence.city.country ? (
          <span className="text-xs text-muted-foreground">
            {unit.residence.city.name}, {unit.residence.city.country.name}
          </span>
        ) : null}
        <span className="text-xs font-medium text-primary">{unit.status}</span>
      </div>
      <h3 className="text-xl text-white font-medium transition-all">{unit.name}</h3>
      <div className="flex flex-col gap-2">
        <p className="text-md text-muted-foreground">{unit.description}</p>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>{unit.bedrooms} beds</span>
          <span>{unit.bathrooms} baths</span>
          <span>{unit.size}m²</span>
        </div>
        <p className="text-lg font-medium text-primary">${unit.price.toLocaleString()}</p>
      </div>
    </Link>
  )
} 