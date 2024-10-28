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
import { TEntityWithAttendanceUpdate } from "@/types/attendence.type"
import { EAttendanceStatus } from "@/types/global.type"
import { CalendarX, CheckCircle2, Clock, XCircle } from "lucide-react"

type Props<T> = {
    attendances: T[]
    setAttendances: React.Dispatch<React.SetStateAction<T[]>>
}

const statusConfig: Record<EAttendanceStatus, { icon: any; variant: "success" | "destructive" | "info" | "warning" }> = {
    [EAttendanceStatus.PRESENT]: { icon: CheckCircle2, variant: "success" },
    [EAttendanceStatus.ABSENT]: { icon: XCircle, variant: "destructive" },
    [EAttendanceStatus.LATE]: { icon: Clock, variant: "info" },
    [EAttendanceStatus.LEAVE]: { icon: CalendarX, variant: "warning" },
}

export default function EmployeeAttendanceTable<T extends TEntityWithAttendanceUpdate>({ attendances, setAttendances }: Props<T>) {

    const handleStatusChange = (accountId: string, status: EAttendanceStatus) => {
        const updatedAttendances: T[] = attendances.map(employee => {
            if (employee.account?.id === accountId && employee.attendance) {
                return {
                    ...employee,
                    attendance: {
                        ...employee.attendance,
                        status,
                    }
                }
            } else if (employee.account?.id === accountId && !employee.attendance) {
                return {
                    ...employee,
                    attendance: {
                        status,
                        date: new Date().toISOString(),
                    }
                }
            }
            else {
                return employee;
            }
        })

        setAttendances(updatedAttendances);
    }

    return (
        <div className="rounded-md border mt-5">
            <Table>
                <TableHeader>
                    <TableRow className="bg-tableheader">
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Employee Name</TableHead>
                        <TableHead className="text-right">Attendance</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {attendances.map((employee) => (
                        <TableRow key={employee.id}>
                            <TableCell>{employee.staffId ?? employee.teacherId}</TableCell>
                            <TableCell>{employee.firstName} {employee.lastName}</TableCell>
                            <TableCell>
                                <div className="flex justify-end gap-2">
                                    {Object.values(EAttendanceStatus).map((status) => {
                                        const { icon: Icon, variant } = statusConfig[status as EAttendanceStatus]
                                        return (
                                            <Button
                                                key={status}
                                                variant={
                                                    employee.attendance?.status === status
                                                        ? variant
                                                        : "outline"
                                                }
                                                size="sm"
                                                onClick={() => handleStatusChange(employee.account?.id, status)}
                                                aria-pressed={employee.attendance?.status === status}
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