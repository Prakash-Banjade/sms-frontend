import { useEffect, useState } from "react"
import _ from 'lodash';
import { Button } from "@/components/ui/button"
import { useAppMutation } from "@/hooks/useAppMutation"
import { QueryKey } from "@/react-query/queryKeys"
import { LoaderCircle } from "lucide-react"
import { StaffWithAttendanceResponse } from "@/types/staff.type"
import EmployeeAttendanceTable from "../attendances/employee-attendance-table";
import GetEmployeesAttendancesForm from "../attendances/get-employee-attendances-form";
import { useGetStaffsWithAttendances } from "./actions";

interface IAttendanceListProps {
    searchQuery: string | undefined
    attendances: StaffWithAttendanceResponse
    setAttendances: React.Dispatch<React.SetStateAction<StaffWithAttendanceResponse>>
}

export default function StaffsAttendanceList() {
    const [searchQuery, setSearchQuery] = useState<string>(); // we are not storing the queries in url, so create a state
    const [attendances, setAttendances] = useState<StaffWithAttendanceResponse>([]); // this is used to keep track of attendance changes

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

    const { data, isLoading } = useGetStaffsWithAttendances({
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
        const formattedAttendances = updatedAttendances.map(staff => {
            if (staff.attendance?.id) { // existing attendance's status is modified
                return {
                    id: staff.attendance.id,
                    status: staff.attendance.status,
                }
            } else if (staff.attendance) { // new attendance is taken
                return {
                    status: staff.attendance.status,
                    date: selectedDate,
                    accountId: staff.account.id,
                }
            }
        })

        await mutateAsync({
            endpoint: QueryKey.ATTENDANCES + '/batch',
            method: 'patch',
            data: {
                updatedAttendances: formattedAttendances,
            },
            invalidateTags: [QueryKey.STAFFS],
        })
    }

    if (isLoading) return <div>Loading...</div>;

    if (!searchQuery && !isLoading) return (
        <section className="text-muted-foreground min-h-[300px] grid place-items-center text-center">
            Select date to get attendances.
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