import LifestyleBestResidencesClient from "./LifestyleBestResidencesClent";
import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  data: {
    title: 'Rankings of the Best Branded Residences by Lifestyle Preferences',
    description: 'Explore the rankings of the Best Branded Residences by lifestyle, featuring bespoke categories ranging from relaxing spa retreats to adventure-filled havens.',
    slug: 'best-residences/lifestyle',
    keywords: ['best residences', 'luxury residences', 'branded residences', 'lifestyle']
  }
})

export default function LifestylePage() {
  return <LifestyleBestResidencesClient />
}