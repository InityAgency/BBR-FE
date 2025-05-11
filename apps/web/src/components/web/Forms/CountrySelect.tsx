"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useDebounce } from "use-debounce";

interface Country {
  id: string;
  name: string;
}

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CountrySelect({
  value,
  onChange,
  placeholder = "Select country...",
}: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchCountries = useCallback(
    async (query: string, pageNum: number, append: boolean) => {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;
      const url = `${baseUrl}/api/${apiVersion}/countries?page=${pageNum}&limit=20${query ? `&query=${encodeURIComponent(query)}` : ""}`;

      try {
        const res = await fetch(url, { credentials: "include" });
        const data = await res.json();
        const newCountries = data.data.map((c: any) => ({ id: c.id, name: c.name }));

        setCountries((prev) =>
          append ? [...prev, ...newCountries] : newCountries
        );
        setHasMore(pageNum < data.pagination.totalPages);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Load countries on open or search
  useEffect(() => {
    if (open) {
      setPage(1);
      fetchCountries(debouncedSearch, 1, false);
    }
  }, [open, debouncedSearch, fetchCountries]);

  // Infinite scroll
  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchCountries(debouncedSearch, nextPage, true);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, debouncedSearch, fetchCountries, page]
  );

  const selected = countries.find((c) => c.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-secondary"
        >
          {selected?.name || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 shrink-0 text-white" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0  max-w-full bg-secondary">
        <Command className="w-full max-w-full bg-secondary min-w-[83svw] lg:min-w-[42svw] xl:min-w-[30svw]">
          <CommandInput
            placeholder="Search countries..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList className="bg-secondary">
            <CommandEmpty>{loading ? "Loading..." : "No countries found."}</CommandEmpty>
            <CommandGroup>
              {countries.map((country, idx) => (
                <CommandItem
                  key={country.id}
                  value={country.name}
                  onSelect={() => {
                    onChange(country.id);
                    setOpen(false);
                  }}
                  ref={idx === countries.length - 1 ? lastItemRef : null}
                >
                  {country.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === country.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            {loading && countries.length > 0 && (
              <div className="p-2 text-sm text-center">Loading more...</div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
