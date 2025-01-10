import FacultySearchFilters from "@/components/search-components/faculty-search-filter"
import SearchInput from "@/components/search-components/search-input"

export default function ClassesSearchFilters() {

    return (
        <section className="flex flex-wrap lg:gap-5 gap-3 w-full">
            <SearchInput placeholder="Search..." label="Search by name" />
            <FacultySearchFilters />
        </section>
    )
}