import { Skeleton } from "@/components/ui/skeleton";

export function BrandTypeSkeleton() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-6 w-96" />
      </div>
      <Skeleton className="h-12 w-full mb-2" />
      <Skeleton className="h-32 w-full mb-2" />
      <div className="flex justify-end gap-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
} 