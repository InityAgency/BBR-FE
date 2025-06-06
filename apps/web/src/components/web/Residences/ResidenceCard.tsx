import Image from "next/image"
import Link from "next/link"
import type { Residence } from "@/types/residence"
import { Card, CardContent } from "@/components/ui/card"
import { FavoriteHeart } from "./FavoriteHeart"

interface ResidenceCardProps {
  residence: Residence
  score?: number
  isFavorite?: boolean
  onFavoriteRemoved?: () => void
}

interface RankingScore {
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

// Komponenta za ranking badge sa dodatnim proverama
const RankingBadge = ({ rankingScore }: { rankingScore: RankingScore }) => {
    const { position, rankingCategory } = rankingScore;

    // Proveravamo da li rankingCategory postoji
    if (!rankingCategory || !rankingCategory.name) {
        return null;
    }

    // Funkcija za dobijanje odgovarajuće ikone na osnovu pozicije
    const getRankingIcon = (position: number) => {
        switch (position) {
            case 1:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 22 18" fill="none">
                        <path d="M1 1L4 13H18L21 1L15 8L11 1L7 8L1 1ZM4 17H18H4Z" fill="url(#paint0_linear_2228_101)" />
                        <path d="M4 17H18M1 1L4 13H18L21 1L15 8L11 1L7 8L1 1Z" stroke="url(#paint1_linear_2228_101)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <defs>
                            <linearGradient id="paint0_linear_2228_101" x1="11" y1="1" x2="11" y2="17" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#F5F3F6" />
                                <stop offset="1" stopColor="#BBA568" />
                            </linearGradient>
                            <linearGradient id="paint1_linear_2228_101" x1="11" y1="1" x2="11" y2="17" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#F5F3F6" />
                                <stop offset="1" stopColor="#BBA568" />
                            </linearGradient>
                        </defs>
                    </svg>
                );
            case 2:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M2 4L5 16H19L22 4L16 11L12 4L8 11L2 4ZM5 20H19H5Z" fill="url(#paint0_linear_335_7485)" />
                        <path d="M5 20H19M2 4L5 16H19L22 4L16 11L12 4L8 11L2 4Z" stroke="url(#paint1_linear_335_7485)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <defs>
                            <linearGradient id="paint0_linear_335_7485" x1="12" y1="4" x2="12" y2="20" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#E2E9E9" />
                                <stop offset="1" stopColor="#C1C2CB" />
                            </linearGradient>
                            <linearGradient id="paint1_linear_335_7485" x1="12" y1="4" x2="12" y2="20" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#E2E9E9" />
                                <stop offset="1" stopColor="#C1C2CB" />
                            </linearGradient>
                        </defs>
                    </svg>
                );
            case 3:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M2 4L5 16H19L22 4L16 11L12 4L8 11L2 4ZM5 20H19H5Z" fill="url(#paint0_linear_335_7580)" />
                        <path d="M5 20H19M2 4L5 16H19L22 4L16 11L12 4L8 11L2 4Z" stroke="url(#paint1_linear_335_7580)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <defs>
                            <linearGradient id="paint0_linear_335_7580" x1="12" y1="4" x2="12" y2="20" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#F8D5C6" />
                                <stop offset="1" stopColor="#C97965" />
                            </linearGradient>
                            <linearGradient id="paint1_linear_335_7580" x1="12" y1="4" x2="12" y2="20" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#F8D5C6" />
                                <stop offset="1" stopColor="#C97965" />
                            </linearGradient>
                        </defs>
                    </svg>
                );
            default:
                return null;
        }
    };

    // Funkcija za dobijanje teksta na osnovu pozicije
    const getRankingText = (position: number, categoryName: string) => {
        const ordinalSuffix = position === 1 ? 'st' : position === 2 ? 'nd' : 'rd';
        return `#${position} ${categoryName}`;
    };

    return (
        <div className="bg-secondary backdrop-blur-sm py-2 px-3 rounded-full w-fit flex gap-1 items-center">
            {getRankingIcon(position)}
            <span className="text-xs font-medium text-white">{getRankingText(position, rankingCategory.name)}</span>
        </div>
    );
};

const formatText = (text: string) => {
  if (!text) return "";
  return text
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export function ResidenceCard({ residence, score, isFavorite = false, onFavoriteRemoved }: ResidenceCardProps) {
  
  // Dodajemo dodatne provere da izbegnemo greške
  const topRankings = residence?.totalScores && Array.isArray(residence.totalScores)
    ? residence.totalScores.filter((score: RankingScore) => {
        // Proveravamo da li score ima sve potrebne properties
        return score && 
               typeof score.position === 'number' && 
               score.position <= 3 && 
               score.rankingCategory && 
               score.rankingCategory.name;
      })
    : [];
  
  return (
    <Link href={`/residences/${residence.slug}`} className="border p-4 bg-secondary/30 rounded-lg group flex justify-between flex-col not-prose gap-4 hover:bg-secondary/50 transition-all h-full hover:-translate-y-2">
        <div className="h-72 w-full overflow-hidden relative rounded-md border flex items-center justify-center">
          {/* Residences badges  */}
          {score !== undefined && (
            <span className="text-md font-medium text-white bg-primary rounded-md px-2 py-1 w-[45px] h-[45px] flex items-center justify-center absolute top-3 right-3">{(score / 10).toFixed(1)}</span>
          )}
          <FavoriteHeart 
            entityId={residence.id} 
            entityType="residences" 
            isFavorite={isFavorite}
            className={score !== undefined ? "top-12" : ""}
            onFavoriteRemoved={onFavoriteRemoved}
          />
          {residence.featuredImage ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/media/${residence.featuredImage.id}/content`}
              alt={residence.name}
              width={1000}
              height={1000}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/media/${residence.brand.logo.id}/content`}
                alt={residence.brand.name}
                width={100}
                height={100}
                className="object-cover w-[30%] h-auto"
              />
            </div>
          )}

          {/* Ranking Badges */}
          {topRankings.length > 0 && (
            <div className="rankings absolute bottom-3 left-3 flex flex-wrap gap-1.5">
              {topRankings.map((rankingScore: RankingScore, index: number) => (
                <RankingBadge
                  key={`${rankingScore?.rankingCategory?.id || 'unknown'}-${rankingScore?.position || index}`}
                  rankingScore={rankingScore}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-3">
          <div className="mt-2 flex items-center gap-2 w-full justify-between">
            {residence.city && residence.country ? (
            <span className="text-xs text-muted-foreground">
              {residence.city.name}, {residence.country.name}
            </span>
            ): ( null )}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-primary uppercase">{formatText(residence.developmentStatus)}</span>
            </div>
          </div>
          
          <h3 className="text-xl text-white font-medium transition-all">{residence.name}</h3>
          
          <p className="text-md text-muted-foreground">
            {residence.description.length > 150 
              ? `${residence.description.substring(0, 80)}...` 
              : residence.description}
          </p>
        </div>
    </Link>
  )
}