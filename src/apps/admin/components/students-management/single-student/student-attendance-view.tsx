import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useGetAttendances } from '../../attendances/action'
import { EAttendanceStatus } from '@/types/global.type'
import AttendanceStatusIndicators from './attendance-status-indicators'
import MonthlyAttendanceCount from './monthly-attendance-count'
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams'
import { createQueryString } from '@/utils/create-query-string'
import YearlyAttendanceCount from './yearly-attendance-count'

// Mock data for demonstration
const mockAttendanceData = {
    daily: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(2024, 9, i + 1),
        status: Math.random() > 0.1 ? EAttendanceStatus.PRESENT : EAttendanceStatus.ABSENT
    })),
    monthly: Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2024, i, 1).toLocaleString('default', { month: 'long' }),
        presentDays: Math.floor(Math.random() * 5) + 20,
        totalDays: Math.floor(Math.random() * 3) + 28
    })),
    yearly: Array.from({ length: 5 }, (_, i) => ({
        year: 2020 + i,
        presentDays: Math.floor(Math.random() * 20) + 180,
        totalDays: 200
    }))
}

export default function StudentAttendanceView() {
    const currentDate = new Date();
    const { searchParams, setSearchParams } = useCustomSearchParams()
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())

    // fetch attendance data
    const { data: attendances, isLoading } = useGetAttendances({
        queryString: createQueryString({
            month: searchParams.get('month'),
            year: searchParams.get('year'),
            take: 32,
        }),
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
        setSelectedYear(val.getFullYear().toString())
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
                                    [EAttendanceStatus.PRESENT]: { backgroundColor: 'hsl(var(--success))', color: 'hsl(var(--destructive-foreground))' },
                                    [EAttendanceStatus.ABSENT]: { backgroundColor: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))' },
                                    [EAttendanceStatus.LATE]: { backgroundColor: 'hsl(var(--info))', color: 'hsl(var(--destructive-foreground))' },
                                    [EAttendanceStatus.LEAVE]: { backgroundColor: 'hsl(var(--warn))', color: 'hsl(var(--destructive-foreground))' },
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
                        <MonthlyAttendanceCount />
                    </TabsContent>
                    <TabsContent value="yearly" className="mt-4">
                        <YearlyAttendanceCount />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}