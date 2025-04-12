"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import GeneralInformation from "@/components/admin/Residences/Forms/steps/GeneralInformation";
import KeyFeatures from "@/components/admin/Residences/Forms/steps/KeyFeatures";
import Visuals from "@/components/admin/Residences/Forms/steps/Visuals";
import Amenities from "@/components/admin/Residences/Forms/steps/Amenities";
import { toast } from "sonner";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { ArrowRight } from "lucide-react";

export interface ResidenceFormData {
  // General Information
  name: string;
  websiteUrl: string;
  subtitle: string;
  description: string;
  budgetStartRange: string;
  budgetEndRange: string;
  address: string;
  latitude: string;
  longitude: string;
  brandId: string;
  countryId: string;
  cityId: string;
  
  // Key Features (can be expanded later)
  keyFeatures?: string[];
  developmentStatus?: string;
  yearBuilt?: string;
  floorArea?: string;
  staffRatio?: string;
  pricePerUnit?: string;
  pricePerSqFt?: string;
  rentalPotential?: string;
  isPetFriendly?: boolean;
  isAccessible?: boolean;
  
  // Visuals (to be handled separately)
  // Amenities (to be handled separately)
}

export default function ResidenceForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general-information");
  const [loading, setLoading] = useState(false);
  const [residenceId, setResidenceId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ResidenceFormData>({
    name: "",
    websiteUrl: "",
    subtitle: "",
    description: "",
    budgetStartRange: "",
    budgetEndRange: "",
    address: "",
    latitude: "",
    longitude: "",
    brandId: "",
    countryId: "",
    cityId: "",
    isPetFriendly: false,
    isAccessible: false
  });

  const updateFormData = (data: Partial<ResidenceFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };

  const handleDiscard = () => {
    if (confirm("Are you sure you want to discard this residence? All changes will be lost.")) {
      router.push("/residences");
    }
  };

  const handleNextStep = async () => {
    // If we're on the first tab, create the residence
    if (activeTab === "general-information" && !residenceId) {
      await createResidence();
    } else {
      // Otherwise, update and proceed to next tab
      await updateResidence();
      moveToNextTab();
    }
  };

  const createResidence = async () => {
    // Validate required fields
    if (!formData.name || !formData.brandId || !formData.countryId || !formData.cityId || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      
      const initialData = {
        name: formData.name,
        websiteUrl: formData.websiteUrl,
        subtitle: formData.subtitle,
        description: formData.description,
        budgetStartRange: formData.budgetStartRange,
        budgetEndRange: formData.budgetEndRange,
        address: formData.address,
        latitude: formData.latitude || "0",
        longitude: formData.longitude || "0",
        brandId: formData.brandId,
        countryId: formData.countryId,
        cityId: formData.cityId
      };

      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/residences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(initialData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create residence");
      }

      const data = await response.json();
      setResidenceId(data.data.id);
      toast.success("Residence created successfully");
      moveToNextTab();
    } catch (error) {
      console.error("Error creating residence:", error);
      toast.error("Failed to create residence. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateResidence = async () => {
    if (!residenceId) return;

    try {
      setLoading(true);
      
      // Prepare update data based on current tab
      let updateData = {};
      
      if (activeTab === "key-features") {
        updateData = {
          keyFeatures: formData.keyFeatures,
          developmentStatus: formData.developmentStatus,
          yearBuilt: formData.yearBuilt,
          floorArea: formData.floorArea,
          staffRatio: formData.staffRatio,
          pricePerUnit: formData.pricePerUnit,
          pricePerSqFt: formData.pricePerSqFt,
          rentalPotential: formData.rentalPotential,
          isPetFriendly: formData.isPetFriendly,
          isAccessible: formData.isAccessible
        };
      } else if (activeTab === "general-information") {
        updateData = {
          name: formData.name,
          websiteUrl: formData.websiteUrl,
          subtitle: formData.subtitle,
          description: formData.description,
          budgetStartRange: formData.budgetStartRange,
          budgetEndRange: formData.budgetEndRange,
          address: formData.address,
          latitude: formData.latitude || "0",
          longitude: formData.longitude || "0",
          brandId: formData.brandId,
          countryId: formData.countryId,
          cityId: formData.cityId
        };
      }
      // Other tabs like visuals and amenities handle their updates separately

      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/residences/${residenceId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update residence");
      }

      toast.success("Residence updated successfully");
    } catch (error) {
      console.error("Error updating residence:", error);
      toast.error("Failed to update residence. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const moveToNextTab = () => {
    switch (activeTab) {
      case "general-information":
        setActiveTab("key-features");
        break;
      case "key-features":
        setActiveTab("visuals");
        break;
      case "visuals":
        setActiveTab("amenities");
        break;
      case "amenities":
        // Final step, redirect to residence list or detail page
        router.push(`/residences/${residenceId}`);
        break;
    }
  };

  const isNextButtonDisabled = () => {
    if (activeTab === "general-information") {
      // Basic validation for required fields in the first step
      return !formData.name || !formData.countryId || !formData.cityId || !formData.brandId || !formData.address;
    }
    return false;
  };

  const getButtonText = () => {
    if (activeTab === "general-information" && !residenceId) {
      return "Next step";
    }
    if (activeTab === "amenities") {
      return "Publish residence";
    }
    return "Next step";
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Add new residence</h1>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleDiscard}
            className="text-muted-foreground"
          >
            Discard
          </Button>
          <Button 
            onClick={handleNextStep} 
            disabled={isNextButtonDisabled() || loading}
            variant="default"
          >
            {loading ? "Loading..." : getButtonText()}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 bg-muted/30 p-1 rounded-md">
          <TabsTrigger 
            value="general-information"
            className="data-[state=active]:bg-background rounded-md data-[state=active]:shadow-sm py-2 px-4"
          >
            General information
          </TabsTrigger>
          <TabsTrigger 
            value="key-features" 
            className="data-[state=active]:bg-background rounded-md data-[state=active]:shadow-sm py-2 px-4"
            disabled={!residenceId}
          >
            Key Features
          </TabsTrigger>
          <TabsTrigger 
            value="visuals" 
            className="data-[state=active]:bg-background rounded-md data-[state=active]:shadow-sm py-2 px-4"
            disabled={!residenceId}
          >
            Visuals
          </TabsTrigger>
          <TabsTrigger 
            value="amenities" 
            className="data-[state=active]:bg-background rounded-md data-[state=active]:shadow-sm py-2 px-4"
            disabled={!residenceId}
          >
            Amenities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general-information">
          <GeneralInformation 
            // formData={formData} 
            // updateFormData={updateFormData} 
          />
        </TabsContent>

        <TabsContent value="key-features">
          <KeyFeatures 
            formData={formData} 
            updateFormData={updateFormData} 
            residenceId={residenceId}
          />
        </TabsContent>

        <TabsContent value="visuals">
          <Visuals 
            residenceId={residenceId} 
          />
        </TabsContent>

        <TabsContent value="amenities">
          <Amenities 
            formData={formData} 
            updateFormData={updateFormData} 
            residenceId={residenceId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}