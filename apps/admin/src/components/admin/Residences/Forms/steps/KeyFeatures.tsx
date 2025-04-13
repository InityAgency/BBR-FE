"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResidenceFormData } from "@/components/admin/Residences/Forms/ResidenceForm";
import { Switch } from "@/components/ui/switch";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { toast } from "sonner";

interface KeyFeature {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface KeyFeaturesProps {
  formData: ResidenceFormData;
  updateFormData: (data: Partial<ResidenceFormData>) => void;
  residenceId: string | null;
}

const DEVELOPMENT_STATUS_OPTIONS = [
  { value: "COMPLETED", label: "Completed" },
  { value: "UNDER_CONSTRUCTION", label: "Under Construction" },
  { value: "PRE_CONSTRUCTION", label: "Pre-Construction" },
  { value: "RENOVATION", label: "Renovation" },
];

const RENTAL_POTENTIAL_OPTIONS = [
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
  { value: "NONE", label: "None" },
];

export default function KeyFeatures({
  formData,
  updateFormData,
  residenceId,
}: KeyFeaturesProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    formData.keyFeatures || []
  );
  const [keyFeatures, setKeyFeatures] = useState<KeyFeature[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchKeyFeatures();
    
    // Pravilno inicijalizovati selectedFeatures iz formData
    if (formData.keyFeatures && formData.keyFeatures.length > 0) {
      setSelectedFeatures(formData.keyFeatures);
    }
  }, [formData.keyFeatures]);

  const fetchKeyFeatures = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/key-features?limit=60&page=1`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch key features");
      }

      const result = await response.json();
      setKeyFeatures(result.data);
    } catch (error) {
      console.error("Error fetching key features:", error);
      toast.error("Failed to load key features");
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureChange = (featureId: string, checked: boolean) => {
    const updatedFeatures = checked
      ? [...selectedFeatures, featureId]
      : selectedFeatures.filter((f) => f !== featureId);
    
    setSelectedFeatures(updatedFeatures);
    updateFormData({ keyFeatures: updatedFeatures });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div>
            <h3 className="text-lg font-semibold">Key Features</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              CHOOSE 5 KEY FEATURES TO REPRESENT YOUR PROPERTY
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              They are necessary to attract potential buyers by showcasing what makes the residence stand out and why it is a desirable investment.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <p>Loading key features...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {keyFeatures.map((feature) => (
                <div key={feature.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={feature.id}
                    checked={selectedFeatures.includes(feature.id)}
                    onCheckedChange={(checked) =>
                      handleFeatureChange(feature.id, checked === true)
                    }
                    disabled={
                      !selectedFeatures.includes(feature.id) &&
                      selectedFeatures.length >= 5
                    }
                  />
                  <Label
                    htmlFor={feature.id}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {feature.name}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Development Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="year-built" className="text-sm">
                  Year Built <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="year-built"
                  placeholder="Enter year"
                  type="number"
                  value={formData.yearBuilt || ""}
                  onChange={(e) => updateFormData({ yearBuilt: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="development-status" className="text-sm">
                  Development status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.developmentStatus || ""}
                  onValueChange={(value) => updateFormData({ developmentStatus: value })}
                >
                  <SelectTrigger id="development-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEVELOPMENT_STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="floor-area" className="text-sm">
                  Floor area sq. ft. <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="floor-area"
                  placeholder="Enter area size in sq. ft."
                  type="number"
                  value={formData.floorArea || ""}
                  onChange={(e) => updateFormData({ floorArea: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="staff-ratio" className="text-sm">
                  Staff to residence ratio <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="staff-ratio"
                  placeholder="Enter ratio"
                  value={formData.staffRatio || ""}
                  onChange={(e) => updateFormData({ staffRatio: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="price-per-unit" className="text-sm">
                Average price per unit
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </div>
                <Input
                  id="price-per-unit"
                  placeholder="Enter avg. unit price"
                  className="pl-7"
                  value={formData.pricePerUnit || ""}
                  onChange={(e) => updateFormData({ pricePerUnit: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price-per-sqft" className="text-sm">
                Average price per sq. ft.
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </div>
                <Input
                  id="price-per-sqft"
                  placeholder="Enter avg. price per sq. ft."
                  className="pl-7"
                  value={formData.pricePerSqFt || ""}
                  onChange={(e) => updateFormData({ pricePerSqFt: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="space-y-2">
              <Label htmlFor="rental-potential" className="text-sm">
                Rental potential
              </Label>
              <Select
                value={formData.rentalPotential || ""}
                onValueChange={(value) => updateFormData({ rentalPotential: value })}
              >
                <SelectTrigger id="rental-potential">
                  <SelectValue placeholder="Select rental potential" />
                </SelectTrigger>
                <SelectContent>
                  {RENTAL_POTENTIAL_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Policies</h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pet-friendly" className="text-base font-medium">
                  Pet Friendly?
                </Label>
              </div>
              <Switch
                id="pet-friendly"
                checked={formData.isPetFriendly || false}
                onCheckedChange={(checked) => updateFormData({ isPetFriendly: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="accessible" className="text-base font-medium">
                  Accessible for people with disabilities?
                </Label>
              </div>
              <Switch
                id="accessible"
                checked={formData.isAccessible || false}
                onCheckedChange={(checked) => updateFormData({ isAccessible: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}