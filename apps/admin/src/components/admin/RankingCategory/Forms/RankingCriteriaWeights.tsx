"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Plus, X, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";

// Custom hook for debouncing
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Interfaces
interface RankingCriteria {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
}

interface PaginationInfo {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

interface RankingCriteriaResponse {
  data: RankingCriteria[];
  statusCode: number;
  message: string;
  pagination: PaginationInfo;
  timestamp: string;
  path: string;
}

export interface CriteriaWeight {
  rankingCriteriaId: string;
  weight: number;
  name?: string; // Added for display purposes
}

interface RankingCriteriaWeightsProps {
  onChange: (criteria: CriteriaWeight[]) => void;
  initialCriteria?: CriteriaWeight[];
  rankingCategoryId?: string;
}

const RankingCriteriaWeights: React.FC<RankingCriteriaWeightsProps> = ({
  onChange,
  initialCriteria = [],
  rankingCategoryId,
}) => {
  // State
  const [availableCriteria, setAvailableCriteria] = useState<RankingCriteria[]>([]);
  const [selectedCriteria, setSelectedCriteria] = useState<CriteriaWeight[]>(initialCriteria);
  const [selectedCriteriaId, setSelectedCriteriaId] = useState<string>("");
  const [totalWeight, setTotalWeight] = useState<number>(0);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [newCriteriaName, setNewCriteriaName] = useState<string>("");
  const [newCriteriaDescription, setNewCriteriaDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // New state for pagination and search
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 12
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [comboboxOpen, setComboboxOpen] = useState<boolean>(false);

  // Add scroll position state
  const [scrollPosition, setScrollPosition] = useState(0);
  const debouncedScrollPosition = useDebounce(scrollPosition, 150);

  // Fetch available criteria on component mount
  useEffect(() => {
    fetchRankingCriteria();
  }, []);

  // Update selected criteria when initialCriteria prop changes
  useEffect(() => {
    if (initialCriteria.length > 0) {
      setSelectedCriteria(initialCriteria);
    }
  }, [initialCriteria]);

  // Calculate total weight whenever selected criteria change
  useEffect(() => {
    const total = selectedCriteria.reduce((sum, item) => sum + item.weight, 0);
    setTotalWeight(total);
    
    // Notify parent component about the change
    onChange(selectedCriteria);
  }, [selectedCriteria, onChange]);

  // Fetch ranking criteria from API
  const fetchRankingCriteria = async (page: number = 1, search: string = "", reset: boolean = false) => {
    try {
      setIsLoading(true);
      const url = new URL(`${API_BASE_URL}/api/${API_VERSION}/ranking-criteria`);
      url.searchParams.append("page", page.toString());
      url.searchParams.append("limit", pagination.limit.toString());
      
      if (search.trim()) {
        url.searchParams.append("query", search.trim());
      }

      const response = await fetch(url.toString(), {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ranking criteria: ${response.status}`);
      }

      const data: RankingCriteriaResponse = await response.json();
      
      if (data && data.data && Array.isArray(data.data)) {
        // If reset is true, replace the existing criteria
        // Otherwise, append to existing criteria
        setAvailableCriteria(prev => reset ? data.data : [...prev, ...data.data]);
        setPagination(data.pagination);
        
        // Update names in selected criteria if they don't have names yet
        if (selectedCriteria.length > 0) {
          const updatedCriteria = selectedCriteria.map(selected => {
            if (!selected.name) {
              const criteria = data.data.find(
                (c: RankingCriteria) => c.id === selected.rankingCriteriaId
              );
              return {
                ...selected,
                name: criteria?.name || "Unknown",
              };
            }
            return selected;
          });
          setSelectedCriteria(updatedCriteria);
        }

        // Auto-select default criteria if none are selected
        if (selectedCriteria.length === 0) {
          const defaultCriteria = data.data.filter(c => c.isDefault);
          if (defaultCriteria.length > 0) {
            const defaultWeights = defaultCriteria.map(criteria => ({
              rankingCriteriaId: criteria.id,
              weight: 0,
              name: criteria.name,
            }));
            setSelectedCriteria(defaultWeights);
          }
        }
      }
    } catch (error) {
      toast.error("Failed to load ranking criteria");
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  // Load more criteria
  const loadMoreCriteria = useCallback(() => {
    if (isLoading || pagination.page >= pagination.totalPages) return;
    
    const nextPage = pagination.page + 1;
    fetchRankingCriteria(nextPage, searchQuery);
  }, [isLoading, pagination.page, pagination.totalPages, searchQuery]);

  // Search criteria
  const searchCriteria = useCallback((query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    fetchRankingCriteria(1, query, true);
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== undefined) {
        searchCriteria(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchCriteria]);

  // Create new ranking criteria
  const createRankingCriteria = async () => {
    if (!newCriteriaName.trim()) {
      toast.error("Criteria name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/ranking-criteria`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCriteriaName.trim(),
          description: newCriteriaDescription.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create ranking criteria: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.data) {
        const newCriteria = data.data;
        
        // Add to available criteria
        setAvailableCriteria(prev => [...prev, newCriteria]);
        
        // Auto-select the newly created criteria
        addCriteria(newCriteria.id, newCriteria.name);
        
        toast.success("Ranking criteria created successfully");
        setIsAddingNew(false);
        setNewCriteriaName("");
        setNewCriteriaDescription("");
      }
    } catch (error) {
      toast.error("Failed to create ranking criteria");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add selected criteria to the list
  const addCriteria = (criteriaId: string, criteriaName?: string) => {
    // Check if criteria is already selected
    if (selectedCriteria.some(c => c.rankingCriteriaId === criteriaId)) {
      toast.error("This criteria is already added");
      return;
    }

    // Find the name if not provided
    let name = criteriaName;
    if (!name) {
      const criteria = availableCriteria.find(c => c.id === criteriaId);
      name = criteria?.name;
    }

    // Add to selected criteria
    setSelectedCriteria(prev => [
      ...prev,
      {
        rankingCriteriaId: criteriaId,
        weight: 0,
        name,
      },
    ]);

    // Reset dropdown
    setSelectedCriteriaId("");
  };

  // Handle criteria selection from dropdown
  const handleCriteriaSelect = (value: string) => {
    if (value === "add_new") {
      setIsAddingNew(true);
    } else {
      setSelectedCriteriaId(value);
      addCriteria(value);
    }
  };

  // Remove criteria from selection
  const removeCriteria = (criteriaId: string) => {
    setSelectedCriteria(prev => prev.filter(c => c.rankingCriteriaId !== criteriaId));
  };

  // Update weight for a criteria
  const updateWeight = (criteriaId: string, value: string) => {
    const weight = value === '' ? 0 : parseInt(value, 10) || 0;
    
    setSelectedCriteria(prev => 
      prev.map(c => 
        c.rankingCriteriaId === criteriaId 
          ? { ...c, weight } 
          : c
      )
    );
  };

  // Determine if the total weight is exactly 100%
  const isValidTotalWeight = totalWeight === 100;

  // Modify scroll handler
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    setScrollPosition(scrollTop);
  }, []);

  // Add effect for handling debounced scroll
  useEffect(() => {
    const el = document.querySelector('.command-list') as HTMLElement | null;
    if (!el) return;
    const { scrollHeight, clientHeight } = el;
    const scrollBottom = scrollHeight - debouncedScrollPosition - clientHeight;

    if (scrollBottom < 100 && !isLoading && pagination.page < pagination.totalPages) {
      loadMoreCriteria();
    }
  }, [debouncedScrollPosition, isLoading, pagination.page, pagination.totalPages, loadMoreCriteria]);

  return (
    <div className="space-y-6 w-full">
      <h2 className="text-xl font-semibold">Ranking Criteria</h2>
      
      {/* Progress Bar */}
      <div className="space-y-2 w-full max-w-full">
        <div className="flex justify-between">
          <span className="text-sm font-medium">Total Weight</span>
          <span className={`text-sm font-medium ${isValidTotalWeight ? 'text-green-500' : 'text-red-500'}`}>
            {totalWeight}% / 100%
          </span>
        </div>
        <div className={`relative w-full h-2 rounded-full ${isValidTotalWeight ? 'bg-green-900/20' : 'bg-red-900/20'}`}>
          <div
            className={`absolute left-0 top-0 h-full rounded-full max-w-full ${isValidTotalWeight ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: `${Math.min(totalWeight, 100)}%` }}
          />
        </div>
        {!isValidTotalWeight && (
          <p className="text-xs text-red-500">
            Total weight must be exactly 100%
          </p>
        )}
      </div>

      {/* Criteria List */}
      <div className="space-y-4">
        {selectedCriteria.map(criteria => (
          <div key={criteria.rankingCriteriaId} className="flex items-center space-x-4 p-3 border rounded-md bg-muted/20">
            <div className="flex-grow">
              <span className="font-medium">{criteria.name}</span>
            </div>
            
            <div className="w-32 flex items-center space-x-1">
              <Input
                type="number"
                max="100"
                value={criteria.weight}
                onChange={(e) => updateWeight(criteria.rankingCriteriaId, e.target.value)}
                className="h-8"
              />
              <span className="text-sm">%</span>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeCriteria(criteria.rankingCriteriaId)}
              className="h-8 w-8 text-white hover:text-red-400 hover:bg-destructive/20 transition-colors duration-200 cursor-pointer"
            >
              <X size={16} />
            </Button>
          </div>
        ))}
        
        {selectedCriteria.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No ranking criteria selected</p>
            <p className="text-xs">Select criteria from the dropdown below to get started</p>
          </div>
        )}
      </div>
      
      {/* Add Criteria Dropdown */}
      <div className="flex gap-2">
        <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={comboboxOpen}
              className="w-full justify-between"
            >
              {selectedCriteriaId ? (
                availableCriteria.find(c => c.id === selectedCriteriaId)?.name || "Select criteria"
              ) : (
                "Select criteria"
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Search criteria..."
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandList 
                className="command-list max-h-[300px] overflow-y-auto"
                onScroll={handleScroll}
              >
                <CommandEmpty>
                  {isSearching ? "Searching..." : "No criteria found."}
                </CommandEmpty>
                <CommandGroup>
                  {availableCriteria
                    .filter(c => !selectedCriteria.some(sc => sc.rankingCriteriaId === c.id))
                    .map(criteria => (
                      <CommandItem
                        key={criteria.id}
                        value={criteria.id}
                        onSelect={() => {
                          addCriteria(criteria.id, criteria.name);
                          setComboboxOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedCriteriaId === criteria.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {criteria.name}
                      </CommandItem>
                    ))}
                </CommandGroup>
                {isLoading && (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    Loading...
                  </div>
                )}
                <div className="sticky bottom-0 border-t bg-background">
                  <CommandItem
                    value="add_new"
                    onSelect={() => {
                      setIsAddingNew(true);
                      setComboboxOpen(false);
                    }}
                    className="text-primary"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Criteria
                  </CommandItem>
                </div>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Create New Criteria Modal */}
      <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Ranking Criteria</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="criteriaName" className="text-sm font-medium">
                Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="criteriaName"
                value={newCriteriaName}
                onChange={(e) => setNewCriteriaName(e.target.value)}
                placeholder="Enter criteria name"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="criteriaDescription" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="criteriaDescription"
                value={newCriteriaDescription}
                onChange={(e) => setNewCriteriaDescription(e.target.value)}
                placeholder="Enter criteria description (optional)"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingNew(false);
                setNewCriteriaName("");
                setNewCriteriaDescription("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={createRankingCriteria}
              disabled={!newCriteriaName.trim() || isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RankingCriteriaWeights;