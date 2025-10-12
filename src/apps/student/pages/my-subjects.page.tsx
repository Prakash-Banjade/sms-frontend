import { useGetSubjects } from "@/apps/admin/components/subjects/data-access";
import ContainerLayout from "@/components/page-layouts/container-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Eye, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ESubjectType } from "@/types/global.type";
import NotAvailable from "@/components/ui/not-available";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TMySubject } from "../types/my-subject.type";
import { getFormattedUpcomingDate, getNearestSchedule } from "../utils/utils";

export default function MySubjectsPage() {

    return (
        <ContainerLayout
            title="My Subjects"
            description="View and manage your enrolled subjects"
        >
            <SubjectsList />
        </ContainerLayout>
    )
}

function SubjectsList() {
    const { data, isLoading } = useGetSubjects<TMySubject>({});

    if (isLoading) return <div>Loading...</div>;

    if (!data || data?.data.length === 0) {
        return (
            <div className="h-[50vh] flex items-center justify-center font-semibold text-muted-foreground">
                No subjects available!!
            </div>
        );
    }

    return (
        <section className="@container">
            <div className="grid grid-cols-1 gap-6 @lg:grid-cols-2 @4xl:grid-cols-3">
                {data.data.map((subject) => {
                    const upcommingSchedule = getNearestSchedule(subject.classRoutines);
                    const scheduleDate = getFormattedUpcomingDate(upcommingSchedule) ?? null;
                    const teacherName = upcommingSchedule?.teacher ? (upcommingSchedule?.teacher?.firstName + " " + upcommingSchedule?.teacher?.lastName) : <NotAvailable />

                    return (
                        <Card key={subject.id} className="overflow-hidden">
                            <CardHeader>
                                <div className="flex justify-between">
                                    <div>
                                        <CardTitle>{subject.subjectName}</CardTitle>
                                        <p className="text-sm text-gray-500">{subject.subjectCode}</p>
                                    </div>

                                    <div>
                                        <Badge variant={subject.type === ESubjectType.Regular ? "secondary" : "outline"} className="capitalize">{subject.type}</Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <section className="space-y-3 pt-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users className="h-4 w-4 text-gray-500" />
                                        <span>{teacherName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span>Next class: {scheduleDate || <NotAvailable />}</span>
                                    </div>
                                    <Button variant={'default'} className="w-full" asChild>
                                        <Link to={subject.id}>
                                            <Eye /> View
                                        </Link>
                                    </Button>
                                </section>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </section>
    )
}