import { CalendarIcon, FileIcon, UserIcon, BookOpenIcon, UsersIcon, PencilIcon, CheckCircleIcon, CalendarCheck, TrendingUp, ListRestart } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ELessonPlanStatus } from '@/apps/admin/types/lesson-plan.type'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import LessonPlanSkeleton from '../../components/lesson-plan/single-lesson-plan-loading'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useGetLessonPlan } from '../../components/lesson-plan/data-access'
import { formatDate } from '@/utils/format-date'
import { useAppMutation } from '@/hooks/useAppMutation'
import { QueryKey } from '@/react-query/queryKeys'
import LoadingButton from '@/components/forms/loading-button'
import { useAuth } from '@/contexts/auth-provider'
import { useEffect } from 'react'
import { useSidebar } from '@/components/ui/sidebar'

export default function SingleLessonPlanPage() {
    const params = useParams();
    const { payload } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { setDynamicBreadcrumb } = useSidebar();

    const { data: lessonPlan, isLoading } = useGetLessonPlan({
        id: params.id!,
        options: { enabled: !!params.id }
    });

    useEffect(() => {
        setDynamicBreadcrumb([
            {
                label: lessonPlan?.title ?? '',
                url: `/lesson-plans/${lessonPlan?.id}`,
            }
        ])
    }, [lessonPlan]);

    const { mutateAsync, isPending } = useAppMutation();

    const handleChangeStatus = async (status: ELessonPlanStatus) => {
        await mutateAsync({
            method: 'patch',
            endpoint: `${QueryKey.LESSON_PLANS}/${lessonPlan?.id}/change-status`,
            data: { status },
            invalidateTags: [QueryKey.LESSON_PLANS, lessonPlan?.id!],
        });
    }

    if (isLoading) return <LessonPlanSkeleton />

    if (!lessonPlan) return <Navigate to={`/${payload?.role}/lesson-plans`} />;

    return (
        <div className="container mx-auto">
            <header className="flex gap-5 items-end">
                <h1 className="text-3xl font-bold">{lessonPlan.title}</h1>
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
            </header>
            <div className="mt-10 @container">
                <div className="grid grid-cols-1 @5xl:grid-cols-3 gap-6">
                    <div className="@5xl:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Lesson Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2 text-sm">
                                        <BookOpenIcon className="w-5 h-5 text-gray-500" />
                                        <span className="font-medium">Subject:</span>
                                        <span>{lessonPlan.subject.subjectName}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm">
                                        <CalendarIcon className="w-5 h-5 text-gray-500" />
                                        <span className="font-medium">Start Date:</span>
                                        <span>{formatDate({ date: new Date(lessonPlan.startDate) })}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm">
                                        <CalendarCheck className="w-5 h-5 text-gray-500" />
                                        <span className="font-medium">End Date:</span>
                                        <span>{formatDate({ date: new Date(lessonPlan.endDate) })}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm">
                                        <UserIcon className="w-5 h-5 text-gray-500" />
                                        <span className="font-medium">Created by:</span>
                                        {
                                            lessonPlan.createdBy
                                                ? <span>{lessonPlan.createdBy.firstName} {lessonPlan.createdBy.lastName}</span>
                                                : <span className="text-muted-foreground">N/A</span>
                                        }
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{lessonPlan.description}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Attachments</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {lessonPlan.attachments.length > 0 ? (
                                    <ul className="space-y-2">
                                        {lessonPlan.attachments.map((attachment) => (
                                            <li key={attachment.id} className="flex items-center space-x-2">
                                                <FileIcon className="w-5 h-5 text-muted-foreground" />
                                                <a
                                                    href={attachment.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {attachment.originalName}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted-foreground">No attachments available.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                    <div className='space-y-6'>
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex flex-row gap-5 items-end'>
                                    Class Rooms
                                    <Badge variant="outline" className="capitalize text-base">
                                        {
                                            (!!lessonPlan.classRooms?.length && lessonPlan.classRooms[0].parent?.name)
                                                ? lessonPlan.classRooms[0].parent?.name
                                                : lessonPlan.classRooms[0].name
                                        }
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {lessonPlan.classRooms?.length && lessonPlan.classRooms[0].parent?.name &&
                                        lessonPlan.classRooms.map((classroom) => (
                                            <div key={classroom.id} className="flex items-center space-x-2">
                                                <UsersIcon className="w-5 h-5 text-muted-foreground" />
                                                <span>{classroom.name}</span>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-4">
                                    <Button className="w-full" variant="outline" onClick={() => navigate(`/${payload?.role}/lesson-plans/${lessonPlan.id}/edit`, { state: { from: location } })}>
                                        <PencilIcon className="w-4 h-4 mr-2" />
                                        Edit Lesson Plan
                                    </Button>
                                    {
                                        lessonPlan?.status === ELessonPlanStatus.In_Progress && (
                                            <LoadingButton
                                                type="button"
                                                isLoading={isPending}
                                                loadingText='Saving...'
                                                onClick={() => handleChangeStatus(ELessonPlanStatus.Completed)}
                                            >
                                                <CheckCircleIcon className="w-4 h-4 mr-2" />
                                                Mark as Complete
                                            </LoadingButton>
                                        )
                                    }
                                    {
                                        lessonPlan?.status === ELessonPlanStatus.Not_Started && (
                                            <LoadingButton
                                                type="button"
                                                isLoading={isPending}
                                                loadingText='Saving...'
                                                onClick={() => handleChangeStatus(ELessonPlanStatus.In_Progress)}
                                            >
                                                <TrendingUp className="w-4 h-4 mr-2" />
                                                Set In Progress
                                            </LoadingButton>
                                        )
                                    }
                                    {
                                        lessonPlan?.status === ELessonPlanStatus.Completed && (
                                            <LoadingButton
                                                type="button"
                                                isLoading={isPending}
                                                loadingText='Saving...'
                                                onClick={() => handleChangeStatus(ELessonPlanStatus.Not_Started)}
                                            >
                                                <ListRestart className="w-4 h-4 mr-2" />
                                                Mark as Not Started
                                            </LoadingButton>
                                        )
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div >
    )
}