"use client";

import { useState, useMemo, useEffect } from "react";
import { Table } from "@tanstack/react-table";
import { multiSelectFilter, nestedFieldFilter } from "@/lib/tableFilters";

interface UseTableFiltersProps<TData> {
  table: Table<TData>;
  data: TData[];
  locationAccessor?: keyof TData;
  statusAccessor?: keyof TData;
  useNestedFilter?: boolean;
  nestedField?: string;
}

export function useTableFilters<TData>({
  table,
  data,
  locationAccessor,
  statusAccessor,
  useNestedFilter = false,
  nestedField = 'name'
}: UseTableFiltersProps<TData>) {
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [locationSearchValue, setLocationSearchValue] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  // Izdvajamo jedinstvene lokacije iz podataka
  const uniqueLocations = useMemo(() => {
    if (!locationAccessor) return [];
    
    // Ako koristimo ugneždeno polje, pristupamo mu na odgovarajući način
    if (useNestedFilter) {
      const locations = data.map(item => {
        const value = item[locationAccessor];
        if (value && typeof value === 'object' && nestedField in (value as object)) {
          return (value as any)[nestedField];
        }
        return undefined;
      }).filter(Boolean) as string[];
      
      return [...new Set(locations)].sort();
    } else {
      const locations = data.map(item => {
        const value = item[locationAccessor];
        if (value && typeof value === 'object' && 'name' in value) {
          return (value as { name: string }).name;
        }
        return value as string;
      });
      return [...new Set(locations)].sort();
    }
  }, [data, locationAccessor, useNestedFilter, nestedField]);

  // Izdvajamo jedinstvene statuse iz podataka
  const uniqueStatuses = useMemo(() => {
    if (!statusAccessor) return [];
    const statuses = data.map(item => item[statusAccessor] as unknown as string);
    return [...new Set(statuses)].sort();
  }, [data, statusAccessor]);

  // Filtriramo lokacije prema pretrazi
  const filteredLocations = useMemo(() => {
    return uniqueLocations.filter(location => 
      location && typeof location === 'string' && 
      location.toLowerCase().includes(locationSearchValue.toLowerCase())
    );
  }, [uniqueLocations, locationSearchValue]);

  // Primenjujemo filtere po lokaciji
  useEffect(() => {
    if (locationAccessor) {
      try {
        // Explicitno postavimo filter funkciju pre nego što postavimo vrednost filtera
        const locationColumn = table.getColumn(locationAccessor as string);
        
        if (locationColumn) {
          // Postavljamo funkciju filtera eksplicitno 
          locationColumn.columnDef.filterFn = useNestedFilter 
            ? nestedFieldFilter 
            : multiSelectFilter;
          
          // Ako koristimo nested filter, dodajemo meta podatke
          if (useNestedFilter) {
            locationColumn.columnDef.meta = {
              ...locationColumn.columnDef.meta,
              nestedField
            };
          } else {
            // Dodajemo meta podatke za filtriranje po brandType.name
            locationColumn.columnDef.meta = {
              ...locationColumn.columnDef.meta,
              nestedField: 'name'
            };
          }
          
          if (selectedLocations.length > 0) {
            locationColumn.setFilterValue(selectedLocations);
          } else {
            locationColumn.setFilterValue(undefined);
          }
        }
      } catch (error) {
        console.warn(`Column ${String(locationAccessor)} not found in table`);
      }
    }
  }, [selectedLocations, table, locationAccessor, useNestedFilter, nestedField]);

  // Primenjujemo filtere po statusu
  useEffect(() => {
    if (statusAccessor) {
      try {
        // Explicitno postavimo filter funkciju pre nego što postavimo vrednost filtera
        const statusColumn = table.getColumn(statusAccessor as string);
        
        if (statusColumn) {
          // Postavljamo funkciju filtera eksplicitno
          statusColumn.columnDef.filterFn = multiSelectFilter;
          
          if (selectedStatuses.length > 0) {
            statusColumn.setFilterValue(selectedStatuses);
          } else {
            statusColumn.setFilterValue(undefined);
          }
        }
      } catch (error) {
        console.warn(`Column ${String(statusAccessor)} not found in table`);
      }
    }
  }, [selectedStatuses, table, statusAccessor]);

  return {
    selectedLocations,
    setSelectedLocations,
    locationSearchValue,
    setLocationSearchValue,
    selectedStatuses,
    setSelectedStatuses,
    uniqueLocations,
    uniqueStatuses,
    filteredLocations,
  };
}