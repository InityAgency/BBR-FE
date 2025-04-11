// components/admin/Residences/Table/ResidencesTable.tsx
"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useTable } from "@/hooks/useTable";
import { useTableFilters } from "@/hooks/useTableFilters";
import { BaseTable } from "@/components/admin/Table/BaseTable";
import { ResidencesFilters } from "./ResidencesFilters";
import { columns } from "./ResidencesColumns";
import { Residence } from "../../../../app/types/models/Residence";
import { fuzzyFilter } from "@/lib/tableFilters";
import { CellContext } from "@tanstack/react-table";
import { ResidencesActions } from "./ResidencesActions";
import { ResidencesCardList } from "../Cards/ResidencesCardList";
import { Skeleton } from "@/components/ui/skeleton";
import { TablePagination } from "@/components/admin/Table/TablePagination";
import { useSearchParams } from "next/navigation";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";

const ITEMS_PER_PAGE = 10;

interface City {
  id: string;
  name: string;
  country?: {
    id: string;
    name: string;
    code: string;
  };
}

interface CitiesApiResponse {
  data: City[];
  statusCode: number;
  message: string;
  pagination: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

// Napredni memo za poboljšanje performansi
function areEqual(prevProps: any, nextProps: any) {
  return (
    prevProps.row.original.id === nextProps.row.original.id &&
    prevProps.currentPage === nextProps.currentPage
  );
}

// Memoizovane akcije za bolju performansu
const MemoizedResidencesActions = React.memo(
  ResidencesActions,
  areEqual
);

// Popravka za kolone da koriste ResidencesActions
const enhancedColumns = (fetchResidences: (page: number, query?: string, statuses?: string[], cityIds?: string[], countryIds?: string[]) => Promise<void>, currentPage: number) => columns.map(column => {
  if (column.id === "actions") {
    return {
      ...column,
      cell: (props: CellContext<Residence, unknown>) => (
        <MemoizedResidencesActions 
          row={props.row} 
          onDelete={fetchResidences} 
          currentPage={currentPage} 
        />
      )
    };
  }
  return column;
});

// Memoizovan TableSkeleton za bolju performansu
const TableSkeleton = React.memo(() => {
  return (
    <div className="w-full border rounded-md">
      {/* Skelet za header tabele */}
      <div className="border-b px-4 py-3 flex">
        <Skeleton className="h-6 w-8 rounded-md mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/4 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-40 rounded-md ml-2 bg-muted/20" />
      </div>
      
      {/* Skelet za redove tabele */}
      {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
        <div key={index} className="border-b px-4 py-3 flex items-center">
            <Skeleton className="h-6 w-8 rounded-md mr-2 bg-muted/20" />
            <Skeleton className="h-6 w-1/4 rounded-md ml-2 mr-2 bg-muted/20" />
            <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
            <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
            <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
            <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
            <Skeleton className="h-6 w-40 rounded-md ml-2 bg-muted/20" />
        </div>
      ))}
    </div>
  );
});

// Memoizovan CardsSkeleton za bolju performansu
const CardsSkeleton = React.memo(() => {
  return (
    <div className="space-y-4">
      {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
        <div key={index} className="border rounded-md p-4 space-y-3">
          <div className="flex justify-between mt-3">
            <Skeleton className="h-8 w-32 rounded-md bg-muted/20" />
            <Skeleton className="h-8 w-20 rounded-md bg-muted/20" />
          </div>
          <div className="flex justify-between mt-3 mb-3">
            <Skeleton className="h-8 w-80 rounded-md bg-muted/20" />
            <Skeleton className="h-8 w-20 rounded-md bg-muted/20" />
          </div>
          <Skeleton className="h-8 w-60 rounded-md bg-muted/20" />
          <div className="flex items-center space-x-2 mt-4">
            <Skeleton className="h-8 w-1/2 rounded-md bg-muted/20" />
            <Skeleton className="h-8 w-1/2 rounded-md bg-muted/20" />
          </div>
        </div>
      ))}
    </div>
  );
});

// Memoizovana MemoizedResidencesCardList 
const MemoizedResidencesCardList = React.memo(
  ResidencesCardList,
  (prevProps, nextProps) => {
    if (prevProps.residences.length !== nextProps.residences.length) {
      return false;
    }
    // Provera samo ID-jeva za brzu proveru
    return prevProps.residences.every((prev, index) => 
      prev.id === nextProps.residences[index]?.id
    );
  }
);

// Memoizovana paginacija
const MemoizedTablePagination = React.memo(
  TablePagination,
  (prevProps, nextProps) => 
    prevProps.currentPage === nextProps.currentPage &&
    prevProps.totalPages === nextProps.totalPages &&
    prevProps.totalItems === nextProps.totalItems &&
    prevProps.loading === nextProps.loading
);

interface ResidencesTableProps {
  residences: Residence[];
  loading: boolean;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
  selectedStatuses: string[];
  onStatusesChange: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCityIds: string[];
  onCityIdsChange: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCountryIds: string[];
  onCountryIdsChange: React.Dispatch<React.SetStateAction<string[]>>;
  fetchResidences: (
    page: number, 
    query?: string, 
    statuses?: string[], 
    cityIds?: string[],
    countryIds?: string[]
  ) => Promise<void>;
}

// Konstante za keširanje gradova
const CITIES_CACHE_KEY = "residence-cities-cache";
const CITIES_CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 sata

// Pomoćne funkcije za keširanje
const getFromCache = <T,>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  
  try {
    const cacheItem = localStorage.getItem(key);
    if (!cacheItem) return null;
    
    const parsedCache = JSON.parse(cacheItem);
    const now = Date.now();
    
    // Proveravamo da li je keš istekao
    if (now - parsedCache.timestamp > CITIES_CACHE_EXPIRY) {
      localStorage.removeItem(key);
      return null;
    }
    
    return parsedCache.data;
  } catch (error) {
    console.warn("Error reading from cache:", error);
    return null;
  }
};

const saveToCache = <T,>(key: string, data: T): void => {
  if (typeof window === "undefined") return;
  
  try {
    const cacheItem = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cacheItem));
  } catch (error) {
    console.warn("Error saving to cache:", error);
  }
};

export function ResidencesTable({
  residences,
  loading,
  totalItems,
  totalPages,
  currentPage,
  goToNextPage,
  goToPreviousPage,
  goToPage,
  selectedStatuses,
  onStatusesChange,
  selectedCityIds,
  onCityIdsChange,
  selectedCountryIds,
  onCountryIdsChange,
  fetchResidences
}: ResidencesTableProps) {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('query');
  const [search, setSearch] = useState(queryParam || "");
  const [cities, setCities] = useState<City[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(true);

  // Memoizujemo enhanced columns kako bi se sprečilo ponovno kreiranje pri svakom renderu
  const memoizedColumns = useMemo(
    () => enhancedColumns(fetchResidences, currentPage),
    [fetchResidences, currentPage]
  );

  // Koristimo generički hook za tabelu
  const {
    table,
    setGlobalFilter: setTableGlobalFilter,
  } = useTable<Residence>({
    data: residences,
    columns: memoizedColumns,
    initialSorting: [{ id: "createdAt", desc: true }],
    globalFilterFn: (row, columnId, value, addMeta) => {
      // Koristimo našu univerzalnu funkciju
      const result = fuzzyFilter(row, columnId, value, addMeta);
      
      // Dodatno proveravamo ID polje eksplicitno
      const id = row.original.id || "";
      const searchValue = String(value).toLowerCase();
      
      // Vraćamo true ako je univerzalna pretraga uspela ILI ako ID sadrži traženi tekst
      return result || id.toLowerCase().includes(searchValue);
    },
    initialPageSize: ITEMS_PER_PAGE,
    manualPagination: true,
    pageCount: totalPages,
  });

  // Učitavamo gradove sa API-a
  const fetchCities = useCallback(async () => {
    // Prvo pokušavamo da učitamo iz keša
    const cachedCities = getFromCache<City[]>(CITIES_CACHE_KEY);
    if (cachedCities && cachedCities.length > 0) {
      setCities(cachedCities);
      setCitiesLoading(false);
      return;
    }

    try {
      setCitiesLoading(true);
      const url = new URL(`${API_BASE_URL}/api/${API_VERSION}/cities`);
      url.searchParams.set("limit", "100");
      url.searchParams.set("page", "1");

      const response = await fetch(url.toString(), {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching cities: ${response.status}`);
      }

      const data: CitiesApiResponse = await response.json();
      const citiesData = data.data || [];
      
      // Sačuvajmo u keš
      saveToCache(CITIES_CACHE_KEY, citiesData);
      
      setCities(citiesData);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities([]);
    } finally {
      setCitiesLoading(false);
    }
  }, []);

  // Efekat za učitavanje gradova
  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  // Sinhronizujemo globalFilter sa tabelom
  React.useEffect(() => {
    setTableGlobalFilter(search);
  }, [search, setTableGlobalFilter]);

  // VAŽNO: Promenjen je parametar locationAccessor iz 'city' u 'location' koje odgovara koloni u tabeli
  const {
    locationSearchValue,
    setLocationSearchValue,
    uniqueStatuses,
  } = useTableFilters<Residence>({
    table,
    data: residences,
    locationAccessor: 'location', // Koristi tačan ID kolone iz tabele
    statusAccessor: "status",
    useNestedFilter: true,
    nestedField: "name"
  });

  // Sinhronizujemo stanje sa URL parametrom
  useEffect(() => {
    if (queryParam !== search) {
      setSearch(queryParam || "");
    }
  }, [queryParam]);

  // Helper funkcije za stilizovanje redova i ćelija
  const getRowClassName = useCallback((row: any) => {
    const status = row.original.status;
    if (status === "DELETED") return "opacity-60";
    if (status === "DRAFT") return "opacity-80";
    return "";
  }, []);

  // Optimizujemo da ne renderuje tabelu kada je loading stanje
  const tableContent = useMemo(() => {
    if (loading) {
      return (
        <>
          <div className="block lg:hidden">
            <CardsSkeleton />
          </div>
          <div className="hidden lg:block">
            <TableSkeleton />
          </div>
        </>
      );
    }
    return (
      <>
        <div className="block lg:hidden">
          <MemoizedResidencesCardList residences={table.getRowModel().rows.map(row => row.original)} />
        </div>
        <div className="hidden lg:block">
          <BaseTable 
            table={table}
            getRowClassName={getRowClassName}
          />
        </div>
      </>
    );
  }, [loading, table, getRowClassName]);

  return (
    <div className="w-full">
      {/* Filteri */}
      <ResidencesFilters
        globalFilter={search}
        setGlobalFilter={setSearch}
        selectedCityIds={selectedCityIds}
        setSelectedCityIds={onCityIdsChange}
        selectedCountryIds={selectedCountryIds}
        setSelectedCountryIds={onCountryIdsChange}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={onStatusesChange}
        cities={cities}
        countries={[]} // Prosleđujemo praznu listu država jer ih više ne koristimo u UI
        locationSearchValue={locationSearchValue}
        setLocationSearchValue={setLocationSearchValue}
        loading={citiesLoading}
      />

      {/* Optimizovan sadržaj tabele */}
      {tableContent}

      <MemoizedTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        goToPage={goToPage}
        loading={loading}
      />
    </div>
  );
}

export default React.memo(ResidencesTable);