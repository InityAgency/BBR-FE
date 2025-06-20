export interface RankingScore {
  totalScore: number;
  position: number;
  rankingCategory: {
    id: string;
    name: string;
    slug: string;
    title: string;
    description: string;
    featuredImage: any;
  };
} 