import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useParams } from "react-router-dom";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ClassRoomAttendancePeriod, useGetClassRoomAttendanceStatisticsByDay } from "./data-access";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FacetedFilter } from "@/components/data-table/faceted-filter";
import { AttendanceStatusMappings } from "@/utils/labelToValueMappings";
import { EAttendanceStatus } from "@/types/global.type";
import { Payload } from "recharts/types/component/DefaultLegendContent";

export default function ClassRoomAttendanceChart({ totalStudents }: { totalStudents: number }) {
    const { id } = useParams();
    const [filter, setFilter] = useState<ClassRoomAttendancePeriod>(ClassRoomAttendancePeriod.THIS_WEEK);
    const [selectedStatus, setSelectedStatus] = useState<string[]>([EAttendanceStatus.PRESENT]);

    const { data, isLoading } = useGetClassRoomAttendanceStatisticsByDay({
        id: id!,
        queryString: `period=${filter}`,
    })

    if (isLoading) return <div>Loading...</div>;

    if (!data) return <div>No data found</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center justify-between">
                    <span>Regular Student Attendance</span>
                    <section className="flex gap-2 items-end">
                        <FacetedFilter
                            options={Object.entries(AttendanceStatusMappings).map(([key, value]) => ({ label: key, value }))}
                            searchKey="period"
                            title="Period"
                            externalSelectedValue={selectedStatus}
                            setExternalSelectedValue={setSelectedStatus}
                            popoverAlign="end"
                        />
                        <Select value={filter} onValueChange={val => setFilter(val as ClassRoomAttendancePeriod)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ClassRoomAttendancePeriod.THIS_WEEK}>This week</SelectItem>
                                <SelectItem value={ClassRoomAttendancePeriod.THIS_MONTH}>This month</SelectItem>
                                <SelectItem value={ClassRoomAttendancePeriod.PAST_7_DAYS}>Past 7 days</SelectItem>
                                <SelectItem value={ClassRoomAttendancePeriod.PAST_30_DAYS}>Past 30 days</SelectItem>
                            </SelectContent>
                        </Select>
                    </section>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="attendanceDate" />
                            <YAxis domain={[0, totalStudents]} />
                            <Tooltip contentStyle={{ background: 'hsl(var(--background))' }} />
                            <Legend payload={
                                [
                                    { value: 'totalPresentStudentsCount', color: 'hsl(var(--success))', formatter: () => 'Present', type: "line", dataKey: 'present' },
                                    { value: 'totalAbsentStudentsCount', color: 'hsl(var(--destructive))', formatter: () => 'Absent', type: "line", dataKey: 'absent' },
                                    { value: 'totalLateStudentsCount', color: 'hsl(var(--info))', formatter: () => 'Late', type: "line", dataKey: 'late' },
                                    { value: 'totalLeaveStudentsCount', color: 'hsl(var(--warning))', formatter: () => 'Leave', type: "line", dataKey: 'leave' },
                                ].filter(item => selectedStatus.includes(item.dataKey)) as Payload[]
                            } />
                            {
                                selectedStatus.includes(EAttendanceStatus.PRESENT) && <Line type="monotone" dataKey="totalPresentStudentsCount" stroke="hsl(var(--success))" activeDot={{ r: 8 }} />
                            }
                            {
                                selectedStatus.includes(EAttendanceStatus.ABSENT) && <Line type="monotone" dataKey="totalAbsentStudentsCount" stroke="hsl(var(--destructive))" activeDot={{ r: 8 }} />
                            }
                            {
                                selectedStatus.includes(EAttendanceStatus.LATE) && <Line type="monotone" dataKey="totalLateStudentsCount" stroke="hsl(var(--info))" activeDot={{ r: 8 }} />
                            }
                            {
                                selectedStatus.includes(EAttendanceStatus.LEAVE) && <Line type="monotone" dataKey="totalLeaveStudentsCount" stroke="hsl(var(--warning))" activeDot={{ r: 8 }} />
                            }
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}