import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import { DataTable } from "@/components/data-table/data-table"
import { Link, useSearchParams } from "react-router-dom"
import { useGetEnrollments } from "../../components/students-management/enrollments/enrollments.action"
import { enrollmentsColumns } from "../../components/students-management/enrollments/enrollments.columns"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

type Props = {}

export default function EnrollmentsPage({ }: Props) {
    return (
        <ContainerLayout
            title="All Enrollments"
            description="Enrollments of all the students in the entire school."
            actionTrigger={
                <Button asChild>
                    <Link to="/admin/students/new-registration">
                        <Plus />
                        New Registration
                    </Link>
                </Button>
            }
        >
            <EnrollmentsList />
        </ContainerLayout>
    )
}

export const EnrollmentsList = () => {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetEnrollments({
        queryString: searchParams.toString(),
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <DataTable
            columns={enrollmentsColumns}
            data={data?.data ?? []}
            meta={data?.meta}
        />
    )
}