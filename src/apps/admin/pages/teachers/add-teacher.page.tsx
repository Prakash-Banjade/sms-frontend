import ContainerLayout from "@/components/page-layouts/container-layout"
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