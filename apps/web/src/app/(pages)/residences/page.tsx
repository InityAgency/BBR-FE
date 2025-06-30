import ResidencesClient from "./ResidencesClient";
import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  data: {
    title: 'Directory of Best Branded Residences ',
    description: 'Discover the world’s leading luxury real estate residences. Explore our curated list of top branded residence residences, their unique offerings, and find your next dream property with Best Branded Residences.',
    slug: 'residences',
    keywords: ['residences', 'luxury residences', 'branded residences']
  }
})

export default function ResidencesPage() {
  return <ResidencesClient />
}