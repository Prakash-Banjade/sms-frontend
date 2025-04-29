import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetTaskStatistics } from "./action";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
    taskId: string;
}

export default function TaskSubmissionStatisticsCard({ taskId }: Props) {
    const { data, isLoading } = useGetTaskStatistics({
        id: taskId
    })

    if (isLoading) return <SubmissionStatisticsSkeleton />;

    if (!data) return <div className="p-6 text-muted-foreground text-center">No submissions found</div>;

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Submission Statistics</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <StatItem label="Total Submissions" value={data.totalSubmissions || 0} />
                    <StatItem label="Evaluated" value={data.totalEvaluations || 0} />
                    <StatItem label="Not Evaluated" value={(+data.totalSubmissions - +data.totalEvaluations) || 0} />
                    <StatItem label="Before Deadline" value={data.beforeDeadline || 0} />
                    <StatItem label="Overdue" value={data.afterDeadline || 0} />
                </div>
            </CardContent>
        </Card>
    )
}

function StatItem({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-sm text-muted-foreground text-center">{label}</p>
        </div>
    );
}

function SubmissionStatisticsSkeleton() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Skeleton className="h-6 w-3/4" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="flex flex-col items-center justify-center p-2 bg-muted rounded-lg">
                            <Skeleton className="h-8 w-12 mb-2" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}