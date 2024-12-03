import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import { DataTable } from "@/components/data-table/data-table"
import { createQueryString } from "@/utils/create-query-string"
import { useSearchParams } from "react-router-dom"
import { employeeLeaveRequestsColumns } from "../../components/attendances/employee-leave-request.columns"
import EmployeeLeaveRequestSearchFilters from "../../components/attendances/leave-request-search-filters"
import { useGetEmployeesLeaveRequests } from "../../components/leave-requests/actions"

export default function EmployeesLeaveRequestsPage() {
    return (
        <ContainerLayout
            title="Employees Leave Requests"
            description="View all leave requests."
        >
            <LeaveRequestList />
        </ContainerLayout>
    )
}

function LeaveRequestList() {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetEmployeesLeaveRequests({
        queryString: createQueryString({
            status: searchParams.get('status'),
            employeeTypes: searchParams.get('type'),
            search: searchParams.get('search'),
        })
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <DataTable
            columns={employeeLeaveRequestsColumns}
            data={data?.data ?? []}
            meta={data?.meta}
            filters={<EmployeeLeaveRequestSearchFilters />}
        />
    )
}