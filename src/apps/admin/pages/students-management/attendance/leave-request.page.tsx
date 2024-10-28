import { useGetLeaveRequests } from "@/apps/admin/components/leave-requests/actions"
import StudentLeaveRequestSearchFilters from "@/apps/admin/components/students-management/leave-requests/leave-request-search-filters"
import { leaveRequestsColumns } from "@/apps/admin/components/students-management/leave-requests/leave-request.columns"
import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import { DataTable } from "@/components/data-table/data-table"
import { createQueryString } from "@/utils/create-query-string"
import { useSearchParams } from "react-router-dom"

type Props = {}

export default function LeaveRequestsPage({ }: Props) {
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

    const { data, isLoading } = useGetLeaveRequests({
        queryString: createQueryString({
            classRoomId: searchParams.get('classRoomId'),
            sectionId: searchParams.get('sectionId'),
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