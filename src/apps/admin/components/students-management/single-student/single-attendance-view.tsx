import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { useGetAttendances } from '../../attendances/actions'
import { EAttendanceStatus } from '@/types/global.type'
import AttendanceStatusIndicators from './attendance-status-indicators'
import MonthlyAttendanceCount from './monthly-attendance-count'
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams'
import { createQueryString } from '@/utils/create-query-string'
import YearlyAttendanceCount from './yearly-attendance-count'

export default function SingleAttendanceView({ accountId }: { accountId: string | undefined }) {
    const currentDate = new Date();
    const { searchParams, setSearchParams } = useCustomSearchParams()
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

    // fetch attendance data
    const { data: attendances, isLoading } = useGetAttendances({
        queryString: createQueryString({
            month: searchParams.get('month'),
            year: searchParams.get('year'),
            take: 32,
            accountId,
        }),
        options: {
            enabled: !!accountId
        }
    })

    const getAttendanceStatus = (date: Date) => {
        const attendance = attendances?.data?.find(a => {
            return new Date(a.date).toDateString() === date.toDateString()
        }
        )
        return attendance ? attendance.status : undefined
    }

    const handleMonthChange = (val: Date) => { // setting the search params and refetching the data for the new month
        const month = val.getMonth() + 1
        setSearchParams("month", month.toString())
        setSearchParams("year", val.getFullYear().toString())
    }

    const handleTabChange = () => { // reset month and year when switching tabs
        setSelectedDate(new Date())
        setSearchParams("month", undefined)
        setSearchParams("year", undefined)
    }

    if (isLoading) return <div>Loading...</div>

    return (
        <Card className="">
            <CardHeader>
                <CardTitle>Attendance</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="daily" className="w-full" onValueChange={handleTabChange}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="daily">Daily</TabsTrigger>
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                        <TabsTrigger value="yearly">Yearly</TabsTrigger>
                    </TabsList>
                    <TabsContent value="daily" className="mt-4">
                        <div className="flex flex-col items-center">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                onMonthChange={handleMonthChange}
                                className="rounded-md border"
                                modifiers={{
                                    [EAttendanceStatus.PRESENT]: (date) => getAttendanceStatus(date) === EAttendanceStatus.PRESENT,
                                    [EAttendanceStatus.ABSENT]: (date) => getAttendanceStatus(date) === EAttendanceStatus.ABSENT,
                                    [EAttendanceStatus.LATE]: (date) => getAttendanceStatus(date) === EAttendanceStatus.LATE,
                                    [EAttendanceStatus.LEAVE]: (date) => getAttendanceStatus(date) === EAttendanceStatus.LEAVE,
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
                                        <span className='capitalize'>{getAttendanceStatus(selectedDate) || 'No data'}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="monthly" className="mt-4">
                        <MonthlyAttendanceCount accountId={accountId} />
                    </TabsContent>
                    <TabsContent value="yearly" className="mt-4">
                        <YearlyAttendanceCount accountId={accountId} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}