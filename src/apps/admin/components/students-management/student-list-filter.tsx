import ClassRoomSearchFilterInputs from "@/components/search-components/class-room-search"
import SearchInput from "@/components/search-components/search-input"

export default function StudentSearchFilters() {

    return (
        <section className="flex gap-8 w-full">
            <SearchInput placeholder="Name | ID | email | phone | roll no" />
            <ClassRoomSearchFilterInputs />
        </section>
    )
}