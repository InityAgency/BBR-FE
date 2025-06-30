import LeaveReviewClient from './LeaveReviewClient';
import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  data: {
    title: 'Leave a Review: Share Your Experience with the',
    description: 'Share your experience and help others find their dream luxury home. Leave a review for Best Brand Residences and provide valuable feedback.',
    slug: 'leave-a-review',
    keywords: ['leave a review', 'luxury residences', 'company info']
  }
})


export default function LeaveAReviewPage() {
    return <LeaveReviewClient />
}