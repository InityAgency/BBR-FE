import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'
import MarketingSolutionsClient from './MarketingSolutionClient';


export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  data: {
    title: 'Marketing Solutions',
    description: 'We are a team of experts who are passionate about helping people find the best branded residences. We use a combination of data and expert insights to assess the quality of each residence.',
    slug: 'marketing-solutions',
    keywords: ['marketing solutions', 'luxury residences', 'company info']
  }
})


const MarketingSolutionsPage = () => {
  return <MarketingSolutionsClient />;
};

export default MarketingSolutionsPage;
