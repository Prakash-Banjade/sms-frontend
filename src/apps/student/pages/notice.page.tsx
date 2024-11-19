
import { useGetNoticees } from "@/apps/admin/components/notices/action"
import NoticeCard from "../components/notice/notice-card"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
const NoticePage = () => {
    const { data, isLoading } = useGetNoticees({})
    if (isLoading) return <div>Loading....</div>
    if (!data || data?.data.length === 0) return <div className="text-muted-foreground text-lg  h-[50vh] text-center flex items-center ju">
        No Notice available!!
    </div>
    return (
        <div className="container mx-auto">
            <h2 className="text-lg font-semibold">School Notice Board</h2>
            <p className="text-muted-foreground my-2">Stay updated with the latest announcements and events</p>
            <NoticeCard notices={data?.data} />
            {/* Pagination Section */}
            <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Page {data?.meta?.page} of {data?.meta?.pageCount}</span>
                </div>
                {data?.meta && (
                    <DataTablePagination meta={data?.meta} />
                )}
            </div>
        </div>
    )
}
export default NoticePage