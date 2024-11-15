import { DataTable } from "@/components/data-table/data-table"
import { Link, useSearchParams } from "react-router-dom"
import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import { useGetLibraryBookes } from "../../components/library/actions"
import { libraryBooksColumns } from "../../components/library/library-books.columns"
import LibraryBooksSearchFilters from "../../components/library/library-bok-search-filters"
import { createQueryString } from "@/utils/create-query-string"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

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