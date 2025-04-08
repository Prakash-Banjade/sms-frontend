import { useSearchParams } from 'react-router-dom';
import { useGetRoomTypes } from './actions';
import { DataTable } from '@/components/data-table/data-table';
import { roomTypesColumns } from './room-type.columns';

export default function RoomTypeList() {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetRoomTypes({
        queryString: searchParams.toString(),
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <DataTable
            columns={roomTypesColumns}
            data={data?.data ?? []}
            meta={data?.meta}
        />
    )
}