import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarOff, Clock } from 'lucide-react'
import { useGetAdminDashboardLeaveRequests } from "../../data-access/dashboard-data-access"
import { ProfileAvatar } from "@/components/ui/avatar"
import { differenceInDays, format, formatDistanceToNow, isSameMonth } from "date-fns"
import { getImageUrl } from "@/lib/utils"
import { Link } from "react-router-dom"
import { useAppMutation } from "@/hooks/useAppMutation"
import { ELeaveRequestStatus } from "@/types/global.type"
import { QueryKey } from "@/react-query/queryKeys"
import LeaveRequestsLoadingSkeleton from "./leave-request-skeleton"
import { useAuth } from "@/contexts/auth-provider"

export default function Dashboard_LeaveRequests() {
    const { data: leaveRequests, isLoading } = useGetAdminDashboardLeaveRequests({});
    const { payload } = useAuth()

    const { mutateAsync } = useAppMutation();

    const handleUpdateStatus = async (id: string, status: ELeaveRequestStatus) => {
        await mutateAsync({
            method: "patch",
            endpoint: QueryKey.LEAVE_REQUESTS + `/${id}/updateStatus`,
            data: { status },
            invalidateTags: [QueryKey.LEAVE_REQUESTS],
        });
    };

    if (isLoading) return <LeaveRequestsLoadingSkeleton />;

    return (
        <Card className="w-full h-fit">
            <CardHeader>
                <CardTitle>Pending Leave Requests</CardTitle>
                <CardDescription className="text-muted-foreground">Review and manage leave requests from students and teachers</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="students" className="space-y-4">
                    <TabsList className="w-full grid grid-cols-2">
                        <TabsTrigger value="students">Students</TabsTrigger>
                        <TabsTrigger value="teachers">Teachers</TabsTrigger>
                    </TabsList>
                    <TabsContent value="students" className="space-y-4">
                        {
                            !!leaveRequests?.studentsLeaveRequests?.data?.length ?
                                <div className="space-y-4">
                                    {
                                        leaveRequests?.studentsLeaveRequests?.data?.map(leaveRequest => {
                                            const difference = differenceInDays(new Date(leaveRequest.leaveTo), new Date(leaveRequest.leaveFrom));
                                            const leaveFromDate = format(new Date(leaveRequest.leaveFrom), 'MMM dd');
                                            const leaveToDate = format(new Date(leaveRequest.leaveTo), 'MMM dd');

                                            const leaveDaysString = difference > 0
                                                ? isSameMonth(leaveRequest.leaveTo, leaveRequest.leaveFrom)
                                                    ? `${difference + 1} days leave (${leaveFromDate}-${format(leaveRequest.leaveTo, 'dd')})`
                                                    : `${difference + 1} days leave (${leaveFromDate} - ${leaveToDate})`
                                                : `${difference + 1} day leave (${leaveFromDate})`;

                                            return (
                                                <div className="flex gap-4 rounded-lg p-4 bg-secondary/20" key={leaveRequest.id}>
                                                    <ProfileAvatar className="size-12" name={leaveRequest.studentName} src={getImageUrl(leaveRequest.profileImageUrl, 'w=48')} />
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex items-center gap-1 flex-wrap">
                                                            <p className="font-medium">{leaveRequest.studentName}</p>
                                                            <span className="text-sm text-muted-foreground">{leaveRequest.classRoomName}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <CalendarOff className="size-4 text-muted-foreground" />
                                                            <p className="text-sm text-muted-foreground">{leaveDaysString}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="size-4 text-muted-foreground" />
                                                            <p className="text-sm text-muted-foreground">Requested {formatDistanceToNow(leaveRequest.createdAt)} ago</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1 flex-col">
                                                        <Button type="button" variant={'ghost'} size={'sm'} onClick={() => handleUpdateStatus(leaveRequest.id, ELeaveRequestStatus.REJECTED)}>Reject</Button>
                                                        <Button type="button" size={'sm'} onClick={() => handleUpdateStatus(leaveRequest.id, ELeaveRequestStatus.APPROVED)}>Approve</Button>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    <div className="flex justify-between gap-5 items-center text-sm text-muted-foreground">
                                        <span>Total: {leaveRequests?.studentsLeaveRequests?.total}</span>
                                        <Link
                                            to={`/${payload?.role}/students/attendance/leave-requests?status=pending`}
                                            className="hover:underline text-foreground"
                                        >
                                            View All
                                        </Link>
                                    </div>
                                </div>
                                : <p className="p-8 text-center text-muted-foreground text-sm">No pending leave requests</p>
                        }
                    </TabsContent>
                    <TabsContent value="teachers" className="space-y-4">
                        {
                            !!leaveRequests?.teachersLeaveRequests?.data?.length ?
                                <div className="space-y-4">
                                    {
                                        leaveRequests?.teachersLeaveRequests?.data?.map(leaveRequest => {
                                            const difference = differenceInDays(new Date(leaveRequest.leaveTo), new Date(leaveRequest.leaveFrom));
                                            const leaveFromDate = format(new Date(leaveRequest.leaveFrom), 'MMM dd');
                                            const leaveToDate = format(new Date(leaveRequest.leaveTo), 'MMM dd');

                                            const leaveDaysString = difference > 0
                                                ? isSameMonth(leaveRequest.leaveTo, leaveRequest.leaveFrom)
                                                    ? `${difference + 1} days leave (${leaveFromDate}-${format(leaveRequest.leaveTo, 'dd')})`
                                                    : `${difference + 1} days leave (${leaveFromDate} - ${leaveToDate})`
                                                : `${difference + 1} day leave (${leaveFromDate})`;

                                            return (
                                                <div className="flex gap-4 rounded-lg p-4 bg-secondary/20" key={leaveRequest.id}>
                                                    <ProfileAvatar className="size-12" name={leaveRequest.teacherName} src={getImageUrl(leaveRequest.profileImageUrl, 'w=48')} />
                                                    <div className="flex-1 space-y-1">
                                                        <p className="font-medium">{leaveRequest.teacherName}</p>
                                                        <div className="flex items-center gap-2">
                                                            <CalendarOff className="size-4 text-muted-foreground" />
                                                            <p className="text-sm text-muted-foreground">{leaveDaysString}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="size-4 text-muted-foreground" />
                                                            <p className="text-sm text-muted-foreground">Requested {formatDistanceToNow(leaveRequest.createdAt)} ago</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1 flex-col">
                                                        <Button type="button" variant={'ghost'} size={'sm'} onClick={() => handleUpdateStatus(leaveRequest.id, ELeaveRequestStatus.REJECTED)}>Reject</Button>
                                                        <Button type="button" size={'sm'} onClick={() => handleUpdateStatus(leaveRequest.id, ELeaveRequestStatus.APPROVED)}>Approve</Button>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    <div className="flex justify-between gap-5 items-center text-sm text-muted-foreground">
                                        <span>Total: {leaveRequests?.teachersLeaveRequests?.total}</span>
                                        <Link
                                            to={`/${payload?.role}/employees/leave-requests?status=pending`}
                                            className="hover:underline text-foreground"
                                        >
                                            View All
                                        </Link>
                                    </div>
                                </div>
                                : <p className="p-8 text-center text-muted-foreground text-sm">No pending leave requests</p>
                        }
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}