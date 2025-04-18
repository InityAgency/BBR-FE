'use client';

import { usePathname } from "next/navigation";
import { CareerApplicationForm } from "./CareerApplicationForm";

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
    : `${process.env.NEXT_PUBLIC_SITE_URL}/careers/${slug}`;

  return (
    <CareerApplicationForm 
      position={position}
      pageUrl={pageUrl}
    />
  );
}