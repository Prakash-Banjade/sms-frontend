import { DataTable } from "@/components/data-table/data-table"
import { useSearchParams } from "react-router-dom"
import { useGetSubjects } from "../../components/subjects/actions"
import { subjectsColumns } from "../../components/subjects/subjects.columns"
import ContainerLayout from "@/components/aside-layout.tsx/container-layout"

export default function SubjectsListPage() {
    const [searchParams] = useSearchParams();
    
    const { data, isLoading } = useGetSubjects({
        queryString: searchParams.toString(),
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <ContainerLayout
            title="All Subjects"
            description="View all subjects in your school management system."
        >
            <DataTable
                columns={subjectsColumns}
                data={data?.data ?? []}
                meta={data?.meta}
            />

        </ContainerLayout>
    )
}