"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Mic, Send, Loader2, RefreshCw } from "lucide-react"
import { useMatchmaking, AIResponse } from "@/hooks/useMatchmaking"
import { useBrands } from "@/hooks/useBrands"
import Image from "next/image"
import { API_BASE_URL, API_VERSION } from "@/app/constants/api"
import { useAmenities } from "@/hooks/useAmenities"

// Define the message types
type MessageType = "bot" | "user" | "options" | "loading" | "matches"

// Define the message structure
interface Message {
  id: string
  type: MessageType
  content: string
  options?: string[]
  multiSelect?: boolean
  field?: string
  matches?: any[]
}

interface MatchmakerChatProps {
  onSelectionsChange?: (selections: any) => void
  onMatchesReceived?: (matches: any[]) => void
}

// Helper function to convert image ID to URL
const getImageUrl = (imageId: string): string => {
  if (!imageId) return "/placeholder.svg"
  return `${process.env.NEXT_PUBLIC_API_URL}/api/v1/media/${imageId}/content`
}

// Predefined conversation flows based on the Excel sheet
const CONVERSATION_FLOWS = {
  priority: {
    key: "priority",
    content: "Great, let's begin. I'll ask a few questions to help find the best branded residences for you. Feel free to ask any questions along the way.\n\nWhat is most important to you?\n(Select one below):",
    options: ["Location", "Price", "Brand", "Amenities"],
    multiSelect: false,
  },
  location: {
    key: "location",
    content: "What's your preferred location?",
    options: [
      "United States",
      "United Arab Emirates",
      "Spain",
      "Thailand",
      "France",
      "Japan",
      "United Kingdom",
      "Mexico",
    ],
    multiSelect: true,
  },
  budget: {
    key: "budget",
    content: "Great. What's your budget range?",
    options: ["Under $1M", "$1M-$5M", "$5M+"],
    multiSelect: true,
  },
  amenities: {
    key: "amenities",
    content: "What amenities are important to you?",
    options: [], // Will be populated dynamically from API
    multiSelect: true,
  },
  brands: {
    key: "brands",
    content: "What are your preferred brand options?",
    options: [], // Will be populated dynamically from API
    multiSelect: true,
  },
  followUp: {
    key: "followUp",
    content: "What would you like to do next?",
    options: [
      "Adjust my budget range",
      "Look in different locations",
      "Change my requirements",
      "Start a new search",
    ],
    multiSelect: false,
  },
};

export function MatchmakerChat({ onSelectionsChange, onMatchesReceived }: MatchmakerChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [userInput, setUserInput] = useState("")
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [messageIdCounter, setMessageIdCounter] = useState(0)
  const [hasReceivedMatches, setHasReceivedMatches] = useState(false)
  const [conversationStage, setConversationStage] = useState<string>("priority")
  const [userSelections, setUserSelections] = useState<Record<string, any>>({})
  const [tempSelections, setTempSelections] = useState<string[]>([]) // For multi-select
  const [flowOrder, setFlowOrder] = useState<string[]>(["priority"]) // Dinamički redosled pitanja
  const [completedQuestions, setCompletedQuestions] = useState<string[]>([]) // Pratimo završena pitanja
  const [isInitialFlow, setIsInitialFlow] = useState(true) // Novo: pratimo da li je inicijalni tok
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { 
    sessionId, 
    isSessionLoading, 
    sessionError, 
    sendMessage, 
    isMessageLoading, 
    messageError,
    resetSession 
  } = useMatchmaking()

  const { amenities, loading: amenitiesLoading } = useAmenities()
  const { brands, loading: brandsLoading } = useBrands()

  // Helper function to generate unique message ID
  const generateMessageId = (): string => {
    const currentCounter = messageIdCounter
    setMessageIdCounter(prev => prev + 1)
    const randomStr = Math.random().toString(36).substring(7)
    return `message-${Date.now()}-${currentCounter}-${randomStr}`
  }

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      const scrollContainer = messagesEndRef.current.parentElement?.parentElement
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: "smooth",
        })
      }
    }
  }, [messages])

  // Initialize chat when session is ready
  useEffect(() => {
    if (sessionId && messages.length === 0) {
      initializeChat()
    }
  }, [sessionId])

  // Handle session error
  useEffect(() => {
    if (sessionError) {
      const errorMessage: Message = {
        id: generateMessageId(),
        type: "bot",
        content: "Sorry, I'm having trouble connecting. Please refresh the page and try again.",
      }
      setMessages([errorMessage])
    }
  }, [sessionError])

  // Initialize the chat
  const initializeChat = () => {
    const initialBotMessage: Message = {
      id: generateMessageId(),
      type: "bot",
      content: CONVERSATION_FLOWS.priority.content,
    }
    const initialOptionsMessage: Message = {
      id: generateMessageId(),
      type: "options",
      content: "",
      options: CONVERSATION_FLOWS.priority.options,
      multiSelect: false,
      field: "priority",
    }
    setMessages([initialBotMessage, initialOptionsMessage])
    setConversationStage("priority")
    setFlowOrder(["priority"]) // Reset flow order
    setCompletedQuestions([]) // Reset completed questions
    setIsInitialFlow(true) // Resetujemo na inicijalni tok
  }

  // Function to get options for a specific stage
  const getOptionsForStage = (stage: string): string[] => {
    const stageConfig = CONVERSATION_FLOWS[stage as keyof typeof CONVERSATION_FLOWS]
    if (!stageConfig) return []

    // For amenities, use API data if available, otherwise use fallback
    if (stage === "amenities") {
      if (amenities.length > 0) {
        return amenities.map(amenity => amenity.name)
      } else {
        // Fallback amenities if API data is not available
        return [
          "Private Pool",
          "Spa",
          "Golf Course", 
          "Private Chef",
          "Helipad",
          "Wine Cellar",
          "Gym/Fitness Center",
          "Concierge Service",
          "Valet Parking",
          "Rooftop Terrace"
        ]
      }
    }

    // For brands, use API data if available, otherwise use fallback
    if (stage === "brands") {
      if (brands.length > 0) {
        return brands.map(brand => brand.name)
      } else {
        // Fallback brands if API data is not available
        return [
          "Ritz-Carlton",
          "Aman",
          "Yoo",
          "Trump",
          "Four Seasons",
          "Mandarin Oriental",
        ]
      }
    }

    return stageConfig.options
  }

  // Generate smart suggestions based on user's previous selections (from SmartSuggestions.tsx)
  const generateSmartSuggestions = (currentField: string, selections: any): string[] => {
    switch (currentField) {
      case "amenities":
        // First try smart suggestions based on selections
        if (selections.budget?.includes("$5M+")) {
          // For high budget, check if these amenities exist in our API data
          if (amenities.length > 0) {
            const luxuryAmenities = amenities
              .filter(amenity => 
                amenity.name.toLowerCase().includes('chef') || 
                amenity.name.toLowerCase().includes('helipad') || 
                amenity.name.toLowerCase().includes('wine') ||
                amenity.name.toLowerCase().includes('private') ||
                amenity.name.toLowerCase().includes('beach')
              )
              .map(amenity => amenity.name)
            
            // If we have luxury amenities, return them, otherwise return all amenities
            return luxuryAmenities.length > 0 ? luxuryAmenities : []
          }
          // Fallback for high budget if no API data
          return ["Private Chef", "Helipad", "Wine Cellar", "Private Beach"]
        }
        if (selections.location?.includes("United Arab Emirates")) {
          // For UAE, check if these amenities exist in our API data  
          if (amenities.length > 0) {
            const uaeAmenities = amenities
              .filter(amenity => 
                amenity.name.toLowerCase().includes('pool') || 
                amenity.name.toLowerCase().includes('spa') || 
                amenity.name.toLowerCase().includes('concierge') ||
                amenity.name.toLowerCase().includes('desert')
              )
              .map(amenity => amenity.name)
            
            // If we have UAE-specific amenities, return them, otherwise return empty to use default
            return uaeAmenities.length > 0 ? uaeAmenities : []
          }
          // Fallback for UAE if no API data
          return ["Desert Safari Access", "Private Pool", "Spa", "Concierge"]
        }
        // Return empty array to use getOptionsForStage instead
        return []

      case "brands":
        if (brands.length > 0) {
          if (selections.budget?.includes("$5M+")) {
            // Filter luxury brands for high budget
            const luxuryBrands = brands
              .filter(brand => 
                brand.name.toLowerCase().includes('aman') || 
                brand.name.toLowerCase().includes('bulgari') || 
                brand.name.toLowerCase().includes('mandarin') ||
                brand.name.toLowerCase().includes('ritz') ||
                brand.name.toLowerCase().includes('four seasons')
              )
              .map(brand => brand.name)
            
            // If we have luxury brands, return them, otherwise return empty to use all brands
            return luxuryBrands.length > 0 ? luxuryBrands : []
          }
          if (selections.lifestyle?.includes("Adventure")) {
            // Filter adventure-oriented brands
            const adventureBrands = brands
              .filter(brand => 
                brand.name.toLowerCase().includes('aman') || 
                brand.name.toLowerCase().includes('six senses') || 
                brand.name.toLowerCase().includes('alila')
              )
              .map(brand => brand.name)
            
            // If we have adventure brands, return them, otherwise return empty to use all brands
            return adventureBrands.length > 0 ? adventureBrands : []
          }
          // Return empty array to use getOptionsForStage instead (all brands)
          return []
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

  // Get the next stage in the flow based on dynamic flowOrder
  const getNextStage = (currentStage: string): string => {
    const currentIndex = flowOrder.indexOf(currentStage)
    if (currentIndex === -1 || currentIndex === flowOrder.length - 1) {
      return "followUp"
    }
    return flowOrder[currentIndex + 1]
  }

  // Function to proceed to the next question in the flow
  const proceedToNextQuestion = (currentMessages: Message[], currentStage: string) => {
    const nextStage = getNextStage(currentStage)
    const stageConfig = Object.values(CONVERSATION_FLOWS).find(flow => flow.key === nextStage)
    
    if (stageConfig) {
      let options = getOptionsForStage(nextStage)
      
      // Try to get smart suggestions, but fallback to default options
      const dynamicOptions = generateSmartSuggestions(nextStage, userSelections)
      if (dynamicOptions.length > 0) {
        options = dynamicOptions
      }

      const nextBotMessage: Message = {
        id: generateMessageId(),
        type: "bot",
        content: stageConfig.content,
      }
      const nextOptionsMessage: Message = {
        id: generateMessageId(),
        type: "options",
        content: "",
        options,
        multiSelect: stageConfig.multiSelect || false,
        field: nextStage,
      }
      setMessages([...currentMessages, nextBotMessage, nextOptionsMessage])
      setConversationStage(nextStage)
    }
  }

  // Handle AI response from backend
  const handleAIResponse = (response: AIResponse) => {
    try {
      // Remove loading message
      let currentMessages: Message[] = messages.filter(m => m.type !== "loading")

      // Add bot message with friendly response
      if (response.friendlyResponse) {
        const botMessage: Message = {
          id: generateMessageId(),
          type: "bot",
          content: response.friendlyResponse,
        }
        currentMessages = [...currentMessages, botMessage]
      }

      // Handle residences/matches
      if (response.residences && response.residences.length > 0) {
        setHasReceivedMatches(true)
        
        const transformedMatches = response.residences
          .filter(residence => residence.status !== "DELETED")
          .map((residence, index) => ({
            id: residence.id,
            name: residence.name,
            location: residence.address,
            image: getImageUrl(residence.featuredImageId),
            matchRate: Math.max(75, 95 - (index * 5)),
            subtitle: residence.subtitle,
            budgetRange: residence.budgetStartRange && residence.budgetEndRange 
              ? `${residence.budgetStartRange}M - ${residence.budgetEndRange}M`
              : 'Price on request',
            characteristics: residence,
          }))
          .filter((match, index, self) => 
            index === self.findIndex(m => m.id === match.id)
          )

        if (onMatchesReceived && transformedMatches.length > 0) {
          onMatchesReceived(transformedMatches)
        }

        const matchesMessage: Message = {
          id: generateMessageId(),
          type: "bot",
          content: `I found ${transformedMatches.length} ${transformedMatches.length === 1 ? 'property' : 'properties'} that match your criteria. Check them out in the "My Best Matches" panel on the right! 🏡`,
        }
        currentMessages = [...currentMessages, matchesMessage]

        // Add priority options after matches for custom input scenario
        const priorityBotMessage: Message = {
          id: generateMessageId(),
          type: "bot",
          content: "Would you like to explore more options? Choose what's most important to you:",
        }
        const priorityOptionsMessage: Message = {
          id: generateMessageId(),
          type: "options",
          content: "",
          options: CONVERSATION_FLOWS.priority.options,
          multiSelect: false,
          field: "priority",
        }
        currentMessages = [...currentMessages, priorityBotMessage, priorityOptionsMessage]

        // Also add follow-up options
        const followUpBotMessage: Message = {
          id: generateMessageId(),
          type: "bot",
          content: "Or you can:",
        }
        const followUpOptionsMessage: Message = {
          id: generateMessageId(),
          type: "options",
          content: "",
          options: CONVERSATION_FLOWS.followUp.options,
          multiSelect: false,
          field: "followUp",
        }
        currentMessages = [...currentMessages, followUpBotMessage, followUpOptionsMessage]
        
        setMessages(currentMessages)
        setConversationStage("followUp")
        setIsInitialFlow(false) // Više nismo u inicijalnom toku
      } else if (response.residences && response.residences.length == 0) {
        const noMatchesMessage: Message = {
          id: generateMessageId(),
          type: "bot",
          content: "I couldn't find any properties matching your exact criteria. Let me help you expand your search.",
        }
        const refineOptionsMessage: Message = {
          id: generateMessageId(),
          type: "options",
          content: "",
          options: [
            "Show me all available properties",
            "Adjust my budget range",
            "Look in different locations",
            "Change my requirements",
          ],
          multiSelect: false,
          field: "followUp",
        }
        currentMessages = [...currentMessages, noMatchesMessage, refineOptionsMessage]
        setMessages(currentMessages)
        setConversationStage("followUp")
        setIsInitialFlow(false) // Više nismo u inicijalnom toku
      } else {
        // If no matches yet, proceed to the next question in the flow
        proceedToNextQuestion(currentMessages, conversationStage)
      }
    } catch (error) {
      console.error("Error handling AI response:", error)
      const errorMessage: Message = {
        id: generateMessageId(),
        type: "bot",
        content: "I encountered an error processing the results. Please try again.",
      }
      setMessages([...messages, errorMessage])
    }
  }

  // Handle option selection
  const handleOptionSelect = (option: string, message: Message) => {
    if (option === "Start a new search") {
      handleRestart()
      return
    }

    // Handle special case when user clicks on priority options after custom input
    if (message.field === "priority" && !isInitialFlow && hasReceivedMatches) {
      // User is trying to start a new flow after custom input
      // Reset to initial flow state but keep existing selections
      setIsInitialFlow(true)
      setCompletedQuestions([])
      
      let newFlowOrder: string[] = ["priority"]
      switch (option.toLowerCase()) {
        case "location":
          newFlowOrder = ["priority", "location", "budget", "amenities", "brands"]
          break
        case "price":
          newFlowOrder = ["priority", "budget", "location", "amenities", "brands"]
          break
        case "brand":
          newFlowOrder = ["priority", "brands", "location", "budget", "amenities"]
          break
        case "amenities":
          newFlowOrder = ["priority", "amenities", "location", "budget", "brands"]
          break
      }
      setFlowOrder(newFlowOrder)
      
      // Clear existing selections to start fresh
      setUserSelections({})
      setSelectedOptions([])
      
      // Save the priority selection
      setUserSelections({ priority: option })
      if (onSelectionsChange) {
        onSelectionsChange({ priority: option })
      }
      
      // Show the first question based on priority
      const nextStage = newFlowOrder[1]
      const stageConfig = Object.values(CONVERSATION_FLOWS).find(flow => flow.key === nextStage)
      if (stageConfig) {
        let options = getOptionsForStage(nextStage)
        const dynamicOptions = generateSmartSuggestions(nextStage, { priority: option })
        if (dynamicOptions.length > 0) {
          options = dynamicOptions
        }

        const nextBotMessage: Message = {
          id: generateMessageId(),
          type: "bot",
          content: stageConfig.content,
        }
        const nextOptionsMessage: Message = {
          id: generateMessageId(),
          type: "options",
          content: "",
          options,
          multiSelect: stageConfig.multiSelect || false,
          field: nextStage,
        }
        setMessages([...messages, { id: generateMessageId(), type: "user", content: option }, nextBotMessage, nextOptionsMessage])
        setConversationStage(nextStage)
      }
      return
    }

    if (option === "Change my requirements") {
      const amenitiesConfig = CONVERSATION_FLOWS.amenities
      const options = getOptionsForStage("amenities")
      
      const nextBotMessage: Message = {
        id: generateMessageId(),
        type: "bot",
        content: amenitiesConfig.content,
      }
      const nextOptionsMessage: Message = {
        id: generateMessageId(),
        type: "options",
        content: "",
        options,
        multiSelect: amenitiesConfig.multiSelect || false,
        field: "amenities",
      }
      setMessages([...messages, { 
        id: generateMessageId(), 
        type: "user" as MessageType, 
        content: option 
      }, nextBotMessage, nextOptionsMessage])
      setConversationStage("amenities")
      // Remove amenities from completed questions to enable selection
      setCompletedQuestions(prev => prev.filter(q => q !== "amenities"))
      return
    }

    if (option === "Look in different locations") {
      const locationConfig = CONVERSATION_FLOWS.location
      const nextBotMessage: Message = {
        id: generateMessageId(),
        type: "bot",
        content: locationConfig.content,
      }
      const nextOptionsMessage: Message = {
        id: generateMessageId(),
        type: "options",
        content: "",
        options: locationConfig.options,
        multiSelect: locationConfig.multiSelect || false,
        field: "location",
      }
      setMessages([...messages, { 
        id: generateMessageId(), 
        type: "user" as MessageType, 
        content: option 
      }, nextBotMessage, nextOptionsMessage])
      setConversationStage("location")
      // Remove location from completed questions to enable selection
      setCompletedQuestions(prev => prev.filter(q => q !== "location"))
      return
    }

    if (option === "Adjust my budget range") {
      const budgetConfig = CONVERSATION_FLOWS.budget
      const nextBotMessage: Message = {
        id: generateMessageId(),
        type: "bot",
        content: budgetConfig.content,
      }
      const nextOptionsMessage: Message = {
        id: generateMessageId(),
        type: "options",
        content: "",
        options: budgetConfig.options,
        multiSelect: budgetConfig.multiSelect || false,
        field: "budget",
      }
      setMessages([...messages, { 
        id: generateMessageId(), 
        type: "user" as MessageType, 
        content: option 
      }, nextBotMessage, nextOptionsMessage])
      setConversationStage("budget")
      // Remove budget from completed questions to enable selection
      setCompletedQuestions(prev => prev.filter(q => q !== "budget"))
      return
    }

    if (message.multiSelect) {
      setTempSelections(prev => 
        prev.includes(option) 
          ? prev.filter(opt => opt !== option) 
          : [...prev, option]
      )
    } else {
      setSelectedOptions(prev => [...prev, option])
      setUserSelections(prev => ({
        ...prev,
        [message.field || conversationStage]: option,
      }))
      if (onSelectionsChange) {
        onSelectionsChange({
          ...userSelections,
          [message.field || conversationStage]: option,
        })
      }

      // Mark the current question as completed if field exists
      if (message.field) {
        setCompletedQuestions(prev => [...prev, message.field as string])
      }

      // If this is the priority stage, set the dynamic flow order and immediately set the next stage
      if (conversationStage === "priority") {
        let newFlowOrder: string[] = ["priority"]
        switch (option.toLowerCase()) {
          case "location":
            newFlowOrder = ["priority", "location", "budget", "amenities", "brands"]
            break
          case "price":
            newFlowOrder = ["priority", "budget", "location", "amenities", "brands"]
            break
          case "brand":
            newFlowOrder = ["priority", "brands", "location", "budget", "amenities"]
            break
          case "amenities":
            newFlowOrder = ["priority", "amenities", "location", "budget", "brands"]
            break
          default:
            newFlowOrder = ["priority", "location", "budget", "amenities", "brands"]
        }
        setFlowOrder(newFlowOrder)
        
        // Show the next question immediately
        const nextStage = newFlowOrder[1] // Get the first question after priority
        const stageConfig = Object.values(CONVERSATION_FLOWS).find(flow => flow.key === nextStage)
        if (stageConfig) {
          let options = getOptionsForStage(nextStage)
          const dynamicOptions = generateSmartSuggestions(nextStage, { ...userSelections, [message.field || conversationStage]: option })
          if (dynamicOptions.length > 0) {
            options = dynamicOptions
          }
          const nextBotMessage: Message = {
            id: generateMessageId(),
            type: "bot",
            content: stageConfig.content,
          }
          const nextOptionsMessage: Message = {
            id: generateMessageId(),
            type: "options",
            content: "",
            options,
            multiSelect: stageConfig.multiSelect || false,
            field: nextStage,
          }
          setMessages([...messages, { id: generateMessageId(), type: "user", content: option }, nextBotMessage, nextOptionsMessage])
          setConversationStage(nextStage)
        }
      } else {
        // For non-priority stages, proceed to the next question after saving the selection
        const updatedMessages = [...messages, { 
          id: generateMessageId(), 
          type: "user" as MessageType, 
          content: option 
        }]

        // Get the next stage in the flow
        const currentIndex = flowOrder.indexOf(conversationStage)
        if (isInitialFlow && currentIndex < flowOrder.length - 1) {
          // If we're in initial flow and there are more questions, show the next one
          const nextStage = flowOrder[currentIndex + 1]
          const stageConfig = Object.values(CONVERSATION_FLOWS).find(flow => flow.key === nextStage)
          if (stageConfig) {
            let options = getOptionsForStage(nextStage)
            const dynamicOptions = generateSmartSuggestions(nextStage, userSelections)
            if (dynamicOptions.length > 0) {
              options = dynamicOptions
            }
            const nextBotMessage: Message = {
              id: generateMessageId(),
              type: "bot",
              content: stageConfig.content,
            }
            const nextOptionsMessage: Message = {
              id: generateMessageId(),
              type: "options",
              content: "",
              options,
              multiSelect: stageConfig.multiSelect || false,
              field: nextStage,
            }
            setMessages([...updatedMessages, nextBotMessage, nextOptionsMessage])
            setConversationStage(nextStage)
          }
        } else if (!isInitialFlow) {
          // If not in initial flow, send the request immediately
          const loadingMessage: Message = {
            id: generateMessageId(),
            type: "loading",
            content: "Finding the best matches for you...",
          }
          setMessages([...updatedMessages, loadingMessage])

          try {
            const query = Object.entries(userSelections)
              .map(([key, value]) => {
                if (Array.isArray(value)) {
                  return `${key}: ${value.join(", ")}`
                }
                return `${key}: ${value}`
              })
              .join("; ")

            sendMessage(query).then(handleAIResponse)
          } catch (error) {
            console.error("Failed to send message:", error)
            setMessages(prev => prev.filter(m => m.type !== "loading"))
            const errorMessage: Message = {
              id: generateMessageId(),
              type: "bot",
              content: "Sorry, I couldn't process that request. Please try again or rephrase your question.",
            }
            const retryOptionsMessage: Message = {
              id: generateMessageId(),
              type: "options",
              content: "",
              options: ["Try again", "Start over", "Contact support"],
              multiSelect: false,
            }
            setMessages(prev => prev.concat([errorMessage, retryOptionsMessage]))
          }
        }
      }
    }
  }

  // Handle multi-select submission
  const handleMultiSelectSubmit = (message: Message) => {
    if (tempSelections.length == 0) return

    const selectionString = tempSelections.join(", ")
    setSelectedOptions(prev => [...prev, selectionString])
    setUserSelections(prev => ({
      ...prev,
      [message.field || conversationStage]: tempSelections,
    }))
    if (onSelectionsChange) {
      onSelectionsChange({
        ...userSelections,
        [message.field || conversationStage]: tempSelections,
      })
    }

    // Mark the current question as completed if field exists
    if (message.field) {
      setCompletedQuestions(prev => [...prev, message.field as string])
    }

    // If we're not in initial flow and came from follow-up options, send the request immediately
    if (!isInitialFlow && (conversationStage === "amenities" || conversationStage === "location" || conversationStage === "budget")) {
      const updatedMessages = [...messages, { 
        id: generateMessageId(), 
        type: "user" as MessageType, 
        content: selectionString 
      }]
      setMessages(updatedMessages)

      // Show loading message and send the request
      const loadingMessage: Message = {
        id: generateMessageId(),
        type: "loading",
        content: "Finding the best matches for you...",
      }
      setMessages([...updatedMessages, loadingMessage])

      try {
        // Construct query with all selections
        const query = Object.entries(userSelections)
          .map(([key, value]) => {
            if (key === conversationStage) {
              return `${key}: ${tempSelections.join(", ")}`
            }
            if (Array.isArray(value)) {
              return `${key}: ${value.join(", ")}`
            }
            return `${key}: ${value}`
          })
          .join("; ")

        sendMessage(query).then(handleAIResponse)
      } catch (error) {
        console.error("Failed to send message:", error)
        setMessages(prev => prev.filter(m => m.type !== "loading"))
        const errorMessage: Message = {
          id: generateMessageId(),
          type: "bot",
          content: "Sorry, I couldn't process that request. Please try again or rephrase your question.",
        }
        const retryOptionsMessage: Message = {
          id: generateMessageId(),
          type: "options",
          content: "",
          options: ["Try again", "Start over", "Contact support"],
          multiSelect: false,
        }
        setMessages(prev => prev.concat([errorMessage, retryOptionsMessage]))
      }
      setTempSelections([])
      return
    }

    // Check if this is the last question in the initial flow
    const currentIndex = flowOrder.indexOf(conversationStage)
    if (isInitialFlow && currentIndex === flowOrder.length - 1) {
      // This is the last question, so send the request
      const updatedMessages = [...messages, { 
        id: generateMessageId(), 
        type: "user" as MessageType, 
        content: selectionString 
      }]
      setMessages(updatedMessages)

      // Show loading message and send the request
      const loadingMessage: Message = {
        id: generateMessageId(),
        type: "loading",
        content: "Finding the best matches for you...",
      }
      setMessages([...updatedMessages, loadingMessage])

      try {
        const query = Object.entries({ ...userSelections, [message.field || conversationStage]: tempSelections })
          .map(([key, value]) => {
            if (Array.isArray(value)) {
              return `${key}: ${value.join(", ")}`
            }
            return `${key}: ${value}`
          })
          .join("; ")

        sendMessage(query).then(handleAIResponse)
      } catch (error) {
        console.error("Failed to send message:", error)
        setMessages(prev => prev.filter(m => m.type !== "loading"))
        const errorMessage: Message = {
          id: generateMessageId(),
          type: "bot",
          content: "Sorry, I couldn't process that request. Please try again or rephrase your question.",
        }
        const retryOptionsMessage: Message = {
          id: generateMessageId(),
          type: "options",
          content: "",
          options: ["Try again", "Start over", "Contact support"],
          multiSelect: false,
        }
        setMessages(prev => prev.concat([errorMessage, retryOptionsMessage]))
      }
    } else if (isInitialFlow) {
      // Not the last question, proceed to the next one
      const updatedMessages = [...messages, { 
        id: generateMessageId(), 
        type: "user" as MessageType, 
        content: selectionString 
      }]
      proceedToNextQuestion(updatedMessages, conversationStage)
    }
    setTempSelections([])
  }

  // Send user message to backend
  const sendUserMessage = async (content: string) => {
    const userMessage: Message = {
      id: generateMessageId(),
      type: "user",
      content,
    }
    setMessages(prev => prev.concat(userMessage))

    if (content == "Start a new search") {
      setSelectedOptions([])
      await handleRestart()
      return
    }

    const loadingMessage: Message = {
      id: generateMessageId(),
      type: "loading",
      content: "Finding the best matches for you...",
    }
    setMessages(prev => prev.concat(loadingMessage))

    try {
      const response = await sendMessage(content)
      handleAIResponse(response)
    } catch (error) {
      console.error("Failed to send message:", error)
      setMessages(prev => prev.filter(m => m.type !== "loading"))
      const errorMessage: Message = {
        id: generateMessageId(),
        type: "bot",
        content: "Sorry, I couldn't process that request. Please try again or rephrase your question.",
      }
      const retryOptionsMessage: Message = {
        id: generateMessageId(),
        type: "options",
        content: "",
        options: ["Try again", "Start over", "Contact support"],
        multiSelect: false,
      }
      setMessages(prev => prev.concat([errorMessage, retryOptionsMessage]))
    }
  }

  // Handle user input submission (custom message)
  const handleSubmit = () => {
    if (!userInput.trim() || isMessageLoading) return
    const input = userInput.trim()
    
    // Add custom message to selections first
    setUserSelections(prev => ({
      ...prev,
      custom: input, // Store the raw input without "custom: ..." prefix
    }))
    
    // Notify onSelectionsChange with the updated selections
    if (onSelectionsChange) {
      onSelectionsChange({
        ...userSelections,
        custom: input,
      })
    }

    // Construct query with all selections so far, including the custom message
    const query: string = Object.entries({ ...userSelections, custom: input }) // Include the updated custom field
      .filter(([key]) => key !== "custom") // Exclude the custom field from the entries
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}: ${value.join(", ")}`
        }
        return `${key}: ${value}`
      })
      .join("; ") + (input ? `; ${input}` : "")

    // Show the custom message in the chat as a user message
    const userMessage: Message = {
      id: generateMessageId(),
      type: "user",
      content: input,
    }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)

    // Show loading message and send the request
    const loadingMessage: Message = {
      id: generateMessageId(),
      type: "loading",
      content: "Finding the best matches for you...",
    }
    setMessages([...updatedMessages, loadingMessage])

    try {
      sendMessage(query).then(handleAIResponse)
    } catch (error) {
      console.error("Failed to send message:", error)
      setMessages(prev => prev.filter(m => m.type !== "loading"))
      const errorMessage: Message = {
        id: generateMessageId(),
        type: "bot",
        content: "Sorry, I couldn't process that request. Please try again or rephrase your question.",
      }
      const retryOptionsMessage: Message = {
        id: generateMessageId(),
        type: "options",
        content: "",
        options: ["Try again", "Start over", "Contact support"],
        multiSelect: false,
      }
      setMessages(prev => prev.concat([errorMessage, retryOptionsMessage]))
    }

    setUserInput("")
  }

  // Handle restart
  const handleRestart = async () => {
    setMessages([])
    setSelectedOptions([])
    setHasReceivedMatches(false)
    setUserInput("")
    setMessageIdCounter(0)
    setConversationStage("priority")
    setUserSelections({})
    setTempSelections([])
    setFlowOrder(["priority"])
    setCompletedQuestions([])
    setIsInitialFlow(true) // Resetujemo na inicijalni tok
    if (onMatchesReceived) {
      onMatchesReceived([])
    }
    if (onSelectionsChange) {
      onSelectionsChange({})
    }
    await resetSession()
    initializeChat()
  }

  return (
    <div className="h-[75svh] lg:h-[80svh] flex flex-col">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 pb-4">
        <div className="flex items-start space-x-4 flex-wrap">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary border rounded-md flex items-center justify-center flex-shrink-0">
            <Image src="/bbr-white-fav.svg" alt="BBR Matchmaker" width={20} height={20}/>
          </div>
          <div className="flex-1">
            <h1 className="text-md lg:text-xl font-medium mb-1">BBR Matchmaker AI</h1>
            <p className="text-muted-foreground text-xs lg:text-sm leading-relaxed">
              Your personal luxury residence advisor
            </p>
          </div>
          <div className="w-full lg:w-auto py-2 border-b lg:border-b-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRestart}
              className="text-[#a3a3a3] hover:text-white"
              disabled={isSessionLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Start over
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Messages - Scrollable Area */}
      <div className="flex-1 overflow-y-auto min-h-0 pb-8">
        <div className="space-y-4">
          {isSessionLoading && messages.length == 0 && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#b3804c]" />
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type == "user" ? "justify-end" : "justify-start"}`}>
              {message.type == "bot" && (
                <div className="flex items-start space-x-3 lg:max-w-[80%]">
                  <div className="w-10 h-10 bg-white/10 border rounded-lg flex items-center justify-center flex-shrink-0">
                    <Image src="/bbr-white-fav.svg" alt="BBR Matchmaker" width={20} height={20} />
                  </div>
                  <div className="bg-[#2a2a2a] px-2 lg:px-3 py-2 lg:py-4 rounded-md">
                    <p className="text-white text-sm font-medium leading-relaxed whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              )}

              {message.type == "user" && (
                <div className="bg-[#b3804c] px-4 py-2 rounded-md max-w-[80%]">
                  <p className="text-white text-sm">{message.content}</p>
                </div>
              )}

              {message.type == "loading" && (
                <div className="flex items-start space-x-3 max-w-[80%]">
                  <div className="w-10 h-10 bg-[#6b5b47] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  </div>
                  <div className="bg-[#2a2a2a] p-4 rounded-2xl">
                    <p className="text-[#a3a3a3] text-sm flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {message.content}
                    </p>
                  </div>
                </div>
              )}

              {message.type == "options" && (
                <div className="flex flex-col space-y-4 max-w-[90%] w-full">
                  <div className="ml-13">
                    <div className="flex flex-wrap gap-2">
                      {message.options?.map((option, optionIdx) => (
                        <div
                          key={`${message.id}-option-${optionIdx}`}
                          className={`cursor-pointer border bg-secondary rounded-md px-4 py-1 text-sm font-medium transition-colors ${
                            message.multiSelect && tempSelections.includes(option)
                              ? "border-primary text-white"
                              : "text-white border hover:bg-white/5"
                          } ${
                            message.field && completedQuestions.includes(message.field) && message.field !== "followUp"
                              ? "pointer-events-none opacity-50"
                              : ""
                          }`}
                          onClick={() =>
                            !(message.field && completedQuestions.includes(message.field) && message.field !== "followUp")
                              ? handleOptionSelect(option, message)
                              : null
                          }
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                    {message.multiSelect && (
                      <div className="mt-2">
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-white rounded-md px-4 py-2 text-sm"
                          onClick={() => handleMultiSelectSubmit(message)}
                          disabled={
                            tempSelections.length == 0 ||
                            isMessageLoading ||
                            Boolean(message.field && completedQuestions.includes(message.field) && message.field !== "followUp")
                          }
                        >
                          Submit
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Sticky Chat Input at Bottom */}
      <div className="sticky bottom-0 left-0 right-0 bg-[#0c1012] pt-4 border-t border-[#333638] mt-4">
        <div className="relative w-full mx-auto">
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message or select an option above..."
            className="bg-[#2a2a2a] border-[#444] text-white placeholder:text-[#888] pr-20 w-full rounded-md py-3 px-4 pe-10 lg:pe-0 text-xs lg:text-sm"
            onKeyDown={(e) => {
              if (e.key == "Enter" && !isMessageLoading) {
                handleSubmit()
              }
            }}
            disabled={isMessageLoading || isSessionLoading}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            <Button 
              size="icon" 
              variant="ghost" 
              className="w-8 h-8 text-[#888] hover:text-white" 
              onClick={handleSubmit}
              disabled={isMessageLoading || isSessionLoading || !userInput.trim()}
            >
              {isMessageLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}