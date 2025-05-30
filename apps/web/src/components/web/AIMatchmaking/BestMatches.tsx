"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Loader2 } from "lucide-react"

interface Property {
  id: string
  name: string
  location: string
  image: string
  matchRate: number
  isFavorite: boolean
  confidenceLevel?: string
}

interface EnhancedProperty extends Property {
  characteristics: {
    location: {
      country: string
      city: string
      region: string
    }
    priceRange: string[]
    amenities: string[]
    brand: string
    lifestyle: string[]
    features: string[]
  }
}

interface BestMatchesProps {
  userSelections?: any
}

export function BestMatches({ userSelections }: BestMatchesProps) {
  const [matches, setMatches] = useState<Property[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])

  // Expanded property database with more diverse luxury branded residences
  const propertyDatabase: EnhancedProperty[] = [
    {
      id: "1",
      name: "Bulgari Resort & Residences, Dubai",
      location: "Dubai, United Arab Emirates",
      image: "https://bbrapi.inity.space/api/v1/media/aa8502cc-7cf8-4264-a0ef-904c723c3ed0/content",
      matchRate: 0,
      isFavorite: false,
      characteristics: {
        location: {
          country: "United Arab Emirates",
          city: "Dubai",
          region: "Middle East",
        },
        priceRange: ["$5M+"],
        amenities: ["Pool", "Spa", "Concierge", "Beach Access", "Private Chef"],
        brand: "Bulgari",
        lifestyle: ["Beach Lifestyle", "Culinary Lifestyle", "Urban Living"],
        features: ["Luxury", "Waterfront", "High-end"],
      },
    },
    {
      id: "2",
      name: "Ritz-Carlton Residences, Miami Beach",
      location: "Miami, United States",
      image: "https://bbrapi.inity.space/api/v1/media/aa8502cc-7cf8-4264-a0ef-904c723c3ed0/content",
      matchRate: 0,
      isFavorite: false,
      characteristics: {
        location: {
          country: "United States",
          city: "Miami",
          region: "North America",
        },
        priceRange: ["$1M-$5M", "$5M+"],
        amenities: ["Pool", "Spa", "Gym", "Concierge", "Beach Access"],
        brand: "Ritz-Carlton",
        lifestyle: ["Beach Lifestyle", "Urban Living", "Art and Culture"],
        features: ["Luxury", "Oceanfront", "Modern"],
      },
    },
    {
      id: "3",
      name: "Aman Residences, Tokyo",
      location: "Tokyo, Japan",
      image: "https://bbrapi.inity.space/api/v1/media/aa8502cc-7cf8-4264-a0ef-904c723c3ed0/content",
      matchRate: 0,
      isFavorite: false,
      characteristics: {
        location: {
          country: "Japan",
          city: "Tokyo",
          region: "Asia",
        },
        priceRange: ["$5M+"],
        amenities: ["Spa", "Gym", "Concierge", "Private Chef"],
        brand: "Aman",
        lifestyle: ["Urban Living", "Art and Culture", "Culinary Lifestyle"],
        features: ["Minimalist", "Zen", "Ultra-luxury"],
      },
    },
  ]

  // Calculate dynamic match rate based on user preferences and confidence
  const calculateMatchRate = (property: EnhancedProperty, userSelections: any): number => {
    let totalScore = 0
    let maxScore = 0

    // Dynamic weights based on user priority
    const priority = userSelections?.priority
    const weights = {
      location: priority === "Location" ? 0.4 : 0.2,
      budget: priority === "Price" ? 0.4 : 0.2,
      amenities: 0.15,
      brands: priority === "Brand" ? 0.4 : 0.15,
      lifestyle: priority === "Lifestyle" ? 0.4 : 0.15,
    }

    // Location matching with confidence scoring
    const userLocations = [...(userSelections.location || []), ...(userSelections.customInputs?.location || [])]
    if (userLocations.length > 0) {
      let locationScore = 0
      for (const userLocation of userLocations) {
        if (property.characteristics.location.country.toLowerCase().includes(userLocation.toLowerCase())) {
          locationScore = 1.0 // Perfect match
          break
        } else if (property.characteristics.location.city.toLowerCase().includes(userLocation.toLowerCase())) {
          locationScore = 0.9 // Very good match
          break
        } else if (property.characteristics.location.region.toLowerCase().includes(userLocation.toLowerCase())) {
          locationScore = 0.7 // Good match
          break
        }
      }
      totalScore += locationScore * weights.location
    }
    maxScore += weights.location

    // Budget matching with range overlap confidence
    const userBudgets = [...(userSelections.budget || []), ...(userSelections.customInputs?.budget || [])]
    if (userBudgets.length > 0) {
      let budgetScore = 0
      for (const userBudget of userBudgets) {
        if (property.characteristics.priceRange.includes(userBudget)) {
          budgetScore = 1.0 // Perfect match
          break
        } else {
          // Partial matching for adjacent ranges
          if (
            (userBudget === "Under $1M" && property.characteristics.priceRange.includes("$1M-$5M")) ||
            (userBudget === "$1M-$5M" &&
              (property.characteristics.priceRange.includes("Under $1M") ||
                property.characteristics.priceRange.includes("$5M+"))) ||
            (userBudget === "$5M+" && property.characteristics.priceRange.includes("$1M-$5M"))
          ) {
            budgetScore = 0.6 // Partial match
          }
        }
      }
      totalScore += budgetScore * weights.budget
    }
    maxScore += weights.budget

    // Amenities matching with percentage-based confidence
    const userAmenities = [...(userSelections.amenities || []), ...(userSelections.customInputs?.amenities || [])]
    if (userAmenities.length > 0) {
      const amenityMatches = userAmenities.filter((amenity) =>
        property.characteristics.amenities.some(
          (propAmenity) =>
            propAmenity.toLowerCase().includes(amenity.toLowerCase()) ||
            amenity.toLowerCase().includes(propAmenity.toLowerCase()),
        ),
      ).length
      const amenityScore = amenityMatches / userAmenities.length
      totalScore += amenityScore * weights.amenities
    }
    maxScore += weights.amenities

    // Brand matching with exact confidence
    const userBrands = [...(userSelections.brands || []), ...(userSelections.customInputs?.brands || [])]
    if (userBrands.length > 0) {
      let brandScore = 0
      for (const userBrand of userBrands) {
        if (
          property.characteristics.brand.toLowerCase().includes(userBrand.toLowerCase()) ||
          userBrand.toLowerCase().includes(property.characteristics.brand.toLowerCase())
        ) {
          brandScore = 1.0
          break
        }
      }
      totalScore += brandScore * weights.brands
    }
    maxScore += weights.brands

    // Lifestyle matching with percentage-based confidence
    const userLifestyles = [...(userSelections.lifestyle || []), ...(userSelections.customInputs?.lifestyle || [])]
    if (userLifestyles.length > 0) {
      const lifestyleMatches = userLifestyles.filter((lifestyle) =>
        property.characteristics.lifestyle.some(
          (propLifestyle) =>
            propLifestyle.toLowerCase().includes(lifestyle.toLowerCase()) ||
            lifestyle.toLowerCase().includes(propLifestyle.toLowerCase()),
        ),
      ).length
      const lifestyleScore = lifestyleMatches / userLifestyles.length
      totalScore += lifestyleScore * weights.lifestyle
    }
    maxScore += weights.lifestyle

    // Calculate final percentage with confidence adjustment
    let matchPercentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 75

    // Apply confidence boost for multiple category matches
    const categoryMatches = [
      userLocations.length > 0,
      userBudgets.length > 0,
      userAmenities.length > 0,
      userBrands.length > 0,
      userLifestyles.length > 0,
    ].filter(Boolean).length

    if (categoryMatches >= 3) {
      matchPercentage *= 1.05 // 5% boost for comprehensive matches
    }

    // Ensure minimum quality threshold and cap at 99%
    return Math.min(99, Math.max(60, Math.round(matchPercentage)))
  }

  // Get confidence level description based on match rate
  const getConfidenceLevel = (matchRate: number): string => {
    if (matchRate >= 95) return "Excellent Match"
    if (matchRate >= 85) return "Very Good Match"
    if (matchRate >= 75) return "Good Match"
    if (matchRate >= 65) return "Fair Match"
    return "Potential Match"
  }

  // Update selected locations when user selections change
  useEffect(() => {
    if (userSelections?.location) {
      setSelectedLocations(userSelections.location)
    }
    if (userSelections?.customInputs?.location) {
      setSelectedLocations((prev) => [...prev, ...userSelections.customInputs.location])
    }
  }, [userSelections])

  // Generate matches based on user preferences with dynamic confidence scoring
  const generateMatches = () => {
    setIsGenerating(true)

    // Simulate API call delay
    setTimeout(() => {
      // Calculate match rates for all properties
      const scoredProperties = propertyDatabase.map((property) => {
        const matchRate = calculateMatchRate(property, userSelections)
        const confidenceLevel = getConfidenceLevel(matchRate)

        return {
          ...property,
          matchRate,
          confidenceLevel,
        }
      })

      // Sort by match rate and take top matches
      const topMatches = scoredProperties.sort((a, b) => b.matchRate - a.matchRate).slice(0, 3)

      setMatches(topMatches)
      setIsGenerating(false)
      setHasGenerated(true)
    }, 2000) // 2 second delay to simulate processing
  }

  // Handle regenerate with slight variation in scoring
  const handleRegenerate = () => {
    setIsGenerating(true)

    setTimeout(() => {
      // Add slight randomization to create variety in regeneration
      const scoredProperties = propertyDatabase.map((property) => {
        let matchRate = calculateMatchRate(property, userSelections)

        // Add small random variation (±3%) to simulate different matching algorithms
        const variation = (Math.random() - 0.5) * 6
        matchRate = Math.min(99, Math.max(60, Math.round(matchRate + variation)))

        const confidenceLevel = getConfidenceLevel(matchRate)

        return {
          ...property,
          matchRate,
          confidenceLevel,
        }
      })

      const topMatches = scoredProperties.sort((a, b) => b.matchRate - a.matchRate).slice(0, 3)

      setMatches(topMatches)
      setIsGenerating(false)
    }, 2000)
  }

  // Toggle favorite status
  const toggleFavorite = (propertyId: string) => {
    setMatches((prev) =>
      prev.map((property) =>
        property.id === propertyId ? { ...property, isFavorite: !property.isFavorite } : property,
      ),
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-4 pb-3">
        <h2 className="text-xl font-serif text-white">My Best Matches</h2>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 px-4 overflow-y-auto min-h-0">
        {!hasGenerated && !isGenerating && (
          <div className="flex flex-col items-center justify-center text-center h-full">
            <div className="w-24 h-24 bg-[#1a1e21] rounded-lg flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-[#b3804c] rounded flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-sm"></div>
              </div>
            </div>
            <h3 className="text-sm font-medium text-white mb-2">No matches yet</h3>
            <p className="text-xs text-[#a3a3a3] mb-6 max-w-[200px]">
              Complete your preferences and generate results to see your personalized matches
            </p>
            <Button
              className="w-full bg-[#b3804c] hover:bg-[#ad7c4a] rounded-full"
              onClick={generateMatches}
              disabled={isGenerating}
            >
              Generate results
            </Button>
          </div>
        )}

        {isGenerating && (
          <div className="flex flex-col items-center justify-center text-center h-full">
            <div className="w-24 h-24 bg-[#1a1e21] rounded-lg flex items-center justify-center mb-4">
              <Loader2 className="w-8 h-8 text-[#b3804c] animate-spin" />
            </div>
            <h3 className="text-sm font-medium text-white mb-2">Generating results...</h3>
            <p className="text-xs text-[#a3a3a3] max-w-[200px]">
              Analyzing your preferences and calculating confidence scores for the best matches
            </p>
          </div>
        )}

        {hasGenerated && !isGenerating && (
          <div className="space-y-6">
            {matches.map((property) => (
              <div key={property.id} className="flex space-x-4">
                <img
                  src={property.image || "/placeholder.svg"}
                  alt={property.name}
                  className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className="bg-[#4ade80] text-black text-xs font-medium px-2 py-1 rounded">
                      {property.matchRate}%
                    </Badge>
                    <span className="text-xs text-[#a3a3a3]">Match rate</span>
                  </div>
                  <h3 className="font-serif text-sm text-white mb-3 leading-tight break-words">{property.name}</h3>
                  <div className="flex flex-col space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-[#555] text-white hover:bg-[#555] rounded-full px-3 py-1 text-xs"
                      >
                        Request Information
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-[#555] text-white hover:bg-[#555] rounded-full px-3 py-1 text-xs"
                      >
                        View more
                      </Button>
                    </div>
                    <div className="flex justify-end">
                      <Heart
                        className={`w-5 h-5 cursor-pointer ${
                          property.isFavorite ? "text-[#b3804c] fill-[#b3804c]" : "text-[#a3a3a3]"
                        }`}
                        onClick={() => toggleFavorite(property.id)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer - Fixed */}
      {hasGenerated && !isGenerating && (
        <div className="flex-shrink-0 p-4 pt-3 border-t border-[#444]">
          <Button
            className="w-full bg-[#b3804c] hover:bg-[#ad7c4a] rounded-full py-3 text-white font-medium"
            onClick={handleRegenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Regenerating...
              </>
            ) : (
              "Regenerate"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
