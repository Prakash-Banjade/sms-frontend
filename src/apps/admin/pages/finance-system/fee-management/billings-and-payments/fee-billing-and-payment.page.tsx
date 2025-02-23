import { useCustomSearchParams } from "@/hooks/useCustomSearchParams"
import { useGetStudents } from "@/apps/admin/components/students-management/student-actions"
import { createQueryString } from "@/utils/create-query-string"
import { TStudentsWithLedgerResponse } from "@/types/student.type"
import { DataTable } from "@/components/data-table/data-table"
import SearchInput from "@/components/search-components/search-input"
import ClassRoomSearchFilterInputs from "@/components/search-components/class-room-search"
import { feeStudentsColumns } from "@/apps/admin/components/finance-system/fee-management/fee-billings-and-payments/fee-students-columns"
import ContainerLayout from "@/components/page-layouts/container-layout"

export default function FeeBillingAndPaymentsPage() {
    return (
        <ContainerLayout
            title="Students with Fees"
            description="Click on student to view further details."
        >
            <StudentsList />
        </ContainerLayout>
    )
}

function StudentsList() {
    const { searchParams } = useCustomSearchParams();

    const { data, isLoading } = useGetStudents<TStudentsWithLedgerResponse>({
        queryString: createQueryString({
            search: searchParams.get("search"),
            page: searchParams.get("page"),
            take: searchParams.get("take"),
            order: searchParams.get("order"),
            sortBy: searchParams.get("sortBy"),
            classRoomId: searchParams.get("classRoomId"),
            sectionId: searchParams.get("sectionId"),
            onlyBasicInfo: true,
            includeLedgerAmount: true,
        })
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <DataTable
            columns={feeStudentsColumns}
            data={data?.data ?? []}
            meta={data?.meta}
            filters={<StudentsListFilters />}
        />
    )
}

function StudentsListFilters() {
    return (
        <section className="flex flex-wrap lg:gap-5 gap-3 w-full">
            <SearchInput placeholder="Search by name or email" label="Name or Email" />
            <ClassRoomSearchFilterInputs />
        </section>
    )
}