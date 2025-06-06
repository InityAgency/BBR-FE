export interface MatchmakingSession {
  data: {
    userId: string
    status: "active" | "completed" | "expired"
    metadata: {
      userAgent: string
      ip: string
      forwardedFor: string
      referer: string
      host: string
      method: string
      url: string
      headers: Record<string, string>
    }
    _id: string
    startedAt: string
    createdAt: string
    updatedAt: string
    __v: number
  }
  statusCode: number
  message: string
  timestamp: string
  path: string
}

export interface MatchmakingQueryRequest {
  userMessage: string
  sessionId: string
}

export interface Residence {
  id: string
  name: string
  slug: string
  status: string
  developmentStatus: string
  subtitle: string
  description: string
  budgetStartRange: string
  budgetEndRange: string
  address: string
  longitude: number
  latitude: number
  websiteUrl: string
  yearBuilt: string
  floorSqft: string
  staffRatio: number
  avgPricePerUnit: string
  avgPricePerSqft: string
  rentalPotential: string
  petFriendly: boolean
  disabledFriendly: boolean
  videoTourUrl: string | null
  companyId: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  featuredImageId: string
  brandId: string
  countryId: string
  cityId: string
  videoTourId: string | null
  developerId: string | null
}

export interface MatchmakingQueryResponse {
  data: {
    friendlyResponse: string
    residences: Residence[]
    relaxed: boolean
    relaxedFields: string[]
  }
  statusCode: number
  message: string
  timestamp: string
  path: string
}

export const matchmakingApi = {
  // Create a new matchmaking session
  createSession: async (): Promise<MatchmakingSession> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/matchmaking/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any auth headers if needed
        },
        credentials: "include", // For cookies
      })

      if (!response.ok) {
        throw new Error(`Failed to create session: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating matchmaking session:", error)
      throw error
    }
  },

  // Send a query to the matchmaking API
  sendQuery: async (request: MatchmakingQueryRequest): Promise<MatchmakingQueryResponse> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/matchmaking/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`Failed to send query: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error sending matchmaking query:", error)
      throw error
    }
  },
}