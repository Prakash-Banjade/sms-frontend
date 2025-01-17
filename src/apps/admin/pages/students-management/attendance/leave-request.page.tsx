import { useGetStudentsLeaveRequests } from "@/apps/admin/components/leave-requests/actions"
import StudentLeaveRequestSearchFilters from "@/apps/admin/components/students-management/leave-requests/leave-request-search-filters"
import { leaveRequestsColumns } from "@/apps/admin/components/students-management/leave-requests/leave-request.columns"
import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import { DataTable } from "@/components/data-table/data-table"
import { CLASS_ROOM_SEARCH_KEY, FACULTY_SEARCH_KEY, SECTION_SEARCH_KEY } from "@/components/search-components/class-room-search"
import { createQueryString } from "@/utils/create-query-string"
import { useSearchParams } from "react-router-dom"

export default function StudentsLeaveRequestsPage() {
    return (
        <ContainerLayout
            title="Leave Requests"
            description="View all leave requests."
        >
            <LeaveRequestList />
        </ContainerLayout>
    )
}

function LeaveRequestList() {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetStudentsLeaveRequests({
        queryString: createQueryString({
            [FACULTY_SEARCH_KEY]: searchParams.get(FACULTY_SEARCH_KEY),
            [CLASS_ROOM_SEARCH_KEY]: searchParams.get(CLASS_ROOM_SEARCH_KEY),
            [SECTION_SEARCH_KEY]: searchParams.get(SECTION_SEARCH_KEY),
            status: searchParams.get('status'),
        })
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <DataTable
            columns={leaveRequestsColumns}
            data={data?.data ?? []}
            meta={data?.meta}
            filters={
                <StudentLeaveRequestSearchFilters />
            }
        />
    )
}