import { FacetedFilter } from "@/components/data-table/faceted-filter"
import SearchInput from "@/components/search-components/search-input"
import { EVehicleType } from "@/types/global.type"

export default function VehiclesSearchFilters() {

    return (
        <section className="flex flex-wrap lg:gap-5 gap-3 w-full items-end">
            <SearchInput placeholder="Search..." label="Search by vehicle number" />
            <FacetedFilter title="Vehicle Type" searchKey="types" options={Object.entries(EVehicleType).map(([_, value]) => ({ label: value, value }))} />
        </section>
    )
}