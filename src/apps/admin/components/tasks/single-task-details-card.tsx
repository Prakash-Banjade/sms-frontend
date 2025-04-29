import { CalendarIcon, FileIcon, GraduationCapIcon, Highlighter } from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { TSingleTask } from "@/apps/admin/types/task.type"

export default function SingleTaskDetailsCard({ task }: { task: TSingleTask }) {
    const classRoomName = task.classRoom.parent ? `${task.classRoom.parent.name} - ${task.classRoom.name}` : task.classRoom.name

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="capitalize">{task.taskType} Details</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <div className="flex items-center gap-2">
                        <GraduationCapIcon className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold">Class:</span> {classRoomName}
                    </div>
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
                                                <a href={attachment.url} target="_blank" rel="noreferrer" className="flex gap-2 items-center w-fit text-blue-500 hover:text-blue-600 hover:underline">
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