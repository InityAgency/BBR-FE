import BestResidencesClient from "./BestResidencesClient";
import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  data: {
    title: 'Best Residences: Explore Top Luxury Real Estate Residences',
    description: 'Discover the world’s leading luxury real estate residences. Explore our curated list of top branded residence residences, their unique offerings, and find your next dream property with Best Branded Residences.',
    slug: 'best-residences',
    keywords: ['best residences', 'luxury residences', 'branded residences']
  }
})

export default function BestResidencesPage() {
  return <BestResidencesClient />
}