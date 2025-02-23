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

    return (
        <TaskForm
            taskType={type}
            taskId={id}
            type={type}
            attachments={data.attachments}
            defaultValues={{
                description: data.description,
                title: data.title,
                deadline: data.deadline,
                marks: data.marks ?? 0,
                subjectId: data.subject.id,
                taskType: type,
                facultyId: data.classRooms[0]?.faculty?.id,
                classRoomId: data.classRooms[0].parent?.id
                    ? data.classRooms[0].parent?.id
                    : data.classRooms[0].id,
                sectionIds: data.classRooms[0].parent?.id
                    ? data.classRooms?.map((classRoom) => classRoom.id)
                    : [],
            }}
        />
    )
}  