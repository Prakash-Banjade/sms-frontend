import ContainerLayout from "@/components/page-layouts/container-layout"
import { DataTable } from "@/components/data-table/data-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"
import { noticesColumns } from "../../components/notices/notice.columns"
import { useGetNoticees } from "../../components/notices/action"
import { createQueryString } from "@/utils/create-query-string"
import SearchInput from "@/components/search-components/search-input"


export default function NoticesListPage() {
    return (
        <ContainerLayout
            title="Notices List"
            description="View all notices in your school management system."
            actionTrigger={
                <Button asChild>
                    <Link to="new">
                        <Plus />
                        Add Notice
                    </Link>
                </Button>
            }
        >
            <NoticesList />
        </ContainerLayout>
    )
}

function NoticesList() {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetNoticees({
        queryString: createQueryString({
            search: searchParams.get("search"),
        }),
    })

    if (isLoading) return <div>Loading...</div>;

    return (
        <DataTable
            columns={noticesColumns}
            data={data?.data ?? []}
            meta={data?.meta}
            filters={<NoticesListFilters />}
        />
    )
}

function NoticesListFilters() {
    return (
        <section className="flex flex-wrap lg:gap-5 gap-3 w-full">
            <SearchInput placeholder="Search..." label="Search by title" />
        </section>
    )
}