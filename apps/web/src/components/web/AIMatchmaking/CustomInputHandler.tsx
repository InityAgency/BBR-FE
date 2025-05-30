"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Plus, X, Check } from "lucide-react"

interface CustomInputHandlerProps {
  field: string
  userInput: string
  suggestions: string[]
  onAcceptSuggestion: (suggestion: string) => void
  onAddCustom: (input: string) => void
  onCancel: () => void
}

export function CustomInputHandler({
  field,
  userInput,
  suggestions,
  onAcceptSuggestion,
  onAddCustom,
  onCancel,
}: CustomInputHandlerProps) {
  const [customValue, setCustomValue] = useState(userInput)

  return (
    <Card className="bg-[#1a1e21] border-[#b3804c] border-2">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-[#b3804c] flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-white mb-2">Input not found in our {field} database</h3>
            <p className="text-xs text-[#a3a3a3] mb-3">
              We couldn't find "{userInput}" in our predefined {field} options. Here are some suggestions:
            </p>

            {suggestions.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-[#a3a3a3] mb-2">Similar options:</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {suggestions.map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      className="border-[#b3804c] text-[#b3804c] hover:bg-[#b3804c] hover:text-white text-xs"
                      onClick={() => onAcceptSuggestion(suggestion)}
                    >
                      <Check className="w-3 h-3 mr-1" />
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <p className="text-xs text-[#a3a3a3] mb-2">Or add as custom {field}:</p>
                <div className="flex space-x-2">
                  <Input
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    className="bg-[#0c1012] border-[#333638] text-white text-xs"
                    placeholder={`Enter custom ${field}`}
                  />
                  <Button
                    size="sm"
                    className="bg-[#b3804c] hover:bg-[#ad7c4a] text-xs"
                    onClick={() => onAddCustom(customValue)}
                    disabled={!customValue.trim()}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#a3a3a3] hover:text-white text-xs"
                  onClick={onCancel}
                >
                  <X className="w-3 h-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
