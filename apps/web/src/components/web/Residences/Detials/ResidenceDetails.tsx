"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Globe, Calendar, DollarSign, Users, Ruler, Star, ExternalLink, Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ResidenceDetailsProps {
  residence: any;
}

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

// Helper function to safely display values
const safeValue = (value: any): string => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return String(value);
};

// Helper function for currency values
const safeCurrencyValue = (value: any, currencyCode?: string): string => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return `${value} ${currencyCode || ""}`.trim();
};

export function ResidenceDetails({ residence }: ResidenceDetailsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


        {/* {residence.mainGallery && residence.mainGallery.length > 0 && (
          <Card className="text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-none bg-secondary">
            <CardHeader>
              <CardTitle>Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {residence.mainGallery.slice(0, 6).map((image: any, index: number) => (
                  <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden">
                    <img
                      src={getMediaUrl(image.id)}
                      alt={`${residence.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
                {residence.mainGallery.length > 6 && (
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-black/20 flex items-center justify-center">
                    <span className="text-white font-medium">
                      +{residence.mainGallery.length - 6} more
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )} */}


        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 col-span-1 lg:col-span-2">
          <Card className="text-card-foreground flex flex-col gap-2 rounded-xl border py-6 shadow-sm border-none bg-secondary h-fit">
            <CardHeader>
              <CardTitle className="text-center">
                {residence.units?.length || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">Available Units</p>
            </CardContent>
          </Card>

          <Card className="text-card-foreground flex flex-col gap-2 rounded-xl border py-6 shadow-sm border-none bg-secondary h-fit">
            <CardHeader>
              <CardTitle className="text-center">-</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">Inquiries</p>
            </CardContent>
          </Card>
        </div>

        <Card className="text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-none bg-secondary ">
          <CardHeader>
            <CardTitle>General Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1 text-sans">Associated Brand</h3>
              {residence.brand?.name ? (
                <div className="flex items-center gap-2">
                  <p className="text-md">{residence.brand.name}</p>
                  {residence.websiteUrl && (
                    <Link href={`/brands/${residence.brand.slug}`} target="_blank" className="text-md text-muted-foreground hover:text-primary transition-all">
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              ) : (
                <p className="text-md">-</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1 text-sans">Website URL</h3>
              {residence.name ? (
                <div className="flex items-center gap-2">
                  {/* <p className="text-md">A{residence.websiteUrl}</p> */}
                  {residence.websiteUrl && (
                    <Link href={residence.websiteUrl} target="_blank" className="text-md text-white flex items-center gap-2 hover:text-primary transition-all">
                      Website URL
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              ) : (
                <p className="text-md">-</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1 text-sans">City</h3>
              {residence.city?.name ? (
                <div className="flex items-center gap-2">
                  <p className="text-md">{residence.city.name}</p>
                </div>
              ) : (
                <p className="text-md">-</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1 text-sans">Country</h3>
              {residence.country?.name ? (
                <div className="flex items-center gap-2">
                  <p className="text-md">{residence.country.name}</p>
                </div>
              ) : (
                <p className="text-md">-</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1 text-sans">Address</h3>
              {residence.address ? (
                <div className="flex items-center gap-2">
                  <p className="text-md">{residence.address}</p>
                </div>
              ) : (
                <p className="text-md">-</p>
              )}
            </div>


            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1 text-sans">Year Built</h3>
              {residence.yearBuilt ? (
                <div className="flex items-center gap-2">
                  <p className="text-md">{residence.yearBuilt}</p>
                </div>
              ) : (
                <p className="text-md">-</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-none bg-secondary ">
          <CardHeader>
            <CardTitle>Pricing Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1 text-sans">Price Range</h3>
              {residence.budgetStartRange && residence.budgetEndRange ? (
                <div className="flex items-center gap-2">
                  <p className="text-md">{residence.budgetStartRange} - {residence.budgetEndRange} {residence.country?.currencyCode || ""}</p>
                </div>
              ) : (
                <p className="text-md">-</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1 text-sans">Average Price per Unit</h3>
              {residence.avgPricePerUnit ? (
                <div className="flex items-center gap-2">
                  <p className="text-md">{residence.avgPricePerUnit} {residence.country?.currencyCode || ""}</p>
                </div>
              ) : (
                <p className="text-md">-</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1 text-sans">Average Price per Sqft</h3>
              {residence.avgPricePerSqft ? (
                <div className="flex items-center gap-2">
                  <p className="text-md">{residence.avgPricePerSqft} {residence.country?.currencyCode || ""}</p>
                </div>
              ) : (
                <p className="text-md">-</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1 text-sans">Rental Potential</h3>
              {residence.rentalPotential ? (
                <div className="flex items-center gap-2">
                  <p className="text-md">{residence.rentalPotential}</p>
                </div>
              ) : (
                <p className="text-md">-</p>
              )}
            </div>
          </CardContent>
        </Card>


        <Card className="text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-none bg-secondary ">
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1 text-sans">Floor Area</h3>
              {residence.floorSqft ? (
                <div className="flex items-center gap-2">
                  <p className="text-md">{residence.floorSqft} sqft</p>
                </div>
              ) : (
                <p className="text-md">-</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1 text-sans">Staff Ratio</h3>
              {residence.staffRatio ? (
                <div className="flex items-center gap-2">
                  <p className="text-md">{residence.staffRatio}</p>
                </div>
              ) : (
                <p className="text-md">-</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1 text-sans">Features</h3>
              <div className="flex flex-wrap gap-2">
                {residence.petFriendly && (
                  <Badge variant="outline" className="text-sm">Pet Friendly</Badge>
                )}
                {residence.disabledFriendly && (
                  <Badge variant="outline" className="text-sm">Accessible</Badge>
                )}
                {!residence.petFriendly && !residence.disabledFriendly && (
                  <p className="text-md">-</p>
                )}
              </div>
            </div>

            {residence.videoTourUrl && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1 text-sans">Video Tour</h3>
                <Link
                  href={residence.videoTourUrl}
                  target="_blank"
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span className="text-sm">Watch Video Tour</span>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {residence.keyFeatures && residence.keyFeatures.length > 0 ? (
          <Card className="text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-none bg-secondary ">
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {residence.keyFeatures.map((feature: any) => (
                  <Badge key={feature.id} variant="outline" className="text-sm">
                    {feature.name || "-"}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}

        {residence.highlightedAmenities && residence.highlightedAmenities.length > 0 && (
          <Card className="text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-none bg-secondary col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Featured Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {residence.highlightedAmenities
                  .sort((a: any, b: any) => a.order - b.order)
                  .map((highlighted: any) => (
                    <div key={highlighted.amenity.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary border">
                      {highlighted.amenity.icon?.id && (
                        <Image
                          src={getMediaUrl(highlighted.amenity.icon.id)}
                          alt={highlighted.amenity.name || "Amenity"}
                          className="w-6 h-6 object-contain"
                          width={24}
                          height={24}
                        />
                      )}
                      <span className="font-medium">{highlighted.amenity.name || "-"}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {residence.amenities && residence.amenities.length > 0 && (
          <Card className="text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-none bg-secondary col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>All Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {residence.amenities.map((amenity: any) => (
                  <div key={amenity.id} className="flex items-center gap-2">
                    {amenity.icon?.id && (
                      <img
                        src={getMediaUrl(amenity.icon.id)}
                        alt={amenity.name || "Amenity"}
                        className="w-6 h-6 object-contain"
                      />
                    )}
                    <span className="text-sm">{amenity.name || "-"}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

    </div>
  );
}