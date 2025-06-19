import Image from "next/image"
import Link from "next/link"
import type { Unit } from "@/types/unit"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bath, Bed, Info, Square } from "lucide-react"

interface UnitCardProps {
  unit: Unit
  onRequestInfo?: (unit: Unit) => void
}

export function UnitCard({ unit, onRequestInfo }: UnitCardProps) {
  return (
    <div className="border p-4 bg-secondary/30 rounded-lg group flex justify-between flex-col not-prose gap-4 hover:bg-secondary/50 transition-all h-full hover:-translate-y-2">
      <Link href={`/exclusive-deals/${unit.slug}`} className="flex flex-col gap-4 h-full">
        <div className="h-72 w-full overflow-hidden relative rounded-md border flex items-center justify-center">
          {unit.featureImage ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/media/${unit.featureImage.id}/content`}
              alt={unit.name}
              width={1000}
              height={1000}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary">
              {unit.residence?.brand?.logo?.id ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/media/${unit.residence.brand.logo.id}/content`}
                  alt={unit.residence.brand.name}
                  width={100}
                  height={100}
                  className="object-cover w-[30%] h-auto"
                />
              ) : null}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 w-full justify-between">
          {unit.residence.address ? (
            <span className="text-md text-muted-foreground">
              {unit.residence.address}
            </span>
          ) : null}
        </div>
        <h3 className="text-xl text-white font-medium transition-all">{unit.name}</h3>
        <div className="flex flex-col gap-1">
          <p className="text-md text-muted-foreground">{unit.description}</p>
          {unit.exclusivePrice && unit.exclusiveOfferStartDate && unit.exclusiveOfferEndDate && (() => {
            const now = new Date();
            const start = new Date(unit.exclusiveOfferStartDate);
            const end = new Date(unit.exclusiveOfferEndDate);
            if (now >= start && now <= end) {
              return (
                <div className="flex flex-row flex-wrap gap-2">
                  <p className="text-xl text-white line-through">${unit.regularPrice?.toLocaleString()}</p>
                  <p className="text-xl font-medium text-primary">${unit.exclusivePrice?.toLocaleString()}</p>
                </div>
              );
            }
            return <p className="text-xl font-medium text-primary">${unit.regularPrice?.toLocaleString()}</p>;
          })() || (
            <p className="text-xl font-medium text-primary">${unit.regularPrice?.toLocaleString()}</p>
          )}
          <div className="flex gap-4 text-md text-muted-foreground border-t pt-3 mt-2">
            <span className="flex items-center gap-2"><Bed className="w-4 h-4" /> {unit.bedroom} beds</span>
            <span className="flex items-center gap-2"><Bath className="w-4 h-4" /> {unit.bathrooms} baths</span>
            <span className="flex items-center gap-2"><Square className="w-4 h-4" /> {unit.surface}m²</span>
          </div>
        </div>
      </Link>
    </div>
  )
} 