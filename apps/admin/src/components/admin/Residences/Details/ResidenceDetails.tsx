"use client";

import { Residence } from "@/app/types/models/Residence";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Globe, Calendar, DollarSign, Users, Ruler, Star } from "lucide-react";

interface ResidenceDetailsProps {
  residence: Residence;
}

const getDevelopmentStatusBadgeStyle = (status: string) => {
  switch (status) {
    case "PLANNED":
      return "bg-blue-900/20 text-blue-300 border-blue-900/50";
    case "UNDER_CONSTRUCTION":
      return "bg-yellow-900/20 text-yellow-300 border-yellow-900/50";
    case "COMPLETED":
      return "bg-green-900/20 text-green-300 border-green-900/50";
    default:
      return "bg-gray-900/20 text-gray-300 border-gray-900/50";
  }
};

const getRentalPotentialBadgeStyle = (potential: string) => {
  switch (potential) {
    case "HIGH":
      return "bg-green-900/20 text-green-300 border-green-900/50";
    case "MEDIUM":
      return "bg-yellow-900/20 text-yellow-300 border-yellow-900/50";
    case "LOW":
      return "bg-red-900/20 text-red-300 border-red-900/50";
    default:
      return "bg-gray-900/20 text-gray-300 border-gray-900/50";
  }
};

// Helper for media URL
const getMediaUrl = (id: string) => `${process.env.NEXT_PUBLIC_API_URL}/api/v1/media/${id}/content`;

export function ResidenceDetails({ residence }: ResidenceDetailsProps) {
  return (
    <div className="grid gap-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Name</h3>
              <p className="text-sm">{residence.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Subtitle</h3>
              <p className="text-sm">{residence.subtitle}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
              <p className="text-sm">{residence.description}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Development Status</h3>
              <Badge className={getDevelopmentStatusBadgeStyle(residence.developmentStatus)}>
                {residence.developmentStatus}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Information */}
      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Address</h3>
              <p className="text-sm">{residence.address}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Country</h3>
              <p className="text-sm">{residence.country.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">City</h3>
              <p className="text-sm">{residence.city.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Coordinates</h3>
              <p className="text-sm">
                {residence.latitude}, {residence.longitude}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Budget Range</h3>
              <p className="text-sm">
                {residence.budgetStartRange} - {residence.budgetEndRange} {residence.country.currencyCode}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Average Price per Unit</h3>
              <p className="text-sm">
                {residence.avgPricePerUnit} {residence.country.currencyCode}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Average Price per Sqft</h3>
              <p className="text-sm">
                {residence.avgPricePerSqft} {residence.country.currencyCode}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Rental Potential</h3>
              <Badge className={getRentalPotentialBadgeStyle(residence.rentalPotential)}>
                {residence.rentalPotential}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Details */}
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Year Built</h3>
              <p className="text-sm">{residence.yearBuilt}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Floor Area</h3>
              <p className="text-sm">{residence.floorSqft} sqft</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Staff Ratio</h3>
              <p className="text-sm">{residence.staffRatio}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Features</h3>
              <div className="flex flex-wrap gap-2">
                {residence.petFriendly && (
                  <Badge variant="outline">Pet Friendly</Badge>
                )}
                {residence.disabledFriendly && (
                  <Badge variant="outline">Disabled Friendly</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      {residence.keyFeatures && residence.keyFeatures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {residence.keyFeatures.map((feature) => (
                <Badge key={feature.id} variant="outline">
                  {feature.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Amenities */}
      {residence.amenities && residence.amenities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {residence.amenities.map((amenity) => (
                <div key={amenity.id} className="flex items-center gap-2">
                  {amenity.icon && (
                    <img
                      src={getMediaUrl(amenity.icon.id)}
                      alt={amenity.name}
                      className="w-6 h-6 object-contain"
                    />
                  )}
                  <span className="text-sm">{amenity.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Brand Information */}
      {residence.brand && (
        <Card>
          <CardHeader>
            <CardTitle>Brand Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {residence.brand.logo && (
                <img
                  src={getMediaUrl(residence.brand.logo.id)}
                  alt={residence.brand.name}
                  className="w-16 h-16 object-contain"
                />
              )}
              <div>
                <h3 className="font-medium">{residence.brand.name}</h3>
                <p className="text-sm text-muted-foreground">{residence.brand.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 