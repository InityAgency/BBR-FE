"use client"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Info } from "lucide-react"

interface InputValidationProps {
  input: string
  field: string
  validationResult: {
    isValid: boolean
    suggestions: string[]
    confidence: number
    message: string
  }
}

export function InputValidation({ input, field, validationResult }: InputValidationProps) {
  const { isValid, suggestions, confidence, message } = validationResult

  const getIcon = () => {
    if (isValid) return <CheckCircle className="w-5 h-5 text-[#73e2a3]" />
    if (confidence > 0.5) return <Info className="w-5 h-5 text-[#c5a363]" />
    return <AlertCircle className="w-5 h-5 text-[#b3804c]" />
  }

  const getCardStyle = () => {
    if (isValid) return "border-[#73e2a3]"
    if (confidence > 0.5) return "border-[#c5a363]"
    return "border-[#b3804c]"
  }

  return (
    <Card className={`bg-[#1a1e21] ${getCardStyle()} border-2 mb-4`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {getIcon()}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="text-sm font-medium text-white">Input Validation</h4>
              <Badge variant="outline" className="text-xs">
                {Math.round(confidence * 100)}% confidence
              </Badge>
            </div>
            <p className="text-xs text-[#a3a3a3] mb-2">{message}</p>

            {suggestions.length > 0 && (
              <div>
                <p className="text-xs text-[#a3a3a3] mb-2">Related options:</p>
                <div className="flex flex-wrap gap-1">
                  {suggestions.map((suggestion) => (
                    <Badge key={suggestion} variant="secondary" className="text-xs">
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
