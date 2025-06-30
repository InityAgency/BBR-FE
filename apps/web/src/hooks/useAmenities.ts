import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { API_BASE_URL, API_VERSION } from "@/app/constants/api"

interface Amenity {
  id: string
  name: string
  description: string
  icon?: {
    id: string
    originalFileName: string
    mimeType: string
    uploadStatus: string
    size: number
  }
  featuredImage?: {
    id: string
    originalFileName: string
    mimeType: string
    uploadStatus: string
    size: number
  }
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

interface AmenitiesResponse {
  data: Amenity[]
  statusCode: number
  message: string
  pagination: {
    total: number
    totalPages: number
    page: number
    limit: number
  }
  timestamp: string
  path: string
}

export function useAmenities() {
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await api.get<AmenitiesResponse>(`${API_BASE_URL}/api/${API_VERSION}/amenities?limit=20`)
        setAmenities(response.data.data)
      } catch (err) {
        console.error('Failed to fetch amenities:', err)
        setError('Failed to load amenities')
        // Fallback to default amenities if API fails
        setAmenities([
          { id: '1', name: 'Private Pool', description: 'Private swimming pool', createdAt: '', updatedAt: '', deletedAt: null },
          { id: '2', name: 'Spa', description: 'Luxury spa facilities', createdAt: '', updatedAt: '', deletedAt: null },
          { id: '3', name: 'Golf Course', description: 'Private golf course', createdAt: '', updatedAt: '', deletedAt: null },
          { id: '4', name: 'Private Chef', description: 'Personal chef services', createdAt: '', updatedAt: '', deletedAt: null },
          { id: '5', name: 'Helipad', description: 'Private helicopter access', createdAt: '', updatedAt: '', deletedAt: null },
          { id: '6', name: 'Wine Cellar', description: 'Private wine cellar', createdAt: '', updatedAt: '', deletedAt: null },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchAmenities()
  }, [])

  return { amenities, loading, error }
} 