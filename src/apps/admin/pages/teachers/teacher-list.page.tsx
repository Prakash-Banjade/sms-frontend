import ContainerLayout from "@/components/page-layouts/container-layout"
import { DataTable } from "@/components/data-table/data-table"
import { teachersColumns } from "../../components/teachers/teacher.columns"
import { useSearchParams } from "react-router-dom"
import { useGetTeachers } from "../../components/teachers/actions"
import { createQueryString } from "@/utils/create-query-string"
import SearchInput from "@/components/search-components/search-input"
import { FacetedFilter } from "@/components/data-table/faceted-filter"
import { useFacultySearch } from "@/hooks/useFacultySearch"

export default function TeacherListPage() {

    return (
        <ContainerLayout
            title="View all teachers"
            description="All the teachers in the entire school."
        >
            <TeachersList />
        </ContainerLayout>
    )
}

export const TeachersList = () => {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetTeachers({
        queryString: createQueryString({
            search: searchParams.get('search'),
            teacherId: searchParams.get('teacherId'),
            page: searchParams.get('page'),
            take: searchParams.get('take'),
            departmentIds: searchParams.get('departmentIds'),
        }),
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <DataTable
            columns={teachersColumns}
            data={data?.data ?? []}
            meta={data?.meta}
            filters={<TeacherSearchFilters />}
        />
    )
}

function TeacherSearchFilters() {
    const { data } = useFacultySearch();

    return (
        <section className="flex flex-wrap lg:gap-5 gap-3 w-full items-end">
            <SearchInput placeholder="Search by name or ID" label="Name or ID" />
            <FacetedFilter
                title="Department"
                searchKey="departmentIds"
                options={data?.map(f => ({ label: f.name, value: f.id })) ?? []}
            />
        </section>
    )
}