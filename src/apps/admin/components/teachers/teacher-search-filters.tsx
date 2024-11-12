import SearchInput from "@/components/search-components/search-input"

export default function TeacherSearchFilters() {

    return (
        <section className="flex flex-wrap lg:gap-5 gap-3 w-full">
            <SearchInput placeholder="Search by name or email" label="Name or Email" />
            <SearchInput placeholder="Search by teacher ID" label="Teacher ID" searchKey="teacherId" className="min-w-[100px]" />
        </section>
    )
}