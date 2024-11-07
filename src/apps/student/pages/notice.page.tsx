import { useGetNoticees } from "@/apps/admin/components/notices/action";
import { DataTable } from "@/components/data-table/data-table";
import { createQueryString } from "@/utils/create-query-string";
import { singleNoticeColumns } from "../components/notice/student-notice-column";


const NoticePage = () => {
    const { data, isLoading } = useGetNoticees({
        queryString: createQueryString({
            // search: searchParams.get("search"),
        }),
    })

    if (isLoading) return <div>Loading...</div>;

    return (
        <DataTable
            columns={singleNoticeColumns}
            data={data?.data ?? []}
            meta={data?.meta}
        />
    )
}

export default NoticePage
