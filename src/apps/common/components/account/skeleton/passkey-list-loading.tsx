import { Skeleton } from "@/components/ui/skeleton"

export default function PasskeysListLoading() {
    return (
        <section className="mt-6">
            <div className="flex items-start justify-between p-4 bg-background border rounded-lg rounded-b-none">
                <div className="flex gap-4">
                    <div className="mt-1 text-muted-foreground">
                        <Skeleton className="w-5 h-5" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-44" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <Skeleton className="h-9 w-9 rounded-lg" />
                </div>
            </div>
            <div className="flex items-start justify-between p-4 bg-background border rounded-lg border-t-0 rounded-t-none">
                <div className="flex gap-4">
                    <div className="mt-1 text-muted-foreground">
                        <Skeleton className="w-5 h-5" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-44" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <Skeleton className="h-9 w-9 rounded-lg" />
                </div>
            </div>
        </section>
    )
}

