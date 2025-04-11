"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ResidenceFormData } from "@/components/admin/Residences/Forms/ResidenceForm";
import { toast } from "sonner";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UploadCloud, Trash2 } from "lucide-react";

interface AmenitiesProps {
  formData: ResidenceFormData;
  updateFormData: (data: Partial<ResidenceFormData>) => void;
  residenceId: string | null;
}

interface Amenity {
  id: string;
  name: string;
  category: string;
}

interface TopAmenity {
  amenityId: string;
  description: string;
  imageId?: string;
  imageUrl?: string;
}

const AMENITY_CATEGORIES = [
  "RECREATION",
  "WELLNESS",
  "CONVENIENCE",
  "DINING",
  "SECURITY",
  "OUTDOOR",
  "OTHER",
];

export default function Amenities({
  formData,
  updateFormData,
  residenceId,
}: AmenitiesProps) {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [loadingAmenities, setLoadingAmenities] = useState(false);
  const [savingAmenities, setSavingAmenities] = useState(false);
  const [topAmenities, setTopAmenities] = useState<TopAmenity[]>([
    { amenityId: "", description: "" },
    { amenityId: "", description: "" },
    { amenityId: "", description: "" },
  ]);
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);

  // Fetch all available amenities
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        setLoadingAmenities(true);
        const response = await fetch(
          `${API_BASE_URL}/api/${API_VERSION}/amenities`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch amenities: ${response.status}`);
        }

        const data = await response.json();
        setAmenities(data.data || []);
      } catch (error) {
        console.error("Error fetching amenities:", error);
        toast.error("Failed to load amenities. Please try again.");
      } finally {
        setLoadingAmenities(false);
      }
    };

    fetchAmenities();
  }, []);

  // Fetch existing residence amenities if residenceId is provided
  useEffect(() => {
    const fetchResidenceAmenities = async () => {
      if (!residenceId) return;

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/${API_VERSION}/residences/${residenceId}/amenities`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch residence amenities: ${response.status}`
          );
        }

        const data = await response.json();
        setSelectedAmenities(data.data.map((a: any) => a.id) || []);
      } catch (error) {
        console.error("Error fetching residence amenities:", error);
      }
    };

    const fetchTopAmenities = async () => {
      if (!residenceId) return;

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/${API_VERSION}/residences/${residenceId}/top-amenities`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch top amenities: ${response.status}`
          );
        }

        const data = await response.json();
        if (data.data && data.data.length > 0) {
          const formattedTopAmenities = data.data.map((a: any) => ({
            amenityId: a.amenityId,
            description: a.description,
            imageId: a.imageId,
            imageUrl: a.imageId ? `/api/media/${a.imageId}` : undefined,
          }));
          
          // Fill the remaining slots with empty amenities
          while (formattedTopAmenities.length < 3) {
            formattedTopAmenities.push({ amenityId: "", description: "" });
          }
          
          setTopAmenities(formattedTopAmenities);
        }
      } catch (error) {
        console.error("Error fetching top amenities:", error);
      }
    };

    fetchResidenceAmenities();
    fetchTopAmenities();
  }, [residenceId]);

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities([...selectedAmenities, amenityId]);
    } else {
      setSelectedAmenities(selectedAmenities.filter((id) => id !== amenityId));
    }
  };

  const updateTopAmenity = (index: number, field: keyof TopAmenity, value: string) => {
    const newTopAmenities = [...topAmenities];
    newTopAmenities[index] = {
      ...newTopAmenities[index],
      [field]: value,
    };
    setTopAmenities(newTopAmenities);
  };

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !residenceId) return;
    
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    
    setUploadingImage(index);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/uploads`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.status}`);
      }
      
      const data = await response.json();
      
      const newTopAmenities = [...topAmenities];
      newTopAmenities[index] = {
        ...newTopAmenities[index],
        imageId: data.data.id,
        imageUrl: `/api/media/${data.data.id}`,
      };
      setTopAmenities(newTopAmenities);
      
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(null);
      e.target.value = ""; // Reset the input
    }
  };

  const handleDeleteImage = (index: number) => {
    const newTopAmenities = [...topAmenities];
    newTopAmenities[index] = {
      ...newTopAmenities[index],
      imageId: undefined,
      imageUrl: undefined,
    };
    setTopAmenities(newTopAmenities);
  };

  const saveAmenities = async () => {
    if (!residenceId) return;
    
    setSavingAmenities(true);
    try {
      // Save selected amenities
      const amenitiesResponse = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/residences/${residenceId}/amenities`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ amenityIds: selectedAmenities }),
        }
      );
      
      if (!amenitiesResponse.ok) {
        throw new Error(`Failed to save amenities: ${amenitiesResponse.status}`);
      }
      
      // Save top amenities
      const validTopAmenities = topAmenities.filter(a => a.amenityId && a.description);
      if (validTopAmenities.length > 0) {
        const topAmenitiesResponse = await fetch(
          `${API_BASE_URL}/api/${API_VERSION}/residences/${residenceId}/top-amenities`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ topAmenities: validTopAmenities }),
          }
        );
        
        if (!topAmenitiesResponse.ok) {
          throw new Error(`Failed to save top amenities: ${topAmenitiesResponse.status}`);
        }
      }
      
      toast.success("Amenities saved successfully");
    } catch (error) {
      console.error("Error saving amenities:", error);
      toast.error("Failed to save amenities. Please try again.");
    } finally {
      setSavingAmenities(false);
    }
  };

  // Group amenities by category for better display
  const amenitiesByCategory = AMENITY_CATEGORIES.map(category => {
    return {
      name: category,
      amenities: amenities.filter(a => a.category === category),
    };
  }).filter(group => group.amenities.length > 0);

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div>
            <h3 className="text-lg font-semibold">Provide the full list of amenities nearby</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Select all amenities that apply to this residence
            </p>
          </div>

          {loadingAmenities ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-2"></div>
              <p>Loading amenities...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {amenitiesByCategory.map((category) => (
                <div key={category.name} className="space-y-2">
                  <h4 className="font-medium text-base capitalize">
                    {category.name.toLowerCase().replace('_', ' ')}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {category.amenities.map((amenity) => (
                      <div key={amenity.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`amenity-${amenity.id}`}
                          checked={selectedAmenities.includes(amenity.id)}
                          onCheckedChange={(checked) =>
                            handleAmenityChange(amenity.id, checked === true)
                          }
                        />
                        <Label
                          htmlFor={`amenity-${amenity.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {amenity.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div>
            <h3 className="text-lg font-semibold">Highlight top 3 amenities</h3>
            <p className="text-xs uppercase font-medium text-amber-500 mt-1 mb-2">
              WHAT ARE TOP AMENITIES?
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Highlighting these top amenities helps attract visitors by showcasing the unique advantages and high-quality living experiences your property offers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {topAmenities.map((amenity, index) => (
              <div key={index} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">
                    Select amenity {index + 1} {index < 2 && <span className="text-red-500">*</span>}
                  </Label>
                  <Select
                    value={amenity.amenityId}
                    onValueChange={(value) => updateTopAmenity(index, "amenityId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Choose amenity to highlight`} />
                    </SelectTrigger>
                    <SelectContent>
                      {amenitiesByCategory.map((category) => (
                        <React.Fragment key={category.name}>
                          <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground capitalize">
                            {category.name.toLowerCase().replace('_', ' ')}
                          </div>
                          {category.amenities.map((a) => (
                            <SelectItem key={a.id} value={a.id}>
                              {a.name}
                            </SelectItem>
                          ))}
                        </React.Fragment>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">
                    Amenity description {index < 2 && <span className="text-red-500">*</span>}
                  </Label>
                  <Textarea
                    placeholder="Amenity Description"
                    value={amenity.description}
                    onChange={(e) => updateTopAmenity(index, "description", e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Upload image</Label>
                  {amenity.imageUrl ? (
                    <div className="relative aspect-video rounded-md overflow-hidden border group">
                      <img
                        src={amenity.imageUrl}
                        alt="Amenity"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteImage(index)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed rounded-md p-4 text-center transition-colors hover:border-primary/50">
                      <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground mb-2">
                        JPG, JPEG and PNG formats are supported
                      </p>
                      <input
                        id={`image-upload-${index}`}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(index, e)}
                        disabled={uploadingImage !== null}
                      />
                      <label htmlFor={`image-upload-${index}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                          disabled={uploadingImage !== null}
                          type="button"
                        >
                          {uploadingImage === index ? "Uploading..." : "Upload image"}
                        </Button>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button 
              onClick={saveAmenities} 
              disabled={savingAmenities}
              className="w-full sm:w-auto"
            >
              {savingAmenities ? "Saving..." : "Save amenities"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}