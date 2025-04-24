import { useGetClassRoutines } from "@/apps/admin/components/class-routine/actions";
import ContainerLayout from "@/components/page-layouts/container-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EDayOfWeek, ERoutineType } from "@/types/global.type";
import _ from "lodash";
import { dayOrder } from "../utils/utils";
import { cn, sortClassRoutines } from "@/lib/utils";
import { createQueryString } from "@/utils/create-query-string";
import { TClassRoutine } from "@/apps/admin/types/class-routine.type";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

const COLORS = ['#9b87f5', '#0EA5E9', '#F97316', '#EC4899', '#10B981', '#EF4444'] as const;

export default function ClassRoutinePage() {

    return (
        <ContainerLayout
            title="Class Routines"
            description="View your weekly class timetable"
        >
            <ClassRoutineView />
        </ContainerLayout>
    )
}

function ClassRoutineView() {
    const [view, setView] = useState<'day' | 'week'>('day');

    const { data, isLoading } = useGetClassRoutines({
        queryString: createQueryString({
            skipPagination: true
        })
    });

    if (isLoading) return <div>Loading...</div>;

    const groupedSchedule = Object.entries(_.groupBy(data?.data, "dayOfTheWeek")).sort((a, b) => dayOrder[a[0] as EDayOfWeek] - dayOrder[b[0] as EDayOfWeek]);

    return (
        <>
            <div className="flex items-center w-fit">
                <Button
                    variant={view === 'day' ? 'default' : 'outline'}
                    size="sm"
                    className="rounded-r-none"
                    onClick={() => setView('day')}
                >
                    Day
                </Button>
                <Button
                    variant={view === 'week' ? 'default' : 'outline'}
                    size="sm"
                    className="rounded-l-none"
                    onClick={() => setView('week')}
                >
                    Week
                </Button>
            </div>
            {
                view === 'week' ? (
                    <section className="flex flex-wrap gap-4">
                        {
                            groupedSchedule.map(([day, schedules]) => {
                                const isTodayDay = dayOrder[day as EDayOfWeek] === new Date().getDay();

                                return (
                                    <Card key={day} className={cn(isTodayDay && "border-primary")}>
                                        <CardHeader className="capitalize font-semibold text-center">{day}</CardHeader>
                                        <CardContent className="space-y-3">
                                            <RoutineCards classRoutines={schedules} />
                                        </CardContent>
                                    </Card>
                                )
                            })
                        }
                    </section>
                ) : (
                    <DayView classRoutines={data?.data ?? []} />
                )
            }
        </>
    )
}

function RoutineCards({ classRoutines }: { classRoutines: TClassRoutine[] }) {
    const sortedSchedule = useMemo(() => sortClassRoutines(classRoutines ?? []), [classRoutines]);

    return sortedSchedule.map(classRoutine => <SingleRoutineCard key={classRoutine.id} classRoutine={classRoutine} />)
}

function SingleRoutineCard({ classRoutine }: { classRoutine: TClassRoutine }) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];

    return classRoutine.type === ERoutineType.CLASS ? (
        <div
            key={classRoutine.id}
            className="text-sm rounded-md p-2 min-w-[200px]"
            style={{ backgroundColor: `${color}10`, borderLeft: `3px solid ${color}` }}
        >
            <div className="text-base font-medium truncate">{classRoutine.subject?.subjectName}</div>
            <div className="text-muted-foreground mt-1">{classRoutine.startTime} - {classRoutine.endTime}</div>
            <div className="text-muted-foreground truncate">{classRoutine.teacher?.firstName} {classRoutine.teacher?.lastName}</div>
        </div>
    ) : (
        <div
            key={classRoutine.id}
            className="text-sm rounded-md p-2 min-w-[200px] bg-secondary"
        >
            <div className="text-base font-medium truncate">Break Time</div>
            <div className="text-muted-foreground mt-1">{classRoutine.startTime} - {classRoutine.endTime}</div>
        </div>
    )
}

function DayView({ classRoutines }: { classRoutines: TClassRoutine[] }) {
    const todayRoutines = classRoutines.filter(classRoutine => dayOrder[classRoutine.dayOfTheWeek as EDayOfWeek] === new Date().getDay());

    if (todayRoutines.length === 0) return <div className="mt-16 text-muted-foreground text-center">**No class routines available for today.**</div>;

    return (
        <Card className="max-w-[800px]">
            <CardHeader>
                <CardTitle className="text-lg font-medium capitalize">{todayRoutines[0]?.dayOfTheWeek}</CardTitle>
            </CardHeader>
            <CardContent>
                <section className="space-y-4">
                    {
                        todayRoutines.map(classRoutine => <SingleRoutineCard key={classRoutine.id} classRoutine={classRoutine} />)
                    }
                </section>
            </CardContent>
        </Card>
    )
}