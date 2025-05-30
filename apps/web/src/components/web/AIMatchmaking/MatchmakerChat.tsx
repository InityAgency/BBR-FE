"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Mic, Send, AlertCircle, Check } from "lucide-react"

// Define the flow stages
type FlowStage = "start" | "location" | "budget" | "amenities" | "brands" | "lifestyle" | "results"

// Define the message types
type MessageType = "bot" | "user" | "options"

// Define the message structure
interface Message {
  id: string
  type: MessageType
  content: string
  options?: string[]
  multiSelect?: boolean
}

// Fuzzy matching utility
function fuzzyMatch(input: string, options: string[], threshold = 0.6): string[] {
  const inputLower = input.toLowerCase()
  return options.filter((option) => {
    const optionLower = option.toLowerCase()
    // Simple fuzzy matching - check if input is contained in option or vice versa
    const similarity = Math.max(
      optionLower.includes(inputLower) ? inputLower.length / optionLower.length : 0,
      inputLower.includes(optionLower) ? optionLower.length / inputLower.length : 0,
    )
    return similarity >= threshold
  })
}

// Define the user selections
interface UserSelections {
  priority?: string
  location: string[]
  budget: string[]
  amenities: string[]
  brands: string[]
  lifestyle: string[]
}

// Enhanced user selections to include custom inputs
interface EnhancedUserSelections extends UserSelections {
  customInputs: {
    location: string[]
    budget: string[]
    amenities: string[]
    brands: string[]
    lifestyle: string[]
  }
}

// Define valid field types for selection operations
type SelectionField = "location" | "budget" | "amenities" | "brands" | "lifestyle"

interface MatchmakerChatProps {
  onSelectionsChange?: (selections: EnhancedUserSelections) => void
}

export function MatchmakerChat({ onSelectionsChange }: MatchmakerChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentStage, setCurrentStage] = useState<FlowStage>("start")
  const [userInput, setUserInput] = useState("")
  const [messageIdCounter, setMessageIdCounter] = useState(0)
  const [userSelections, setUserSelections] = useState<EnhancedUserSelections>({
    location: [],
    budget: [],
    amenities: [],
    brands: [],
    lifestyle: [],
    customInputs: {
      location: [],
      budget: [],
      amenities: [],
      brands: [],
      lifestyle: [],
    },
  })
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [pendingCustomInput, setPendingCustomInput] = useState<string>("")
  const [currentField, setCurrentField] = useState<SelectionField | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Helper function to generate unique message ID
  const generateMessageId = (): string => {
    const currentCounter = messageIdCounter
    setMessageIdCounter(prev => prev + 1)
    return `message-${Date.now()}-${currentCounter}`
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Notify parent of selection changes
  useEffect(() => {
    if (onSelectionsChange) {
      onSelectionsChange(userSelections)
    }
  }, [userSelections, onSelectionsChange])

  // Initialize or reset the chat
  const initializeChat = () => {
    setMessages([])
    setCurrentStage("start")
    setUserSelections({
      location: [],
      budget: [],
      amenities: [],
      brands: [],
      lifestyle: [],
      customInputs: {
        location: [],
        budget: [],
        amenities: [],
        brands: [],
        lifestyle: [],
      },
    })
    setSelectedOptions([])
    setMessageIdCounter(0)

    // Add initial welcome message
    const initialMessage: Message = {
      id: generateMessageId(),
      type: "bot",
      content:
        "Great, let's begin. I'll ask a few questions to help find the best branded residences for you. Feel free to ask any questions along the way.",
    }

    const optionsMessage: Message = {
      id: generateMessageId(),
      type: "options",
      content: "What is most important to you? (Select one below):",
      options: ["Location", "Price", "Lifestyle", "Brand"],
      multiSelect: false,
    }

    setMessages([initialMessage, optionsMessage])
  }

  // Initialize chat
  useEffect(() => {
    initializeChat()
  }, [])

  // Handle option selection
  const handleOptionSelect = (option: string) => {
    // Handle based on current stage
    switch (currentStage) {
      case "start":
        // Set priority and move to that stage
        setUserSelections((prev) => ({ ...prev, priority: option }))
        addUserMessage(option)

        // Determine next stage based on selection
        let nextStage: FlowStage
        switch (option.toLowerCase()) {
          case "location":
            nextStage = "location"
            break
          case "price":
            nextStage = "budget"
            break
          case "lifestyle":
            nextStage = "lifestyle"
            break
          case "brand":
            nextStage = "brands"
            break
          default:
            nextStage = "location"
        }
        moveToStage(nextStage)
        break

      case "location":
        handleMultiSelect("location", option)
        break

      case "budget":
        handleMultiSelect("budget", option)
        break

      case "amenities":
        handleMultiSelect("amenities", option)
        break

      case "brands":
        handleMultiSelect("brands", option)
        break

      case "lifestyle":
        handleMultiSelect("lifestyle", option)
        break

      case "results":
        // Handle post-results options
        addUserMessage(option)

        if (option === "Refine Search") {
          // Ask which aspect they want to refine
          const refineMessage: Message = {
            id: generateMessageId(),
            type: "bot",
            content: "Which aspect of your search would you like to refine?",
          }

          const refineOptionsMessage: Message = {
            id: generateMessageId(),
            type: "options",
            content: "Select an option to refine:",
            options: ["Location", "Budget", "Amenities", "Brands", "Lifestyle"],
            multiSelect: false,
          }

          setMessages((prev) => [...prev, refineMessage, refineOptionsMessage])
        } else if (option === "Start New Search") {
          // Reset and start over
          const resetMessage: Message = {
            id: generateMessageId(),
            type: "bot",
            content: "Let's start a new search to find your perfect branded residence.",
          }
          setMessages((prev) => [...prev, resetMessage])

          // Reset with slight delay for better UX
          setTimeout(() => {
            initializeChat()
          }, 1000)
        } else if (["Location", "Budget", "Amenities", "Brands", "Lifestyle"].includes(option)) {
          // User selected a specific aspect to refine
          const field = option.toLowerCase() as FlowStage
          const actualField = field === "budget" ? "budget" : field

          // Confirmation message
          const confirmMessage: Message = {
            id: generateMessageId(),
            type: "bot",
            content: `Let's refine your ${option.toLowerCase()} preferences.`,
          }
          setMessages((prev) => [...prev, confirmMessage])

          // Move to that stage
          moveToStage(actualField)
        }
        break
    }
  }

  // Handle multi-select options
  const handleMultiSelect = (field: SelectionField, option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions((prev) => prev.filter((item) => item !== option))
    } else {
      setSelectedOptions((prev) => [...prev, option])
    }
  }

  // Submit selected options and move to next stage
  const handleSubmitOptions = () => {
    if (selectedOptions.length === 0) return

    // Update user selections based on current stage
    setUserSelections((prev) => {
      const updatedSelections = { ...prev }
      switch (currentStage) {
        case "location":
          updatedSelections.location = selectedOptions
          break
        case "budget":
          updatedSelections.budget = selectedOptions
          break
        case "amenities":
          updatedSelections.amenities = selectedOptions
          break
        case "brands":
          updatedSelections.brands = selectedOptions
          break
        case "lifestyle":
          updatedSelections.lifestyle = selectedOptions
          break
      }
      return updatedSelections
    })

    // Add user message with selections
    addUserMessage(selectedOptions.join(", "))

    // Clear selected options
    setSelectedOptions([])

    // Determine next stage
    let nextStage: FlowStage
    switch (currentStage) {
      case "location":
        nextStage = "budget"
        break
      case "budget":
        nextStage = "amenities"
        break
      case "amenities":
        nextStage = "brands"
        break
      case "brands":
        nextStage = "lifestyle"
        break
      case "lifestyle":
        nextStage = "results"
        break
      default:
        nextStage = "results"
    }

    moveToStage(nextStage)
  }

  // Get transition message between stages
  const getTransitionMessage = (currentField: SelectionField, nextStage: FlowStage): string => {
    switch (nextStage) {
      case "budget":
        return "Now, let's talk about your budget range."
      case "amenities":
        return "Great! Next, let's discuss what amenities are important to you."
      case "brands":
        return "Excellent! Do you have any preferred brands for your residence?"
      case "lifestyle":
        return "Almost done! Finally, let's talk about your lifestyle preferences."
      case "results":
        return "Perfect! I'm now finding the best matches based on all your preferences."
      default:
        return "Let's continue to the next question."
    }
  }

  // Handle custom user input that doesn't match predefined options
  const handleCustomInput = (input: string, field: SelectionField) => {
    const predefinedOptions = getPredefinedOptions(field)
    const matchedOptions = fuzzyMatch(input, predefinedOptions, 0.4)

    if (matchedOptions.length > 0) {
      // Show suggestions
      setSuggestions(matchedOptions)
      setPendingCustomInput(input)
      setCurrentField(field)
      setShowSuggestions(true)

      // Add bot message asking for clarification
      const suggestionMessage: Message = {
        id: generateMessageId(),
        type: "bot",
        content: `I found some similar options to "${input}". Did you mean one of these, or would you like to add "${input}" as a custom option?`,
      }
      setMessages((prev) => [...prev, suggestionMessage])
    } else {
      // No matches found, add as custom input
      setUserSelections((prev) => ({
        ...prev,
        customInputs: {
          ...prev.customInputs,
          [field]: [...prev.customInputs[field], input],
        },
      }))

      // Add confirmation message with next steps
      const confirmationMessage: Message = {
        id: generateMessageId(),
        type: "bot",
        content: `Thank you! I've added "${input}" as your custom ${field} preference. This will help us find unique options that match your specific needs.`,
      }
      setMessages((prev) => [...prev, confirmationMessage])

      // Determine next stage
      let nextStage: FlowStage
      switch (field) {
        case "location":
          nextStage = "budget"
          break
        case "budget":
          nextStage = "amenities"
          break
        case "amenities":
          nextStage = "brands"
          break
        case "brands":
          nextStage = "lifestyle"
          break
        case "lifestyle":
          nextStage = "results"
          break
        default:
          nextStage = "results"
      }

      // Add transition message
      const transitionMessage: Message = {
        id: generateMessageId(),
        type: "bot",
        content: getTransitionMessage(field, nextStage),
      }
      setMessages((prev) => [...prev, transitionMessage])

      // Clear suggestions and move to next stage
      setShowSuggestions(false)
      setSuggestions([])
      setPendingCustomInput("")
      setCurrentField(null)

      // Short delay before moving to next stage for better UX
      setTimeout(() => {
        moveToStage(nextStage)
      }, 1000)
    }
  }

  // Get predefined options for a field
  const getPredefinedOptions = (field: SelectionField): string[] => {
    switch (field) {
      case "location":
        return [
          "United States",
          "United Arab Emirates",
          "Spain",
          "Thailand",
          "France",
          "Japan",
          "United Kingdom",
          "Mexico",
        ]
      case "budget":
        return ["Under $1M", "$1M-$5M", "$5M+"]
      case "amenities":
        return ["Pool", "Spa", "Gym", "Concierge", "Beach Access", "Private Chef", "Helipad", "Marina"]
      case "brands":
        return ["Ritz-Carlton", "Aman", "Yoo", "Trump", "Four Seasons", "Bulgari", "Mandarin Oriental", "St. Regis"]
      case "lifestyle":
        return [
          "Adventure",
          "Golf Living",
          "Equestrian",
          "Art and Culture",
          "Culinary Lifestyle",
          "Winery",
          "Urban Living",
          "Beach Lifestyle",
        ]
      default:
        return []
    }
  }

  // Add custom input to user selections
  const addCustomInput = (input: string, field: SelectionField) => {
    setUserSelections((prev) => ({
      ...prev,
      customInputs: {
        ...prev.customInputs,
        [field]: [...prev.customInputs[field], input],
      },
    }))

    // Add confirmation message
    const confirmationMessage: Message = {
      id: generateMessageId(),
      type: "bot",
      content: `Great! I've added "${input}" as a custom ${field} preference. This will help us find unique options that match your specific needs.`,
    }
    setMessages((prev) => [...prev, confirmationMessage])

    // Clear suggestions
    setShowSuggestions(false)
    setSuggestions([])
    setPendingCustomInput("")
    setCurrentField(null)
  }

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    if (currentField) {
      setSelectedOptions((prev) => [...prev, suggestion])
      setShowSuggestions(false)
      setSuggestions([])
      setPendingCustomInput("")
      setCurrentField(null)
    }
  }

  // Handle keeping custom input
  const handleKeepCustomInput = () => {
    if (pendingCustomInput && currentField) {
      setUserSelections((prev) => ({
        ...prev,
        customInputs: {
          ...prev.customInputs,
          [currentField]: [...prev.customInputs[currentField], pendingCustomInput],
        },
      }))

      // Add confirmation message with next steps
      const confirmationMessage: Message = {
        id: generateMessageId(),
        type: "bot",
        content: `Perfect! I've added "${pendingCustomInput}" as your custom ${currentField} preference. This helps us find unique options that match your specific needs.`,
      }
      setMessages((prev) => [...prev, confirmationMessage])

      // Determine next stage
      let nextStage: FlowStage
      switch (currentField) {
        case "location":
          nextStage = "budget"
          break
        case "budget":
          nextStage = "amenities"
          break
        case "amenities":
          nextStage = "brands"
          break
        case "brands":
          nextStage = "lifestyle"
          break
        case "lifestyle":
          nextStage = "results"
          break
        default:
          nextStage = "results"
      }

      // Add transition message
      const transitionMessage: Message = {
        id: generateMessageId(),
        type: "bot",
        content: getTransitionMessage(currentField, nextStage),
      }
      setMessages((prev) => [...prev, transitionMessage])

      // Clear suggestions
      setShowSuggestions(false)
      setSuggestions([])
      setPendingCustomInput("")
      setCurrentField(null)

      // Short delay before moving to next stage for better UX
      setTimeout(() => {
        moveToStage(nextStage)
      }, 1000)
    }
  }

  // Move to a specific stage
  const moveToStage = (stage: FlowStage) => {
    setCurrentStage(stage)

    // Add bot message and options based on stage
    let botMessage: Message
    let optionsMessage: Message | null = null

    switch (stage) {
      case "location":
        botMessage = {
          id: generateMessageId(),
          type: "bot",
          content: "Which country are you interested in?",
        }
        optionsMessage = {
          id: generateMessageId(),
          type: "options",
          content: "",
          options: [
            "United States",
            "United Arab Emirates",
            "Spain",
            "Thailand",
            "France",
            "Japan",
            "United Kingdom",
            "Australia",
          ],
          multiSelect: true,
        }
        break

      case "budget":
        botMessage = {
          id: generateMessageId(),
          type: "bot",
          content: "What's your budget range?",
        }
        optionsMessage = {
          id: generateMessageId(),
          type: "options",
          content: "",
          options: ["Under $1M", "$1M-$5M", "$5M+"],
          multiSelect: true,
        }
        break

      case "amenities":
        botMessage = {
          id: generateMessageId(),
          type: "bot",
          content: "What amenities are important to you?",
        }
        optionsMessage = {
          id: generateMessageId(),
          type: "options",
          content: "",
          options: ["Pool", "Spa", "Gym", "Concierge", "Beach Access", "Private Chef", "Helipad", "Marina"],
          multiSelect: true,
        }
        break

      case "brands":
        botMessage = {
          id: generateMessageId(),
          type: "bot",
          content: "What are your preferred brand options?",
        }
        optionsMessage = {
          id: generateMessageId(),
          type: "options",
          content: "",
          options: [
            "Ritz-Carlton",
            "Aman",
            "Yoo",
            "Trump",
            "Four Seasons",
            "Bulgari",
            "Mandarin Oriental",
            "St. Regis",
          ],
          multiSelect: true,
        }
        break

      case "lifestyle":
        botMessage = {
          id: generateMessageId(),
          type: "bot",
          content: "What are your lifestyle preferences?",
        }
        optionsMessage = {
          id: generateMessageId(),
          type: "options",
          content: "",
          options: [
            "Adventure",
            "Golf Living",
            "Equestrian",
            "Art and Culture",
            "Culinary Lifestyle",
            "Winery",
            "Urban Living",
            "Beach Lifestyle",
          ],
          multiSelect: true,
        }
        break

      case "results":
        // Summarize user selections
        const locationSummary =
          userSelections.location.length > 0
            ? userSelections.location.join(", ")
            : userSelections.customInputs.location.length > 0
              ? userSelections.customInputs.location.join(", ")
              : "Any location"

        const budgetSummary =
          userSelections.budget.length > 0
            ? userSelections.budget.join(", ")
            : userSelections.customInputs.budget.length > 0
              ? userSelections.customInputs.budget.join(", ")
              : "Any budget"

        botMessage = {
          id: generateMessageId(),
          type: "bot",
          content: `Thank you for providing your preferences! Based on your selections (${locationSummary}, ${budgetSummary}), I've found some perfect matches for you. You can view them in the 'My Best Matches' panel on the right.`,
        }

        // Add options to refine or start new
        optionsMessage = {
          id: generateMessageId(),
          type: "options",
          content: "What would you like to do next?",
          options: ["Refine Search", "Start New Search"],
          multiSelect: false,
        }
        break

      default:
        botMessage = {
          id: generateMessageId(),
          type: "bot",
          content: "Let's continue with the next question to find your perfect residence.",
        }
    }

    if (optionsMessage) {
      setMessages((prev) => [...prev, botMessage, optionsMessage])
    } else {
      setMessages((prev) => [...prev, botMessage])
    }
  }

  // Add a user message
  const addUserMessage = (content: string) => {
    const userMessage: Message = {
      id: generateMessageId(),
      type: "user",
      content,
    }
    setMessages((prev) => [...prev, userMessage])
  }

  // Handle questions from the user
  const handleQuestion = (question: string) => {
    let response = ""

    // Check for common questions and provide appropriate responses
    if (question.toLowerCase().includes("how many") && question.toLowerCase().includes("residence")) {
      response = "We have over 500 luxury branded residences in our database across 35 countries."
    } else if (question.toLowerCase().includes("what is") && question.toLowerCase().includes("branded residence")) {
      response =
        "A branded residence is a luxury property development that bears the name of a recognized brand, typically a luxury hotel operator or designer. These properties combine the quality, services and amenities typically found in high-end hotels with the privacy and comfort of a home."
    } else if (
      question.toLowerCase().includes("price") ||
      question.toLowerCase().includes("cost") ||
      question.toLowerCase().includes("budget")
    ) {
      response =
        "Our luxury residences range from under $1M to over $50M depending on location, brand, size, and amenities. We can help you find options that match your specific budget."
    } else if (question.toLowerCase().includes("location") || question.toLowerCase().includes("where")) {
      response =
        "We have luxury branded residences in prime locations worldwide, including the United States, United Arab Emirates, Spain, Thailand, France, Japan, United Kingdom, Mexico, and many more."
    } else if (question.toLowerCase().includes("amenities") || question.toLowerCase().includes("facilities")) {
      response =
        "Our luxury residences offer a wide range of amenities including pools, spas, gyms, concierge services, beach access, private chefs, helipads, marinas, and much more depending on the property."
    } else if (question.toLowerCase().includes("brand") || question.toLowerCase().includes("which brands")) {
      response =
        "We partner with the world's most prestigious brands including Ritz-Carlton, Aman, Four Seasons, Bulgari, Mandarin Oriental, St. Regis, and many others."
    } else if (question.toLowerCase().includes("start over") || question.toLowerCase().includes("restart")) {
      response = "Let's start over with your search for the perfect branded residence."
      // Reset the chat
      initializeChat()
      return
    } else {
      // Generic response for other questions
      response = `That's a great question! To best assist you with "${question.replace(
        "?",
        "",
      )}", let's continue with our matchmaking process to understand your preferences better.`
    }

    // Add bot response
    const botResponse: Message = {
      id: generateMessageId(),
      type: "bot",
      content: response,
    }
    setMessages((prev) => [...prev, botResponse])

    // If we're at the start, remind them to select a priority
    if (currentStage === "start") {
      const reminderMessage: Message = {
        id: generateMessageId(),
        type: "bot",
        content: "Please select what's most important to you so we can begin finding your perfect residence.",
      }
      setMessages((prev) => [...prev, reminderMessage])
    }
  }

  // Handle general inquiries that don't fit the structured flow
  const handleGeneralInquiry = (inquiry: string) => {
    // Extract key topics from the inquiry
    const topics = extractTopics(inquiry)

    // Generate a response based on detected topics
    let response = ""

    if (topics.includes("price") || topics.includes("cost") || topics.includes("expensive")) {
      response = "Our luxury branded residences vary in price depending on location, size, amenities, and brand. "

      if (currentStage === "start") {
        response +=
          "If price is your main concern, I recommend selecting 'Price' as your priority so we can focus on options within your budget range."
      } else {
        response += "I'll make note of your interest in pricing information as we continue."
      }
    } else if (
      topics.includes("location") ||
      topics.includes("area") ||
      topics.includes("country") ||
      topics.includes("city")
    ) {
      response = "Location is indeed a crucial factor when selecting a luxury residence. "

      if (currentStage === "location") {
        response += "Please select from our available locations or enter a specific location you're interested in."
      } else if (currentStage === "start") {
        response += "If location is your main priority, please select 'Location' from the options."
      } else {
        response += "We'll get to location preferences shortly in our matchmaking process."
      }
    } else if (topics.includes("amenities") || topics.includes("features") || topics.includes("facilities")) {
      response = "Our luxury residences offer world-class amenities tailored to discerning residents. "

      if (currentStage === "amenities") {
        response += "Please select from our list of amenities or tell me about specific amenities you're looking for."
      } else {
        response += "We'll discuss amenities in detail as we progress through the matchmaking process."
      }
    } else {
      // Generic response for unrecognized inquiries
      response = `I understand you're interested in "${inquiry}". `

      if (currentStage === "start") {
        response +=
          "To help you find the perfect residence, please select what's most important to you from the options below."
      } else {
        response += "Let's continue with our current question to find your ideal residence."
      }
    }

    // Add bot response
    const botResponse: Message = {
      id: generateMessageId(),
      type: "bot",
      content: response,
    }
    setMessages((prev) => [...prev, botResponse])
  }

  // Extract key topics from user input
  const extractTopics = (input: string): string[] => {
    const topics = []
    const inputLower = input.toLowerCase()

    // Check for key topics
    if (
      inputLower.includes("price") ||
      inputLower.includes("cost") ||
      inputLower.includes("expensive") ||
      inputLower.includes("budget") ||
      inputLower.includes("afford") ||
      inputLower.includes("million")
    ) {
      topics.push("price")
    }

    if (
      inputLower.includes("location") ||
      inputLower.includes("country") ||
      inputLower.includes("city") ||
      inputLower.includes("area") ||
      inputLower.includes("where") ||
      inputLower.includes("place")
    ) {
      topics.push("location")
    }

    if (
      inputLower.includes("amenities") ||
      inputLower.includes("features") ||
      inputLower.includes("facilities") ||
      inputLower.includes("pool") ||
      inputLower.includes("gym") ||
      inputLower.includes("spa")
    ) {
      topics.push("amenities")
    }

    if (
      inputLower.includes("brand") ||
      inputLower.includes("luxury") ||
      inputLower.includes("name") ||
      inputLower.includes("ritz") ||
      inputLower.includes("four seasons")
    ) {
      topics.push("brand")
    }

    if (
      inputLower.includes("lifestyle") ||
      inputLower.includes("living") ||
      inputLower.includes("life") ||
      inputLower.includes("style") ||
      inputLower.includes("activity")
    ) {
      topics.push("lifestyle")
    }

    return topics
  }

  // Handle user input submission
  const handleSubmit = () => {
    if (!userInput.trim()) return

    const input = userInput.trim()
    addUserMessage(input)
    setUserInput("")

    // Check if input is a question
    if (input.endsWith("?")) {
      handleQuestion(input)
      return
    }

    // Handle input based on current stage
    switch (currentStage) {
      case "start":
        // If we're at the start, treat input as priority selection
        const priorities = ["location", "price", "lifestyle", "brand"]
        const matchedPriority = priorities.find((p) => input.toLowerCase().includes(p))

        if (matchedPriority) {
          const formattedPriority =
            matchedPriority === "price" ? "Price" : matchedPriority.charAt(0).toUpperCase() + matchedPriority.slice(1)
          setUserSelections((prev) => ({ ...prev, priority: formattedPriority }))

          // Add bot response
          const botResponse: Message = {
            id: generateMessageId(),
            type: "bot",
            content: `Great! I understand that ${formattedPriority} is your priority.`,
          }
          setMessages((prev) => [...prev, botResponse])

          // Move to appropriate stage
          const nextStage = matchedPriority === "price" ? "budget" : (matchedPriority as FlowStage)
          moveToStage(nextStage)
        } else {
          // Handle as general inquiry
          handleGeneralInquiry(input)
        }
        break

      case "location":
        handleCustomInput(input, "location")
        break

      case "budget":
        handleCustomInput(input, "budget")
        break

      case "amenities":
        handleCustomInput(input, "amenities")
        break

      case "brands":
        handleCustomInput(input, "brands")
        break

      case "lifestyle":
        handleCustomInput(input, "lifestyle")
        break

      case "results":
        // Handle inputs after results are shown
        const botResponse: Message = {
          id: generateMessageId(),
          type: "bot",
          content: `Thank you for your additional input about "${input}". Would you like to refine your search or start a new one?`,
        }
        setMessages((prev) => [...prev, botResponse])

        // Add options to refine or start new
        const optionsMessage: Message = {
          id: generateMessageId(),
          type: "options",
          content: "What would you like to do?",
          options: ["Refine Search", "Start New Search"],
          multiSelect: false,
        }
        setMessages((prev) => [...prev, optionsMessage])
        break

      default:
        // Handle as general inquiry
        handleGeneralInquiry(input)
    }
  }

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 bg-[#b3804c] rounded flex items-center justify-center flex-shrink-0">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <div>
            <h1 className="text-xl font-medium mb-2">Welcome to the BBR Matchmaker 👋</h1>
            <p className="text-[#a3a3a3] text-sm leading-relaxed">
              Let's find the residence that fits your lifestyle, budget, and goals —step by step. What do you want to
              start with?
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages - Scrollable Area */}
      <div className="flex-1 overflow-y-auto pr-4 min-h-0">
        <div className="space-y-6">
          {messages.map((message, idx) => (
            <div key={`${message.id}-${idx}`} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              {message.type === "bot" && (
                <div className="flex items-start space-x-3 max-w-[80%]">
                  <div className="w-10 h-10 bg-[#6b5b47] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                      <path d="M8 11h8v2H8v-2zm0 4h8v2H8v-2z" />
                    </svg>
                  </div>
                  <div className="bg-[#2a2a2a] p-4 rounded-2xl">
                    <p className="text-white text-sm">{message.content}</p>
                  </div>
                </div>
              )}

              {message.type === "user" && (
                <div className="bg-[#b3804c] p-4 rounded-2xl max-w-[80%]">
                  <p className="text-white text-sm">{message.content}</p>
                </div>
              )}

              {message.type === "options" && (
                <div className="flex flex-col space-y-4 max-w-[90%] w-full">
                  {message.content && <p className="text-sm text-[#a3a3a3] ml-13">{message.content}</p>}
                  <div className="ml-13">
                    <div className="flex flex-wrap gap-3 mb-6">
                      {message.options?.map((option) => (
                        <Button
                          key={option}
                          variant="outline"
                          size="lg"
                          className={
                            message.multiSelect && selectedOptions.includes(option)
                              ? "bg-white text-black border-white hover:bg-gray-100 rounded-full px-6 py-3 text-sm font-medium"
                              : "bg-transparent text-white border-gray-600 hover:bg-gray-700 hover:border-gray-500 rounded-full px-6 py-3 text-sm font-medium"
                          }
                          onClick={() => handleOptionSelect(option)}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                    {message.multiSelect && selectedOptions.length > 0 && (
                      <Button
                        className="bg-[#b3804c] hover:bg-[#a0713f] text-white rounded-full px-8 py-3 text-sm font-medium"
                        onClick={handleSubmitOptions}
                      >
                        Submit
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Suggestions UI */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="bg-[#2a2a2a] border border-[#444] rounded-2xl p-4">
              <div className="flex items-start space-x-3 mb-3">
                <AlertCircle className="w-5 h-5 text-[#b3804c] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-white mb-2">Did you mean one of these?</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {suggestions.map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        className="bg-white text-black border-white hover:bg-gray-100 rounded-full"
                        onClick={() => handleSuggestionSelect(suggestion)}
                      >
                        <Check className="w-3 h-3 mr-1" />
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent text-white border-gray-600 hover:bg-gray-700 rounded-full"
                      onClick={handleKeepCustomInput}
                    >
                      Keep "{pendingCustomInput}" as custom option
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Current Selection Display */}
          {(selectedOptions.length > 0 || (currentField && userSelections.customInputs[currentField].length > 0)) && (
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedOptions.map((option) => (
                  <Badge key={option} className="bg-white text-black rounded-full px-3 py-1">
                    {option}
                  </Badge>
                ))}
                {currentField &&
                  userSelections.customInputs[currentField].map((custom) => (
                    <Badge key={custom} className="bg-[#b3804c] text-white rounded-full px-3 py-1">
                      {custom} (custom)
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Sticky Chat Input at Bottom - Fixed */}
      <div className="flex-shrink-0 pt-4 border-t border-[#333638] mt-4">
        <div className="relative max-w-xl mx-auto">
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask AI a question or make a request..."
            className="bg-[#2a2a2a] border-[#444] text-white placeholder:text-[#888] pr-20 w-full rounded-full py-3 px-4"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit()
              }
            }}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            <Button size="icon" variant="ghost" className="w-8 h-8 text-[#888] hover:text-white">
              <Mic className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" className="w-8 h-8 text-[#888] hover:text-white" onClick={handleSubmit}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}