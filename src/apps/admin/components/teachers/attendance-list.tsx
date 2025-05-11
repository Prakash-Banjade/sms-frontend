import { useEffect, useState } from "react"
import _ from 'lodash';
import { Button } from "@/components/ui/button"
import { useAppMutation } from "@/hooks/useAppMutation"
import { QueryKey } from "@/react-query/queryKeys"
import { LoaderCircle } from "lucide-react"
import { TeacherWithAttendanceResponse } from "@/apps/admin/types/teacher.type"
import EmployeeAttendanceTable from "../attendances/employee-attendance-table";
import GetEmployeesAttendancesForm from "../attendances/get-employee-attendances-form";
import { useGetTeachersWithAttendances } from "./actions";
import MarkAsAbsentButton from "../attendances/mark-as-absent-btn";
import { UseQueryResult } from "@tanstack/react-query";

interface IAttendanceListProps {
    searchQuery: string | undefined
    attendances: TeacherWithAttendanceResponse
    setAttendances: React.Dispatch<React.SetStateAction<TeacherWithAttendanceResponse>>
    attendanceResponse: UseQueryResult<TeacherWithAttendanceResponse, Error>
}

export default function TeachersAttendanceList() {
    const [searchQuery, setSearchQuery] = useState<string>(''); // we are not storing the queries in url, so create a state
    const [attendances, setAttendances] = useState<TeacherWithAttendanceResponse>([]); // this is used to keep track of attendance changes

    const attendanceResponse = useGetTeachersWithAttendances({
        queryString: searchQuery,
        options: {
            enabled: !!searchQuery,
        }
    });

    useEffect(() => { // update attendances when data is updated
        const data = attendanceResponse.data;
        if (Array.isArray(data)) {
            setAttendances(data);
        }
    }, [attendanceResponse.data])

    return (
        <>
            <section className="flex gap-6 items-end justify-between">
                <GetEmployeesAttendancesForm setSearchQuery={setSearchQuery} />
                <MarkAsAbsentButton searchQuery={searchQuery} attendanceResponse={attendanceResponse} employeeType="teacher" />
            </section>
            <AttendanceList
                searchQuery={searchQuery}
                attendances={attendances}
                setAttendances={setAttendances}
                attendanceResponse={attendanceResponse}
            />
        </>
    )
}

function AttendanceList({ searchQuery, attendances, setAttendances, attendanceResponse: { data, isLoading } }: IAttendanceListProps) {
    const selectedDate = new URLSearchParams(searchQuery).get('date')!;
    const { mutateAsync, isPending } = useAppMutation();

    const handleSaveAttendances = async () => {
        if (!data) return;

        const updatedAttendances = _.differenceWith(attendances, data, _.isEqual);
        const formattedAttendances = updatedAttendances.map(teacher => {
            if (teacher.attendance?.id) { // existing attendance's status is modified
                return {
                    id: teacher.attendance.id,
                    inTime: teacher.attendance.inTime,
                    outTime: teacher.attendance.outTime,
                }
            } else if (teacher.attendance) { // new attendance is taken
                return {
                    date: selectedDate, // this date is in iso format
                    inTime: teacher.attendance.inTime,
                    outTime: teacher.attendance.outTime,
                    accountId: teacher.account.id,
                }
            }
        });

        await mutateAsync({
            endpoint: QueryKey.ATTENDANCES + '/batch',
            method: 'patch',
            data: {
                updatedAttendances: formattedAttendances,
            },
            invalidateTags: [QueryKey.TEACHERS, QueryKey.ATTENDANCES],
        })
    }

    if (isLoading) return <div>Loading...</div>;

    if (!searchQuery && !isLoading) return (
        <section className="text-muted-foreground min-h-[300px] grid place-items-center text-center">
            Select a class and date to get attendances.
        </section>
    )

    if ((!data?.length && !isLoading && !!searchQuery) || !data) return (
        <section className="text-muted-foreground min-h-[300px] grid place-items-center text-center">
            No data found.
        </section>
    )

    return (
        <>
            <EmployeeAttendanceTable attendances={attendances} setAttendances={setAttendances} />
            <div className="flex justify-end mt-5">
                {
                    !!_.differenceWith(attendances, data, _.isEqual)?.length && <Button className="w-fit" onClick={handleSaveAttendances} disabled={isPending}>
                        {
                            isPending ? <>
                                <LoaderCircle className="animate-spin" /> Saving changes...
                            </> : 'Save changes'
                        }
                    </Button>
                }
            </div>
        </>
    )
}