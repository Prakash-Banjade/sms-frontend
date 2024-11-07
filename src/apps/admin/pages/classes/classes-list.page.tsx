import { DataTable } from "@/components/data-table/data-table"
import { useSearchParams } from "react-router-dom"
import { useGetClasses } from "../../components/class-rooms/actions"
import { classesColumns } from "../../components/class-rooms/classes.columns"
import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import ClassesSearchFilters from "../../components/class-rooms/class-list-filters"
import { createQueryString } from "@/utils/create-query-string"
type Props = {}

export default function ClassesListPage({ }: Props) {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetClasses({
        queryString: createQueryString({
            search: searchParams.get('search'),
        })
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <ContainerLayout
            title="All Classes"
            description="View all classes in your school management system."
        >
            <DataTable
                columns={classesColumns}
                data={data?.data ?? []}
                meta={data?.meta}
                filters={<ClassesSearchFilters />}
            />

        </ContainerLayout>
    )
}