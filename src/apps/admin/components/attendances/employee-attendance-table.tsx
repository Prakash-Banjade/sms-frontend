import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TEntityWithAttendanceUpdate } from "@/types/attendence.type"
import { EAttendanceStatus } from "@/types/global.type"
import { format } from "date-fns"
import React from "react"

type Props<T> = {
    attendances: T[]
    setAttendances: React.Dispatch<React.SetStateAction<T[]>>
}

export default function EmployeeAttendanceTable<T extends TEntityWithAttendanceUpdate>({ attendances, setAttendances }: Props<T>) {

    const updateTime = (e: React.ChangeEvent<HTMLInputElement>, accountId: string) => {
        const { name, value } = e.target;

        const updatedAttendances: T[] = attendances.map(employee => {
            if (employee.account?.id === accountId && employee.attendance) {
                return {
                    ...employee,
                    attendance: {
                        ...employee.attendance,
                        [name]: value,
                    }
                }
            } else if (employee.account?.id === accountId && !employee.attendance) {
                return {
                    ...employee,
                    attendance: {
                        [name]: value,
                        date: format(new Date(), 'yyyy-MM-dd'),
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
                        <TableHead>In Time</TableHead>
                        <TableHead>Out Time</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {attendances.map((employee) => (
                        <TableRow key={employee.id}>
                            <TableCell>{employee.staffId ?? employee.teacherId}</TableCell>
                            <TableCell>{employee.firstName} {employee.lastName}</TableCell>
                            {
                                employee.attendance?.status === EAttendanceStatus.LEAVE ? (
                                    <TableCell key={employee.account?.id} colSpan={2} className="text-center text-warning">
                                        The Employee has taken leave.
                                    </TableCell>
                                ) : (
                                    <React.Fragment key={employee.account?.id}>
                                        <TableCell>
                                            <Input
                                                type="time"
                                                className="w-28"
                                                placeholder="In Time"
                                                name="inTime"
                                                value={employee.attendance?.inTime ?? ''}
                                                disabled={!!employee.attendance?.inTime && !!employee.attendance?.id}
                                                onChange={e => updateTime(e, employee.account?.id ?? '')}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Input
                                                type="time"
                                                className="w-28"
                                                name="outTime"
                                                placeholder="Out Time"
                                                value={employee.attendance?.outTime ?? ''}
                                                onChange={e => updateTime(e, employee.account?.id ?? '')}
                                                disabled={!employee.attendance || (!!employee.attendance?.outTime && !!employee.attendance?.id)}
                                            />
                                        </TableCell>
                                    </React.Fragment>
                                )
                            }
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}