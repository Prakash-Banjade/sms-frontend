
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveDialog } from "@/components/ui/responsive-dialog"
import { TNotice } from "@/apps/admin/types/notice.type"
import { Calendar } from "lucide-react"
import { useState } from "react"
import SingleNotice from "./single-notice"
import { formatDate } from "@/utils/format-date"


const NoticeCard = ({ notices }: { notices: TNotice[] }) => {

    const [isNoticeOpen, setNoticeOpen] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState<TNotice | null>(null);

    const openNoticeModal = (notice: TNotice) => {
        setSelectedNotice(notice);
        setNoticeOpen(true);


    };

    return (
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {notices.map((notice) => (
                <Card key={notice.id} className="cursor-pointer" onClick={() => openNoticeModal(notice)}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg capitalize">{notice.title}</CardTitle>
                            <CardDescription className="flex items-center">
                                <Calendar className="mr-1 h-4 w-4" />
                                {formatDate({ date: new Date(notice.createdAt) })}
                            </CardDescription>
                        </div>
                    </CardHeader>
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
