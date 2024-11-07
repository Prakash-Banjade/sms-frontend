import { FacetedFilter } from "@/components/data-table/faceted-filter"
import ClassRoomSearchFilterInputs from "@/components/search-components/class-room-search"
import { ELeaveRequestStatus } from "@/types/global.type"

export default function StudentLeaveRequestSearchFilters() {

    return (
        <section className="flex flex-wrap lg:gap-5 gap-3 w-full items-end">
            <ClassRoomSearchFilterInputs />
            <FacetedFilter title="Status" searchKey="status" options={Object.entries(ELeaveRequestStatus).map(([_, value]) => ({ label: value, value }))} /> 
        </section>
    )
}