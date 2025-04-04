import { Skeleton } from "@/components/ui/skeleton";

export function RankingCategorySkeleton() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-32 w-full" />
                </div>
                <Skeleton className="h-10 w-24" />
            </div>
        </div>
    );
} 