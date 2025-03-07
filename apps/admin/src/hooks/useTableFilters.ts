"use client";

import { useState, useMemo, useEffect } from "react";
import { Table } from "@tanstack/react-table";
import { multiSelectFilter } from "@/lib/tableFilters";

interface UseTableFiltersProps<TData> {
  table: Table<TData>;
  data: TData[];
  locationAccessor?: keyof TData;
  statusAccessor?: keyof TData;
}

export function useTableFilters<TData>({
  table,
  data,
  locationAccessor,
  statusAccessor,
}: UseTableFiltersProps<TData>) {
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [locationSearchValue, setLocationSearchValue] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  // Izdvajamo jedinstvene lokacije iz podataka
  const uniqueLocations = useMemo(() => {
    if (!locationAccessor) return [];
    const locations = data.map(item => item[locationAccessor] as unknown as string);
    return [...new Set(locations)].sort();
  }, [data, locationAccessor]);

  // Izdvajamo jedinstvene statuse iz podataka
  const uniqueStatuses = useMemo(() => {
    if (!statusAccessor) return [];
    const statuses = data.map(item => item[statusAccessor] as unknown as string);
    return [...new Set(statuses)].sort();
  }, [data, statusAccessor]);

  // Filtriramo lokacije prema pretrazi
  const filteredLocations = useMemo(() => {
    return uniqueLocations.filter(location => 
      location.toLowerCase().includes(locationSearchValue.toLowerCase())
    );
  }, [uniqueLocations, locationSearchValue]);

  // Primenjujemo filtere po lokaciji
  useEffect(() => {
    if (locationAccessor) {
      // Explicitno postavimo filter funkciju pre nego što postavimo vrednost filtera
      const locationColumn = table.getColumn(locationAccessor as string);
      
      if (locationColumn) {
        // Postavljamo funkciju filtera eksplicitno 
        locationColumn.columnDef.filterFn = multiSelectFilter;
        
        if (selectedLocations.length > 0) {
          locationColumn.setFilterValue(selectedLocations);
        } else {
          locationColumn.setFilterValue(undefined);
        }
      }
    }
  }, [selectedLocations, table, locationAccessor]);

  // Primenjujemo filtere po statusu
  useEffect(() => {
    if (statusAccessor) {
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