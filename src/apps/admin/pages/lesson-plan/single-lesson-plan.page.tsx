import { CalendarIcon, ClockIcon, FileIcon, UserIcon, BookOpenIcon, UsersIcon, PencilIcon, CheckCircleIcon } from 'lucide-react'
import { format } from "date-fns"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ELessonPlanStatus } from '@/types/lesson-plan.type'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const lessonPlan = {
    "id": "9f67c97f-32f4-40c0-aefe-3b4c61037dc1",
    "createdAt": "2024-11-17T07:13:49.700Z",
    "startDate": "2024-11-17T18:15:00.000Z",
    "endDate": "2024-11-17T18:15:00.000Z",
    "title": "Lesson 1 complete",
    "description": "Hello wthere",
    "status": "not_started",
    "subject": {
        "id": "4a327369-030c-43b0-9617-3c8d3f3e0b4a",
        "subjectName": "OPT Math"
    },
    "createdBy": {
        "isVerified": false,
        "firstName": "Prakash",
        "lastName": "Banjade"
    },
    "attachments": [
        {
            "id": "eab6f24b-e4d4-4416-90a3-23ba8d4d254b",
            "url": "http://localhost:8000/api/upload/files/get-file/gitika_resumepdf-bhMIKlBBgW.pdf",
            "originalName": "gitika_resume.pdf"
        }
    ],
    "classRooms": [
        {
            "id": "6f0ec48d-737a-4399-a47b-f53781c54a66",
            "name": "A One",
            "parent": {
                "id": "682659d1-e679-49fd-ab82-10fcc0dd4e21",
                "name": "Class XYZ"
            }
        },
        {
            "id": "e37ca76f-8753-4f20-898e-9be42b10f6a9",
            "name": "B Positive",
            "parent": {
                "id": "682659d1-e679-49fd-ab82-10fcc0dd4e21",
                "name": "Class XYZ"
            }
        }
    ]
}

export default function SingleLessonPlanPage() {
    const formatDate = (date: string) => format(new Date(date), "PPP")
    const formatTime = (date: string) => format(new Date(date), "p")

    if (!lessonPlan) {
        return <LessonPlanSkeleton />
    }

    return (
        <div className="container mx-auto">
            <header className="flex gap-5 items-end">
                <h1 className="text-3xl font-bold">{lessonPlan.title}</h1>
                <Badge
                    className='capitalize'
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
                                        <span className="font-medium">Date:</span>
                                        <span>{formatDate(lessonPlan.startDate)}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm">
                                        <ClockIcon className="w-5 h-5 text-gray-500" />
                                        <span className="font-medium">Time:</span>
                                        <span>{formatTime(lessonPlan.startDate)} - {formatTime(lessonPlan.endDate)}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm">
                                        <UserIcon className="w-5 h-5 text-gray-500" />
                                        <span className="font-medium">Created by:</span>
                                        <span>{lessonPlan.createdBy.firstName} {lessonPlan.createdBy.lastName}</span>
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
                                <CardTitle>Class Rooms</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {lessonPlan.classRooms.map((classroom) => (
                                        <div key={classroom.id} className="flex items-center space-x-2">
                                            <UsersIcon className="w-5 h-5 text-muted-foreground" />
                                            <span>{classroom.name}</span>
                                            <span className="text-muted-foreground">({classroom.parent.name})</span>
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
                                <div className="space-y-4">
                                    <Button className="w-full" variant="outline">
                                        <PencilIcon className="w-4 h-4 mr-2" />
                                        Edit Lesson Plan
                                    </Button>
                                    <Button className="w-full">
                                        <CheckCircleIcon className="w-4 h-4 mr-2" />
                                        Mark as Complete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

function LessonPlanSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-secondary/20 shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-9 w-64" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <Skeleton className="h-64 w-full mb-6" />
                            <Skeleton className="h-40 w-full mb-6" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                        <div>
                            <Skeleton className="h-48 w-full mb-6" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}