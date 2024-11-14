import ClassRoomSearchFilterInputs from "@/components/search-components/class-room-search"
import SearchInput from "@/components/search-components/search-input"

export default function StudentSearchFilters() {

    return (
        <section className="flex flex-wrap lg:gap-5 gap-3 w-full">
            <SearchInput placeholder="Search by name or email or ID" label="Name or Email or ID" /> 
            <ClassRoomSearchFilterInputs />
        </section>
    )
}