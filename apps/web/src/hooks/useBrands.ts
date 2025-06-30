import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { API_BASE_URL, API_VERSION } from "@/app/constants/api"

interface Brand {
  id: string
  name: string
  description: string
  slug?: string
  status: string
  createdAt: string
  updatedAt: string
  brandType: {
    id: string
    name: string
    description: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  logo: {
    id: string
    originalFileName: string
    mimeType: string
    uploadStatus: string
    size: number
  }
}

interface BrandsResponse {
  data: Brand[]
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

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await api.get<BrandsResponse>(`${API_BASE_URL}/api/${API_VERSION}/public/brands?limit=20`)
        setBrands(response.data.data)
      } catch (err) {
        console.error('Failed to fetch brands:', err)
        setError('Failed to load brands')
        // Fallback to default brands if API fails
        setBrands([
          { 
            id: '1', 
            name: 'Ritz-Carlton', 
            description: 'Luxury hotel brand', 
            status: 'ACTIVE',
            createdAt: '', 
            updatedAt: '',
            brandType: { id: '1', name: 'Luxury Hotel', description: '', createdAt: '', updatedAt: '', deletedAt: null },
            logo: { id: '1', originalFileName: '', mimeType: '', uploadStatus: '', size: 0 }
          },
          { 
            id: '2', 
            name: 'Aman', 
            description: 'Ultra-luxury resorts', 
            status: 'ACTIVE',
            createdAt: '', 
            updatedAt: '',
            brandType: { id: '1', name: 'Luxury Hotel', description: '', createdAt: '', updatedAt: '', deletedAt: null },
            logo: { id: '2', originalFileName: '', mimeType: '', uploadStatus: '', size: 0 }
          },
          { 
            id: '3', 
            name: 'Yoo', 
            description: 'Design-led residences', 
            status: 'ACTIVE',
            createdAt: '', 
            updatedAt: '',
            brandType: { id: '2', name: 'Lifestyle', description: '', createdAt: '', updatedAt: '', deletedAt: null },
            logo: { id: '3', originalFileName: '', mimeType: '', uploadStatus: '', size: 0 }
          },
          { 
            id: '4', 
            name: 'Trump', 
            description: 'Premium real estate', 
            status: 'ACTIVE',
            createdAt: '', 
            updatedAt: '',
            brandType: { id: '3', name: 'Real Estate', description: '', createdAt: '', updatedAt: '', deletedAt: null },
            logo: { id: '4', originalFileName: '', mimeType: '', uploadStatus: '', size: 0 }
          },
          { 
            id: '5', 
            name: 'Four Seasons', 
            description: 'Luxury hospitality', 
            status: 'ACTIVE',
            createdAt: '', 
            updatedAt: '',
            brandType: { id: '1', name: 'Luxury Hotel', description: '', createdAt: '', updatedAt: '', deletedAt: null },
            logo: { id: '5', originalFileName: '', mimeType: '', uploadStatus: '', size: 0 }
          },
          { 
            id: '6', 
            name: 'Mandarin Oriental', 
            description: 'Asian luxury hospitality', 
            status: 'ACTIVE',
            createdAt: '', 
            updatedAt: '',
            brandType: { id: '1', name: 'Luxury Hotel', description: '', createdAt: '', updatedAt: '', deletedAt: null },
            logo: { id: '6', originalFileName: '', mimeType: '', uploadStatus: '', size: 0 }
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [])

  return { brands, loading, error }
} 