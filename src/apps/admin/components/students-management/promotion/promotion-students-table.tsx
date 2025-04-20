import { IStudenIdtWithRoll } from "@/apps/admin/pages/students-management/student-promotion.page";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TStudent_BasicInfo } from "@/apps/admin/types/student.type"

type Props = {
    students: TStudent_BasicInfo[];
    studentsWithRoll: IStudenIdtWithRoll[]
    setStudentsWithRoll: React.Dispatch<React.SetStateAction<IStudenIdtWithRoll[]>>;
}

export default function PromotionStudentsTable({ setStudentsWithRoll, students, studentsWithRoll }: Props) {
    const handleCheckboxChange = (studentId: string) => {
        setStudentsWithRoll(prev =>
            prev.some(student => student.studentId === studentId)
                ? prev.filter(student => student.studentId !== studentId)
                : [...prev, { studentId, newRollNo: 0 }]
        )
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked && students?.length) {
            setStudentsWithRoll(students.map(student => ({ studentId: student.id, newRollNo: 0 })))
        } else {
            setStudentsWithRoll([])
        }
    }

    const handleInputChange = (studentId: string, newRollNo: number) => {
        setStudentsWithRoll(prev => prev.map(student => student.studentId === studentId ? { ...student, newRollNo } : student));
    }

    return (
        <Table>
            <TableHeader className="bg-tableheader">
                <TableRow>
                    <TableHead className="w-[50px]">
                        <Checkbox
                            checked={!!students.length && (studentsWithRoll.length === students.length)}
                            onCheckedChange={handleSelectAll}
                            aria-label="Select all"
                        />
                    </TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Current Roll No.</TableHead>
                    <TableHead>Next Roll No.</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {students?.map((student) => {
                    return (
                        <TableRow key={student.id}>
                            <TableCell>
                                <Checkbox
                                    checked={studentsWithRoll.some(studentWithRoll => studentWithRoll.studentId === student.id)}
                                    onCheckedChange={() => handleCheckboxChange(student.id)}
                                    aria-label={`Select ${student.fullName}`}
                                />
                            </TableCell>
                            <TableCell>{student.fullName}</TableCell>
                            <TableCell>{student.studentId}</TableCell>
                            <TableCell>{student.classRoomName}</TableCell>
                            <TableCell>{student.rollNo}</TableCell>
                            <TableCell>
                                <Input
                                    type="number"
                                    placeholder="New Roll No."
                                    min={1}
                                    pattern="^[0-9]*$"
                                    disabled={
                                        !studentsWithRoll.some(studentWithRoll => studentWithRoll.studentId === student.id)
                                    }
                                    onChange={event => handleInputChange(student.id, Number(event.target.value))}
                                />
                            </TableCell>
                        </TableRow>
                    )
                })}
                {
                    students?.length === 0 && <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                            No results found.
                        </TableCell>
                    </TableRow>
                }
            </TableBody>
        </Table>
    )
}