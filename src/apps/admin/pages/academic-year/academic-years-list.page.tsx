import AsideLinksLayout from "@/components/aside-layout.tsx/aside-links-layout"
import { DataTable } from "@/components/data-table/data-table"
import { academicYearColumns } from "../../components/academic-year/academic-years.columns"
import { academicYearAsideQuickLinks_viewAll, academicYearAsideRelatedActions } from "../../components/academic-year/academic-year-aside"
import { useGetAcademicYears } from "../../components/academic-year/actions"
import { useSearchParams } from "react-router-dom"
type Props = {}

export default function AcademicYearsListPage({ }: Props) {
    const [searchParams] = useSearchParams();
    
    const { data, isLoading } = useGetAcademicYears({
        queryString: searchParams.toString(),
    });

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