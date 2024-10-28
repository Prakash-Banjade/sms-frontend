import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import { DataTable } from "@/components/data-table/data-table"
import { teachersColumns } from "../../components/teachers/teacher.columns"
import { useSearchParams } from "react-router-dom"
import { useGetTeachers } from "../../components/teachers/actions"

type Props = {}

export default function TeacherListPage({ }: Props) {
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
        queryString: searchParams.toString(),
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <DataTable
            columns={teachersColumns}
            data={data?.data ?? []}
            meta={data?.meta}
        />
    )
}