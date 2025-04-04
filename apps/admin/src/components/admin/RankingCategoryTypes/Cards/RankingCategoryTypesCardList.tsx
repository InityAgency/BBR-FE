import { RankingCategoryType } from "@/app/types/models/RankingCategoryType";
import { RankingCategoryTypesCard } from "./RankingCategoryTypesCard";

interface RankingCategoryTypesCardListProps {
    rankingCategoryTypes: RankingCategoryType[];
    onDelete: (page: number) => Promise<void>;
    currentPage: number;
}

export function RankingCategoryTypesCardList({ rankingCategoryTypes, onDelete, currentPage }: RankingCategoryTypesCardListProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
            {rankingCategoryTypes.map((rankingCategoryType) => (
                <RankingCategoryTypesCard 
                    key={rankingCategoryType.id}
                    rankingCategoryType={rankingCategoryType}
                    onDelete={onDelete}
                    currentPage={currentPage}
                />
            ))}
        </div>
    )
}