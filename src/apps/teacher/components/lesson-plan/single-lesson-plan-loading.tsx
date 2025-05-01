import { BookOpenIcon, CalendarIcon, CheckCircleIcon, ClockIcon, FileIcon, PencilIcon, UserIcon, UsersIcon } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Role } from '@/types/global.type'
import { useAuth } from '@/contexts/auth-provider'

export default function LessonPlanSkeleton() {
    const { payload } = useAuth();

    return (
        <div className="container mx-auto">
            <header className="flex gap-5 items-end">
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-6 w-24" />
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
                                    {['Subject', 'Date', 'Time', 'Created by'].map((item, index) => (
                                        <div key={index} className="flex items-center space-x-2 text-sm">
                                            {index === 0 && <BookOpenIcon className="w-5 h-5 text-gray-500" />}
                                            {index === 1 && <CalendarIcon className="w-5 h-5 text-gray-500" />}
                                            {index === 2 && <ClockIcon className="w-5 h-5 text-gray-500" />}
                                            {index === 3 && <UserIcon className="w-5 h-5 text-gray-500" />}
                                            <span className="font-medium">{item}:</span>
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-20 w-full" />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Attachments</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {[1, 2, 3].map((_, index) => (
                                        <li key={index} className="flex items-center space-x-2">
                                            <FileIcon className="w-5 h-5 text-muted-foreground" />
                                            <Skeleton className="h-4 w-40" />
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                    {
                        payload?.role === Role.TEACHER && (
                            <div className='space-y-6'>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Class Rooms</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {[1, 2, 3].map((_, index) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <UsersIcon className="w-5 h-5 text-muted-foreground" />
                                                    <Skeleton className="h-4 w-24" />
                                                    <Skeleton className="h-4 w-16" />
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
                                            <Button className="w-full" variant="outline" disabled>
                                                <PencilIcon className="w-4 h-4 mr-2" />
                                                Edit Lesson Plan
                                            </Button>
                                            <Button className="w-full" disabled>
                                                <CheckCircleIcon className="w-4 h-4 mr-2" />
                                                Mark as Complete
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}