
import { useNotices } from "../components/notice/action"
import NoticeCard from "../components/notice/notice-card"


const NoticePage = () => {
    const { data, isLoading } = useNotices({})
    if (isLoading) return <div>Loading....</div>
    if (!data) return <div className="text-muted-foreground text-lg  h-[50vh] text-center flex items-center ju">
        No Notice available
    </div>
    return (
        <div className="flex flex-col gap-3 p-4 m-auto">
            <h2 className="text-2xl font-bold">School Notice Board</h2>
            <p>Stay updated with the latest announcements and events</p>
            <NoticeCard notices={data?.data} />

        </div>
    )
}

export default NoticePage
