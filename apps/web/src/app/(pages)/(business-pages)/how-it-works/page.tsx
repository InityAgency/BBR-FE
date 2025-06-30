import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'
import HowItWorksPage from './PageClient'

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  data: {
    title: 'How It Works: Find Luxury Branded Residences with BBR',
    description: 'Find luxury branded residences with BBR. We are a team of experts who are passionate about helping people find the best branded residences. We use a combination of data and expert insights to assess the quality of each residence.',
    slug: 'how-it-works',
    keywords: ['how it works', 'luxury residences', 'company info']
  }
})

export default function HowItWorks() {
  return <HowItWorksPage />
}