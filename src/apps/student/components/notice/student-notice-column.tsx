import { ColumnDef } from "@tanstack/react-table";
import { TooltipWrapper } from "@/components/ui/tooltip";
import { TNotice } from "@/types/notice.type";
import { Link } from "react-router-dom";
import { formatDate } from "@/utils/format-date";

export const studentNoticeColumns: ColumnDef<TNotice>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        header: "Title",
        accessorKey: "title",
        cell: ({ row }) => {
            return (
                <TooltipWrapper label="Click to view">
                    <Link
                        to={`/student/notices/${row.original.id}`}
                        className="hover:text-blue-500 hover:underline"
                    >
                        {row.original.title}
                    </Link>
                </TooltipWrapper>
            );
        },
    },
    {
        header: "Published On",
        accessorKey: "createdAt",
        cell: ({ row }) => {
            return (
                <span>{formatDate({ date: new Date(row.original.createdAt) })}</span>
            );
        },
    },
];
