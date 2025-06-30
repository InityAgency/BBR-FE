
import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'
import WhyChooseUsPage from './PageClent'

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  data: {
    title: 'Why Choose Best Branded Residences: Luxury Real Estate',
    description: 'Elevate your luxury real estate brand with our marketing solutions. We are a team of experts who are passionate about helping people find the best branded residences. We use a combination of data and expert insights to assess the quality of each residence.',
    slug: 'why-choose-us',
    keywords: ['why choose us', 'luxury residences', 'company info']
  }
})

export default function WhyChooseUs() {
  return <WhyChooseUsPage />
}