import AsideLinksLayout from "@/components/aside-layout.tsx/aside-links-layout"
import { DataTable } from "@/components/data-table/data-table"
import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { TAcademicYearsResponse } from "@/types/academic-year.type"
import { academicYearColumns } from "../../components/academic-year/academic-years.columns"
import { academicYearAsideQuickLinks_viewAll, academicYearAsideRelatedActions } from "../../components/academic-year/academic-year-aside"
type Props = {}

export default function AcademicYearsListPage({ }: Props) {
    const { data, isLoading } = useFetchData<TAcademicYearsResponse>({
        endpoint: QueryKey.ACADEMIC_YEARS,
        queryKey: [QueryKey.ACADEMIC_YEARS],
    })

    if (isLoading) return <div>Loading...</div>;

    return (
        <AsideLinksLayout
            title="Academic Years"
            description="View all academic years in your school management system."
            quickLinks={academicYearAsideQuickLinks_viewAll}
            relatedActions={academicYearAsideRelatedActions}
        >
            <DataTable
                columns={academicYearColumns}
                data={data?.data ?? []}
                meta={data?.meta}
            />

        </AsideLinksLayout>
    )
}