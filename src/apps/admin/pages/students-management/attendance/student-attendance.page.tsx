import AttendanceTable from "@/apps/admin/components/students-management/attendance/attendance-table"
import GetAttendancesForm from "@/apps/admin/components/students-management/attendance/get-attendances-form"
import { useGetStudentsWithAttendances } from "@/apps/admin/components/students-management/student-actions"
import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import { useState } from "react"

type Props = {}

export default function StudentAttendancePage({ }: Props) {
  const [searchQuery, setSearchQuery] = useState<string>()

  return (
    <ContainerLayout title="Student Attendance">
      <GetAttendancesForm setSearchQuery={setSearchQuery} />
      <AttendanceList searchQuery={searchQuery} />
    </ContainerLayout>
  )
}

function AttendanceList({ searchQuery }: { searchQuery: string | undefined }) {
  const { data, isLoading } = useGetStudentsWithAttendances({
    queryString: searchQuery,
    options: {
      enabled: !!searchQuery,
    }
  })

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
    <AttendanceTable attendanceData={data} />
  )
}