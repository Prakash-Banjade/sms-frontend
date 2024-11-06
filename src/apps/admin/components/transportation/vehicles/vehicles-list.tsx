import { useSearchParams } from 'react-router-dom';
import { DataTable } from '@/components/data-table/data-table';
import { useGetVehicles } from './data-access';
import { createQueryString } from '@/utils/create-query-string';
import { vehiclesColumns } from './vehicles.columns';
import VehiclesSearchFilters from './vehicles-list-filters';

type Props = {}

export default function VehiclesList({ }: Props) {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetVehicles({
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
            columns={vehiclesColumns}
            data={data?.data ?? []}
            meta={data?.meta}
            filters={<VehiclesSearchFilters />}
        />
    )
}