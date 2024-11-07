import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import TaskForm from "../../components/tasks/task.form"
import { ETask } from "@/types/global.type"

export default function AddTaskPage({ type }: { type: ETask }) {
    return (
        <ContainerLayout
            title={`Add ${type}`}
            description={`Add a new ${type} to your school management system.`}
        >
            <TaskForm taskType={type} />
        </ContainerLayout>
    )
}