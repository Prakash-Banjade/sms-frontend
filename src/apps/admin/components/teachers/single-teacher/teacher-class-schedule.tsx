import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetTeacherClassSchedule } from "../actions"
import { useParams } from "react-router-dom"
import { DayOfWeekMappings } from "@/utils/labelToValueMappings"
import { useMemo, useState } from "react";
import { parse, compareAsc } from 'date-fns';
import { EDayOfWeek } from "@/types/global.type"
import { createQueryString } from "@/utils/create-query-string"

export default function TeacherClassSchecule() {
    const params = useParams();
    const [selectedDay, setSelectedDay] = useState<EDayOfWeek>(EDayOfWeek.MONDAY);

    const { data, isLoading } = useGetTeacherClassSchedule({
        id: params.id!,
        queryString: createQueryString({ dayOfTheWeek: selectedDay }),
        options: { enabled: !!params?.id }
    });

    const sortedSchedule = useMemo(() => {
        if (!data?.length) return [];

        return data.sort((a, b) => compareAsc(
            parse(a.startTime, 'HH:mm', new Date()),
            parse(b.startTime, 'HH:mm', new Date())
        ));
    }, [data]);

    if (isLoading) return <div>Loading...</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Class Schedule</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs value={selectedDay} onValueChange={val => setSelectedDay(val as EDayOfWeek)}> 
                    <TabsList className="w-full h-auto flex flex-wrap gap-2">
                        {Object.entries(DayOfWeekMappings).map(([key, value]) => (
                            <TabsTrigger key={value} value={value} className="flex-1">{key}</TabsTrigger>
                        ))}
                    </TabsList>
                    {Object.entries(DayOfWeekMappings).map(([key, value]) => (
                        <TabsContent key={key} value={value}>
                            {
                                !!sortedSchedule?.length ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Time</TableHead>
                                                <TableHead>Class</TableHead>
                                                <TableHead>Subject</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {sortedSchedule.map((schedule, index) => {
                                                return (
                                                    <TableRow key={index}>
                                                        <TableCell>{schedule?.startTime + ' - ' + schedule?.endTime}</TableCell>
                                                        <TableCell>{schedule.classRoomName}</TableCell>
                                                        <TableCell>{schedule.subjectName}</TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-center my-10 text-sm text-muted-foreground">No Schedule</p>
                                )
                            }
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
    )
}