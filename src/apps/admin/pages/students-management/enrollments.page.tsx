import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import { DataTable } from "@/components/data-table/data-table"
import { Link, useSearchParams } from "react-router-dom"
import { useGetEnrollments } from "../../components/students-management/enrollments/enrollments.action"
import { enrollmentsColumns } from "../../components/students-management/enrollments/enrollments.columns"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import SearchInput from "@/components/search-components/search-input"
import ClassRoomSearchFilterInputs from "@/components/search-components/class-room-search"
import { useAuth } from "@/contexts/auth-provider"

export default function EnrollmentsPage() {
    const { payload } = useAuth();
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetEnrollments({
        queryString: searchParams.toString(),
    });

    return (
        <ContainerLayout
            title="All Enrollments"
            description="Enrollments of all the students in the entire school."
            actionTrigger={
                <Button asChild>
                    <Link to={`/${payload?.role}/students/new-registration`}>
                        <Plus />
                        New Registration
                    </Link>
                </Button>
            }
        >
            {
                isLoading
                    ? <div>Loading...</div>
                    : (
                        <DataTable
                            columns={enrollmentsColumns}
                            data={data?.data ?? []}
                            meta={data?.meta}
                            filters={<SearchFilters />}
                        />
                    )
            }
        </ContainerLayout>
    )
}

function SearchFilters() {
    return (
        <section className="flex flex-wrap lg:gap-5 gap-3 w-full">
            <SearchInput placeholder="Search by reg no or student name" label="Reg No. or student name" />
            <ClassRoomSearchFilterInputs />
        </section>
    )
}