import Image from "next/image"
import Link from "next/link"
import type { Residence } from "@/types/residence"
import { Card, CardContent } from "@/components/ui/card"

interface ResidenceCardProps {
  residence: Residence
}

export function ResidenceCard({ residence }: ResidenceCardProps) {

  
  return (
    <Link href={`/residences/${residence.slug}`} className="border p-4 bg-secondary/30 rounded-lg group flex justify-between flex-col not-prose gap-4 hover:bg-secondary/50 transition-all h-full hover:-translate-y-2">

        <div className="h-72 w-full overflow-hidden relative rounded-md border flex items-center justify-center">
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
            <span className="text-xs font-medium text-primary">{residence.developmentStatus}</span>
          </div>
          <h3 className="text-xl text-white font-medium transition-all">{residence.name}</h3>
          <p className="text-md text-muted-foreground">{residence.description}</p>
    </Link>
  )
}
