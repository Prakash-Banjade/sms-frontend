import { useSearchParams } from 'react-router-dom';
import { DataTable } from '@/components/data-table/data-table';
import { useGetBookCategories } from './action';
import { createQueryString } from '@/utils/create-query-string';
import { bookCategoriesColumns } from './categories.column';
import SearchInput from '@/components/search-components/search-input';

export default function CategoriesList() {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetBookCategories({
        queryString: createQueryString({
            search: searchParams.get('search'),
        }),
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <DataTable
            columns={bookCategoriesColumns}
            data={data?.data ?? []}
            meta={data?.meta}
            filters={<CategoriesListSearchFilters />}
        />
    )
}

function CategoriesListSearchFilters() {
    return (
        <section className="w-[200px]">
            <SearchInput placeholder="Search..." label="Search by name" />
        </section>
    )
}