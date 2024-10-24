import { useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isAfter } from "date-fns"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { TAttendencesResponse } from "@/types/attendence.type"
import { transformAttendanceData } from "@/utils/transform-attendance"
import { useSearchParams } from "react-router-dom"




type AttendanceStatus = "present" | "absent" | "leave" | "late"

const statusColors: Record<AttendanceStatus, string> = {
    present: "bg-green-500",
    absent: "bg-red-500",
    leave: "bg-yellow-500",
    late: "bg-orange-500",
}

export default function StudentAttendance({ attendanceData }: { attendanceData: TAttendencesResponse }) {
    const [searchParams, setSearchParams] = useSearchParams(); // Get search parameters


    const attData = transformAttendanceData(attendanceData.data)
    const [date, setDate] = useState<Date>(new Date())

    const today = new Date()
    const todayStatus = attData[format(today, "yyyy-MM-dd") as keyof typeof attData] as AttendanceStatus || "absent"
    const monthStart = startOfMonth(date)
    const monthEnd = endOfMonth(date)
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })



    const handlePreviousMonth = () => {
        const newDate = subMonths(date, 1);
        setDate(newDate);
        setSearchParams((prevParams) => {
            prevParams.set('month', format(newDate, "MM"));
            prevParams.set('year', format(newDate, "yyyy"));
            return prevParams;
        });
    };

    const handleNextMonth = () => {
        const newDate = addMonths(date, 1);
        setDate(newDate);
        setSearchParams((prevParams) => {
            prevParams.set('month', format(newDate, "MM"));
            prevParams.set('year', format(newDate, "yyyy"));
            return prevParams;
        });
    };
    // Disable next month if the selected date's month is after the current month
    const isNextMonthDisabled = isAfter(startOfMonth(addMonths(date, 1)), today)
    return (
        <div className="p-4   w-fit  bg-white rounded-xl shadow-md">
            {/* <h2 className="text-2xl font-bold mb-4">Student Attendance</h2> */}

            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Today's Attendance</h3>
                <div className={cn("w-full p-3 rounded-md text-white font-medium", statusColors[todayStatus])}>
                    {todayStatus.charAt(0).toUpperCase() + todayStatus.slice(1)}
                </div>
            </div>

            <div className="mb-6">
                <div className="flex items-center justify-between mb-4 gap-4">
                    <h3 className="text-lg font-semibold">Monthly View</h3>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {format(date, "MMMM yyyy")}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                {/* todo:disble to choose the ufuture date through calendar */}
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(newDate) => {
                                        if (newDate) {
                                            setDate(newDate)
                                            setSearchParams((prevParams) => {
                                                prevParams.set('month', format(newDate, "MM"));
                                                prevParams.set('year', format(newDate, "yyyy"));
                                                return prevParams;
                                            });
                                        }
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <Button variant="outline" size="icon" onClick={handleNextMonth} disabled={isNextMonthDisabled} >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="text-center font-medium text-sm py-1">
                            {day}
                        </div>
                    ))}
                    {monthDays.map((day, index) => {
                        const dateKey = format(day, "yyyy-MM-dd")
                        const status = attData[dateKey as keyof typeof attData] as AttendanceStatus
                        return (
                            <div
                                key={index}
                                className={cn(
                                    "aspect-square flex items-center justify-center text-sm rounded-full",
                                    isSameMonth(day, date) ? "bg-gray-100" : "bg-gray-50 text-gray-400",
                                    isSameDay(day, today) && "text-bold ring-primary",
                                    status && statusColors[status]
                                )}
                            >
                                {format(day, "d")}
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {Object.entries(statusColors).map(([status, color]) => (
                    <div key={status} className="flex items-center">
                        <div className={cn("w-4 h-4 rounded-full mr-1", color)}></div>
                        <span className="text-sm capitalize">{status}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}