import { useGetClassRoutines } from "@/apps/admin/components/class-routine/actions";
import { createQueryString } from "@/utils/create-query-string";
import { dayOrder } from "../../utils/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { sortClassRoutines } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ERoutineType } from "@/types/global.type";

export default function TodayClassRoutinesCard() {

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Today's Classes</CardTitle>
                <CardDescription>Your schedule for today</CardDescription>
            </CardHeader>
            <CardContent>
                <Content />
            </CardContent>
        </Card>
    )
}

const today = Object.entries(dayOrder).filter(day => day[1] === new Date().getDay())[0][0];

function Content() {
    const { data, isLoading } = useGetClassRoutines({
        queryString: createQueryString({
            skipPagination: true,
            dayOfTheWeek: today
        })
    });

    if (isLoading) return <LoadingSkeleton />;

    if (data?.data?.length === 0) return (
        <p className="text-muted-foreground text-sm text-center py-8">😀 Hurray! No classes today!</p>
    )

    return (
        <div className="space-y-5">
            {sortClassRoutines(data?.data ?? []).map((cls) => (
                <div key={cls.id} className="flex items-start justify-between">
                    <div className="space-y-1">
                        {
                            cls.type === ERoutineType.BREAK ? (
                                <>
                                    <p className="font-medium leading-none">Break Time</p>
                                    <p className="text-sm text-muted-foreground">**No Class**</p>
                                </>
                            ) : (
                                <>
                                    <p className="font-medium leading-none">{cls.subject?.subjectName}</p>
                                    <p className="text-sm text-muted-foreground">{cls.teacher?.firstName} {cls.teacher?.lastName}</p>
                                </>
                            )
                        }
                    </div>
                    <Badge>{cls.startTime} - {cls.endTime}</Badge>
                </div>
            ))}
        </div>
    )
}

function LoadingSkeleton() {
    return <div className="space-y-3">
        {
            [...Array(2)].map((_, index) => (
                <Card key={index} className="border-0">
                    <CardHeader className="p-0 flex justify-between items-center flex-row">
                        <Skeleton className="h-5 w-2/5" />
                        <Skeleton className="h-5 w-20" />
                    </CardHeader>
                    <CardContent className="px-0 pt-1">
                        <Skeleton className="h-3 w-32" />
                    </CardContent>
                </Card>
            ))
        }
    </div>
}