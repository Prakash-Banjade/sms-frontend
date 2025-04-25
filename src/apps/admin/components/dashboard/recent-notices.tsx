import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createQueryString } from "@/utils/create-query-string";
import { CalendarDays } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetNoticees } from "../notices/action";
import { TNoticesResponse } from "@/apps/admin/types/notice.type";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-provider";

type TRecentNotices = TNoticesResponse & {
    maxRecentDays: number;
}

export default function RecentNotices() {
    const navigate = useNavigate();
    const { payload } = useAuth();

    const { data: notices, isLoading } = useGetNoticees<TRecentNotices>({
        queryString: createQueryString({
            recent: true,
        }),
    });

    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle className="justify-between flex items-center">
                    <span>Recent Notices</span>
                    <Button type="button" variant={'outline'} size={'sm'} onClick={() => navigate(`/${payload?.role}/notices`)}>
                        View all
                    </Button>
                </CardTitle>
                <CardDescription className="text-muted-foreground">Past {notices?.maxRecentDays} days notices on your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
                <section className="space-y-3">
                    {isLoading && [...Array(2)].map((_, index) => <EventsLoadingSkeleton key={index} />)}
                    {
                        notices?.data.map((notice) => {

                            return (
                                <Card className="border-l-4 border-l-primary" key={notice.id}>
                                    <CardHeader className="p-2 px-4">
                                        <CardTitle className="text-lg">
                                            <Link to={`/${payload?.role}/notices/${notice.id}`} className="hover:underline w-fit">
                                                {notice.title}
                                            </Link>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-2 pb-3 px-4 pt-0">
                                        <div className="flex items-center space-x-2">
                                            <CalendarDays className="h-4 w-4 opacity-70" />
                                            <span className="text-sm">Published {formatDistanceToNow(new Date(notice.createdAt))} ago</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })
                    }
                    {notices?.data?.length === 0 && (
                        <p className="text-muted-foreground text-sm text-center py-8">No notice found!</p>
                    )}
                </section>
            </CardContent>
        </Card>
    )
}

function EventsLoadingSkeleton() {
    return (
        <Card className="border-l-4 border-l-primary">
            <CardHeader className="p-2 px-4">
                <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="p-2 pb-3 px-4 pt-2">
                <div className="grid gap-3">
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}