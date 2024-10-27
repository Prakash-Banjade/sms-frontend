import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { EAttendanceStatus } from "@/types/global.type"
import { TStudentsWithAttendenceResponse } from "@/types/student.type"
import { CalendarX, CheckCircle2, Clock, XCircle } from "lucide-react"

type Props = {
    attendanceData: TStudentsWithAttendenceResponse
}


const statusConfig: Record<EAttendanceStatus, { icon: any; variant: "success" | "destructive" | "info" | "warning" }> = {
    [EAttendanceStatus.PRESENT]: { icon: CheckCircle2, variant: "success" },
    [EAttendanceStatus.ABSENT]: { icon: XCircle, variant: "destructive" },
    [EAttendanceStatus.LATE]: { icon: Clock, variant: "info" },
    [EAttendanceStatus.LEAVE]: { icon: CalendarX, variant: "warning" },
}

export default function AttendanceTable({ attendanceData }: Props) {

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow className="bg-tableheader">
                        <TableHead className="w-[100px]">Roll No.</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead className="text-right">Attendance</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {attendanceData.map((student) => (
                        <TableRow key={student.id}>
                            <TableCell>{student.rollNo}</TableCell>
                            <TableCell>{student.firstName} {student.lastName}</TableCell>
                            <TableCell>
                                <div className="flex justify-end gap-2">
                                    {Object.values(EAttendanceStatus).map((status) => {
                                        const { icon: Icon, variant } = statusConfig[status as EAttendanceStatus]
                                        return (
                                            <Button
                                                key={status}
                                                variant={
                                                    student.attendance?.status === status
                                                        ? variant
                                                        : "outline"
                                                }
                                                size="sm"
                                                aria-pressed={student.attendance?.status === status}
                                            >
                                                <Icon className={cn("w-4 h-4")} />
                                                <span className="sr-only md:not-sr-only md:inline-block capitalize">
                                                    {status}
                                                </span>
                                            </Button>
                                        )
                                    })}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}