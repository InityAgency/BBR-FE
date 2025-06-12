import React from 'react';
import Image from 'next/image';

interface RankingCategory {
    id: string;
    name: string;
    slug: string;
    title: string;
    description: string;
    featuredImage: any;
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

interface RankingBadgesProps {
    rankingScores: RankingScore[];
}

// Badge SVG Components
const GoldBadge = ({ position, rankingCategory }: { position: number, rankingCategory: RankingCategory }) => (
    <div className="relative">
        <Image src="/badges/Gold.svg" alt="Gold Badge" width={300} height={300} />
        <div className="absolute  bottom-6 left-1/2 transform -translate-x-1/2 flex items-center justify-center bg-[#B3804C] px-4 py-1 rounded-sm w-full text-center h-[45px]">
            <span className="text-xs font-medium text-white">#{position} {rankingCategory.name}</span>
        </div>
    </div>
);

const SilverBadge = ({ position, rankingCategory }: { position: number, rankingCategory: RankingCategory }) => (
    <div className="relative">
        <Image src="/badges/Silver.svg" alt="Silver Badge" width={300} height={300} />
        <div className="absolute  bottom-6 left-1/2 transform -translate-x-1/2 flex items-center justify-center bg-[#567676] px-4 py-1 rounded-sm w-full text-center h-[45px]">
            <span className="text-xs font-medium text-white">#{position} {rankingCategory.name}</span>
        </div>
    </div>
);

const BronzeBadge = ({ position, rankingCategory }: { position: number, rankingCategory: RankingCategory }) => (
    <div className="relative">
        <Image src="/badges/Bronze.svg" alt="Bronze Badge" width={300} height={300} />
        <div className="absolute  bottom-6 left-1/2 transform -translate-x-1/2 flex items-center justify-center bg-[#94462E] px-4 py-1 rounded-sm w-full text-center h-[45px]">
            <span className="text-xs font-medium text-white">#{position} {rankingCategory.name}</span>
        </div>
    </div>
);

const ClassicBadge = ({ position, rankingCategory }: { position: number, rankingCategory: RankingCategory }) => (
    <div className="relative">
        <Image src="/badges/Clasic.svg" alt="Classic Badge" width={300} height={300} />
        <div className="absolute  bottom-6 left-1/2 transform -translate-x-1/2 flex items-center justify-center bg-[#29343D] px-4 py-1 rounded-sm w-full text-center h-[45px]"> 
            <span className="text-xs font-medium text-white">#{position} {rankingCategory.name}</span>
        </div>
    </div>
);

// Main Badge Component
const RankingBadgeDisplay = ({ rankingScore }: { rankingScore: RankingScore }) => {
    const { position, rankingCategory } = rankingScore;

    const getBadgeComponent = (position: number) => {
        switch (position) {
            case 1:
                return <GoldBadge position={position} rankingCategory={rankingCategory} />;
            case 2:
                return <SilverBadge position={position} rankingCategory={rankingCategory} />;
            case 3:
                return <BronzeBadge position={position} rankingCategory={rankingCategory} />;
            default:
                return <ClassicBadge position={position} rankingCategory={rankingCategory}/>;
        }
    };

    return (
        <div className="flex flex-col items-center gap-3 p-4 rounded-lg">
            <div>
                {getBadgeComponent(position)}
            </div>
        </div>
    );
};

// Main Component
const RankingBadges: React.FC<RankingBadgesProps> = ({ rankingScores }) => {
    if (!rankingScores || rankingScores.length === 0) {
        return null;
    }

    // Filtriranje samo pozicija do 10, zatim sortiranje
    const filteredAndSortedScores = [...rankingScores]
        .filter(score => score.position <= 10)
        .sort((a, b) => a.position - b.position);

    // Ako nema rankinga u top 10, ne prikazuj ništa
    if (filteredAndSortedScores.length === 0) {
        return null;
    }

    return (
        <div className="bg-secondary rounded-lg p-6 min-w-full lg:min-w-full">
            <div className="grid grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-4 xl:gap-8">
                {filteredAndSortedScores.map((rankingScore) => (
                    <RankingBadgeDisplay
                        key={rankingScore.rankingCategory.id}
                        rankingScore={rankingScore}
                    />
                ))}
            </div>
        </div>
    );
};
export default RankingBadges;