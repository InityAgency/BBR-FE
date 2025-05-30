"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb, TrendingUp } from "lucide-react"

interface SmartSuggestionsProps {
  field: string
  userSelections: any
  onSuggestionSelect: (suggestion: string) => void
}

export function SmartSuggestions({ field, userSelections, onSuggestionSelect }: SmartSuggestionsProps) {
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>([])

  useEffect(() => {
    // Generate smart suggestions based on user's previous selections
    const suggestions = generateSmartSuggestions(field, userSelections)
    setSmartSuggestions(suggestions)
  }, [field, userSelections])

  const generateSmartSuggestions = (currentField: string, selections: any): string[] => {
    // Logic to suggest options based on previous selections
    switch (currentField) {
      case "amenities":
        if (selections.budget?.includes("$5M+")) {
          return ["Private Chef", "Helipad", "Wine Cellar", "Private Beach"]
        }
        if (selections.location?.includes("United Arab Emirates")) {
          return ["Desert Safari Access", "Private Pool", "Spa", "Concierge"]
        }
        break

      case "brands":
        if (selections.budget?.includes("$5M+")) {
          return ["Aman", "Bulgari", "Mandarin Oriental"]
        }
        if (selections.lifestyle?.includes("Adventure")) {
          return ["Aman", "Six Senses", "Alila"]
        }
        break

      case "lifestyle":
        if (selections.location?.includes("Thailand")) {
          return ["Beach Lifestyle", "Wellness Retreat", "Cultural Immersion"]
        }
        if (selections.amenities?.includes("Golf")) {
          return ["Golf Living", "Country Club Lifestyle"]
        }
        break

      default:
        return []
    }
    return []
  }

  if (smartSuggestions.length === 0) return null

  return (
    <Card className="bg-[#0f172a] border-[#333638] mb-4">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Lightbulb className="w-5 h-5 text-[#c5a363] flex-shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="text-sm font-medium text-white">Smart Suggestions</h4>
              <TrendingUp className="w-4 h-4 text-[#73e2a3]" />
            </div>
            <p className="text-xs text-[#a3a3a3] mb-3">
              Based on your previous selections, you might also be interested in:
            </p>
            <div className="flex flex-wrap gap-2">
              {smartSuggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  className="border-[#c5a363] text-[#c5a363] hover:bg-[#c5a363] hover:text-black text-xs"
                  onClick={() => onSuggestionSelect(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
