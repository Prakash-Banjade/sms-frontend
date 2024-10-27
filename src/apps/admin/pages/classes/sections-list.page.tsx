import AsideLinksLayout from "@/components/aside-layout.tsx/aside-links-layout"
import { DataTable } from "@/components/data-table/data-table"
import { academicYearAsideQuickLinks_viewAll, academicYearAsideRelatedActions } from "../../components/academic-year/academic-year-aside"
import { useSearchParams } from "react-router-dom"
import { useGetClasses } from "../../components/class-rooms/actions"
import { createQueryString } from "@/utils/create-query-string"
import { EClassType } from "@/types/global.type"
import { sectionsColumns } from "../../components/class-rooms/sections.columns"
import ClassRoomSearchFilterInputs from "@/components/search-components/class-room-search"
import SearchInput from "@/components/search-components/search-input"
type Props = {}

export default function SectionsListPage({ }: Props) {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetClasses({
        queryString: createQueryString({
            classType: EClassType.SECTION,
            parentClassId: searchParams.get("parentClassId"),
            search: searchParams.get("search"),
        }),
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <AsideLinksLayout
            title="Sections List"
            description="Find all sections and by classes."
            quickLinks={academicYearAsideQuickLinks_viewAll}
            relatedActions={academicYearAsideRelatedActions}
        >
            <DataTable
                columns={sectionsColumns}
                data={data?.data ?? []}
                meta={data?.meta}
                filters={<SectionsListFilters />}
            />

        </AsideLinksLayout>
    )
}

function SectionsListFilters() {
    return (
        <section className="flex flex-wrap @4xl:gap-8 @2xl:gap-4 gap-2 w-full">
            <SearchInput placeholder="Search..." label="Search by name" />
            <ClassRoomSearchFilterInputs onlyClassRoom classRoomKey="parentClassId" />
        </section>
    )
}