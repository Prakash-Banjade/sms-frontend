import { useFetchData } from '@/hooks/useFetchData';
import { QueryKey } from '@/react-query/queryKeys';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from '@/components/ui/skeleton';
import { TeacherTodaySchedule } from '@/apps/admin/types/dashboard.type';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function TodayScheduleCard() {

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle className="justify-between flex items-center">
                    <span>Today's Schedule</span>
                </CardTitle>
                <CardDescription>You schedule for today.</CardDescription>
            </CardHeader>

            <CardContent>
                <Content />
            </CardContent>
        </Card>
    )
}

function Content() {
    const { data, isLoading } = useFetchData<TeacherTodaySchedule[]>({
        endpoint: QueryKey.DASHBOARD + '/teacher/schedule',
        queryKey: [QueryKey.DASHBOARD, 'teacher', 'schedule'],
    })

    if (isLoading) return <LoadingSkeleton />;

    if (data?.length === 0) return (
        <p className="text-muted-foreground text-sm text-center py-8">No schedule today!</p>
    )

    return (
        <section className='space-y-3'>
            {
                data?.map((schedule) => (
                    <div
                        key={schedule.id}
                        className={cn("text-sm rounded-md p-4 min-w-[200px] border shadow-md flex items-start justify-between")}
                    >
                        <section className='flex items-center gap-3'>
                            <div className='bg-secondary rounded-md p-3'>
                                <Clock size={24} />
                            </div>
                            <section>
                                <div className="truncate text-lg font-medium">{schedule.classRoomName}</div>
                                <div className={cn("text-base truncate")}>{schedule.subjectName}</div>
                            </section>
                        </section>
                        <Badge className="text-sm">{schedule.startTime} - {schedule.endTime}</Badge>
                    </div>
                ))

            }

        </section>
    )

}

function LoadingSkeleton() {
    return <div className="space-y-3">
        {
            [...Array(2)].map((_, index) => (
                <Card key={index}>
                    <section className="flex gap-3 px-5 pt-5">
                        <Skeleton className="size-12" />
                        <section className='grow'>
                            <CardHeader className="p-0 flex justify-between items-center flex-row">
                                <Skeleton className="h-5 w-1/6" />
                                <Skeleton className="h-5 w-20" />
                            </CardHeader>
                            <CardContent className="px-0 pt-1">
                                <Skeleton className="h-4 w-32" />
                            </CardContent>
                        </section>
                    </section>
                </Card>
            ))
        }
    </div>
}