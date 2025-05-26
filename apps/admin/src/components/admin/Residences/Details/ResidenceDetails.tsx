"use client";

import { Residence } from "@/app/types/models/Residence";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Globe, Calendar, DollarSign, Users, Ruler, Star, ExternalLink } from "lucide-react";
import Link from "next/link";

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-none bg-foreground/5 col-span-full md:col-span-4">
          <CardHeader>
            <CardTitle>General Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Associated Brand</h3>
                {residence.brand && (
                  <div className="flex items-center gap-2">
                    <p className="text-md">{residence.brand?.name}</p>
                    <Link href={`/brands/${residence.brand?.id}`} className="text-md text-muted-foreground hover:text-primary transition-all">
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Website URL</h3>
                <Link href={residence.websiteUrl} className="text-md text-white hover:text-primary transition-all">{residence.websiteUrl}</Link>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">City</h3>
                <p className="text-md">{residence.city?.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Country</h3>
                <p className="text-md">{residence.country?.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Address</h3>
                <p className="text-md">{residence.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card className="text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-none bg-foreground/5 col-span-full md:col-span-4">
          <CardHeader>
            <CardTitle>Financial Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Budget Range</h3>
                <p className="text-md">
                  {residence.budgetStartRange} - {residence.budgetEndRange} {residence.country.currencyCode}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Average Price per Unit</h3>
                <p className="text-md">
                  {residence.avgPricePerUnit} {residence.country.currencyCode}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Average Price per Sqft</h3>
                <p className="text-md">
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
        <Card className="text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-none bg-foreground/5 col-span-full md:col-span-4">
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Year Built</h3>
                <p className="text-md">{residence.yearBuilt}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Floor Area</h3>
                <p className="text-md">{residence.floorSqft} sqft</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Staff Ratio</h3>
                <p className="text-md">{residence.staffRatio}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {residence.petFriendly && (
                    <Badge variant="outline" className="text-sm">Pet Friendly</Badge>
                  )}
                  {residence.disabledFriendly && (
                    <Badge variant="outline" className="text-sm">Disabled Friendly</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Features */}
        {residence.keyFeatures && residence.keyFeatures.length > 0 && (
          <Card className="text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-none bg-foreground/5 col-span-full md:col-span-4">
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {residence.keyFeatures.map((feature) => (
                  <Badge key={feature.id} variant="outline" className="text-sm">
                    {feature.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Amenities */}
        {residence.amenities && residence.amenities.length > 0 && (
          <Card className="text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-none bg-foreground/5 col-span-full md:col-span-4">
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
      </div>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          <Card className="text-card-foreground flex flex-col gap-2 rounded-xl border py-6 shadow-sm border-none bg-foreground/5 h-fit">
            <CardHeader>
              <CardTitle>-</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Units</p>
            </CardContent>
          </Card>

          <Card className="text-card-foreground flex flex-col gap-2 rounded-xl border py-6 shadow-sm border-none bg-foreground/5 h-fit">
            <CardHeader>
              <CardTitle>-</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Saves</p>
            </CardContent>
          </Card>

          <Card className="text-card-foreground flex flex-col gap-2 rounded-xl border py-6 shadow-sm border-none bg-foreground/5 h-fit">
            <CardHeader>
              <CardTitle>-</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Inquiries</p>
            </CardContent>
          </Card>

          <Card className="text-card-foreground flex flex-col gap-2 rounded-xl border py-6 shadow-sm border-none bg-foreground/5 h-fit">
            <CardHeader>
              <CardTitle>-</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Sales Reported</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="border rounded-xl p-4 min-h-[30svh] flex items-center justify-center">
            <p className="text-muted-foreground capitalize text-lg">space for statistics</p>
          </div>
        </div>
      </div>
    </div>
  );
} 