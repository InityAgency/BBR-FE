import type { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'
import AiMatchMakingToolClient from "./AiMatchMakingToolClient";

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  data: {
    title: 'AI Matchmaking Tool: Find Your Perfect Luxury Residence',
    description: 'AI Matchmaking Tool: Find your perfect luxury residence with our advanced AI-powered tool. Discover the best branded residences tailored to your needs.',
    slug: 'ai-matchmaking-tool',
    keywords: ['ai matchmaking tool', 'luxury residences', 'company info']
  }
})

export default function AiMatchMakingToolPage() {
  return <AiMatchMakingToolClient />
}