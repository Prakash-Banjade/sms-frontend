import { CalendarIcon, FileIcon, GraduationCapIcon, Highlighter, UsersIcon } from "lucide-react"
import { format } from "date-fns"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TSingleTask } from "@/types/task.type"

export default function SingleTaskDetailsCard({ task }: { task: TSingleTask }) {


    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="capitalize">{task.taskType} Details</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <div className="flex items-center gap-2">
                        <GraduationCapIcon className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold">Class:</span> {task.classRooms[0].parent?.name || task.classRooms[0].name}
                    </div>
                    {
                        task.classRooms[0]?.parent?.id && ( // if the classroom are sections, then only show this; parent exists means classRooms are sections
                            <div className="flex items-center gap-2">
                                <UsersIcon className="h-5 w-5 text-muted-foreground" />
                                <span className="font-semibold">Sections:</span>
                                <div className="flex gap-2">
                                    {task.classRooms?.map((section) => (
                                        <Badge key={section.id} variant="secondary">
                                            {section.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )
                    }
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold capitalize">{task.taskType} Date:</span>
                        {format(task.createdAt, "MMMM d, yyyy")}
                    </div>
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold">Submission Date:</span>
                        {format(task.deadline, "MMMM d, yyyy")}
                    </div>
                    <div className="flex items-center gap-2">
                        <Highlighter className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold">Marks:</span>
                        {task.marks}
                    </div>
                    {
                        !!task?.attachments?.length && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold mb-2">Attachments:</h3>
                                    <ul className="space-y-2">
                                        {task.attachments.map((attachment, index) => (
                                            <li key={index}>
                                                <a href={attachment.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700 hover:underline">
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
                </div>
            </CardContent>
        </Card>
    )
}