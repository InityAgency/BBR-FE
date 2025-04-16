import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/types/brand";
import { useState } from "react";

interface BrandCardProps {
  brand: Brand;
}

export function BrandCard({ brand }: { brand: any }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link 
      href={`/brands/${brand.slug}`}
      className="block group"
    >
      <div className="flex flex-col gap-4 p-6 rounded-xl brand-card relative transition-transform duration-300 ease-in-out transform hover:-translate-y-2">
        <div className="bg-secondary rounded-xl p-6 transition-shadow duration-300 ease-in-out group-hover:shadow-xl">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden brand-card-image">
              {!imageError ? (
              <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/media/${brand.logo.id}/content`}
                  alt={brand.name}
                  fill
                  className="object-fit p-4"
                  onError={() => setImageError(true)}
              />
              ) : (
              <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-400">{brand.name[0]}</span>
              </div>
              )}
          </div>
          <div className="flex flex-col gap-2 brand-card-description">
              <h3 className="text-2xl font-bold text-center text-white transition-colors duration-300 ease-in-out group-hover:text-primary">{brand.name}</h3>
              <p className="text-md text-center text-white/60 line-clamp-2">{brand.description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
} 