import { useParams } from "react-router-dom";
import { useGetTask } from "../../components/tasks/action";
import SingleTaskDetailsCard from "../../components/tasks/single-task-details-card";
import TaskSubmissionStatisticsCard from "../../components/tasks/task-submission-statistics-card";
import TaskSubmissionsCard from "../../components/tasks/task-submissions-card";

export default function SingleTaskPage() {
    const { id } = useParams();

    const { data: task, isLoading } = useGetTask({ id: id! }); // this component is used in a dynamic route, so used not null 

    if (isLoading) return <div>Loading...</div>;

    if (!task) return <div>Task not found</div>;

    return (
        <section className="container @container mx-auto space-y-8">
            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">{task.title}</h1>
                    <p className="text-muted-foreground mt-2">{task.description}</p>
                </div>
            </header>
            <div className="grid @5xl:grid-cols-3 gap-6">
                <section className="@5xl:col-span-2">
                    <SingleTaskDetailsCard task={task} />
                </section>

                <TaskSubmissionStatisticsCard taskId={id!} />
            </div>

            <TaskSubmissionsCard taskId={id!} />
        </section>
    )
}

