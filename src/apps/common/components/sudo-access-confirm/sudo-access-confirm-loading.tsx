import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function SudoAccessConfirmLoading() {
    return (
        <div className="h-screen max-h-[1000px] flex items-center justify-center">
            <div className="w-full max-w-md space-y-6 p-4">
                {/* Title Skeleton */}
                <div className="flex justify-center">
                    <Skeleton className="h-9 w-48" />
                </div>

                {/* Profile Card Skeleton */}
                <Card className="p-3">
                    <div className="flex items-center gap-3">
                        <Skeleton className="size-10 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                </Card>

                {/* Main Action Card Skeleton */}
                <Card className="p-6 bg-secondary/20">
                    <div className="flex flex-col items-center gap-4">
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </Card>

                {/* Having Problems Card Skeleton */}
                <Card className="p-4">
                    <Skeleton className="h-5 w-32 mb-3" />
                    <Skeleton className="h-4 w-24" />
                </Card>

                {/* Tip Section Skeleton */}
                <div className="flex justify-center">
                    <Skeleton className="h-4 w-48" />
                </div>
            </div>
        </div>
    )
}

