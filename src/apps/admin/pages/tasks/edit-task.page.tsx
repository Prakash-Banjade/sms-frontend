import ContainerLayout from "@/components/page-layouts/container-layout";
import { ETask } from "@/types/global.type";
import { Navigate, useParams } from "react-router-dom";
import TaskForm from "../../components/tasks/task.form";
import { useGetTask } from "../../components/tasks/action";
import { useAuth } from "@/contexts/auth-provider";

export default function EditTaskPage({ type }: { type: ETask }) {
    const params = useParams();

    return (
        <ContainerLayout
            title={`Edit ${type}`}
        >
            <TaskEditForm type={type} id={params.id!} />
        </ContainerLayout>
    )
}

function TaskEditForm({ type, id }: { id: string, type: ETask }) {
    const { payload } = useAuth();
    const { data, isLoading } = useGetTask({
        id,
        options: { enabled: !!id },
    });

    if (isLoading) return <div>Loading...</div>;

    if (!data) return <Navigate to={`/${payload?.role}/tasks`} />;

    const classRoom = data.classRoom;

    return (
        <TaskForm
            taskType={type}
            taskId={id}
            type={type}
            attachments={data.attachments ?? []}
            defaultValues={{
                description: data.description,
                attachmentIds: data.attachments?.map((attachment) => attachment.id) ?? [],
                title: data.title,
                deadline: data.deadline,
                marks: data.marks ?? 0,
                subjectId: data.subject.id,
                taskType: type,
                facultyId: classRoom.faculty.id,
                classRoomId: classRoom.parent ? classRoom.parent.id : classRoom.id,
                sectionId: classRoom.parent ? classRoom.id : undefined
            }}
        />
    )
}  