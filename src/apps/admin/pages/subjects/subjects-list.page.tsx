import AsideLinksLayout from "@/components/aside-layout.tsx/aside-links-layout"
import { DataTable } from "@/components/data-table/data-table"
import { academicYearAsideQuickLinks_viewAll, academicYearAsideRelatedActions } from "../../components/academic-year/academic-year-aside"
import { useSearchParams } from "react-router-dom"
import { useGetSubjects } from "../../components/subjects/actions"
import { subjectsColumns } from "../../components/subjects/subjects.columns"
type Props = {}

export default function SubjectsListPage({ }: Props) {
    const [searchParams] = useSearchParams();
    
    const { data, isLoading } = useGetSubjects({
        queryString: searchParams.toString(),
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <AsideLinksLayout
            title="All Subjects"
            description="View all subjects in your school management system."
            quickLinks={academicYearAsideQuickLinks_viewAll}
            relatedActions={academicYearAsideRelatedActions}
        >
            <DataTable
                columns={subjectsColumns}
                data={data?.data ?? []}
                meta={data?.meta}
            />

        </AsideLinksLayout>
    )
}