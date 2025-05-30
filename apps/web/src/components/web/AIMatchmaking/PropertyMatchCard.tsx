"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Heart } from "lucide-react"

interface PropertyMatchCardProps {
  image: string
  matchRate: number
  name: string
  location: string
  isFavorite?: boolean
  onFavoriteToggle?: () => void
  onRequestInfo?: () => void
  onViewMore?: () => void
}

export function PropertyMatchCard({
  image,
  matchRate,
  name,
  location,
  isFavorite = false,
  onFavoriteToggle,
  onRequestInfo,
  onViewMore,
}: PropertyMatchCardProps) {
  return (
    <Card className="bg-[#1a1e21] border-[#333638]">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <img src={image || "/placeholder.svg"} alt={name} className="w-20 h-15 object-cover rounded" />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <Badge className="bg-[#73e2a3] text-black text-xs">{matchRate}%</Badge>
              <span className="text-xs text-[#a3a3a3]">Match rate</span>
            </div>
            <h3 className="font-medium text-sm mb-1">{name}</h3>
            <div className="flex items-center justify-between text-xs">
              <Button variant="ghost" size="sm" className="text-[#a3a3a3] p-0 h-auto" onClick={onRequestInfo}>
                Request Information
              </Button>
              <Button variant="ghost" size="sm" className="text-[#a3a3a3] p-0 h-auto" onClick={onViewMore}>
                View more
              </Button>
              <Heart
                className={`w-4 h-4 ${isFavorite ? "text-[#b3804c] fill-[#b3804c]" : "text-[#a3a3a3]"}`}
                onClick={onFavoriteToggle}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
