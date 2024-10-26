import { useState } from 'react'
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
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString())
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())

    const { data: attendances, isLoading } = useGetAttendances({
        queryString: `?month=${selectedMonth}&year=${selectedYear}`,
    })

    const getAttendanceStatus = (date: Date) => {
        const attendance = attendances?.data?.find(
            a => {
                return new Date(a.date).toDateString() === date.toDateString()
            }
        )
        return attendance ? attendance.status : undefined
    }

    if (isLoading) return <div>Loading...</div>

    return (
        <Card className="">
            <CardHeader>
                <CardTitle>Attendance</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="daily" className="w-full">
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
                            />
                            <div className="mt-4 text-center">
                                <p>Green: Present | Red: Absent</p>
                                {selectedDate && (
                                    <p className="font-semibold mt-2">
                                        Status on {selectedDate.toDateString()}: {' '}
                                        {getAttendanceStatus(selectedDate) || 'No data'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="monthly" className="mt-4">
                        <div className="space-y-4">
                            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockAttendanceData.monthly.map((data, index) => (
                                        <SelectItem key={index} value={index.toString()}>{data.month}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {selectedMonth && (
                                <div>
                                    <h4 className="font-semibold mb-2">{mockAttendanceData.monthly[parseInt(selectedMonth)].month} Attendance</h4>
                                    <p>Present Days: {mockAttendanceData.monthly[parseInt(selectedMonth)].presentDays}</p>
                                    <p>Total Days: {mockAttendanceData.monthly[parseInt(selectedMonth)].totalDays}</p>
                                    <p>Attendance Rate: {((mockAttendanceData.monthly[parseInt(selectedMonth)].presentDays / mockAttendanceData.monthly[parseInt(selectedMonth)].totalDays) * 100).toFixed(2)}%</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="yearly" className="mt-4">
                        <div className="space-y-4">
                            <Select value={selectedYear} onValueChange={setSelectedYear}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockAttendanceData.yearly.map((data) => (
                                        <SelectItem key={data.year} value={data.year.toString()}>{data.year}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {selectedYear && (
                                <div>
                                    <h4 className="font-semibold mb-2">{selectedYear} Attendance</h4>
                                    {mockAttendanceData.yearly.find(d => d.year.toString() === selectedYear) && (
                                        <>
                                            <p>Present Days: {mockAttendanceData.yearly.find(d => d.year.toString() === selectedYear)!.presentDays}</p>
                                            <p>Total Days: {mockAttendanceData.yearly.find(d => d.year.toString() === selectedYear)!.totalDays}</p>
                                            <p>Attendance Rate: {((mockAttendanceData.yearly.find(d => d.year.toString() === selectedYear)!.presentDays / mockAttendanceData.yearly.find(d => d.year.toString() === selectedYear)!.totalDays) * 100).toFixed(2)}%</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}