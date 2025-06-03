import ExclusiveDealsClient from "./ExclusiveDealsClient";
import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  data: {
    title: 'Exclusive Deals: Discover Special Offers on Luxury Residences',
    description: 'Explore exclusive deals on luxury residences. Find the best offers and discounts on branded residences with Best Branded Residences.',
    slug: 'exclusive-deals',
    keywords: ['exclusive deals', 'luxury residences', 'branded residences']
  }
})

export default function ExclusiveDealsPage() {
  return <ExclusiveDealsClient />
} 