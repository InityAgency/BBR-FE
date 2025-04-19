export interface Residence {
    id: string
    name: string
    slug: string
    description: string
    status: string
    developmentStatus: string
    address: string
    country: {
      id: string
      name: string
    }
    city: {
      id: string
      name: string
      asciiName: string
    }
    featuredImage: {
      id: string
      originalFileName: string
      mimeType: string
      uploadStatus: string
      size: number
    } | null
    createdAt: string
    updatedAt: string
    brand: {
      id: string
      name: string
      slug: string
      description: string
      status: string
      createdAt: string
      updatedAt: string
      logo: {
        id: string
        originalFileName: string
        mimeType: string
        uploadStatus: string
        size: number
      }
    }
  }
  
  export interface ResidencesResponse {
    data: Residence[]
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
  