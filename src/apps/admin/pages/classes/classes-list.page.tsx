import { DataTable } from "@/components/data-table/data-table"
import { useSearchParams } from "react-router-dom"
import { useGetClasses } from "../../components/class-rooms/actions"
import { classesColumns } from "../../components/class-rooms/classes.columns"
import ContainerLayout from "@/components/page-layouts/container-layout"
import ClassesSearchFilters from "../../components/class-rooms/class-list-filters"
import { createQueryString } from "@/utils/create-query-string"

export default function ClassesListPage() {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetClasses({
        queryString: createQueryString({
            search: searchParams.get('search'),
            page: searchParams.get('page'),
            take: searchParams.get('take'),
            facultyId: searchParams.get('facultyId'),
        })
    });

    return (
        <ContainerLayout
            title="All Classes"
            description="View all classes in your school management system."
        >
            {
                !isLoading ? (
                    <DataTable
                        columns={classesColumns}
                        data={data?.data ?? []}
                        meta={data?.meta}
                        filters={<ClassesSearchFilters />}
                    />
                ) : (
                    <div>Loading...</div>
                )
            }
        </ContainerLayout>
    )
}