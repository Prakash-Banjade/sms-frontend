import SearchInput from "@/components/search-components/search-input"

export default function TeacherSearchFilters() {

    return (
        <section className="flex flex-wrap lg:gap-5 gap-3 w-full">
            <SearchInput placeholder="Search by name or email" label="Name or Email" />
            <SearchInput placeholder="Search by teacherId" label="TeacherId" searchKey="teacherId" className="min-w-[100px]" />
        </section>
    )
}