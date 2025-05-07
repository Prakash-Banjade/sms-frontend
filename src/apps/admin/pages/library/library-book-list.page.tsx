import { DataTable } from "@/components/data-table/data-table"
import { Link, useSearchParams } from "react-router-dom"
import ContainerLayout from "@/components/page-layouts/container-layout"
import { useGetLibraryBookes } from "../../components/library/data-access"
import { libraryBooksColumns } from "../../components/library/library-books.columns"
import { createQueryString } from "@/utils/create-query-string"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { FacetedFilter } from "@/components/data-table/faceted-filter"
import SearchInput from "@/components/search-components/search-input"
import { useGetBookCategories } from "../../components/library/books-category/action"

export default function LibraryBookListPage() {
    return (
        <ContainerLayout
            title="Books Catalog"
            description="View all library books in your library."
            actionTrigger={<Button asChild>
                <Link to={`new`}>
                    <PlusIcon className="h-4 w-4" />
                    <span>Add new book</span>
                </Link>
            </Button>}
        >
            <LibraryBookList />
        </ContainerLayout>
    )
}

function LibraryBookList() {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetLibraryBookes({
        queryString: createQueryString({
            search: searchParams.get('search'),
            categories: searchParams.get('categories'),
            page: searchParams.get('page'),
            take: searchParams.get('take'),
        }),
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <DataTable
            columns={libraryBooksColumns}
            data={data?.data ?? []}
            meta={data?.meta}
            filters={<LibraryBooksSearchFilters />}
        />
    )
}

function LibraryBooksSearchFilters() {
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