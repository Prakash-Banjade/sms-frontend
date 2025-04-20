import { FacetedFilter } from "@/components/data-table/faceted-filter"
import ClassRoomSearchFilterInputs from "@/components/search-components/class-room-search"
import { ELessonPlanStatus } from "@/apps/admin/types/lesson-plan.type"

export default function LessonPlanSearchFilters() {

    return (
        <section className="flex flex-wrap lg:gap-5 gap-3 w-full items-end" >
            <ClassRoomSearchFilterInputs withSubjet />
            <FacetedFilter
                title="Status"
                searchKey="status"
                options={[
                    { label: "Not Started", value: ELessonPlanStatus.Not_Started },
                    { label: "In Progress", value: ELessonPlanStatus.In_Progress },
                    { label: "Completed", value: ELessonPlanStatus.Completed },
                ]}
            />
        </section>
    )
}