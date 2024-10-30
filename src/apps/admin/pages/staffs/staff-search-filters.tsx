import { FacetedFilter } from "@/components/data-table/faceted-filter"
import SearchInput from "@/components/search-components/search-input"
import { StaffTypeMappings } from "@/utils/labelToValueMappings"

export default function StaffSearchFilters() {

    return (
        <section className="flex flex-wrap lg:gap-5 gap-3 w-full items-end">
            <SearchInput placeholder="Search by name or email" label="Name or Email" />
            <SearchInput placeholder="Search by staffId" label="StaffId" searchKey="staffId" className="min-w-[100px]" />
            <FacetedFilter title="Staff Type" searchKey="type" options={Object.entries(StaffTypeMappings).map(([_, value]) => ({ label: value, value }))} />
        </section>
    )
}