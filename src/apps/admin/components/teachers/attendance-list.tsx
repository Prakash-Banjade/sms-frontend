import { useEffect, useState } from "react"
import _ from 'lodash';
import { Button } from "@/components/ui/button"
import { useAppMutation } from "@/hooks/useAppMutation"
import { QueryKey } from "@/react-query/queryKeys"
import { LoaderCircle } from "lucide-react"
import { TeacherWithAttendanceResponse } from "@/types/teacher.type"
import EmployeeAttendanceTable from "../attendances/employee-attendance-table";
import GetEmployeesAttendancesForm from "../attendances/get-employee-attendances-form";
import { useGetTeachersWithAttendances } from "./actions";

interface IAttendanceListProps {
    searchQuery: string | undefined
    attendances: TeacherWithAttendanceResponse
    setAttendances: React.Dispatch<React.SetStateAction<TeacherWithAttendanceResponse>>
}

export default function TeachersAttendanceList() {
    const [searchQuery, setSearchQuery] = useState<string>(); // we are not storing the queries in url, so create a state
    const [attendances, setAttendances] = useState<TeacherWithAttendanceResponse>([]); // this is used to keep track of attendance changes

    return (
        <>
            <GetEmployeesAttendancesForm setSearchQuery={setSearchQuery} />
            <AttendanceList searchQuery={searchQuery} attendances={attendances} setAttendances={setAttendances} />
        </>
    )
}

function AttendanceList({ searchQuery, attendances, setAttendances }: IAttendanceListProps) {
    const selectedDate = new URLSearchParams(searchQuery).get('date')!;
    const { mutateAsync, isPending } = useAppMutation();

    const { data, isLoading } = useGetTeachersWithAttendances({
        queryString: searchQuery,
        options: {
            enabled: !!searchQuery,
        }
    })

    useEffect(() => { // update attendances when data is updated
        if (Array.isArray(data)) {
            setAttendances(data);
        }
    }, [data])

    const handleSaveAttendances = async () => {
        if (!data) return;

        const updatedAttendances = _.differenceWith(attendances, data, _.isEqual);
        const formattedAttendances = updatedAttendances.map(teacher => {
            if (teacher.attendance?.id) { // existing attendance's status is modified
                return {
                    id: teacher.attendance.id,
                    status: teacher.attendance.status,
                }
            } else if (teacher.attendance) { // new attendance is taken
                return {
                    status: teacher.attendance.status,
                    date: selectedDate,
                    accountId: teacher.account.id,
                }
            }
        })

        await mutateAsync({
            endpoint: QueryKey.ATTENDANCES + '/batch',
            method: 'patch',
            data: {
                updatedAttendances: formattedAttendances,
            },
            invalidateTags: [QueryKey.TEACHERS],
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
            <div className="flex justify-end">
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