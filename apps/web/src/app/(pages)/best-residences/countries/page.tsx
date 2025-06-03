import CountriesBestResidencesClient from "./CountriesBestResidencesClent";
import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  data: {
    title: 'Rankings of the Best Branded Residences by Countries',
    description: 'Explore the rankings of the Best Branded Residences by country, highlighting top locations for luxury living and exclusive real estate insights for your home.',
    slug: 'best-residences/countries',
    keywords: ['best residences', 'luxury residences', 'branded residences', 'countries']
  }
})

export default function CountriesPage() {
  return <CountriesBestResidencesClient />
}