export function BrandCardSkeleton() {
    return (
        <div className="animate-pulse flex flex-col gap-4 p-6  rounded-xl shadow-sm">
            <div className="relative w-full aspect-square bg-secondary rounded-lg"></div>
            <div className="flex flex-col items-center gap-2">
                <div className="h-4 bg-secondary rounded w-2/3"></div>
                <div className="h-4 bg-secondary rounded w-1/2"></div>
            </div>
        </div>
    );
} 