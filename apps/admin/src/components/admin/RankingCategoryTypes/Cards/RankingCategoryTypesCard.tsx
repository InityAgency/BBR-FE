import { RankingCategoryType } from "@/app/types/models/RankingCategoryType";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { RankingCategoryTypesActions } from "../Table/RankingCategoryTypesActions";

interface RankingCategoryTypesCardProps {
    rankingCategoryType: RankingCategoryType;
    onDelete: (page: number) => Promise<void>;
    currentPage: number;
}

export function RankingCategoryTypesCard({ rankingCategoryType, onDelete, currentPage }: RankingCategoryTypesCardProps) {
    return (
        <Card className="w-full hover:bg-muted/50 transition-colors">
            <CardContent>
                <div className="flex items-start justify-between mb-2 border-b border-border pb-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                            <a href={`/rankings/ranking-category-types/${rankingCategoryType.id}`} className="hover:underline">
                                {rankingCategoryType.name}
                            </a>
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5"># {rankingCategoryType.id}</p>
                    </div>
                    <RankingCategoryTypesActions row={{ original: rankingCategoryType } as any} onDelete={onDelete} currentPage={currentPage} />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm mt-3">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Created: {new Date(rankingCategoryType.createdAt || "").toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Updated: {new Date(rankingCategoryType.updatedAt || "").toLocaleDateString()}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}