import { DataTable } from "@/components/data-table/data-table"
import { useSearchParams } from "react-router-dom"
import { useGetSections } from "../../components/class-rooms/actions"
import { createQueryString } from "@/utils/create-query-string"
import { sectionsColumns } from "../../components/class-rooms/sections.columns"
import ClassRoomSearchFilterInputs from "@/components/search-components/class-room-search"
import SearchInput from "@/components/search-components/search-input"
import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
type Props = {}

export default function SectionsListPage({ }: Props) {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetSections({
        queryString: createQueryString({
            search: searchParams.get("search"),
            parentClassId: searchParams.get("parentClassId"),
        }),
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <ContainerLayout
            title="Sections List"
            description="Find all sections and by classes."
        >
            <DataTable
                columns={sectionsColumns}
                data={data?.data ?? []}
                meta={data?.meta}
                filters={<SectionsListFilters />}
            />

        </ContainerLayout>
    )
}

function SectionsListFilters() {
    return (
        <section className="flex flex-wrap lg:gap-5 gap-3 w-full">
            <SearchInput placeholder="Search..." label="Search by name" />
            <ClassRoomSearchFilterInputs onlyClassRoom classRoomKey="parentClassId" />
        </section>
    )
}