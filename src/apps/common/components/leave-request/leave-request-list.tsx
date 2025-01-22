import { Badge } from "@/components/ui/badge"
import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { ELeaveRequestStatus } from "@/types/global.type"
import { differenceInDays, format, isSameMonth } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Clock, FileQuestion, FileText } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"


type TMyLeaveRequest = {
    id: string,
    requestedOn: string,
    leaveFrom: string,
    leaveTo: string,
    title: string,
    description: string,
    status: ELeaveRequestStatus
}

export default function LeaveRequestList() {
    const { data, isLoading } = useFetchData<TMyLeaveRequest[]>({
        endpoint: QueryKey.LEAVE_REQUESTS + '/me',
        queryKey: [QueryKey.LEAVE_REQUESTS, 'me'],
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <section className="@container">
            <section className="grid @6xl:grid-cols-4 @4xl:grid-cols-3 @xl:grid-cols-2 gap-4">
                {
                    (data ?? []).map(lr => {
                        const difference = differenceInDays(new Date(lr.leaveTo), new Date(lr.leaveFrom));
                        const leaveFromDate = format(new Date(lr.leaveFrom), 'MMM dd');
                        const leaveToDate = format(new Date(lr.leaveTo), 'MMM dd');

                        const leaveDaysString = difference > 0
                            ? isSameMonth(lr.leaveTo, lr.leaveFrom)
                                ? `${difference + 1} days leave (${leaveFromDate}-${format(lr.leaveTo, 'dd')})`
                                : `${difference + 1} days leave (${leaveFromDate} - ${leaveToDate})`
                            : `${difference + 1} day leave (${leaveFromDate})`;

                        return (
                            <Card className="w-full max-w-md mx-auto" key={lr.id}>
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        <span className="text-lg font-semibold">{lr.title}</span>
                                        <Badge
                                            variant={
                                                lr.status === ELeaveRequestStatus.APPROVED
                                                    ? 'success'
                                                    : lr.status === ELeaveRequestStatus.REJECTED
                                                        ? 'destructive'
                                                        : 'default'
                                            }
                                            className="capitalize"
                                        >{lr.status}</Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-start space-x-2">
                                        <div className="shrink-0">
                                            <FileText className="size-5 mt-0.5" />
                                        </div>
                                        <LeaveRequestRequestDescription description={lr.description ?? ''} />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <CalendarDays className="size-5" />
                                        <span className="text-sm">{leaveDaysString}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Clock className="size-5" />
                                        <span className="text-sm">Applied on {format(new Date(lr.requestedOn), 'MMM dd, yyyy')}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                }
            </section>

            {
                !data?.length && (
                    <Card className="w-full my-16 flex flex-col items-center justify-center p-6 border-none">
                        <CardContent className="text-center text-muted-foreground">
                            <FileQuestion className="w-24 h-24 mx-auto mb-4" />
                            <h2 className="md:text-2xl sm:text-xl text-base font-semibold mb-2">No Leave Requests Found</h2>
                            <p className="text-muted-foreground sm:text-base text-sm">You haven't submitted any leave requests yet.</p>
                        </CardContent>
                    </Card>
                )
            }
        </section>
    )
}

export function LeaveRequestRequestDescription({ description }: { description: string }) {
    return description.length <= 100 ? (
        <p className="text-sm">{description}</p>
    ) : (
        <Dialog>
            <DialogTrigger asChild>
                <p className="text-sm cursor-pointer" title="View full description" role="button">{`${description.slice(0, 100)}...`}</p>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Description</DialogTitle>
                    <DialogDescription className="pt-5">
                        <p className="text-base leading-relaxed">
                            {description}
                        </p>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}