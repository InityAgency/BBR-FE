'use client';

import { usePathname } from "next/navigation";
import { CareerApplicationForm } from "./CareerApplicationForm";

// Helper funkcija za pravilno spajanje URL-ova
function joinUrls(baseUrl: string, path: string): string {
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

interface CareerFormWrapperProps {
  position: string;
  slug: string;
}

export function CareerFormWrapper({ position, slug }: CareerFormWrapperProps) {
  // Koristimo usePathname koji je dostupan samo u client komponentama
  const pathname = usePathname();
  
  // Dobavljamo puni URL za websiteURL parametar
  const pageUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${pathname}` 
    : joinUrls(process.env.NEXT_PUBLIC_SITE_URL || 'https://bestbrandedresidences.com', `/careers/${slug}`);

  return (
    <CareerApplicationForm 
      position={position}
      pageUrl={pageUrl}
    />
  );
}