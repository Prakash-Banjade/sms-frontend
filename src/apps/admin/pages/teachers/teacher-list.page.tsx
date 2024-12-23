import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import { DataTable } from "@/components/data-table/data-table"
import { teachersColumns } from "../../components/teachers/teacher.columns"
import { useSearchParams } from "react-router-dom"
import { useGetTeachers } from "../../components/teachers/actions"
import TeacherSearchFilters from "../../components/teachers/teacher-search-filters"
import { createQueryString } from "@/utils/create-query-string"

export default function TeacherListPage() {

    return (
        <ContainerLayout
            title="View all teachers"
            description="All the teachers in the entire school."
        >
            <TeachersList />
        </ContainerLayout>
    )
}

export const TeachersList = () => {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetTeachers({
        queryString: createQueryString({
            search: searchParams.get('search'),
            teacherId: searchParams.get('teacherId'),
            page: searchParams.get('page'),
            take: searchParams.get('take'),
        }),
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <DataTable
            columns={teachersColumns}
            data={data?.data ?? []}
            meta={data?.meta}
            filters={<TeacherSearchFilters />}
        />
    )
}