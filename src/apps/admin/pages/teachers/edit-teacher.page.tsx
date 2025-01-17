import ContainerLayout from "@/components/aside-layout.tsx/container-layout"
import TeacherForm from "../../components/teachers/teacher.form"
import { useNavigate, useParams } from "react-router-dom"
import { useGetTeacher } from "../../components/teachers/actions"
import { useAuth } from "@/contexts/auth-provider"

export default function EditTeacherPage() {
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

    return (
        <TeacherForm
            defaultValues={{
                ...data,
                profileImageId: data?.profileImage?.url ?? null,
            }}
            selectedDepartments={data?.faculties.map(faculty => ({ value: faculty.id, label: faculty.name })) ?? []}
        />
    )
}