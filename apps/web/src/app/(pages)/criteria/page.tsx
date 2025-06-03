import type { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'
import EvaluationCriteriaClient from './EvaluationCriteriaClient'

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  data: {
    title: 'Evaluation Criteria: Discover How We Evaluate and Rank the Finest Residences',
    description: 'Evaluation Criteria: Standards for Luxury Residences by Best Brand Residences. Discover our rigorous process for ranking and recommending top branded residences',
    slug: 'criteria',
    keywords: ['evaluation criteria', 'luxury residences', 'ranking process', 'branded residences']
  }
});

export default function EvaluationCriteriaPage() {
  return <EvaluationCriteriaClient />
}