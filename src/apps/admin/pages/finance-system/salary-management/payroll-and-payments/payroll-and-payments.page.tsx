import { useCustomSearchParams } from "@/hooks/useCustomSearchParams"
import { createQueryString } from "@/utils/create-query-string"
import { DataTable } from "@/components/data-table/data-table"
import ContainerLayout from "@/components/page-layouts/container-layout"
import { useGetEmployees } from "@/apps/admin/components/finance-system/salary-management/data-access"
import { SalaryStructureSearchFilters } from "../salary-structures/salary-structures.page"
import { employeesColumns } from "@/apps/admin/components/finance-system/salary-management/employees.columns"

export default function PayrollAndPaymentsPage() {
    return (
        <ContainerLayout
            title="Employees"
            description="Click on employee to view further details."
        >
            <EmployeesList />
        </ContainerLayout>
    )
}

function EmployeesList() {
    const { searchParams } = useCustomSearchParams();

    const { data, isLoading } = useGetEmployees({
        queryString: createQueryString({
            page: searchParams.get('page'),
            take: searchParams.get('take'),
            sortBy: searchParams.get('sortBy'),
            order: searchParams.get('order'),
            search: searchParams.get('search'),
            designations: searchParams.get('designations')
        })
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <DataTable
            columns={employeesColumns}
            data={data?.data ?? []}
            meta={data?.meta}
            filters={<SalaryStructureSearchFilters />}
        />
    )
}