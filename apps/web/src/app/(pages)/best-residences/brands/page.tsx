import BrandBestResidencesClient from "./BrandBestResidencesClent";
import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  data: {
    title: 'Rankings of the Best Branded Residences by Brands',
    description: 'Explore rankings of the Best Branded Residences by top brands, featuring luxury properties with premium lifestyles and exclusive real estate worldwide.',
    slug: 'best-residences/brands',
    keywords: ['best residences', 'luxury residences', 'branded residences', 'brands']
  }
})

export default function BrandsPage() {
  return <BrandBestResidencesClient />
}