import ClassRoomSearchFilterInputs from "@/components/search-components/class-room-search"
import SearchInput from "@/components/search-components/search-input"

export default function StudentSearchFilters() {

    return (
        <section className="flex flex-wrap @4xl:gap-8 @2xl:gap-4 gap-2 w-full">
            <SearchInput placeholder="Search by name or email" label="Name or Email" />
            <SearchInput placeholder="Search by studentId" label="StudentId" searchKey="studentId" className="min-w-[100px]" />
            <ClassRoomSearchFilterInputs />
        </section>
    )
}