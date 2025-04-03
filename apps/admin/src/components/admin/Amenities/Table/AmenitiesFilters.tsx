"use client";

import React, { useEffect, useState } from "react";
import { TableFilters } from "@/components/admin/Table/TableFilters";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

interface AmenitiesFiltersProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

export function AmenitiesFilters({
  globalFilter,
  setGlobalFilter,
}: AmenitiesFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Kreiramo lokalno stanje da pratimo vrednost pretrage
  const [localSearch, setLocalSearch] = useState(globalFilter);
  const debouncedSearch = useDebounce(localSearch, 500); // Debounce za 500ms
  
  // Handler koji se pokreće kada se promeni vrednost u input polju
  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    // Ne pozivamo više setGlobalFilter jer ne želimo lokalno filtriranje
  };
  
  // Efekat koji se pokreće kada se promeni debouncedSearch vrednost
  useEffect(() => {
    // Samo ako se debounce vrednost stvarno razlikuje od trenutnog URL parametra
    const currentQuery = searchParams.get('query') || '';
    
    if (debouncedSearch !== currentQuery) {
      // Kreiramo novi URLSearchParams objekat na osnovu trenutnih parametara
      const params = new URLSearchParams(searchParams.toString());
      
      // Resetujemo stranicu na 1 kad god se promeni pretraga
      params.set('page', '1');
      
      // Ako postoji vrednost pretrage, dodajemo je u URL, inače je uklanjamo
      if (debouncedSearch) {
        params.set('query', debouncedSearch);
      } else {
        params.delete('query');
      }
      
      // Koristimo replace umesto push da ne dodajemo previše u istoriju
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [debouncedSearch, router, pathname, searchParams]);
  
  // Postavlja inicijalnu vrednost pretrage iz URL-a i ažurira je kad se URL promeni
  useEffect(() => {
    const queryParam = searchParams.get('query');
    if (queryParam !== localSearch) {
      setLocalSearch(queryParam || '');
    }
  }, [searchParams]);

  return (
    <TableFilters
      globalFilter={localSearch}
      setGlobalFilter={handleSearchChange}
      placeholder="Search amenities..."
    />
  );
}