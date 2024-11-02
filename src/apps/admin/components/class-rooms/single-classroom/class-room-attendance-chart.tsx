import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useParams } from "react-router-dom";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const attendanceData = [
    { date: '2023-01-01', attendance: 95 },
    { date: '2023-01-02', attendance: 92 },
    { date: '2023-01-03', attendance: 98 },
    { date: '2023-01-04', attendance: 90 },
    { date: '2023-01-05', attendance: 95 },
    { date: '2023-01-06', attendance: 88 },
    { date: '2023-01-07', attendance: 93 },
]

export default function ClassRoomAttendanceChart() {
    const { id } = useParams();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Regular Student Attendance</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={attendanceData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="attendance" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}