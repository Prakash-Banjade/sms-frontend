import AttendanceTable from "@/apps/admin/components/students-management/attendance/attendance-table"
import GetAttendancesForm from "@/apps/admin/components/students-management/attendance/get-attendances-form"
import { useGetStudentsWithAttendances } from "@/apps/admin/components/students-management/student-actions"
import ContainerLayout from "@/components/page-layouts/container-layout"
import { TStudentsWithAttendenceUpdate } from "@/apps/admin/types/student.type"
import { useEffect, useState } from "react"
import _ from 'lodash';
import { Button } from "@/components/ui/button"
import { useAppMutation } from "@/hooks/useAppMutation"
import { QueryKey } from "@/react-query/queryKeys"
import { LoaderCircle } from "lucide-react"

interface IAttendanceListProps {
  searchQuery: string | undefined
  attendances: TStudentsWithAttendenceUpdate
  setAttendances: React.Dispatch<React.SetStateAction<TStudentsWithAttendenceUpdate>>
}

export default function StudentAttendancePage() {
  const [searchQuery, setSearchQuery] = useState<string>(); // we are not storing the queries in url, so create a state
  const [attendances, setAttendances] = useState<TStudentsWithAttendenceUpdate>([]); // this is used to keep track of attendance changes

  return (
    <ContainerLayout title="Student Attendance">
      <GetAttendancesForm setSearchQuery={setSearchQuery} />
      <AttendanceList searchQuery={searchQuery} attendances={attendances} setAttendances={setAttendances} />
    </ContainerLayout>
  )
}

function AttendanceList({ searchQuery, attendances, setAttendances }: IAttendanceListProps) {
  const selectedDate = new URLSearchParams(searchQuery).get('date')!;
  const { mutateAsync, isPending } = useAppMutation();

  const { data, isLoading } = useGetStudentsWithAttendances({
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
    const formattedAttendances = updatedAttendances.map(student => {
      if (student.attendance?.id) { // existing attendance's status is modified
        return {
          id: student.attendance.id,
          status: student.attendance.status,
        }
      } else if (student.attendance) { // new attendance is taken
        return {
          status: student.attendance.status,
          date: selectedDate,
          accountId: student.account.id,
        }
      }
    })

    await mutateAsync({
      endpoint: QueryKey.ATTENDANCES + '/batch',
      method: 'patch',
      data: {
        updatedAttendances: formattedAttendances,
      },
      invalidateTags: [QueryKey.STUDENTS],
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
      <AttendanceTable attendances={attendances} setAttendances={setAttendances} />
      <div className="flex justify-end">
        {
          (!!_.differenceWith(attendances, data, _.isEqual)?.length && !isLoading) && (
            <Button className="w-fit" onClick={handleSaveAttendances} disabled={isPending}>
              {
                isPending ? <>
                  <LoaderCircle className="animate-spin" /> Saving changes...
                </> : 'Save changes'
              }
            </Button>
          )
        }
      </div >
    </>
  )
}