"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

type Option = {
  value: string
  label: string
}

type MultiSelectProps = {
  options: Option[]
  placeholder?: string
  maxSelections?: number
  className?: string
  value?: Option[]
  onChange?: (selected: Option[]) => void
}

export default function MultiSelect({
  options,
  placeholder = "Select options...",
  maxSelections = 3,
  className,
  value,
  onChange,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<Option[]>(value || [])
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Ažuriramo lokalni state kada se promeni value prop
  useEffect(() => {
    if (value) {
      setSelectedOptions(value);
    }
  }, [value]);

  // Dodajemo event listener za klik van komponente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Dodajemo event listener samo kada je dropdown otvoren
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup funkcija
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleOption = (option: Option) => {
    let updatedSelection;
    
    if (selectedOptions.some((item) => item.value === option.value)) {
      // Remove option if already selected
      updatedSelection = selectedOptions.filter((item) => item.value !== option.value);
    } else if (selectedOptions.length < maxSelections) {
      // Add option if under max selections
      updatedSelection = [...selectedOptions, option];
    } else {
      // Nema promene ako je maksimalni broj već izabran
      return;
    }
    
    // Ažuriramo lokalni state
    setSelectedOptions(updatedSelection);
    
    // Pozivamo onChange prop ako postoji
    if (onChange) {
      onChange(updatedSelection);
    }
  }

  const removeOption = (option: Option, e: React.MouseEvent) => {
    e.stopPropagation()
    const updatedSelection = selectedOptions.filter((item) => item.value !== option.value);
    
    // Ažuriramo lokalni state
    setSelectedOptions(updatedSelection);
    
    // Pozivamo onChange prop ako postoji
    if (onChange) {
      onChange(updatedSelection);
    }
  }

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <div
        className={cn(
          "flex min-h-10 w-full flex-wrap items-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          isOpen && "ring-2 ring-ring ring-offset-2",
          selectedOptions.length === maxSelections && "bg-muted/50",
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOptions.length > 0 ? (
          <>
            {selectedOptions.map((option) => (
              <span
                key={option.value}
                className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground"
              >
                {option.label}
                <button
                  type="button"
                  onClick={(e) => removeOption(option, e)}
                  className="rounded-full p-0.5 hover:bg-secondary-foreground/20"
                  aria-label={`Remove ${option.label}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {selectedOptions.length < maxSelections && <span className="text-muted-foreground">{placeholder}</span>}
          </>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
          <div className="flex flex-col gap-1 py-1">
            {options.map((option) => {
              const isSelected = selectedOptions.some((item) => item.value === option.value)
              const isDisabled = selectedOptions.length >= maxSelections && !isSelected

              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={isDisabled}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none",
                    isSelected && "bg-accent text-accent-foreground",
                    !isSelected && "hover:bg-accent hover:text-accent-foreground",
                    isDisabled && "cursor-not-allowed opacity-50",
                  )}
                  onClick={() => toggleOption(option)}
                >
                  {option.label}
                  {isSelected && (
                    <span className="ml-auto flex h-4 w-4 items-center justify-center font-semibold">✓</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {selectedOptions.length > 0 && (
        <div className="mt-1.5 text-xs text-muted-foreground">
          {selectedOptions.length} of {maxSelections} selected
        </div>
      )}
    </div>
  )
}