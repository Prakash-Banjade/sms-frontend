import ContainerLayout from "@/components/page-layouts/container-layout";
import { ETask, Role } from "@/types/global.type";
import TaskSubmitForm from "../../components/tasks/task-submit-form";
import { Navigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { format } from "date-fns";

type Props = {
    type: ETask;
}

const locationStateSchema = z.object({
    title: z.string(),
    deadline: z.string(),
})

export default function TaskSubmitPage({ type }: Props) {
    const location = useLocation();

    const { success, data } = locationStateSchema.safeParse(location.state);

    if (!success) return <Navigate to={`/${Role.STUDENT}/tasks/${type}s`} />

    return (
        <ContainerLayout
            title={`Submit ${type}`}
            description="Submit a task for evaluation"
        >
            <section>
                <h3 className="font-semibold text-lg">{data.title}</h3>
                <p>Deadline: {format(data.deadline, 'EEE dd MMM, yyyy')}</p>
            </section>
            <TaskSubmitForm type={type} />
        </ContainerLayout>
    )
}