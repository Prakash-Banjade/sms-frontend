import { Skeleton } from "@/components/ui/skeleton"
import { useMemo } from "react"

export default function BookSkeleton() {
    // Determine a random height for the skeleton to create visual variety
    const randomHeight = useMemo(() => {
        return Math.floor(Math.random() * (280 - 180) + 180)
    }, [])

    return (
        <div className="flex flex-col overflow-hidden rounded-lg bg-accent/20 shadow-sm">
            <Skeleton
                style={{
                    height: `${randomHeight}px`,
                }}
            />
            <div className="p-4">
                <Skeleton className="mb-2 h-5 w-3/4" />
                <Skeleton className="mb-4 h-3 w-1/2" />
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="mb-4 h-4 w-2/3" />
                <div className="mt-2 flex gap-2">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-20" />
                </div>
            </div>
        </div>
    )
}