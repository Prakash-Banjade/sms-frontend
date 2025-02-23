import ContainerLayout from "@/components/page-layouts/container-layout";
import { useGetFaculties } from "../../data-access/faculties-data-access";
import { createQueryString } from "@/utils/create-query-string";
import { useSearchParams } from "react-router-dom";
import { DataTable } from "@/components/data-table/data-table";
import { facultiesColumns } from "../../components/faculties/faculties-column";
import SearchInput from "@/components/search-components/search-input";

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
            </section>}
        />
    )
}