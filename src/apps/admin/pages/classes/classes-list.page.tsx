import AsideLinksLayout from "@/components/aside-layout.tsx/aside-links-layout"
import { DataTable } from "@/components/data-table/data-table"
import { academicYearAsideQuickLinks_viewAll, academicYearAsideRelatedActions } from "../../components/academic-year/academic-year-aside"
import { useSearchParams } from "react-router-dom"
import { useGetClasses } from "../../components/class-rooms/actions"
import { classesColumns } from "../../components/class-rooms/classes.columns"
type Props = {}

export default function ClassesListPage({ }: Props) {
    const [searchParams] = useSearchParams();
    
    const { data, isLoading } = useGetClasses({
        queryString: searchParams.toString(),
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <AsideLinksLayout
            title="All Classes"
            description="View all classes in your school management system."
            quickLinks={academicYearAsideQuickLinks_viewAll}
            relatedActions={academicYearAsideRelatedActions}
        >
            <DataTable
                columns={classesColumns}
                data={data?.data ?? []}
                meta={data?.meta}
            />

        </AsideLinksLayout>
    )
}