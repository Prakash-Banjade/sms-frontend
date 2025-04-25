import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createQueryString } from "@/utils/create-query-string";
import { Task_StudentResponse } from "../../data-access/tasks-data-access";
import { ETask, Role } from "@/types/global.type";
import { Button } from "@/components/ui/button";
import { useGetTasks } from "@/apps/admin/components/tasks/action";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function RemainingAssignmentsCard() {
    const navigate = useNavigate();

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle className="justify-between flex items-center">
                    <span>Remaining Assignments</span>
                    <Button type="button" variant={'outline'} size={'sm'} onClick={() => navigate(`/${Role.STUDENT}/tasks/assignments?tab=pending`)}>
                        View all
                    </Button>
                </CardTitle>
                <CardDescription>Tasks that need to be completed</CardDescription>
            </CardHeader>

            <CardContent>
                <Content />
            </CardContent>
        </Card>
    )
}

function Content() {
    const { data, isLoading } = useGetTasks<Task_StudentResponse>({
        queryString: createQueryString({
            taskType: ETask.ASSIGNMENT,
            category: 'pending',
        })
    });

    if (isLoading) return <LoadingSkeleton />;

    if (data?.data?.length === 0) return (
        <p className="text-muted-foreground text-sm text-center py-8">😀 Hurray! No assignments pending!</p>
    )

    return (
        <div className="space-y-4">
            {data?.data.map((assignment) => (
                <div key={assignment.id} className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="font-medium">{assignment.title}</p>
                        <p className="text-sm text-muted-foreground">{assignment.subjectName}</p>
                    </div>
                    <Badge variant="outline" className="text-xs whitespace-nowrap">
                        Due {format(assignment.deadline, "dd MMM yyyy")}
                    </Badge>
                </div>
            ))}
        </div>
    )
}

function LoadingSkeleton() {
    return <div className="space-y-2">
        {
            [...Array(2)].map((_, index) => (
                <Card key={index} className="border-0">
                    <CardHeader className="p-0 flex justify-between items-center flex-row">
                        <Skeleton className="h-5 w-3/5" />
                        <Skeleton className="h-5 w-20" />
                    </CardHeader>
                    <CardContent className="px-0 pt-1">
                        <Skeleton className="h-3 w-32" />
                    </CardContent>
                </Card>
            ))
        }
    </div>
}