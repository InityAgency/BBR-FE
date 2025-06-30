import type { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'
import BrandsClient from "./BrandsClent";

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  data: {
    title: 'Top Brands',
    description: 'Discover the world’s leading luxury real estate brands. Explore our curated list of top branded residence brands, their unique offerings, and find your next dream property with Best Branded Residences.',
    slug: 'brands',
    keywords: ['brands', 'luxury residences', 'branded residences']
  }
})

export default function BrandsPage() {
  return <BrandsClient />
}