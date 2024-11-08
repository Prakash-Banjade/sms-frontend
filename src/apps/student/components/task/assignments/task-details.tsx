import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, FileIcon, Highlighter } from "lucide-react";
import { formatDate } from "date-fns";
import { TSingleTask } from "@/types/task.type";
type Props = {
    task: TSingleTask
}
const TaskDetails = ({ task }: Props) => {
    return (
        <div className="flex justify-between items-start">
            <div className="flex flex-col gap-5">
                <h1 className="text-3xl font-bold capitalize">{`${task.title}'s Assignment`}</h1>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                            <span className="font-semibold capitalize">{task.taskType} Date:</span>
                            {formatDate(task.createdAt, "MMMM d, yyyy")}
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                            <span className="font-semibold">Submission Date:</span>
                            {formatDate(task.deadline, "MMMM d, yyyy")}
                        </div>
                        <div className="flex items-center gap-2">
                            <Highlighter className="h-5 w-5 text-muted-foreground" />
                            <span className="font-semibold">Marks:</span>
                            {task.marks}
                        </div>
                        <p className="text-muted-foreground ">{task.description}</p>
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

            </div>
        </div>
    )
}

export default TaskDetails
