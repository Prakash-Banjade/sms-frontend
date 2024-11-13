"use client"
import { useGetTask } from "@/apps/admin/components/tasks/action";
import { useParams } from "react-router-dom"
import TaskSubmissionForm from "./task-submission";
import { Card } from "@/components/ui/card";
import TaskDetails from "./task-details";
import { ETaskSubmissionStatus } from "@/types/global.type";

const SingleStudentTask = () => {
    const { id } = useParams();
    const { data: task, isLoading } = useGetTask({ id: id! }); // this component is used in a dynamic route, so used not null
    if (isLoading) return <div>Loading...</div>;
    if (!task) return <div>Task not found</div>;

    // Check if submissions array is empty
    const content = task.submissions.length > 0 ? task.submissions[0].content : "";
    const status = task.submissions.length > 0 ? task.submissions[0].status : ETaskSubmissionStatus.Not_Submitted;
    const attachments = task.submissions.length > 0 ? task.submissions[0].attachments.map((attachment) => ({
        id: attachment.id,
        url: attachment.url
    })) : [];


    return (
        <section className="container @container mx-auto space-y-8">
            <TaskDetails task={task} />


            <Card className="flex flex-col gap-6 p-4 ">
                <h2 className="font-semibold text-xl ">{`Submit your ${task.taskType}`}</h2>
                <TaskSubmissionForm type={task.taskType} id={task.id} status={status} content={content} attachments={attachments} />
            </Card>

        </section>
    )
}

export default SingleStudentTask
