export function BrandTitleSkeleton() {
    return (
        <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-6 lg:py-12 gap-4 xl:gap-8 mb-3 lg:mb-12">
            <div className="page-header flex flex-col gap-6 w-full">
                <div className="animate-pulse">
                    <div className="flex flex-row gap-4 items-center justify-center rounded-xl mx-auto bg-black/10 p-4">
                        <div className="w-[175px] h-[175px] bg-secondary rounded-lg"></div>
                    </div>
                    <div className="h-12 bg-secondary rounded-lg w-1/2 mx-auto mt-6"></div>
                    <div className="h-6 bg-secondary rounded-lg w-3/4 mx-auto mt-4"></div>
                </div>
            </div>
        </div>
    );
} 