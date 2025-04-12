export function BrandTitleSkeleton() {
    return (
        <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-3rem)] 2xl:max-w-[90svw] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-8 mb-12">
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