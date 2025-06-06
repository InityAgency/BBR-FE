"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Loader2, MapPin, DollarSign, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer"
import { FavoriteHeart } from "../Residences/FavoriteHeart"

interface Property {
  id: string
  name: string
  location: string
  image: string
  matchRate: number
  isFavorite?: boolean
  subtitle?: string
  budgetRange?: string
  characteristics?: Record<string, any>
}

interface BestMatchesProps {
  userSelections?: any
  matches?: Property[]
}

export function BestMatches({ userSelections, matches = [] }: BestMatchesProps) {
  const [displayedMatches, setDisplayedMatches] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasReceivedMatches, setHasReceivedMatches] = useState(false)
  const router = useRouter()
  // Update matches when received from backend
  useEffect(() => {
    if (matches && matches.length > 0) {
      // Replace displayedMatches instead of potentially accumulating duplicates
      const newMatches = matches.map(match => ({
        ...match,
        isFavorite: match.isFavorite ?? false, // Preserve existing favorite status if present
      }))
      setDisplayedMatches(newMatches)
      setHasReceivedMatches(true)
    } else {
      setDisplayedMatches([])
      setHasReceivedMatches(false)
    }
  }, [matches])

  console.log(displayedMatches)

  // Handle favorite removal
  const onFavoriteRemoved = useCallback(() => {
    // Ažuriramo lokalno stanje da uklonimo rezidenciju iz prikaza
    setDisplayedMatches(prev => prev.filter(match => !match.isFavorite));
  }, []);

  // Handle view more - navigate to property detail
  const handleViewMore = (propertyId: string) => {
    // Open in new tab
    window.open(`/residences/${propertyId}`, '_blank')
  }

  // Handle request information
  const handleRequestInfo = (propertyId: string) => {
    // In a real app, this would open a contact form or modal
    console.log("Request info for:", propertyId)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-4 pb-3 border-b border-[#333638]">
        <h2 className="text-xl font-serif text-white">My Best Matches</h2>
        {hasReceivedMatches && (
          <p className="text-xs text-[#a3a3a3] mt-1">
            {displayedMatches.length} properties found
          </p>
        )}
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 px-4 overflow-y-auto min-h-0">
        {!hasReceivedMatches && !isLoading && (
          <div className="flex flex-col items-center justify-center text-center h-full py-8">
            <div className="w-24 h-24 bg-[#1a1e21] rounded-lg flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-[#b3804c] rounded flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-white mb-2">No matches yet</h3>
            <p className="text-xs text-[#a3a3a3] mb-6 max-w-[200px]">
              Start chatting with our AI to find your perfect luxury residence
            </p>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center text-center h-full py-8">
            <div className="w-24 h-24 bg-[#1a1e21] rounded-lg flex items-center justify-center mb-4">
              <Loader2 className="w-8 h-8 text-[#b3804c] animate-spin" />
            </div>
            <h3 className="text-sm font-medium text-white mb-2">Finding your matches...</h3>
            <p className="text-xs text-[#a3a3a3] max-w-[200px]">
              Analyzing luxury residences that match your preferences
            </p>
          </div>
        )}

        {hasReceivedMatches && !isLoading && displayedMatches.length > 0 && (
          <div className="space-y-4 py-4">
            {displayedMatches.map((property, index) => (
              <div key={`${property.id}-${index}`} className="bg-[#1a1e21] rounded-lg p-4 space-y-3">
                <div className="flex space-x-4">
                  <img
                    src={property.image || "/placeholder.svg"}
                    alt={property.name}
                    className="w-24 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-serif text-sm text-white leading-tight break-words">
                          {property.name}
                        </h3>
                        {property.subtitle && (
                          <p className="text-xs text-[#a3a3a3] mt-1">{property.subtitle}</p>
                        )}
                      </div>
                      <Badge className="bg-[#4ade80] text-black text-xs font-medium px-2 py-1 rounded ml-2 flex-shrink-0">
                        {property.matchRate}%
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-xs text-white">
                      <div className="flex items-start">
                        <MapPin className="w-3 min-w-3 min-h-3 h-3 mr-1 mt-1" />
                        {property.location}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-[#333638] relative ai-residence-card">
                  <div className="flex gap-2">
                    {/* <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-[#555] text-white hover:bg-[#555] rounded-md px-3 py-1 text-xs"
                      onClick={() => handleRequestInfo(property.id)}
                    >
                      Request Info
                    </Button> */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-[#555] text-white hover:bg-[#555] rounded-md px-3 py-1 text-xs"
                      onClick={() => handleViewMore(property.characteristics?.slug)}
                    >
                      View Details
                    </Button>
                  </div>
                  <FavoriteHeart
                    entityId={property.id}
                    entityType="residences"
                    isFavorite={property.isFavorite}
                    onFavoriteRemoved={onFavoriteRemoved}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer - Fixed */}
      {hasReceivedMatches && !isLoading && displayedMatches.length > 0 && (
        <div className="flex-shrink-0 p-4 pt-3 border-t border-[#444]">
          <p className="text-xs text-[#a3a3a3] text-center">
            Ask the AI to refine your search or find more options
          </p>
        </div>
      )}
    </div>
  )
}

interface BestMatchesDrawerProps {
  userSelections: any;
  matches: any;
}

export function BestMatchesDrawer({ userSelections, matches }: BestMatchesDrawerProps) {
  return (
    <div className="fixed bottom-[80px] z-50 relative w-full" id="match-trigger">
      <Drawer>
        <DrawerTrigger asChild>
          <Button className="bg-[#b3804c] text-white hover:bg-[#b3804c]/90 w-full">
            Show Matches
          </Button>
        </DrawerTrigger>
        <DrawerTitle></DrawerTitle>
        <DrawerContent className="p-0">
          {/* Ovde prikazujemo BestMatches */}
          <div className="h-[80vh] overflow-y-auto">
            <BestMatches userSelections={userSelections} matches={matches} />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}