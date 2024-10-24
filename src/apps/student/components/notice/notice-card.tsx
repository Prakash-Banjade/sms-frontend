import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveDialog } from "@/components/ui/responsive-dialog"
import { TNotice } from "@/types/notice.type"
import { formatDate } from "@/utils/format-date"
import { Calendar } from "lucide-react"
import { useState } from "react"
import SingleNotice from "./single-notice"

const NoticeCard = ({ notices }: { notices: TNotice[] }) => {
    const [isNoticeOpen, setNoticeOpen] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState<TNotice | null>(null);

    const openNoticeModal = (notice: TNotice) => {
        setSelectedNotice(notice);
        setNoticeOpen(true);
    };

    return (
        <div className="mt-4">
            {notices.map((notice) => (
                <Card key={notice.id} className="mb-4">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg capitalize">{notice.title}</CardTitle>
                            <CardDescription className="flex items-center">
                                <Calendar className="mr-1 h-4 w-4" />
                                {formatDate({ date: new Date(notice.date) })}
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardDescription className="text-md p-4">
                        <p className="line-clamp-2">{notice.description}</p>
                    </CardDescription>
                    <Button size={'sm'} className="m-4" onClick={() => openNoticeModal(notice)}>Read More</Button>
                </Card>
            ))}

            {/* Modal for showing the selected notice */}
            <ResponsiveDialog
                isOpen={isNoticeOpen}
                setIsOpen={setNoticeOpen}
                title={selectedNotice?.title || ''}
            >
                {selectedNotice && <SingleNotice notice={selectedNotice} />}
            </ResponsiveDialog>
        </div>
    );
}

export default NoticeCard;
