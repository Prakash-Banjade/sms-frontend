import { useGetNotice } from "@/apps/admin/components/notices/action"
import { Skeleton } from "@/components/ui/skeleton"
import { TNotice } from "@/types/notice.type"
import { formatDate } from "@/utils/format-date"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import DOMPurify from "dompurify"
import { Calendar } from "lucide-react"


const SingleNotice = ({ notice }: {
    notice: TNotice
}) => {
    const { data, isLoading } = useGetNotice({
        id: notice.id
    })
    if (isLoading) return <Skeleton className="h-[50vh] w-1/5" />

    if (!data) return <div className=" h-[50vh] text-center text-muted-foreground">
        No notice found!!
    </div>
    return (
        <ScrollArea className="max-h-[70vh]  border-t-2  mr-4 lg:prose-lg prose max-w-[1000px] dark:prose-invert mx-auto ">
            <div className="flex flex-start text-sm text-muted-foreground py-4"> <Calendar className="mr-1 h-4 w-4" />
                {formatDate({ date: new Date(data.createdAt) })}</div>

            <div className=" " dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data?.description) ?? '' }} />

        </ScrollArea>
    )
}

export default SingleNotice