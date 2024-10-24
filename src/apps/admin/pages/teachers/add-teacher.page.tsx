import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import TeacherForm from "../../components/teachers/teacher.form"

type Props = {}

export default function AddTeacherPage({ }: Props) {
    return (
        <ContainerLayout
            title="Add a new teacher"
            description="Fill the form with the teacher details."
        >
            <TeacherForm />
        </ContainerLayout>
    )
}