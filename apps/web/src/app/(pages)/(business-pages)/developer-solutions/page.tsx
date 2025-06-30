import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'
import DeveloperSolutionsPage from './PageClient'


export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  data: {
    title: 'Developer Solutions: Partner with Best Branded Residences',
    description: 'Partner with Best Branded Residences to access our exclusive developer solutions. We are a team of experts who are passionate about helping people find the best branded residences. We use a combination of data and expert insights to assess the quality of each residence.',
    slug: 'developer-solutions',
    keywords: ['developer solutions', 'luxury residences', 'company info']
  }
})

export default function DeveloperSolutions() {
  return <DeveloperSolutionsPage />
}