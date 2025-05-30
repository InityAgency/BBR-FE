// hooks/useSEO.ts
import { useEffect } from 'react'

interface SEOData {
  title?: string
  description?: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  noindex?: boolean
}

export function useSEO(data: SEOData) {
  useEffect(() => {
    if (data.canonical) {
      const existingCanonical = document.querySelector('link[rel="canonical"]')
      if (existingCanonical) {
        existingCanonical.setAttribute('href', data.canonical)
      } else {
        const canonical = document.createElement('link')
        canonical.rel = 'canonical'
        canonical.href = data.canonical
        document.head.appendChild(canonical)
      }
    }
  }, [data])
}