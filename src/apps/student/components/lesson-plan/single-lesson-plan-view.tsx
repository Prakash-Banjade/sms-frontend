import { ELessonPlanStatus } from '@/apps/admin/types/lesson-plan.type';
import { useGetLessonPlans } from '@/apps/teacher/data-access/lesson-plan-data-access'
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { createQueryString } from '@/utils/create-query-string';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

type Props = {
    id: string
}

export default function SingleLessonPlanView({ id }: Props) {
    const navigate = useNavigate();

    const { data, isLoading } = useGetLessonPlans({
        queryString: createQueryString({
            subjectId: id
        }),
        options: { enabled: !!id }
    });

    if (isLoading) return <div>Loading...</div>;

    if (!data?.data?.length) return <div className='text-muted-foreground text-sm'>No plan yet!</div>;

    return (
        <section>
            {
                data.data?.map(lessonPlan => {
                    return (
                        <Card role='button' key={lessonPlan.id} onClick={() => navigate(lessonPlan.id)}>
                            <CardHeader>
                                <CardTitle className='flex flex-row justify-between items-center gap-4'>
                                    {lessonPlan.title}
                                    <Badge
                                        className='capitalize text-base'
                                        variant={
                                            lessonPlan.status === ELessonPlanStatus.Completed
                                                ? "success"
                                                : lessonPlan.status === ELessonPlanStatus.In_Progress
                                                    ? "info"
                                                    : "outline"
                                        }
                                    >
                                        {lessonPlan.status.replace("_", " ")}
                                    </Badge>
                                </CardTitle>
                                <CardDescription>
                                    {
                                        format(lessonPlan.startDate, "dd/MM/yyyy") + " - " + format(lessonPlan.endDate, "dd/MM/yyyy")
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                Created by: <span className='font-medium'>{lessonPlan.createdBy.firstName} {lessonPlan.createdBy.lastName}</span>
                            </CardContent>
                        </Card>
                    )
                })
            }
        </section>
    )
}