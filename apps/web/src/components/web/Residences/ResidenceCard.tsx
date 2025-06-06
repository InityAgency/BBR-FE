import Image from "next/image"
import Link from "next/link"
import type { Residence } from "@/types/residence"
import { Card, CardContent } from "@/components/ui/card"
import { FavoriteHeart } from "./FavoriteHeart"

interface ResidenceCardProps {
  residence: Residence
  score?: number
  isFavorite?: boolean
  onFavoriteRemoved?: () => void
}

const formatText = (text: string) => {
  if (!text) return "";
  return text
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export function ResidenceCard({ residence, score, isFavorite = false, onFavoriteRemoved }: ResidenceCardProps) {
  return (
    <Link href={`/residences/${residence.slug}`} className="border p-4 bg-secondary/30 rounded-lg group flex justify-between flex-col not-prose gap-4 hover:bg-secondary/50 transition-all h-full hover:-translate-y-2">
        <div className="h-72 w-full overflow-hidden relative rounded-md border flex items-center justify-center">
          {score !== undefined && (
            <span className="text-md font-medium text-white bg-primary rounded-md px-2 py-1 w-[45px] h-[45px] flex items-center justify-center absolute top-3 right-3">{(score / 10).toFixed(1)}</span>
          )}
          <FavoriteHeart 
            entityId={residence.id} 
            entityType="residences" 
            isFavorite={isFavorite}
            className={score !== undefined ? "top-12" : ""}
            onFavoriteRemoved={onFavoriteRemoved}
          />
          {residence.featuredImage ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/media/${residence.featuredImage.id}/content`}
              alt={residence.name}
              width={1000}
              height={1000}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/media/${residence.brand.logo.id}/content`}
                alt={residence.brand.name}
                width={100}
                height={100}
                className="object-cover w-[30%] h-auto"
              />
            </div>
          )}
        </div>
          <div className="mt-2 flex items-center gap-2 w-full justify-between">
            {residence.city && residence.country ? (
            <span className="text-xs text-muted-foreground">
              {residence.city.name}, {residence.country.name}
            </span>
            ): ( null )}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-primary uppercase">{formatText(residence.developmentStatus)}</span>
            </div>
          </div>
          <h3 className="text-xl text-white font-medium transition-all">{residence.name}</h3>
          <p className="text-md text-muted-foreground">
            {residence.description.length > 150 
              ? `${residence.description.substring(0, 80)}...` 
              : residence.description}
          </p>
    </Link>
  )
}
