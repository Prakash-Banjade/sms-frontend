import { FacetedFilter } from "@/components/data-table/faceted-filter"
import ClassRoomSearchFilterInputs from "@/components/search-components/class-room-search"
import { useGetExamTypeOptions } from "../data-access"
import { Skeleton } from "@/components/ui/skeleton"

export default function ExamsSearchFilters() {
    const { data, isLoading } = useGetExamTypeOptions({})

    return (
        <section className="flex flex-wrap lg:gap-5 gap-3 w-full items-end">
            <ClassRoomSearchFilterInputs />
            {
                isLoading
                    ? <Skeleton className="h-6 w-10" />
                    : <FacetedFilter title="Exam Type" searchKey="examTypes" options={Array.isArray(data) && data?.map(({ label }) => ({ label: label, value: label })) || []} />
            }
        </section>
    )
}