// hooks/useMatchmaking.ts
import { useState, useEffect, useCallback } from "react"
import { matchmakingApi, MatchmakingSession } from "@/app/api/matchmaking/matchmaking"

export interface AIResponse {
  friendlyResponse: string
  residences: Array<{
    id: string
    name: string
    address: string
    featuredImageId: string
    budgetStartRange: string
    budgetEndRange: string
    subtitle: string
    slug: string
    [key: string]: any
  }>
  relaxed: boolean
  relaxedFields: string[]
}

interface UseMatchmakingReturn {
  sessionId: string | null
  isSessionLoading: boolean
  sessionError: Error | null
  sendMessage: (message: string) => Promise<any>
  isMessageLoading: boolean
  messageError: Error | null
  resetSession: () => Promise<void>
}

export function useMatchmaking(): UseMatchmakingReturn {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isSessionLoading, setIsSessionLoading] = useState(true)
  const [sessionError, setSessionError] = useState<Error | null>(null)
  const [isMessageLoading, setIsMessageLoading] = useState(false)
  const [messageError, setMessageError] = useState<Error | null>(null)

  // Initialize session on mount
  useEffect(() => {
    initializeSession()
  }, [])

  const initializeSession = async () => {
    try {
      setIsSessionLoading(true)
      setSessionError(null)
      
      const session = await matchmakingApi.createSession()
      setSessionId(session.data._id)
    } catch (error) {
      setSessionError(error as Error)
      console.error("Failed to initialize matchmaking session:", error)
    } finally {
      setIsSessionLoading(false)
    }
  }

  const sendMessage = useCallback(async (message: string) => {
    if (!sessionId) {
      throw new Error("No active session")
    }

    try {
      setIsMessageLoading(true)
      setMessageError(null)
      
      const response = await matchmakingApi.sendQuery({
        userMessage: message,
        sessionId: sessionId,
      })
      
      return response.data
    } catch (error) {
      setMessageError(error as Error)
      throw error
    } finally {
      setIsMessageLoading(false)
    }
  }, [sessionId])

  const resetSession = useCallback(async () => {
    await initializeSession()
  }, [])

  return {
    sessionId,
    isSessionLoading,
    sessionError,
    sendMessage,
    isMessageLoading,
    messageError,
    resetSession,
  }
}