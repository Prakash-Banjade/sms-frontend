import { useSearchParams } from 'react-router-dom';
import { DataTable } from '@/components/data-table/data-table';
import { useGetDormitoryRooms } from './actions';
import { dormitoryRoomsColumns } from './dormitory-room.columns';

export default function DormitoryRoomsList() {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetDormitoryRooms({
        queryString: searchParams.toString(),
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <DataTable
            columns={dormitoryRoomsColumns}
            data={data?.data ?? []}
            meta={data?.meta}
        />
    )
}