import ContainerLayout from "@/components/page-layouts/container-layout"
import { DataTable } from "@/components/data-table/data-table"
import { useSearchParams } from "react-router-dom"
import { useGetStudents } from "../../components/students-management/student-actions"
import { studentsColumns } from "../../components/students-management/student.columns"
import StudentsListFilters from "../../components/students-management/student-list-filter"

export default function StudentsListPage() {
    return (
        <ContainerLayout
            title="All Students"
            description="All the students in the entire school."
        >
            <StudentsList />
        </ContainerLayout>
    )
}

export const StudentsList = () => {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetStudents({
        queryString: searchParams.toString(),
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <DataTable
            columns={studentsColumns}
            data={data?.data ?? []}
            meta={data?.meta}
            filters={<StudentsListFilters />}
        />
    )
}