import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { useDebounce } from "use-debounce";
import Image from "next/image";
// Interfejs za telefonske kodove prema stvarnoj strukturi API-ja
export interface PhoneCode {
  id: string;
  code: string;
  country: {
    id: string;
    name: string;
    flag: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface PhoneCodeResponse {
  data: PhoneCode[];
  statusCode: number;
  message: string;
  pagination: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
  timestamp: string;
  path: string;
}

interface PhoneCodeSelectProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

// Globalna keš varijabla za phone kodove
let cachedPhoneCodes: PhoneCode[] | null = null;

export const PhoneCodeSelect = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Select country code",
  className,
}: PhoneCodeSelectProps) => {
  const [phoneCodes, setPhoneCodes] = useState<PhoneCode[]>([]);
  const [filteredCodes, setFilteredCodes] = useState<PhoneCode[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const firstRenderRef = useRef(true);

  // Memoizirana funkcija za učitavanje phone kodova
  const fetchPhoneCodes = useCallback(async (pageNum = 1, limit = 30) => {
    // Ako su phone kodovi već u kešu i tražimo prvu stranicu, koristimo ih
    if (cachedPhoneCodes && pageNum === 1) {
      setPhoneCodes(cachedPhoneCodes);
      setFilteredCodes(cachedPhoneCodes);
      setIsDataFetched(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/phone-codes?page=${pageNum}&limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch phone codes');
      }
      
      const responseData: PhoneCodeResponse = await response.json();
      
      // Na osnovu strukture odgovora
      const fetchedPhoneCodes = responseData.data || [];
      const paginationInfo = responseData.pagination;
      
      if (pageNum === 1) {
        setPhoneCodes(fetchedPhoneCodes);
        setFilteredCodes(fetchedPhoneCodes);
        // Keširanje phone kodova za buduću upotrebu
        cachedPhoneCodes = fetchedPhoneCodes;
      } else {
        setPhoneCodes(prev => [...prev, ...fetchedPhoneCodes]);
        // Filtriranje novih podataka će se desiti automatski u useEffect-u koji prati debouncedSearchValue
      }

      setTotalPages(paginationInfo.totalPages);
      setHasMore(pageNum < paginationInfo.totalPages);
      setIsDataFetched(true);
    } catch (error) {
      console.error("Error fetching phone codes:", error);
      toast.error("Failed to load country codes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Učitavanje podataka samo kada se dropdown otvori prvi put
  useEffect(() => {
    if (isOpen && !isDataFetched) {
      fetchPhoneCodes(1);
    }
  }, [isOpen, isDataFetched, fetchPhoneCodes]);

  // Koristimo useDebounce hook za pretragu
  const [debouncedSearchValue] = useDebounce(searchValue, 150);

  // Efikasnije filtriranje phone kodova prema pretrazi
  useEffect(() => {
    if (debouncedSearchValue.trim() === '') {
      setFilteredCodes(phoneCodes);
    } else {
      const search = debouncedSearchValue.toLowerCase();
      const filtered = phoneCodes.filter(
        pc => 
          pc.country.name.toLowerCase().includes(search) || 
          pc.code.includes(search)
      );
      setFilteredCodes(filtered);
    }
  }, [debouncedSearchValue, phoneCodes]);

  // Optimizovana funkcija za obradu scroll eventa
  const handleScroll = useCallback(() => {
    if (!scrollAreaRef.current || !hasMore || isLoading) return;

    const scrollArea = scrollAreaRef.current;
    const { scrollTop, scrollHeight, clientHeight } = scrollArea;

    // Ako smo došli do 80% visine scroll područja, učitavamo sledeću stranicu
    if (scrollTop + clientHeight >= scrollHeight * 0.8) {
      setPage(prev => prev + 1);
      fetchPhoneCodes(page + 1);
    }
  }, [scrollAreaRef, hasMore, isLoading, page, fetchPhoneCodes]);

  // Postavljanje event listenera za scroll
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      scrollArea.addEventListener('scroll', handleScroll);
      return () => {
        scrollArea.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  // Poboljšano fokusiranje na search input - čuvamo fokus pri kucanju
  useEffect(() => {
    if (isOpen) {
      // Ako je dropdown tek otvoren, fokusiramo na search polje nakon kratkog delay-a
      if (firstRenderRef.current) {
        setTimeout(() => {
          searchInputRef.current?.focus();
          firstRenderRef.current = false;
        }, 50);
      }
    } else {
      // Kad se dropdown zatvori, resetujemo firstRender flag
      firstRenderRef.current = true;
      setSearchValue('');
    }
  }, [isOpen]);

  // Sprečavamo gubitak fokusa prilikom kucanja
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    // Osiguravamo da input ostane fokusiran
    if (e.target !== document.activeElement) {
      e.target.focus();
    }
  };

  // Memoizirani render listi phone kodova za optimizaciju performansi
  const phoneCodeItems = useMemo(() => {
    if (isLoading && page === 1) {
      return (
        <SelectItem value="loading" disabled>
          Loading country codes...
        </SelectItem>
      );
    } 
    
    if (filteredCodes.length === 0) {
      return (
        <SelectItem value="empty" disabled>
          No matching country codes
        </SelectItem>
      );
    }

    return filteredCodes.map((phoneCode) => (
      <SelectItem 
        key={phoneCode.id} 
        value={phoneCode.id} 
        className="flex items-center gap-2 "
      >
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 overflow-hidden rounded-sm flex-shrink-0 ">
            {phoneCode.country.flag ? (
              <img
                src={phoneCode.country.flag}
                alt={`${phoneCode.country.name} flag`}
                className="h-full w-full object-cover"
                loading="lazy"
                width={16}
                height={16}
              />
            ) : (
              <div className="h-4 w-4 bg-gray-200 rounded-sm flex items-center justify-center">
                <span className="text-gray-500">N/A</span>
              </div>
            )}
          </div>
          <span className="truncate">
            {phoneCode.country.name} ({phoneCode.code})
          </span>
        </div>
      </SelectItem>
    ));
  }, [filteredCodes, isLoading, page]);

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled || isLoading}
      onOpenChange={setIsOpen}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="w-[300px]">
        <div className="flex h-9 items-center gap-2 border-b px-3 custom-search">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            ref={searchInputRef}
            placeholder="Search country or code..."
            className="h-8 w-full border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchValue}
            onChange={handleSearchChange}
            onBlur={(e) => {
              if (isOpen) {
                e.target.focus();
              }
            }}
          />
        </div>
        <ScrollArea 
          ref={scrollAreaRef} 
          className="max-h-[300px] overflow-auto"
        >
          <SelectGroup>
            {phoneCodeItems}
            {isLoading && page > 1 && (
              <div className="py-2 text-center text-sm text-muted-foreground">
                Loading more...
              </div>
            )}
            {!isLoading && hasMore && filteredCodes.length > 0 && (
              <div className="py-2 text-center text-xs text-muted-foreground">
                Scroll for more options
              </div>
            )}
          </SelectGroup>
        </ScrollArea>
      </SelectContent>
    </Select>
  );
};