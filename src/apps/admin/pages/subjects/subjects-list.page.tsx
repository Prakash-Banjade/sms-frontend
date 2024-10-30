import { DataTable } from "@/components/data-table/data-table"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useGetSubjects } from "../../components/subjects/actions"
import { subjectsColumns } from "../../components/subjects/subjects.columns"
import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function SubjectsListPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const { data, isLoading } = useGetSubjects({
        queryString: searchParams.toString(),
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <ContainerLayout
            title="All Subjects"
            description="View all subjects in your school management system."
            actionTrigger={<Button onClick={() => navigate('new')}>
                <Plus />
                Add Subject
            </Button>}
        >
            <DataTable
                columns={subjectsColumns}
                data={data?.data ?? []}
                meta={data?.meta}
            />

        </ContainerLayout>
    )
}