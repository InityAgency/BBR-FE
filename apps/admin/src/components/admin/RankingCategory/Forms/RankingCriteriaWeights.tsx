"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Plus, X, Check } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
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
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";

// Interfaces
interface RankingCriteria {
  id: string;
  name: string;
  description?: string;
}

export interface CriteriaWeight {
  rankingCriteriaId: string;
  weight: number;
  isDefault: boolean;
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
  const [defaultCount, setDefaultCount] = useState<number>(0);

  // Fetch available criteria on component mount
  useEffect(() => {
    fetchRankingCriteria();
  }, []);

  // Calculate total weight and default count whenever selected criteria change
  useEffect(() => {
    const total = selectedCriteria.reduce((sum, item) => sum + item.weight, 0);
    setTotalWeight(total);
    
    const defaultCriteriaCount = selectedCriteria.filter(c => c.isDefault).length;
    setDefaultCount(defaultCriteriaCount);
    
    // Notify parent component about the change
    onChange(selectedCriteria);
  }, [selectedCriteria, onChange]);

  // Fetch ranking criteria from API
  const fetchRankingCriteria = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/ranking-criteria`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ranking criteria: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.data && Array.isArray(data.data)) {
        setAvailableCriteria(data.data);
        
        // Update names in selected criteria
        if (selectedCriteria.length > 0) {
          const updatedCriteria = selectedCriteria.map(selected => {
            const criteria = data.data.find(
              (c: RankingCriteria) => c.id === selected.rankingCriteriaId
            );
            return {
              ...selected,
              name: criteria?.name || "Unknown",
            };
          });
          setSelectedCriteria(updatedCriteria);
        }
      }
    } catch (error) {
      toast.error("Failed to load ranking criteria");
    }
  };

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
        isDefault: false,
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

  // Toggle default status
  const toggleDefault = (criteriaId: string) => {
    const criteria = selectedCriteria.find(c => c.rankingCriteriaId === criteriaId);
    const isCurrentlyDefault = criteria?.isDefault || false;
    
    // If trying to set as default but already have 5 defaults, prevent it
    if (!isCurrentlyDefault && defaultCount >= 5) {
      toast.error("You can select a maximum of 5 default criteria");
      return;
    }
    
    setSelectedCriteria(prev => 
      prev.map(c => 
        c.rankingCriteriaId === criteriaId 
          ? { ...c, isDefault: !c.isDefault } 
          : c
      )
    );
  };

  // Determine if the total weight is exactly 100%
  const isValidTotalWeight = totalWeight === 100;

  // Render dropdown options
  const renderDropdownOptions = () => {
    const usedCriteriaIds = selectedCriteria.map(c => c.rankingCriteriaId);
    const availableOptions = availableCriteria.filter(c => !usedCriteriaIds.includes(c.id));
    
    return (
      <>
        {availableOptions.map(criteria => (
          <SelectItem key={criteria.id} value={criteria.id}>
            {criteria.name}
          </SelectItem>
        ))}
        <SelectItem value="add_new" className="text-primary">
          + Add New Criteria
        </SelectItem>
      </>
    );
  };

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
            style={{ width: `${totalWeight}%` }}
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
            <div className="flex items-center space-x-2">
              <Checkbox 
                checked={criteria.isDefault} 
                onCheckedChange={() => toggleDefault(criteria.rankingCriteriaId)}
                disabled={defaultCount >= 5 && !criteria.isDefault}
              />
              <span className="text-sm">
                Default
              </span>
            </div>
            
            <div className="flex-grow">
              <span className="font-medium">{criteria.name}</span>
            </div>
            
            <div className="w-32 flex items-center space-x-1">
              <Input
                type="number"
                min="0"
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
              className="h-8 w-8 text-destructive"
            >
              <X size={16} />
            </Button>
          </div>
        ))}
      </div>
      
      {/* Add Criteria Dropdown */}
      <div className="flex gap-2">
        <Select
          value={selectedCriteriaId}
          onValueChange={handleCriteriaSelect}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select or add new criteria" />
          </SelectTrigger>
          <SelectContent>
            {renderDropdownOptions()}
          </SelectContent>
        </Select>
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
              <Input
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