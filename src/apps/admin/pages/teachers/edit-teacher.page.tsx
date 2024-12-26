import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import TeacherForm from "../../components/teachers/teacher.form"
import { useNavigate, useParams } from "react-router-dom"
import { useGetTeacher } from "../../components/teachers/actions"
import { teacherSchema } from "../../schemas/teacher.schema"
import { useAuth } from "@/contexts/auth-provider"

type Props = {}

export default function EditTeacherPage({ }: Props) {
    const params = useParams();

    return (
        <ContainerLayout
            title="Editing the teacher"
            description="Have some changes and save changes."
        >
            <TeacherEditForm id={params.id!} />
        </ContainerLayout>
    )
}

function TeacherEditForm({ id }: { id: string }) {
    const navigate = useNavigate();
    const { payload } = useAuth();

    const { data, isLoading } = useGetTeacher({
        id,
        options: { enabled: !!id }
    })

    if (isLoading) return <div className="p-5">Loading the teacher info...</div>

    if (!data) navigate(`/${payload?.role}/teachers`)

    const { data: filteredValues } = teacherSchema.safeParse(data);

    return (
        <TeacherForm
            defaultValues={{
                ...filteredValues,
                profileImageId: data?.profileImage?.url ?? null,
            }}
        />
    )
}