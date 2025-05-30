'use client';
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowRight } from "lucide-react";
import { debounce } from "lodash";

interface RankingType {
  id: string;
  name: string;
  key: string;
}

interface RankingCategory {
  id: string;
  name: string;
  slug: string;
  title: string;
  description: string;
  rankingCategoryType: RankingType;
}

interface ApiResponse<T> {
  data: T;
  statusCode: number;
  message: string;
  pagination?: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
  timestamp: string;
  path: string;
}

export default function HomeSearchForm() {
  const router = useRouter();
  const [rankingTypes, setRankingTypes] = useState<RankingType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [categoryOptions, setCategoryOptions] = useState<RankingCategory[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const commandListRef = useRef<HTMLDivElement>(null);

  // Konstruiši API URL koristeći environment varijable
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

  // Funkcija za dohvatanje kategorija sa paginacijom i pretragom
  const fetchCategoryOptions = async (
    categoryTypeId: string, 
    page: number = 1, 
    query: string = "",
    append: boolean = false
  ) => {
    if (!append) {
      setOptionsLoading(true);
    } else {
      setLoadingMore(true);
    }
    
    try {
      const selectedType = rankingTypes.find(type => type.key === categoryTypeId);
      if (!selectedType) {
        console.log('Selected type not found for key:', categoryTypeId);
        return;
      }

      const url = new URL(`${baseUrl}/api/${apiVersion}/public/ranking-categories`);
      url.searchParams.append('categoryTypeId', selectedType.id);
      url.searchParams.append('limit', '10');
      url.searchParams.append('page', String(page));
      if (query) {
        url.searchParams.append('query', query);
      }

      console.log('Fetching categories from:', url.toString());
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse<RankingCategory[]> = await response.json();
      console.log('Received category data:', data);
      
      if (data.data && Array.isArray(data.data)) {
        if (append) {
          // Filtriramo duplikate na osnovu ID-a
          setCategoryOptions(prev => {
            const existingIds = new Set(prev.map(item => item.id));
            const newItems = data.data.filter(item => !existingIds.has(item.id));
            return [...prev, ...newItems];
          });
        } else {
          // Uklanjamo duplikate iz početnih podataka
          const uniqueData = data.data.filter((item, index, self) => 
            index === self.findIndex(t => t.id === item.id)
          );
          setCategoryOptions(uniqueData);
        }
        
        // Proveri da li ima još stranica
        if (data.pagination) {
          setHasMore(data.pagination.page < data.pagination.totalPages);
        }
      }
    } catch (error) {
      console.error('Error fetching category options:', error);
    } finally {
      setOptionsLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const fetchRankingTypes = async () => {
      try {
        console.log('Fetching ranking types...');
        const response = await fetch(`${baseUrl}/api/${apiVersion}/ranking-category-types`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: ApiResponse<RankingType[]> = await response.json();
        console.log('Received ranking types:', data);
        
        if (data.data && Array.isArray(data.data)) {
          setRankingTypes(data.data);
          
          // Automatski postavi prvi tip kategorije i učitaj opcije
          if (data.data.length > 0) {
            const firstCategoryKey = data.data[0].key;
            console.log('Setting first category:', firstCategoryKey);
            setSelectedCategory(firstCategoryKey);
          }
        }
      } catch (error) {
        console.error('Error fetching ranking types:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRankingTypes();
  }, [baseUrl, apiVersion]);

  // Poseban useEffect za učitavanje opcija kada se postavi selectedCategory
  useEffect(() => {
    if (selectedCategory && rankingTypes.length > 0) {
      console.log('Loading options for category:', selectedCategory);
      setCurrentPage(1);
      setHasMore(true);
      setCategoryOptions([]);
      fetchCategoryOptions(selectedCategory, 1, "", false);
    }
  }, [selectedCategory, rankingTypes]);

  // Debounced search funkcija
  const debouncedSearch = useCallback(
    debounce((categoryKey: string, query: string) => {
      setCurrentPage(1);
      fetchCategoryOptions(categoryKey, 1, query, false);
    }, 300),
    [rankingTypes]
  );

  const handleCategoryChange = (value: string) => {
    console.log('Category changed to:', value);
    setSelectedCategory(value);
    setSelectedOption(""); // Reset opciju
    setSearchQuery(""); // Reset pretragu
    // Ne resetujemo categoryOptions ovde jer će to uraditi useEffect
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (selectedCategory) {
      debouncedSearch(selectedCategory, value);
    }
  };

  // Infinite scroll handler
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
    
    if (isBottom && hasMore && !loadingMore && selectedCategory) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchCategoryOptions(selectedCategory, nextPage, searchQuery, true);
    }
  };

  const handleSearch = () => {
    const selected = categoryOptions.find(cat => cat.id === selectedOption);
    if (selectedCategory && selected) {
      router.push(`/best-residences/${selected.slug}`);
    }
  };

  const getSelectedOptionTitle = () => {
    const selected = categoryOptions.find(cat => cat.id === selectedOption);
    return selected?.title || "";
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full max-w-3xl mx-auto p-6 rounded-xl items-center justify-center">
      <Select
        value={selectedCategory}
        onValueChange={handleCategoryChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full lg:w-[200px]">
          <SelectValue placeholder={isLoading ? "Loading..." : "Select category"} />
        </SelectTrigger>
        <SelectContent>
          {rankingTypes.map((type) => (
            <SelectItem key={type.id} value={type.key}>
              {type.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedCategory && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild className="bg-secondary">
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full lg:w-[300px] justify-between bg-secondary"
              disabled={optionsLoading && categoryOptions.length === 0}
            >
              {selectedOption
                ? getSelectedOptionTitle()
                : `Search ${rankingTypes.find(t => t.key === selectedCategory)?.name || 'option'}...`}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 bg-secondary" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full lg:w-[300px] p-0">
            <Command shouldFilter={false}>
              <CommandInput 
                placeholder={`Search ${rankingTypes.find(t => t.key === selectedCategory)?.name || 'options'}...`}
                value={searchQuery}
                onValueChange={handleSearchChange}
              />
              <CommandList onScroll={handleScroll} ref={commandListRef} className="bg-secondary">
                {optionsLoading && categoryOptions.length === 0 ? (
                  <CommandEmpty>
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="ml-2">Loading...</span>
                    </div>
                  </CommandEmpty>
                ) : categoryOptions.length === 0 ? (
                  <CommandEmpty>No results found.</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {categoryOptions.map((option, index) => (
                      <CommandItem
                        key={`${option.id}-${index}`}
                        value={option.id}
                        onSelect={(currentValue) => {
                          setSelectedOption(currentValue === selectedOption ? "" : currentValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedOption === option.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {option.title}
                      </CommandItem>
                    ))}
                    {loadingMore && (
                      <div className="flex items-center justify-center py-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="ml-2 text-sm">Loading more...</span>
                      </div>
                    )}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      <Button
        onClick={handleSearch}
        className="w-full lg:w-auto"
        disabled={!selectedCategory || !selectedOption}
      >
        Search
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}