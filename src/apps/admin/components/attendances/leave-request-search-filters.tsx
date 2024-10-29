import { FacetedFilter } from "@/components/data-table/faceted-filter"
import SearchInput from "@/components/search-components/search-input"
import { ELeaveRequestStatus } from "@/types/global.type"
import { StaffTypeMappings } from "@/utils/labelToValueMappings"

export default function EmployeeLeaveRequestSearchFilters() {

    return (
        <section className="flex flex-wrap @4xl:gap-8 @2xl:gap-4 gap-2 w-full items-end">
            <SearchInput placeholder="Search..." label="Search by employee name" />
            <FacetedFilter title="Status" searchKey="status" options={Object.entries(ELeaveRequestStatus).map(([_, value]) => ({ label: value, value }))} />
            <FacetedFilter title="Employee Type" searchKey="type" options={[ // add teacher as well
                { label: "teacher", value: "teacher" },
                ...Object.entries(StaffTypeMappings).map(([_, value]) => ({ label: value, value })),
            ]} />
        </section>
    )
}