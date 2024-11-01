import ContainerLayout from "@/components/aside-layout.tsx/container-layout";
import { ETask } from "@/types/global.type";
import { Navigate, useParams } from "react-router-dom";
import TaskForm from "../../components/tasks/task.form";
import { useGetTask } from "../../components/tasks/action";

export default function EditTaskPage({ type }: { type: ETask }) {
    const params = useParams();

    if (!params.id) return <Navigate to="/admin/tasks" />;

    return (
        <ContainerLayout
            title={`Edit ${type}`}
        >
            <TaskEditForm type={type} id={params.id} />
        </ContainerLayout>
    )
}

function TaskEditForm({ type, id }: { id: string, type: ETask }) {
    const { data, isLoading } = useGetTask({
        id,
    });

    if (isLoading) return <div>Loading...</div>;

    if (!data) return <Navigate to="/admin/tasks" />;

    return (
        <TaskForm
            taskType={type}
            taskId={id}
            type={type}
            defaultValues={{
                description: data.description,
                title: data.title,
                deadline: data.deadline,
                marks: data.marks ?? 0,
                subjectId: data.subject.id,
                taskType: type,
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