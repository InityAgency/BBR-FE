// components/web/Forms/MultiSelect.tsx
"use client"

import { useEffect, useState, useCallback, useRef, useMemo } from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useDebounce } from "use-debounce"

interface Option {
  id: string
  name: string
}

interface MultiSelectProps {
  value: string[]
  onChange: (value: string[]) => void
  label?: string
  placeholder?: string
  apiEndpoint: string
  disabled?: boolean
  className?: string
  maxItems?: number
  required?: boolean
  error?: string
  initialOptions?: { id: string; name: string }[]
}

// Cache for storing options data
const optionsCache: Record<string, {timestamp: number, data: Option[], hasMore: boolean, totalPages: number}> = {};
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

export function MultiSelect({
  value = [],
  onChange,
  label,
  placeholder = "Select options...",
  apiEndpoint,
  disabled = false,
  className,
  maxItems,
  required = false,
  error,
  initialOptions = [],
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<Option[]>(initialOptions)
  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebounce(search, 500)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const queryRunningRef = useRef(false)
  const [selectedOptions, setSelectedOptions] = useState<Option[]>(initialOptions.filter(opt => value.includes(opt.id)))

  // Create a cache key based on endpoint and search term
  const cacheKey = useMemo(() => `${apiEndpoint}-${debouncedSearch}`, [apiEndpoint, debouncedSearch]);

  const fetchOptions = useCallback(
    async (query: string, pageNum: number, append: boolean) => {
      // Prevent concurrent requests for the same page
      if (queryRunningRef.current) return;
      queryRunningRef.current = true;
      
      // Check cache first
      const now = Date.now();
      const cacheEntry = optionsCache[cacheKey];
      const isCacheValid = cacheEntry && (now - cacheEntry.timestamp < CACHE_TIME);
      
      if (isCacheValid && pageNum === 1 && !append) {
        setOptions(cacheEntry.data);
        setHasMore(cacheEntry.hasMore);
        queryRunningRef.current = false;
        return;
      }
      
      setLoading(true)

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL
        const apiVersion = process.env.NEXT_PUBLIC_API_VERSION
        const url = `${baseUrl}/api/${apiVersion}/${apiEndpoint}?page=${pageNum}&limit=20${
          query ? `&query=${encodeURIComponent(query)}` : ""
        }`
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
        
        const res = await fetch(url, { 
          credentials: "include",
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        const data = await res.json();
        const newOptions = Array.isArray(data.data) 
          ? data.data.map((item: any) => ({ id: item.id, name: item.name })) 
          : [];
        
        const totalPages = data.pagination?.totalPages || 1;
        const newHasMore = pageNum < totalPages;
        
        if (!append) {
          setOptions(newOptions);
          // Update cache
          optionsCache[cacheKey] = {
            timestamp: now,
            data: newOptions,
            hasMore: newHasMore,
            totalPages: totalPages
          };
        } else {
          setOptions(prev => {
            const combined = [...prev, ...newOptions];
            // Update cache with combined results
            optionsCache[cacheKey] = {
              timestamp: now,
              data: combined,
              hasMore: newHasMore,
              totalPages: totalPages
            };
            return combined;
          });
        }
        
        setHasMore(newHasMore);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          console.error("Error fetching options:", error);
        }
      } finally {
        setLoading(false);
        queryRunningRef.current = false;
      }
    },
    [cacheKey]
  );

  // Load options only when opened or search changes while open
  useEffect(() => {
    if (open && (debouncedSearch !== search || isInitialLoad)) {
      setPage(1);
      fetchOptions(debouncedSearch, 1, false);
      setIsInitialLoad(false);
    }
  }, [open, debouncedSearch, fetchOptions, isInitialLoad, search]);

  // Update selected options when value changes
  useEffect(() => {
    const fetchSelectedOptions = async () => {
      if (value.length === 0) {
        setSelectedOptions([]);
        return;
      }

      // Check if we already have all the options in our current options list or cache
      const existingOptions: Option[] = [];
      const missingIds: string[] = [];
      
      value.forEach(id => {
        // Look in current options
        const option = options.find(o => o.id === id);
        if (option) {
          existingOptions.push(option);
        } else {
          // Look in cache
          for (const cacheKey in optionsCache) {
            if (cacheKey.startsWith(apiEndpoint)) {
              const cachedOption = optionsCache[cacheKey].data.find(o => o.id === id);
              if (cachedOption && !existingOptions.some(o => o.id === id)) {
                existingOptions.push(cachedOption);
              }
            }
          }
          
          // If still not found, add to missing
          if (!existingOptions.some(o => o.id === id)) {
            missingIds.push(id);
          }
        }
      });
      
      // If we have all options, no need to fetch
      if (missingIds.length === 0) {
        setSelectedOptions(existingOptions);
        return;
      }

      // Otherwise fetch the missing options using the main endpoint
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;
        const url = `${baseUrl}/api/${apiVersion}/${apiEndpoint}?limit=100`;

        const res = await fetch(url, { credentials: "include" });
        const data = await res.json();

        if (Array.isArray(data.data)) {
          const fetchedOptions = data.data
            .filter((item: any) => missingIds.includes(item.id))
            .map((item: any) => ({ id: item.id, name: item.name }));
          const allSelectedOptions = [...existingOptions, ...fetchedOptions];
          setSelectedOptions(allSelectedOptions);
        }
      } catch (error) {
        console.error("Error fetching selected options:", error);
      }
    };

    fetchSelectedOptions();
  }, [value, options, apiEndpoint]);

  // Infinite scroll
  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !queryRunningRef.current) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchOptions(debouncedSearch, nextPage, true);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, debouncedSearch, fetchOptions, page]
  );

  const handleSelect = useCallback(
    (optionId: string) => {
      const isSelected = value.includes(optionId);

      if (isSelected) {
        // Remove the option
        onChange(value.filter((id) => id !== optionId));
      } else {
        // Add the option if under max limit
        if (maxItems && value.length >= maxItems) {
          return;
        }
        onChange([...value, optionId]);
      }
    },
    [value, onChange, maxItems]
  );

  const handleRemove = useCallback(
    (optionId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(value.filter((id) => id !== optionId));
    },
    [value, onChange]
  );

  // Reset search when dropdown is closed
  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  return (
    <FormItem className="flex flex-col">
      {label && <FormLabel>{label}{required && " *"}</FormLabel>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={disabled}
              className={cn(
                "w-full justify-between min-h-10 bg-secondary",
                selectedOptions.length > 0 ? "h-auto" : "", 
                className
              )}
              type="button"
            >
              <div className="flex flex-wrap gap-1 items-center">
                {selectedOptions.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {selectedOptions.map((option) => (
                      <Badge key={option.id} variant="secondary" className="mr-1 mb-1 flex items-center gap-1">
                        {option.name}
                        <span 
                          className="cursor-pointer rounded-full focus:outline-none"
                          onClick={(e) => handleRemove(option.id, e)}
                        >
                          <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </span>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground">{placeholder}</span>
                )}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 shrink-0 text-white" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 max-w-full">
          <Command className="w-full max-w-full bg-secondary min-w-[83svw] lg:min-w-[42svw] xl:min-w-[30svw]">
            <CommandInput
              placeholder="Search..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList className="bg-secondary">
              <CommandEmpty>{loading ? "Loading..." : "No results found."}</CommandEmpty>
              <CommandGroup>
                {options.map((option, idx) => (
                  <CommandItem
                    key={option.id}
                    value={option.name}
                    onSelect={() => handleSelect(option.id)}
                    ref={idx === options.length - 1 ? lastItemRef : null}
                    className="cursor-pointer"
                  >
                    {option.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value.includes(option.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
              {loading && options.length > 0 && <div className="p-2 text-sm text-center">Loading more...</div>}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  )
}