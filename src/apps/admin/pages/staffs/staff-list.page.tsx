import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import { DataTable } from "@/components/data-table/data-table"
import { staffsColumns } from "../../components/staffs/staff.columns"
import { useSearchParams } from "react-router-dom"
import { useGetStaffs } from "../../components/staffs/actions"
import SearchInput from "@/components/search-components/search-input"
import { FacetedFilter } from "@/components/data-table/faceted-filter"
import { StaffTypeMappings } from "@/utils/labelToValueMappings"

export default function StaffListPage() {
    return (
        <ContainerLayout
            title="View all staffs"
            description="All the staffs in the entire school."
        >
            <StaffsList />
        </ContainerLayout>
    )
}

export const StaffsList = () => {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetStaffs({
        queryString: searchParams.toString(),
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <DataTable
            columns={staffsColumns}
            data={data?.data ?? []}
            meta={data?.meta}
            filters={<section className="flex flex-wrap lg:gap-5 gap-3 w-full items-end">
                <SearchInput placeholder="Search by name or email" label="Name or Email" />
                <SearchInput placeholder="Search by staff ID" label="Staff ID" searchKey="staffId" className="min-w-[100px]" />
                <FacetedFilter title="Staff Type" searchKey="type" options={Object.entries(StaffTypeMappings).map(([_, value]) => ({ label: value, value }))} />
            </section>}
        />
    )
}