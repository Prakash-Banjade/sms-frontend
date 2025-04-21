import { CheckCircle2, Clock, FileIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { differenceInCalendarDays, differenceInDays, formatDate, isToday, isTomorrow } from 'date-fns'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { useGetTaskEvaluations, useGetTasks, useGetTaskSubmissions } from '@/apps/admin/components/tasks/action'
import { createQueryString } from '@/utils/create-query-string'
import { Task_StudentResponse, TaskSubmissionsResponse } from '../../data-access/tasks-data-access'
import { ETask, ETaskSubmissionStatus } from '@/types/global.type'
import { Link } from 'react-router-dom'
import { DataTablePagination } from '@/components/data-table/data-table-pagination'
import { TaskEvaluationsResponse } from '@/apps/admin/types/task.type'

export function getRelativeDayLabel(date: Date): string {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';

    const diff = differenceInCalendarDays(date, new Date());

    if (diff === 2) return 'The day after tomorrow';
    if (diff > 2) return `In ${diff} days`;

    return 'In the past';
}

export function PendingTasks({ type }: { type: ETask }) {
    const { data, isLoading } = useGetTasks<Task_StudentResponse>({
        queryString: createQueryString({
            taskType: type,
            category: 'pending'
        })
    });

    if (isLoading) return <div>Loading...</div>;

    if (!data || data.data.length === 0) return (
        <div className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-12 w-12 text-student-success mb-3" />
            <h3 className="text-lg font-medium">No pending assignments</h3>
            <p className="text-sm text-gray-500 mt-1">
                All caught up! Check back later for new assignments.
            </p>
        </div>
    )

    return (
        <div className="space-y-4">
            {data.data.map((task) => {
                return <PendingTaskCard key={task.id} task={task} />
            })}

            <DataTablePagination meta={data?.meta} />
        </div>
    )
}

function PendingTaskCard({ task }: { task: Task_StudentResponse['data'][0] }) {
    const isNear = Math.abs(differenceInDays(new Date(task.deadline), new Date())) <= 3;

    const [isExpanded, setIsExpanded] = useState(false);

    const attachments = task.attachments;

    const attachmentsArray = Array.isArray(attachments) ? attachments : JSON.parse(attachments);

    return (
        <Card key={task.id}>
            <CardHeader className={cn("pb-2", !isExpanded && 'pb-6')}>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-lg hover:underline" role='button' onClick={() => setIsExpanded(!isExpanded)}>
                            {task.title}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 text-sm mt-1">
                            <Badge variant="outline">{task.subjectName}</Badge>
                            <span className={`text-sm ${isNear ? 'text-destructive' : 'text-student-warning'}`}>
                                Due {isNear ? getRelativeDayLabel(new Date(task.deadline)) : formatDate(task.deadline, 'ddd dd MMM yyyy')}
                            </span>
                        </div>
                    </div>
                    {
                        task.taskType === ETask.ASSIGNMENT && ( // only assignments can be submitted
                            <Button variant="default" size="sm" asChild>
                                <Link to={`submit/${task.id}`} state={{ title: task.title, deadline: task.deadline }}> {/* location is used in task submission page */}
                                    Submit
                                </Link>
                            </Button>
                        )
                    }
                </div>
            </CardHeader>
            <CardContent className={cn('transition-all origin-top overflow-hidden', isExpanded ? 'h-auto' : 'h-0 py-0')}>
                <p className="text-sm text-gray-600 pb-2 max-w-[600px] mt-5">
                    {task.description}
                </p>
                {
                    !!attachmentsArray?.length && (
                        <>
                            <Separator />
                            <div className='mt-2'>
                                <h3 className="font-semibold mb-2">Attachments:</h3>
                                <ul className="space-y-2">
                                    {attachmentsArray.map((attachment: any, index: number) => (
                                        <li key={index}>
                                            <a href={attachment.url} target="_blank" rel="noreferrer" className="text-sm flex gap-2 items-center w-fit text-blue-500 hover:text-blue-600 hover:underline">
                                                <FileIcon className="h-4 w-4 mr-2" />
                                                {attachment.originalName}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )
                }
            </CardContent>
        </Card>
    )
}

export function SubmittedTasks() {
    const [isExpanded, setIsExpanded] = useState(false);

    const { data, isLoading } = useGetTaskSubmissions<TaskSubmissionsResponse>({});

    if (isLoading) return <div>Loading...</div>;

    if (!data || data.data.length === 0) return (
        <div className="flex flex-col items-center justify-center py-12">
            <Clock className="h-12 w-12 text-student-primary mb-3" />
            <h3 className="text-lg font-medium">No submitted assignments</h3>
            <p className="text-sm text-gray-500 mt-1">
                You haven't submitted any assignments yet.
            </p>
        </div>
    );

    return (
        <div className="space-y-4">
            {data.data?.map((submission) => (
                <Card key={submission.id}>
                    <CardHeader className={cn("pb-2", !isExpanded && 'pb-6')}>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-lg hover:underline" role='button' onClick={() => setIsExpanded(!isExpanded)}>
                                    {submission.task?.title}
                                </CardTitle>
                                <div className="flex flex-wrap gap-2 text-sm mt-1">
                                    <Badge variant="outline">{submission.task?.subject?.subjectName}</Badge>
                                    <span className="text-sm text-gray-500">
                                        Submitted on {new Date(submission.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <Badge
                                variant={submission.status === ETaskSubmissionStatus.Submitted ? 'success' : 'destructive'}
                                className='capitalize'
                            >
                                {submission.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className={cn('transition-all origin-top overflow-hidden', isExpanded ? 'h-auto' : 'h-0 py-0')}>
                        <p className="text-sm text-gray-600 pb-2 max-w-[600px] mt-5">
                            {submission.note}
                        </p>
                        {
                            !!submission?.attachments?.length && (
                                <>
                                    <Separator />
                                    <div className='mt-2'>
                                        <h3 className="font-semibold mb-2">Attachments:</h3>
                                        <ul className="space-y-2">
                                            {submission.attachments.map((attachment: any, index: number) => (
                                                <li key={index}>
                                                    <a href={attachment.url} target="_blank" rel="noreferrer" className="text-sm flex gap-2 items-center w-fit text-blue-500 hover:text-blue-600 hover:underline">
                                                        <FileIcon className="h-4 w-4 mr-2" />
                                                        {attachment.originalName}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            )
                        }
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export function EvaluatedTasks() {
    const [isExpanded, setIsExpanded] = useState(false);

    const { data, isLoading } = useGetTaskEvaluations<TaskEvaluationsResponse>({});

    if (isLoading) return <div>Loading...</div>;

    if (!data || data.data.length === 0) return (
        <div className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-12 w-12 text-student-primary mb-3" />
            <h3 className="text-lg font-medium">No evaluated assignments</h3>
            <p className="text-sm text-gray-500 mt-1">
                Your submissions are still being evaluated.
            </p>
        </div>
    )

    return (
        <div className="space-y-4">
            {data.data.map((evaluation) => (
                <Card key={evaluation.id}>
                    <CardHeader className={cn("pb-2", !isExpanded && 'pb-6')}>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-lg hover:underline" role='button' onClick={() => setIsExpanded(!isExpanded)}>
                                    {evaluation.submission?.task?.title}
                                </CardTitle>
                                <div className="flex flex-wrap gap-2 text-sm mt-1">
                                    <Badge variant="outline">{evaluation.submission?.task?.subject?.subjectName}</Badge>
                                    <span className="text-sm text-gray-500">
                                        Submitted on {new Date(evaluation.submission?.createdAt as string).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            {
                                !!evaluation.submission?.task?.marks && (
                                    <div className="text-right">
                                        <p>Score</p>
                                        <div className="mt-1 text-sm font-medium">{evaluation.score} / {evaluation.submission?.task?.marks}</div>
                                    </div>
                                )
                            }
                        </div>
                    </CardHeader>
                    <CardContent className={cn('transition-all origin-top overflow-hidden space-y-3', isExpanded ? 'h-auto' : 'h-0 py-0')}>
                        <section className='mt-5'>
                            <h4 className='font-semibold'>Evaluated by</h4>
                            <p className='text-sm'>{evaluation.evaluator?.firstName} {evaluation.evaluator?.lastName}</p>
                        </section>

                        <section>
                            <h4 className='font-semibold'>Feedback</h4>
                            <p className="text-sm text-gray-600 pb-2 max-w-[600px]">
                                {evaluation.feedback}
                            </p>
                        </section>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}