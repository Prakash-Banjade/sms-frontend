import ContainerLayout from "@/components/aside-layout.tsx/container-layout";
import { useGetFaculties } from "../../data-access/faculties-data-access";
import { createQueryString } from "@/utils/create-query-string";
import { useSearchParams } from "react-router-dom";
import { DataTable } from "@/components/data-table/data-table";
import { facultiesColumns } from "../../components/faculties/faculties-column";
import SearchInput from "@/components/search-components/search-input";
import { FacetedFilter } from "@/components/data-table/faceted-filter";
import { EDegreeLevel } from "@/types/global.type";
import { EDegreeLevelMappings } from "@/utils/labelToValueMappings";


export default function FacultiesListPage() {
    return (
        <ContainerLayout
            title="Faculties"
            description="All the faculties in the entire school."
        >
            <FacultiesList />
        </ContainerLayout>
    )
}

function FacultiesList() {
    const [searchParam] = useSearchParams();

    const { data, isLoading } = useGetFaculties({
        queryString: createQueryString({
            search: searchParam.get('search'),
            take: searchParam.get('take'),
            page: searchParam.get('page'),
            degreeLevels: searchParam.get('degreeLevels'),
        })
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <DataTable
            columns={facultiesColumns}
            data={data?.data ?? []}
            meta={data?.meta}
            filters={<section className="flex flex-wrap items-end lg:gap-5 gap-3 w-full">
                <SearchInput placeholder="Search by name" label="Name" />
                <FacetedFilter title="Degree Level" searchKey="degreeLevels" options={Object.entries(EDegreeLevel).map(([_, value]) => ({ label: EDegreeLevelMappings[value], value }))} />
            </section>}
        />
    )
}