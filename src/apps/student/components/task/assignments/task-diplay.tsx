
import { useGetTasks } from "@/apps/admin/components/tasks/action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ETask, ETaskSubmissionStatus } from "@/types/global.type"
import { createQueryString } from "@/utils/create-query-string";
import { formatDate } from "@/utils/format-date";
import { CheckCircle2, Upload, Calendar, BookOpen, Award } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

type Props = {
    type: ETask
}

const TaskDisplay = ({ type }: Props) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { data, isLoading } = useGetTasks({
        queryString: createQueryString({
            taskType: type,
            search: searchParams.get("search"),
            overdue: searchParams.get("overdue")
        }),
    });

    if (isLoading) return <div>Loading...</div>;
    if (!data) { return <div>No task available</div> }
    else if (data?.data.length === 0) {
        return (
            <div className="h-[50vh] flex items-center justify-center font-semibold text-muted-foreground">
                {`No ${type}  available`}
            </div>
        );
    }


    return (
        <div className="mx-auto container  grid grid-cols-1 lg:grid-cols-2 gap-10">
            {data?.data?.map((task) => {
                return (
                    <Card key={task.id} className='space-y-4'>
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle className="flex items-center space-x-2 capitalize">
                                <span>{task.title}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <BookOpen className="h-5 w-5 text-gray-500" />
                                <p><strong>Subject :</strong> {task.subjectName}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-5 w-5 text-gray-500" />
                                <p><strong>Due Date :</strong> {formatDate({ date: new Date(task.deadline) })}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Award className="h-5 w-5 text-gray-500" />
                                <p><strong>Marks :</strong> {task.marks}</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            {task.submission[0].status === ETaskSubmissionStatus.Submitted ? (
                                <Button variant="success" className="w-full flex items-center justify-center" onClick={() => navigate(task.id)}>
                                    <CheckCircle2 className="mr-2 h-4 w-4 " /> Submitted
                                </Button>
                            ) : (
                                <Button className="w-full flex items-center justify-center" onClick={() => navigate(task.id)}>
                                    <Upload className="mr-2 h-4 w-4 text-primary-foreground" /> View Details
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}

export default TaskDisplay;

