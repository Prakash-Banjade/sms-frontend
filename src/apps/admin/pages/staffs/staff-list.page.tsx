import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import { DataTable } from "@/components/data-table/data-table"
import { staffsColumns } from "../../components/staffs/staff.columns"
import { useSearchParams } from "react-router-dom"
import { useGetStaffs } from "../../components/staffs/actions"
import StaffSearchFilters from "./staff-search-filters"

type Props = {}

export default function StaffListPage({ }: Props) {
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
            filters={<StaffSearchFilters />}
        />
    )
}