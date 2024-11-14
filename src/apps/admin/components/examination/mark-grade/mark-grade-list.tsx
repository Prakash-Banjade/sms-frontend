import { useSearchParams } from 'react-router-dom';
import { DataTable } from '@/components/data-table/data-table';
import { createQueryString } from '@/utils/create-query-string';
import { useGetMarkGrades } from '../data-access';
import SearchInput from '@/components/search-components/search-input';
import { markGradesColumns } from './mark-grade.columns';

export default function MarkGradesList() {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetMarkGrades({
        queryString: createQueryString({
            search: searchParams.get('search'),
            take: searchParams.get('take'),
            page: searchParams.get('page'),
            types: searchParams.get('types'),
        }),
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <DataTable
            columns={markGradesColumns}
            data={data?.data ?? []}
            meta={data?.meta}
            filters={<MarkGradesSearchFilters />}
        />
    )
}

function MarkGradesSearchFilters() {
    return (
        <section className="flex flex-wrap lg:gap-5 gap-3 w-full items-end">
            <SearchInput placeholder="Search by grade name..." label="Search" />
        </section>
    )
}