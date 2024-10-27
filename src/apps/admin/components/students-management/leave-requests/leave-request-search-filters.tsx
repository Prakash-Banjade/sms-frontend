import { FacetedFilter } from "@/components/data-table/faceted-filter"
import ClassRoomSearchFilterInputs from "@/components/search-components/class-room-search"
import { ELeaveRequestStatus } from "@/types/global.type"

export default function StudentLeaveRequestSearchFilters() {

    return (
        <section className="flex flex-wrap @4xl:gap-8 @2xl:gap-4 gap-2 w-full items-end">
            <ClassRoomSearchFilterInputs />
            <FacetedFilter title="Status" searchKey="status" options={Object.entries(ELeaveRequestStatus).map(([_, value]) => ({ label: value, value }))} /> 
        </section>
    )
}