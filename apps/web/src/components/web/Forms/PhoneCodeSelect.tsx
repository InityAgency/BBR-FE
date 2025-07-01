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

export const PhoneCodeSelect = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Select country code",
  className,
}: PhoneCodeSelectProps) => {
  const [phoneCodes, setPhoneCodes] = useState<PhoneCode[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const firstRenderRef = useRef(true);

  // Koristimo useDebounce hook za pretragu (300ms za server calls)
  const [debouncedSearchValue] = useDebounce(searchValue, 300);

  // Funkcija za učitavanje phone kodova sa server-side pretragom
  const fetchPhoneCodes = useCallback(async (pageNum = 1, query = '', append = false) => {
    setIsLoading(true);
    try {
      // Kreiramo URL sa query parametrima
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '20'
      });
      
      // Dodajemo query parametar samo ako postoji
      if (query.trim()) {
        params.append('query', query.trim());
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/phone-codes?${params.toString()}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch phone codes');
      }
      
      const responseData: PhoneCodeResponse = await response.json();
      const fetchedPhoneCodes = responseData.data || [];
      const paginationInfo = responseData.pagination;
      
      if (append) {
        // Dodaj nove rezultate na postojeće (scroll load more)
        // Filtriramo duplikate na osnovu ID-ja
        setPhoneCodes(prev => {
          const existingIds = new Set(prev.map(pc => pc.id));
          const newItems = fetchedPhoneCodes.filter(pc => !existingIds.has(pc.id));
          return [...prev, ...newItems];
        });
      } else {
        // Zameni postojeće rezultate (nova pretraga ili prvo učitavanje)
        // Ali zadržavamo odabrani kod ako postoji
        setPhoneCodes(prev => {
          if (value && !query.trim()) {
            // Ako nema pretrage, zadržavamo odabrani kod
            const selectedCode = prev.find(pc => pc.id === value);
            if (selectedCode) {
              const existingIds = new Set(fetchedPhoneCodes.map(pc => pc.id));
              if (!existingIds.has(selectedCode.id)) {
                return [selectedCode, ...fetchedPhoneCodes];
              }
            }
          }
          return fetchedPhoneCodes;
        });
      }

      setTotalPages(paginationInfo.totalPages);
      setHasMore(pageNum < paginationInfo.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching phone codes:", error);
      toast.error("Failed to load country codes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [value]);

  // Učitavanje početnih podataka kada se dropdown otvori
  useEffect(() => {
    if (isOpen && phoneCodes.length === 0) {
      fetchPhoneCodes(1, '');
    }
  }, [isOpen, phoneCodes.length, fetchPhoneCodes]);

  // Server-side pretraga kada se promeni debounced search value
  useEffect(() => {
    if (isOpen) {
      // Reset na prvu stranicu za novu pretragu
      fetchPhoneCodes(1, debouncedSearchValue, false);
    }
  }, [debouncedSearchValue, isOpen, fetchPhoneCodes]);

  // Učitavanje odabranog telefonskog koda ako postoji value a nije u listi
  useEffect(() => {
    if (value && phoneCodes.length > 0) {
      const selectedCode = phoneCodes.find(pc => pc.id === value);
      if (!selectedCode) {
        // Ako odabrani kod nije u trenutnoj listi, učitajmo ga posebno
        fetchPhoneCodes(1, '', false);
      }
    }
  }, [value, phoneCodes.length, fetchPhoneCodes]);

  // Dodajemo odabrani kod na vrh liste ako postoji value
  useEffect(() => {
    if (value && phoneCodes.length > 0) {
      const selectedCode = phoneCodes.find(pc => pc.id === value);
      if (!selectedCode) {
        // Ako odabrani kod nije u listi, dodajemo ga na vrh
        setPhoneCodes(prev => {
          const existingIds = new Set(prev.map(pc => pc.id));
          if (!existingIds.has(value)) {
            // Ovde bi trebalo da učitamo podatke o odabranom kodu
            // Za sada ćemo dodati placeholder
            return prev;
          }
          return prev;
        });
      }
    }
  }, [value, phoneCodes.length]);

  // Optimizovana funkcija za obradu scroll eventa (load more)
  const handleScroll = useCallback(() => {
    if (!scrollAreaRef.current || !hasMore || isLoading) return;

    const scrollArea = scrollAreaRef.current;
    const { scrollTop, scrollHeight, clientHeight } = scrollArea;

    // Ako smo došli do 80% visine scroll područja, učitavamo sledeću stranicu
    if (scrollTop + clientHeight >= scrollHeight * 0.8) {
      const nextPage = page + 1;
      fetchPhoneCodes(nextPage, debouncedSearchValue, true);
    }
  }, [scrollAreaRef, hasMore, isLoading, page, debouncedSearchValue, fetchPhoneCodes]);

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
      // Kad se dropdown zatvori, resetujemo samo search i pagination, ali zadržavamo phoneCodes
      firstRenderRef.current = true;
      setSearchValue('');
      setPage(1);
      setHasMore(true);
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
    if (isLoading && phoneCodes.length === 0) {
      return (
        <SelectItem value="loading" disabled>
          Loading country codes...
        </SelectItem>
      );
    } 
    
    if (phoneCodes.length === 0 && !isLoading) {
      return (
        <SelectItem value="empty" disabled>
          {searchValue ? 'No matching country codes found' : 'No country codes available'}
        </SelectItem>
      );
    }

    return phoneCodes.map((phoneCode, index) => (
      <SelectItem 
        key={`${phoneCode.id}-${index}`} // Kombinujemo ID sa indexom za jedinstveni key
        value={phoneCode.id} 
        className="flex items-center gap-2"
      >
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 overflow-hidden rounded-sm flex-shrink-0">
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
  }, [phoneCodes, isLoading, searchValue]);

  // Pronađi odabrani telefonski kod za prikaz
  const selectedPhoneCode = useMemo(() => {
    return phoneCodes.find(pc => pc.id === value);
  }, [phoneCodes, value]);

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled || isLoading}
      onOpenChange={setIsOpen}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder}>
          {selectedPhoneCode && (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 overflow-hidden rounded-sm flex-shrink-0">
                {selectedPhoneCode.country.flag ? (
                  <img
                    src={selectedPhoneCode.country.flag}
                    alt={`${selectedPhoneCode.country.name} flag`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    width={16}
                    height={16}
                  />
                ) : (
                  <div className="h-4 w-4 bg-gray-200 rounded-sm flex items-center justify-center">
                    <span className="text-gray-500 text-xs">N/A</span>
                  </div>
                )}
              </div>
              <span className="truncate">
                {selectedPhoneCode.country.name} ({selectedPhoneCode.code})
              </span>
            </div>
          )}
        </SelectValue>
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
            {isLoading && phoneCodes.length > 0 && (
              <div className="py-2 text-center text-sm text-muted-foreground">
                Loading more...
              </div>
            )}
            {!isLoading && hasMore && phoneCodes.length > 0 && (
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