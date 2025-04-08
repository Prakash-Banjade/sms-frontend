import { useSearchParams } from 'react-router-dom';
import { DataTable } from '@/components/data-table/data-table';
import { useGetDormitories } from './actions';
import { dormitoriesColumns } from './dormitory.columns';

export default function DormitoriesList() {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetDormitories({
        queryString: searchParams.toString(),
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <DataTable
            columns={dormitoriesColumns}
            data={data?.data ?? []}
            meta={data?.meta}
        />
    )
}