import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ClassDetailsLoadingSkeleton() {
    return (
        <Card className="mb-8 @container">
            <CardHeader className="space-y-2">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
                <div className="grid @4xl:grid-cols-4 @3xl:grid-cols-3 @2xl:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <Skeleton className="h-4 grow" />
                        </div>
                    ))}
                </div>
                <div className="flex items-center space-x-2 mt-4 max-w-96"> 
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-4 grow" />
                </div>
            </CardContent>
        </Card>
    )
}