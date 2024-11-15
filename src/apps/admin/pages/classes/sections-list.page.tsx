import { DataTable } from "@/components/data-table/data-table"
import { useSearchParams } from "react-router-dom"
import { createQueryString } from "@/utils/create-query-string"
import { sectionsColumns } from "../../components/class-rooms/sections.columns"
import ClassRoomSearchFilterInputs from "@/components/search-components/class-room-search"
import SearchInput from "@/components/search-components/search-input"
import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import { useGetClasses } from "../../components/class-rooms/actions"
import { EClassType } from "@/types/global.type"
type Props = {}

export default function SectionsListPage({ }: Props) {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetClasses({
        queryString: createQueryString({
            search: searchParams.get("search"),
            page: searchParams.get('page'),
            take: searchParams.get('take'),
            parentClassId: searchParams.get("parentClassId"),
            classType: EClassType.SECTION,
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