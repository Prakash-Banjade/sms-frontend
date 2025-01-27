import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LeaveRequestsLoadingSkeleton() {
    return (
        <Card className="w-full h-fit">
            <CardHeader>
                <CardTitle>
                    <Skeleton className="h-7 w-48" />
                </CardTitle>
                <Skeleton className="h-5 max-w-96 w-[40%] mt-1" />
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="students" className="space-y-4">
                    <TabsList className="w-full grid grid-cols-2">
                        <TabsTrigger value="students" disabled>Students</TabsTrigger>
                        <TabsTrigger value="teachers" disabled>Teachers</TabsTrigger>
                    </TabsList>
                    <TabsContent value="students" className="space-y-4">
                        {[...Array(2)].map((_, index) => (
                            <LeaveRequestItemSkeleton key={`student-${index}`} />
                        ))}
                        <div className="flex justify-between gap-5 items-center text-sm text-muted-foreground">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

function LeaveRequestItemSkeleton() {
    return (
        <div className="flex gap-4 rounded-lg p-4 bg-secondary/20">
            <Skeleton className="size-12 rounded-full" />
            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="size-4" />
                    <Skeleton className="h-4 w-36" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="size-4" />
                    <Skeleton className="h-4 w-48" />
                </div>
            </div>
            <div className="flex gap-1 flex-col">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
            </div>
        </div>
    )
}