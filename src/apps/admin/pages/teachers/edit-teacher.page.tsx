import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import TeacherForm from "../../components/teachers/teacher.form"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { useGetTeacher } from "../../components/teachers/actions"
import { teacherSchema } from "../../schemas/teacher.schema"

type Props = {}

export default function EditTeacherPage({ }: Props) {
    const params = useParams();

    return (
        <ContainerLayout
            title="Editing the teacher"
            description="Have some changes and save changes."
        >
            {
                !!params.id
                    ? <TeacherEditForm id={params.id} />
                    : <Navigate to="/" /> // TODO: provide a meaningful route
            }
        </ContainerLayout>
    )
}

function TeacherEditForm({ id }: { id: string }) {
    const navigate = useNavigate();

    const { data, isLoading } = useGetTeacher({
        id,
    })

    if (isLoading) return <div className="p-5">Loading the teacher info...</div>

    if (!data) navigate('/') // TODO: provide a meaningful route

    const { data: filteredValues } = teacherSchema.safeParse(data);

    return (
        <TeacherForm
            defaultValues={filteredValues}
        />
    )
}