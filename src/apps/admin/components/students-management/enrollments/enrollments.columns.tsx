import { ColumnDef } from "@tanstack/react-table"
import { TEnrollment } from "@/apps/admin/types/enrollment.type"
import { formatDate } from "@/utils/format-date";

export const enrollmentsColumns: ColumnDef<TEnrollment>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Reg No.",
        accessorKey: "registrationNumber",
    },
    {
        header: "Enrollment Date",
        cell: ({ row }) => {
            return <span>
                {formatDate({ date: new Date(row.original.enrollmentDate) })}
            </span>
        },
    },
    {
        header: "Student",
        cell: ({ row }) => {
            const student = row.original.student;
            return <span>{student.firstName} {student.lastName}</span>
        },
    },
    {
        header: "Class Room",
        cell: ({ row }) => {
            const classRoom = row.original.classRoom;

            return <p className="whitespace-nowrap">
                <span>
                    {
                        classRoom.parent ?
                            `${classRoom.parent?.name} - ${classRoom.name}` : classRoom.name
                    }
                </span>
                <br />
                <span className="text-muted-foreground text-xs">({classRoom.faculty?.name})</span>
            </p>
        },
    },
    {
        header: "Student Email",
        cell: ({ row }) => {
            return <span>{row.original.student?.email}</span>
        },
    },
    {
        header: "Student Phone",
        cell: ({ row }) => {
            return <span>{row.original.student?.phone}</span>
        },
    },
    {
        header: "Academic Year",
        accessorKey: "academicYear.name",
    },
]
