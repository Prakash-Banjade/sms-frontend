import { useSearchParams } from 'react-router-dom';
import { DataTable } from '@/components/data-table/data-table';
import { createQueryString } from '@/utils/create-query-string';
import { useGetExamTypes } from '../data-access';
import { examTypesColumns } from './exam-type.column';
import SearchInput from '@/components/search-components/search-input';

export default function ExamTypesList() {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetExamTypes({
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
            columns={examTypesColumns}
            data={data?.data ?? []}
            meta={data?.meta}
            filters={<ExamTypesSearchFilters />}
        />
    )
}

function ExamTypesSearchFilters() {
    return (
        <section className="flex flex-wrap lg:gap-5 gap-3 w-full items-end">
            <SearchInput placeholder="Search by name..." label="Search" />
        </section>
    )
}