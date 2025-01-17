import { DataTable } from "@/components/data-table/data-table"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useGetSubjects } from "../../components/subjects/data-access"
import { subjectsColumns } from "../../components/subjects/subjects.columns"
import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import SearchInput from "@/components/search-components/search-input"
import { createQueryString } from "@/utils/create-query-string"
import { FacetedFilter } from "@/components/data-table/faceted-filter"
import { ESubjectType } from "@/types/global.type"
import ClassRoomSearchFilterInputs, { CLASS_ROOM_SEARCH_KEY, FACULTY_SEARCH_KEY } from "@/components/search-components/class-room-search"

export default function SubjectsListPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const { data, isLoading } = useGetSubjects({
        queryString: createQueryString({
            page: searchParams.get("page"),
            take: searchParams.get("take"),
            search: searchParams.get("search"),
            types: searchParams.get("types"),
            sortBy: searchParams.get("sortBy"),
            order: searchParams.get("order"),
            [CLASS_ROOM_SEARCH_KEY]: searchParams.get(CLASS_ROOM_SEARCH_KEY),
            [FACULTY_SEARCH_KEY]: searchParams.get(FACULTY_SEARCH_KEY),
        })
    });

    return (
        <ContainerLayout
            title="All Subjects"
            description="View all subjects in your school management system."
            actionTrigger={<Button onClick={() => navigate('new')}>
                <Plus />
                Add Subject
            </Button>}
        >
            {
                !isLoading ? (
                    <DataTable
                        columns={subjectsColumns}
                        data={data?.data ?? []}
                        meta={data?.meta}
                        filters={<SubjectsSearchFilters />}
                    />
                ) : (
                    <div>Loading...</div>
                )
            }

        </ContainerLayout>
    )
}

function SubjectsSearchFilters() {

    return (
        <section className="flex flex-wrap lg:gap-5 gap-3 w-full items-end">
            <SearchInput placeholder="Search..." label="Search by name" />
            <ClassRoomSearchFilterInputs onlyClassRoom />
            <FacetedFilter searchKey="types" title="Subject Type" options={Object.entries(ESubjectType).map(([key, value]) => ({ label: key, value: value }))} />
        </section>
    )
}