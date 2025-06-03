import CityBestResidencesClient from "./CityBestResidencesClent";
import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  data: {
    title: 'Rankings of the Best Branded Residences by City ',
    description: 'Discover the rankings of top urban luxury homes in the world’s most iconic cities, featuring the Best Branded Residences with exceptional elegance and style.',
    slug: 'best-residences/cities',
    keywords: ['best residences', 'luxury residences', 'branded residences', 'cities']
  }
})  

export default function CitiesPage() {
  return <CityBestResidencesClient />
}   