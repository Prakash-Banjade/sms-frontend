import { FacetedFilter } from "@/components/data-table/faceted-filter"
import SearchInput from "@/components/search-components/search-input"
import { useGetBookCategories } from "./books-category/action"

export default function LibraryBooksSearchFilters() {
    const { data } = useGetBookCategories({
        queryString: 'skipPagination=true',
    })

    return (
        <section className="flex flex-wrap lg:gap-5 gap-3 w-full items-end">
            <SearchInput placeholder="Search by book name or code" label="Search" />
            <FacetedFilter title="Category" searchKey="categories" options={data?.data.map((category) => ({ label: category.name, value: category.name, count: category.booksCount })) ?? []} />
        </section>
    )
}