import { useGetNoticees } from "@/apps/admin/components/notices/action"
import { TNotice } from "@/apps/admin/types/notice.type";
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import ContainerLayout from "@/components/page-layouts/container-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
export default function NoticePage() {

    return (
        <ContainerLayout
            title="School Notice Board"
            description="Stay updated with the latest announcements and events"
        >
            <NoticesView />
        </ContainerLayout>
    )
}

function NoticesView() {
    const { data, isLoading } = useGetNoticees({});

    if (isLoading) return <div>Loading....</div>;

    if (!data || data?.data.length === 0) return <div className="text-muted-foreground text-lg h-[50vh] text-center flex items-center ju">No Notice available!!</div>

    return (
        <>
            <div className="flex gap-4 flex-wrap">
                {data.data.map((notice) => <NoticeCard key={notice.id} notice={notice} />)}

            </div>
            <DataTablePagination meta={data?.meta} />
        </>
    )
}

function NoticeCard({ notice }: { notice: TNotice }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="hover:underline">
                    <Link to={notice.id}>
                        {notice.title}
                    </Link>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>Published At: <time dateTime={notice.createdAt} className="font-medium">{new Date(notice.createdAt).toLocaleDateString()}</time></CardDescription>
            </CardContent>
        </Card>
    )
}