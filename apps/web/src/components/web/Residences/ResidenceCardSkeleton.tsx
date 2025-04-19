import { Skeleton } from "@/components/ui/skeleton"

export function ResidenceCardSkeleton() {
  return (
    <div className="border p-4 bg-secondary/10 rounded-lg flex justify-between flex-col gap-4 h-full">
      {/* Image area */}
      <div className="h-72 w-full overflow-hidden relative rounded-md border flex items-center justify-center">
        <Skeleton className="h-full w-full absolute bg-secondary" />
      </div>

      {/* Location and status */}
      <div className="mt-2 flex items-center gap-2 w-full justify-between">
        <Skeleton className="h-4 w-24 bg-secondary" />
        <Skeleton className="h-4 w-16 bg-secondary" />
      </div>

      {/* Title */}
      <Skeleton className="h-7 w-3/4 bg-secondary" />

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full bg-secondary" />
        <Skeleton className="h-4 w-full bg-secondary" />
        <Skeleton className="h-4 w-2/3 bg-secondary" />
      </div>
    </div>
  )
}
