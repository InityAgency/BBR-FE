import ContinentsBestResidencesClient from "./ContinentsBestResidencesClent";
import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  data: {
    title: 'Rankings of the Best Branded Residences by Continents',
    description: 'Explore rankings of the Best Branded Residences by top continents, featuring luxury properties with premium lifestyles and exclusive real estate worldwide.',
    slug: 'best-residences/continents',
    keywords: ['best residences', 'luxury residences', 'branded residences', 'continents']
  }
})

export default function ContinentsPage() {
  return <ContinentsBestResidencesClient />
}