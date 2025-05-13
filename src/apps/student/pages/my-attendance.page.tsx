import { useGetAttendanceCounts, useGetAttendances } from "@/apps/admin/components/attendances/actions";
import ContainerLayout from "@/components/page-layouts/container-layout";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { createQueryString } from "@/utils/create-query-string";
import { Calendar } from "@/components/ui/calendar"
import { EAttendanceStatus, Role } from "@/types/global.type";
import { useCallback, useState } from "react";
import AttendanceStatusIndicators from "@/apps/admin/components/students-management/single-student/attendance-status-indicators";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSearchParams } from "react-router-dom";
import { getPercentage } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-provider";

export default function MyAttendancePage() {

    return (
        <ContainerLayout
            title="My Attendance"
            description="You monthly and yearly attendance."
        >
            <section className="@container">
                <AttendanceView />
            </section>
        </ContainerLayout>
    )
}

function AttendanceView() {
    const currentDate = new Date();
    const { searchParams, setSearchParams } = useCustomSearchParams()
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const { payload } = useAuth();

    const { data: attendances, isLoading } = useGetAttendances({
        queryString: createQueryString({
            month: searchParams.get('month'),
            year: searchParams.get('year'),
            take: 32,
            self: payload?.role === Role.TEACHER, // if teacher is requesting, this query param needs to be true to get own attendances
        }),
    });

    const getAttendanceStatus = useCallback((date: Date) => {
        const attendance = attendances?.data?.find(a => {
            return new Date(a.date).toDateString() === date.toDateString()
        });

        return {
            status: attendance?.status,
            inTime: attendance?.inTime,
            outTime: attendance?.outTime
        }
    }, [attendances]);

    const handleMonthChange = (val: Date) => { // setting the search params and refetching the data for the new month
        const month = val.getMonth() + 1
        setSearchParams("month", month.toString())
        setSearchParams("year", val.getFullYear().toString())
    }

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="flex gap-10 @4xl:flex-row flex-col">
            <section className="w-fit">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={date => date && setSelectedDate(date)}
                    onMonthChange={handleMonthChange}
                    className="rounded-md border"
                    classNames={{
                        cell: "size-16",
                        day: "size-[60px] rounded-sm",
                        caption_label: "text-xl",
                        day_selected: "border-2 border-primary",
                        head_cell: "text-sm font-normal grow",
                    }}
                    modifiers={{
                        [EAttendanceStatus.PRESENT]: (date) => getAttendanceStatus(date)?.status === EAttendanceStatus.PRESENT,
                        [EAttendanceStatus.ABSENT]: (date) => getAttendanceStatus(date)?.status === EAttendanceStatus.ABSENT,
                        [EAttendanceStatus.LATE]: (date) => getAttendanceStatus(date)?.status === EAttendanceStatus.LATE,
                        [EAttendanceStatus.LEAVE]: (date) => getAttendanceStatus(date)?.status === EAttendanceStatus.LEAVE,
                    }}
                    modifiersStyles={{
                        [EAttendanceStatus.PRESENT]: { backgroundColor: 'hsl(var(--success))', color: 'hsl(var(--success-foreground))' },
                        [EAttendanceStatus.ABSENT]: { backgroundColor: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))' },
                        [EAttendanceStatus.LATE]: { backgroundColor: 'hsl(var(--info))', color: 'hsl(var(--info-foreground))' },
                        [EAttendanceStatus.LEAVE]: { backgroundColor: 'hsl(var(--warning))', color: 'hsl(var(--warning-foreground))' },
                    }}
                    disabled={(date) => date > currentDate || date < new Date(currentDate.getFullYear(), 0, 1)}
                    fromDate={new Date(currentDate.getFullYear(), 0, 1)}
                    toDate={currentDate}
                />

                <div className="mt-4 text-center">
                    <AttendanceStatusIndicators />
                    {selectedDate && (
                        <p className="font-semibold mt-2">
                            Status on {selectedDate.toDateString()}: {' '}
                            <span className='capitalize'>{getAttendanceStatus(selectedDate)?.status || 'No data'}</span>
                        </p>

                    )}
                </div>
            </section>

            <MonthlyAndYearlyAttendance />
        </div>
    )
}

function MonthlyAndYearlyAttendance() {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetAttendanceCounts({
        queryString: createQueryString({
            month: searchParams.get('month'),
            year: searchParams.get('year'),
        })
    });

    if (isLoading) return <div>Loading...</div>;

    if (!data) return null;

    return (
        <section className="grow space-y-8">
            <section>
                <h3 className="text-lg font-semibold mb-4">Monthly Statistics</h3>

                <div className="flex gap-6 flex-wrap">
                    {
                        Object.values(EAttendanceStatus).map((status) => (
                            <Card key={status} style={{ flex: "1 1 150px" }}>
                                <CardHeader className="py-4"><h4 className="text-muted-foreground capitalize">{status}</h4></CardHeader>
                                <CardContent className="py-4 pt-0 flex justify-between gap-4 items-end">
                                    <p className="font-semibold text-2xl">{data.monthly?.[status]}</p>
                                    <p className="text-muted-foreground font-medium">{getPercentage(data.monthly?.[status] ?? 0, data.monthly?.total ?? 0)}%</p>
                                </CardContent>
                            </Card>
                        ))
                    }
                </div>
            </section>

            <section>
                <h3 className="text-lg font-semibold mb-4">Yearly Statistics</h3>

                <div className="flex gap-6 flex-wrap">
                    {
                        Object.values(EAttendanceStatus).map((status) => (
                            <Card key={status} style={{ flex: "1 1 150px" }}>
                                <CardHeader className="py-4"><h4 className="text-muted-foreground capitalize">{status}</h4></CardHeader>
                                <CardContent className="py-4 pt-0 flex justify-between gap-4 items-end">
                                    <p className="font-semibold text-2xl">{data.yearly?.[status]}</p>
                                    <p className="text-muted-foreground font-medium">{getPercentage(data.yearly?.[status] ?? 0, data.yearly?.total ?? 0)}%</p>
                                </CardContent>
                            </Card>
                        ))
                    }
                </div>
            </section>
        </section>
    )
}
