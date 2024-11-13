import SearchInput from "@/components/search-components/search-input";

export default function RouteStopSearchFilters() {
    return (
        <section className="flex flex-wrap lg:gap-5 gap-3 w-full items-end">
            <SearchInput placeholder="Stop name or vehicle number" label="Search" />  
        </section>
    )
}