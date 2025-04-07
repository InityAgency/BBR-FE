"use client";

import React, { useEffect, useState } from "react";
import { CircleDashed, X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TableFilters } from "@/components/admin/Table/TableFilters";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandItem, CommandList, CommandEmpty } from "@/components/ui/command";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

interface RankingCategoryType {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface RankingCategoryFiltersProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  selectedCategoryTypeIds: string[];
  setSelectedCategoryTypeIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedStatuses: string[];
  setSelectedStatuses: React.Dispatch<React.SetStateAction<string[]>>;
  categoryTypes: RankingCategoryType[];
}

// Definisanje fiksnih vrednosti za status - samo oni koje želimo da koristimo
const PREDEFINED_STATUSES = ["ACTIVE", "DRAFT", "DELETED"];

// Funkcija za formatiranje imena tipa kategorije sa prvim velikim slovom
const formatTypeName = (name: string): string => {
  if (!name) return '';
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

export function RankingCategoryFilters({
  globalFilter,
  setGlobalFilter,
  selectedCategoryTypeIds,
  setSelectedCategoryTypeIds,
  selectedStatuses,
  setSelectedStatuses,
  categoryTypes = [],
}: RankingCategoryFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Kreiramo lokalno stanje da pratimo vrednost pretrage
  const [localSearch, setLocalSearch] = useState(globalFilter);
  const debouncedSearch = useDebounce(localSearch, 500); // Debounce za 500ms
  
  // Filtriranje tipova na osnovu pretrage
  const [typeSearchValue, setTypeSearchValue] = useState('');
  const [filteredCategoryTypes, setFilteredCategoryTypes] = useState<RankingCategoryType[]>(categoryTypes);
  
  // Ažuriranje filtriranih tipova kada se promeni pretraga ili lista tipova
  useEffect(() => {
    if (typeSearchValue.trim() === '') {
      setFilteredCategoryTypes(categoryTypes);
    } else {
      const lowercaseSearch = typeSearchValue.toLowerCase();
      const filtered = categoryTypes.filter(categoryType => 
        categoryType.name.toLowerCase().includes(lowercaseSearch)
      );
      setFilteredCategoryTypes(filtered);
    }
  }, [typeSearchValue, categoryTypes]);
  
  // Handler koji se pokreće kada se promeni vrednost u input polju
  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
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

  // Funkcija za pronalaženje imena tipa na osnovu ID-a
  const getCategoryTypeName = (categoryTypeId: string): string => {
    const categoryType = categoryTypes.find(ct => ct.id === categoryTypeId);
    return categoryType ? formatTypeName(categoryType.name) : categoryTypeId;
  };

  return (
    <>
      <TableFilters
        globalFilter={localSearch}
        setGlobalFilter={handleSearchChange}
        placeholder="Search ranking categories..."
      >
        {/* Category Type Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10">
              <Tag className="h-4 w-4 mr-2" />
              Category Types
              {selectedCategoryTypeIds.length > 0 && (
                <>
                  <div className="w-px h-4 bg-muted mx-2" />
                  <Badge variant="secondary" className="rounded-sm w-6 h-6 p-0 flex items-center justify-center text-xs">
                    {selectedCategoryTypeIds.length}
                  </Badge>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <Command>
              <CommandInput 
                placeholder="Search Category Types..." 
                value={typeSearchValue}
                onValueChange={setTypeSearchValue}
              />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                {filteredCategoryTypes.map((categoryType) => (
                  <CommandItem
                    key={categoryType.id}
                    onSelect={() => {
                      setSelectedCategoryTypeIds((prev) => {
                        if (prev.includes(categoryType.id)) {
                          return prev.filter(item => item !== categoryType.id);
                        } else {
                          return [...prev, categoryType.id];
                        }
                      });
                    }}
                  >
                    <Checkbox
                      checked={selectedCategoryTypeIds.includes(categoryType.id)}
                      className="mr-2 h-4 w-4"
                    />
                    <span className="capitalize">{formatTypeName(categoryType.name)}</span>
                  </CommandItem>
                ))}
              </CommandList>
              {selectedCategoryTypeIds.length > 0 && (
                <div className="border-t border-border p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedCategoryTypeIds([])}
                  >
                    Clear
                    <X className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </Command>
          </PopoverContent>
        </Popover>
        
        {/* Status Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10">
              <CircleDashed className="h-4 w-4 mr-2" />
              Status
              {selectedStatuses.length > 0 && (
                <>
                  <div className="w-px h-4 bg-muted mx-2" />
                  <Badge variant="secondary" className="rounded-sm w-6 h-6 p-0 flex items-center justify-center text-xs">
                    {selectedStatuses.length}
                  </Badge>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <Command>
              <CommandList>
                <CommandEmpty>No statuses found.</CommandEmpty>
                {PREDEFINED_STATUSES.map((status) => (
                  <CommandItem
                    key={status}
                    onSelect={() => {
                      setSelectedStatuses((prev) => {
                        if (prev.includes(status)) {
                          return prev.filter(item => item !== status);
                        } else {
                          return [...prev, status];
                        }
                      });
                    }}
                  >
                    <Checkbox
                      checked={selectedStatuses.includes(status)}
                      className="mr-2 h-4 w-4"
                    />
                    <span className="capitalize">{status.toLowerCase()}</span>
                  </CommandItem>
                ))}
              </CommandList>
              {selectedStatuses.length > 0 && (
                <div className="border-t border-border p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedStatuses([])}
                  >
                    Clear
                    <X className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </Command>
          </PopoverContent>
        </Popover>
      </TableFilters>

      {/* Prikaz aktivnih filtera */}
      {(selectedCategoryTypeIds.length > 0 || selectedStatuses.length > 0) && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {/* Oznake za tipove kategorija */}
          {selectedCategoryTypeIds.map(categoryTypeId => (
            <Badge key={`categoryType-${categoryTypeId}`} variant="secondary" className="px-2 py-1">
              <span className="capitalize">{getCategoryTypeName(categoryTypeId)}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => setSelectedCategoryTypeIds(prev => prev.filter(id => id !== categoryTypeId))}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          {/* Oznake za statuse */}
          {selectedStatuses.map(status => (
            <Badge key={`status-${status}`} variant="secondary" className="px-2 py-1">
              <span className="capitalize">{status.toLowerCase()}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => setSelectedStatuses(prev => prev.filter(s => s !== status))}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          {/* Dugme za brisanje svih filtera */}
          {(selectedCategoryTypeIds.length > 1 || selectedStatuses.length > 1) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2"
              onClick={() => {
                setSelectedCategoryTypeIds([]);
                setSelectedStatuses([]);
              }}
            >
              Clear All
            </Button>
          )}
        </div>
      )}
    </>
  );
}